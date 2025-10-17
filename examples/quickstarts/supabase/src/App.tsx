import { useSignOut, useUser } from '@openfort/react'
import { useEffect } from 'react'
import { Main } from './components/cards/main'
import { supabase } from './integrations/supabase'

function App() {
  const { getAccessToken } = useUser()
  const { signOut } = useSignOut()

  useEffect(() => {
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
      <Main />
    </div>
  )
}

export default App
