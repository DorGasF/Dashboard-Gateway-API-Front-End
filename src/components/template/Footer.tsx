import Container from '@/components/shared/Container'
import classNames from '@/utils/classNames'
import { APP_NAME } from '@/constants/app.constant'
import { PAGE_CONTAINER_GUTTER_X } from '@/constants/theme.constant'
import { useTranslation } from 'react-i18next'

export type FooterPageContainerType = 'gutterless' | 'contained'

type FooterProps = {
    pageContainerType: FooterPageContainerType
    className?: string
}

const FooterContent = () => {
    const { t } = useTranslation()

    return (
        <div className="flex items-center justify-between flex-auto w-full">
            <span>
                {t('nav.footer.copyrightPrefix', {
                    year: new Date().getFullYear(),
                })}{' '}
                <span className="font-semibold">{APP_NAME}</span>{' '}
                {t('nav.footer.copyrightSuffix')}
            </span>

            <div>
                <a
                    className="text-gray hover:text-primary active:text-primary transition-colors"
                    href="/#"
                    onClick={(e) => e.preventDefault()}
                >
                    {t('nav.footer.terms')}
                </a>
                <span className="mx-2 text-muted"> | </span>
                <a
                    className="text-gray hover:text-primary active:text-primary transition-colors"
                    href="/#"
                    onClick={(e) => e.preventDefault()}
                >
                    {t('nav.footer.privacy')}
                </a>
            </div>
        </div>
    )
}

export default function Footer({
    pageContainerType = 'contained',
    className,
}: FooterProps) {
    return (
        <footer
            className={classNames(
                `footer flex flex-auto items-center h-16 ${PAGE_CONTAINER_GUTTER_X}`,
                className,
            )}
        >
            {pageContainerType === 'contained' ? (
                <Container>
                    <FooterContent />
                </Container>
            ) : (
                <FooterContent />
            )}
        </footer>
    )
}
