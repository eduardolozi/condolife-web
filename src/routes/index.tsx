import { login, logout, register } from '@/features/auth/services/AuthService'
import { Button } from '@chakra-ui/react'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/')({
  component: RouteComponent,
})

function RouteComponent() {
  const handleLoginClick = async () => {
    await login("/users")
  }

  const handleRegisterClick = async () => {
    await register("/")
  } 

  return (
    <>
      <Button onClick={handleLoginClick}>Login</Button>

      <Button marginLeft={"3"} onClick={handleRegisterClick}>Criar meu condomínio</Button>
    </>
  )
}
