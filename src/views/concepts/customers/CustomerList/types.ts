export type PersonalInfo = {
    dialCode: string
    phoneLocal: string
    address: string
    street_number: string
    neigh: string
    city: string
    postcode: string
    state: string
    complement: string
    tax_id: string
}

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
    personalInfo: PersonalInfo
    totalSpending: number
}
