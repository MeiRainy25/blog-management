import axios from "axios";
import { userAuthStore } from "../store/auth";
import { toast } from "sonner";

/**
 * 刷新accessToken的api地址
 */
export const API_REFRESH_ACCESS_TOKEN = "/api/auth/refresh";
/**
 * 401后重定向地址
 */
export const HREF_LOGIN = "/auth";

/**
 * 跳过refresh阶段的接口列表
 */
export const PASS_API_URL = ["/api/auth/login", "/api/auth/register"];

export const axiosInstance = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:3000",
  timeout: 10000,
  withCredentials: true,
});

/**
 * 拦截器
 */
let isRefreshing = false; // 是否正在刷新token
let pendingQueue: Array<() => void> = []; // 等待刷新完成的请求队列

/**
 * 处理等待队列, 执行所有队列中的回调
 * @param token accessToken
 */
function processQueue() {
  pendingQueue.forEach((cb) => cb());
  pendingQueue = [];
}

/**
 * 清空等待队列
 */
function clearQueue() {
  pendingQueue = [];
}

// 请求拦截器
axiosInstance.interceptors.request.use((config) => {
  return config;
});

// 响应拦截器
axiosInstance.interceptors.response.use(
  (response) => {
    return response.data;
  },
  async (error) => {
    const originalRequest = error.config;
    const isPassApi = PASS_API_URL.includes(originalRequest.url);

    if (error.response?.data?.message) {
      toast.error(error.response.data.message);
    }

    // refresh接口错误, 直接抛出错误
    if (originalRequest.url === API_REFRESH_ACCESS_TOKEN) {
      userAuthStore.getState().clear(); // 清空zustand缓存
      return Promise.reject(error);
    }

    if (!error.response) {
      return Promise.reject(error);
    }

    if (
      error.response?.status === 401 &&
      !originalRequest._retry &&
      !isPassApi
    ) {
      originalRequest._retry = true;

      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          pendingQueue.push(() => {
            axiosInstance(originalRequest).then(resolve).catch(reject);
          });
        });
      }

      isRefreshing = true;

      try {
        await axiosInstance.post(API_REFRESH_ACCESS_TOKEN, undefined, {
          _retry: true,
        } as any);

        processQueue();

        return axiosInstance(originalRequest);
      } catch (error) {
        isRefreshing = false;
        clearQueue();

        if (typeof window !== "undefined") {
          window.location.href = HREF_LOGIN;
        }

        return Promise.reject(error);
      } finally {
        isRefreshing = false;
      }
    }

    return Promise.reject(error);
  },
);

const request = {
  get<T>(url: string, params?: any): Promise<T> {
    return axiosInstance.get(url, { params });
  },
  post<T>(url: string, data?: any): Promise<T> {
    return axiosInstance.post(url, resolveData(data));
  },
  put<T>(url: string, data?: any): Promise<T> {
    return axiosInstance.put(url, resolveData(data));
  },
  delete<T>(url: string, params?: any): Promise<T> {
    return axiosInstance.delete(url, { params });
  },
};

function resolveData(data: any) {
  if (!data) return undefined;

  if (data instanceof FormData) {
    return data;
  }

  return data;
}

export default request;
