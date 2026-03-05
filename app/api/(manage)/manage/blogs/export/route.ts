import { BACKEND_URL } from "@/app/api/constant";
import { generateBffHeaders } from "@/app/api/util";
import { NextRequest, NextResponse } from "next/server";

export const POST = async (req: NextRequest) => {
  const body = await req.json();
  const headers = generateBffHeaders(req);

  const upstream = await fetch(`${BACKEND_URL}/api/manage/blogs/export`, {
    method: "POST",
    body: JSON.stringify(body),
    headers: {
      "Content-Type": "application/json",
      ...headers,
    },
  });

  const resHeaders = new Headers();

  const contentType = upstream.headers.get("content-type");
  if (contentType) {
    resHeaders.set("content-type", contentType);
  }

  const contentDisposition = upstream.headers.get("content-disposition");
  if (contentDisposition) {
    resHeaders.set("content-disposition", contentDisposition);
  }

  const contentLength = upstream.headers.get("content-length");
  if (contentLength) {
    resHeaders.set("content-length", contentLength);
  }

  return new NextResponse(upstream.body, {
    status: upstream.status,
    headers: resHeaders,
  });
};
