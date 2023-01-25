import { useContext } from 'react';
import Button from '../../Common/Button';
import { DisconnectIcon, RetryIcon } from '../../../assets/icons';
import { ResetContainer } from '../../../styles';
import { motion } from 'framer-motion';
import useIsMounted from '../../../hooks/useIsMounted';
import useLocales from '../../../hooks/useLocales';
import { useSIWE, SIWEContext } from './../../../siwe';
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
  const siwe = useSIWE();

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

  if (showSignOutButton && siwe.isSignedIn) {
    return (
      <Button
        key="button"
        style={{ margin: 0 }}
        onClick={siwe.signOut}
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
      arrow={siwe.isSignedIn ? siwe.isReady : false}
      onClick={!siwe.isLoading && !siwe.isSuccess ? siwe.signIn : undefined}
      disabled={siwe.isLoading}
      waiting={siwe.isLoading}
      icon={
        siwe.isRejected && (
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
      {getButtonLabel(siwe.status)}
    </Button>
  );
};

export const SIWEButtonComponent: React.FC<ButtonProps> = ({ ...props }) => (
  <ResetContainer>
    <SIWEButton {...props} />
  </ResetContainer>
);
export default SIWEButtonComponent;
