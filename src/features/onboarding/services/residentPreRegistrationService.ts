import { condolifeApi } from "@/lib/axios"

export interface ImportResidentPreRegistrationRowError {
  field: string
  message: string
}

export interface ImportResidentPreRegistrationRowData {
  name: string
  cpf: string
  apartment: string
  block: string | null
}

export interface ImportResidentPreRegistrationRow {
  line: number
  data: ImportResidentPreRegistrationRowData
  errors: ImportResidentPreRegistrationRowError[]
}

export interface ImportResidentPreRegistrationResponse {
  success: boolean
  message: string
  rows: ImportResidentPreRegistrationRow[]
}

const controllerPath = "/Management"

const extractFilenameFromHeader = (headerValue?: string): string => {
  if (!headerValue) return "resident-pre-registration-template.csv"

  const match = headerValue.match(/filename\*?=(?:UTF-8''|")?([^\";]+)/i)
  if (!match?.[1]) return "resident-pre-registration-template.csv"

  return decodeURIComponent(match[1].replace(/"/g, "").trim())
}

export const downloadResidentPreRegistrationTemplate = async () => {
  const response = await condolifeApi.get<Blob>(
    `${controllerPath}/resident-pre-registration-template`,
    { responseType: "blob" },
  )

  const filename = extractFilenameFromHeader(response.headers["content-disposition"])

  return {
    blob: response.data,
    filename,
  }
}

export const importResidentPreRegistration = async (
  condominiumId: number,
  file: File,
): Promise<ImportResidentPreRegistrationResponse> => {
  const formData = new FormData()
  formData.append("file", file)

  const response = await condolifeApi.post<ImportResidentPreRegistrationResponse>(
    `${controllerPath}/resident-pre-registration/${condominiumId}`,
    formData,
    {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    },
  )

  return response.data
}
