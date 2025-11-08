import { createFileRoute } from '@tanstack/react-router'
import { Home } from '@/views/Home'
import { requireAuth } from '@/lib/auth-guard'
import { queryClient } from '@/lib/query-client'
import { getMedicines } from '@/api/medicine'
import { getDoseLogs } from '@/api/dose-log'
import { getCustomLogs } from '@/api/custom-log'

export const Route = createFileRoute('/')({
  beforeLoad: requireAuth,
  loader: async () => {
    // データを確保（キャッシュにあればそれを使用、なければフェッチ）
    // medicinesにはschedulesとcustomItemsが含まれている
    await Promise.all([
      queryClient.ensureQueryData({
        queryKey: ['medicines', { isActive: true }],
        queryFn: () => getMedicines({ isActive: true }),
      }),
      queryClient.ensureQueryData({
        queryKey: ['doseLogs'],
        queryFn: () => getDoseLogs(),
      }),
      queryClient.ensureQueryData({
        queryKey: ['customLogs'],
        queryFn: () => getCustomLogs(),
      }),
    ])
  },
  component: Home,
})

