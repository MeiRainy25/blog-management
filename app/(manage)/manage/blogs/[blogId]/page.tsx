import BlogEditor from "../../components/blog-editor";

type PageProps = {
  params: Promise<{ blogId: string }>;
};

export default async function BlogDetail(props: PageProps) {
  const root_url = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:3000";
  const { blogId } = await props.params;

  const response = await fetch(`${root_url}/api/blogs/${blogId}`);

  const blog = await response.json();

  return <BlogEditor blog={blog} />
}
