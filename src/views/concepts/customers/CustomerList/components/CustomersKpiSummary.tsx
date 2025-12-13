import Card from '@/components/ui/Card'
import GrowShrinkValue from '@/components/shared/GrowShrinkValue'
import classNames from '@/utils/classNames'
import { NumericFormat } from 'react-number-format'
import {
    TbTicket,
    TbUsers,
    TbUsersGroup,
    TbRepeat,
    TbAlertTriangle,
} from 'react-icons/tb'
import type { ReactNode } from 'react'

type SummarySegmentProps = {
    title: string
    value: string | number | ReactNode
    growShrink?: number
    icon: ReactNode
    iconClass: string
    className?: string
}

const SummarySegment = ({
    title,
    value,
    growShrink,
    icon,
    iconClass,
    className,
}: SummarySegmentProps) => {
    const hasVariation = typeof growShrink === 'number'

    return (
        <div className={classNames('flex flex-col gap-2 py-4 px-6', className)}>
            <div
                className={classNames(
                    'flex items-center justify-center min-h-12 min-w-12 max-h-12 max-w-12 text-gray-900 rounded-full text-2xl',
                    iconClass,
                )}
            >
                {icon}
            </div>

            <div className="mt-4">
                <div className="mb-1">{title}</div>
                <h3 className="mb-1">{value}</h3>

                {/* Área FIXA e padronizada */}
                <div className="flex items-center gap-1 h-[22px]">
                    <GrowShrinkValue
                        className={classNames(
                            'font-bold',
                            !hasVariation && 'opacity-0',
                        )}
                        value={growShrink ?? 0}
                        suffix="%"
                        positiveIcon="+"
                        negativeIcon=""
                    />
                    <span className={classNames(!hasVariation && 'opacity-0')}>
                        comparado ao mês passado
                    </span>
                </div>
            </div>
        </div>
    )
}

const KpiSummary = () => {
    return (
        <Card>
            <div className="flex items-center justify-between">
                <h4>Estatísticas dos Clientes</h4>
            </div>

            <div className="grid md:grid-cols-2 xl:grid-cols-5 mt-4">
                <SummarySegment
                    title="Total de Clientes"
                    value={
                        <NumericFormat
                            displayType="text"
                            value={1903}
                            thousandSeparator
                        />
                    }
                    icon={<TbUsersGroup />}
                    iconClass="bg-orange-200"
                    className="border-b md:border-b-0 xl:ltr:border-r xl:rtl:border-l border-gray-200 dark:border-gray-700"
                />

                <SummarySegment
                    title="Ticket Médio"
                    value={
                        <NumericFormat
                            prefix="$"
                            displayType="text"
                            value={50}
                            thousandSeparator
                        />
                    }
                    growShrink={12.5}
                    icon={<TbTicket />}
                    iconClass="bg-emerald-200"
                    className="border-b md:border-b-0 xl:ltr:border-r xl:rtl:border-l border-gray-200 dark:border-gray-700"
                />

                <SummarySegment
                    title="Clientes Ativos"
                    value={
                        <NumericFormat
                            suffix="%"
                            displayType="text"
                            value={32.8}
                        />
                    }
                    growShrink={4.2}
                    icon={<TbUsers />}
                    iconClass="bg-sky-200"
                    className="border-b md:border-b-0 xl:ltr:border-r xl:rtl:border-l border-gray-200 dark:border-gray-700"
                />

                <SummarySegment
                    title="Clientes Recorrentes"
                    value={
                        <NumericFormat
                            suffix="%"
                            displayType="text"
                            value={6.4}
                        />
                    }
                    growShrink={-1.1}
                    icon={<TbRepeat />}
                    iconClass="bg-teal-200"
                    className="border-b md:border-b-0 xl:ltr:border-r xl:rtl:border-l border-gray-200 dark:border-gray-700"
                />

                <SummarySegment
                    title="Clientes com Contestações"
                    value={
                        <NumericFormat
                            displayType="text"
                            value={1280}
                            thousandSeparator
                        />
                    }
                    growShrink={9.7}
                    icon={<TbAlertTriangle />}
                    iconClass="bg-amber-200"
                    className="border-b md:border-b-0 border-gray-200 dark:border-gray-700"
                />
            </div>
        </Card>
    )
}

export default KpiSummary
