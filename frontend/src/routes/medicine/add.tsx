import { createFileRoute } from "@tanstack/react-router";
import { Loading } from "@/components/Loading";
import { PageHeader } from "@/components/layout";
import { requireAuth } from "@/lib/auth-guard";
import { Add } from "@/views/Medicine/Add";

export const Route = createFileRoute("/medicine/add")({
  beforeLoad: requireAuth,
  pendingComponent: Loading,
  component: () => (
    <>
      <PageHeader title="薬を登録" backTo="/medicine" />
      <Add />
    </>
  ),
});
