import { useEffect } from 'react'
import { Form } from '@/components/ui/Form'
import Container from '@/components/shared/Container'
import BottomStickyBar from '@/components/template/BottomStickyBar'
import OverviewSection from './OverviewSection'
import AddressSection from './AddressSection'
import isEmpty from 'lodash/isEmpty'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import type { CustomerFormSchema } from './types'
import type { CommonProps } from '@/@types/common'
import { useTranslation } from 'react-i18next'
import { isValidCPF, isValidCNPJ } from '@/utils/cpfCnpjValidator'

type CustomerFormProps = {
    onFormSubmit: (values: CustomerFormSchema) => void
    defaultValues?: Partial<CustomerFormSchema>
    newCustomer?: boolean
    isModal?: boolean
} & CommonProps

const CustomerForm = ({
    onFormSubmit,
    defaultValues,
    newCustomer = false,
    isModal = false,
    children,
}: CustomerFormProps) => {
    const { t } = useTranslation()

    const validationSchema = z.object({
        firstName: z
            .string()
            .max(120, t('nav.customerFormValidation.firstNameMax'))
            .optional(),

        lastName: z
            .string()
            .max(120, t('nav.customerFormValidation.lastNameMax'))
            .optional(),

        email: z
            .string()
            .email({ message: t('nav.customerFormValidation.invalidEmail') })
            .max(254, { message: t('nav.customerFormValidation.emailMax') })
            .optional()
            .or(z.literal('')),

        dialCode: z
            .string()
            .regex(/^\+?\d*$/, t('nav.customerFormValidation.phoneMax'))
            .max(5)
            .optional(),

        phoneLocal: z
            .string()
            .regex(/^\d*$/, t('nav.customerFormValidation.phoneMax'))
            .max(20, t('nav.customerFormValidation.phoneMax'))
            .optional(),

        address: z
            .string()
            .max(120, t('nav.customerFormValidation.addressMax'))
            .optional(),

        street_number: z
            .string()
            .max(10, t('nav.customerFormValidation.streetNumberMax'))
            .optional(),

        complement: z
            .string()
            .max(40, t('nav.customerFormValidation.complementMax'))
            .optional(),

        neigh: z
            .string()
            .max(80, t('nav.customerFormValidation.neighMax'))
            .optional(),

        city: z
            .string()
            .max(80, t('nav.customerFormValidation.cityMax'))
            .optional(),

        postcode: z
            .string()
            .max(15, t('nav.customerFormValidation.postcodeMax'))
            .optional(),

        state: z
            .string()
            .max(5, t('nav.customerFormValidation.stateMax'))
            .optional(),

        tax_id: z
            .string()
            .max(20, t('nav.customerFormValidation.taxIdRequired'))
            .default('')
            .superRefine((value, ctx) => {
                const clean = value.replace(/\D/g, '')

                if (clean.length === 0) {
                    ctx.addIssue({
                        code: z.ZodIssueCode.custom,
                        message: t('nav.customerFormValidation.taxIdRequired'),
                    })
                    return
                }

                if (clean.length <= 11) {
                    if (!isValidCPF(clean)) {
                        ctx.addIssue({
                            code: z.ZodIssueCode.custom,
                            message: t('nav.customerFormValidation.invalidCPF'),
                        })
                    }
                } else {
                    if (!isValidCNPJ(clean)) {
                        ctx.addIssue({
                            code: z.ZodIssueCode.custom,
                            message: t(
                                'nav.customerFormValidation.invalidCNPJ',
                            ),
                        })
                    }
                }
            }),

        img: z.string().optional(),
    })

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
                <div
                    className={
                        isModal
                            ? 'flex flex-col gap-6'
                            : 'grid grid-cols-12 gap-6 max-w-7xl mx-auto pt-6 pb-20'
                    }
                >
                    <div
                        className={
                            isModal ? 'w-full' : 'col-span-12 lg:col-span-7'
                        }
                    >
                        <OverviewSection control={control} errors={errors} />
                    </div>

                    <div
                        className={
                            isModal ? 'w-full' : 'col-span-12 lg:col-span-5'
                        }
                    >
                        <AddressSection control={control} errors={errors} />
                    </div>
                </div>
            </Container>

            {!isModal && (
                <BottomStickyBar forceMode="fixed">{children}</BottomStickyBar>
            )}
        </Form>
    )
}

export default CustomerForm
