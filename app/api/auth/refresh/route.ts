import { NextRequest, NextResponse } from "next/server";
import { BACKEND_URL } from "../../constant";

export const POST = async (req: NextRequest) => {
  const headers: HeadersInit = {
    "Content-Type": "application/json",
    Accept: "application/json",
  };

  const cookie = req.headers.get("cookie") ?? "";
  if (cookie) {
    headers.Cookie = cookie;
  }

  const response = await fetch(`${BACKEND_URL}/api/auth/refresh`, {
    method: "POST",
    headers,
  });

  const res = NextResponse.json(
    {},
    {
      status: response.status,
    },
  );

  const setCookie = response.headers.get("set-cookie");
  if (setCookie) {
    res.headers.set("set-cookie", setCookie);
  }
  return res;
};
