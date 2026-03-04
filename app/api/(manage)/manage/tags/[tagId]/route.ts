import { NextRequest, NextResponse } from "next/server";
import { generateBffHeaders } from "@/app/api/util";
import { BACKEND_URL } from "@/app/api/constant";

export const PUT = async (
  req: NextRequest,
  { params }: { params: Promise<{ tagId: string }> },
) => {
  const { tagId } = await params;
  const headers: HeadersInit = generateBffHeaders(req);

  const response = await fetch(`${BACKEND_URL}/api/manage/tags/${tagId}`, {
    method: "PUT",
    headers,
    body: JSON.stringify(await req.json()),
  });

  const data = await response.json();
  return NextResponse.json(data, { status: response.status });
};

export const DELETE = async (
  req: NextRequest,
  { params }: { params: Promise<{ tagId: string }> },
) => {
  const { tagId } = await params;
  const headers: HeadersInit = generateBffHeaders(req);

  const response = await fetch(`${BACKEND_URL}/api/manage/tags/${tagId}`, {
    method: "DELETE",
    headers,
  });

  const data = await response.json();
  return NextResponse.json(data, { status: response.status });
};
