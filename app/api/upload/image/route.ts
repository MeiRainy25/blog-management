import { NextRequest, NextResponse } from "next/server";
import FormData from "form-data";

export const POST = async (req: NextRequest) => {
  const formData = await req.formData();
  const file = formData.get("file") as File;

  const arrayBuffer = await file.arrayBuffer();
  const buffer = Buffer.from(arrayBuffer);
  const key = `image/${crypto.randomUUID()}.${file.type.split("/")[1]}`;
  const uploadForm = new FormData();
  uploadForm.append("image", buffer, {
    filename: key,
    contentType: file.type,
  });

  const response = await fetch(`https://img.scdn.io/api/v1.php`, {
    method: "POST",
    body: uploadForm as any,
    headers: {
      ...uploadForm.getHeaders(),
    },
  });

  const data = await response.json();
  return NextResponse.json(data, { status: response.status });
};
