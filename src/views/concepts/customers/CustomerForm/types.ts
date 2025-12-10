import type { Control, FieldErrors } from 'react-hook-form'

export type OverviewFields = {
    firstName?: string
    lastName?: string
    email?: string
    dialCode?: string
    phoneLocal?: string
}

export type AddressFields = {
    country?: string
    complement?: string
    address?: string
    street_number?: string
    neigh?: string
    city?: string
    postcode?: string
    state?: string
    tax_id?: string
}

export type TagsFields = {
    tags: Array<{ value: string; label: string }>
}

export type AccountField = {
    banAccount?: boolean
    accountVerified?: boolean
}

export type CustomerFormSchema = OverviewFields &
    AddressFields &
    TagsFields &
    AccountField

export type FormSectionBaseProps = {
    control: Control<CustomerFormSchema>
    errors: FieldErrors<CustomerFormSchema>
}
