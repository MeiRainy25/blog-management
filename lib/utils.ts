import { clsx, type ClassValue } from "clsx";
import { toast } from "sonner";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export interface openFileUploaderProps {
  callback: (file: File) => void;
  sizeLimit?: number;
  typeLimit?: string[];
}
/**
 * 显示文件上传对话框
 * @param callback 上传文件后执行的回调函数
 * @param sizeLimit 可选，文件大小限制，单位为字节
 * @param typeLimit 可选，文件类型限制
 */
export function openFileUploader({
  callback,
  sizeLimit,
  typeLimit,
}: openFileUploaderProps) {
  const input = document.createElement("input");
  input.type = "file";
  input.style = "display: none;";
  input.accept = typeLimit?.join(", ") ?? "";
  input.onchange = (e) => {
    const file = (e.target as HTMLInputElement).files?.[0];
    if (file) {
      if (sizeLimit && file.size > sizeLimit) {
        toast.error(`文件大小不能超过 ${sizeLimit} B`);
        return;
      }
      callback(file);
    }
  };
  input.click();
}
