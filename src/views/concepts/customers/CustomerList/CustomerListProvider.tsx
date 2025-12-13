import { createContext, useContext } from 'react'
import useSWR from 'swr'
import { apiGetCustomersList } from '@/services/CustomersService'
import { useCustomerListStore } from './store/customerListStore'
import type { GetCustomersListResponse } from './types'
import type { TableQueries } from '@/@types/common'

export function buildQueryParams(tableData: TableQueries) {
    return {
        pageIndex: tableData.pageIndex,
        pageSize: tableData.pageSize,
        query: tableData.query,
        ...(tableData.sort?.key && { 'sort[key]': tableData.sort.key }),
        ...(tableData.sort?.order && { 'sort[order]': tableData.sort.order }),
    }
}

type CustomerListContextType = {
    customerList: GetCustomersListResponse['list']
    customerListTotal: number
    isLoading: boolean
    error: any
    mutate: (data?: any, shouldRevalidate?: boolean) => Promise<any>
    tableData: TableQueries
    setTableData: (payload: TableQueries) => void
    selectedCustomer: any[]
    setSelectedCustomer: (checked: boolean, customer: any) => void
    setSelectAllCustomer: (customers: any[]) => void
}

const CustomerListContext = createContext<CustomerListContextType | null>(null)

export const CustomerListProvider = ({
    children,
}: {
    children: React.ReactNode
}) => {
    const store = useCustomerListStore()
    const params = buildQueryParams(store.tableData)

    const { data, error, isLoading, mutate } = useSWR(
        ['/api/customers', JSON.stringify(params)],
        () =>
            apiGetCustomersList<GetCustomersListResponse, TableQueries>(params),
        { revalidateOnFocus: false },
    )

    return (
        <CustomerListContext.Provider
            value={{
                customerList: data?.list ?? [],
                customerListTotal: data?.total ?? 0,
                isLoading,
                error,
                mutate,
                tableData: store.tableData,
                setTableData: store.setTableData,
                selectedCustomer: store.selectedCustomer,
                setSelectedCustomer: store.setSelectedCustomer,
                setSelectAllCustomer: store.setSelectAllCustomer,
            }}
        >
            {children}
        </CustomerListContext.Provider>
    )
}

export const useCustomerListContext = () => {
    const ctx = useContext(CustomerListContext)
    if (!ctx) throw new Error('useCustomerListContext fora do Provider')
    return ctx
}
