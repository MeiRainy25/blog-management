"use client";

import { TBlogDetail } from "@/app/api/query";
import Editor, { JSONContent } from "@/components/editor";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import dayjs from "dayjs";
import { ArrowLeft } from "lucide-react";
import { useRouter } from "next/navigation";
export interface PublicBlogDetailProps {
  blog: TBlogDetail;
}

export function PublicBlogDetail({ blog }: PublicBlogDetailProps) {
  const router = useRouter();

  return (
    <div className={"flex flex-col gap-8 w-full h-full px-48"}>
      <div className={"flex flex-col gap-2"}>
        <div className={"flex items-center"}>
          <Button
            variant={"outline"}
            className={"cursor-pointer p-2"}
            onClick={() => router.back()}
            title={"返回"}
          >
            <ArrowLeft />
          </Button>
        </div>
        <div className={"flex flex-col select-none"}>
          <h1 className={"text-3xl font-bold leading-[1.1]"}>{blog.title}</h1>
          <p
            className={cn(
              "text-sm text-muted-foreground",
              "flex items-center gap-4",
            )}
          >
            <span title={`作者: ${blog.author.nickname}`}>
              作者: {blog.author.nickname}
            </span>
            <span
              title={`发布时间: ${dayjs(blog.createdAt).format("YYYY-MM-DD HH:mm")}`}
            >
              发布时间: {dayjs(blog.createdAt).format("YYYY-MM-DD HH:mm")}
            </span>
            <span
              title={`最近更新: ${dayjs(blog.updatedAt).format("YYYY-MM-DD HH:mm")}`}
            >
              最近更新: {dayjs(blog.updatedAt).format("YYYY-MM-DD HH:mm")}
            </span>
          </p>
        </div>
      </div>

      <Editor value={blog.content as JSONContent} editable={false} />
    </div>
  );
}
