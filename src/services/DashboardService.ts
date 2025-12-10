import ApiService from './ApiService'

export async function apiGetSummaryDashboard<T>() {
    return ApiService.fetchDataWithAxios<T>({
        url: '/v1/user/summary',
        method: 'get',
    })
}
