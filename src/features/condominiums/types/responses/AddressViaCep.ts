export interface AddressViaCep {
    cep: string,
    logradouro: string,
    localidade: string,
    estado: string,
    uf: string,
    ibge: string,
    erro?: boolean
}