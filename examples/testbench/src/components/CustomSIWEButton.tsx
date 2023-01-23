import { useSIWE, useModal } from 'connectkit';
import { useAccount } from 'wagmi';

const CustomSIWEButton = () => {
  const { setOpen } = useModal();
  const { signedIn, address, chainId, signOut, signIn, status } = useSIWE();
  const { isConnected } = useAccount();

  if (signedIn) {
    return (
      <>
        <div>Address: {address}</div>
        <div>ChainId: {chainId}</div>
        <button onClick={signOut}>Sign Out</button>
      </>
    );
  }

  if (isConnected) {
    return (
      <>
        <button onClick={signIn} disabled={status !== 'ready'}>
          {status === 'ready' ? 'Sign In' : 'Awaiting request...'}
        </button>
      </>
    );
  }
  return (
    <>
      <button onClick={() => setOpen(true)}>Connect Wallet</button>
    </>
  );
};

export default CustomSIWEButton;
