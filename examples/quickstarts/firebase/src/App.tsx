import { useSignOut, useUser } from '@openfort/react'
import { useEffect } from 'react'
import { Main } from './components/cards/main'
import { auth } from './integrations/firebase'

function App() {
  const { getAccessToken } = useUser()
  const { signOut } = useSignOut()

  useEffect(() => {
    auth.onAuthStateChanged((user) => {
      console.log('onAuthStateChanged')
      if (user) {
        console.log('onAuthStateChanged - User is signed in:', user)
        getAccessToken()
      } else {
        console.log('onAuthStateChanged - No user is signed in')
        signOut()
      }
    })
  }, [getAccessToken, signOut])

  return (
    <div>
      <Main />
    </div>
  )
}

export default App
