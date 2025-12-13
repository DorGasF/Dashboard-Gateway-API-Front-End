import {
    useMemo,
    useRef,
    useEffect,
    useState,
    useImperativeHandle,
} from 'react'
import classNames from 'classnames'
import Table from '@/components/ui/Table'
import Pagination from '@/components/ui/Pagination'
import Select from '@/components/ui/Select'
import Checkbox from '@/components/ui/Checkbox'
import Loading from './Loading'
import FileNotFound from '@/assets/svg/FileNotFound'
import Skeleton from '@/components/ui/Skeleton'
import {
    useReactTable,
    getCoreRowModel,
    getFilteredRowModel,
    getPaginationRowModel,
    getSortedRowModel,
    flexRender,
    ColumnDef,
    ColumnSort,
    Row,
    CellContext,
} from '@tanstack/react-table'
import type { TableProps } from '@/components/ui/Table'
import type { Ref, ChangeEvent, ReactNode } from 'react'
import type { CheckboxProps } from '@/components/ui/Checkbox'
import { useTranslation } from 'react-i18next'

export type OnSortParam = { order: 'asc' | 'desc' | ''; key: string | number }

const ROW_HEIGHT = 56

type DataTableProps<T> = {
    columns: ColumnDef<T>[]
    customNoDataIcon?: ReactNode
    data?: unknown[]
    loading?: boolean
    noData?: boolean
    instanceId?: string
    onCheckBoxChange?: (checked: boolean, row: T) => void
    onIndeterminateCheckBoxChange?: (checked: boolean, rows: Row<T>[]) => void
    onPaginationChange?: (page: number) => void
    onSelectChange?: (num: number) => void
    onSort?: (sort: OnSortParam) => void
    pageSizes?: number[]
    selectable?: boolean
    pagingData?: {
        total: number
        pageIndex: number
        pageSize: number
    }
    checkboxChecked?: (row: T) => boolean
    indeterminateCheckboxChecked?: (row: Row<T>[]) => boolean
    ref?: Ref<DataTableResetHandle | HTMLTableElement>
} & TableProps

type CheckBoxChangeEvent = ChangeEvent<HTMLInputElement>

interface IndeterminateCheckboxProps extends Omit<CheckboxProps, 'onChange'> {
    onChange: (event: CheckBoxChangeEvent) => void
    indeterminate: boolean
    onCheckBoxChange?: (event: CheckBoxChangeEvent) => void
    onIndeterminateCheckBoxChange?: (event: CheckBoxChangeEvent) => void
}

const { Tr, Th, Td, THead, TBody, Sorter } = Table

const IndeterminateCheckbox = (props: IndeterminateCheckboxProps) => {
    const {
        indeterminate,
        onChange,
        onCheckBoxChange,
        onIndeterminateCheckBoxChange,
        ...rest
    } = props

    const ref = useRef<HTMLInputElement>(null)

    useEffect(() => {
        if (typeof indeterminate === 'boolean' && ref.current) {
            ref.current.indeterminate = !rest.checked && indeterminate
        }
    }, [indeterminate, rest.checked])

    const handleChange = (e: CheckBoxChangeEvent) => {
        onChange(e)
        onCheckBoxChange?.(e)
        onIndeterminateCheckBoxChange?.(e)
    }

    return (
        <Checkbox
            ref={ref}
            className="mb-0"
            onChange={(_, e) => handleChange(e)}
            {...rest}
        />
    )
}

export type DataTableResetHandle = {
    resetSorting: () => void
    resetSelected: () => void
}

