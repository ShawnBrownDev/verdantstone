import { NextResponse } from "next/server";
import { getChartSeriesAction } from "@/app/actions/dashboard";

export async function GET(request: Request) {
  const url = new URL(request.url);
  const limit = Number(url.searchParams.get("limit") ?? 6);
  const points = await getChartSeriesAction(Number.isFinite(limit) ? limit : 6);
  return NextResponse.json({ points });
}
