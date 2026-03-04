"use client";

import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { userAuthStore } from "@/lib/store/auth";
import { cn } from "@/lib/utils";
import { Book, LogOut, House, Tag } from "lucide-react";
import { usePathname, useRouter } from "next/navigation";
import React from "react";
import UserMenu, { IMenu } from "./user-menu";

export interface SidebarContextProps {
  state: "expanded" | "collapsed";
  toggleSidebar: () => void;
  open: boolean;
  setOpen: (open: boolean | ((prev: boolean) => boolean)) => void;
}

type IconElement = React.ReactElement<{ className?: string }>;

export interface SidebarItemProps {
  icon: IconElement;
  title: string;
  path: string;
}

const sidebarList: SidebarItemProps[] = [
  {
    title: "博客管理",
    path: "/manage/blogs",
    icon: <Book />,
  },
  {
    title: "标签管理",
    path: "/manage/tags",
    icon: <Tag />,
  },
];

const SIDEBAR_WIDTH = "16rem";
const SIDEBAR_WIDTH_ICON = "4rem";
const SIDEBAR_ICON_SIZE = "6rem";

const SidebarContext = React.createContext<SidebarContextProps | null>(null);

export default function ManageSidebar() {
  const { state } = useSidebar();

  return (
    <div
      style={
        {
          "--sidebar-width": SIDEBAR_WIDTH,
          "--sidebar-width-icon": SIDEBAR_WIDTH_ICON,
          "--sidebar-icon-size": SIDEBAR_ICON_SIZE,
        } as React.CSSProperties
      }
      className={cn(
        "flex flex-col gap-2 p-1",
        "border shadow-sm min-h-0 group",
        {
          "w-(--sidebar-width)": state === "expanded",
          "w-(--sidebar-width-icon)": state === "collapsed",
        },
        "transition-[width] duration-300",
        "overflow-hidden",
      )}
      data-state={state}
    >
      <div className={"flex flex-col gap-1 flex-1"}>
        {sidebarList.map((item) => (
          <ManageSidebarItem key={item.title} {...item} />
        ))}
      </div>
      <SidebarFooter />
    </div>
  );
}

export function ManageSidebarItem(props: SidebarItemProps) {
  const { icon, title, path } = props;
  const { state } = useSidebar();
  const pathname = usePathname();
  const router = useRouter();

  const IconComponent = React.cloneElement(icon, {
    className: "w-(--sidebar-icon-size) h-(--sidebar-icon-size)",
  });

  const collapsed = state === "collapsed";
  const isActive = pathname.includes(path);
  const redirectEvent = () => router.push(path);

  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <Button
          className={cn(
            "grid items-center w-full",
            "grid-cols-[var(--sidebar-width-icon)_1fr]",
            "transition-all duration-150",
            collapsed ? "px-1" : "px-2",
            {
              "bg-muted text-muted-foreground": isActive,
            },
          )}
          onClick={redirectEvent}
          size={state === "expanded" ? "lg" : "default"}
          variant={"ghost"}
        >
          <div className={"flex items-center justify-center"}>
            {IconComponent}
          </div>
          <span
            className={cn(
              "ml-1 truncate font-bold text-start",
              "transition-all duration-300",
              collapsed
                ? "opacity-0 max-w-0 ml-0"
                : "opacity-100 max-w-full ml-1",
            )}
            aria-hidden={collapsed}
          >
            {title}
          </span>
        </Button>
      </TooltipTrigger>
      <TooltipContent hidden={!collapsed} side={"right"}>
        <span>{title}</span>
      </TooltipContent>
    </Tooltip>
  );
}

export function ManageSidebarProvider({
  defaultOpen = true,
  open: openProp,
  onOpenChange: setOpenProp,
  children,
}: {
  defaultOpen?: boolean;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  children: React.ReactNode;
}) {
  const [_open, _setOpen] = React.useState(defaultOpen);

  const open = openProp ?? _open;
  const setOpen = React.useCallback(
    (value: boolean | ((value: boolean) => boolean)) => {
      const nextState = typeof value === "function" ? value(open) : value;

      if (setOpenProp) {
        setOpenProp(nextState);
      } else {
        _setOpen(nextState);
      }
    },
    [setOpenProp, open],
  );

  const toggleSidebar = React.useCallback(() => {
    setOpen((prev) => !prev);
  }, [setOpen]);

  const state = open ? "expanded" : "collapsed";

  const contextValue = React.useMemo<SidebarContextProps>(
    () => ({
      state,
      open,
      setOpen,
      toggleSidebar,
    }),
    [state, open, setOpen, toggleSidebar],
  );

  return (
    <SidebarContext.Provider value={contextValue}>
      {children}
    </SidebarContext.Provider>
  );
}

export function useSidebar() {
  const context = React.useContext(SidebarContext);
  if (!context) {
    throw new Error("useSidebar must be used within a ManageSidebarProvider");
  }
  return context;
}

export function SidebarFooter() {
  const clearAuthStore = userAuthStore((s) => s.clear);
  const router = useRouter();

  const menu: IMenu[] = [
    {
      groupName: "操作",
      items: [
        {
          key: "return-front",
          label: "返回主站",
          icon: <House />,
          onClick: () => {
            router.push("/");
          },
        },
        {
          key: "log-out",
          label: "退出登录",
          icon: <LogOut />,
          onClick: () => {
            clearAuthStore();
            router.push("/auth");
          },
        },
      ],
    },
  ];

  return (
    <div className={"flex items-center justify-center"}>
      <UserMenu menu={menu} side="right" />
    </div>
  );
}
