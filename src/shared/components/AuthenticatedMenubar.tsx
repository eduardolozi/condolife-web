import { Outlet, useNavigate } from "@tanstack/react-router"
import { Avatar } from "primereact/avatar"
import { Menubar } from "primereact/menubar"
import type { MenuItem } from "primereact/menuitem"
import { TieredMenu } from "primereact/tieredmenu"
import { useRef } from "react"

interface AuthenticatedMenubarProps {
    handleLogout: () => Promise<void>,
    avatarUrl: string | null
}

export const AuthenticatedMenubar = ({handleLogout, avatarUrl}: AuthenticatedMenubarProps) => {
    const menu = useRef<TieredMenu>(null)
    const navigator = useNavigate()
    
    const items: MenuItem[] = [
    {
        label: "Meu perfil",
        icon: "pi pi-user"
    },
    {
        label: "Configurações",
        icon: "pi pi-cog"
    },
    {
        separator: true
    },
    {
        label: 'Sair',
        icon: 'pi pi-sign-out',
        className: 'menu-item-danger',
        command: async () => {
            await handleLogout()
        },
    }
    ]

    const handleMenuShow = () => {
        const menuElement = menu.current?.getElement()
        if (!menuElement) return

        menuElement.querySelectorAll('.p-focus').forEach((node) => {
            node.classList.remove('p-focus')
        })

        const activeElement = document.activeElement as HTMLElement | null
        if (activeElement && menuElement.contains(activeElement)) {
            activeElement.blur()
        }
    }

    const logo = (
    <div onClick={() => navigator({to: '/dashboard'})} className="hover:cursor-pointer flex flex-row h-4 max-w-[58vw] items-center gap-1.5 overflow-visible sm:h-5 sm:max-w-none sm:gap-2 md:h-6">
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
        <div className="mr-2">
            <TieredMenu className="my-2 avatar-tiered-menu w-44 py-1" model={items} popup ref={menu} onShow={handleMenuShow} />
            <Avatar className='hover:cursor-pointer' image={avatarUrl ?? "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRHjMqxhyKtGXX33Xss3TcOhMPlc-1OdMIqmw&s"} size="large" shape="circle" onClick={(e) => menu.current?.toggle(e)}/>
        </div>
    )

    return (
        <div className="flex flex-col">
            <Menubar className="landing-menubar h-20 pr-10 pl-5 py-3 mb-2" start={logo} end={end} />
            <div className='mx-7'>
                <Outlet/>
            </div>
        </div>
    )
}
