import { cookies } from "next/headers";
import BlogEditor from "../../components/blog-editor";

type PageProps = {
  params: Promise<{ blogId: string }>;
};

export default async function BlogDetail(props: PageProps) {
  const root_url = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:3001";
  const { blogId } = await props.params;
  const cookieHeader = (await cookies())
    .getAll()
    .map((cookie) => `${cookie.name}=${cookie.value}`)
    .join("; ");

  const response = await fetch(`${root_url}/api/manage/blogs/${blogId}`, {
    headers: {
      Cookie: cookieHeader,
      "Content-Type": "application/json",
    },
  });

  const blog = await response.json();

  return <BlogEditor blog={blog} />;
}
