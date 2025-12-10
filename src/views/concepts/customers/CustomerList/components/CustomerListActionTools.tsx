import Button from '@/components/ui/Button'
import { TbUserPlus } from 'react-icons/tb'
import { useNavigate } from 'react-router'
import { useTranslation } from 'react-i18next'

const CustomerListActionTools = () => {
    const navigate = useNavigate()
    const { t } = useTranslation()

    return (
        <div className="flex flex-col md:flex-row gap-3">
            <Button
                variant="solid"
                icon={<TbUserPlus className="text-xl" />}
                onClick={() => navigate('/concepts/customers/customer-create')}
            >
                {t('nav.conceptsCustomers.customerCreate')}
            </Button>
        </div>
    )
}

export default CustomerListActionTools
