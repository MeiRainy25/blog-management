import { cn } from "@/lib/utils";
import UserBtnIcon from "./user-btn";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import React from "react";

export interface IMenuItem extends React.ComponentProps<
  typeof DropdownMenuItem
> {
  label: string;
  icon?: React.ReactElement<{ className?: string }>;
  disabled?: boolean;
}

export interface IMenu extends React.ComponentProps<typeof DropdownMenuGroup> {
  groupName: string;
  items: IMenuItem[];
}

export interface UserMenuProps extends React.ComponentProps<"button"> {
  menu: IMenu[];
  side?: React.ComponentProps<typeof DropdownMenuContent>["side"];
  align?: React.ComponentProps<typeof DropdownMenuContent>["align"];
}

/**
 * 用户弹出菜单
 * 继承Button所有属性作用于触发器
 * 可配置side和align两种DropdownMenu属性
 * 默认值: side-bottom align-end
 * @param
 * @returns
 */
export default function UserMenu({
  menu,
  side = "bottom",
  align = "end",
  ...props
}: UserMenuProps) {
  const { className, ...buttonProps } = props;
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button
          {...buttonProps}
          className={cn(
            "flex items-center justify-center",
            "p-2",
            "hover:shadow-2xl rounded-md",
            className,
          )}
        >
          <UserBtnIcon />
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className={"w-40"} align={align} side={side}>
        {menu.map((m) => {
          const { groupName, ...rest } = m;
          return (
            <DropdownMenuGroup key={groupName} {...rest}>
              <DropdownMenuLabel>{groupName}</DropdownMenuLabel>
              {m.items.map((item) => {
                const { key, label, icon, disabled, ...rest } = item;

                const IconComponent =
                  icon && React.cloneElement(icon, { className: "h-4 w-4" });

                return (
                  <DropdownMenuItem key={key} disabled={disabled} {...rest}>
                    {IconComponent}
                    {label}
                  </DropdownMenuItem>
                );
              })}
            </DropdownMenuGroup>
          );
        })}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
