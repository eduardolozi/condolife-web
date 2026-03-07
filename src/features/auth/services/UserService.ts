import { condolifeServer } from "@/config/dev.config"
import { condolifeApi } from "@/lib/axios";
import type { CurrentUser } from "../types/currentUser";

const controllerPath = '/Users'

const createCurrentUser = async () : Promise<CurrentUser> => {
    const endpoint = `${controllerPath}/me`
    const { data } = await condolifeApi.post<CurrentUser>(endpoint)
    // verificar criacao de ApiError e de interceptors do axios.
    return data
}

const getCurrentUser = () => {
    const endpoint = `${controllerPath}/me`
    condolifeApi.get<CurrentUser>(endpoint)    

}