import { getOrCreateCurrentUser } from '@/features/auth/services/UserService'
import type { CurrentUser } from '@/features/auth/types/currentUser'
import { createFileRoute } from '@tanstack/react-router'
import { useEffect, useState } from 'react'

export const Route = createFileRoute('/_authenticated/dashboard/')({
  component: RouteComponent,
})


function RouteComponent() {
  const [user, setUser] = useState<CurrentUser>()
  
  useEffect(() => {
    (
      async () => {
        setUser(await getOrCreateCurrentUser())
      }
    )()
  })

  return (
    <div>
      <div>Hello {user?.fullName}!</div>
    </div>
  )
}
