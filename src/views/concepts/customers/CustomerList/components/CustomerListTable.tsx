import { useMemo, useState } from 'react'
import Tooltip from '@/components/ui/Tooltip'
import DataTable from '@/components/shared/DataTable'
import useCustomerList from '../hooks/useCustomerList'
import cloneDeep from 'lodash/cloneDeep'
import { TbPencil } from 'react-icons/tb'
import { useTranslation } from 'react-i18next'
import type { OnSortParam, ColumnDef, Row } from '@/components/shared/DataTable'
import type { Customer } from '../types'
import type { TableQueries } from '@/@types/common'
import Dialog from '@/components/ui/Dialog'
import Button from '@/components/ui/Button'
import CustomerForm from '../../CustomerForm'
import type { CustomerFormSchema } from '../../CustomerForm'
import { apiCreateCustomer } from '@/services/CustomersService'
import toast from '@/components/ui/toast'
import Notification from '@/components/ui/Notification'
import { useSWRConfig } from 'swr'
import { buildQueryParams } from '../hooks/useCustomerList'
import { useCustomerListStore } from '../store/customerListStore'

const NameColumn = ({ row }: { row: Customer }) => (
    <div className="flex items-center">
        <span className="rtl:mr-2 font-semibold text-gray-900 dark:text-gray-100">
            {row.name}
        </span>
    </div>
)

const ActionColumn = ({ onEdit }: { onEdit: () => void }) => {
    const { t } = useTranslation()

    return (
        <div className="flex items-center gap-3">
            <Tooltip title={t('nav.table.edit')}>
                <div
                    className="text-xl cursor-pointer select-none font-semibold"
                    role="button"
                    onClick={onEdit}
                >
                    <TbPencil />
                </div>
            </Tooltip>
        </div>
    )
}

