import { Outlet } from "@tanstack/react-router";
import { Button } from "primereact/button";
import { Menubar } from "primereact/menubar";

interface UnauthenticatedMenubarProps {
    handleRegister: () => Promise<void>,
    handleLogin: () => Promise<void>
}

function UnauthenticatedMenubar({handleRegister, handleLogin}: UnauthenticatedMenubarProps) {
    const logo = (
        <div className="flex h-4 max-w-[58vw] items-center overflow-visible sm:h-5 sm:max-w-none md:h-6">
          <img
            src="/titulo.png"
            alt="CondoLife"
            className="h-full w-auto object-contain"
          />
        </div>
    ) 
    
    const authButtons = (
        <div className="flex items-center gap-2">
            <div className='hidden sm:block'>
            <Button
                onClick={handleRegister}
                label="Crie a sua conta"
                size="small"
                className="h-9 px-3 text-sm sm:h-auto sm:px-4 sm:text-base"
            />
            </div>
            <Button outlined onClick={handleLogin} label="Entrar" icon="pi pi-sign-in" iconPos="right"></Button>
        </div>
    )

    return(
        <div className="flex flex-col">
            <Menubar className="landing-menubar h-20 pr-10 pl-5 py-3" start={logo} end={authButtons} />
            <div className='mx-7'>
                <Outlet/>
            </div>
        </div>
    )
}

export default UnauthenticatedMenubar