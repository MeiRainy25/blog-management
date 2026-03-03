"use client";

import { useTheme } from "next-themes";
import { Button } from "./ui/button";
import { Moon, Sun } from "lucide-react";
import React from "react";
import { cn } from "@/lib/utils";

export default function ThemeToggle({
  className,
  ...rest
}: React.ComponentProps<"button">) {
  const { resolvedTheme, setTheme } = useTheme();
  const [mounted, setMounted] = React.useState(false);

  React.useEffect(() => setMounted(true), []);

  const isDark = resolvedTheme === "dark";
  const onToggleTheme = () => setTheme(isDark ? "light" : "dark");

  if (!mounted) return null;

  return (
    <Button
      variant={"outline"}
      className={cn("cursor-pointer px-2 border-0", className)}
      onClick={onToggleTheme}
      {...rest}
    >
      {isDark ? <Sun /> : <Moon />}
    </Button>
  );
}
