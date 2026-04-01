import { getCondominium } from '@/features/condominiums/services/condominiumService'
import type { GetCondominiumResponse } from '@/features/condominiums/types/responses/GetCondominiumResponse'
import { PageTitle } from '@/shared/components/PageTitle'
import { createFileRoute, useNavigate } from '@tanstack/react-router'
import { Button } from 'primereact/button'

export const Route = createFileRoute('/_authenticated/condominiums/$condominiumId/')({
  component: RouteComponent,
  loader: async ({params}) => {
    const {condominiumId} = params
    const condominium = await getCondominium(Number.parseInt(condominiumId))
    return {condominium}
  }
})


function RouteComponent() {
  const navigator = useNavigate()

  const {condominium}: { condominium: GetCondominiumResponse} = Route.useLoaderData()

  return (
    <div>
      <PageTitle text={condominium.condominiumName}/>
      
      <Button 
        label='Importação de proprietários'
        onClick={() => navigator({to: 'management/resident-pre-registration'})}
      />      
    </div>
  )
}
