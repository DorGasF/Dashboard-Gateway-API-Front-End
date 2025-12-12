import Card from '@/components/ui/Card'
import Input from '@/components/ui/Input'
import { FormItem } from '@/components/ui/Form'
import { Controller } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import type { FormSectionBaseProps } from './types'

type AddressSectionProps = FormSectionBaseProps

const AddressSection = ({ control, errors }: AddressSectionProps) => {
    const { t } = useTranslation()

    return (
        <Card>
            <h4 className="mb-6">{t('nav.addressSection.title')}</h4>

            {/* Complement */}
            <FormItem
                label={t('nav.addressSection.complement')}
                invalid={Boolean(errors.complement)}
                errorMessage={errors.complement?.message}
            >
                <Controller
                    name="complement"
                    control={control}
                    render={({ field }) => (
                        <Input
                            type="text"
                            autoComplete="off"
                            placeholder={t(
                                'nav.addressSection.complementPlaceholder',
                            )}
                            maxLength={40}
                            {...field}
                        />
                    )}
                />
            </FormItem>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Street */}
                <FormItem
                    label={t('nav.addressSection.street')}
                    invalid={Boolean(errors.address)}
                    errorMessage={errors.address?.message}
                >
                    <Controller
                        name="address"
                        control={control}
                        render={({ field }) => (
                            <Input
                                type="text"
                                autoComplete="off"
                                placeholder={t(
                                    'nav.addressSection.streetPlaceholder',
                                )}
                                maxLength={120}
                                {...field}
                            />
                        )}
                    />
                </FormItem>

                {/* Street Number */}
                <FormItem
                    label={t('nav.addressSection.streetNumber')}
                    invalid={Boolean(errors.street_number)}
                    errorMessage={errors.street_number?.message}
                >
                    <Controller
                        name="street_number"
                        control={control}
                        render={({ field }) => (
                            <Input
                                type="text"
                                autoComplete="off"
                                placeholder={t(
                                    'nav.addressSection.streetNumberPlaceholder',
                                )}
                                maxLength={10}
                                {...field}
                            />
                        )}
                    />
                </FormItem>

                {/* Neigh */}
                <FormItem
                    label={t('nav.addressSection.neigh')}
                    invalid={Boolean(errors.neigh)}
                    errorMessage={errors.neigh?.message}
                >
                    <Controller
                        name="neigh"
                        control={control}
                        render={({ field }) => (
                            <Input
                                type="text"
                                placeholder={t(
                                    'nav.addressSection.neighPlaceholder',
                                )}
                                maxLength={80}
                                {...field}
                            />
                        )}
                    />
                </FormItem>

                {/* City */}
                <FormItem
                    label={t('nav.addressSection.city')}
                    invalid={Boolean(errors.city)}
                    errorMessage={errors.city?.message}
                >
                    <Controller
                        name="city"
                        control={control}
                        render={({ field }) => (
                            <Input
                                type="text"
                                autoComplete="off"
                                placeholder={t(
                                    'nav.addressSection.cityPlaceholder',
                                )}
                                maxLength={80}
                                {...field}
                            />
                        )}
                    />
                </FormItem>

                {/* Postal Code */}
                <FormItem
                    label={t('nav.addressSection.postcode')}
                    invalid={Boolean(errors.postcode)}
                    errorMessage={errors.postcode?.message}
                >
                    <Controller
                        name="postcode"
                        control={control}
                        render={({ field }) => (
                            <Input
                                type="text"
                                autoComplete="off"
                                placeholder={t(
                                    'nav.addressSection.postcodePlaceholder',
                                )}
                                maxLength={15}
                                {...field}
                            />
                        )}
                    />
                </FormItem>

                {/* State */}
                <FormItem
                    label={t('nav.addressSection.state')}
                    invalid={Boolean(errors.state)}
                    errorMessage={errors.state?.message}
                >
                    <Controller
                        name="state"
                        control={control}
                        render={({ field }) => (
                            <Input
                                type="text"
                                autoComplete="off"
                                placeholder={t(
                                    'nav.addressSection.statePlaceholder',
                                )}
                                maxLength={5}
                                {...field}
                            />
                        )}
                    />
                </FormItem>

                {/* Tax ID */}
                <FormItem
                    label={t('nav.addressSection.taxId')}
                    invalid={Boolean(errors.tax_id)}
                    errorMessage={errors.tax_id?.message}
                >
                    <Controller
                        name="tax_id"
                        control={control}
                        render={({ field }) => (
                            <Input
                                type="text"
                                autoComplete="off"
                                placeholder={t(
                                    'nav.addressSection.taxIdPlaceholder',
                                )}
                                maxLength={20}
                                value={field.value}
                                onChange={(e) => {
                                    const numbersOnly = e.target.value.replace(
                                        /[^0-9]/g,
                                        '',
                                    )
                                    field.onChange(numbersOnly)
                                }}
                                onBlur={field.onBlur}
                            />
                        )}
                    />
                </FormItem>
            </div>
        </Card>
    )
}

export default AddressSection
