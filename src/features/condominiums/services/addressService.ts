import { viaCepApi } from "@/lib/axios";
import type { AddressViaCep } from "../types/responses/AddressViaCep";
import { ApiError } from "@/shared/types/ApiError";

export const getAddressByPostalCode = async (postalCode: string): Promise<AddressViaCep> => {
    const endpoint = `${postalCode}/json/`

    const {data} = await viaCepApi.get<AddressViaCep>(endpoint)
    
    if ("erro" in data && data.erro) {
        throw new ApiError("O CEP informado não foi encontrado")
    }

    return data;
}
