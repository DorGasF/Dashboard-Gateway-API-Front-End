import { useState } from 'react'
import Container from '@/components/shared/Container'
import Button from '@/components/ui/Button'
import Notification from '@/components/ui/Notification'
import toast from '@/components/ui/toast'
import ConfirmDialog from '@/components/shared/ConfirmDialog'
import { apiGetCustomer, apiCreateCustomer } from '@/services/CustomersService'
import CustomerForm from '../CustomerForm'
import NoUserFound from '@/assets/svg/NoUserFound'
import { TbTrash, TbArrowNarrowLeft } from 'react-icons/tb'
import { useParams, useNavigate } from 'react-router'
import useSWR, { useSWRConfig } from 'swr'
import { useTranslation } from 'react-i18next'
import type { CustomerFormSchema } from '../CustomerForm'
import type { Customer } from '../CustomerList/types'

const translateBackendError = (code: string, t: any) => {
    return t(`nav.conceptsCustomers.backend.${code}`, {
        defaultValue: t('nav.conceptsCustomers.errors.unexpected'),
    })
}

const CustomerEdit = () => {
    const { id } = useParams()
    const navigate = useNavigate()
    const { t } = useTranslation()
    const { mutate } = useSWRConfig()

    const { data, isLoading } = useSWR(
        id ? [`/api/customers${id}`, { id }] : null,
        ([_, params]) => apiGetCustomer<Customer, { id: string }>(params),
        {
            revalidateOnFocus: false,
            revalidateIfStale: false,
        },
    )

    const [deleteConfirmationOpen, setDeleteConfirmationOpen] = useState(false)
    const [isSubmitting, setIsSubmitting] = useState(false)

    const mapPayloadToBackend = (form: CustomerFormSchema) => {
        const full_name =
            `${form.firstName || ''} ${form.lastName || ''}`.trim()

        return {
            full_name,
            cpfCnpj: (form.tax_id || '').replace(/\D/g, ''),
            email: form.email || '',
            dial_code: (form.dialCode || '').replace(/\s/g, ''),
            phone_local: (form.phoneLocal || '').replace(/\D/g, ''),
            zip_code: (form.postcode || '').replace(/\D/g, ''),
            street: form.address || '',
            street_number: form.street_number || '',
            complement: form.complement || '',
            neigh: form.neigh || '',
            city: form.city || '',
            uf: form.state || '',
        }
    }

    const handleSave = async (payload: CustomerFormSchema) => {
        try {
            const mapped = mapPayloadToBackend(payload)

            const resp = await apiCreateCustomer<{
                message: { type: string; message: string; code: string }
                data?: any
            }>(mapped)

            const code = resp?.message?.code
            const isError = resp?.message?.type === 'error'
            const nome = resp?.data?.full_name

            if (isError) {
                const text = translateBackendError(code, t)
                toast.push(
                    <Notification
                        title={t('nav.conceptsCustomers.error')}
                        type="danger"
                    >
                        {text}
                    </Notification>,
                    { placement: 'bottom-end' },
                )
                return false
            }

            if (code === 'CLIENT_CREATED') {
                toast.push(
                    <Notification
                        title={t('nav.conceptsCustomers.createdTitle')}
                        type="success"
                    >
                        {t('nav.conceptsCustomers.createdMessage', {
                            name: nome,
                        })}
                    </Notification>,
                    { placement: 'bottom-end' },
                )
            } else if (code === 'CLIENT_UPDATED') {
                toast.push(
                    <Notification
                        title={t('nav.conceptsCustomers.updatedTitle')}
                        type="info"
                    >
                        {t('nav.conceptsCustomers.updatedMessage', {
                            name: nome,
                        })}
                    </Notification>,
                    { placement: 'bottom-end' },
                )
            }

            return true
        } catch {
            const text = t('nav.conceptsCustomers.errors.unexpected')
            toast.push(
                <Notification
                    title={t('nav.conceptsCustomers.unexpectedError')}
                    type="danger"
                >
                    {text}
                </Notification>,
                { placement: 'bottom-end' },
            )
            return false
        }
    }

    const handleFormSubmit = async (values: CustomerFormSchema) => {
        setIsSubmitting(true)

        const ok = await handleSave(values)

        if (!ok) {
            setIsSubmitting(false)
            return
        }

        if (id) {
            mutate([`/api/customers${id}`, { id }], undefined, {
                revalidate: true,
            })
        }

        navigate('/concepts/customers/customer-list')

        setTimeout(() => setIsSubmitting(false), 350)
    }

    const getDefaultValues = () => {
        if (!data) return {}

        return {
            firstName: data.firstName,
            lastName: data.lastName,
            email: data.email,
            dialCode: data.personalInfo.dialCode || '',
            phoneLocal: data.personalInfo.phoneLocal || '',
            address: data.personalInfo.address || '',
            street_number: data.personalInfo.street_number || '',
            city: data.personalInfo.city || '',
            postcode: data.personalInfo.postcode || '',
            neigh: data.personalInfo.neigh || '',
            state: data.personalInfo.state || '',
            complement: data.personalInfo.complement || '',
            tax_id: data.personalInfo.tax_id || '',
        }
    }

    const handleBack = () => history.back()

    const handleDelete = () => setDeleteConfirmationOpen(true)
    const handleCancel = () => setDeleteConfirmationOpen(false)

    const handleConfirmDelete = () => {
        setDeleteConfirmationOpen(false)

        toast.push(
            <Notification type="success">
                {t('nav.customerEdit.toastCustomerDeleted')}
            </Notification>,
            { placement: 'top-center' },
        )

        navigate('/concepts/customers/customer-list')
    }

    const buttonsDisabled = isLoading || !data || isSubmitting

    return (
        <>
            <CustomerForm
                defaultValues={getDefaultValues() as CustomerFormSchema}
                newCustomer={false}
                onFormSubmit={handleFormSubmit}
            >
                <Container>
                    <div className="flex items-center justify-between px-8">
                        <Button
                            type="button"
                            variant="plain"
                            icon={<TbArrowNarrowLeft />}
                            onClick={handleBack}
                            disabled={buttonsDisabled}
                        >
                            {t('nav.customerEdit.back')}
                        </Button>

                        <div className="flex items-center gap-3">
                            <Button
                                type="button"
                                customColorClass={() =>
                                    'border-error ring-1 ring-error text-error hover:border-error hover:ring-error hover:text-error bg-transparent'
                                }
                                icon={<TbTrash />}
                                onClick={handleDelete}
                                disabled={buttonsDisabled}
                            >
                                {t('nav.customerEdit.delete')}
                            </Button>

                            <Button
                                variant="solid"
                                type="submit"
                                loading={isSubmitting}
                                disabled={buttonsDisabled}
                            >
                                {t('nav.customerEdit.save')}
                            </Button>
                        </div>
                    </div>
                </Container>
            </CustomerForm>

            <ConfirmDialog
                isOpen={deleteConfirmationOpen}
                type="danger"
                title={t('nav.customerEdit.deleteDialogTitle')}
                onClose={handleCancel}
                onRequestClose={handleCancel}
                onCancel={handleCancel}
                onConfirm={handleConfirmDelete}
            >
                <p>{t('nav.customerEdit.deleteDialogMessage')}</p>
            </ConfirmDialog>
        </>
    )
}

export default CustomerEdit
