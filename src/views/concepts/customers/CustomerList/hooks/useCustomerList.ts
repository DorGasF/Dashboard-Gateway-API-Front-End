import { useCustomerListContext } from '../CustomerListProvider'

export default function useCustomerList() {
    const {
        customerList,
        customerListTotal,
        error,
        isLoading,
        tableData,
        mutate,
        setTableData,
        selectedCustomer,
        setSelectedCustomer,
        setSelectAllCustomer,
    } = useCustomerListContext()

    return {
        customerList,
        customerListTotal,
        error,
        isLoading,
        tableData,
        mutate,
        setTableData,
        selectedCustomer,
        setSelectedCustomer,
        setSelectAllCustomer,
    }
}
