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

export type OrderHistory = {
    id: string
    item: string
    status: string
    amount: number
    date: number
}

export type PaymentMethod = {
    cardHolderName: string
    cardType: string
    expMonth: string
    expYear: string
    last4Number: string
    primary: boolean
}

export type Subscription = {
    plan: string
    status: string
    billing: string
    nextPaymentDate: number
    amount: number
}

export type GetCustomersListResponse = {
    list: Customer[]
    total: number
}

export type Filter = {
    purchasedProducts: string
    purchaseChannel: Array<string>
}

export type Customer = {
    id: string
    name: string
    firstName: string
    lastName: string
    email: string
    img: string
    role: string
    lastOnline: number
    status: string
    personalInfo: PersonalInfo
    orderHistory: OrderHistory[]
    paymentMethod: PaymentMethod[]
    subscription: Subscription[]
    totalSpending: number
}
