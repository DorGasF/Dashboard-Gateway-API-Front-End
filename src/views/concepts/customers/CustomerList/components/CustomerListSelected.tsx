import { useState } from 'react'
import StickyFooter from '@/components/shared/StickyFooter'
import Button from '@/components/ui/Button'
import ConfirmDialog from '@/components/shared/ConfirmDialog'
import useCustomerList from '../hooks/useCustomerList'
import { TbChecks } from 'react-icons/tb'
import { useTranslation } from 'react-i18next'

const CustomerListSelected = () => {
    const { t } = useTranslation()

    const {
        selectedCustomer,
        customerList,
        mutate,
        customerListTotal,
        setSelectAllCustomer,
    } = useCustomerList()

    const [deleteConfirmationOpen, setDeleteConfirmationOpen] = useState(false)

    const handleDelete = () => {
        setDeleteConfirmationOpen(true)
    }

    const handleCancel = () => {
        setDeleteConfirmationOpen(false)
    }

    const handleConfirmDelete = () => {
        const newCustomerList = customerList.filter(
            (customer) =>
                !selectedCustomer.some(
                    (selected) => selected.id === customer.id,
                ),
        )

        setSelectAllCustomer([])
        mutate(
            {
                list: newCustomerList,
                total: customerListTotal - selectedCustomer.length,
            },
            false,
        )

        setDeleteConfirmationOpen(false)
    }

    return (
        <>
            {selectedCustomer.length > 0 && (
                <StickyFooter
                    className="flex items-center justify-between py-4 bg-white dark:bg-gray-800"
                    stickyClass="-mx-4 sm:-mx-8 border-t border-gray-200 dark:border-gray-700 px-8"
                    defaultClass="container mx-auto px-8 rounded-xl border border-gray-200 dark:border-gray-600 mt-4"
                >
                    <div className="container mx-auto">
                        <div className="flex items-center justify-between">
                            <span className="flex items-center gap-2">
                                <span className="text-lg text-primary">
                                    <TbChecks />
                                </span>
                                <span className="font-semibold flex items-center gap-1">
                                    <span className="heading-text">
                                        {selectedCustomer.length}{' '}
                                        {t(
                                            'nav.customerListSelected.customers',
                                        )}
                                    </span>
                                    <span>
                                        {t('nav.customerListSelected.selected')}
                                    </span>
                                </span>
                            </span>

                            <Button
                                size="sm"
                                type="button"
                                customColorClass={() =>
                                    'border-error ring-1 ring-error text-error hover:border-error hover:ring-error hover:text-error'
                                }
                                onClick={handleDelete}
                            >
                                {t('nav.customerListSelected.delete')}
                            </Button>
                        </div>
                    </div>
                </StickyFooter>
            )}

            <ConfirmDialog
                isOpen={deleteConfirmationOpen}
                type="danger"
                title={t('nav.customerListSelected.removeTitle')}
                onClose={handleCancel}
                onRequestClose={handleCancel}
                onCancel={handleCancel}
                onConfirm={handleConfirmDelete}
            >
                <p>{t('nav.customerListSelected.removeDescription')}</p>
            </ConfirmDialog>
        </>
    )
}

export default CustomerListSelected
