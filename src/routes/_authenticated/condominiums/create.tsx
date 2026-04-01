import { CondominiumForm } from '@/features/condominiums/components/CondominiumForm'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/_authenticated/condominiums/create')({
  component: RouteComponent,
})

function RouteComponent() {
  return (
    <div className='flex w-full flex-col justify-center px-3 sm:px-5'>
      <div className='w-full max-w-none py-2 sm:mt-5 sm:py-4 md:max-w-5xl md:self-center'>
        <CondominiumForm/>
      </div>
    </div>
  )
}
