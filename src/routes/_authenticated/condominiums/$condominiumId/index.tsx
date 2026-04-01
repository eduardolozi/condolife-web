import { getCondominium } from '@/features/condominiums/services/condominiumService'
import type { GetCondominiumResponse } from '@/features/condominiums/types/responses/GetCondominiumResponse'
import { PageTitle } from '@/shared/components/PageTitle'
import { Link, createFileRoute } from '@tanstack/react-router'
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
  const {condominium}: { condominium: GetCondominiumResponse} = Route.useLoaderData()
  const { condominiumId } = Route.useParams()

  return (
    <div>
      <PageTitle text={condominium.condominiumName}/>
      
      <Link
        to="/condominiums/$condominiumId/management/resident-pre-registration"
        params={{ condominiumId }}
        preload="intent"
        className="inline-block no-underline"
      >
        <Button label='Importação de proprietários' />
      </Link>
    </div>
  )
}
