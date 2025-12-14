import Card from '@/components/ui/Card'
import GrowShrinkValue from '@/components/shared/GrowShrinkValue'
import classNames from '@/utils/classNames'
import { NumericFormat } from 'react-number-format'
import { TbInfoCircle } from 'react-icons/tb'
import Tooltip from '@/components/ui/Tooltip'

import {
    TbTicket,
    TbMoneybag,
    TbCircleCheck,
    TbClock,
    TbAlertTriangle,
} from 'react-icons/tb'
import type { ReactNode } from 'react'

type SummarySegmentProps = {
    title: string | ReactNode
    value: string | number | ReactNode
    growShrink?: number
    icon: ReactNode
    iconClass: string
    className?: string
}

const GrossValueTitle = () => (
    <div className="flex items-center gap-1.5 text-gray-700 font-medium">
        <span>Total bruto recebido</span>

        <Tooltip title="Este valor não considera a taxa de intermediação das cobranças.">
            <TbInfoCircle className="text-[15px] text-gray-500 hover:text-gray-700 cursor-pointer transition-colors" />
        </Tooltip>
    </div>
)

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
                    'flex items-center justify-center min-h-12 min-w-12 max-h-12 max-w-12 rounded-full text-2xl',
                    iconClass,
                )}
            >
                {icon}
            </div>

            <div className="mt-4">
                <div className="mb-1 text-sm text-gray-500">{title}</div>
                <h3 className="mb-1 font-semibold tracking-tight">{value}</h3>

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
                <h4>Estatísticas das Cobranças</h4>
            </div>

            <div className="grid md:grid-cols-2 xl:grid-cols-5 mt-4">
                <SummarySegment
                    title="Total de cobranças"
                    value={
                        <NumericFormat
                            displayType="text"
                            value={0}
                            thousandSeparator
                        />
                    }
                    icon={<TbTicket />}
                    iconClass="bg-blue-100 text-blue-700"
                    className="border-b md:border-b-0 xl:ltr:border-r xl:rtl:border-l border-gray-200 dark:border-gray-700"
                />

                <SummarySegment
                    title={<GrossValueTitle />}
                    value={
                        <NumericFormat
                            prefix="R$ "
                            displayType="text"
                            value={50}
                            thousandSeparator
                            decimalScale={2}
                            fixedDecimalScale
                        />
                    }
                    icon={<TbMoneybag />}
                    iconClass="bg-emerald-100 text-emerald-700"
                    className="border-b md:border-b-0 xl:ltr:border-r xl:rtl:border-l border-gray-200 dark:border-gray-700"
                />

                <SummarySegment
                    title="Cobranças pagas"
                    value={
                        <NumericFormat
                            displayType="text"
                            value={0}
                            thousandSeparator
                        />
                    }
                    icon={<TbCircleCheck />}
                    iconClass="bg-green-100 text-green-700"
                    className="border-b md:border-b-0 xl:ltr:border-r xl:rtl:border-l border-gray-200 dark:border-gray-700"
                />

                <SummarySegment
                    title="Cobranças pendentes"
                    value={
                        <NumericFormat
                            displayType="text"
                            value={0}
                            thousandSeparator
                        />
                    }
                    icon={<TbClock />}
                    iconClass="bg-sky-100 text-sky-700"
                    className="border-b md:border-b-0 xl:ltr:border-r xl:rtl:border-l border-gray-200 dark:border-gray-700"
                />

                <SummarySegment
                    title="Cobranças vencidas"
                    value={
                        <NumericFormat
                            displayType="text"
                            value={0}
                            thousandSeparator
                        />
                    }
                    icon={<TbAlertTriangle />}
                    iconClass="bg-red-100 text-red-700"
                    className="border-b md:border-b-0 border-gray-200 dark:border-gray-700"
                />
            </div>
        </Card>
    )
}

export default KpiSummary
