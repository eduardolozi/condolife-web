import { getOrCreateCurrentUser } from '@/features/users/services/userService'
import type { CurrentUser } from '@/features/users/types/CurrentUser'
import { CondominiumMemberships } from '@/features/condominiums/components/CondomiumMemberships'
import { createFileRoute, useNavigate } from '@tanstack/react-router'
import { useEffect, useState } from 'react'
import { Button } from 'primereact/button'

export const Route = createFileRoute('/_authenticated/dashboard/')({
  component: RouteComponent,
})


function RouteComponent() {
  const [, setUser] = useState<CurrentUser>()
  const navigator = useNavigate()
  
  useEffect(() => {
    (
      async () => {
        setUser(await getOrCreateCurrentUser())
      }
    )()
  }, [])

  return (
    // <div className='my-4 flex w-full max-w-190 flex-col rounded-xl border border-gray-300 px-3 pb-4 shadow sm:my-5 sm:px-6 sm:pb-6'>
    //   <CondominiumMemberships/>
    // </div>
    <>
      <div className='md:mx-25'>
        <div className='flex flex-col justify-center sm:flex-row sm:justify-between items-center'>
          <p className='font-bold text-2xl sm:text-4xl'>Meus Condomínios</p>
          <Button onClick={() => navigator({to: "/condominiums/create"})} className="my-5" label="Criar condomínio" icon='pi pi-plus' iconPos='left' outlined severity="success"/>
        </div>
        <CondominiumMemberships/>
      </div>
    </>
  )
}
