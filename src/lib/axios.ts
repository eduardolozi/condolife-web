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

const isValidationError = (item: unknown): item is ValidationError => {
  if (typeof item !== "object" || item === null) return false

  const record = item as { field?: unknown; message?: unknown; line?: unknown }
  return (
    typeof record.message === "string" &&
    (record.field === undefined || typeof record.field === "string") &&
    (record.line === undefined || typeof record.line === "number")
  )
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

  const validationErrors = Array.isArray(data?.validationErrors)
    ? data.validationErrors.filter(isValidationError)
    : Array.isArray(data?.errors)
      ? data.errors.filter(isValidationError)
      : undefined

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
