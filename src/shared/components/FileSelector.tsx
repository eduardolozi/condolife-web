import { Button } from "primereact/button";
import { FileUpload } from "primereact/fileupload"

interface FileSelectorProps {
    maxSize: number;
    handleSelect: () => Promise<void>;
    supportedExtensions: string[]
}

export const FileSelector = ({maxSize, handleSelect, supportedExtensions} : FileSelectorProps) => {
    const emptyTemplate = (
        <div className="p-8 flex flex-col justify-center items-center bg-gray-50 rounded-2xl border-dashed border-2 border-gray-300">
            <div className="rounded-2xl bg-emerald-600/10 aspect-square p-5 flex justify-center">
                <i className="pi-cloud-upload pi text-green-800 text-2xl"></i>
            </div>
            <p className="text-2xl font-semibold mb-2">Arraste seu arquivo aqui</p>
            <p className="mb-8">Suporte para arquivos {supportedExtensions.join(' / ')} (máx. {maxSize/1000000}MB)</p>
            <Button className="bg-emerald-600" label="Selecione um arquivo"/>
        </div>
    )

    const headerTemplate = (<></>)

    return (
        <div>
            <FileUpload
                accept={supportedExtensions.join(',')}
                maxFileSize={maxSize}
                customUpload
                uploadHandler={handleSelect}
                emptyTemplate={emptyTemplate}
                headerTemplate={headerTemplate}
            />
        </div>
    )
}