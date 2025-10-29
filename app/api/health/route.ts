import { NextResponse } from "next/server";
import { initializeDatabase } from "@/lib/mongodb";

export async function GET() {
  await initializeDatabase();
  return NextResponse.json({ status: "ok" });
}