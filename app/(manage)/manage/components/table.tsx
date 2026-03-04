"use client";

import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { LoaderCircle } from "lucide-react";
import React from "react";
import { EmptyIcon } from "@/components/icons";
import { Loading } from "@/components/loading";

export interface PaginationProps {
  /**
   * 受控模式
   * 外部决定分页
   */
  pageSize?: number;
  current?: number;

  /**
   * 数据总数
   */
  total?: number;

  /**
   * 页码和页大小变化后的回调
   */
  onChange?: (page: number, pageSize: number) => void;
}

const DEFAULT_CURRENT_PAGE = 1;
const DEFAULT_PAGE_SIZE = 10;

export interface DataTableProps<TData, TValue> {
  data: TData[];
  columns: ColumnDef<TData, TValue>[];
  pagination?: PaginationProps | false;
  loading?: boolean;
}

export function DataTable<TData, TValue>({
  data,
  columns,
  pagination = false,
  loading = false,
}: DataTableProps<TData, TValue>) {
  const paginationEnabled = pagination !== false;
  const defaultCurrent = paginationEnabled
    ? (pagination.current ?? DEFAULT_CURRENT_PAGE)
    : DEFAULT_CURRENT_PAGE;
  const defaultPageSize = paginationEnabled
    ? (pagination.pageSize ?? DEFAULT_PAGE_SIZE)
    : DEFAULT_PAGE_SIZE;

  // 内部私有分页状态
  const [_pagination, _setPagination] = React.useState({
    pageIndex: defaultCurrent - 1,
    pageSize: defaultPageSize,
  });

  const pageIndex = paginationEnabled
    ? (pagination.current ?? _pagination.pageIndex + 1) - 1
    : _pagination.pageIndex;
  const pageSize = paginationEnabled
    ? (pagination.pageSize ?? _pagination.pageSize)
    : _pagination.pageSize;
  const setPagination = React.useCallback(
    (page: number, pageSize: number) => {
      if (paginationEnabled) {
        pagination.onChange?.(page + 1, pageSize);
      } else {
        _setPagination({ pageIndex: page, pageSize });
      }
    },
    [_setPagination, pagination, paginationEnabled],
  );

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),

    // table状态
    state: {
      pagination: {
        pageIndex,
        pageSize,
      },
    },
    // 开启分页
    manualPagination: paginationEnabled,
    rowCount: paginationEnabled ? (pagination.total ?? 0) : undefined,

    onPaginationChange: (updater) => {
      if (!paginationEnabled) return;

      const next =
        typeof updater === "function"
          ? updater({ pageIndex, pageSize })
          : updater;

      // 对内pageIndex从0开始, 对外page应该从1开始
      const nextPage = next.pageIndex;
      const nextSize = next.pageSize;

      setPagination(nextPage, nextSize);
    },

    defaultColumn: {
      size: 150,
      minSize: 40,
      maxSize: Number.MAX_SAFE_INTEGER,
    },
  });

  // 可见数据
  const rows = table.getRowModel().rows;
  const total = paginationEnabled
    ? (pagination.total ?? rows.length)
    : rows.length;
  const totalPages = paginationEnabled
    ? Math.max(1, Math.ceil((total ?? 0) / pageSize))
    : 1;

  const canPrev = paginationEnabled ? pageIndex > 0 : false;
  const canNext = paginationEnabled ? pageIndex + 1 < totalPages : false;

  return (
    <div className={"overflow-hidden rounded-sm border h-full w-full relative"}>
      <Loading loading={loading} />
      <Table className="w-full table-fixed">
        <TableHeader>
          {table.getHeaderGroups().map((headerGroup) => (
            <TableRow key={headerGroup.id}>
              {headerGroup.headers.map((header) => (
                <TableHead key={header.id} style={{ width: header.getSize() }}>
                  {header.isPlaceholder
                    ? null
                    : flexRender(
                        header.column.columnDef.header,
                        header.getContext(),
                      )}
                </TableHead>
              ))}
            </TableRow>
          ))}
        </TableHeader>
        <TableBody>
          {table.getRowModel().rows?.length ? (
            table.getRowModel().rows.map((row) => (
              <TableRow
                key={row.id}
                data-state={row.getIsSelected() && "selected"}
              >
                {row.getVisibleCells().map((cell) => (
                  <TableCell
                    key={cell.id}
                    style={{ width: cell.column.getSize() }}
                  >
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </TableCell>
                ))}
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={columns.length} className="h-96 p-0">
                <div className="h-full w-full flex items-center justify-center">
                  <div className="flex flex-col items-center gap-2 text-muted-foreground">
                    <EmptyIcon className="fill-muted-foreground" />
                    <span className={"text-muted-foreground text-lg"}>
                      没有找到数据...
                    </span>
                  </div>
                </div>
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>

      {paginationEnabled && total >= 1 && (
        <div className={"flex items-center justify-end gap-2 border-t p-2"}>
          <span className={"text-sm text-muted-foreground"}>
            第 {pageIndex + 1} / {totalPages} 页
          </span>
          <Button
            variant={"ghost"}
            size="sm"
            disabled={!canPrev}
            onClick={() => table.previousPage()}
          >
            上一页
          </Button>
          <Button
            variant={"ghost"}
            size="sm"
            disabled={!canNext}
            onClick={() => table.nextPage()}
          >
            下一页
          </Button>
        </div>
      )}
    </div>
  );
}
