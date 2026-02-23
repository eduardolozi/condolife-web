import { LoginForm } from '@/features/auth/components/LoginForm'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/auth/login')({
  component: RouteComponent,
})

async function handleLoginSubmit() {
  const promise = new Promise(resolve => setTimeout(() => resolve("Dados recebidos"), 1000));
  await promise;
}

function RouteComponent() {
  return (
    <>
      <LoginForm onSubmit={handleLoginSubmit}/>
    </>
  )
}
