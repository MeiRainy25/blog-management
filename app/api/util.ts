import { NextRequest } from "next/server";

/**
 * 生成bff层请求头, 继承cookie
 * @param req 源请求头
 * @returns
 */
export const generateBffHeaders = (req: NextRequest): HeadersInit => {
  const headers: HeadersInit = {
    Accept: "application/json",
    "Content-Type": "application/json",
  };
  const cookie = req.headers.get("cookie");
  if (cookie) {
    headers.Cookie = cookie;
  }
  return headers;
};
