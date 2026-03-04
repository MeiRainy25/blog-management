import request from "@/lib/request";

export interface TTag {
  id: number;
  name: string;
  color?: string;
  createdAt: Date;
  updatedAt: Date;
  group?: string;
}

export interface TTagsData {
  total: number;
  data: TTag[];
}

export interface IGetTags {
  page: number;
  pageSize: number;
  sortBy?: "createdAt" | "updatedAt";
  order?: "asc" | "desc";
}

/**
 * 管理端：获取标签列表
 */
export async function getTags(params: IGetTags) {
  const {
    page = 1,
    pageSize = 10,
    sortBy = "createdAt",
    order = "desc",
  } = params;

  return await request.get<TTagsData>("/api/manage/tags", {
    page,
    pageSize,
    sortBy,
    order,
  });
}

/**
 * 公开端：获取标签列表
 */
export async function getPublicTags(params: IGetTags) {
  const {
    page = 1,
    pageSize = 10,
    sortBy = "createdAt",
    order = "desc",
  } = params;

  return await request.get<TTagsData>("/api/tags", {
    page,
    pageSize,
    sortBy,
    order,
  });
}

export interface ICreateTagDto {
  name: string;
}

/**
 * 管理端：创建标签
 */
export async function createTag(dto: ICreateTagDto) {
  return await request.post<TTag>("/api/manage/tags", dto);
}

export interface IUpdateTagDto {
  name?: string;
}

/**
 * 管理端：更新标签
 */
export async function updateTag(tagId: number, dto: IUpdateTagDto) {
  return await request.put<TTag>(`/api/manage/tags/${tagId}`, dto);
}

/**
 * 管理端：删除标签
 */
export async function deleteTag(tagId: number) {
  return await request.delete<TTag>(`/api/manage/tags/${tagId}`);
}
