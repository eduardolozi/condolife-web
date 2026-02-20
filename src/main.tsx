import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import { Provider } from './components/ui/provider.tsx'
import { createRouter, RouterProvider } from '@tanstack/react-router'
import { routeTree } from './routeTree.gen.ts'

const router = createRouter({routeTree})

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <Provider forcedTheme='light'>
      <RouterProvider router={router}/>
    </Provider>
  </StrictMode>,
)
