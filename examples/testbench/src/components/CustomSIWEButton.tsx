import { useSIWE, useModal } from 'connectkit';
import { useAccount } from 'wagmi';

const CustomSIWEButton = () => {
  const { setOpen } = useModal();
  const { data, isReady, isRejected, isLoading, isSignedIn, signOut, signIn } =
    useSIWE();
  const { isConnected } = useAccount();

  /** Wallet is connected and signed in */
  if (isSignedIn) {
    return (
      <>
        <div>Address: {data?.address}</div>
        <div>ChainId: {data?.chainId}</div>
        <button onClick={signOut}>Sign Out</button>
      </>
    );
  }

  /** Wallet is connected, but not signed in */
  if (isConnected) {
    return (
      <>
        <button onClick={signIn} disabled={isLoading}>
          {isRejected
            ? 'Try Again'
            : isReady
            ? 'Sign In'
            : 'Awaiting request...'}
        </button>
      </>
    );
  }

  /** A wallet needs to be connected first */
  return (
    <>
      <button onClick={() => setOpen(true)}>Connect Wallet</button>
    </>
  );
};

export default CustomSIWEButton;
