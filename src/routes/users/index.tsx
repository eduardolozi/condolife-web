import { logout } from '@/features/auth/services/AuthService'
import { Button } from '@chakra-ui/react'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/users/')({
  component: RouteComponent,
})

function RouteComponent() {

  const handleLogoutClick = async () => {
    await logout()
  }
  
  return (
    <>
      <Button onClick={handleLogoutClick}>Logout</Button>
    </>
  )
}
