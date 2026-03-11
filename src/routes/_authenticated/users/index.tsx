import { logout } from '@/features/auth/services/AuthService'
import { createFileRoute } from '@tanstack/react-router'
import { Button } from 'primereact/button'

export const Route = createFileRoute('/_authenticated/users/')({
  component: RouteComponent,
})

function RouteComponent() {

  const handleLogoutClick = async () => {
    await logout()
  }
  
  return (
    <>
      <Button onClick={handleLogoutClick} icon="pi-sign-out" label='Sair'></Button>
    </>
  )
}
