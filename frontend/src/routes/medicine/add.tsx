import { createFileRoute } from '@tanstack/react-router'
import { Add } from '@/views/Medicine/Add'
import { requireAuth } from '@/lib/auth-guard'

export const Route = createFileRoute('/medicine/add')({
  beforeLoad: requireAuth,
  component: Add,
})

