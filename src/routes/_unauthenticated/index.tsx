import { register } from '@/features/auth/services/authService'
import { createFileRoute } from '@tanstack/react-router'
import { Button } from 'primereact/button'

export const Route = createFileRoute('/_unauthenticated/')({
  component: RouteComponent,
})

function RouteComponent() {
  const handleRegister = async () => {
    await register('/dashboard')
  }

  return (
    <div className="min-h-screen flex flex-col">
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
            onClick={handleRegister}
            label="Crie a sua conta"
            size="small"
            className="mt-3 p-2 text-xl w-2/4 h-12 sm:text-base sm:hidden"
          />
        </section>
      </main>
    </div>
  )
}
