import AxiosBase from './axios/AxiosBase'
import { ErrorDictionary } from './errors/ErrorDictionary'
import { wrapApiError } from './ApiErrorWrapper'
import type { AxiosRequestConfig, AxiosResponse } from 'axios'
import type { ErrorCode } from './errors/ErrorDictionary'

const MIN_RESPONSE_TIME = 350

const ApiService = {
    async fetchDataWithAxios<
        Response = unknown,
        Request = Record<string, unknown>,
    >(param: AxiosRequestConfig<Request>) {
        const start = performance.now()

        try {
            const response: AxiosResponse<Response> = await AxiosBase(param)

            const elapsed = performance.now() - start
            if (elapsed < MIN_RESPONSE_TIME) {
                await new Promise((r) =>
                    setTimeout(r, MIN_RESPONSE_TIME - elapsed),
                )
            }

            return response.data
        } catch (error: any) {
            const elapsed = performance.now() - start
            if (elapsed < MIN_RESPONSE_TIME) {
                await new Promise((r) =>
                    setTimeout(r, MIN_RESPONSE_TIME - elapsed),
                )
            }

            if (!error.response) {
                throw wrapApiError(
                    'NETWORK_ERROR',
                    ErrorDictionary['NETWORK_ERROR'],
                    null,
                )
            }

            const status = error.response.status
            let code: ErrorCode = 'UNKNOWN_ERROR'

            if (status === 401) code = 'UNAUTHORIZED'
            else if (status === 403) code = 'FORBIDDEN'
            else if (status === 404) code = 'NOT_FOUND'
            else if (status === 500) code = 'SERVER_ERROR'
            else if (status >= 400 && status < 500) code = 'VALIDATION_ERROR'

            throw wrapApiError(code, ErrorDictionary[code], error.response.data)
        }
    },
}

export default ApiService
