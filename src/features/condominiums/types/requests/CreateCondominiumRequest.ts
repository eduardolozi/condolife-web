import z from "zod"

export type CreateCondominiumRequest = z.infer<typeof createCondominiumSchema>

export const createCondominiumSchema = z.object({
    condominiumName: z.string().nonempty("O nome do condomínio deve ser informado").max(20, "O nome do condomínio deve possuir até 20 caracteres"),
    
    postalCode: z.string()
        .transform(v => v.replace(/\D/g, ""))
        .refine(v => v.length === 8, {
            message: "O CEP deve possuir 8 dígitos"
        }),

    street: z.string().nonempty("A rua deve ser informada"),
    neighborhood: z.string().nonempty("O bairro deve ser informado"),
    number: z.string().nonempty("O número de endereço deve ser informado."),
    ibgeCode: z.string().length(7, "O codigo Ibge deve possuir 7 dígitos"),
    stateCode: z.string().nonempty("A UF deve ser informada").length(2, "A UF deve possuir 2 caracteres"),
    city: z.string().nonempty("A cidade deve ser informado"),
    complement: z.string().nullable()
})