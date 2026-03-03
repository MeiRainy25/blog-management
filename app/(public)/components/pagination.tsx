"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import React from "react";

export interface PaginationProps {
  totalPage: number;
  value: {
    current: number;
    pageSize: number;
  };
  onChange: (value: PaginationProps["value"]) => void;
}

export default function Pagination(props: PaginationProps) {
  const [_pagination, _setPagination] = React.useState({
    current: 1,
    pageSize: 10,
  });

  const min = 1;
  const max = Math.max(1, props.totalPage);

  return (
    <div className={"flex items-center justify-center gap-2"}>
      <Button
        size={"xs"}
        disabled={props.value.current <= min}
        hidden={props.value.current <= min}
      >
        上一页
      </Button>
      <Button
        size={"xs"}
        disabled={props.value.current >= max}
        hidden={props.value.current >= max}
      >
        下一页
      </Button>
      <div
        className={"flex items-center gap-1 pointer-events-none select-none"}
      >
        <span>
          第{props.value.current}/{props.totalPage}页
        </span>
      </div>
      <div className={"flex items-center gap-1"}>
        <Input
          className={"w-8 h-6 p-1 rounded-sm text-end input-no-spin"}
          value={_pagination.current}
          onChange={(e) => {
            _setPagination((prev) => ({
              ...prev,
              current: Number(e.target.value),
            }));
          }}
          onBlur={() => {
            _setPagination((prev) => ({
              ...prev,
              current: Math.min(max, Math.max(min, prev.current)),
            }));
          }}
          max={props.totalPage}
          min={1}
          type="number"
          inputMode="numeric"
        />
        <Button
          size="xs"
          onClick={() => {
            props.onChange({
              current: _pagination.current,
              pageSize: _pagination.pageSize,
            });
          }}
          className={"cursor-pointer"}
        >
          跳转
        </Button>
      </div>
    </div>
  );
}
