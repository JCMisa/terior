"use server";

import { db } from "@/config/db";
import { withErrorHandling } from "../utils";
import { Users } from "@/config/schema";
import { eq } from "drizzle-orm";
import { auth } from "@clerk/nextjs/server";

// --------------------------- Helper Functions ---------------------------
const getSessionUserId = async (): Promise<string> => {
  const { userId } = await auth();
  if (!userId) throw new Error("Unauthenticated");

  return userId;
};

// --------------------------- Server Actions ---------------------------
export const getCurrentUser = withErrorHandling(async () => {
  const data = await db
    .select()
    .from(Users)
    .where(eq(Users.userId, await getSessionUserId()));

  if (data.length === 0) {
    return {
      success: false,
      data: null,
    };
  }

  return {
    success: true,
    data: data[0],
  };
});

export const getUserByEmail = withErrorHandling(async (email: string) => {
  const data = await db.select().from(Users).where(eq(Users.email, email));

  if (data.length === 0) {
    return {
      success: false,
      data: null,
    };
  }

  return {
    success: true,
    data: data[0],
  };
});