function DataTable<T>(props: DataTableProps<T>) {
    const {
        columns: columnsProp = [],
        data = [],
        customNoDataIcon,
        loading,
        noData,
        onCheckBoxChange,
        onIndeterminateCheckBoxChange,
        onPaginationChange,
        onSelectChange,
        onSort,
        pageSizes = [10, 25, 50, 100],
        selectable = false,
        pagingData = {
            total: 0,
            pageIndex: 1,
            pageSize: 10,
        },
        checkboxChecked,
        indeterminateCheckboxChecked,
        instanceId = 'data-table',
        ref,
        ...rest
    } = props

    const { pageSize, pageIndex, total } = pagingData
    const [sorting, setSorting] = useState<ColumnSort[]>([])
    const { t } = useTranslation()

    const pageSizeOption = useMemo(
        () =>
            pageSizes.map((number) => ({
                value: number,
                label: `${number} / ${t('nav.pagination.itemsPerPage')}`,
            })),
        [pageSizes, t],
    )

    useEffect(() => {
        const sort = sorting[0]

        if (!sort) {
            onSort?.({ order: '', key: '' })
            return
        }

        onSort?.({
            order: sort.desc ? 'desc' : 'asc',
            key: sort.id,
        })
    }, [sorting])

    const finalColumns: ColumnDef<T>[] = useMemo(() => {
        if (!selectable) return columnsProp
        return [
            {
                id: 'select',
                size: 50,
                header: ({ table }) => (
                    <IndeterminateCheckbox
                        checked={
                            indeterminateCheckboxChecked
                                ? indeterminateCheckboxChecked(
                                      table.getRowModel().rows,
                                  )
                                : table.getIsAllRowsSelected()
                        }
                        indeterminate={table.getIsSomeRowsSelected()}
                        onChange={table.getToggleAllRowsSelectedHandler()}
                        onIndeterminateCheckBoxChange={(e) =>
                            onIndeterminateCheckBoxChange?.(
                                e.target.checked,
                                table.getRowModel().rows,
                            )
                        }
                    />
                ),
                cell: ({ row }) => (
                    <IndeterminateCheckbox
                        checked={
                            checkboxChecked
                                ? checkboxChecked(row.original)
                                : row.getIsSelected()
                        }
                        indeterminate={row.getIsSomeSelected()}
                        onChange={row.getToggleSelectedHandler()}
                        onCheckBoxChange={(e) =>
                            onCheckBoxChange?.(e.target.checked, row.original)
                        }
                    />
                ),
            },
            ...columnsProp,
        ]
    }, [columnsProp, selectable, checkboxChecked, indeterminateCheckboxChecked])

    const table = useReactTable({
        data,
        columns: finalColumns as ColumnDef<any, any>[],
        getCoreRowModel: getCoreRowModel(),
        getFilteredRowModel: getFilteredRowModel(),
        getPaginationRowModel: getPaginationRowModel(),
        getSortedRowModel: getSortedRowModel(),
        manualPagination: true,
        manualSorting: true,
        onSortingChange: (sorter) => setSorting(sorter as ColumnSort[]),
        state: { sorting },
    })

    useImperativeHandle(ref, () => ({
        resetSorting: () => table.resetSorting(),
        resetSelected: () => table.resetRowSelection(true),
    }))

    return (
        <Loading loading={Boolean(loading && data.length !== 0)} type="cover">
            <Table {...rest} style={{ tableLayout: 'fixed' }}>
                <THead>
                    {table.getHeaderGroups().map((headerGroup) => (
                        <Tr key={headerGroup.id}>
                            {headerGroup.headers.map((header) => (
                                <Th
                                    key={header.id}
                                    colSpan={header.colSpan}
                                    style={{
                                        width: header.getSize(),
                                        minWidth: header.getSize(),
                                        maxWidth: header.getSize(),
                                    }}
                                >
                                    {!header.isPlaceholder && (
                                        <div
                                            className={classNames(
                                                header.column.getCanSort() &&
                                                    'cursor-pointer select-none point',
                                                loading &&
                                                    'pointer-events-none',
                                            )}
                                            onClick={header.column.getToggleSortingHandler()}
                                        >
                                            {flexRender(
                                                header.column.columnDef.header,
                                                header.getContext(),
                                            )}
                                            {header.column.getCanSort() && (
                                                <Sorter
                                                    sort={header.column.getIsSorted()}
                                                />
                                            )}
                                        </div>
                                    )}
                                </Th>
                            ))}
                        </Tr>
                    ))}
                </THead>

                <TBody>
                    {Array.from({ length: pageSize }).map((_, index) => {
                        const row = table.getRowModel().rows[index]

                        if (loading && data.length === 0) {
                            return (
                                <Tr
                                    key={`skeleton-${index}`}
                                    style={{ height: ROW_HEIGHT }}
                                >
                                    {finalColumns.map((_, col) => (
                                        <Td
                                            key={col}
                                            style={{
                                                width: table
                                                    .getAllLeafColumns()
                                                    [col]?.getSize(),
                                                overflow: 'hidden',
                                            }}
                                        >
                                            <Skeleton className="w-full" />
                                        </Td>
                                    ))}
                                </Tr>
                            )
                        }

                        if (noData && index === 0) {
                            return (
                                <Tr
                                    key="no-data"
                                    style={{ height: ROW_HEIGHT }}
                                >
                                    <Td colSpan={finalColumns.length}>
                                        <div className="flex flex-col items-center gap-4">
                                            {customNoDataIcon ?? (
                                                <>
                                                    <FileNotFound />
                                                    <span className="font-semibold">
                                                        {t(
                                                            'nav.pagination.noData',
                                                        )}
                                                    </span>
                                                </>
                                            )}
                                        </div>
                                    </Td>
                                </Tr>
                            )
                        }

                        return (
                            <Tr
                                key={row?.id ?? `empty-${index}`}
                                style={{ height: ROW_HEIGHT }}
                            >
                                {finalColumns.map((_, colIndex) => {
                                    const cell =
                                        row?.getVisibleCells()[colIndex]
                                    const isSelectColumn =
                                        cell?.column.id === 'select'

                                    return (
                                        <Td
                                            key={colIndex}
                                            style={{
                                                width: cell?.column.getSize(),
                                                minWidth:
                                                    cell?.column.getSize(),
                                                maxWidth:
                                                    cell?.column.getSize(),
                                            }}
                                        >
                                            {cell ? (
                                                isSelectColumn ? (
                                                    flexRender(
                                                        cell.column.columnDef
                                                            .cell,
                                                        cell.getContext(),
                                                    )
                                                ) : (
                                                    <div
                                                        style={{
                                                            width: '100%',
                                                            overflow: 'hidden',
                                                            whiteSpace:
                                                                'nowrap',
                                                            textOverflow:
                                                                'ellipsis',
                                                        }}
                                                    >
                                                        {flexRender(
                                                            cell.column
                                                                .columnDef.cell,
                                                            cell.getContext(),
                                                        )}
                                                    </div>
                                                )
                                            ) : null}
                                        </Td>
                                    )
                                })}
                            </Tr>
                        )
                    })}
                </TBody>
            </Table>

            <div className="flex items-center justify-between mt-4">
                <Pagination
                    pageSize={pageSize}
                    currentPage={pageIndex}
                    total={total}
                    onChange={onPaginationChange}
                />
                <div style={{ minWidth: 130 }}>
                    <Select
                        instanceId={instanceId}
                        size="sm"
                        menuPlacement="top"
                        isSearchable={false}
                        value={pageSizeOption.filter(
                            (option) => option.value === pageSize,
                        )}
                        options={pageSizeOption}
                        onChange={(option) =>
                            onSelectChange?.(Number(option?.value))
                        }
                    />
                </div>
            </div>
        </Loading>
    )
}

export type { ColumnDef, Row, CellContext }
export default DataTable
