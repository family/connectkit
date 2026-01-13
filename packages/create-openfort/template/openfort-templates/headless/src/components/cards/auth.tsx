import {
  OAuthProvider,
  useAuthCallback,
  useEmailAuth,
  useGuestAuth,
  useOAuth,
} from '@openfort/react'
import type React from 'react'
import { useState } from 'react'

const GoogleSignInButton: React.FC = () => {
  // Sign in with Google
  const { initOAuth, isLoading } = useOAuth()

  return (
    <button
      onClick={() => initOAuth({ provider: OAuthProvider.GOOGLE })}
      className="w-full py-2 px-4 border border-zinc-700 text-white rounded cursor-pointer transition-colors hover:bg-zinc-900/60"
    >
      {isLoading ? 'Loading...' : 'Continue with Google'}
    </button>
  )
}

const GuestSignInButton: React.FC = () => {
  // Sign in with Google
  const { signUpGuest, isLoading } = useGuestAuth()

  return (
    <button
      onClick={() => signUpGuest()}
      className="w-full py-2 px-4 border border-zinc-700 text-white rounded cursor-pointer transition-colors hover:bg-zinc-900/60"
    >
      {isLoading ? 'Loading...' : 'Continue as Guest'}
    </button>
  )
}

const EmailForm = ({ isLogin }: { isLogin: boolean }) => {
  const { signInEmail, signUpEmail, error, isLoading } = useEmailAuth()

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault()
    const form = event.target as HTMLFormElement
    const email = (form.elements[0] as HTMLInputElement).value
    const password = (form.elements[1] as HTMLInputElement).value
    if (isLogin) {
      const { requiresEmailVerification } = await signInEmail({
        email,
        password,
      })

      if (requiresEmailVerification) {
        alert(
          'User is not verified. Please check your email to verify your account.',
        )
      }
    } else {
      const { requiresEmailVerification } = await signUpEmail({
        email,
        password,
      })

      if (requiresEmailVerification) {
        alert(
          'Registration successful! Please check your email to verify your account.',
        )
      }
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
      {error && <p className="text-red-500 text-sm">{error.message}</p>}

      <button type="submit" className="btn mt-2">
        {isLoading ? 'Loading...' : isLogin ? 'Sign In' : 'Sign Up'}
      </button>
    </form>
  )
}

const AuthForm = () => {
  const [isLogin, setIsLogin] = useState(true)
  const { isLoading } = useAuthCallback({
    onSuccess: () => {
      alert('Authentication verified!')
    },
    onError: (e) => {
      alert(`Authentication verification failed!${e.message}`)
    },
  })

  if (isLoading) {
    return <div>Verifying authentication...</div>
  }

  return (
    <div className="space-y-6">
      <div className="relative">
        <h1 className="text-left text-2xl font-semibold tracking-tight">
          {isLogin ? 'Sign in to account' : 'Create an account'}
        </h1>
      </div>

      <EmailForm isLogin={isLogin} />

      <div className="relative opacity-80 mb-4">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-gray-300" />
        </div>
        <div className="relative flex justify-center text-sm">
          <span className="bg-zinc-800 px-2">or</span>
        </div>
      </div>

      <div className="space-y-3">
        <GuestSignInButton />
        <GoogleSignInButton />
      </div>

      <div className="text-left text-sm">
        {isLogin ? 'Already have an account? ' : "Don't have an account? "}
        <button
          onClick={() => setIsLogin(!isLogin)}
          className="text-primary hover:underline cursor-pointer font-medium"
        >
          {isLogin ? 'Sign Up' : 'Sign In'}
        </button>
      </div>
    </div>
  )
}

export const Auth = () => {
  return (
    <div className="card relative">
      <AuthForm />
    </div>
  )
}
