import { FloatLabel } from "primereact/floatlabel"
import { InputText } from "primereact/inputtext"
import { Controller, type Control, type FieldValues, type Path } from "react-hook-form"

export type ControllerInputTextProps<T extends FieldValues> = {
    propertyName: Path<T>,
    control: Control<T>,
    label: string,
    className?: string
}

export const ControllerInputText = <T extends FieldValues>({
    propertyName, control, label, className
}: ControllerInputTextProps<T>) => {
    return (
        <Controller
            name={propertyName}
            control={control}
            render={({field, fieldState}) => (
                <div className={className ? `flex w-full flex-col ${className}` : "flex w-full flex-col"}>
                    <FloatLabel className="w-full">
                        <InputText
                            id={propertyName}
                            className="w-full"
                            value={field.value}
                            onChange={(e) => field.onChange(e.target.value)}
                            name={field.name}
                            onBlur={field.onBlur}
                            invalid={fieldState.invalid}
                        />
                        <label htmlFor={propertyName}>{label}</label>
                    </FloatLabel>

                     <small className="p-error pl-3 min-h-5 leading-5" aria-live="polite">
                        {fieldState.error?.message ?? "\u00A0"}
                    </small>
                </div>
                
            )}
        />
    )
}
