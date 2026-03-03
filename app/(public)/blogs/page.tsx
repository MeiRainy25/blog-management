import { redirect } from "next/navigation";

export const metadata = {
  title: "跳转中...",
};

export default function BlogPage() {
  redirect("/");
}
