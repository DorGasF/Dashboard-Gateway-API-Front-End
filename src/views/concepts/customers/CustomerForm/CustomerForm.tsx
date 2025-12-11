import { useEffect } from 'react'
import { Form } from '@/components/ui/Form'
import Container from '@/components/shared/Container'
import OverviewSection from './OverviewSection'
import AddressSection from './AddressSection'
import isEmpty from 'lodash/isEmpty'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import type { CustomerFormSchema } from './types'
import type { CommonProps } from '@/@types/common'
import { isValidCPF, isValidCNPJ } from '@/utils/cpfCnpjValidator'

type CustomerFormProps = {
    onFormSubmit: (values: CustomerFormSchema) => void
    defaultValues?: Partial<CustomerFormSchema>
    newCustomer?: boolean
} & CommonProps

const validationSchema = z.object({
    firstName: z.string().max(120, 'Máximo 120 caracteres').optional(),

    lastName: z.string().max(120, 'Máximo 120 caracteres').optional(),

    email: z
        .string()
        .email({ message: 'Invalid email' })
        .max(254, { message: 'Email must be at most 254 characters' })
        .optional()
        .or(z.literal('')),

    dialCode: z.string().optional(),

    phoneLocal: z.string().max(20, 'Muito longo').optional(),

    address: z.string().max(120, 'Máximo 120 caracteres').optional(),

    street_number: z.string().max(10, 'Máximo 10 caracteres').optional(),

    complement: z.string().max(40, 'Máximo 40 caracteres').optional(),

    neigh: z.string().max(80, 'Máximo 80 caracteres').optional(),

    city: z.string().max(80, 'Máximo 80 caracteres').optional(),

    postcode: z.string().max(15, 'Máximo 15 caracteres').optional(),

    state: z.string().max(5, 'Máximo 5 caracteres').optional(),

    tax_id: z
        .string()
        .max(20, 'Máximo 20 caracteres')
        .default('')
        .superRefine((value, ctx) => {
            const clean = value.replace(/\D/g, '')

            if (clean.length === 0) {
                ctx.addIssue({
                    code: z.ZodIssueCode.custom,
                    message: 'Documento obrigatório',
                })
                return
            }

            if (clean.length <= 11) {
                if (!isValidCPF(clean)) {
                    ctx.addIssue({
                        code: z.ZodIssueCode.custom,
                        message: 'CPF inválido',
                    })
                }
            } else {
                if (!isValidCNPJ(clean)) {
                    ctx.addIssue({
                        code: z.ZodIssueCode.custom,
                        message: 'CNPJ inválido',
                    })
                }
            }
        }),

    img: z.string().optional(),
})

const CustomerForm = ({
    onFormSubmit,
    defaultValues,
    newCustomer = false,
}: CustomerFormProps) => {
    const {
        handleSubmit,
        reset,
        formState: { errors },
        control,
    } = useForm<CustomerFormSchema>({
        defaultValues: {
            firstName: '',
            lastName: '',
            email: '',
            dialCode: '',
            phoneLocal: '',
            address: '',
            street_number: '',
            neigh: '',
            city: '',
            postcode: '',
            state: '',
            tax_id: '',
            complement: '',
            ...defaultValues,
        },
        resolver: zodResolver(validationSchema),
    })

    useEffect(() => {
        if (!isEmpty(defaultValues)) reset(defaultValues)
    }, [JSON.stringify(defaultValues)])

    return (
        <Form
            id="customer-form"
            className="w-full"
            containerClassName="w-full"
            onSubmit={handleSubmit(onFormSubmit)}
        >
            <Container className="px-4 md:px-6">
                <div className="flex flex-col gap-6">
                    <OverviewSection control={control} errors={errors} />
                    <AddressSection control={control} errors={errors} />
                </div>
            </Container>
        </Form>
    )
}

export default CustomerForm
