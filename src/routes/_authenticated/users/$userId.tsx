import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/_authenticated/users/$userId')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Hello "/users/$userId"!</div>
}
