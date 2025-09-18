"use server";

import { eq, sql, and, gte, lte } from "drizzle-orm";
import { getCurrentUser } from "@/lib/actions/users"; // your Clerk helper
import { withErrorHandling } from "@/lib/utils";
import { db } from "@/config/db";
import { Rooms } from "@/config/schema";

/**
 * Returns an array with 12 objects:
 * { month: "January", count: 0 }, …
 * for the CURRENT year and CURRENT user.
 */
export const getUserRoomsPerMonth = withErrorHandling(async () => {
  const user = await getCurrentUser();
  if (!user.success) return { success: false, error: "Unauthorized" };

  const year = new Date().getFullYear();

  // build start/end timestamps for the year
  const start = new Date(year, 0, 1); // Jan 1, 00:00:00
  const end = new Date(year + 1, 0, 1); // Jan 1 next year

  // raw SQL to group by month
  const rows = await db
    .select({
      month: sql`EXTRACT(MONTH FROM ${Rooms.createdAt})`.mapWith(Number),
      count: sql`COUNT(*)`.mapWith(Number),
    })
    .from(Rooms)
    .where(
      and(
        eq(Rooms.createdBy, user.data!.email),
        gte(Rooms.createdAt, start),
        lte(Rooms.createdAt, end)
      )
    )
    .groupBy(sql`EXTRACT(MONTH FROM ${Rooms.createdAt})`);

  // build 12-month skeleton
  const months = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];

  const map = new Map<number, number>();
  rows.forEach((r) => map.set(r.month, r.count));

  const chartData = months.map((name, idx) => ({
    month: name,
    rooms: map.get(idx + 1) ?? 0,
  }));

  return { success: true, data: chartData };
});
