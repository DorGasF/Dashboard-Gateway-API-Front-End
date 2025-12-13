import ApiService from './ApiService'

export async function apiGetCustomersList<T, U extends Record<string, unknown>>(
    params: U,
): Promise<T> {
    const res = await ApiService.fetchDataWithAxios<any>({
        url: '/v1/client/getCustomersList',
        method: 'get',
        params,
    })

    return res?.data as T
}

export async function apiGetCustomer<T, U extends Record<string, unknown>>({
    id,
    ...params
}: U): Promise<T> {
    const res = await ApiService.fetchDataWithAxios<any>({
        url: `/v1/client/getCustomerIdentifier?i=${id}`,
        method: 'get',
        params,
    })

    return res?.data as T
}

export async function apiGetCustomerLog<T, U extends Record<string, unknown>>({
    ...params
}: U) {
    return ApiService.fetchDataWithAxios<T>({
        url: `/customer/log`,
        method: 'get',
        params,
    })
}

export async function apiCreateCustomer<
    T,
    U extends Record<string, unknown> = Record<string, unknown>,
>(payload: U) {
    return ApiService.fetchDataWithAxios<T>({
        url: '/v1/client/create',
        method: 'post',
        data: payload,
    })
}

export async function apiRemoveCustomers<
    T = any,
    U extends { identifiers: string[] } = { identifiers: string[] },
>(payload: U): Promise<T> {
    const res = await ApiService.fetchDataWithAxios<any>({
        url: '/v1/client/remove',
        method: 'post',
        data: payload,
    })

    return res as T
}
