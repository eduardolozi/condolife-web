import { getOrCreateCurrentUser } from '@/features/users/services/userService'
import type { CurrentUser } from '@/features/users/types/CurrentUser'
import { CondominiumMemberships } from '@/features/condominiums/components/CondomiumMemberships'
import { createFileRoute } from '@tanstack/react-router'
import { useEffect, useState } from 'react'
import { PageTitle } from '@/shared/components/PageTitle'

export const Route = createFileRoute('/_authenticated/dashboard/')({
  component: RouteComponent,
})

function RouteComponent() {
  const [, setUser] = useState<CurrentUser>()

  useEffect(() => {
    (
      async () => {
        setUser(await getOrCreateCurrentUser())
      }
    )()
  }, [])

  return (
    <>
      <div>
        <PageTitle text="Meus Condomínios"/>

        <CondominiumMemberships/>
      </div>
    </>
  )
}
