import { CondominiumForm } from '@/features/condominiums/components/CondominiumForm'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/_authenticated/condominiums/create')({
  component: RouteComponent,
})

function RouteComponent() {
  return (
    <div className='flex w-full flex-col justify-center px-3 sm:px-6'>
      <div className='w-full max-w-none py-3 sm:mt-8 sm:py-6 md:max-w-6xl md:self-center'>
        <CondominiumForm/>
      </div>
    </div>
  )
}
