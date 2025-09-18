import { NextResponse } from "next/server";
import { getUserRoomsPerMonth } from "@/lib/actions/analytics";

export async function GET() {
  const res = await getUserRoomsPerMonth();
  if (!res.success)
    return NextResponse.json({ error: res.error }, { status: 401 });
  return NextResponse.json(res.data);
}
