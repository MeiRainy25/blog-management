"use client";

import React from "react";
import { DataTable } from "../components/table";
import { keepPreviousData, useMutation, useQuery } from "@tanstack/react-query";
import { deleteBlog, getBlogs, TBlogData, TTag } from "@/app/api/query";
import { ColumnDef, Row } from "@tanstack/react-table";
import dayjs from "dayjs";
import {
  DropdownButton,
  TDropdownButtonEvent,
} from "../components/dropdown-button";
import {
  CircleEllipsis,
  CirclePlus,
  RotateCcw,
  SquarePen,
  Trash,
  Upload,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { Badge } from "@/components/ui/badge";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";

export default function BlogsPage() {
  const router = useRouter();

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
    queryKey: ["blogs", pagination.current, pagination.pageSize],
    queryFn: () =>
      getBlogs({
        page: pagination.current,
        pageSize: pagination.pageSize,
      }),
    placeholderData: keepPreviousData,
  });

  const { mutate: delBlog, isPending: isDeleting } = useMutation({
    mutationFn: (id: string) => deleteBlog(id),
    onSuccess: () => {
      refetch();
    },
  });

  const actions = (row: Row<TBlogData>) => {
    const events: TDropdownButtonEvent[] = [
      {
        title: "编辑",
        icon: <SquarePen />,
        onClick: () => router.push(`/manage/blogs/${row.original.id}`),
      },
      {
        title: "删除",
        icon: <Trash />,
        onClick: () => delBlog(row.original.id),
      },
    ];

    return (
      <DropdownButton events={events}>
        <CircleEllipsis />
      </DropdownButton>
    );
  };

  const columns: ColumnDef<TBlogData>[] = [
    {
      header: () => {
        return <span>{"ID"}</span>;
      },
      accessorKey: "id",
    },
    {
      header: "标题",
      accessorKey: "title",
    },
    {
      header: "标签",
      accessorKey: "tags",
      size: 80,
      cell: ({ getValue }) => {
        const value = getValue() as TTag[];

        if (value.length === 0) return null;

        return (
          <div className={"flex items-center gap-2"}>
            <Badge
              style={{ backgroundColor: value[0]?.color }}
              className={"rounded-md text-primary-foreground select-none"}
            >
              {value[0].name}
            </Badge>

            <Tooltip>
              <TooltipTrigger asChild>
                <span
                  hidden={value.length <= 1}
                  className={
                    "inline-flex items-center justify-center w-6 h-6 rounded-full border bg-muted text-muted-foreground select-none"
                  }
                >
                  {value.length > 1 && `+${value.length - 1}`}
                </span>
              </TooltipTrigger>
              <TooltipContent className={"flex items-center gap-2"}>
                {value.slice(1).map((tag) => (
                  <Badge
                    key={tag.id}
                    style={{ backgroundColor: tag.color }}
                    className={
                      "rounded-md text-primary-foreground select-none z-1"
                    }
                  >
                    {tag.name}
                  </Badge>
                ))}
              </TooltipContent>
            </Tooltip>
          </div>
        );
      },
    },
    {
      header: "作者",
      accessorKey: "author.nickname",
    },
    {
      header: "上传于",
      accessorKey: "createdAt",
      cell: ({ getValue }) => {
        const value = getValue();
        return (
          <span>{dayjs(value as Date).format("YYYY-MM-DD HH:mm:ss")}</span>
        );
      },
    },
    {
      header: "最近更新于",
      accessorKey: "updatedAt",
      cell: ({ getValue }) => {
        const value = getValue();
        return (
          <span>{dayjs(value as Date).format("YYYY-MM-DD HH:mm:ss")}</span>
        );
      },
    },
    {
      header: "操作",
      cell: ({ row }) => {
        return actions(row);
      },
      size: 50,
      minSize: 50,
    },
  ];

  return (
    <div className={"h-full w-full flex flex-col gap-2"}>
      <div className={"flex items-center justify-between"}>
        <p className={"font-bold text-lg"}>博客列表</p>
        <div className={"flex items-center gap-2"}>
          <Button size="lg" className={"text-md"} onClick={() => refetch()}>
            <RotateCcw />
          </Button>
          <Button
            size={"lg"}
            className={"text-md"}
            onClick={() => router.push("/manage/blogs/new")}
          >
            <CirclePlus className={"mr-1"} />
            新建博客
          </Button>
          <Button size={"lg"} className={"text-md"}>
            <Upload className={"mr-1"} />
            上传博客
          </Button>
        </div>
      </div>
      <DataTable
        loading={isFetching || isPending || isDeleting}
        data={blogsData?.data ?? []}
        columns={columns}
        pagination={{
          current: pagination.current,
          pageSize: pagination.pageSize,
          onChange: (page, pageSize) => {
            console.log(page, pageSize);
            setPagination((prev) => ({
              ...prev,
              current: page,
              pageSize,
            }));
          },
          total: blogsData?.total ?? 0,
        }}
      />
    </div>
  );
}
