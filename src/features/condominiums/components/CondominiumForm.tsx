import { useForm, type SubmitHandler } from "react-hook-form"
import { createCondominiumSchema, type CreateCondominiumRequest } from "../types/requests/CreateCondominiumRequest"
import { Button } from "primereact/button"
import { zodResolver } from "@hookform/resolvers/zod"
import { ControllerInputText } from "@/shared/components/ControllerInputText"

export const CondominiumForm = () => {
    const {control, handleSubmit, formState: {errors} } = useForm<CreateCondominiumRequest>({
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

    const onSubmit: SubmitHandler<CreateCondominiumRequest> = (data) => {
        console.log(data)
    }

    return (
        
        <form className="flex flex-col gap-8 justify-center items-center border border-gray-300 p-10 rounded-xl shadow" onSubmit={handleSubmit(onSubmit)}>
            <div className="w-3/4 mb-4 flex flex-col gap-5">
                <p className="font-bold mt-0 text-2xl text-center">Registre seu Condomínio</p>

                <ControllerInputText<CreateCondominiumRequest> 
                    propertyName="name"
                    control={control}
                    label="Nome do condomínio"
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

                <ControllerInputText<CreateCondominiumRequest> 
                    propertyName="state"
                    control={control}
                    label="Estado"
                />

                <ControllerInputText<CreateCondominiumRequest> 
                    propertyName="city"
                    control={control}
                    label="Cidade"
                />

                <ControllerInputText<CreateCondominiumRequest> 
                    propertyName="complement"
                    control={control}
                    label="Complemento"
                />
            </div>

            <Button className="w-3/4" type="submit" label="Criar" severity="success"/>
        </form>
    )
}