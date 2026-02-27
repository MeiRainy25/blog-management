import { QueryClient } from "@tanstack/react-query";

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      // 缓存1分钟
      staleTime: 1000 * 60 * 1,
    },
  },
});
