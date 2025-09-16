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
  'Non-rooms (cars, dogs, people) must return {"isRoom":false}.';

const describePrompt =
  "Describe this interior in one concise paragraph. " +
  "Include: overall style, main furniture pieces, location of the furnitures, wall & floor finishes, lighting type, approximate size, dominant colours, and noticeable decorative elements.";

const redesignInstruction = (
  roomName: string,
  userPrompt: string,
  description: string
) =>
  `You are an award-winning interior designer. ` +
  `Redesign the room described below for "${roomName}". ` +
  (userPrompt ? `User request: ${userPrompt}. ` : "") +
  `Maintain the existing layout where possible. ` +
  `Output a single vivid paragraph (max 120 words) that an image-generation model can render. ` +
  `Include: style, key furniture, materials, colour palette, lighting, and ambience. ` +
  `Room: ${description}`;

/* ---------- handler ---------- */
export async function POST(req: NextRequest) {
  try {
    const parseResult = bodySchema.safeParse(await req.json());
    if (!parseResult.success)
      return NextResponse.json<ErrorOut>(
        { ok: false, error: "Invalid body" },
        { status: 400 }
      );

    const { imageUrl, roomName, userPrompt = "" } = parseResult.data;

    /* 1.  room check */
    const { text: checkRaw } = await generateText({
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
    const cleaned = checkRaw.trim().replace(/^```json\s*|```$/g, "");
    const { isRoom } = roomCheckSchema.parse(JSON.parse(cleaned));
    if (!isRoom)
      return NextResponse.json<ErrorOut>(
        { ok: false, error: "NOT_A_ROOM" },
        { status: 400 }
      );

    /* 2.  describe */
    const { text: description } = await generateText({
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

    /* 3.  redesign prompt */
    const redesignPrompt = redesignInstruction(
      roomName,
      userPrompt,
      description
    );
    const { text: redesigned } = await generateText({
      model: google("gemini-2.5-flash"),
      prompt: redesignPrompt,
    });

    /* 4.  SD3 diffusion */
    const hfRes = await fetch(
      "https://api-inference.huggingface.co/models/stabilityai/stable-diffusion-3-medium-diffusers",
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${process.env.HF_TOKEN!}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ inputs: redesigned }),
      }
    );
    if (!hfRes.ok) throw new Error("HF diffusion failed");
    const redesignedBlob = await hfRes.blob();

    /* 5.  upload both images → Cloudinary */
    const [originalUrl, redesignedUrl] = await Promise.all([
      uploadFromBlob(await fetch(imageUrl).then((r) => r.blob()), "original"),
      uploadFromBlob(redesignedBlob, "redesigned"),
    ]);

    return NextResponse.json({
      ok: true,
      originalUrl,
      redesignedUrl,
      description,
      redesigned,
    });
  } catch (e) {
    const message = e instanceof Error ? e.message : "Unknown server error";
    return NextResponse.json<ErrorOut>(
      { ok: false, error: message },
      { status: 500 }
    );
  }
}
