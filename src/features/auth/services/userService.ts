import { condolifeApi } from "@/lib/axios";
import type { CurrentUser } from "../types/currentUser";

const controllerPath = '/User'

export const getOrCreateCurrentUser =  async() => {
    const endpoint = `${controllerPath}/me`
    var response = await condolifeApi.post<CurrentUser>(endpoint)
    return response.data
}
