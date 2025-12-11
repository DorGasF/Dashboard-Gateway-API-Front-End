import { useState } from 'react'
import Button from '@/components/ui/Button'
import Dialog from '@/components/ui/Dialog'
import CustomerForm from '@/views/concepts/customers/CustomerForm/CustomerForm'
import type { MouseEvent } from 'react'

type Props = {
    open: boolean
    onClose: () => void
    onCreate: (payload: any) => Promise<void>
}

const CreateCustomerDialog = ({ open, onClose, onCreate }: Props) => {
    const [loading, setLoading] = useState(false)

    const handleSubmitCreate = async (values: any) => {
        try {
            setLoading(true)
            await onCreate(values)
            onClose()
        } finally {
            setLoading(false)
        }
    }

    const onDialogOk = (e: MouseEvent) => {
        console.log('onDialogOk', e)
        onClose()
    }

    return (
        <Dialog
            isOpen={open}
            preventScroll={true}
            style={{
                content: {
                    marginTop: 80,
                },
            }}
            contentClassName="pb-0 px-0"
            onClose={onClose}
            onRequestClose={onClose}
        >
            <div className="flex flex-col max-h-[80vh]">
                {/* SCROLL */}

                <div className="overflow-y-auto max-h-[70vh] px-6 pb-6">
                    <h5 className="mb-4">Cadastrar Cliente</h5>

                    <CustomerForm
                        onFormSubmit={handleSubmitCreate}
                        newCustomer={true}
                    />
                </div>

                {/* FOOTER FIXO */}

                <div className="text-right px-6 py-3 bg-gray-100 dark:bg-gray-700 rounded-bl-lg rounded-br-lg">
                    <Button
                        className="ltr:mr-2 rtl:ml-2"
                        onClick={onClose}
                        disabled={loading}
                    >
                        Cancelar
                    </Button>

                    <Button
                        variant="solid"
                        form="customer-form"
                        type="submit"
                        loading={loading} // spinner ativado automaticamente
                        disabled={loading} // evita múltiplos envios
                    >
                        Criar Cliente
                    </Button>
                </div>
            </div>
        </Dialog>
    )
}

export default CreateCustomerDialog
