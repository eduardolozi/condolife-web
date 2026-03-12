import { getOrCreateCurrentUser } from '@/features/auth/services/userService'
import type { CurrentUser } from '@/features/auth/types/currentUser'
import { CondominiumMemberships } from '@/features/condominiums/components/CondomiumMemberships'
import { createFileRoute } from '@tanstack/react-router'
import { useEffect, useState } from 'react'

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
  })

  return (
    <div className='flex flex-col px-6 pb-6 my-5 border rounded-xl border-gray-300 shadow w-1/3'>
      <p className='text-2xl mb-4 px-3 font-bold border-l-4 border-green-700'>Meus condomínios</p>
      <CondominiumMemberships/>
    </div>
  )
}
