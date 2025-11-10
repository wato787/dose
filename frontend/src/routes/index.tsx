import { createFileRoute } from "@tanstack/react-router";
import { getDoseLogs } from "@/api/dose-log";
import { getMedicines } from "@/api/medicine";
import { Loading } from "@/components/Loading";
import { requireAuth } from "@/lib/auth-guard";
import { queryClient } from "@/lib/query-client";
import { Home } from "@/views/Home";

export const Route = createFileRoute("/")({
  beforeLoad: requireAuth,
  loader: async () => {
    // データを確保（キャッシュにあればそれを使用、なければフェッチ）
    // medicinesにはschedules、customItems、customLogsが含まれている
    await Promise.all([
      queryClient.ensureQueryData({
        queryKey: ["medicines", { isActive: true }],
        queryFn: () => getMedicines({ isActive: true }),
      }),
      queryClient.ensureQueryData({
        queryKey: ["doseLogs"],
        queryFn: () => getDoseLogs(),
      }),
    ]);
  },
  pendingComponent: Loading,
  component: Home,
});
