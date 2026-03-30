import { ResidentsImport } from '@/features/onboarding/components/ResidentsImport'
import { PageTitle } from '@/shared/components/PageTitle'
import { createFileRoute } from '@tanstack/react-router'
import { TabPanel, TabView } from 'primereact/tabview'

export const Route = createFileRoute('/_authenticated/onboarding/resident-pre-registration')({
  component: RouteComponent,
})

function RouteComponent() {
  const tooltip = (
     <div className="w-[min(22rem,calc(100vw-2rem))] border border-yellow-500/60 bg-yellow-100 rounded-md px-4 py-3">
          <p className="mt-3 font-semibold text-lg mb-0 text-yellow-950">Sobre esta etapa</p>
          <p className="text-yellow-950 mt-2 text-sm">
            Este cadastro não adiciona o morador automaticamente ao condomínio.
          </p>

          <p className="text-yellow-950 mt-2 text-sm">
            Ele funciona como um pré-cadastro para facilitar a entrada do morador e aumentar a segurança do condomínio.
          </p>

          <p className="text-yellow-950 mt-2 text-sm">
            Quando o morador criar a conta dele, os dados informados serão comparados com este pré-cadastro. 
            Se as informações estiverem corretas, o acesso ao condomínio será liberado.
          </p>
        </div>

  )
  return (
    <div>
      <PageTitle text="Cadastro de residentes" infoContent={tooltip}/>
      
      <div className='flex flex-row w-full justify-start items-center max-w-none md:max-w-6xl md:self-center'>
        <TabView className='md:w-2/3'>
          <TabPanel header="Importação">
            <ResidentsImport/>
          </TabPanel>
          <TabPanel header="Manual">

          </TabPanel>
        </TabView>

      </div>
    
    </div>
  )
}
