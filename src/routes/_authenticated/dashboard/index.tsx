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
    <>
      <div className='md:mx-25'>

        <div className='flex flex-col justify-center sm:flex-row sm:justify-between items-center'>
          <p className='font-bold text-2xl sm:text-4xl text-emerald-950'>Meus Condomínios</p>
          <Button onClick={() => navigator({to: "/condominiums/create"})}
            className="w-full sm:w-auto rounded-xl! bg-emerald-700! border-emerald-700! hover:bg-emerald-800! hover:border-emerald-800! px-7! font-semibold!"
            type="submit"
            label="Criar condomínio"
            icon='pi pi-plus'
            iconPos='left'
          />
        </div>

        <CondominiumMemberships/>
      </div>
    </>
  )
}
