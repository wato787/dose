import { createFileRoute } from '@tanstack/react-router'
import { Add } from '@/views/Medicine/Add'
import { Pending } from '@/views/Medicine/Add/Pending'
import { requireAuth } from '@/lib/auth-guard'
import { PageHeader } from '@/components/layout'

export const Route = createFileRoute('/medicine/add')({
  beforeLoad: requireAuth,
  pendingComponent: Pending,
  component: () => (
    <>
      <PageHeader title="薬を登録" backTo="/medicine" />
      <Add />
    </>
  ),
})

