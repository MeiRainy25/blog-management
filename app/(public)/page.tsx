import BlogMain from "./components/blog-main";

export function generateMetadata() {
  return {
    title: "博客主页",
    description: "欢迎来到我的博客",
  };
}

export default function PublicRootPage() {
  return <BlogMain />;
}
