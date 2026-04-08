import { useMemo } from "react"
import { Column } from "primereact/column"
import { DataTable } from "primereact/datatable"
import { InputText } from "primereact/inputtext"
import { Tag } from "primereact/tag"
import { Button } from "primereact/button"

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
  rowBackendStatus: Record<number, boolean>
  editedRows: Record<number, boolean>
  backendErrorVersion: number
  onCellValueChange: (rowId: string, field: ResidentTableFieldKey, value: string) => void
  onRowDelete: (rowId: string) => void
}

const toCellErrorKey = (line: number, field: ResidentTableFieldKey) => `${line}:${field}`

const getCellError = (
  row: ResidentTableRow,
  field: ResidentTableFieldKey,
  cellErrors: Record<string, string>,
) => cellErrors[toCellErrorKey(row.line, field)]

export const ResidentsTable = ({
  rows,
  cellErrors,
  rowBackendStatus,
  editedRows,
  backendErrorVersion,
  onCellValueChange,
  onRowDelete,
}: ResidentsTableProps) => {
  const tableRows = useMemo(() => rows.map((row) => ({ ...row })), [rows, cellErrors])

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
    if (editedRows[row.line]) return null

    const hasErrors = rowBackendStatus[row.line] === true

    return (
      <div className="flex flex-col gap-1">
        {hasErrors ? <Tag severity="danger" value="Inconsistente" /> : <Tag severity="success" value="Válido" />}
      </div>
    )
  }

  const renderActions = (row: ResidentTableRow) => (
    <Button
      type="button"
      icon="pi pi-trash"
      text
      severity="danger"
      size="small"
      rounded
      aria-label={`Excluir linha ${row.line}`}
      onClick={() => onRowDelete(row.id)}
    />
  )

  return (
    <div className="rounded-xl border border-gray-200 bg-white p-3 sm:p-4">
      <div className="mb-3 flex items-center justify-between gap-3">
        <p className="m-0 text-sm font-semibold text-gray-800">Pre-visualizacao editavel</p>
        <p className="m-0 text-xs text-gray-500">Corrija os campos com inconsistencias e confirme o envio novamente.</p>
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
        <Column field="line" header="Linha" />
        <Column header="Nome" body={(row: ResidentTableRow) => renderEditableCell(row, "name")} />
        <Column header="CPF" body={(row: ResidentTableRow) => renderEditableCell(row, "cpf")} />
        <Column header="Apartamento" body={(row: ResidentTableRow) => renderEditableCell(row, "apartment")} />
        <Column header="Bloco" body={(row: ResidentTableRow) => renderEditableCell(row, "block")} />
        <Column header="Situação" body={renderValidation} />
        <Column header="" body={renderActions} />
      </DataTable>
    </div>
  )
}
