import z from "zod"

export type CreateCondominiumRequest = z.infer<typeof createCondominiumSchema>

export const createCondominiumSchema = z.object({
    name: z.string().nonempty("O nome do condomínio deve ser informado"),
    postalCode: z.string().length(8, "O CEP deve possuir 8 dígitos"),
    street: z.string().nonempty("A rua deve ser informada"),
    neighborhood: z.string().nonempty("O bairro deve ser informado"),
    number: z.string().nonempty("O número de endereço deve ser informado."),
    cityIbgeCode: z.string().length(7, "O codigo Ibge deve possuir 7 dígitos"),
    state: z.string().nonempty("O Estado deve ser informado"),
    city: z.string().nonempty("A cidade deve ser informado"),
    complement: z.string().nullable()
})