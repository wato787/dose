import { QueryClient } from "@tanstack/react-query";

/**
 * QueryClientのインスタンス
 * TanStack Routerのloaderで使用するためにエクスポート
 */
export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5, // 5分
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
});
