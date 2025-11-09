import { Outlet, createRootRoute } from '@tanstack/react-router'
import { Header, Footer } from '@/components/layout'
import { NotFound } from '@/views/NotFound'

export const Route = createRootRoute({
  component: () => (
    <>
      <Header />
      <main className="min-h-screen bg-background">
        <Outlet />
      </main>
      <Footer />
    </>
  ),
  notFoundComponent: () => <NotFound />,
})

