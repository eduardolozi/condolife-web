import { condolifeApi } from "@/lib/axios"
import type { CreateCondominiumRequest } from "../types/requests/CreateCondominiumRequest"
import type { GetCondominiumResponse } from "../types/responses/GetCondominiumResponse";

const controllerPath = '/Condominium'

export const createCondominium = async (request: CreateCondominiumRequest) => {
    await condolifeApi.post(controllerPath, request);
}

export const getCondominium = async (id: number) : Promise<GetCondominiumResponse> => {
    const endpoint = `${controllerPath}/${id}`
    var result = await condolifeApi.get<GetCondominiumResponse>(endpoint)
    return result.data;
}