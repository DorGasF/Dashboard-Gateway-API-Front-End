export function wrapApiError(code: string, message: string, backend: any = null) {
    return {
        message: {
            code,
            type: "error",
            message
        },
        data: backend
    }
}