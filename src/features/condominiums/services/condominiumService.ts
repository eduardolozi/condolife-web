import { condolifeApi } from "@/lib/axios"
import type { CreateCondominiumRequest } from "../types/requests/CreateCondominiumRequest"

const controllerPath = '/Condominium'

export const createCondominium = async (request: CreateCondominiumRequest) => {
    await condolifeApi.post(controllerPath, request);
}