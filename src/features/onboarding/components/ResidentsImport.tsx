import { useEffect, useMemo, useState } from "react"
import { ResidentsCsvHelp } from "@/features/onboarding/components/ResidentsCsvHelp"
import { FileSelector } from "@/shared/components/FileSelector"
import { Button } from "primereact/button"
import { Dialog } from "primereact/dialog"
import { ApiError, type ValidationError } from "@/shared/types/ApiError"
import {
  downloadResidentPreRegistrationTemplate,
  importResidentPreRegistration,
  type ImportResidentPreRegistrationResponse,
} from "@/features/onboarding/services/residentPreRegistrationService"
import {
  ResidentsTable,
  type ResidentTableFieldKey,
  type ResidentTableRow,
} from "./ResidentsTable"

interface ResidentsImportProps {
  condominiumId: number
}

interface ImportErrorDialogState {
  visible: boolean
  message: string
  stringErrors: string[]
  validationErrors: ValidationError[]
}

const DEFAULT_TEMPLATE_HEADER = "Nome;Cpf;Apartamento;Bloco"

const normalizeFieldName = (value?: string) => {
  if (!value) return ""
  return value
    .trim()
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
}

const toFieldKey = (field?: string): ResidentTableFieldKey | null => {
  const normalized = normalizeFieldName(field)

  if (normalized.includes("name") || normalized.includes("nome")) return "name"
  if (normalized.includes("cpf")) return "cpf"
  if (normalized.includes("apartamento") || normalized.includes("apartment") || normalized.includes("apt")) {
    return "apartment"
  }
  if (normalized.includes("bloco") || normalized.includes("block")) return "block"

  return null
}

const toCellErrorKey = (line: number, field: ResidentTableFieldKey) => `${line}:${field}`

const escapeCsvValue = (value: string) => {
  if (value.includes(";") || value.includes("\n") || value.includes('"')) {
    return `"${value.replace(/"/g, '""')}"`
  }

  return value
}

const readTemplateHeader = async () => {
  try {
    const { blob } = await downloadResidentPreRegistrationTemplate()
    const content = (await blob.text()).replace(/^\uFEFF/, "")
    const firstLine = content.split(/\r?\n/).find((line) => line.trim().length > 0)
    return firstLine?.trim() || DEFAULT_TEMPLATE_HEADER
  } catch {
    return DEFAULT_TEMPLATE_HEADER
  }
}

const buildCsvFromRows = async (rows: ResidentTableRow[]) => {
  const header = await readTemplateHeader()
  const dataLines = rows.map((row) =>
    [row.name, row.cpf, row.apartment, row.block]
      .map((value) => escapeCsvValue(value.trim()))
      .join(";"),
  )

  return [header, ...dataLines].join("\n")
}

const mapResponseRowsToTableRows = (response: ImportResidentPreRegistrationResponse): ResidentTableRow[] =>
  response.rows.map((row) => ({
    id: `${row.line}-${row.data.cpf}-${row.data.apartment}-${row.data.block ?? ""}`,
    line: row.line,
    name: row.data.name ?? "",
    cpf: row.data.cpf ?? "",
    apartment: row.data.apartment ?? "",
    block: row.data.block ?? "",
  }))

const mapResponseCellErrors = (response: ImportResidentPreRegistrationResponse) => {
  const mappedCellErrors: Record<string, string> = {}

  for (const row of response.rows) {
    for (const error of row.errors) {
      const fieldKey = toFieldKey(error.field)
      if (!fieldKey) continue
      mappedCellErrors[toCellErrorKey(row.line, fieldKey)] = error.message
    }
  }

  return mappedCellErrors
}

const remapCellErrorsAfterDelete = (
  currentErrors: Record<string, string>,
  deletedLine: number,
): Record<string, string> => {
  const updated: Record<string, string> = {}

  for (const [key, message] of Object.entries(currentErrors)) {
    const [lineText, field] = key.split(":")
    const line = Number.parseInt(lineText, 10)
    if (!Number.isFinite(line) || !field) continue
    if (line === deletedLine) continue

    const targetLine = line > deletedLine ? line - 1 : line
    updated[`${targetLine}:${field}`] = message
  }

  return updated
}

