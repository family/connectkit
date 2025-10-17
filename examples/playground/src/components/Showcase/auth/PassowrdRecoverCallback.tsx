import { zodResolver } from '@hookform/resolvers/zod'
import { useParams } from '@tanstack/react-router'
import { EyeIcon, EyeOffIcon, LockIcon } from 'lucide-react'
import { useMemo, useState } from 'react'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { DialogLayout } from '@/components/Showcase/auth/DialogLayout'
import { Button } from '@/components/Showcase/ui/Button'
import { Header } from '@/components/Showcase/ui/Header'
import { InputMessage } from '@/components/Showcase/ui/InputMessage'
import { cn } from '@/lib/cn'

export const PasswordRecoveryCallback = () => {
  const [error, setError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)

  const searchParams = useParams({ strict: false })

  const _resetToken = useMemo(() => {
    const params = new URLSearchParams(searchParams[0])
    return params.get('token')
  }, [searchParams])

  // Create a dynamic schema based on password policy
  const createFormSchema = () => {
    return z.object({
      password: z.string().min(8, { message: 'Password must be at least 8 characters long' }),
    })
  }

  const formSchema = createFormSchema()
  type FormValues = z.infer<typeof formSchema>

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    mode: 'onSubmit',
  })

  // if (!resetToken) {
  //   return <ErrorPage errorMessage="NO_RESET_TOKEN" />
  // }

  const onSubmit = async (_data: FormValues) => {
    setError(null)
    setIsLoading(true)

    // console.log("Logging in with:", data)
    // const { success } = await AuthManager.passwordResetCallback({
    //   newPassword: data.password,
    //   resetToken: resetToken,
    // })

    // if (success) {
    //   nav("/auth/login")
    // } else {
    //   setError("There was an error resetting your password.")
    // }
    // setIsLoading(false)
  }

  return (
    <DialogLayout>
      <Header title="Forgot password" />

      <form onSubmit={handleSubmit(onSubmit)} className="w-full space-y-3" noValidate>
        <div className="text-sm text-base-content/50">Enter your new password</div>
        <div className="form-control">
          <label className={cn('input w-full ', errors.password && 'input-error')}>
            <LockIcon size={16} className="" />
            <input
              type={showPassword ? 'text' : 'password'}
              placeholder="Password"
              className="grow"
              {...register('password')}
              disabled={isLoading}
            />
            <button
              type="button"
              className="text-base-content/50 hover:text-base-content transition-colors duration-200"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? <EyeOffIcon size={16} className="" /> : <EyeIcon size={16} className="" />}
            </button>
          </label>

          <InputMessage message={errors.password?.message || ''} show={!!errors.password} variant="error" />
        </div>
        <div>
          <Button className="btn btn-accent w-full" type="submit" disabled={isLoading}>
            {isLoading ? 'Loading...' : 'Reset Password'}
          </Button>

          <InputMessage message={error || ''} show={!!error} variant="error" />
        </div>
      </form>
    </DialogLayout>
  )
}
