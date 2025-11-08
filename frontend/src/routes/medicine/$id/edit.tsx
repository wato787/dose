import { createFileRoute } from '@tanstack/react-router'
import { Edit } from '@/views/Medicine/Edit'
import { requireAuth } from '@/lib/auth-guard'
import { queryClient } from '@/lib/query-client'
import { getMedicine } from '@/api/medicine'

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
  component: Edit,
})

