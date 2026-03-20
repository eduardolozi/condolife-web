import { condolifeApi } from "@/lib/axios"
import type { CondominiumMembership } from "../types/CondominiumMembership"

const controllerPath = "/CondominiumMembership"

export const getCondominiumMemberships = async () => {
    const endpoint = `${controllerPath}/me`
    const response = await condolifeApi.get<CondominiumMembership[]>(endpoint)
    return response.data;
}