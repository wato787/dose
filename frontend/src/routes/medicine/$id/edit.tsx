import { createFileRoute } from '@tanstack/react-router'
import { Edit } from '@/views/Medicine/Edit'
import { Pending } from '@/views/Medicine/Edit/Pending'
import { requireAuth } from '@/lib/auth-guard'
import { queryClient } from '@/lib/query-client'
import { getMedicine } from '@/api/medicine'
import { PageHeader } from '@/components/layout'

export const Route = createFileRoute('/medicine/$id/edit')({
  beforeLoad: requireAuth,
  loader: async ({ params }) => {
    const medicineId = Number(params.id)
    
    // 薬のデータをプリロード（schedulesとcustomItemsが含まれている）
    await queryClient.ensureQueryData({
      queryKey: ['medicine', medicineId],
      queryFn: () => getMedicine(medicineId),
    })
  },
  pendingComponent: Pending,
  component: () => (
    <>
      <PageHeader title="薬を編集" backTo="/medicine" />
      <Edit />
    </>
  ),
})

