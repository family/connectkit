import { useSignOut, useUser } from '@openfort/react'
import { useEffect, useState } from 'react'
import { Main } from './components/cards/main'
import { supabase } from './integrations/supabase'

function App() {
  const { getAccessToken } = useUser()
  const { signOut } = useSignOut()
  const [verificationMessage, setVerificationMessage] = useState<{
    type: 'success' | 'error'
    message: string
  } | null>(null)

  useEffect(() => {
    // Handle email verification callback
    const handleEmailVerification = async () => {
      // Check if there's a hash fragment (Supabase auth callback)
      const hashParams = new URLSearchParams(window.location.hash.substring(1))
      const accessToken = hashParams.get('access_token')
      const type = hashParams.get('type')

      // If this is an email verification callback
      if (accessToken && type === 'signup') {
        try {
          // Exchange the access token for a session
          const { error } = await supabase.auth.getSession()

          if (error) {
            console.error('Email verification error:', error)
            setVerificationMessage({
              type: 'error',
              message: 'Email verification failed. Please try again.',
            })
          } else {
            setVerificationMessage({
              type: 'success',
              message: 'Email verified successfully! Welcome!',
            })
            // Clear the hash from URL
            window.history.replaceState(null, '', window.location.pathname)
          }
        } catch (error) {
          console.error('Error during email verification:', error)
          setVerificationMessage({
            type: 'error',
            message: 'An error occurred during verification.',
          })
        }

        // Clear message after 5 seconds
        setTimeout(() => setVerificationMessage(null), 5000)
      }
    }

    handleEmailVerification()

    // Listen to auth state changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event, session) => {
      console.log('onAuthStateChange', event)
      if (session?.user) {
        console.log('onAuthStateChange - User is signed in:', session.user)
        getAccessToken()
      } else if (event === 'SIGNED_OUT') {
        console.log(
          'onAuthStateChange - User signed out, cleaning up Openfort session',
        )
        signOut()
      } else {
        console.log('onAuthStateChange - No active session')
      }
    })

    return () => {
      subscription.unsubscribe()
    }
  }, [getAccessToken, signOut])

  return (
    <div>
      {verificationMessage && (
        <div
          className={`fixed top-4 left-1/2 transform -translate-x-1/2 z-50 px-6 py-4 rounded-lg shadow-lg ${
            verificationMessage.type === 'success'
              ? 'bg-green-500/90 text-white'
              : 'bg-red-500/90 text-white'
          }`}
        >
          <p className="font-medium">{verificationMessage.message}</p>
        </div>
      )}
      <Main />
    </div>
  )
}

export default App
