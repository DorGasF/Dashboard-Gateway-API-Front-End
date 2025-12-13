import { useState } from 'react'
import StickyFooter from '@/components/shared/StickyFooter'
import Button from '@/components/ui/Button'
import ConfirmDialog from '@/components/shared/ConfirmDialog'
import { TbChecks } from 'react-icons/tb'
import { useTranslation } from 'react-i18next'
import { apiRemoveCustomers } from '@/services/CustomersService'
import toast from '@/components/ui/toast'
import Notification from '@/components/ui/Notification'
import { useCustomerListContext } from '../CustomerListProvider'

const CustomerListSelected = () => {
    const { t } = useTranslation()

    const {
        selectedCustomer,
        customerList,
        mutate,
        customerListTotal,
        setSelectAllCustomer,
    } = useCustomerListContext()

    const [deleteConfirmationOpen, setDeleteConfirmationOpen] = useState(false)
    const [loading, setLoading] = useState(false)

    const isSingle = selectedCustomer.length === 1

    const handleDelete = () => {
        setDeleteConfirmationOpen(true)
    }

    const handleCancel = () => {
        if (loading) return
        setDeleteConfirmationOpen(false)
    }

    const handleConfirmDelete = async () => {
        if (!selectedCustomer.length) return

        setLoading(true)

        try {
            const identifiers = selectedCustomer
                .map((c) => c.id)
                .filter((id): id is string => Boolean(id))

            if (!identifiers.length) {
                setDeleteConfirmationOpen(false)
                return
            }

            const response = await apiRemoveCustomers<{
                data: {
                    removed: string[]
                    blocked: string[]
                }
            }>({ identifiers })

            const removed = response?.data?.removed ?? []
            const blocked = response?.data?.blocked ?? []

            if (removed.length) {
                const newTotal = customerListTotal - removed.length
                const newList = customerList.filter(
                    (customer) => !removed.includes(customer.id as string),
                )

                if (newList.length === 0 && newTotal > 0) {
                    await mutate()
                } else {
                    mutate({ list: newList, total: newTotal }, false)
                }
            }

            if (removed.length && !blocked.length) {
                toast.push(
                    <Notification type="success">
                        {t(
                            removed.length === 1
                                ? 'nav.customerListSelected.toastRemoveSingle'
                                : 'nav.customerListSelected.toastRemoveMultiple',
                            { count: removed.length },
                        )}
                    </Notification>,
                    { placement: 'bottom-start' },
                )
            } else if (removed.length && blocked.length) {
                toast.push(
                    <Notification type="warning">
                        {t(
                            removed.length === 1
                                ? 'nav.customerListSelected.toastRemoveSingle'
                                : 'nav.customerListSelected.toastRemoveMultiple',
                            { count: removed.length },
                        )}
                        {', '}
                        {t(
                            blocked.length === 1
                                ? 'nav.customerListSelected.toastBlockedSingle'
                                : 'nav.customerListSelected.toastBlockedMultiple',
                            { count: blocked.length },
                        )}
                        .
                    </Notification>,
                    { placement: 'bottom-start' },
                )
            } else {
                toast.push(
                    <Notification type="danger">
                        {t('nav.customerListSelected.toastNotAllowed')}
                    </Notification>,
                    { placement: 'bottom-start' },
                )
            }

            setSelectAllCustomer([])
            setDeleteConfirmationOpen(false)
        } catch {
            toast.push(
                <Notification type="danger">
                    {t('nav.customerListSelected.toastError')}
                </Notification>,
                { placement: 'bottom-start' },
            )
        } finally {
            setLoading(false)
        }
    }

    return (
        <>
            {selectedCustomer.length > 0 && (
                <StickyFooter
                    className="flex items-center justify-between py-4 bg-white dark:bg-gray-800"
                    stickyClass="-mx-4 sm:-mx-8 border-t border-gray-200 dark:border-gray-700 px-8"
                    defaultClass="container mx-auto px-8 rounded-xl border border-gray-200 dark:border-gray-600 mt-4"
                >
                    <div className="flex items-center justify-between w-full">
                        <span className="flex items-center gap-2">
                            <span className="text-lg text-primary">
                                <TbChecks />
                            </span>

                            <span className="font-semibold flex items-center gap-1">
                                <span className="heading-text">
                                    {selectedCustomer.length}{' '}
                                    {t(
                                        isSingle
                                            ? 'nav.customerListSelected.customer'
                                            : 'nav.customerListSelected.customers',
                                    )}
                                </span>
                                <span>
                                    {t(
                                        isSingle
                                            ? 'nav.customerListSelected.selectedSingular'
                                            : 'nav.customerListSelected.selected',
                                    )}
                                </span>
                            </span>
                        </span>

                        <Button
                            size="sm"
                            type="button"
                            disabled={loading}
                            customColorClass={() =>
                                'border-error ring-1 ring-error text-error hover:border-error hover:ring-error hover:text-error'
                            }
                            onClick={handleDelete}
                        >
                            {t('nav.customerListSelected.delete')}
                        </Button>
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
                confirmButtonProps={{ loading }}
            >
                <p>{t('nav.customerListSelected.removeDescription')}</p>
            </ConfirmDialog>
        </>
    )
}

export default CustomerListSelected
