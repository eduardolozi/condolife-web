import type { Address } from "@/features/condominiums/types/Address";

export interface Condominium {
    name: string,
    address: Address
}

export const condominiums: Condominium[] = []