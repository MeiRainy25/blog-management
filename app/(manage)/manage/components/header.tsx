"use client";

import { cn } from "@/lib/utils";
import ManageLogo from "./logo";
import { useSidebar } from "./sidebar";

export default function ManageHeader() {
  const { toggleSidebar } = useSidebar();

  return (
    <div className={cn("min-h-16 flex items-center px-4", "shadow-sm")}>
      <div className={"flex items-center gap-2"}>
        <ManageLogo onClick={toggleSidebar} />
        <h1 className="text-lg font-semibold">博客管理系统</h1>
      </div>
      <div>{/**TODO 右侧内容 */}</div>
    </div>
  );
}
