import { createFileRoute } from '@tanstack/react-router'
import { Login } from '@/views/Login'
import { redirectIfAuthenticated } from '@/lib/auth-guard'

export const Route = createFileRoute('/login')({
  beforeLoad: redirectIfAuthenticated,
  component: Login,
})

