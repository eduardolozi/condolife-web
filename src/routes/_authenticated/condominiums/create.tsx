import { CondominiumForm } from '@/features/condominiums/components/CondominiumForm'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/_authenticated/condominiums/create')({
  component: RouteComponent,
})

function RouteComponent() {
  return (
    <div>
      <div className='w-2/4 mx-auto'>
        <CondominiumForm/>

      </div>
    </div>
  )
}
