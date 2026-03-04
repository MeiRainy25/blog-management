import { NextRequest, NextResponse } from "next/server";
import { generateBffHeaders } from "../../../util";
import { BACKEND_URL } from "../../../constant";

export const GET = async (req: NextRequest) => {
  const headers: HeadersInit = generateBffHeaders(req);
  const query = req.nextUrl.search;
  const response = await fetch(`${BACKEND_URL}/api/manage/tags${query}`, {
    method: "GET",
    headers,
  });
  const data = await response.json();
  return NextResponse.json(data, { status: response.status });
};

export const POST = async (req: NextRequest) => {
  const headers: HeadersInit = generateBffHeaders(req);
  const body = await req.json();

  const response = await fetch(`${BACKEND_URL}/api/manage/tags`, {
    method: "POST",
    body: JSON.stringify(body),
    headers,
  });

  const data = await response.json();
  return NextResponse.json(data, { status: response.status });
};
