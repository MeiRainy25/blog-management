"use client";

import { userAuthStore } from "@/lib/store/auth";
import { useRouter } from "next/navigation";
import React from "react";

export default function ManageRoot() {
  const isAuthed = userAuthStore((s) => s.isAuthed);
  const router = useRouter();
  React.useEffect(() => {
    if (isAuthed) {
      router.replace("/manage/blogs");
    } else {
      router.replace("/auth");
    }
  }, [isAuthed, router]);
}
