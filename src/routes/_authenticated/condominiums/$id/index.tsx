import { PageTitle } from '@/shared/components/PageTitle'
import { createFileRoute, useNavigate } from '@tanstack/react-router'
import { Button } from 'primereact/button'

export const Route = createFileRoute('/_authenticated/condominiums/$id/')({
  component: RouteComponent,
})

function RouteComponent() {
  const navigator = useNavigate()
  
  return (
    <div>
      <PageTitle text='Condominio'/>

      <Button label='Importação de proprietários' onClick={() => navigator({to: 'management/resident-pre-registration'})}/>      
    </div>
  )
}
