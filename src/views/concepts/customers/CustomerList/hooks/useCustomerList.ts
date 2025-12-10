import { apiGetCustomersList } from '@/services/CustomersService'
import useSWR from 'swr'
import { useCustomerListStore } from '../store/customerListStore'
import type { GetCustomersListResponse } from '../types'
import type { TableQueries } from '@/@types/common'

function buildQueryParams(tableData: TableQueries) {
    const params: any = {
        pageIndex: tableData.pageIndex,
        pageSize: tableData.pageSize,
        query: tableData.query,
    }

    if (tableData.sort?.key) {
        params['sort[key]'] = tableData.sort.key
    }

    if (tableData.sort?.order) {
        params['sort[order]'] = tableData.sort.order
    }

    return params
}

export default function useCustomerList() {
    const {
        tableData,
        filterData,
        setTableData,
        selectedCustomer,
        setSelectedCustomer,
        setSelectAllCustomer,
        setFilterData,
    } = useCustomerListStore((state) => state)

    const swrKey = ['/api/customers', buildQueryParams(tableData)]

    const { data, error, isLoading, mutate } = useSWR(
        swrKey,
        ([_, params]) =>
            apiGetCustomersList<GetCustomersListResponse, TableQueries>(params),
        { revalidateOnFocus: false },
    )

    return {
        customerList: data?.data?.list || [],
        customerListTotal: data?.data?.total || 0,
        error,
        isLoading,
        tableData,
        filterData,
        mutate,
        setTableData,
        selectedCustomer,
        setSelectedCustomer,
        setSelectAllCustomer,
        setFilterData,
    }
}
