import { createFileRoute } from "@tanstack/react-router";
import { getMedicines } from "@/api/medicine";
import { Loading } from "@/components/Loading";
import { PageHeader } from "@/components/layout";
import { requireAuth } from "@/lib/auth-guard";
import { queryClient } from "@/lib/query-client";
import { Medicine } from "@/views/Medicine";

export const Route = createFileRoute("/medicine/")({
  beforeLoad: requireAuth,
  loader: async () => {
    // データをプリロード（キャッシュにあればそれを使用、なければフェッチ）
    // medicinesにはschedulesとcustomItemsが含まれている
    await queryClient.ensureQueryData({
      queryKey: ["medicines"],
      queryFn: () => getMedicines(),
    });
  },
  pendingComponent: Loading,
  component: () => (
    <>
      <PageHeader title="薬管理" backTo="/" />
      <Medicine />
    </>
  ),
});
