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
