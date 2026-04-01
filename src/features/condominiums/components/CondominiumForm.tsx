import { useForm, useWatch, type SubmitHandler } from "react-hook-form"
import { createCondominiumSchema, type CreateCondominiumRequest } from "../types/requests/CreateCondominiumRequest"
import { Button } from "primereact/button"
import { zodResolver } from "@hookform/resolvers/zod"
import { ControllerInputText } from "@/shared/components/ControllerInputText"
import { ControllerInputMask } from "@/shared/components/ControllerInputMask"
import { useCallback, useEffect, useRef } from "react"
import { getAddressByPostalCode } from "../services/addressService"
import { createCondominium } from "../services/condominiumService"
import { useNavigate } from "@tanstack/react-router"
import { useApiErrorDialog } from "@/shared/hooks/useApiErrorDialog"
import { ErrorDialog } from "@/shared/components/ErrorDialog"

export const CondominiumForm = () => {
    const navigator = useNavigate()
    const { error, hideError, showError, visible } = useApiErrorDialog()

    const { control, setValue, setError, clearErrors, handleSubmit } = useForm<CreateCondominiumRequest>({
        resolver: zodResolver(createCondominiumSchema),
        defaultValues: {
            condominiumName: "",
            postalCode: "",
            street: "",
            neighborhood: "",
            number: "",
            ibgeCode: "",
            stateCode: "",
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
            setValue("stateCode", address.uf)
            setValue("ibgeCode", address.ibge)
            clearErrors(["street", "neighborhood", "city", "stateCode"])

        } catch {
            setValue("street", "")
            setValue("neighborhood", "")
            setValue("city", "")
            setValue("stateCode", "")
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

    const onSubmit: SubmitHandler<CreateCondominiumRequest> = async (data) => {
        try {
            await createCondominium(data)
            navigator({ to: '/dashboard' })
        } catch (e) {
            showError(e)
        }
    }

    return (
        <form
            className="w-full overflow-hidden rounded-none border-0 bg-transparent text-gray-800 shadow-none md:rounded-2xl md:border md:border-gray-200 md:bg-white md:shadow-sm"
            onSubmit={handleSubmit(onSubmit)}
        >
            <div className="flex flex-col md:flex-row">
                <aside className="hidden bg-linear-to-br from-emerald-800 via-emerald-700 to-emerald-900 p-6 text-white md:flex md:w-64 md:shrink-0 md:flex-col md:justify-between lg:w-72">
                    <div>
                        <p className="mb-0 mt-3 text-3xl font-bold leading-9">Novo Condomínio</p>
                        <p className="mb-0 mt-3 text-sm leading-6 text-emerald-100/90">
                            Preencha as informações essenciais para iniciar o cadastro.
                        </p>
                    </div>
                </aside>

                <div className="w-full p-0 sm:p-4 md:p-6">
                    <div className="md:hidden">
                        <p className="m-0 mt-2 text-xl font-bold leading-tight text-emerald-950">Novo Condomínio</p>
                        <p className="m-0 mt-1.5 text-sm leading-6 text-gray-600">Preencha os dados do condomínio para continuar.</p>
                    </div>

                    <div className="mt-5 flex flex-col gap-4 md:mt-0">
                        <section className="rounded-xl border border-gray-100 bg-gray-50/70 p-3.5 text-gray-800 sm:p-4">
                            <div className="mb-5 flex items-center gap-2 text-emerald-900">
                                <i className="pi pi-id-card text-base" />
                                <p className="m-0 text-base font-semibold tracking-tight sm:text-lg">Identificação</p>
                            </div>
                            <ControllerInputText<CreateCondominiumRequest>
                                propertyName="condominiumName"
                                control={control}
                                label="Nome do condomínio"
                            />
                        </section>

                        <section className="rounded-xl border border-gray-100 bg-gray-50/70 p-3.5 text-gray-800 sm:p-4">
                            <div className="mb-5 flex items-center gap-2 text-emerald-900">
                                <i className="pi pi-map-marker text-base" />
                                <p className="m-0 text-base font-semibold tracking-tight sm:text-lg">Localização</p>
                            </div>

                            <div className="flex flex-col gap-2.5 sm:gap-3">
                                <div className="grid grid-cols-1 gap-x-3 gap-y-2.5 sm:grid-cols-2">
                                    <ControllerInputMask
                                        propertyName="postalCode"
                                        control={control}
                                        label="CEP"
                                        mask="99999-999"
                                    />

                                    <ControllerInputText<CreateCondominiumRequest>
                                        propertyName="neighborhood"
                                        control={control}
                                        label="Bairro"
                                    />
                                </div>

                                <div className="grid grid-cols-1 gap-x-3 gap-y-2.5 sm:grid-cols-[2fr_1fr]">
                                    <ControllerInputText<CreateCondominiumRequest>
                                        propertyName="street"
                                        control={control}
                                        label="Endereço"
                                    />

                                    <ControllerInputText<CreateCondominiumRequest>
                                        propertyName="number"
                                        control={control}
                                        label="Número"
                                    />
                                </div>

                                <ControllerInputText<CreateCondominiumRequest>
                                    propertyName="complement"
                                    control={control}
                                    label="Complemento (opcional)"
                                />

                                <div className="grid grid-cols-1 gap-x-3 gap-y-2.5 sm:grid-cols-[2fr_1fr]">
                                    <ControllerInputText<CreateCondominiumRequest>
                                        propertyName="city"
                                        control={control}
                                        label="Cidade"
                                    />

                                    <ControllerInputText<CreateCondominiumRequest>
                                        propertyName="stateCode"
                                        control={control}
                                        label="UF"
                                    />
                                </div>
                            </div>
                        </section>
                    </div>

                    <div className="mt-5 flex w-full justify-end">
                        <Button
                            className="w-full rounded-xl! border-emerald-700! bg-emerald-700! px-7! font-semibold! hover:border-emerald-800! hover:bg-emerald-800! sm:w-auto"
                            type="submit"
                            label="Criar Condomínio"
                            severity="success"
                        />
                    </div>
                </div>
            </div>

            <ErrorDialog
                error={error}
                visible={visible}
                onHide={hideError}
            />
        </form>
    )
}
