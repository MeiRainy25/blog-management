"use client";
import { cn } from "@/lib/utils";
import { keepPreviousData, useQuery } from "@tanstack/react-query";
import React from "react";
import { getPublicBlogs } from "@/app/api/query";
import BlogCard from "@/app/(public)/components/blog-card";
import Pagination from "@/app/(public)/components/pagination";

export default function BlogMain() {
  const [pagination, setPagination] = React.useState({
    current: 1,
    pageSize: 10,
  });

  const {
    isPending,
    data: blogsData,
    isFetching,
    refetch,
  } = useQuery({
    queryKey: ["pub-blogs", pagination.current, pagination.pageSize],
    queryFn: () =>
      getPublicBlogs({
        page: pagination.current,
        pageSize: pagination.pageSize,
      }),
    placeholderData: keepPreviousData,
  });
  const total = blogsData?.total ?? 0;
  const pages = Math.floor(total / pagination.pageSize) + 1;

  return (
    <div className={cn("flex flex-col w-full h-full gap-8", "px-48")}>
      <div className={cn("flex items-center justify-center", "min-h-64")}>
        <span className={"text-4xl font-bold pointer-events-none select-none"}>
          欢迎回来
        </span>
      </div>

      <div className={"flex gap-8"}>
        <div className={"flex-1 flex flex-col gap-8"}>
          <div className="flex flex-col gap-4">
            {blogsData?.data.map((blog) => (
              <BlogCard key={blog.id} blog={blog} />
            ))}
          </div>
          <div className={"flex items-center justify-end"}>
            <Pagination
              totalPage={pages}
              value={pagination}
              onChange={setPagination}
            />
          </div>
        </div>
        <div className={"w-60"}>信息, tag, 小图表 ,最近更新等小组件</div>
      </div>
    </div>
  );
}
