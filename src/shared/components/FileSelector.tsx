import { useRef, useState, type ChangeEvent } from "react"
import { Button } from "primereact/button"

interface FileSelectorProps {
  maxSize: number
  selectedFile: File | null
  onFileSelected: (file: File | null) => void
  supportedExtensions: string[]
}

export const FileSelector = ({ maxSize, selectedFile, onFileSelected, supportedExtensions }: FileSelectorProps) => {
  const inputRef = useRef<HTMLInputElement | null>(null)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)

  const normalizedExtensions = supportedExtensions.map((extension) => extension.toLowerCase())

  const validateFile = (file: File) => {
    const fileName = file.name.toLowerCase()
    const isSupported = normalizedExtensions.some((extension) => fileName.endsWith(extension))

    if (!isSupported) {
      setErrorMessage(`O arquivo deve ser do tipo ${supportedExtensions.join(" ou ")}.`)
      onFileSelected(null)
      return
    }

    if (file.size === 0) {
      setErrorMessage("O arquivo selecionado está vazio.")
      onFileSelected(null)
      return
    }

    if (file.size > maxSize) {
      setErrorMessage(`O arquivo deve ter no máximo ${maxSize / 1000000}MB.`)
      onFileSelected(null)
      return
    }

    setErrorMessage(null)
    onFileSelected(file)
  }

  const handleInputChange = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    validateFile(file)
  }

  return (
    <div className="p-8 flex flex-col justify-center items-center bg-gray-50 rounded-2xl border-dashed border-2 border-gray-300">
      <input
        ref={inputRef}
        type="file"
        accept={supportedExtensions.join(",")}
        className="hidden"
        onChange={handleInputChange}
      />

      <div className="rounded-2xl bg-emerald-600/10 aspect-square p-5 flex justify-center">
        <i className="pi-cloud-upload pi text-green-800 text-2xl"></i>
      </div>

      <p className="text-2xl font-semibold mb-2">Arraste seu arquivo aqui</p>
      <p className="mb-6">Suporte para arquivos {supportedExtensions.join(" / ")} (máx. {maxSize / 1000000}MB)</p>

      <Button
        type="button"
        className="bg-emerald-600"
        label="Selecione um arquivo"
        onClick={() => inputRef.current?.click()}
      />

      {selectedFile && (
        <div className="mt-4 w-full max-w-2xl flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-3 rounded-lg border border-emerald-200 bg-emerald-50 px-3 py-2 text-sm text-emerald-900">
          <i className="pi pi-file text-emerald-700" />
          <span className="min-w-0 flex-1 w-full truncate">{selectedFile.name}</span>
          <Button
            type="button"
            text
            size="small"
            label="Remover"
            className="p-0! text-emerald-700 self-start sm:self-auto shrink-0"
            onClick={() => {
              onFileSelected(null)
              setErrorMessage(null)
              if (inputRef.current) inputRef.current.value = ""
            }}
          />
        </div>
      )}

      {errorMessage && (
        <p className="mt-3 mb-0 text-sm text-red-600">{errorMessage}</p>
      )}
    </div>
  )
}
