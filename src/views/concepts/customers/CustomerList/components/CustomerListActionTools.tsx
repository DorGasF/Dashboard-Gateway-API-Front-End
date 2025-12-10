import { useState } from 'react'
import Button from '@/components/ui/Button'
import { TbUserPlus } from 'react-icons/tb'
import CreateCustomerDialog from '@/views/customers/CreateCustomerDialog'

const CustomerListActionTools = () => {
    const [open, setOpen] = useState(false)

    const handleCreate = (data: any) => {
        console.log('Criado com sucesso:', data)
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
                onCreate={handleCreate}
            />
        </>
    )
}

export default CustomerListActionTools
