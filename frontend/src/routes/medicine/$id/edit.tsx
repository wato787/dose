import { createFileRoute } from "@tanstack/react-router";
import { getMedicine } from "@/api/medicine";
import { Loading } from "@/components/Loading";
import { PageHeader } from "@/components/layout";
import { requireAuth } from "@/lib/auth-guard";
import { queryClient } from "@/lib/query-client";
import { Edit } from "@/views/Medicine/Edit";

export const Route = createFileRoute("/medicine/$id/edit")({
  beforeLoad: requireAuth,
  loader: async ({ params }) => {
    const medicineId = Number(params.id);

    // 薬のデータをプリロード（schedulesとcustomItemsが含まれている）
    await queryClient.ensureQueryData({
      queryKey: ["medicine", medicineId],
      queryFn: () => getMedicine(medicineId),
    });
  },
  pendingComponent: Loading,
  component: () => (
    <>
      <PageHeader title="薬を編集" backTo="/medicine" />
      <Edit />
    </>
  ),
});
