import { createFileRoute } from '@tanstack/react-router'
import { Medicine } from '@/views/Medicine'
import { Pending } from '@/views/Medicine/Pending'
import { requireAuth } from '@/lib/auth-guard'
import { queryClient } from '@/lib/query-client'
import { getMedicines } from '@/api/medicine'
import { PageHeader } from '@/components/layout'

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
  pendingComponent: Pending,
  component: () => (
    <>
      <PageHeader title="薬管理" backTo="/" />
      <Medicine />
    </>
  ),
})
