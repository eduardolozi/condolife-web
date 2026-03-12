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
    <div className='my-4 flex w-full max-w-190 flex-col rounded-xl border border-gray-300 px-3 pb-4 shadow sm:my-5 sm:px-6 sm:pb-6'>
      <p className='text-2xl mb-4 px-3 font-bold border-l-4 border-green-700'>Meus condomínios</p>
      <CondominiumMemberships/>
    </div>
  )
}
