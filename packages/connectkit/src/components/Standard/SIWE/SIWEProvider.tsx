import { useContext, useEffect } from 'react';
import { useAccount, useQuery, useNetwork } from 'wagmi';
import { Context as ConnectKitContext } from '../../ConnectKit';
import { SIWEContext, SIWEConfig } from './SIWEContext';

type Props = SIWEConfig & {
  children: React.ReactNode;
};

export const SIWEProvider = ({
  children,
  enabled = true,
  nonceRefetchInterval = 1000 * 60 * 5,
  sessionRefetchInterval = 1000 * 60 * 5,
  signOutOnDisconnect = true,
  signOutOnAccountChange = true,
  signOutOnNetworkChange = true,
  ...siweConfig
}: Props) => {
  // Only allow for mounting SIWEProvider once, so we avoid weird global state
  // collisions.
  if (useContext(SIWEContext)) {
    throw new Error(
      'Multiple, nested usages of SIWEProvider detected. Please use only one.'
    );
  }
  // SIWEProvider must be wrapped outside of ConnectKitProvider so that the
  // ConnectKitButton and other UI can use SIWE context values.
  if (useContext(ConnectKitContext)) {
    throw new Error('ConnectKitProvider must be mounted inside SIWEProvider.');
  }

  const nonce = useQuery(['ckSiweNonce'], () => siweConfig.getNonce(), {
    initialData: null,
    refetchInterval: nonceRefetchInterval,
  });
  const session = useQuery(['ckSiweSession'], siweConfig.getSession, {
    initialData: null,
    refetchInterval: sessionRefetchInterval,
  });

  const sessionData = session.data;

  const { address: connectedAddress } = useAccount({
    onDisconnect: () => {
      if (signOutOnDisconnect) {
        // For security reasons we sign out the user when a wallet disconnects.
        signOutAndRefetch();
      }
    },
  });
  const { chain } = useNetwork();

  const signOutAndRefetch = async () => {
    if (!(await siweConfig.signOut())) {
      throw new Error('Failed to sign out.');
    }
    await Promise.all([session.refetch(), nonce.refetch()]);
  };

  useEffect(() => {
    // Skip if we're still fetching session state from backend
    if (!sessionData || !sessionData.address || !sessionData.chainId) return;
    // Skip if wallet isn't connected (i.e. initial page load)
    if (!connectedAddress || !chain) return;

    // If SIWE session no longer matches connected account, sign out
    if (signOutOnAccountChange && sessionData.address !== connectedAddress) {
      console.warn('Wallet account changed, signing out of SIWE session');
      signOutAndRefetch();
    }
    // The SIWE spec includes a chainId parameter for contract-based accounts,
    // so we're being extra cautious about keeping the SIWE session and the
    // connected account/network in sync. But this can be disabled when
    // configuring the SIWEProvider.
    else if (signOutOnNetworkChange && sessionData.chainId !== chain.id) {
      console.warn('Wallet network changed, signing out of SIWE session');
      signOutAndRefetch();
    }
  }, [session, connectedAddress, chain]);

  return (
    <SIWEContext.Provider
      value={{
        enabled,
        nonceRefetchInterval,
        sessionRefetchInterval,
        signOutOnDisconnect,
        signOutOnAccountChange,
        signOutOnNetworkChange,
        ...siweConfig,
        nonce,
        session,
        signOutAndRefetch,
      }}
    >
      {children}
    </SIWEContext.Provider>
  );
};
