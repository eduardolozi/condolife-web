import { condolifeServer } from "@/config/dev.config";
import { getAccessToken } from "@/features/auth/services/authService";
import axios, { type InternalAxiosRequestConfig } from "axios";

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
