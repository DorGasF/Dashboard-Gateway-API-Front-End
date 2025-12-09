export type ProcessedResponse<T = any> = {
    ok: boolean
    code: string | null
    type: 'success' | 'error' | 'warning' | 'info' | null
    message: string | null
    data: T | null
}

export const ApiResponseProcessor = {
    success<T>(raw: any): ProcessedResponse<T> {
        return {
            ok: raw?.message?.type === 'success',
            code: raw?.message?.code ?? null,
            type: raw?.message?.type ?? null,
            message: raw?.message?.message ?? null,
            data: raw?.data ?? null,
        }
    },

    error(raw: any): ProcessedResponse {
        const msg = raw?.response?.data?.message

        return {
            ok: false,
            code: msg?.code ?? 'UNKNOWN_ERROR',
            type: msg?.type ?? 'error',
            message: msg?.message ?? raw.toString(),
            data: null,
        }
    },
}
