import { cn } from "@/lib/utils";
import Image from "next/image";

export default function ManageLogo({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div {...props} className={cn("h-8 w-8 relative", className)}>
      <Image
        src="/svg/manage/logo.svg"
        alt="logo"
        fill
        sizes="40px"
        className={"object-contain"}
        priority
      />
    </div>
  );
}
