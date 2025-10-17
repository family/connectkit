import { useState } from 'react'

import { authClient } from '../client'
import { getBetterAuthErrorMessage, logBetterAuthError } from '../errors'

function GoogleSignInButton({ onError }: { onError: (error: string) => void }) {
  const [loading, setLoading] = useState(false)

  const signInWithGoogle = async () => {
    try {
      setLoading(true)
      const { error } = await authClient.signIn.social({
        provider: 'google',
        callbackURL: window.location.origin,
      })

      if (error) throw error
    } catch (error) {
      logBetterAuthError(error, 'Google Sign-In')
      onError(getBetterAuthErrorMessage(error))
    } finally {
      setLoading(false)
    }
  }

  return (
    <button
      type="button"
      onClick={signInWithGoogle}
      disabled={loading}
      className="w-full py-2 px-4 border border-zinc-700 text-white rounded cursor-pointer transition-colors hover:bg-zinc-900/60 disabled:opacity-50 disabled:cursor-not-allowed"
    >
      {loading ? 'Signing in...' : 'Continue with Google'}
    </button>
  )
}

function EmailPasswordForm({ isLogin, onError }: { isLogin: boolean; onError: (error: string) => void }) {
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
        const { error } = await authClient.signIn.email({
          email,
          password,
        })
        if (error) throw error
      } else {
        const { error } = await authClient.signUp.email({
          email,
          password,
          name: email.split('@')[0], // Use email prefix as default name
        })
        if (error) throw error
      }
    } catch (error) {
      logBetterAuthError(error, isLogin ? 'Email Sign-In' : 'Email Sign-Up')
      onError(getBetterAuthErrorMessage(error))
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4 mb-4">
      <label className="block text-left text-sm font-medium mb-1" htmlFor="email">
        Email
      </label>
      <input id="email" type="email" placeholder="Enter your email address" required />

      <div>
        <label className="block text-left text-sm font-medium mb-1" htmlFor="password">
          Password
        </label>
        <input id="password" type="password" placeholder="Enter your password" required />
      </div>

      <button type="submit" disabled={loading} className="btn mt-2 disabled:opacity-50 disabled:cursor-not-allowed">
        {loading ? 'Loading...' : isLogin ? 'Sign In' : 'Sign Up'}
      </button>
    </form>
  )
}

export function BetterAuthCard() {
  const [isLogin, setIsLogin] = useState(true)
  const [error, setError] = useState<string>('')

  const handleToggleMode = () => {
    setIsLogin((previous) => !previous)
    setError('')
  }

  return (
    <div className="card relative space-y-6">
      <div className="relative">
        <h1 className="text-left text-2xl font-semibold tracking-tight">
          {isLogin ? 'Sign in to account' : 'Create an account'}
        </h1>
      </div>

      {error && (
        <div className="bg-red-500/10 border border-red-500/50 text-red-500 px-4 py-3 rounded text-sm">{error}</div>
      )}

      <EmailPasswordForm isLogin={isLogin} onError={setError} />

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
          type="button"
          onClick={handleToggleMode}
          className="text-primary hover:underline cursor-pointer font-medium"
        >
          {isLogin ? 'Sign Up' : 'Sign In'}
        </button>
      </div>
    </div>
  )
}
