import { createFileRoute } from '@tanstack/react-router'
import { Edit } from '@/views/Medicine/Edit'
import { requireAuth } from '@/lib/auth-guard'
import { queryClient } from '@/lib/query-client'
import { getMedicine } from '@/api/medicine'
import { getSchedules } from '@/api/schedule'

export const Route = createFileRoute('/medicine/$id/edit')({
  beforeLoad: requireAuth,
  loader: async ({ params }) => {
    const medicineId = Number(params.id)
    
    // 薬とスケジュールのデータをプリロード
    await Promise.all([
      queryClient.ensureQueryData({
        queryKey: ['medicine', medicineId],
        queryFn: () => getMedicine(medicineId),
      }),
      queryClient.ensureQueryData({
        queryKey: ['schedules', { medicineId }],
        queryFn: () => getSchedules({ medicineId }),
      }),
    ])
  },
  component: Edit,
})

