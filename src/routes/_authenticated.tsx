import { isAuthenticated, logout } from '@/features/auth/services/AuthService'
import AuthenticatedMenubar from '@/shared/components/AuthenticatedMenubar'
import { createFileRoute, redirect } from '@tanstack/react-router'

export const Route = createFileRoute('/_authenticated')({
  component: AuthenticatedLayout,
  beforeLoad: async () => {
    if(!(await isAuthenticated())) {
      throw redirect({to: '/'})
    }
     
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
