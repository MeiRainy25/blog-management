import { NextRequest, NextResponse } from "next/server";
import { BACKEND_URL } from "@/app/api/constant";

export const GET = async (req: NextRequest) => {
  const headers: HeadersInit = {
    Accept: "application/json",
    "Content-Type": "application/json",
  };

  const query = req.nextUrl.search;
  const response = await fetch(`${BACKEND_URL}/api/blogs${query}`, {
    method: "GET",
    headers,
  });

  const data = await response.json();
  return NextResponse.json(data, { status: response.status });
};
