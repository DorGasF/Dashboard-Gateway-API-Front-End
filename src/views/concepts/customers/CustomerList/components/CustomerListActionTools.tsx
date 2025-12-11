import { useState } from 'react'
import Button from '@/components/ui/Button'
import { TbUserPlus } from 'react-icons/tb'
import CreateCustomerDialog from '@/views/customers/CreateCustomerDialog'
import { apiCreateCustomer } from '@/services/CustomersService'
import { useSWRConfig } from 'swr'
import { useCustomerListStore } from '../store/customerListStore'
import { buildQueryParams } from '../hooks/useCustomerList'
import toast from '@/components/ui/toast'
import Notification from '@/components/ui/Notification'
import { useTranslation } from 'react-i18next'

const translateBackendError = (code: string, t: any) => {
    return t(`nav.conceptsCustomers.backend.${code}`, {
        defaultValue: t('nav.conceptsCustomers.errors.unexpected'),
    })
}

const CustomerListActionTools = () => {
    const { t } = useTranslation()
    const [open, setOpen] = useState(false)
    const [creating, setCreating] = useState(false)

    const { mutate } = useSWRConfig()
    const { tableData } = useCustomerListStore()

    const buildKey = () => ['/api/customers', buildQueryParams(tableData)]

    const mapPayloadToBackend = (form: any) => {
        const full_name =
            `${form.firstName || ''} ${form.lastName || ''}`.trim()
        const cpfCnpj = (form.tax_id || '').replace(/\D/g, '')
        const zip_code = (form.postcode || '').replace(/\D/g, '')

        const cell_phone =
            form.dialCode && form.phoneLocal
                ? `${form.dialCode}${form.phoneLocal}`.replace(/\D/g, '')
                : (form.phoneLocal || '').replace(/\D/g, '')

        return {
            full_name,
            cpfCnpj,
            email: form.email || '',
            cell_phone,
            company_name: form.company_name || '',
            zip_code,
            street: form.address || '',
            street_number: form.street_number || '',
            complement: form.complement || '',
            neigh: form.neigh || '',
            city: form.city || '',
            uf: form.state || '',
        }
    }

    const handleCreate = async (payload: any) => {
        try {
            const mapped = mapPayloadToBackend(payload)

            const resp = await apiCreateCustomer<{
                message: { type: string; message: string; code: string }
                data?: any
            }>(mapped)

            const code = resp?.message?.code
            const isError = resp?.message?.type === 'error'
            const nome =
                resp?.data?.full_name ||
                t('nav.conceptsCustomers.genericClient')

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
                return { status: 'failed', message: text }
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

            return { status: 'success' }
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
            return { status: 'failed', message: text }
        }
    }

    const onSubmitHandler = async (payload: any) => {
        setCreating(true)

        const result = await handleCreate(payload)

        if (result.status === 'failed') {
            setCreating(false)
            return
        }

        mutate(buildKey())
        setOpen(false)

        setTimeout(() => setCreating(false), 350)
    }

    return (
        <>
            <Button
                variant="solid"
                icon={<TbUserPlus className="text-xl" />}
                onClick={() => setOpen(true)}
            >
                {t('nav.conceptsCustomers.create')}
            </Button>

            <CreateCustomerDialog
                open={open}
                onClose={() => setOpen(false)}
                onCreate={onSubmitHandler}
                loading={creating}
            />
        </>
    )
}

export default CustomerListActionTools
