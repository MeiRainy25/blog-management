import { cn } from "@/lib/utils";
import Image from "next/image";

export default function UserBtnIcon({
  className,
  ...props
}: React.ComponentProps<"div">) {
  return (
    <div {...props} className={cn("h-8 w-8 relative", className)}>
      <Image
        src="/svg/manage/user.svg"
        alt="User Icon"
        fill
        sizes="40px"
        className={"object-contain"}
        priority
      />
    </div>
  );
}
