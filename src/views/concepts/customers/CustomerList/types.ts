export type GetCustomersListResponse = {
    list: Customer[]
    total: number
}

export type Customer = {
    id: string
    name: string
    firstName: string
    lastName: string
    email: string
    dialCode: string
    phoneLocal: string
    zipCode: string
    street: string
    streetNumber: string
    complement: string
    neigh: string
    city: string
    state: string
    taxId: string
    taxIdType: string
    totalSpending: number
    totalTransactions: number
}
