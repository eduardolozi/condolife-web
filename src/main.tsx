import './index.css'
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { createRouter, RouterProvider } from '@tanstack/react-router'
import { routeTree } from './routeTree.gen.ts'
import {PrimeReactProvider} from 'primereact/api'

const router = createRouter({
  routeTree,
  defaultPreload: 'intent',
})

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <PrimeReactProvider>
        <RouterProvider router={router}/>
    </PrimeReactProvider>
  </StrictMode>,
)
