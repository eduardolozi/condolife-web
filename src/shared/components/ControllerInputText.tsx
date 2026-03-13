import { InputText } from "primereact/inputtext"
import { Controller, type Control, type FieldValues, type Path } from "react-hook-form"

export type ControllerInputTextProps<T extends FieldValues> = {
    propertyName: Path<T>,
    control: Control<T>   
}

export const ControllerInputText = <T extends FieldValues>({
    propertyName, control
}: ControllerInputTextProps<T>) => {
    return (
        <Controller
            name={propertyName}
            control={control}
            render={({field, fieldState}) => (
                <div className="flex flex-col">
                    <InputText
                        className="w-full"
                        value={field.value}
                        onChange={(e) => field.onChange(e.target.value)}
                        name={field.name}
                        onBlur={field.onBlur}
                        invalid={fieldState.invalid}
                    />
                    {fieldState.error && (
                        <small className="p-error">{fieldState.error.message}</small>
                    )}
                </div>
                
            )}
        />
    )
}