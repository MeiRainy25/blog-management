"use client";

import { deleteUser, getUsers, TUserData } from "@/app/api/query";
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
import UserEditor from "../components/user-editor";
import { toast } from "sonner";
import { userAuthStore } from "@/lib/store/auth";

export default function UsersPage() {
  const user = userAuthStore((store) => store.user);

  const [pagination, setPagination] = React.useState({
    current: 1,
    pageSize: 10,
  });
  const [editUser, setEditUser] = React.useState<TUserData | null>(null);
  const [open, setOpen] = React.useState(false);

  const {
    isPending,
    data: usersData,
    isFetching,
    refetch,
  } = useQuery({
    queryKey: ["users", pagination.current, pagination.pageSize],
    queryFn: () =>
      getUsers({
        page: pagination.current,
        pageSize: pagination.pageSize,
      }),
    placeholderData: keepPreviousData,
  });

  const { mutate: delUser, isPending: isDeleting } = useMutation({
    mutationFn: (id: string) => deleteUser(id),
    onSuccess: () => {
      refetch();
      toast.success("用户删除成功");
    },
  });

  const actions = (row: Row<TUserData>) => {
    const events: TDropdownButtonEvent[] = [
      {
        title: "编辑",
        icon: <SquarePen />,
        onClick: () => {
          setEditUser(row.original);
          setOpen(true);
        },
      },
      {
        title: "删除",
        icon: <Trash />,
        onClick: () => delUser(row.original.id),
        disabled: row.original.id === user?.id,
      },
    ];

    return (
      <DropdownButton events={events}>
        <CircleEllipsis />
      </DropdownButton>
    );
  };

  const columns: ColumnDef<TUserData>[] = [
    {
      header: () => {
        return <span>{"ID"}</span>;
      },
      accessorKey: "id",
      size: 240,
    },
    {
      header: "昵称",
      accessorKey: "nickname",
    },
    {
      header: "邮箱",
      accessorKey: "email",
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
          <p className={"font-bold text-lg"}>用户列表</p>
          <div className={"flex items-center gap-2"}>
            <Button size="lg" className={"text-md"} onClick={() => refetch()}>
              <RotateCcw />
            </Button>
            <Button
              size={"lg"}
              className={"text-md"}
              onClick={() => {
                setEditUser(null);
                setOpen(true);
              }}
            >
              <CirclePlus className={"mr-1"} />
              新建用户
            </Button>
          </div>
        </div>

        <DataTable
          loading={isFetching || isPending || isDeleting}
          data={usersData?.data ?? []}
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
            total: usersData?.total ?? 0,
          }}
        />
      </div>

      <Drawer open={open} onOpenChange={setOpen} direction="right">
        <DrawerContent>
          <DrawerHeader>
            <DrawerTitle>{editUser ? "编辑用户" : "新建用户"}</DrawerTitle>
          </DrawerHeader>
          <div className={"px-4 w-full"}>
            <UserEditor
              user={editUser}
              onSuccess={() => {
                setOpen(false);
                refetch();
                toast.success(editUser ? "用户更新成功" : "用户创建成功");
              }}
            />
          </div>
        </DrawerContent>
      </Drawer>
    </>
  );
}
