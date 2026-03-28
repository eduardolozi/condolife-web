import { FileUpload } from "primereact/fileupload"

interface FileSelectorProps {
    maxSize: number;
    handleSelect: () => Promise<void>;
    supportedExtensions: string[]
}

export const FileSelector = ({maxSize, handleSelect, supportedExtensions} : FileSelectorProps) => {
    const emptyTemplate = (
        <div className="flex flex-col justify-center items-center bg-gray-300">
            <i className="pi-cloud-upload pi"></i>
        </div>
    )

    return (
        <div>
            <FileUpload 
                accept={supportedExtensions.join(',')}
                maxFileSize={maxSize}
                customUpload
                uploadHandler={handleSelect}
                emptyTemplate={emptyTemplate}
            />
        </div>
    )
}