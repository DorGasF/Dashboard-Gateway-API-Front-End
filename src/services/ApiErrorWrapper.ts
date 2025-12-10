export function wrapApiError(code: string, msg: string, backend: any = null) {
    let text = msg

    if (backend?.message?.message) {
        text = backend.message.message
    }

    return {
        message: {
            code,
            type: 'error',
            message: text,
        },
        data: backend,
    }
}
