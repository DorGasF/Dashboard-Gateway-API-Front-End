import ApiService from './ApiService'

export async function apiGetSummaryDashboard<T>() {
    return ApiService.fetchDataWithAxios<T>({
        url: '/api/dashboard/summary',
        method: 'get',
    })
}
