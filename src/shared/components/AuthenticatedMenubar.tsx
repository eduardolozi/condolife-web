import { Link, Outlet, useLocation } from "@tanstack/react-router"
import { Avatar } from "primereact/avatar"
import { Button } from "primereact/button"
import { Divider } from "primereact/divider"
import { Menubar } from "primereact/menubar"
import type { MenuItem } from "primereact/menuitem"
import { Sidebar } from "primereact/sidebar"
import { TieredMenu } from "primereact/tieredmenu"
import { useRef, useState } from "react"

interface AuthenticatedMenubarProps {
    handleLogout: () => Promise<void>,
    avatarUrl: string | null
}

export const AuthenticatedMenubar = ({handleLogout, avatarUrl}: AuthenticatedMenubarProps) => {
    const menu = useRef<TieredMenu>(null)
    const location = useLocation()
    const [isDrawerOpen, setIsDrawerOpen] = useState(false)

    const navigationItems = [
        {label: "Dashboard", icon: "pi pi-home", to: "/dashboard"},
        {label: "Usuarios", icon: "pi pi-users", to: "/users"}
    ]

    const items: MenuItem[] = [
    {
        label: "Meu perfil",
        icon: "pi pi-user"
    },
    {
        label: "Configuracoes",
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
    <Link to="/dashboard" className="hover:cursor-pointer flex flex-row h-4 max-w-[58vw] items-center gap-1.5 overflow-visible sm:h-5 sm:max-w-none sm:gap-2 md:h-6" preload="intent">
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
    </Link>
    )

    const end = (
        <div className="mr-2">
            <TieredMenu className="my-2 avatar-tiered-menu w-44 py-1" model={items} popup ref={menu} onShow={handleMenuShow} />
            <Avatar className='hover:cursor-pointer' image={avatarUrl ?? "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRHjMqxhyKtGXX33Xss3TcOhMPlc-1OdMIqmw&s"} size="large" shape="circle" onClick={(e) => menu.current?.toggle(e)}/>
        </div>
    )

    return (
        <div className="flex min-h-screen flex-col">
            <Sidebar
                visible={isDrawerOpen}
                onHide={() => setIsDrawerOpen(false)}
                className="authenticated-drawer w-[18rem] sm:w-[20rem]"
                showCloseIcon={false}
            >
                <div className="flex h-full flex-col px-2 py-3">
                    <div className="mb-3 flex items-center gap-3 rounded-xl bg-white px-3 py-2.5 shadow-sm">
                        <Avatar
                            image={avatarUrl ?? "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRHjMqxhyKtGXX33Xss3TcOhMPlc-1OdMIqmw&s"}
                            size="large"
                            shape="circle"
                        />
                        <div className="min-w-0">
                            <p className="truncate text-sm font-semibold text-gray-800">Minha conta</p>
                            <p className="truncate text-xs text-gray-500">Acessar perfil e configuracoes</p>
                        </div>
                    </div>

                    <nav className="flex flex-col gap-1">
                        {navigationItems.map((item) => {
                            const isActive = location.pathname.startsWith(item.to)
                            return (
                                <Link
                                    key={item.to}
                                    to={item.to}
                                    onClick={() => setIsDrawerOpen(false)}
                                    className={`authenticated-drawer-link ${isActive ? 'authenticated-drawer-link--active' : ''}`}
                                >
                                    <i className={`${item.icon} text-sm`} />
                                    <span>{item.label}</span>
                                </Link>
                            )
                        })}
                    </nav>

                    <Divider className="my-3" />

                    <Button
                        label="Sair"
                        icon="pi pi-sign-out"
                        text
                        className="authenticated-drawer-logout w-full"
                        onClick={async () => {
                            setIsDrawerOpen(false)
                            await handleLogout()
                        }}
                    />
                </div>
            </Sidebar>

            <div className="relative flex h-17 items-center justify-center border-b border-gray-100 bg-white px-3 py-2.5 shadow-sm lg:hidden">
                <Button
                    icon="pi pi-bars"
                    rounded
                    text
                    aria-label="Abrir menu"
                    className="absolute left-3"
                    onClick={() => setIsDrawerOpen(true)}
                />

                <Link
                    to="/dashboard"
                    preload="intent"
                    className="authenticated-mobile-logo-trigger flex items-center gap-1.5"
                >
                    <img
                        src="/logo-definitiva.png"
                        className="h-10 w-auto object-contain"
                        alt="Logo Condolife principal"
                    />
                    <img
                        src="/titulo.png"
                        alt="CondoLife"
                        className="h-4 w-auto object-contain"
                    />
                </Link>
            </div>

            <div className="hidden lg:block">
                <Menubar className="landing-menubar h-20 pr-10 pl-5 py-3" start={logo} end={end} />
            </div>

            <div className='mx-3 my-3 sm:mx-5 lg:mx-7 lg:my-4'>
                <Outlet/>
            </div>
        </div>
    )
}
