import { createFileRoute, redirect } from '@tanstack/react-router'
import { Home } from '@/views/Home'
import { getSession } from '@/api/auth'

export const Route = createFileRoute('/')({
  beforeLoad: async () => {
    const session = await getSession()
    if (!session) {
      throw redirect({
        to: '/login',
      })
    }
  },
  component: Home,
})

