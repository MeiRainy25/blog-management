import request from "@/lib/request";

export type AuthFallbackUser = {
  id: string;
  email: string;
  nickname: string;
};

export type AuthResponse = {
  user: AuthFallbackUser;
};

export function login(email: string, password: string) {
  return request.post<AuthResponse>("/api/auth/login", {
    email,
    password,
  });
}

export function register(email: string, password: string) {
  return request.post<AuthResponse>("/api/auth/register", {
    email,
    password,
  });
}