import { createFileRoute } from '@tanstack/react-router'
import { SignUp } from '@/views/SignUp'

export const Route = createFileRoute('/signup')({
  component: SignUp,
})

