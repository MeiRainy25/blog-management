import request from "@/lib/request";

type UploadImageResponse = {
  url: string;
  success: boolean;
  message: string;
};

export async function uploadImage(data: FormData) {
  return await request.post<UploadImageResponse>("/api/upload/image", {
    data,
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
}
