import { condolifeServer } from "@/config/dev.config";
import axios from "axios";

const condolifeApi = axios.create({
    baseURL: condolifeServer.url,
    withCredentials: false,
    headers: {'Content-Type': 'application/json'}
})

export {condolifeApi}