import { LoaderCircle } from "lucide-react";

export function Loading({ loading }: { loading: boolean }) {
  return (
    <div
      className={
        "absolute flex items-center justify-center w-full h-full bg-muted/40"
      }
      hidden={!loading}
    >
      <LoaderCircle className={"animate-spin"} />
    </div>
  );
}
