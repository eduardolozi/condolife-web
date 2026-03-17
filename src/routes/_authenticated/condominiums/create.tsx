import { CondominiumForm } from '@/features/condominiums/components/CondominiumForm'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/_authenticated/condominiums/create')({
  component: RouteComponent,
})

function RouteComponent() {
  return (
    <div className='flex flex-col items-center justify-center px-4 sm:px-6'>
      <div className='sm:mt-10 w-full max-w-160'>
        <CondominiumForm/>
      </div>
    </div>
  )
}
