'use client'

import { zodResolver } from '@hookform/resolvers/zod'
import { useEmailAuth } from '@openfort/react'
import { useNavigate } from '@tanstack/react-router'
import { EyeIcon, EyeOffIcon, LockIcon, MailIcon, UserIcon } from 'lucide-react'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { useCommonEmail } from '@/components/Showcase/auth/useCommonEmail'
import { Button } from '@/components/Showcase/ui/Button'
import { InputMessage } from '@/components/Showcase/ui/InputMessage'
import { cn } from '@/lib/cn'

export function EmailPasswordForm({ isSignUp = false }: { isSignUp?: boolean }) {
  const nav = useNavigate()

  const { signInEmail, signUpEmail, error, isLoading, requiresEmailVerification } = useEmailAuth({
    emailVerificationRedirectTo: '/showcase/auth/callback',
  })
  const onSubmit = async (data: FormValues) => {
    if (isSignUp) {
      await signUpEmail({
        email: data.email,
        password: data.password,
        name: data.username,
      })
    } else {
      await signInEmail({
        email: data.email,
        password: data.password,
      })
    }
  }

  const { email, setEmail } = useCommonEmail()

  const [showPassword, setShowPassword] = useState(false)

  // Create a dynamic schema based on password policy
  const createFormSchema = () => {
    return z.object({
      username: isSignUp ? z.string().min(1, { message: 'Username is required' }) : z.string().optional(),
      email: z.email({ message: 'Please enter a valid email address' }),
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

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="w-full space-y-3 animate-child-in"
      key={isSignUp ? 'signup' : 'signin'}
      noValidate
    >
      {isSignUp && (
        <div>
          <label className={cn('input w-full', errors.username && 'input-error')}>
            <UserIcon size={16} className="" />
            <input
              type="username"
              placeholder="Username"
              className="grow peer"
              {...register('username')}
              disabled={isLoading}
            />
          </label>
          <InputMessage message={errors.username?.message || ''} show={!!errors.username} variant="error" />
        </div>
      )}

      <div>
        <label className={cn('input w-full', errors.email && 'input-error')}>
          <MailIcon size={16} className="" />
          <input
            key={isSignUp ? 'signup-email' : 'signin-email'}
            type="email"
            placeholder="Email"
            className="grow peer"
            {...register('email', {
              value: email,
              onChange: (e) => {
                setEmail(e.target.value)
              },
            })}
            disabled={isLoading}
          />
        </label>
        <InputMessage message={errors.email?.message || ''} show={!!errors.email} variant="error" />
      </div>

      <div>
        <label className={cn('input w-full ', errors.password && 'input-error')}>
          <LockIcon size={16} className="" />
          <input
            key={isSignUp ? 'signup-pwd' : 'signin-pwd'}
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

        <InputMessage message={error?.message || ''} show={!!error} variant="error" />
        <InputMessage
          message={'An email has been sent to verify your account'}
          show={requiresEmailVerification}
          variant="success"
        />
      </div>
      {!isSignUp && (
        <label className="label flex justify-between">
          <a
            onClick={() => {
              nav({ to: '/showcase/auth/forgot-password' })
            }}
            className="label-text-alt text-sm link link-primary transition-colors duration-200"
          >
            Forgot password?
          </a>
        </label>
      )}

      <Button className="btn btn-accent w-full" type="submit" disabled={isLoading}>
        {isLoading ? 'Loading...' : isSignUp ? 'Sign up' : 'Sign in'}
      </Button>

      <div className="text-center text-sm">
        <span className="text-base-content/70">
          {isSignUp ? 'Already have an account? ' : "Don't have an account? "}
        </span>
        <button
          type="button"
          onClick={() => {
            nav({ to: isSignUp ? '/showcase/auth/login' : '/showcase/auth/signup' })
          }}
          className="link link-primary transition-colors duration-200"
        >
          {isSignUp ? 'Sign in' : 'Sign up'}
        </button>
      </div>
    </form>
  )
}
