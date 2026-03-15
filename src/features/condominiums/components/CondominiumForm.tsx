import { useForm, useWatch, type SubmitHandler } from "react-hook-form"
import { createCondominiumSchema, type CreateCondominiumRequest } from "../types/requests/CreateCondominiumRequest"
import { Button } from "primereact/button"
import { zodResolver } from "@hookform/resolvers/zod"
import { ControllerInputText } from "@/shared/components/ControllerInputText"
import { ControllerInputMask } from "@/shared/components/ControllerInputMask"
import { useEffect, useRef } from "react"
import { getAddressByPostalCode } from "../services/addressService"

export const CondominiumForm = () => {
    const {control, setValue, handleSubmit, formState: {errors} } = useForm<CreateCondominiumRequest>({
        resolver: zodResolver(createCondominiumSchema),
        defaultValues: {
            name: "",
            postalCode: "",
            street: "",
            neighborhood: "",
            number: "",
            cityIbgeCode: "",
            state: "",
            city: "",
            complement: null
        }
    })

    const postalCode = useWatch({
        control,
        name: 'postalCode'
    })
    
    const lastPostalCodeRef = useRef<string | null>(null)
    useEffect(() => {
        if (!postalCode) return

        const digits = postalCode.replace(/\D/g, "")

        if (digits.length === 8 && digits !== lastPostalCodeRef.current) {
            lastPostalCodeRef.current = digits
            handlePostalCodeLookup(digits)
        }

    }, [postalCode])

    const handlePostalCodeLookup = async (cep: string) => {
        try {
            const address = await getAddressByPostalCode(cep)

            setValue("street", address.logradouro)
            setValue("neighborhood", address.bairro)
            setValue("city", address.localidade)
            setValue("state", address.uf)

        } catch (error) {
            console.error(error)
        }
    }

    const onSubmit: SubmitHandler<CreateCondominiumRequest> = (data) => {
        console.log(data)
    }

    return (
        
        <form className="flex pb-6 flex-col gap-5 justify-center items-center border border-gray-300 py-10 rounded-xl shadow" onSubmit={handleSubmit(onSubmit)}>
            <div className="w-3/5 mb-2 flex flex-col gap-5">
                <p className="font-bold mt-0 text-2xl text-center">Registre seu Condomínio</p>

                <ControllerInputText<CreateCondominiumRequest> 
                    propertyName="name"
                    control={control}
                    label="Nome do condomínio"
                />

                <ControllerInputMask
                    propertyName="postalCode"
                    control={control}
                    label="CEP"
                    mask="99999-999"
                />

                <ControllerInputText<CreateCondominiumRequest> 
                    propertyName="street"
                    control={control}
                    label="Rua"
                />

                <ControllerInputText<CreateCondominiumRequest> 
                    propertyName="neighborhood"
                    control={control}
                    label="Bairro"
                />

                <ControllerInputText<CreateCondominiumRequest> 
                    propertyName="number"
                    control={control}
                    label="Número"
                />

                <div className="flex flex-row justify-start gap-2">
                   <ControllerInputText<CreateCondominiumRequest> 
                        propertyName="city"
                        control={control}
                        label="Cidade"
                        className="w-2/3"
                    /> 

                    <ControllerInputText<CreateCondominiumRequest> 
                        propertyName="state"
                        control={control}
                        label="UF"
                        className="w-1/10 md:w-1/4 sm:w-1/4"
                    />
                </div>

                <ControllerInputText<CreateCondominiumRequest> 
                    propertyName="complement"
                    control={control}
                    label="Complemento"
                />
            </div>

            <Button className="w-3/5 mb-2" type="submit" label="Criar" severity="success"/>
        </form>
    )
}