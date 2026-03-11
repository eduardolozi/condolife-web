import { isAuthenticated, logout } from '@/features/auth/services/AuthService'
import { createFileRoute, Outlet, redirect } from '@tanstack/react-router'
import { Button } from 'primereact/button'
import { Menubar } from 'primereact/menubar'

export const Route = createFileRoute('/_authenticated')({
  component: AuthenticatedLayout,
  beforeLoad: async () => {
    if(!(await isAuthenticated())) {
      throw redirect({to: '/'})
    }
     
  }
})

function AuthenticatedLayout() {
  const handleLogoutClick = async () => {
    await logout()
  }
  const logo = (
    <div className="flex flex-row h-4 max-w-[58vw] items-center gap-1.5 overflow-visible sm:h-5 sm:max-w-none sm:gap-2 md:h-6">
      <img
        src="/logo-definitiva.png"
        className="h-16 w-auto object-contain"
        alt="Logo Condolife principal"
      />
      <img
        src="/titulo.png"
        alt="CondoLife"
        className="h-full w-auto object-contain"
      />
    </div>
  ) 

  const end = (
      <Button onClick={handleLogoutClick} outlined severity='warning' label='Sair' iconPos="right"></Button>
  )

  return (
    <div className="flex flex-col">
      <Menubar className="landing-menubar h-20 pr-10 pl-5 py-3 mb-8" start={logo} end={end} />
      <div className='mx-7'>
        <Outlet/>
      </div>
    </div>
  )
}
