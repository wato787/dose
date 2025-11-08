import { createFileRoute } from '@tanstack/react-router'
import { Medicine } from '@/views/Medicine'
import { requireAuth } from '@/lib/auth-guard'
import { queryClient } from '@/lib/query-client'
import { getMedicines } from '@/api/medicine'

export const Route = createFileRoute('/medicine/')({
  beforeLoad: requireAuth,
  loader: async () => {
    // データをプリロード（キャッシュにあればそれを使用、なければフェッチ）
    // medicinesにはschedulesとcustomItemsが含まれている
    await queryClient.ensureQueryData({
      queryKey: ['medicines'],
      queryFn: () => getMedicines(),
    })
  },
  component: Medicine,
})
