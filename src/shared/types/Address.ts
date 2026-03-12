export interface Address {
    country: string,
    state: string,
    city: string,
    postalCode: string,
    neighborhood: string | null,
    street: string,
    number: string | null
}