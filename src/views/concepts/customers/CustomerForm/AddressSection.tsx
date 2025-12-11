import Card from '@/components/ui/Card'
import Input from '@/components/ui/Input'
import { FormItem } from '@/components/ui/Form'
import { Controller } from 'react-hook-form'
import { components } from 'react-select'
import type { FormSectionBaseProps } from './types'

type AddressSectionProps = FormSectionBaseProps

const { Control } = components

const AddressSection = ({ control, errors }: AddressSectionProps) => {
    return (
        <Card>
            <h4 className="mb-6">Address Information</h4>

            <FormItem
                label="Complement"
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
                            placeholder="Apartment / Complement"
                            maxLength={40}
                            {...field}
                        />
                    )}
                />
            </FormItem>

            {/* City + Postal Code */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Street */}
                <FormItem
                    label="Street"
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
                                placeholder="Street"
                                maxLength={120}
                                {...field}
                            />
                        )}
                    />
                </FormItem>

                <FormItem
                    label="Street Number"
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
                                placeholder="Número"
                                maxLength={10}
                                {...field}
                            />
                        )}
                    />
                </FormItem>

                <FormItem
                    label="Bairro"
                    invalid={Boolean(errors.neigh)}
                    errorMessage={errors.neigh?.message}
                >
                    <Controller
                        name="neigh"
                        control={control}
                        render={({ field }) => (
                            <Input
                                type="text"
                                placeholder="Bairro"
                                maxLength={80}
                                {...field}
                            />
                        )}
                    />
                </FormItem>

                <FormItem
                    label="City"
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
                                placeholder="City"
                                maxLength={80}
                                {...field}
                            />
                        )}
                    />
                </FormItem>

                <FormItem
                    label="Postal Code"
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
                                placeholder="Postal Code"
                                maxLength={15}
                                {...field}
                            />
                        )}
                    />
                </FormItem>

                {/* State */}
                <FormItem
                    label="State"
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
                                placeholder="State / Province / Region (SP, NY)"
                                maxLength={5}
                                {...field}
                            />
                        )}
                    />
                </FormItem>

                <FormItem
                    label="Tax ID"
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
                                placeholder="CPF ou CNPJ"
                                maxLength={20}
                                {...field}
                            />
                        )}
                    />
                </FormItem>
            </div>
        </Card>
    )
}

export default AddressSection
