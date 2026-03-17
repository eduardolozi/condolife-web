import { useForm, useWatch, type SubmitHandler } from "react-hook-form"
import { createCondominiumSchema, type CreateCondominiumRequest } from "../types/requests/CreateCondominiumRequest"
import { Button } from "primereact/button"
import { zodResolver } from "@hookform/resolvers/zod"
import { ControllerInputText } from "@/shared/components/ControllerInputText"
import { ControllerInputMask } from "@/shared/components/ControllerInputMask"
import { useCallback, useEffect, useRef } from "react"
import { getAddressByPostalCode } from "../services/addressService"

export const CondominiumForm = () => {
    const {control, setValue, setError, clearErrors, handleSubmit } = useForm<CreateCondominiumRequest>({
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
    const handlePostalCodeLookup = useCallback(async (cep: string) => {
        try {
            const address = await getAddressByPostalCode(cep)
            clearErrors("postalCode")

            setValue("street", address.logradouro)
            setValue("neighborhood", address.bairro)
            setValue("city", address.localidade)
            setValue("state", address.estado)
            setValue("cityIbgeCode", address.ibge)
            clearErrors(["street", "neighborhood", "city", "state"])

        } catch {
            setValue("street", "")
            setValue("neighborhood", "")
            setValue("city", "")
            setValue("state", "")
            setError("postalCode", {
                type: "manual",
                message: "O CEP informado não encontrou endereço"
            })
        }
    }, [clearErrors, setError, setValue])

    useEffect(() => {
        if (!postalCode) return

        const digits = postalCode.replace(/\D/g, "")

        if (digits.length === 8 && digits !== lastPostalCodeRef.current) {
            lastPostalCodeRef.current = digits
            handlePostalCodeLookup(digits)
        }

    }, [postalCode, handlePostalCodeLookup])

    const onSubmit: SubmitHandler<CreateCondominiumRequest> = (data) => {
        console.log(data)
    }

    return (
        <form className="flex w-full flex-col items-center justify-center rounded-xl border-0 py-8 sm:shadow sm:border sm:border-gray-300 sm:px-6 sm:py-10" onSubmit={handleSubmit(onSubmit)}>
            <div className="mb-2 flex w-full flex-col gap-7">
                <p className="font-bold text-green-900 mt-0 text-2xl text-center">Registre seu Condomínio</p>

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

                <div className="flex flex-col gap-7 justify-start md:gap-2 md:flex-row">
                   <ControllerInputText<CreateCondominiumRequest> 
                        propertyName="city"
                        control={control}
                        label="Cidade"
                        className="w-full lg:w-2/3"
                    /> 

                    <ControllerInputText<CreateCondominiumRequest> 
                        propertyName="state"
                        control={control}
                        label="Estado"
                        className="w-full lg:w-1/3"
                    />
                </div>

                <ControllerInputText<CreateCondominiumRequest> 
                    propertyName="complement"
                    control={control}
                    label="Complemento (opcional)"
                />
            </div>

            <Button className="mt-2 w-full" type="submit" label="Criar" severity="success"/>
        </form>
    )
}
