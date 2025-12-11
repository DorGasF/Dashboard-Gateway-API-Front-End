import { useState } from 'react'
import Button from '@/components/ui/Button'
import { TbUserPlus } from 'react-icons/tb'
import CreateCustomerDialog from '@/views/customers/CreateCustomerDialog'
import { apiCreateCustomer } from '@/services/CustomersService'

const CustomerListActionTools = () => {
    const [open, setOpen] = useState(false)

    // Função que ajusta o payload para o formato do back-end
    const mapPayloadToBackend = (form: any) => {
        const full_name =
            `${form.firstName || ''} ${form.lastName || ''}`.trim()

        const cpfCnpj = (form.tax_id || '').replace(/\D/g, '')

        const cell_phone =
            form.dialCode && form.phoneLocal
                ? `${form.dialCode}${form.phoneLocal}`.replace(/\D/g, '')
                : (form.phoneLocal || '').replace(/\D/g, '')

        const zip_code = (form.postcode || '').replace(/\D/g, '')

        return {
            full_name,
            cpfCnpj,
            email: form.email || '',
            cell_phone,
            company_name: form.company_name || '', // opcional caso adicione no form

            zip_code,
            street: form.address || '',
            street_number: form.street_number || '',
            complement: form.complement || '',
            neigh: form.neigh || '',
            city: form.city || '',
            uf: form.state || '', // renomeado conforme backend
        }
    }

    const handleCreate = async (payload: any) => {
        try {
            const mappedPayload = mapPayloadToBackend(payload)

            const resp = await apiCreateCustomer<{
                message: { type: string; message: string }
                data?: any
            }>(mappedPayload)

            const message = resp?.message?.message ?? 'Erro ao criar cliente'
            const isError = resp?.message?.type === 'error'

            if (isError) {
                return {
                    status: 'failed',
                    message,
                }
            }

            return {
                status: 'success',
                message,
            }
        } catch (error: any) {
            return {
                status: 'failed',
                message:
                    error?.message?.message ??
                    error?.message ??
                    'Erro inesperado ao criar cliente.',
            }
        }
    }

    const onSubmitHandler = async (payload: any) => {
        const result = await handleCreate(payload)

        if (result.status === 'failed') {
            console.log('Erro:', result.message)
            return
        }

        console.log('Criado com sucesso:', result.message)
        setOpen(false)
    }

    return (
        <>
            <Button
                variant="solid"
                icon={<TbUserPlus className="text-xl" />}
                onClick={() => setOpen(true)}
            >
                Cadastrar Cliente
            </Button>

            <CreateCustomerDialog
                open={open}
                onClose={() => setOpen(false)}
                onCreate={onSubmitHandler}
            />
        </>
    )
}

export default CustomerListActionTools
