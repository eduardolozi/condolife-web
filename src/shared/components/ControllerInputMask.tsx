import { FloatLabel } from "primereact/floatlabel"
import { InputMask } from 'primereact/inputmask'
import { Controller, type Control, type FieldValues, type Path } from "react-hook-form"

export type ControllerInputMaskProps<T extends FieldValues> = {
    propertyName: Path<T>,
    control: Control<T>,
    label: string,
    mask: string
}

export const ControllerInputMask = <T extends FieldValues>({
    propertyName, control, label, mask
}: ControllerInputMaskProps<T>) => {
    return (
        <Controller
            name={propertyName}
            control={control}
            render={({field, fieldState}) => {
                const hasValue = !!field.value
                return (
                    <div className="flex flex-col w-full">
                        <FloatLabel className="w-full">
                            <InputMask
                                id={propertyName}
                                className={`w-full ${hasValue ? "p-filled" : ""}`}
                                value={field.value}
                                onChange={(e) => field.onChange(e.target.value)}
                                name={field.name}
                                autoClear={false}
                                mask={mask}
                                invalid={fieldState.invalid}
                            />
                            <label htmlFor={propertyName}>{label}</label>
                        </FloatLabel>

                        <small className="p-error pl-3 min-h-5 leading-5" aria-live="polite">
                            {fieldState.error?.message ?? "\u00A0"}
                        </small>
                    </div>
                )
            }}
        />
    )
}