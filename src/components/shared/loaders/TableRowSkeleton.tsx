import Skeleton from '@/components/ui/Skeleton'
import Table from '@/components/ui/Table'

type TableRowSkeletonProps = {
    columns?: number
    rows?: number
}

const { Tr, Td, TBody } = Table

const TableRowSkeleton = (props: TableRowSkeletonProps) => {
    const { columns = 1, rows = 10 } = props

    return (
        <TBody>
            {Array.from({ length: rows }).map((_, row) => (
                <Tr key={`row-${row}`}>
                    {Array.from({ length: columns }).map((_, col) => (
                        <Td key={`col-${col}`}>
                            <div className="flex flex-auto items-center">
                                <Skeleton />
                            </div>
                        </Td>
                    ))}
                </Tr>
            ))}
        </TBody>
    )
}

export default TableRowSkeleton
