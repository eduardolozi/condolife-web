import UnauthenticatedMenubar from '@/components/UnauthenticatedMenubar'
import { login, register } from '@/features/auth/services/AuthService'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/_unauthenticated')({
  component: UnauthenticatedLayout
})

function UnauthenticatedLayout() {
  const handleLogin = async () => {
      await login('/dashboard')
    }
  
    const handleRegister = async () => {
      await register('/dashboard')
    }
    
  return (
    <UnauthenticatedMenubar handleLogin={handleLogin} handleRegister={handleRegister} />
  )
}
