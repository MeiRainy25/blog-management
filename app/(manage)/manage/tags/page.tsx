"use client";

import { deleteTag, getTags, TTag } from "@/app/api/query";
import { Button } from "@/components/ui/button";
import { keepPreviousData, useMutation, useQuery } from "@tanstack/react-query";
import { ColumnDef, Row } from "@tanstack/react-table";
import dayjs from "dayjs";
import {
  CircleEllipsis,
  CirclePlus,
  RotateCcw,
  SquarePen,
  Trash,
} from "lucide-react";
import { useRouter } from "next/navigation";
import React from "react";
import {
  DropdownButton,
  TDropdownButtonEvent,
} from "../components/dropdown-button";
import { DataTable } from "../components/table";
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
} from "@/components/ui/drawer";
import TagEditor from "../components/tag-editor";
import { toast } from "sonner";

export default function TagsPage() {
  const [pagination, setPagination] = React.useState({
    current: 1,
    pageSize: 10,
  });
  const [editTag, setEditTag] = React.useState<TTag | null>(null);
  const [open, setOpen] = React.useState(false);

  const {
    isPending,
    data: tagsData,
    isFetching,
    refetch,
  } = useQuery({
    queryKey: ["tags", pagination.current, pagination.pageSize],
    queryFn: () =>
      getTags({
        page: pagination.current,
        pageSize: pagination.pageSize,
      }),
    placeholderData: keepPreviousData,
  });

  const { mutate: delTag, isPending: isDeleting } = useMutation({
    mutationFn: (id: number) => deleteTag(id),
    onSuccess: () => {
      refetch();
      toast.success("标签删除成功");
    },
  });

  const actions = (row: Row<TTag>) => {
    const events: TDropdownButtonEvent[] = [
      {
        title: "编辑",
        icon: <SquarePen />,
        onClick: () => {
          setEditTag(row.original);
          setOpen(true);
        },
      },
      {
        title: "删除",
        icon: <Trash />,
        onClick: () => delTag(row.original.id),
      },
    ];

    return (
      <DropdownButton events={events}>
        <CircleEllipsis />
      </DropdownButton>
    );
  };

  const columns: ColumnDef<TTag>[] = [
    {
      header: () => {
        return <span>{"ID"}</span>;
      },
      accessorKey: "id",
      size: 40,
    },
    {
      header: "名称",
      accessorKey: "name",
    },
    {
      header: "颜色",
      accessorKey: "color",
      cell: ({ getValue }) => {
        const val = getValue() as string;
        return (
          <div className="flex items-center">
            <span
              className={"inline-block w-4 h-4 rounded-full"}
              style={{ backgroundColor: val }}
            ></span>
            <span className={"ml-2"}>{val}</span>
          </div>
        );
      },
    },
    {
      header: "分组",
      accessorKey: "group",
    },
    {
      header: "创建于",
      accessorKey: "createdAt",
      cell: ({ getValue }) => {
        const value = getValue();
        return (
          <span>{dayjs(value as Date).format("YYYY-MM-DD HH:mm:ss")}</span>
        );
      },
    },
    {
      header: "更新于",
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
    <>
      <div className={"h-full w-full flex flex-col gap-2"}>
        <div className={"flex items-center justify-between"}>
          <p className={"font-bold text-lg"}>标签列表</p>
          <div className={"flex items-center gap-2"}>
            <Button size="lg" className={"text-md"} onClick={() => refetch()}>
              <RotateCcw />
            </Button>
            <Button
              size={"lg"}
              className={"text-md"}
              onClick={() => {
                setEditTag(null);
                setOpen(true);
              }}
            >
              <CirclePlus className={"mr-1"} />
              新建标签
            </Button>
          </div>
        </div>

        <DataTable
          loading={isFetching || isPending || isDeleting}
          data={tagsData?.data ?? []}
          columns={columns}
          pagination={{
            current: pagination.current,
            pageSize: pagination.pageSize,
            onChange: (page, pageSize) => {
              setPagination((prev) => ({
                ...prev,
                current: page,
                pageSize,
              }));
            },
            total: tagsData?.total ?? 0,
          }}
        />
      </div>
      <Drawer open={open} onOpenChange={setOpen} direction="right">
        <DrawerContent>
          <DrawerHeader>
            <DrawerTitle>{!!editTag ? "编辑标签" : "新建标签"}</DrawerTitle>
          </DrawerHeader>
          <div className={"px-4 w-full"}>
            <TagEditor
              tag={editTag}
              onSuccess={() => {
                setOpen(false);
                refetch();
                toast.success(!!editTag ? "标签更新成功" : "标签创建成功");
              }}
            />
          </div>
        </DrawerContent>
      </Drawer>
    </>
  );
}
