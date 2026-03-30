import { useState } from "react"
import { ResidentsCsvHelp } from "@/features/onboarding/components/ResidentsCsvHelp"
import { FileSelector } from "@/shared/components/FileSelector"
import { Button } from "primereact/button"
import { Dialog } from "primereact/dialog"

export const ResidentsImport = () => {
  const [isHelpOpen, setIsHelpOpen] = useState(false)

  return (
    <div className="flex flex-col gap-3">
      <div className="xl:hidden border border-emerald-700/50 bg-emerald-50/60 rounded-md px-4 py-3">
        <p className="m-0 text-lg font-semibold text-emerald-950">Antes de importar</p>
        <Button
          id="residents-import-help-button"
          type="button"
          label="Veja esta ajuda sobre formato dos dados na planilha"
          icon="pi pi-external-link"
          iconPos="right"
          size="small"
          text
          className="mt-0 text-sm text-start px-0 pb-0 text-emerald-700"
          onClick={() => setIsHelpOpen(true)}
        />
      </div>

      <div className="border border-blue-800/60 flex flex-col justify-start bg-blue-500/10 px-4 rounded-md">
        <p className="mt-3 font-semibold text-lg mb-0 text-blue-950">Dica rápida</p>
        <p className="mt-2 text-sm">Para varios proprietarios, utilize a importacao via planilha. Certifique-se de que os campos estejam com os valores corretos.</p>
      </div>

      <FileSelector
        handleSelect={async () => await new Promise((resolve) => setTimeout(resolve, 1000))}
        maxSize={1000000}
        supportedExtensions={[".csv"]}
      />

      <div className="flex flex-col md:flex-row justify-between px-4 py-2 rounded-md bg-gray-100">
        <div className="flex items-center justify-center gap-3">
          <i className="pi pi-file-import bg-emerald-600/10 p-3 rounded text-emerald-700"></i>
          <div>
            <p className="mb-1 font-semibold">Modelo de planilha</p>
            <p className="mt-1 text-xs">Baixe o modelo .csv com a estrutura pronta para uso.</p>
          </div>
        </div>

        <Button
          className="mb-3 md:mb-0 text-emerald-600"
          text
          size="small"
          label="Baixar modelo"
          iconPos="right"
          icon="pi pi-download"
        />
      </div>

      <Dialog
        visible={isHelpOpen}
        onHide={() => {
          setIsHelpOpen(false)
          document.getElementById("residents-import-help-button")?.focus()
        }}
        header="Formato completo do CSV"
        modal
        dismissableMask
        draggable={false}
        resizable={false}
        closeOnEscape
        position="bottom"
        className="residents-help-mobile-dialog xl:hidden"
        pt={{
          mask: { className: "residents-help-mobile-dialog-mask" },
          content: { className: "residents-help-mobile-dialog__content" }
        }}
      >
        <ResidentsCsvHelp variant="sheet" />
      </Dialog>
    </div>
  )
}
