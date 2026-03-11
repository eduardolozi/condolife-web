import { login, register } from '@/features/auth/services/AuthService'
import { createFileRoute } from '@tanstack/react-router'
import { Button } from 'primereact/button'
import { Menubar } from 'primereact/menubar'

export const Route = createFileRoute('/')({
  component: RouteComponent,
})

function RouteComponent() {
  const handleLoginClick = async () => {
    await login('/dashboard')
  }

  const handleRegisterClick = async () => {
    await register('/dashboard')
  }

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
          onClick={handleRegisterClick}
          label="Crie a sua conta"
          size="small"
          className="h-9 px-3 text-sm sm:h-auto sm:px-4 sm:text-base"
        />
      </div>
      <Button outlined onClick={handleLoginClick} label="Entrar" icon="pi pi-sign-in" iconPos="right"></Button>
    </div>
  )

  return (
    <div className="min-h-screen flex flex-col">
      <Menubar className="landing-menubar h-20 pr-10 pl-5 py-3" start={logo} end={authButtons} />
      <main className="flex-1 flex items-start justify-center px-4 py-8 sm:px-6 sm:py-10">
        <section className="hero-logo-fade-in flex max-w-4xl flex-col items-center text-center">
          <img
            src="/logo-definitiva.png"
            className="h-32 w-auto object-contain sm:h-40 md:h-52 lg:h-64 xl:h-72"
            alt="Logo Condolife principal"
          />

          <h2 className="mt-2 mb-5 text-2xl font-semibold leading-tight text-black sm:text-3xl md:text-4xl">
            Onde seu condomínio se transforma em <span style={{ color: 'var(--green-400)' }}>comunidade.</span>
          </h2>

          <p className="mt-0 max-w-2xl text-xl leading-relaxed text-zinc-700 sm:text-base md:text-lg">
            Tudo organizado para facilitar o dia a dia de quem vive aqui.
          </p>

          <Button
            onClick={handleRegisterClick}
            label="Crie a sua conta"
            size="small"
            className="mt-3 p-2 text-xl w-2/4 h-12 sm:text-base sm:hidden"
          />
        </section>
      </main>
    </div>
  )
}
