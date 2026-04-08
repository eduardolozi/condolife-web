import { useMemo } from "react"
import { Column } from "primereact/column"
import { DataTable } from "primereact/datatable"
import { InputText } from "primereact/inputtext"
import { Tag } from "primereact/tag"

export type ResidentTableFieldKey = "name" | "cpf" | "apartment" | "block"

export interface ResidentTableRow {
  id: string
  line: number
  name: string
  cpf: string
  apartment: string
  block: string
}

interface ResidentsTableProps {
  rows: ResidentTableRow[]
  cellErrors: Record<string, string>
  backendErrorVersion: number
  onCellValueChange: (rowId: string, field: ResidentTableFieldKey, value: string) => void
}

const toCellErrorKey = (line: number, field: ResidentTableFieldKey) => `${line}:${field}`

const getCellError = (
  row: ResidentTableRow,
  field: ResidentTableFieldKey,
  cellErrors: Record<string, string>,
) => cellErrors[toCellErrorKey(row.line, field)]

const parseCellErrorKey = (key: string): { line: number; field: ResidentTableFieldKey } | null => {
  const [lineText, fieldText] = key.split(":")
  const line = Number.parseInt(lineText, 10)
  if (!Number.isFinite(line)) return null
  if (!["name", "cpf", "apartment", "block"].includes(fieldText)) return null

  return { line, field: fieldText as ResidentTableFieldKey }
}

export const ResidentsTable = ({
  rows,
  cellErrors,
  backendErrorVersion,
  onCellValueChange,
}: ResidentsTableProps) => {
  const tableRows = useMemo(() => rows.map((row) => ({ ...row })), [rows, cellErrors])

  const rowErrorsMap = useMemo(() => {
    const map = new Map<number, string[]>()

    for (const [key, errorMessage] of Object.entries(cellErrors)) {
      const parsed = parseCellErrorKey(key)
      if (!parsed) continue

      const current = map.get(parsed.line) ?? []
      current.push(errorMessage)
      map.set(parsed.line, current)
    }

    return map
  }, [cellErrors])

  const renderEditableCell = (row: ResidentTableRow, field: ResidentTableFieldKey) => {
    const fieldError = getCellError(row, field, cellErrors)

    return (
      <div className="flex flex-col gap-1">
        <InputText
          value={row[field]}
          onChange={(event) => onCellValueChange(row.id, field, event.target.value)}
          className={`residents-editable-table__input ${fieldError ? "residents-editable-table__input--error" : ""}`}
        />
        {fieldError && <small className="text-red-600">{fieldError}</small>}
      </div>
    )
  }

  const renderValidation = (row: ResidentTableRow) => {
    const rowErrors = rowErrorsMap.get(row.line) ?? []
    const hasErrors = rowErrors.length > 0

    return (
      <div className="flex flex-col gap-1">
        {hasErrors ? (
          <Tag severity="danger" value="Com inconsistências" />
        ) : (
          <Tag severity="success" value="Válido" />
        )}

        {hasErrors && (
          <ul className="m-0 pl-4 text-xs text-red-600">
            {rowErrors.map((errorMessage, index) => (
              <li key={`${row.line}-${errorMessage}-${index}`}>{errorMessage}</li>
            ))}
          </ul>
        )}
      </div>
    )
  }

  return (
    <div className="rounded-xl border border-gray-200 bg-white p-3 sm:p-4">
      <div className="mb-3 flex items-center justify-between gap-3">
        <p className="m-0 text-sm font-semibold text-gray-800">Pré-visualização editável</p>
        <p className="m-0 text-xs text-gray-500">Corrija os campos com inconsistência e confirme o envio novamente.</p>
      </div>

      <DataTable
        key={`residents-table-${backendErrorVersion}`}
        value={tableRows}
        dataKey="id"
        size="small"
        stripedRows
        responsiveLayout="stack"
        breakpoint="1024px"
        className="residents-editable-table"
        tableStyle={{ width: "100%" }}
      >
        <Column field="line" header="Linha" style={{ width: "6%" }} />
        <Column header="Nome" body={(row: ResidentTableRow) => renderEditableCell(row, "name")} style={{ width: "27%" }} />
        <Column header="CPF" body={(row: ResidentTableRow) => renderEditableCell(row, "cpf")} style={{ width: "18%" }} />
        <Column
          header="Apartamento"
          body={(row: ResidentTableRow) => renderEditableCell(row, "apartment")}
          style={{ width: "16%" }}
        />
        <Column header="Bloco" body={(row: ResidentTableRow) => renderEditableCell(row, "block")} style={{ width: "10%" }} />
        <Column header="Validação" body={renderValidation} style={{ width: "23%" }} />
      </DataTable>
    </div>
  )
}

