import { useState } from "react"
import { ApiError } from "../types/ApiError"

export function useApiErrorDialog() {
  const [error, setError] = useState<ApiError | null>(null)

  function showError(err: unknown) {
    if (err instanceof ApiError) {
      setError(err)
      return
    }

    if (err instanceof Error && typeof err.message === "string" && err.message.trim().length > 0) {
      setError(new ApiError(err.message))
      return
    }

    if (
      typeof err === "object" &&
      err !== null &&
      "message" in err &&
      typeof (err as { message?: unknown }).message === "string"
    ) {
      const message = (err as { message: string }).message.trim()
      setError(new ApiError(message || "Erro inesperado"))
      return
    }

    setError(new ApiError("Erro inesperado"))
  }
  

  function hideError() {
    setError(null)
  }

  return {
    error,
    visible: error !== null,
    showError,
    hideError,
  }
}
