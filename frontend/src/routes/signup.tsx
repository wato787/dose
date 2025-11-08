import { createFileRoute } from '@tanstack/react-router'
import { SignUp } from '@/views/SignUp'
import { redirectIfAuthenticated } from '@/lib/auth-guard'

export const Route = createFileRoute('/signup')({
  beforeLoad: redirectIfAuthenticated,
  component: SignUp,
})

