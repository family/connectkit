import { useSignOut, useUser } from '@openfort/react';
import { useEffect, useRef } from 'react';
import { Main } from './components/cards/main';
import { useSession } from './integrations/betterauth';

function App() {
  const { getAccessToken } = useUser();
  const { signOut } = useSignOut();
  const { data: session, isPending } = useSession();
  const hasUser = Boolean(session?.user);
  const sessionToken = session?.session?.token;
  const hadSessionRef = useRef(false);

  useEffect(() => {
    if (isPending) {
      return;
    }

    if (hasUser && sessionToken) {
      console.log('Better Auth - Session active, syncing with Openfort');
      hadSessionRef.current = true;
      void getAccessToken().catch((error) => {
        console.error('Better Auth - Failed to sync session with Openfort:', error);
      });
      return;
    }

    if (hadSessionRef.current) {
      console.log('Better Auth - Session ended, clearing Openfort session');
      hadSessionRef.current = false;
      void signOut();
    }
  }, [getAccessToken, hasUser, isPending, sessionToken, signOut]);

  return (
    <div>
      <Main />
    </div>
  );
}

export default App;
