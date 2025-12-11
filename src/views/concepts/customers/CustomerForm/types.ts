import type { Control, FieldErrors } from 'react-hook-form'

export type OverviewFields = {
    firstName?: string
    lastName?: string
    email?: string
    dialCode?: string
    phoneLocal?: string
}

export type AddressFields = {
    complement?: string
    address?: string
    street_number?: string
    neigh?: string
    city?: string
    postcode?: string
    state?: string
    tax_id?: string
}

export type CustomerFormSchema = OverviewFields & AddressFields

export type FormSectionBaseProps = {
    control: Control<CustomerFormSchema>
    errors: FieldErrors<CustomerFormSchema>
}
