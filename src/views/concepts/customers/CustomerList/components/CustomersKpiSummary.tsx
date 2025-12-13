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
import { useTranslation } from 'react-i18next'

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
    const { t } = useTranslation()
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
                        {t('nav.customerKpi.comparedLastMonth')}
                    </span>
                </div>
            </div>
        </div>
    )
}

const KpiSummary = () => {
    const { t } = useTranslation()

    return (
        <Card>
            <div className="flex items-center justify-between">
                <h4>{t('nav.customerKpi.title')}</h4>
            </div>

            <div className="grid md:grid-cols-2 xl:grid-cols-5 mt-4">
                <SummarySegment
                    title={t('nav.customerKpi.totalCustomers')}
                    value={
                        <NumericFormat
                            displayType="text"
                            value={0}
                            thousandSeparator
                        />
                    }
                    icon={<TbUsersGroup />}
                    iconClass="bg-orange-200"
                    className="border-b md:border-b-0 xl:ltr:border-r xl:rtl:border-l border-gray-200 dark:border-gray-700"
                />

                <SummarySegment
                    title={t('nav.customerKpi.averageTicket')}
                    value={
                        <NumericFormat
                            prefix="$"
                            displayType="text"
                            value={0}
                            thousandSeparator
                        />
                    }
                    growShrink={0}
                    icon={<TbTicket />}
                    iconClass="bg-emerald-200"
                    className="border-b md:border-b-0 xl:ltr:border-r xl:rtl:border-l border-gray-200 dark:border-gray-700"
                />

                <SummarySegment
                    title={t('nav.customerKpi.activeCustomers')}
                    value={
                        <NumericFormat
                            suffix="%"
                            displayType="text"
                            value={0}
                        />
                    }
                    growShrink={0}
                    icon={<TbUsers />}
                    iconClass="bg-sky-200"
                    className="border-b md:border-b-0 xl:ltr:border-r xl:rtl:border-l border-gray-200 dark:border-gray-700"
                />

                <SummarySegment
                    title={t('nav.customerKpi.recurringCustomers')}
                    value={
                        <NumericFormat
                            suffix="%"
                            displayType="text"
                            value={0}
                        />
                    }
                    growShrink={0}
                    icon={<TbRepeat />}
                    iconClass="bg-teal-200"
                    className="border-b md:border-b-0 xl:ltr:border-r xl:rtl:border-l border-gray-200 dark:border-gray-700"
                />

                <SummarySegment
                    title={t('nav.customerKpi.customersWithDisputes')}
                    value={
                        <NumericFormat
                            displayType="text"
                            value={0}
                            thousandSeparator
                        />
                    }
                    growShrink={0}
                    icon={<TbAlertTriangle />}
                    iconClass="bg-amber-200"
                    className="border-b md:border-b-0 border-gray-200 dark:border-gray-700"
                />
            </div>
        </Card>
    )
}

export default KpiSummary
