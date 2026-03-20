export class ApiError extends Error {
    public readonly errors?: string[]

    constructor(message: string, errors?: string[]) {
        super(message)
        this.errors = errors
    }
}
