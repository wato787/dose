import { StrictMode } from 'react'
import ReactDOM from 'react-dom/client'
import { RouterProvider, createRouter as createTanStackRouter } from '@tanstack/react-router'
import { routeTree } from './routeTree.gen'
import { TanStackRouterDevtools } from '@tanstack/react-router-devtools'
import './index.css'

// ルーターの作成関数
export function createRouter() {
  const router = createTanStackRouter({
    routeTree,
    notFoundMode: 'root', // 404ページをrootで統一
  })

  return router
}

// TypeScriptの型定義を拡張
declare module '@tanstack/react-router' {
  interface Register {
    router: ReturnType<typeof createRouter>
  }
}

const router = createRouter()

// アプリケーションのレンダリング
const rootElement = document.getElementById('root')!
if (!rootElement.innerHTML) {
  const root = ReactDOM.createRoot(rootElement)
  root.render(
    <StrictMode>
      <RouterProvider router={router} />
      <TanStackRouterDevtools router={router} />
    </StrictMode>
  )
}

