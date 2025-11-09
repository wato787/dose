import { Outlet, createRootRoute, useRouterState } from '@tanstack/react-router'
import { Header, BottomNav } from '@/components/layout'
import { NotFound } from '@/views/NotFound'

const RootComponent = () => {
  const router = useRouterState()
  const pathname = router.location.pathname
  
  // 認証系のページではBottomNavを表示しない
  const authPaths = ['/login', '/signup']
  const shouldShowBottomNav = !authPaths.includes(pathname)

  return (
    <>
      <Header />
      <main className={`min-h-screen bg-background ${shouldShowBottomNav ? 'pb-20' : ''}`}>
        <Outlet />
      </main>
      {shouldShowBottomNav && <BottomNav />}
    </>
  )
}

export const Route = createRootRoute({
  component: RootComponent,
  notFoundComponent: () => <NotFound />,
})

