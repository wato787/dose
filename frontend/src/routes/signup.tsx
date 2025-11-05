import { createFileRoute, redirect } from '@tanstack/react-router'
import { SignUp } from '@/views/SignUp'
import { getSession } from '@/api/auth'

export const Route = createFileRoute('/signup')({
  beforeLoad: async () => {
    const session = await getSession()
    if (session) {
      throw redirect({
        to: '/',
      })
    }
  },
  component: SignUp,
})

