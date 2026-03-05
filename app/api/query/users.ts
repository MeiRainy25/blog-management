import request from "@/lib/request";

export interface IGetUsers {
  page: number;
  pageSize: number;
  sortBy?: "createdAt" | "updatedAt";
  order?: "asc" | "desc";
}

export interface TUserData {
  id: string;
  email: string;
  nickname: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface TUsersData {
  total: number;
  data: TUserData[];
}

/**
 * 获取用户列表数据
 */
export async function getUsers(params: IGetUsers) {
  const {
    page = 1,
    pageSize = 10,
    sortBy = "createdAt",
    order = "desc",
  } = params;

  return await request.get<TUsersData>("/api/manage/users", {
    page,
    pageSize,
    sortBy,
    order,
  });
}

export interface TUserDetail {
  id: string;
  email: string;
  nickname: string;
  createdAt: Date;
  updatedAt: Date;
}

export async function getUserDetail(id: string) {
  return await request.get<TUserDetail>(`/api/manage/users/${id}`);
}

export interface ICreateUserDto {
  email: string;
  nickname: string;
  password: string;
}

export async function createUser(dto: ICreateUserDto) {
  return await request.post("/api/manage/users", dto);
}

export interface IUpdateUserDto {
  email?: string;
  nickname?: string;
  password?: string;
}

export async function updateUser(id: string, dto: IUpdateUserDto) {
  return await request.put(`/api/manage/users/${id}`, dto);
}

export async function deleteUser(id: string) {
  return await request.delete(`/api/manage/users/${id}`);
}