const CustomerListTable = () => {
    const { t } = useTranslation()
    const { mutate } = useSWRConfig()
    const { tableData } = useCustomerListStore()

    const {
        customerList,
        customerListTotal,
        isLoading,
        setTableData,
        setSelectAllCustomer,
        setSelectedCustomer,
        selectedCustomer,
    } = useCustomerList()

    const [dialogIsOpen, setDialogIsOpen] = useState(false)
    const [editingCustomer, setEditingCustomer] = useState<Customer | null>(
        null,
    )
    const [saving, setSaving] = useState(false)
    const [formDirty, setFormDirty] = useState(false)

    const buildKey = () => ['/api/customers', buildQueryParams(tableData)]

    const handleEdit = (customer: Customer) => {
        setEditingCustomer(customer)
        setFormDirty(false)
        setDialogIsOpen(true)
    }

    const handleCloseDialog = () => {
        setDialogIsOpen(false)
        setFormDirty(false)
        setTimeout(() => setEditingCustomer(null), 150)
    }

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

    const handleSubmitEdit = async (values: CustomerFormSchema) => {
        try {
            setSaving(true)

            const payload = mapPayloadToBackend(values)

            const resp = await apiCreateCustomer<{
                message: { type: string; message: string; code: string }
                data?: any
            }>(payload)

            const code = resp?.message?.code
            const isError = resp?.message?.type === 'error'
            const nome = resp?.data?.full_name

            if (isError) {
                toast.push(
                    <Notification
                        title={t('nav.conceptsCustomers.error')}
                        type="danger"
                    >
                        {t('nav.conceptsCustomers.errors.unexpected')}
                    </Notification>,
                    { placement: 'bottom-start' },
                )
                return
            }

            if (code === 'CLIENT_UPDATED') {
                toast.push(
                    <Notification
                        title={t('nav.conceptsCustomers.updatedTitle')}
                        type="info"
                    >
                        {t('nav.conceptsCustomers.updatedMessage', {
                            name: nome,
                        })}
                    </Notification>,
                    { placement: 'bottom-start' },
                )
            }

            mutate(buildKey())
            handleCloseDialog()
        } catch {
            toast.push(
                <Notification
                    title={t('nav.conceptsCustomers.unexpectedError')}
                    type="danger"
                >
                    {t('nav.conceptsCustomers.errors.unexpected')}
                </Notification>,
                { placement: 'bottom-start' },
            )
        } finally {
            setSaving(false)
        }
    }

    const columns: ColumnDef<Customer>[] = useMemo(
        () => [
            {
                header: t('nav.table.identifier'),
                accessorKey: 'id',
                enableSorting: false,
            },
            {
                header: t('nav.table.name'),
                accessorKey: 'name',
                enableSorting: false,
                cell: (props) => <NameColumn row={props.row.original} />,
            },
            {
                header: t('nav.table.email'),
                accessorKey: 'email',
                enableSorting: false,
            },
            {
                header: t('nav.table.totalSpending'),
                accessorKey: 'totalSpending',
                cell: (props) => (
                    <span>${props.row.original.totalSpending}</span>
                ),
            },
            {
                header: '',
                id: 'action',
                enableSorting: false,
                cell: (props) => (
                    <ActionColumn
                        onEdit={() => handleEdit(props.row.original)}
                    />
                ),
            },
        ],
        [t],
    )

    const handleSetTableData = (data: TableQueries) => {
        setTableData(data)
        if (selectedCustomer.length > 0) setSelectAllCustomer([])
    }

    const handlePaginationChange = (page: number) => {
        const newTableData = cloneDeep(tableData)
        newTableData.pageIndex = page
        handleSetTableData(newTableData)
    }

    const handleSelectChange = (value: number) => {
        const newTableData = cloneDeep(tableData)
        newTableData.pageSize = Number(value)
        newTableData.pageIndex = 1
        handleSetTableData(newTableData)
    }

    const handleSort = (sort: OnSortParam) => {
        const normalizedSort: OnSortParam = {
            key: sort.key,
            order: sort.order === 'asc' ? 'desc' : 'asc',
        }

        if (
            tableData.sort?.key === normalizedSort.key &&
            tableData.sort?.order === normalizedSort.order
        ) {
            return
        }

        const newTableData = cloneDeep(tableData)
        newTableData.sort = normalizedSort
        handleSetTableData(newTableData)
    }

    const handleRowSelect = (checked: boolean, row: Customer) => {
        setSelectedCustomer(checked, row)
    }

    const handleAllRowSelect = (checked: boolean, rows: Row<Customer>[]) => {
        setSelectAllCustomer(checked ? rows.map((r) => r.original) : [])
    }

    const defaultFormValues: CustomerFormSchema = {
        firstName: editingCustomer?.firstName ?? '',
        lastName: editingCustomer?.lastName ?? '',
        email: editingCustomer?.email ?? '',
        dialCode: editingCustomer?.dialCode ?? '',
        phoneLocal: editingCustomer?.phoneLocal ?? '',
        address: editingCustomer?.street ?? '',
        street_number: editingCustomer?.streetNumber ?? '',
        complement: editingCustomer?.complement ?? '',
        neigh: editingCustomer?.neigh ?? '',
        city: editingCustomer?.city ?? '',
        postcode: editingCustomer?.zipCode ?? '',
        state: editingCustomer?.state ?? '',
        tax_id: editingCustomer?.taxId ?? '',
    }

    return (
        <>
            <DataTable
                selectable
                columns={columns}
                data={customerList}
                noData={!isLoading && customerList.length === 0}
                loading={isLoading}
                pagingData={{
                    total: customerListTotal,
                    pageIndex: tableData.pageIndex as number,
                    pageSize: tableData.pageSize as number,
                }}
                checkboxChecked={(row) =>
                    selectedCustomer.some((s) => s.id === row.id)
                }
                onPaginationChange={handlePaginationChange}
                onSelectChange={handleSelectChange}
                onSort={handleSort}
                onCheckBoxChange={handleRowSelect}
                onIndeterminateCheckBoxChange={handleAllRowSelect}
            />

            <Dialog
                isOpen={dialogIsOpen}
                preventScroll={true}
                style={{ content: { marginTop: 80 } }}
                contentClassName="pb-0 px-0"
                bodyOpenClassName="overflow-hidden"
                onClose={handleCloseDialog}
                onRequestClose={handleCloseDialog}
            >
                <div className="flex flex-col max-h-[80vh]">
                    <div className="overflow-y-auto max-h-[70vh] px-6 pb-6">
                        <h5 className="mb-4">
                            {t('nav.editCustomerDialog.title')}
                        </h5>

                        {editingCustomer && (
                            <CustomerForm
                                defaultValues={defaultFormValues}
                                onFormSubmit={handleSubmitEdit}
                                onDirtyChange={setFormDirty}
                                isModal={true}
                            />
                        )}
                    </div>

                    <div className="flex justify-end gap-2 px-6 py-3 bg-gray-100 dark:bg-gray-700 rounded-bl-lg rounded-br-lg">
                        <Button onClick={handleCloseDialog}>
                            {t('nav.editCustomerDialog.cancelButton')}
                        </Button>
                        <Button
                            variant="solid"
                            form="customer-form"
                            type="submit"
                            loading={saving}
                            disabled={saving || !formDirty}
                            className="min-w-[130px]"
                        >
                            {t('nav.editCustomerDialog.saveButton')}
                        </Button>
                    </div>
                </div>
            </Dialog>
        </>
    )
}

export default CustomerListTable
