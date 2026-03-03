"use client";

import ThemeToggle from "@/components/theme-toggle";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { MessageCircleMore, Notebook, Tag } from "lucide-react";
import { useRouter } from "next/navigation";
import React from "react";

interface Nav {
  title: string;
  href: string;
  icon: React.ReactElement<{ className?: string }>;
}

export function Header() {
  const router = useRouter();

  const navList: Nav[] = [
    { title: "博客", href: "/", icon: <Notebook /> },
    { title: "标签", href: "/tags", icon: <Tag /> },
    { title: "其他", href: "/other", icon: <MessageCircleMore /> },
  ];

  return (
    <div
      className={cn(
        "w-full min-h-12 text-primary-foreground",
        "flex items-center justify-between",
        "px-4",
      )}
    >
      <div className={"text-foreground flex gap-1"}>
        {navList.map((nav) => {
          return (
            <Button
              key={nav.href}
              variant={"ghost"}
              className={"px-2 flex items-center cursor-pointer"}
              onClick={() => router.push(nav.href)}
            >
              {nav.icon}
              {nav.title}
            </Button>
          );
        })}
      </div>
      <ThemeToggle className={"text-foreground"} />
    </div>
  );
}
