import { condolifeServer } from "@/config/dev.config"
import { getAccessToken } from "@/features/auth/services/authService"
import { ApiError, type ValidationError } from "@/shared/types/ApiError"
import axios, { type AxiosInstance, type InternalAxiosRequestConfig } from "axios"

export const condolifeApi = axios.create({
  baseURL: condolifeServer.url,
  withCredentials: false,
  headers: {
    "Content-Type": "application/json",
  },
})

condolifeApi.interceptors.request.use(async (config: InternalAxiosRequestConfig) => {
  const token = await getAccessToken()
  if (token) config.headers.Authorization = `Bearer ${token}`
  return config
})

export const viaCepApi = axios.create({
  baseURL: "https://viacep.com.br/ws/",
  withCredentials: false,
})

const normalizeValidationError = (item: unknown): ValidationError | null => {
  if (typeof item !== "object" || item === null) return null

  const record = item as { field?: unknown; message?: unknown; line?: unknown }
  if (typeof record.message !== "string" || record.message.trim().length === 0) return null

  const normalizedField = typeof record.field === "string" ? record.field : undefined

  let normalizedLine: number | undefined
  if (typeof record.line === "number" && Number.isFinite(record.line)) {
    normalizedLine = record.line
  } else if (typeof record.line === "string" && record.line.trim().length > 0) {
    const parsedLine = Number.parseInt(record.line, 10)
    if (Number.isFinite(parsedLine)) normalizedLine = parsedLine
  }

  return {
    field: normalizedField,
    message: record.message,
    line: normalizedLine,
  }
}

const toApiError = (error: unknown): ApiError => {
  if (!axios.isAxiosError(error)) {
    return new ApiError("Erro inesperado")
  }

  if (!error.response) {
    return new ApiError("Erro de conexão")
  }

  const data = error.response.data

  const message =
    (typeof data?.message === "string" && data.message) ||
    (typeof data?.title === "string" && data.title) ||
    `Requisição falhou com status ${error.response.status}`

  const stringErrors = Array.isArray(data?.errors)
    ? data.errors.filter((item: unknown): item is string => typeof item === "string")
    : undefined

  const validationErrorsSource: unknown[] | undefined = Array.isArray(data?.validationErrors)
    ? data.validationErrors
    : Array.isArray(data?.errors)
      ? data.errors
      : undefined

  const validationErrors = validationErrorsSource
    ?.map(normalizeValidationError)
    .filter((item: ValidationError | null): item is ValidationError => item !== null)

  return new ApiError(
    message,
    stringErrors?.length ? stringErrors : undefined,
    validationErrors?.length ? validationErrors : undefined,
  )
}

export const attachApiErrorInterceptor = (client: AxiosInstance) => {
  client.interceptors.response.use(
    (response) => response,
    (error) => Promise.reject(toApiError(error)),
  )
}

attachApiErrorInterceptor(condolifeApi)
attachApiErrorInterceptor(viaCepApi)
