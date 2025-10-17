import { useState } from 'react'

import { supabase } from '../client'
import { getSupabaseErrorMessage, logSupabaseError } from '../errors'

function GoogleSignInButton({ onError }: { onError: (error: string) => void }) {
  const [loading, setLoading] = useState(false)

  const signInWithGoogle = async () => {
    try {
      setLoading(true)
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: window.location.origin,
          skipBrowserRedirect: false,
        },
      })

      if (error) throw error
    } catch (error) {
      logSupabaseError(error, 'Google Sign-In')
      onError(getSupabaseErrorMessage(error))
    } finally {
      setLoading(false)
    }
  }

  return (
    <button
      onClick={signInWithGoogle}
      disabled={loading}
      className="w-full py-2 px-4 border border-zinc-700 text-white rounded cursor-pointer transition-colors hover:bg-zinc-900/60 disabled:opacity-50 disabled:cursor-not-allowed"
    >
      {loading ? 'Signing in...' : 'Continue with Google'}
    </button>
  )
}

function EmailPasswordForm({
  isLogin,
  onError,
  onEmailVerificationRequired,
}: {
  isLogin: boolean
  onError: (error: string) => void
  onEmailVerificationRequired: (email: string) => void
}) {
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const form = event.target as HTMLFormElement
    const email = (form.elements[0] as HTMLInputElement).value
    const password = (form.elements[1] as HTMLInputElement).value

    try {
      setLoading(true)
      onError('')

      if (isLogin) {
        const { error } = await supabase.auth.signInWithPassword({
          email,
          password,
        })
        if (error) throw error
      } else {
        const { data, error } = await supabase.auth.signUp({
          email,
          password,
        })
        if (error) throw error

        // Check if email confirmation is required
        if (data.user && !data.session) {
          // User created but needs to verify email
          onEmailVerificationRequired(email)
        }
      }
    } catch (error) {
      logSupabaseError(error, isLogin ? 'Email Sign-In' : 'Email Sign-Up')
      onError(getSupabaseErrorMessage(error))
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4 mb-4">
      <label
        className="block text-left text-sm font-medium mb-1"
        htmlFor="email"
      >
        Email
      </label>
      <input
        id="email"
        type="email"
        placeholder="Enter your email address"
        required
      />

      <div>
        <label
          className="block text-left text-sm font-medium mb-1"
          htmlFor="password"
        >
          Password
        </label>
        <input
          id="password"
          type="password"
          placeholder="Enter your password"
          required
        />
      </div>

      <button
        type="submit"
        disabled={loading}
        className="btn mt-2 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {loading ? 'Loading...' : isLogin ? 'Sign In' : 'Sign Up'}
      </button>
    </form>
  )
}

function EmailVerificationMessage({
  email,
  onResend,
  onBack,
}: {
  email: string
  onResend: () => void
  onBack: () => void
}) {
  const [isResending, setIsResending] = useState(false)
  const [resendSuccess, setResendSuccess] = useState(false)

  const handleResend = async () => {
    setIsResending(true)
    setResendSuccess(false)
    await onResend()
    setIsResending(false)
    setResendSuccess(true)
    setTimeout(() => setResendSuccess(false), 3000)
  }

  return (
    <div className="card relative space-y-6">
      <div className="relative">
        <h1 className="text-left text-2xl font-semibold tracking-tight">
          Verify your email
        </h1>
      </div>

      <div className="bg-blue-500/10 border border-blue-500/50 text-blue-400 px-4 py-4 rounded text-sm space-y-3">
        <p className="font-medium">
          Please check your email to verify your account.
        </p>
        <p className="text-blue-300">
          A verification link has been sent to <strong>{email}</strong>
        </p>
        <p className="text-blue-300 text-xs">
          Click the link in the email to complete your registration.
        </p>
      </div>

      {resendSuccess && (
        <div className="bg-green-500/10 border border-green-500/50 text-green-400 px-4 py-3 rounded text-sm">
          Verification email resent successfully!
        </div>
      )}

      <div className="space-y-3">
        <button
          onClick={handleResend}
          disabled={isResending}
          className="w-full py-2 px-4 border border-zinc-700 text-white rounded cursor-pointer transition-colors hover:bg-zinc-900/60 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isResending ? 'Sending...' : 'Resend verification email'}
        </button>

        <button
          onClick={onBack}
          className="w-full py-2 px-4 text-zinc-400 hover:text-white transition-colors"
        >
          Back to sign in
        </button>
      </div>
    </div>
  )
}

export function SupabaseAuthCard() {
  const [isLogin, setIsLogin] = useState(true)
  const [error, setError] = useState<string>('')
  const [awaitingVerificationEmail, setAwaitingVerificationEmail] =
    useState<string>('')

  const handleToggleMode = () => {
    setIsLogin((previous) => !previous)
    setError('')
    setAwaitingVerificationEmail('')
  }

  const handleEmailVerificationRequired = (email: string) => {
    setAwaitingVerificationEmail(email)
  }

  const handleResendVerification = async () => {
    if (!awaitingVerificationEmail) return

    try {
      const { error } = await supabase.auth.resend({
        type: 'signup',
        email: awaitingVerificationEmail,
      })
      if (error) throw error
    } catch (error) {
      logSupabaseError(error, 'Resend Verification Email')
      setError(getSupabaseErrorMessage(error))
    }
  }

  const handleBackToSignIn = () => {
    setAwaitingVerificationEmail('')
    setIsLogin(true)
    setError('')
  }

  // Show email verification message if waiting for verification
  if (awaitingVerificationEmail) {
    return (
      <EmailVerificationMessage
        email={awaitingVerificationEmail}
        onResend={handleResendVerification}
        onBack={handleBackToSignIn}
      />
    )
  }

  return (
    <div className="card relative space-y-6">
      <div className="relative">
        <h1 className="text-left text-2xl font-semibold tracking-tight">
          {isLogin ? 'Sign in to account' : 'Create an account'}
        </h1>
      </div>

      {error && (
        <div className="bg-red-500/10 border border-red-500/50 text-red-500 px-4 py-3 rounded text-sm">
          {error}
        </div>
      )}

      <EmailPasswordForm
        isLogin={isLogin}
        onError={setError}
        onEmailVerificationRequired={handleEmailVerificationRequired}
      />

      <div className="relative opacity-80 mb-4">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-gray-300" />
        </div>
        <div className="relative flex justify-center text-sm">
          <span className="bg-zinc-800 px-2">or</span>
        </div>
      </div>

      <GoogleSignInButton onError={setError} />

      <div className="text-left text-sm">
        {isLogin ? 'Already have an account? ' : "Don't have an account? "}
        <button
          onClick={handleToggleMode}
          className="text-primary hover:underline cursor-pointer font-medium"
        >
          {isLogin ? 'Sign Up' : 'Sign In'}
        </button>
      </div>
    </div>
  )
}