export const ResidentsImport = ({ condominiumId }: ResidentsImportProps) => {
  const [isHelpOpen, setIsHelpOpen] = useState(false)
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [isDownloadingTemplate, setIsDownloadingTemplate] = useState(false)
  const [isConfirmingImport, setIsConfirmingImport] = useState(false)
  const [rows, setRows] = useState<ResidentTableRow[]>([])
  const [cellErrors, setCellErrors] = useState<Record<string, string>>({})
  const [backendErrorVersion, setBackendErrorVersion] = useState(0)
  const [processingMessage, setProcessingMessage] = useState<string | null>(null)
  const [successDialog, setSuccessDialog] = useState<{ visible: boolean; importedCount: number }>({
    visible: false,
    importedCount: 0,
  })
  const [errorDialog, setErrorDialog] = useState<ImportErrorDialogState>({
    visible: false,
    message: "",
    stringErrors: [],
    validationErrors: [],
  })

  useEffect(() => {
    setRows([])
    setCellErrors({})
    setBackendErrorVersion(0)
    setProcessingMessage(null)
  }, [selectedFile])

  const groupedValidationErrors = useMemo(() => {
    const grouped = new Map<string, ValidationError[]>()

    for (const validationError of errorDialog.validationErrors) {
      const key = typeof validationError.line === "number" ? `Linha ${validationError.line}` : "Geral"
      if (!grouped.has(key)) {
        grouped.set(key, [])
      }
      grouped.get(key)?.push(validationError)
    }

    return [...grouped.entries()].sort((a, b) => {
      if (a[0] === "Geral") return 1
      if (b[0] === "Geral") return -1
      return Number(a[0].replace("Linha ", "")) - Number(b[0].replace("Linha ", ""))
    })
  }, [errorDialog.validationErrors])

  const handleTemplateDownload = async () => {
    try {
      setIsDownloadingTemplate(true)
      const { blob, filename } = await downloadResidentPreRegistrationTemplate()
      const url = URL.createObjectURL(blob)
      const link = document.createElement("a")
      link.href = url
      link.download = filename
      document.body.appendChild(link)
      link.click()
      link.remove()
      URL.revokeObjectURL(url)
    } catch {
      setErrorDialog({
        visible: true,
        message: "Não foi possível baixar o modelo da planilha.",
        stringErrors: [],
        validationErrors: [],
      })
    } finally {
      setIsDownloadingTemplate(false)
    }
  }

  const handleCellValueChange = (rowId: string, field: ResidentTableFieldKey, value: string) => {
    let updatedLine: number | null = null

    setRows((currentRows) =>
      currentRows.map((row) => {
        if (row.id !== rowId) return row
        updatedLine = row.line
        return { ...row, [field]: value }
      }),
    )

    if (updatedLine === null) return

    const key = toCellErrorKey(updatedLine, field)
    setCellErrors((currentErrors) => {
      if (!currentErrors[key]) return currentErrors
      const updatedErrors = { ...currentErrors }
      delete updatedErrors[key]
      return updatedErrors
    })
  }

  const handleRowDelete = (rowId: string) => {
    let deletedLine: number | null = null

    setRows((currentRows) => {
      const target = currentRows.find((row) => row.id === rowId)
      if (!target) return currentRows

      deletedLine = target.line

      return currentRows
        .filter((row) => row.id !== rowId)
        .map((row) => (row.line > target.line ? { ...row, line: row.line - 1 } : row))
    })

    if (deletedLine === null) return

    setCellErrors((currentErrors) => remapCellErrorsAfterDelete(currentErrors, deletedLine as number))
    setBackendErrorVersion((current) => current + 1)
  }

  const handleImportConfirmation = async () => {
    if (!selectedFile && rows.length === 0) return

    try {
      setIsConfirmingImport(true)

      let payloadFile: File
      if (rows.length > 0) {
        const csvContent = await buildCsvFromRows(rows)
        payloadFile = new File(
          [csvContent],
          selectedFile?.name ?? "resident-pre-registration.csv",
          { type: "text/csv" },
        )
      } else {
        payloadFile = selectedFile as File
      }

      const response = await importResidentPreRegistration(condominiumId, payloadFile)

      if (response.success) {
        setSuccessDialog({
          visible: true,
          importedCount: response.rows.length,
        })
        setSelectedFile(null)
        setRows([])
        setCellErrors({})
        setBackendErrorVersion(0)
        setProcessingMessage(null)
        return
      }

      setRows(mapResponseRowsToTableRows(response))
      setCellErrors(mapResponseCellErrors(response))
      setBackendErrorVersion((current) => current + 1)
      setProcessingMessage(response.message || "Arquivo processado com inconsistências.")
    } catch (error) {
      if (error instanceof ApiError) {
        setErrorDialog({
          visible: true,
          message: error.message,
          stringErrors: error.errors ?? [],
          validationErrors: error.validationErrors ?? [],
        })
      } else {
        setErrorDialog({
          visible: true,
          message: "Erro inesperado ao importar arquivo.",
          stringErrors: [],
          validationErrors: [],
        })
      }
    } finally {
      setIsConfirmingImport(false)
    }
  }

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
        <p className="mt-2 text-sm">
          Para vários proprietários, utilize a importação via planilha. Certifique-se de que os campos estejam com os valores corretos.
        </p>
      </div>

      <FileSelector
        maxSize={1000000}
        supportedExtensions={[".csv", ".txt"]}
        selectedFile={selectedFile}
        onFileSelected={setSelectedFile}
      />

      {processingMessage && (
        <div className="rounded-md border border-amber-400 bg-amber-50 px-3 py-2 text-sm text-amber-900">
          {processingMessage}
        </div>
      )}

      {rows.length > 0 && (
        <ResidentsTable
          rows={rows}
          cellErrors={cellErrors}
          backendErrorVersion={backendErrorVersion}
          onCellValueChange={handleCellValueChange}
          onRowDelete={handleRowDelete}
        />
      )}

      {(selectedFile || rows.length > 0) && (
        <div className="flex justify-stretch md:justify-end">
          <Button
            type="button"
            label="Confirmar envio"
            icon="pi pi-check"
            className="w-full md:w-auto bg-emerald-600 border-emerald-600 hover:bg-emerald-700 hover:border-emerald-700"
            loading={isConfirmingImport}
            onClick={handleImportConfirmation}
          />
        </div>
      )}

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
          loading={isDownloadingTemplate}
          onClick={handleTemplateDownload}
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
          content: { className: "residents-help-mobile-dialog__content" },
        }}
      >
        <ResidentsCsvHelp variant="sheet" />
      </Dialog>

      <Dialog
        visible={successDialog.visible}
        onHide={() => setSuccessDialog({ visible: false, importedCount: 0 })}
        header="Importação concluída"
        modal
        draggable={false}
        resizable={false}
        style={{ width: "30rem", maxWidth: "92vw" }}
      >
        <p className="m-0 text-gray-700">{successDialog.importedCount} moradores importados com sucesso.</p>
      </Dialog>

      <Dialog
        visible={errorDialog.visible}
        onHide={() => setErrorDialog({ visible: false, message: "", stringErrors: [], validationErrors: [] })}
        header="Falha na importação"
        modal
        draggable={false}
        resizable={false}
        style={{ width: "36rem", maxWidth: "95vw" }}
      >
        <div className="flex flex-col gap-3">
          <p className="m-0 text-gray-700">{errorDialog.message}</p>

          {groupedValidationErrors.length > 0 && (
            <div className="max-h-[46vh] overflow-y-auto rounded-xl border border-gray-200 bg-gray-50 p-3">
              {groupedValidationErrors.map(([groupLabel, groupErrors]) => (
                <div key={groupLabel} className="mb-3 last:mb-0">
                  <p className="m-0 text-sm font-semibold text-gray-900">{groupLabel}</p>
                  <ul className="m-0 mt-1 pl-5 text-sm text-gray-700">
                    {groupErrors.map((groupError, index) => (
                      <li key={`${groupLabel}-${groupError.field ?? "field"}-${groupError.message}-${index}`}>
                        <span className="font-medium">{groupError.field ?? "Registro"}</span>: {groupError.message}
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          )}

          {errorDialog.stringErrors.length > 0 && (
            <ul className="m-0 rounded-xl border border-gray-200 bg-gray-50 p-4 pl-8 text-sm text-gray-700">
              {errorDialog.stringErrors.map((stringError, index) => (
                <li key={`${stringError}-${index}`}>{stringError}</li>
              ))}
            </ul>
          )}
        </div>
      </Dialog>
    </div>
  )
}
