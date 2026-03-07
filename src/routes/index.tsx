import { login, register } from '@/features/auth/services/AuthService'
import { createFileRoute } from '@tanstack/react-router'
import { Button } from 'primereact/button'

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
      <Button onClick={handleLoginClick} label='Login' className='mr-2'></Button>
      <Button onClick={handleRegisterClick} label='Criar meu condomínio'></Button>
    </>
  )
}
