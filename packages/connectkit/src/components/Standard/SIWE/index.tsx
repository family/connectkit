import Button from '../../Common/Button';
import { DisconnectIcon, RetryIcon } from '../../../assets/icons';
import { ResetContainer } from '../../../styles';
import { motion } from 'framer-motion';
import useIsMounted from '../../../hooks/useIsMounted';
import useLocales from '../../../hooks/useLocales';
import { SIWESession, useSIWE } from './../../../siwe';
import { useAccount } from 'wagmi';
import { useModal } from '../../../hooks/useModal';

type ButtonProps = {
  showSignOutButton?: boolean;
  onSignIn?: (data?: SIWESession) => void;
  onSignOut?: () => void;
};

export const SIWEButton: React.FC<ButtonProps> = ({
  showSignOutButton,
  onSignIn,
  onSignOut,
}) => {
  const isMounted = useIsMounted();
  const locales = useLocales();
  const { setOpen } = useModal();

  const {
    isSignedIn,
    isReady,
    isLoading,
    isRejected,
    isSuccess,
    isError,
    signIn,
    signOut,
    error,
  } = useSIWE({
    onSignIn: (data) => onSignIn?.(data),
    onSignOut: () => onSignOut?.(),
  });
  const { address: connectedAddress } = useAccount();

  function getButtonLabel() {
    if (isSuccess) return locales.signedIn;
    if (isRejected) return locales.tryAgain;
    if (isLoading) return locales.awaitingConfirmation;
    if (isError) return error ?? 'Unknown Error';
    if (isReady) return locales.signIn;
    return locales.signIn;
  }

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

  if (!connectedAddress) {
    // TODO: discuss non-connected wallet developer expectations
    return (
      <Button
        key="button"
        style={{ margin: 0 }}
        onClick={() => setOpen(true)}
        arrow
      >
        {locales.walletNotConnected}
      </Button>
    );
  }

  return (
    <Button
      key="button"
      style={{ margin: 0 }}
      arrow={!isSignedIn ? !isLoading && !isRejected : false}
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
      {getButtonLabel()}
    </Button>
  );
};

export const SIWEButtonComponent: React.FC<ButtonProps> = ({ ...props }) => (
  <ResetContainer>
    <SIWEButton {...props} />
  </ResetContainer>
);
export default SIWEButtonComponent;
