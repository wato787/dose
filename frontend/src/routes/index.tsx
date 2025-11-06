import { createFileRoute, redirect } from '@tanstack/react-router'
import { Home } from '@/views/Home'
import { getSession } from '@/api/auth'
import { queryClient } from '@/lib/query-client'
import { getMedicines } from '@/api/medicine'
import { getSchedules } from '@/api/schedule'
import { getDoseLogs } from '@/api/dose-log'
import { getCustomItems } from '@/api/custom-item'
import { getCustomLogs } from '@/api/custom-log'

export const Route = createFileRoute('/')({
  beforeLoad: async () => {
    const session = await getSession()
    if (!session) {
      throw redirect({
        to: '/login',
      })
    }
  },
  loader: async () => {
    // データを確保（キャッシュにあればそれを使用、なければフェッチ）
    await Promise.all([
      queryClient.ensureQueryData({
        queryKey: ['medicines', { isActive: true }],
        queryFn: () => getMedicines({ isActive: true }),
      }),
      queryClient.ensureQueryData({
        queryKey: ['schedules'],
        queryFn: () => getSchedules(),
      }),
      queryClient.ensureQueryData({
        queryKey: ['doseLogs'],
        queryFn: () => getDoseLogs(),
      }),
      queryClient.ensureQueryData({
        queryKey: ['customItems'],
        queryFn: () => getCustomItems(),
      }),
      queryClient.ensureQueryData({
        queryKey: ['customLogs'],
        queryFn: () => getCustomLogs(),
      }),
    ])
  },
  component: Home,
})

