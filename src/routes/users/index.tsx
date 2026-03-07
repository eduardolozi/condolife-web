import { logout } from '@/features/auth/services/AuthService'
import { createFileRoute } from '@tanstack/react-router'
import { Button } from 'primereact/button'

export const Route = createFileRoute('/users/')({
  component: RouteComponent,
})

function RouteComponent() {

  const handleLogoutClick = async () => {
    await logout()
  }
  
  return (
    <>
      <Button onClick={handleLogoutClick} label='Sair'></Button>
    </>
  )
}
