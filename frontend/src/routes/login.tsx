import { createFileRoute, redirect } from '@tanstack/react-router'
import { Login } from '@/views/Login'
import { getSession } from '@/api/auth'

export const Route = createFileRoute('/login')({
  beforeLoad: async () => {
    const session = await getSession()
    if (session) {
      throw redirect({
        to: '/',
      })
    }
  },
  component: Login,
})

