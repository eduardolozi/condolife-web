export interface Address {
    state: string,
    city: string,
    ibge: number,
    postalCode: string,
    neighborhood: string,
    street: string,
    number: string,
    complement: string | null
}