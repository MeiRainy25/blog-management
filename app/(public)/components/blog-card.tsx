"use client";

import { TBlogData, TTag } from "@/app/api/query";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardAction,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import dayjs from "dayjs";
import { useRouter } from "next/navigation";
import React from "react";

export interface BlogCardProps {
  blog: TBlogData;
}

export default function BlogCard(props: BlogCardProps) {
  const router = useRouter();
  const { blog } = props;

  const tags = blog.tags;
  const isShowTag = blog.tags?.length > 0;

  return (
    <Card
      className={
        "cursor-pointer hover:shadow-lg dark:hover:shadow-lg transition-shadow"
      }
      onClick={() => router.push(`/blogs/${blog.id}`)}
    >
      <CardHeader>
        <CardAction>
          {isShowTag ? <TagBadge tags={tags} showTagsNumber={3} /> : null}
        </CardAction>
        <CardTitle className={"line-clamp-2"}>{blog.title}</CardTitle>
      </CardHeader>
      <CardContent>
        <span className={"text-muted-foreground"}>{blog.author.nickname}</span>
        <span className={"text-xs text-muted-foreground ml-2"}>
          更新于 {dayjs(blog.updatedAt).format("YYYY-MM-DD HH:mm")}
        </span>
      </CardContent>
    </Card>
  );
}

export interface TagBadgeProps {
  tags: TTag[];
  showTagsNumber?: number;
  variant?: React.ComponentProps<typeof Badge>["variant"];
}
export function TagBadge(props: TagBadgeProps) {
  const { tags, showTagsNumber = 1, variant } = props;

  const isShowMoreTags = tags.length > showTagsNumber;
  const moreTagsNumber = tags.length - showTagsNumber;
  const displayTags = tags.slice(0, showTagsNumber);

  return (
    <div className={"flex items-center gap-4"}>
      {displayTags.map((tag) => (
        <Badge key={tag.id} variant={variant}>
          {tag.name}
        </Badge>
      ))}
      <Badge variant={variant} hidden={!isShowMoreTags}>
        +{moreTagsNumber}
      </Badge>
    </div>
  );
}
