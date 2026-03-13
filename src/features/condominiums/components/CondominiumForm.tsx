import { Controller, useForm, type SubmitHandler } from "react-hook-form"
import { createCondominiumSchema, type CreateCondominiumRequest } from "../types/requests/CreateCondominiumRequest"
import { Button } from "primereact/button"
import { zodResolver } from "@hookform/resolvers/zod"
import { InputText } from "primereact/inputtext"
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
        
        <form className="flex flex-col gap-4 justify-center items-center" onSubmit={handleSubmit(onSubmit)}>
            <div className="w-2/4">
                <ControllerInputText<CreateCondominiumRequest> propertyName="name" control={control}/>

            </div>
            <Button className="w-1/4" type="submit" label="Criar" severity="success"/>
        </form>
    )
}