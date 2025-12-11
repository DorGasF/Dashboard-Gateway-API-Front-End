import { useState } from 'react'
import Button from '@/components/ui/Button'
import Dialog from '@/components/ui/Dialog'
import CustomerForm from '@/views/concepts/customers/CustomerForm/CustomerForm'

type Props = {
    open: boolean
    onClose: () => void
    onCreate: (payload: any) => Promise<void>
    loading: boolean
}

const CreateCustomerDialog = ({ open, onClose, onCreate, loading }: Props) => {
    const handleSubmitCreate = async (values: any) => {
        await onCreate(values)
    }

    return (
        <Dialog
            isOpen={open}
            preventScroll={true}
            style={{ content: { marginTop: 80 } }}
            contentClassName="pb-0 px-0"
            onClose={onClose}
            onRequestClose={onClose}
        >
            <div className="flex flex-col max-h-[80vh]">
                {/* BODY */}
                <div className="overflow-y-auto max-h-[70vh] px-6 pb-6">
                    <h5 className="mb-4">Cadastrar Cliente</h5>

                    <CustomerForm
                        onFormSubmit={handleSubmitCreate}
                        newCustomer={true}
                    />
                </div>

                {/* FOOTER */}
                <div className="flex justify-end items-center gap-2 px-6 py-3 bg-gray-100 dark:bg-gray-700 rounded-bl-lg rounded-br-lg">
                    <Button onClick={onClose} disabled={loading}>
                        Cancelar
                    </Button>

                    <Button
                        variant="solid"
                        form="customer-form"
                        type="submit"
                        loading={loading}
                        disabled={loading}
                        className="min-w-[130px]"
                    >
                        Criar Cliente
                    </Button>
                </div>
            </div>
        </Dialog>
    )
}

export default CreateCustomerDialog
