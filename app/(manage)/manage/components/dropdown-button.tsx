"use client";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";
import React from "react";

export interface TDropdownButtonEvent extends React.ComponentProps<
  typeof Button
> {
  title: string;
  icon?: React.ReactElement<{ className?: string; key: string }>;
}

export interface DropdownButtonProps {
  children: React.ReactNode;
  events: TDropdownButtonEvent[];
}

export function DropdownButton({ children, events }: DropdownButtonProps) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant={"ghost"} size={"lg"} className={"cursor-pointer"}>
          {children}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="rounded-sm">
        {events.map((event) => {
          const { title, icon, className, ...rest } = event;
          const iconComp = icon
            ? React.cloneElement(icon, {
                className: "mr-2 text-inherit",
                key: title,
              })
            : null;

          return (
            <Button
              {...rest}
              key={title}
              className={cn(
                className,
                "w-full flex items-center justify-start hover:text-primary transition-colors duration-200",
              )}
              variant={"ghost"}
            >
              {iconComp}
              {title}
            </Button>
          );
        })}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
