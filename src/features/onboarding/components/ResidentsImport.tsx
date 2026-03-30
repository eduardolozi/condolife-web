import { FileSelector } from "@/shared/components/FileSelector"
import { Button } from "primereact/button"

export const ResidentsImport = () => {
    return (
        <div className="flex flex-col gap-3">
            <div className="border border-blue-800/60 flex flex-col justify-start bg-blue-500/10 px-4 rounded-md">
                <p className="mt-3 font-semibold text-lg mb-0 text-blue-950">Dica rápida</p>
                <p className="mt-2 text-sm">Para vários proprietários, utilize a importação via planilha. Certifique-se de que os campos CPF e Apartamento estejam no formato correto.</p>
            </div>

            <FileSelector
                handleSelect={async () => await new Promise(resolve => setTimeout(resolve, 1000))}
                maxSize={1000000}
                supportedExtensions={['.csv', '.txt']}
            />

            <div className="flex flex-col md:flex-row justify-between px-4 py-2 rounded-md bg-gray-100">
                <div className="flex items-center justify-center gap-3">
                    <i className="pi pi-file-import bg-emerald-600/10 p-3 rounded text-emerald-700"></i>
                    <div>
                        <p className="mb-1 font-semibold">Modelo de planilha</p>
                        <p className="mt-1 text-xs">Baixe o modelo e siga o padrão colocando os proprietários das unidades.</p>
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
        </div>
    )
}