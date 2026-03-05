import { NextRequest, NextResponse } from "next/server";
import { BACKEND_URL } from "@/app/api/constant";

export const GET = async (
  req: NextRequest,
  { params }: { params: Promise<{ userId: string }> },
) => {
  const { userId } = await params;

  const headers: HeadersInit = {
    Accept: "application/json",
    "Content-Type": "application/json",
  };
  const cookie = req.headers.get("cookie");
  if (cookie) {
    headers.Cookie = cookie;
  }

  const response = await fetch(`${BACKEND_URL}/api/manage/users/${userId}`, {
    method: "GET",
    headers,
  });

  const data = await response.json();
  return NextResponse.json(data, {
    status: response.status,
  });
};

export const PUT = async (
  req: NextRequest,
  { params }: { params: Promise<{ userId: string }> },
) => {
  const { userId } = await params;

  const headers: HeadersInit = {
    Accept: "application/json",
    "Content-Type": "application/json",
  };
  const cookie = req.headers.get("cookie");
  if (cookie) {
    headers.Cookie = cookie;
  }

  const response = await fetch(`${BACKEND_URL}/api/manage/users/${userId}`, {
    method: "PUT",
    headers,
    body: JSON.stringify(await req.json()),
  });

  const data = await response.json();

  return NextResponse.json(data, {
    status: response.status,
  });
};

export const DELETE = async (
  req: NextRequest,
  { params }: { params: Promise<{ userId: string }> },
) => {
  const { userId } = await params;

  const headers: HeadersInit = {
    Accept: "application/json",
    "Content-Type": "application/json",
  };
  const cookie = req.headers.get("cookie");
  if (cookie) {
    headers.Cookie = cookie;
  }

  const response = await fetch(`${BACKEND_URL}/api/manage/users/${userId}`, {
    method: "DELETE",
    headers,
  });

  const data = await response.json();

  return NextResponse.json(data, {
    status: response.status,
  });
};
