import { StrictMode } from 'react'
import ReactDOM from 'react-dom/client'
import { RouterProvider, createRouter } from '@tanstack/react-router'
import { routeTree } from './routeTree.gen'
import { TanStackRouterDevtools } from '@tanstack/react-router-devtools'

// ルーターの作成
const router = createRouter({ routeTree })

// TypeScriptの型定義を拡張
declare module '@tanstack/react-router' {
  interface Register {
    router: typeof router
  }
}

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

