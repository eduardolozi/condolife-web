import { ResidentsCsvHelp } from '@/features/onboarding/components/ResidentsCsvHelp'
import { ResidentsImport } from '@/features/onboarding/components/ResidentsImport'
import { PageTitle } from '@/shared/components/PageTitle'
import { createFileRoute } from '@tanstack/react-router'
import { TabPanel, TabView } from 'primereact/tabview'
import { useState } from 'react'

export const Route = createFileRoute('/_authenticated/condominiums/$condominiumId/management/resident-pre-registration')({
  component: RouteComponent,
})

function RouteComponent() {
  const [activeTabIndex, setActiveTabIndex] = useState(0)

  const tooltip = (
    <div className="w-[min(22rem,calc(100vw-2rem))] border border-yellow-500/60 bg-yellow-100 rounded-md px-4 py-3">
      <p className="mt-3 font-semibold text-lg mb-0 text-yellow-950">Sobre esta etapa</p>
      <p className="text-yellow-950 mt-2 text-sm">
        Este cadastro não adiciona o proprietário automaticamente ao condomínio.
      </p>

      <p className="text-yellow-950 mt-2 text-sm">
        Ele funciona como um pré-cadastro para facilitar a entrada do proprietário e aumentar a segurança do condomínio.
      </p>

      <p className="text-yellow-950 mt-2 text-sm">
        Quando o proprietário criar a conta dele, os dados informados serão comparados com este pré-cadastro.
        Se as informações estiverem corretas, o acesso ao condomínio será liberado.
      </p>
    </div>
  )

  return (
    <div>
      <PageTitle text="Cadastro de Proprietários" infoContent={tooltip} />

      <div className="flex flex-col xl:flex-row xl:justify-between gap-5 w-full md:self-center">
        <div className="w-full xl:w-2/3">
          <TabView activeIndex={activeTabIndex} onTabChange={(e) => setActiveTabIndex(e.index)}>
            <TabPanel header="Importação">
              <ResidentsImport />
            </TabPanel>
            <TabPanel header="Manual"></TabPanel>
          </TabView>
        </div>

        {activeTabIndex === 0 && (
          <div className="hidden xl:block w-full xl:w-1/3 xl:max-w-sm">
            <ResidentsCsvHelp variant="side" />
          </div>
        )}
      </div>
    </div>
  )
}
