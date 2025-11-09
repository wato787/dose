import { createFileRoute } from '@tanstack/react-router'
import { Add } from '@/views/Medicine/Add'
import { requireAuth } from '@/lib/auth-guard'
import { PageHeader } from '@/components/layout'

export const Route = createFileRoute('/medicine/add')({
  beforeLoad: requireAuth,
  component: () => (
    <>
      <PageHeader title="薬を登録" backTo="/medicine" />
      <Add />
    </>
  ),
})

