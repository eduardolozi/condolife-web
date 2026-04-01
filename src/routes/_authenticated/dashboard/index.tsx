import { CondominiumMemberships } from '@/features/condominiums/components/CondomiumMemberships'
import { createFileRoute } from '@tanstack/react-router'
import { PageTitle } from '@/shared/components/PageTitle'
import { getCondominiumMemberships } from '@/features/users/services/condominiumMembershipService'
import type { CondominiumMembership } from '@/features/users/types/CondominiumMembership'

export const Route = createFileRoute('/_authenticated/dashboard/')({
  component: RouteComponent,
  loader: async () => {
    const memberships = await getCondominiumMemberships()

    return {memberships}
  }
})

function RouteComponent() {
  const {memberships}: {memberships: CondominiumMembership[]} = Route.useLoaderData()

  return (
    <>
      <div>
        <PageTitle text="Meus Condomínios"/>

        <CondominiumMemberships memberships={memberships}/>
      </div>
    </>
  )
}
