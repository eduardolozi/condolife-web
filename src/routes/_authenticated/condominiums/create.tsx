import { CondominiumForm } from '@/features/condominiums/components/CondominiumForm'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/_authenticated/condominiums/create')({
  component: RouteComponent,
})

function RouteComponent() {
  return (
    <div className='flex flex-col justify-center items-center'>
      <div className='w-2/5 mt-10'>
        <CondominiumForm/>

      </div>
    </div>
  )
}
