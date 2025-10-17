import { zodResolver } from '@hookform/resolvers/zod'
import { useEmailAuth } from '@openfort/react'
import { createFileRoute, useNavigate, useParams } from '@tanstack/react-router'
import { EyeIcon, EyeOffIcon, LockIcon } from 'lucide-react'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { DialogLayout } from '@/components/Showcase/auth/DialogLayout'
import { Button } from '@/components/Showcase/ui/Button'
import { Header } from '@/components/Showcase/ui/Header'
import { InputMessage } from '@/components/Showcase/ui/InputMessage'
import { cn } from '@/lib/cn'

export const Route = createFileRoute('/_showcase/showcase/auth/password-callback')({
  component: RouteComponent,
})

function RouteComponent() {
  // const [error, setError] = useState<string | null>(null);
  // const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false)
  const _searchParams = useParams({ strict: false }) as {
    token: string | undefined
    email: string | undefined
    state: string | undefined
  }

  const { error, isLoading, resetPassword } = useEmailAuth()
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

  const onSubmit = async (data: FormValues) => {
    // setError(null)
    const fixedUrl = window.location.href.replace('?', '&').replace('?', '&').replace('&', '?')
    const url = new URL(fixedUrl)
    // setIsLoading(true)

    const state = url.searchParams.get('state')
    const email = url.searchParams.get('email')

    if (!state || !email) {
      console.error('State or email not found in URL')
      return
    }

    console.log('Logging in with:', data, email, state)
    // console.log("Logging in with:", data)
    await resetPassword({
      password: data.password,
      email,
      state,
    })

    // if (success) {
    //   nav("/auth/login")
    // } else {
    //   setError("There was an error resetting your password.")
    // }
    // setIsLoading(false)
  }
  const nav = useNavigate()

  return (
    <DialogLayout>
      <Header onBack={() => nav({ to: '/' })} title="Forgot password" />

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

          <InputMessage message={error?.message || ''} show={!!error} variant="error" />
        </div>
      </form>
    </DialogLayout>
  )
}
