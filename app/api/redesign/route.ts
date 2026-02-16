export const maxDuration = 90;

import { google } from "@ai-sdk/google";
import { generateText } from "ai";
import { z } from "zod";
import { NextRequest, NextResponse } from "next/server";
import { uploadFromBlob } from "@/lib/cloudinary";

/* ---------- schemas ---------- */
const bodySchema = z.object({
  imageUrl: z.string().url(),
  roomName: z.string().min(1),
  userPrompt: z.string().optional(),
});
const roomCheckSchema = z.object({ isRoom: z.boolean() });

type ErrorOut = { ok: false; error: string };

/* ---------- prompts ---------- */
const isRoomPrompt =
  "Answer ONLY with a single line of valid JSON and no other text:\n" +
  '{"isRoom":<boolean>}.\n' +
  "Analyse the image and decide if it is an indoor room (bedroom, kitchen, etc.). " +
  'Non-rooms (cars, dogs, people) must return {"isRoom":false}.\n\n' +
  "Respond ONLY with the JSON object, no markdown, no explanation.";

const describePrompt =
  "Describe this interior in one concise paragraph. " +
  "Include: overall style, main furniture pieces, location of the furnitures, wall & floor finishes, lighting type, approximate size, dominant colours, and noticeable decorative elements.";

const redesignInstruction: (
  roomName: string,
  userPrompt: string,
  description: string,
) => string = (roomName: string, userPrompt: string, description: string) =>
  `Professional architectural photography of a ${roomName}, ${description}, ` +
  (userPrompt ? `${userPrompt}, ` : "") +
  "high-end interior design, natural lighting, photorealistic, 8k resolution, architectural digest style, sharp focus";

/* ---------- handler ---------- */
export async function POST(req: NextRequest) {
  try {
    const parseResult = bodySchema.safeParse(await req.json());
    if (!parseResult.success) {
      console.error("[redesign] Invalid body:", parseResult.error.flatten());
      return NextResponse.json<ErrorOut>(
        { ok: false, error: "Invalid body" },
        { status: 400 },
      );
    }

    const { imageUrl, roomName, userPrompt = "" } = parseResult.data;

    /* 1.  room check */
    let checkRaw: string;
    try {
      const result = await generateText({
        model: google("gemini-2.5-flash"),
        messages: [
          {
            role: "user",
            content: [
              { type: "text", text: isRoomPrompt },
              { type: "image", image: imageUrl },
            ],
          },
        ],
      });
      checkRaw = result.text;
    } catch (e) {
      console.error("[redesign] Room check (generateText) failed:", e);
      throw e;
    }
    const cleaned = checkRaw.trim().replace(/^```json\s*|```$/g, "");
    let isRoom: boolean;
    try {
      isRoom = roomCheckSchema.parse(JSON.parse(cleaned)).isRoom;
    } catch (e) {
      console.error("[redesign] Room check parse failed. Raw:", checkRaw, e);
      isRoom = true; // Fallback
    }
    if (!isRoom) {
      console.error("[redesign] Image is not a room (NOT_A_ROOM)");
      return NextResponse.json<ErrorOut>(
        { ok: false, error: "NOT_A_ROOM" },
        { status: 400 },
      );
    }

    /* 2.  describe */
    let description: string;
    try {
      const result = await generateText({
        model: google("gemini-2.5-flash"),
        messages: [
          {
            role: "user",
            content: [
              { type: "text", text: describePrompt },
              { type: "image", image: imageUrl },
            ],
          },
        ],
      });
      description = result.text;
    } catch (e) {
      console.error("[redesign] Describe (generateText) failed:", e);
      throw e;
    }

    /* 3.  redesign prompt */
    const redesignPrompt = redesignInstruction(
      roomName,
      userPrompt,
      description,
    );

    /* 4.  Cloudflare Workers AI (FREE TIER - 10k neurons/day) */
    console.log("[redesign] Generating with Cloudflare AI...");

    const accountId = process.env.CLOUDFLARE_ACCOUNT_ID;
    const apiToken = process.env.CLOUDFLARE_API_TOKEN;

    if (!accountId || !apiToken) {
      throw new Error(
        "Cloudflare credentials not configured. Check CLOUDFLARE_ACCOUNT_ID and CLOUDFLARE_API_TOKEN",
      );
    }

    const cfRes = await fetch(
      `https://api.cloudflare.com/client/v4/accounts/${accountId}/ai/run/@cf/stabilityai/stable-diffusion-xl-base-1.0`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${apiToken}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          prompt: redesignPrompt,
          num_steps: 20,
          guidance: 7.5,
        }),
      },
    );

    // validations
    if (!cfRes.ok) {
      const errorText = await cfRes.text();
      console.error(
        "[redesign] Cloudflare AI failed:",
        cfRes.status,
        errorText,
      );

      if (cfRes.status === 401) {
        throw new Error(
          "Authentication failed: Check your CLOUDFLARE_API_TOKEN",
        );
      } else if (cfRes.status === 403) {
        throw new Error(
          "Permission denied: Ensure your token has Workers AI:Read permission",
        );
      } else if (cfRes.status === 429) {
        throw new Error(
          "Rate limit exceeded: You've used your daily 10k neurons quota",
        );
      }

      throw new Error(
        `Image generation failed: ${cfRes.status} - ${errorText}`,
      );
    }

    // ✅ FIXED: SDXL returns binary PNG data directly, not JSON!
    const redesignedBlob = await cfRes.blob();
    console.log(
      "[redesign] Generated image size:",
      redesignedBlob.size,
      "bytes",
    );

    /* 5.  upload both images → Cloudinary */
    let originalUrl: string;
    let redesignedUrl: string;
    try {
      const [origBlob] = await Promise.all([
        fetch(imageUrl).then((r) => {
          if (!r.ok)
            throw new Error(
              `Fetch original image failed: ${r.status} ${r.statusText}`,
            );
          return r.blob();
        }),
        Promise.resolve(redesignedBlob),
      ]);
      [originalUrl, redesignedUrl] = await Promise.all([
        uploadFromBlob(origBlob, "original"),
        uploadFromBlob(redesignedBlob, "redesigned"),
      ]);
    } catch (e) {
      console.error("[redesign] Upload (fetch or Cloudinary) failed:", e);
      throw e;
    }

    return NextResponse.json({
      ok: true,
      originalUrl,
      redesignedUrl,
      description,
      redesignPrompt,
    });
  } catch (e) {
    console.error("[redesign] Unhandled error:", e);
    const message = e instanceof Error ? e.message : "Unknown server error";
    return NextResponse.json<ErrorOut>(
      { ok: false, error: message },
      { status: 500 },
    );
  }
}
