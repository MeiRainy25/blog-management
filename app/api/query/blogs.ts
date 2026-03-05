import request from "@/lib/request";
import { JSONContent } from "@tiptap/react";

export interface IGetBlogs {
  page: number;
  pageSize: number;
  sortBy?: "createdAt" | "updatedAt";
  order?: "asc" | "desc";
}

export interface TBlogData {
  id: string;
  title: string;
  author: {
    id: string;
    nickname: string;
  };
  createdAt: Date;
  updatedAt: Date;
  tags: TBlogTag[];
}
export interface TBlogsData {
  total: number;
  data: TBlogData[];
}

/**
 * 获取博客列表数据(不包含content)
 * @param params
 * @returns
 */
export async function getBlogs(params: IGetBlogs) {
  const {
    page = 1,
    pageSize = 10,
    sortBy = "createdAt",
    order = "desc",
  } = params;
  return await request.get<TBlogsData>("/api/manage/blogs", {
    page,
    pageSize,
    sortBy,
    order,
  });
}

/**
 * 获取公开博客列表
 * @returns
 */
export async function getPublicBlogs(params: IGetBlogs) {
  const {
    page = 1,
    pageSize = 10,
    sortBy = "createdAt",
    order = "desc",
  } = params;
  return await request.get<TBlogsData>("/api/blogs", {
    page,
    pageSize,
    sortBy,
    order,
  });
}

export interface TBlogTag {
  id: number;
  name: string;
  color?: string;
  group?: string;
}

export interface TBlogDetail {
  id: string;
  title: string;
  content: JSONContent;
  author: {
    id: string;
    nickname: string;
  };
  tags: TBlogTag[];
  createdAt: Date;
  updatedAt: Date;
}

export async function getBlogDetail(id: string) {
  return await request.get<TBlogDetail>(`/api/manage/blogs/${id}`);
}

export interface ICreateBlogDto {
  title: string;
  content: JSONContent;
  markdown: string;
  authorId: string;
  tags?: number[];
}

/**
 * 创建博客
 * @param dto
 * @returns
 */
export async function createBlog(dto: ICreateBlogDto) {
  return await request.post("/api/manage/blogs", dto);
}

export interface IUpdateBlogDto {
  title?: string;
  content?: JSONContent;
  markdown?: string;
  tags?: number[];
}

/**
 * 更新博客
 * @param id 博客id
 * @param dto
 * @returns
 */
export async function updateBlog(id: string, dto: IUpdateBlogDto) {
  return await request.put(`/api/manage/blogs/${id}`, dto);
}

export async function deleteBlog(id: string) {
  return await request.delete(`/api/manage/blogs/${id}`);
}

export async function exportBlog(ids: string[]) {
  // 不再使用 request.post（它可能会按 json 解析）
  const res = await fetch(`/api/manage/blogs/export`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
    body: JSON.stringify({ ids }),
  });

  if (!res.ok) {
    // 尝试读一下错误信息（如果后端返回 json）
    const text = await res.text().catch(() => "");
    throw new Error(text || `export failed: ${res.status}`);
  }

  const blob = await res.blob();
  const filename = getFilenameFromContentDisposition(
    res.headers.get("content-disposition"),
  );

  const url = URL.createObjectURL(blob);
  try {
    const a = document.createElement("a");
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    a.remove();
  } finally {
    URL.revokeObjectURL(url);
  }
}

function getFilenameFromContentDisposition(cd: string | null | undefined) {
  if (!cd) return "blogs.zip";

  // RFC 5987: filename*=UTF-8''xxx
  const m1 = /filename\*\s*=\s*UTF-8''([^;]+)/i.exec(cd);
  if (m1?.[1]) return decodeURIComponent(m1[1]);

  // filename="xxx"
  const m2 = /filename\s*=\s*"([^"]+)"/i.exec(cd);
  if (m2?.[1]) return m2[1];

  // filename=xxx
  const m3 = /filename\s*=\s*([^;]+)/i.exec(cd);
  if (m3?.[1]) return m3[1].trim();

  return "blogs.zip";
}
