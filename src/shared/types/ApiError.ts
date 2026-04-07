export interface ValidationError {
  field?: string
  message: string
  line?: number
}

export class ApiError extends Error {
  public readonly errors?: string[]
  public readonly validationErrors?: ValidationError[]

  constructor(message: string, errors?: string[], validationErrors?: ValidationError[]) {
    super(message)
    this.name = "ApiError"
    this.errors = errors
    this.validationErrors = validationErrors
  }
}
