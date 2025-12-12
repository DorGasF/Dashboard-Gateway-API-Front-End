import {
    HiCheckCircle,
    HiOutlineInformationCircle,
    HiOutlineExclamation,
    HiOutlineExclamationCircle,
} from 'react-icons/hi'
import Avatar from '@/components/ui/Avatar'
import Button from '@/components/ui/Button'
import Dialog from '@/components/ui/Dialog'
import type { ReactNode } from 'react'
import type { DialogProps } from '@/components/ui/Dialog'
import type { ButtonProps } from '@/components/ui/Button'
import { useTranslation } from 'react-i18next'

type StatusType = 'info' | 'success' | 'warning' | 'danger'

interface ConfirmDialogProps extends DialogProps {
    cancelText?: ReactNode | string
    confirmText?: ReactNode | string
    confirmButtonProps?: ButtonProps
    cancelButtonProps?: ButtonProps
    type?: StatusType
    title?: ReactNode | string
    onCancel?: () => void
    onConfirm?: () => void
}

const StatusIcon = ({ status }: { status: StatusType }) => {
    switch (status) {
        case 'info':
            return (
                <Avatar
                    className="bg-blue-100 text-blue-600 dark:bg-blue-500/20 dark:text-blue-100"
                    shape="circle"
                >
                    <span className="text-2xl">
                        <HiOutlineInformationCircle />
                    </span>
                </Avatar>
            )
        case 'success':
            return (
                <Avatar
                    className="bg-emerald-100 text-emerald-600 dark:bg-emerald-500/20 dark:text-emerald-100"
                    shape="circle"
                >
                    <span className="text-2xl">
                        <HiCheckCircle />
                    </span>
                </Avatar>
            )
        case 'warning':
            return (
                <Avatar
                    className="bg-amber-100 text-amber-600 dark:text-amber-100"
                    shape="circle"
                >
                    <span className="text-2xl">
                        <HiOutlineExclamationCircle />
                    </span>
                </Avatar>
            )
        case 'danger':
            return (
                <Avatar
                    className="bg-red-100 text-red-600 dark:text-red-100"
                    shape="circle"
                >
                    <span className="text-2xl">
                        <HiOutlineExclamation />
                    </span>
                </Avatar>
            )
        default:
            return null
    }
}

const ConfirmDialog = (props: ConfirmDialogProps) => {
    const { t } = useTranslation()

    const {
        type = 'info',
        title,
        children,
        onCancel,
        onConfirm,
        cancelText,
        confirmText,
        confirmButtonProps,
        cancelButtonProps,
        ...rest
    } = props

    return (
        <Dialog
            {...rest}
            overlayClassName="flex items-center justify-center"
            contentClassName="pb-0 px-0 max-h-[90vh] overflow-y-auto"
        >
            <div className="px-6 pb-6 pt-2 flex">
                <div>
                    <StatusIcon status={type} />
                </div>
                <div className="ml-4 rtl:mr-4">
                    <h5 className="mb-2">{title}</h5>
                    {children}
                </div>
            </div>

            <div className="px-6 py-3 bg-gray-100 dark:bg-gray-700 rounded-bl-2xl rounded-br-2xl">
                <div className="flex justify-end items-center gap-2">
                    <Button size="sm" onClick={onCancel} {...cancelButtonProps}>
                        {cancelText ?? t('nav.confirmDialog.cancel')}
                    </Button>
                    <Button
                        size="sm"
                        variant="solid"
                        onClick={onConfirm}
                        {...confirmButtonProps}
                    >
                        {confirmText ?? t('nav.confirmDialog.confirm')}
                    </Button>
                </div>
            </div>
        </Dialog>
    )
}

export default ConfirmDialog
