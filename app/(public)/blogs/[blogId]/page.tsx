import { TBlogDetail } from "@/app/api/query";
import { PublicBlogDetail } from "../../components/blog-detail";

type PageProps = {
  params: Promise<{
    blogId: string;
  }>;
};

async function getBlog(blogId: string): Promise<TBlogDetail> {
  const root_url = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:3001";

  const response = await fetch(`${root_url}/api/blogs/${blogId}`, {
    next: {
      revalidate: 60, // 每60秒重新验证一次数据
    },
  });
  const blog = await response.json();
  return blog;
}

export default async function BlogDetail(props: PageProps) {
  const { blogId } = await props.params;
  const blog = await getBlog(blogId);

  return <PublicBlogDetail blog={blog} />;
}

export async function generateMetadata(props: PageProps) {
  const { blogId } = await props.params;
  const blog = await getBlog(blogId);

  return {
    title: blog.title,
    description: blog.title,
  };
}
