import { isAuthenticated, logout } from '@/features/auth/services/authService'
import {AuthenticatedMenubar} from '@/shared/components/AuthenticatedMenubar'
import { createFileRoute, redirect } from '@tanstack/react-router'

// let bootstrapUserPromise: Promise<void> | null = null

// const ensureCurrentUserBootstrap = async () => {
//   if (!bootstrapUserPromise) {
//     bootstrapUserPromise = (async () => {
//       await getOrCreateCurrentUser()
//     })()
//   }

//   await bootstrapUserPromise
// }

export const Route = createFileRoute('/_authenticated')({
  component: AuthenticatedLayout,
  beforeLoad: async () => {
    if(!(await isAuthenticated())) {
      throw redirect({to: '/'})
    }

    // try {
    //   await ensureCurrentUserBootstrap()
    // } catch {
    //   bootstrapUserPromise = null
    //   throw redirect({ to: '/' })
    // }
  }
})

function AuthenticatedLayout() {
  const handleLogout = async () => {
    await logout()
  }
  
  return (
    <>
      <AuthenticatedMenubar avatarUrl={null} handleLogout={handleLogout}/>
    </>
  )
}
