import { NextRequest, NextResponse } from "next/server";
import { BACKEND_URL } from "../../constant";

export const GET = async (req: NextRequest) => {
  const headers: HeadersInit = {
    Accept: "application/json",
    "Content-Type": "application/json",
  };
  const cookie = req.headers.get("cookie");
  if (cookie) {
    headers.Cookie = cookie;
  }

  const response = await fetch(`${BACKEND_URL}/api/manage/blogs`, {
    method: "GET",
    headers,
  });

  const data = await response.json();
  return NextResponse.json(data, { status: response.status });
};

export const POST = async (req: NextRequest) => {
  const headers: HeadersInit = {
    Accept: "application/json",
    "Content-Type": "application/json",
  };
  const cookie = req.headers.get("cookie");
  if (cookie) {
    headers.Cookie = cookie;
  }

  const body = await req.json();
  console.log(body);
  const response = await fetch(`${BACKEND_URL}/api/manage/blogs`, {
    method: "POST",
    body: JSON.stringify(body),
    headers,
  });

  const data = await response.json();
  return NextResponse.json(data, { status: response.status });
};
