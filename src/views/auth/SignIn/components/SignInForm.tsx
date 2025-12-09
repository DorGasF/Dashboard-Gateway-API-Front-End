import { useState } from 'react'
import Input from '@/components/ui/Input'
import Button from '@/components/ui/Button'
import { FormItem, Form } from '@/components/ui/Form'
import PasswordInput from '@/components/shared/PasswordInput'
import classNames from '@/utils/classNames'
import { useAuth } from '@/auth'
import { useForm, Controller } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { useTranslation } from 'react-i18next'
import Checkbox from '@/components/ui/Checkbox'
import type { CommonProps } from '@/@types/common'
import type { ReactNode } from 'react'

interface SignInFormProps extends CommonProps {
    disableSubmit?: boolean
    passwordHint?: string | ReactNode
    setMessage?: (message: string) => void
}

type SignInFormSchema = {
    email: string
    password: string
    remember: boolean
}

const SignInForm = (props: SignInFormProps) => {
    const { t } = useTranslation()

    const validationSchema = z.object({
        email: z
            .string()
            .min(1, { message: t('nav.authentication.enterEmail') })
            .email({ message: t('nav.authentication.enterEmail') }),
        password: z
            .string()
            .min(1, { message: t('nav.authentication.enterPassword') }),
        remember: z.boolean(),
    })

    const [isSubmitting, setSubmitting] = useState(false)

    const { disableSubmit = false, className, setMessage, passwordHint } = props

    const {
        handleSubmit,
        formState: { errors },
        control,
    } = useForm<SignInFormSchema>({
        defaultValues: {
            email: '',
            password: '',
            remember: true,
        },
        resolver: zodResolver(validationSchema),
    })

    const { signIn } = useAuth()

    const onSignIn = async (values: SignInFormSchema) => {
        const { email, password, remember } = values

        if (!disableSubmit) {
            setSubmitting(true)

            const result = await signIn({
                email,
                password,
                remember: remember ? '1' : '0',
            })

            if (result?.status === 'failed') {
                setMessage?.(result.message)
            }
        }

        setSubmitting(false)
    }

    return (
        <div className={className}>
            <Form onSubmit={handleSubmit(onSignIn)}>
                <FormItem
                    label={t('nav.authentication.email')}
                    invalid={!!errors.email}
                    errorMessage={errors.email?.message}
                >
                    <Controller
                        name="email"
                        control={control}
                        render={({ field }) => (
                            <Input
                                type="email"
                                placeholder={t('nav.authentication.email')}
                                autoComplete="off"
                                {...field}
                            />
                        )}
                    />
                </FormItem>

                <FormItem
                    label={t('nav.authentication.password')}
                    invalid={!!errors.password}
                    errorMessage={errors.password?.message}
                    className={classNames(
                        passwordHint ? 'mb-0' : '',
                        errors.password?.message ? 'mb-8' : '',
                    )}
                >
                    <Controller
                        name="password"
                        control={control}
                        render={({ field }) => (
                            <PasswordInput
                                type="text"
                                placeholder={t('nav.authentication.password')}
                                autoComplete="off"
                                {...field}
                            />
                        )}
                    />
                </FormItem>

                <FormItem className="mt-3">
                    <Controller
                        name="remember"
                        control={control}
                        render={({ field }) => (
                            <Checkbox
                                checked={field.value}
                                onChange={field.onChange}
                            >
                                {t('nav.authentication.rememberMe')}
                            </Checkbox>
                        )}
                    />
                </FormItem>

                {passwordHint}

                <Button
                    block
                    loading={isSubmitting}
                    variant="solid"
                    type="submit"
                >
                    {isSubmitting
                        ? t('nav.authentication.signingIn')
                        : t('nav.authentication.signInButton')}
                </Button>
            </Form>
        </div>
    )
}

export default SignInForm
