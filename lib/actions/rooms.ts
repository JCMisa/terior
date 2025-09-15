"use server";

import { auth } from "@clerk/nextjs/server";
import { withErrorHandling } from "../utils";
import { db } from "@/config/db";
import { Rooms, Users } from "@/config/schema";
import { getCurrentUser } from "./users";
import { eq, sql } from "drizzle-orm";

// --------------------------- Helper Functions ---------------------------
const getSessionUserId = async (): Promise<string> => {
  const { userId } = await auth();
  if (!userId) throw new Error("Unauthenticated");

  return userId;
};

export const createRoom = withErrorHandling(
  async (
    roomName: string,
    userPrompt?: string,
    originalImageUrl?: string,
    originalRoomDescription?: string,
    redesignedImageUrl?: string,
    redesignedRoomDescription?: string
  ) => {
    const isAuthenticated = await getSessionUserId();
    const user = await getCurrentUser();

    if (!isAuthenticated && !user) {
      return {
        success: false,
        data: null,
        error: "Unauthenticated",
      };
    }

    const batchResponse = await db.batch([
      db
        .insert(Rooms)
        .values({
          createdBy: user.data ? user.data.email : "",
          roomName: roomName,
          userPrompt: userPrompt || "",
          originalImageUrl: originalImageUrl || "",
          originalRoomDescription: originalRoomDescription || "",
          redesignedImageUrl: redesignedImageUrl || "",
          redesignedRoomDescription: redesignedRoomDescription || "",
        })
        .returning({
          insertedRoomName: Rooms.roomName,
          insertedRoomId: Rooms.id,
        }),
      db
        .update(Users)
        .set({
          credits: sql`${Users.credits} - 1`,
        })
        .where(eq(Users.email, user.data?.email as string)),
    ]);

    if (batchResponse && batchResponse.length === 2) {
      const [insertResult] = batchResponse[0];
      const updateResult = batchResponse[1];

      if (insertResult && updateResult) {
        return {
          data: insertResult.insertedRoomName,
          roomId: insertResult.insertedRoomId,
          success: true,
        };
      }
    }
  }
);
