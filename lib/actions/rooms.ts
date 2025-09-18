"use server";

import { auth } from "@clerk/nextjs/server";
import { doesTitleMatch, withErrorHandling } from "../utils";
import { db } from "@/config/db";
import { Rooms, Users } from "@/config/schema";
import { getCurrentUser } from "./users";
import { and, eq, sql } from "drizzle-orm";
import { revalidatePath } from "next/cache";

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

export const getRoom = withErrorHandling(async (roomId: number) => {
  const isAuthenticated = await getSessionUserId();
  const user = await getCurrentUser();

  if (!isAuthenticated && !user) {
    return {
      success: false,
      data: null,
      error: "Unauthenticated",
    };
  }

  const [data] = await db
    .select()
    .from(Rooms)
    .where(eq(Rooms.id, roomId))
    .limit(1);

  if (data) {
    return {
      data: data,
      success: true,
    };
  }
  return {
    data: null,
    success: false,
    error: "No room found",
  };
});

export const getUserRooms = withErrorHandling(async () => {
  const isAuthenticated = await getSessionUserId();
  const user = await getCurrentUser();

  if (!isAuthenticated && !user) {
    return {
      success: false,
      data: null,
      error: "Unauthenticated",
    };
  }

  const data = await db
    .select()
    .from(Rooms)
    .where(eq(Rooms.createdBy, user.data?.email as string));

  if (data) {
    return {
      data: data,
      latest: data[0],
      success: true,
    };
  }
  return {
    data: [],
    success: false,
    error: "No room found for this user",
  };
});

export const updateRoomName = withErrorHandling(
  async (roomId: number, updatedRoomName: string) => {
    const isAuthenticated = await getSessionUserId();
    const user = await getCurrentUser();

    if (!isAuthenticated && !user) {
      return {
        success: false,
        data: null,
        error: "Unauthenticated",
      };
    }

    const [data] = await db
      .update(Rooms)
      .set({
        roomName: updatedRoomName,
        updatedAt: new Date(),
      })
      .where(eq(Rooms.id, roomId))
      .returning({ roomName: Rooms.roomName });

    if (data) {
      revalidatePath(`/user-dashboard/room/${roomId}`);
      return {
        data: data.roomName,
        success: true,
      };
    }
    return {
      data: null,
      success: false,
      error: "No room found",
    };
  }
);

export const updateRoomDescription = withErrorHandling(
  async (
    roomId: number,
    field: "originalRoomDescription" | "redesignedRoomDescription",
    value: string
  ) => {
    const user = await getCurrentUser();
    if (!user.success) return { success: false, error: "Unauthorized" };

    await db
      .update(Rooms)
      .set({ [field]: value, updatedAt: new Date() })
      .where(eq(Rooms.id, roomId));

    revalidatePath(`/rooms/${roomId}`);
    return { success: true };
  }
);

export const setPublicAction = withErrorHandling(
  async (roomId: number, public_: boolean) => {
    const user = await getCurrentUser();
    if (!user.success) return { success: false, error: "Unauthorized" };

    await db
      .update(Rooms)
      .set({ public: public_, updatedAt: new Date() })
      .where(eq(Rooms.id, roomId));

    revalidatePath(`/rooms/${roomId}`);
    return { success: true };
  }
);

const roomWithUserInfo = () =>
  db
    .select({
      room: Rooms,
      user: {
        id: Users.id,
        name: Users.name,
        image: Users.image,
        email: Users.email,
      },
    })
    .from(Rooms)
    .leftJoin(Users, eq(Rooms.createdBy, Users.email));

export const getAllRooms = withErrorHandling(
  async (
    searchQuery: string = "",
    pageNumber: number = 1,
    pageSize: number = 4
  ) => {
    const user = await getCurrentUser();
    if (!user.success && !user.data)
      return { success: false, error: "Unauthorized" };

    const canSeeRooms = eq(Rooms.public, true);

    const whereCondition = searchQuery.trim()
      ? and(canSeeRooms, doesTitleMatch(Rooms, searchQuery))
      : canSeeRooms;

    // Total count for pagination
    const [{ totalCount }] = await db
      .select({ totalCount: sql<number>`count(*)` })
      .from(Rooms)
      .where(whereCondition);
    const totalRooms = Number(totalCount || 0);
    const totalPages = Math.ceil(totalRooms / pageSize);

    // Fetch paginated, sorted results
    const roomRecords = await roomWithUserInfo()
      .where(whereCondition)
      .orderBy(sql`${Rooms.createdAt} DESC`)
      .limit(pageSize)
      .offset((pageNumber - 1) * pageSize);

    return {
      rooms: roomRecords,
      pagination: {
        currentPage: pageNumber,
        totalPages,
        totalRooms,
        pageSize,
      },
    };
  }
);
