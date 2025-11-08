import { createFileRoute } from '@tanstack/react-router'
import { Medicine } from '@/views/Medicine'
import { requireAuth } from '@/lib/auth-guard'
import { queryClient } from '@/lib/query-client'
import { getMedicines } from '@/api/medicine'
import { getSchedules } from '@/api/schedule'

export const Route = createFileRoute('/medicine/')({
  beforeLoad: requireAuth,
  loader: async () => {
    // データをプリロード（キャッシュにあればそれを使用、なければフェッチ）
    await Promise.all([
      queryClient.ensureQueryData({
        queryKey: ['medicines'],
        queryFn: () => getMedicines(),
      }),
      queryClient.ensureQueryData({
        queryKey: ['schedules'],
        queryFn: () => getSchedules(),
      }),
    ])
  },
  component: Medicine,
})
