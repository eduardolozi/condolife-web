import { condolifeServer } from "@/config/dev.config";
import { getAccessToken } from "@/features/auth/services/authService";
import { ApiError } from "@/shared/types/ApiError";
import axios, { type AxiosInstance, type InternalAxiosRequestConfig } from "axios";

export const condolifeApi = axios.create({
    baseURL: condolifeServer.url,
    withCredentials: false,
    headers: {
        'Content-Type': 'application/json'
    }
})

condolifeApi.interceptors.request.use(async (config: InternalAxiosRequestConfig) => {
  const token = await getAccessToken()
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});


export const viaCepApi = axios.create({
    baseURL: "https://viacep.com.br/ws/",
    withCredentials: false
})

const toApiError = (error: unknown): ApiError => {
  if (!axios.isAxiosError(error)) 
    return new ApiError("Erro inesperado")
  
  if (!error.response) 
    return new ApiError("Erro de conexão")

  const data = error.response.data

  if (typeof data?.message === "string") {
    return  new ApiError(
      data.message,
      Array.isArray(data.errors) ? data.errors : undefined
    )
  }

  if (typeof data?.title === "string") {
    return new ApiError(
      data.title,
      Array.isArray(data.errors) ? data.errors : undefined
    )
  }

  return new ApiError(
    `Requisição falhou com status ${error.response.status}`
  )
}

export const attachApiErrorInterceptor = (client: AxiosInstance) => {
  client.interceptors.response.use(
    response => response,
    error => Promise.reject(toApiError(error)),
  )
}