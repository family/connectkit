import { useEffect } from 'react';
import Button from '../../Common/Button';
import { DisconnectIcon, RetryIcon } from '../../../assets/icons';
import { ResetContainer } from '../../../styles';
import { motion } from 'framer-motion';
import useIsMounted from '../../../hooks/useIsMounted';
import useLocales from '../../../hooks/useLocales';
import { useSIWE } from './../../../siwe';
import { useAccount } from 'wagmi';

type ButtonProps = {
  showSignOutButton?: boolean;
  onSignIn?: () => void;
};

export const SIWEButton: React.FC<ButtonProps> = ({
  showSignOutButton,
  onSignIn,
}) => {
  const isMounted = useIsMounted();
  const locales = useLocales();

  const {
    status,
    isSignedIn,
    isReady,
    isLoading,
    isRejected,
    isSuccess,
    signIn,
    signOut,
  } = useSIWE();
  const { address: connectedAddress } = useAccount();

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

  useEffect(() => {
    if (isSignedIn && onSignIn) onSignIn();
  }, [isSignedIn, onSignIn]);

  if (!isMounted) {
    return <Button key="loading" style={{ margin: 0 }} disabled />;
  }

  if (showSignOutButton && isSignedIn) {
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

  return (
    <Button
      key="button"
      style={{ margin: 0 }}
      arrow={isSignedIn ? isReady : false}
      onClick={!isLoading && !isSuccess ? signIn : undefined}
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
