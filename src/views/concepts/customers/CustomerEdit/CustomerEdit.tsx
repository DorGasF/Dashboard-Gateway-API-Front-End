import { useState } from 'react'
import Container from '@/components/shared/Container'
import Button from '@/components/ui/Button'
import Notification from '@/components/ui/Notification'
import toast from '@/components/ui/toast'
import ConfirmDialog from '@/components/shared/ConfirmDialog'
import { apiGetCustomer } from '@/services/CustomersService'
import CustomerForm from '../CustomerForm'
import sleep from '@/utils/sleep'
import NoUserFound from '@/assets/svg/NoUserFound'
import { TbTrash, TbArrowNarrowLeft } from 'react-icons/tb'
import { useParams, useNavigate } from 'react-router'
import useSWR from 'swr'
import { useTranslation } from 'react-i18next'
import type { CustomerFormSchema } from '../CustomerForm'
import type { Customer } from '../CustomerList/types'

const CustomerEdit = () => {
    const { id } = useParams()
    const navigate = useNavigate()
    const { t } = useTranslation()

    const { data, isLoading } = useSWR(
        [`/api/customers${id}`, { id: id as string }],
        ([_, params]) => apiGetCustomer<Customer, { id: string }>(params),
        {
            revalidateOnFocus: false,
            revalidateIfStale: false,
        },
    )

    const [deleteConfirmationOpen, setDeleteConfirmationOpen] = useState(false)
    const [isSubmitting, setIsSubmitting] = useState(false)

    const handleFormSubmit = async (values: CustomerFormSchema) => {
        setIsSubmitting(true)
        await sleep(800)
        setIsSubmitting(false)

        toast.push(
            <Notification type="success">
                {t('nav.customerEdit.toastChangesSaved')}
            </Notification>,
            { placement: 'top-center' },
        )

        navigate('/concepts/customers/customer-list')
    }

    const getDefaultValues = () => {
        if (!data) return {}

        return {
            firstName: data.firstName,
            lastName: data.lastName,
            email: data.email,
            img: data.img,
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
        setDeleteConfirmationOpen(true)

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
            {!isLoading && !data && (
                <div className="h-full flex flex-col items-center justify-center">
                    <NoUserFound height={280} width={280} />
                    <h3 className="mt-8">
                        {t('nav.customerEdit.noUserFound')}
                    </h3>
                </div>
            )}

            <CustomerForm
                defaultValues={getDefaultValues() as CustomerFormSchema}
                newCustomer={false}
                onFormSubmit={handleFormSubmit}
            >
                <Container>
                    <div className="flex items-center justify-between px-8">
                        <Button
                            className="ltr:mr-3 rtl:ml-3"
                            type="button"
                            variant="plain"
                            icon={<TbArrowNarrowLeft />}
                            onClick={handleBack}
                            disabled={buttonsDisabled}
                        >
                            {t('nav.customerEdit.back')}
                        </Button>

                        <div className="flex items-center">
                            <Button
                                className="ltr:mr-3 rtl:ml-3"
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
