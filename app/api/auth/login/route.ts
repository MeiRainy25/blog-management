import { NextRequest, NextResponse } from "next/server";
import { BACKEND_URL } from "../../constant";

export const POST = async (req: NextRequest) => {
  const body = await req.json();

  const response = await fetch(`${BACKEND_URL}/api/auth/login`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(body),
  });

  const data = await response.json();
  const res = NextResponse.json(data, {
    status: response.status,
  });

  // 透传Cookie内容
  const setCookie = response.headers.get("set-cookie");
  if (setCookie) {
    res.headers.set("set-cookie", setCookie);
  }

  return res;
};
