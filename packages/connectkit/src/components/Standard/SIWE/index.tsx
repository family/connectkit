import { useContext } from 'react';
import Button from '../../Common/Button';
import { DisconnectIcon, RetryIcon } from '../../../assets/icons';
import { SIWEContext } from './SIWEContext';
import { ResetContainer } from '../../../styles';
import { motion } from 'framer-motion';
import useIsMounted from '../../../hooks/useIsMounted';
import useLocales from '../../../hooks/useLocales';
import { useSIWE } from './useSIWE';
import { useAccount } from 'wagmi';

type ButtonProps = {
  showSignOutButton?: boolean;
  onSignIn?: () => void;
};

export const SIWEButton: React.FC<ButtonProps> = ({
  showSignOutButton,
  onSignIn,
}) => {
  const siweContext = useContext(SIWEContext);
  const isMounted = useIsMounted();

  const locales = useLocales();

  const { address: connectedAddress } = useAccount();
  const { signedIn, address, signOut, signIn, status } = useSIWE();

  function getButtonLabel(state) {
    const labels = {
      ready: locales.signIn,
      loading: locales.awaitingConfirmation,
      rejected: locales.tryAgain,
      error: 'Unknown Error',
      success: locales.signedIn,
    };
    // TODO: discuss non-connected wallet developer expectations
    return !connectedAddress ? locales.walletNotConnected : labels[state];
  }

  if (!siweContext) {
    throw new Error('SIWEButton must be inside a SIWEProvider.');
  }

  if (!isMounted)
    return <Button key="loading" style={{ margin: 0 }} disabled />;

  if (showSignOutButton && signedIn) {
    return (
      <Button
        key="button"
        style={{ margin: 0 }}
        onClick={signOut}
        icon={<DisconnectIcon />}
      >
        {locales.signOut}
      </Button>
    );
  }

  const isLoading = status === 'loading';
  const isRejected = status === 'rejected';
  const isSuccess = status === 'success';
  const isReady = status === 'ready';

  return (
    <Button
      key="button"
      style={{ margin: 0 }}
      arrow={address ? status === 'ready' : false}
      onClick={status !== 'loading' && 'success' ? signIn : undefined}
      disabled={isLoading}
      waiting={isLoading}
      icon={
        isRejected && (
          <motion.div
            initial={{
              rotate: -270,
            }}
            animate={{
              rotate: 0,
            }}
            transition={{
              duration: 1,
              ease: [0.175, 0.885, 0.32, 0.98],
            }}
          >
            <RetryIcon style={{ opacity: 0.4 }} />
          </motion.div>
        )
      }
    >
      {getButtonLabel(status)}
    </Button>
  );
};

export const SIWEButtonComponent: React.FC<ButtonProps> = ({ ...props }) => (
  <ResetContainer>
    <SIWEButton {...props} />
  </ResetContainer>
);
export default SIWEButtonComponent;
