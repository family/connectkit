import React, { useEffect, useState } from 'react';
import {
  isSafeConnector,
  nFormatter,
  truncateEthAddress,
  truncateUserId,
} from '../../../utils';
import { routes, useFortKit } from '../../FortKit';

import {
  useAccount,
  useBalance,
  useEnsName
} from 'wagmi';

import {
  AvatarContainer,
  AvatarInner,
  Balance,
  BalanceContainer,
  ChainSelectorContainer,
  LoadingBalance,
  Unsupported,
} from './styles';

import Avatar from '../../Common/Avatar';
import Button from '../../Common/Button';
import ChainSelector from '../../Common/ChainSelect';
import {
  ModalBody,
  ModalContent,
  ModalH1,
  PageContent,
} from '../../Common/Modal/styles';

import { AnimatePresence } from 'framer-motion';
import { DisconnectIcon } from '../../../assets/icons';
import { useEnsFallbackConfig } from '../../../hooks/useEnsFallbackConfig';
import useLocales from '../../../hooks/useLocales';
import { useOpenfort } from '../../../openfort/OpenfortProvider';
import CopyToClipboard from '../../Common/CopyToClipboard';
import { useThemeContext } from '../../ConnectKitThemeProvider/ConnectKitThemeProvider';
import FitText from '../../Common/FitText';
import { LinkedProviders } from './LinkedProviders';
import PoweredByFooter from '../../Common/PoweredByFooter';

const Profile: React.FC<{ closeModal?: () => void }> = ({ closeModal }) => {
  const context = useFortKit();
  const themeContext = useThemeContext();

  const locales = useLocales();


  const { address, isConnected, connector, chain } = useAccount();
  const ensFallbackConfig = useEnsFallbackConfig();
  const { data: ensName } = useEnsName({
    chainId: 1,
    address: address,
    config: ensFallbackConfig,
  });
  const { data: balance } = useBalance({
    address,
    //watch: true,
  });

  const [shouldDisconnect, setShouldDisconnect] = useState(false);
  const { logout, user } = useOpenfort();

  useEffect(() => {
    // if (!isConnected) context.setOpen(false);
  }, [isConnected]);

  useEffect(() => {
    if (!shouldDisconnect) return;

    // Close before disconnecting to avoid layout shifting while modal is still open
    if (closeModal) {
      closeModal();
    } else {
      context.setOpen(false);
    }
    return () => {
      logout();
    };
  }, [shouldDisconnect, logout]);

  const separator = ['web95', 'rounded', 'minimal'].includes(
    themeContext.theme ?? context.theme ?? ''
  )
    ? '....'
    : undefined;

  return (
    <PageContent>
      <ModalContent style={{ paddingBottom: 22, gap: 6 }}>
        {
          address ? (
            <>
              <AvatarContainer>
                <AvatarInner>
                  <ChainSelectorContainer>
                    <ChainSelector />
                  </ChainSelectorContainer>
                  <Avatar address={address} />
                </AvatarInner>
              </AvatarContainer>
              <ModalH1>
                <CopyToClipboard string={address}>
                  {ensName ?? truncateEthAddress(address, separator)}
                </CopyToClipboard>
              </ModalH1>
              {context?.options?.hideBalance ? null : (
                <ModalBody>
                  <BalanceContainer>
                    <AnimatePresence exitBeforeEnter initial={false}>
                      {balance && (
                        <Balance
                          key={`chain-${chain?.id}`}
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          exit={{ opacity: 0 }}
                          transition={{ duration: 0.2 }}
                        >
                          {nFormatter(Number(balance?.formatted))}
                          {` `}
                          {balance?.symbol}
                        </Balance>
                      )}
                      {!balance && (
                        <LoadingBalance
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          exit={{ opacity: 0 }}
                          transition={{ duration: 0.2 }}
                        >
                          &nbsp;
                        </LoadingBalance>
                      )}
                    </AnimatePresence>
                  </BalanceContainer>
                </ModalBody>
              )}
            </>
          ) : (
            <Button
              onClick={() => context.setRoute(routes.CONNECTORS)}
              icon={
                <Unsupported
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                >
                  <svg
                    width="130"
                    height="120"
                    viewBox="0 0 13 12"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M2.61317 11.2501H9.46246C10.6009 11.2501 11.3256 10.3506 11.3256 9.3549C11.3256 9.05145 11.255 8.73244 11.0881 8.43303L7.65903 2.14708C7.659 2.14702 7.65897 2.14696 7.65893 2.1469C7.65889 2.14682 7.65884 2.14673 7.65879 2.14664C7.31045 1.50746 6.6741 1.17871 6.04 1.17871C5.41478 1.17871 4.763 1.50043 4.41518 2.14968L0.993416 8.43476C0.828865 8.72426 0.75 9.04297 0.75 9.3549C0.75 10.3506 1.47471 11.2501 2.61317 11.2501Z"
                      fill="currentColor"
                      stroke="var(--ck-body-background, #fff)"
                      strokeWidth="1.5"
                    />
                    <path
                      d="M6.03258 7.43916C5.77502 7.43916 5.63096 7.29153 5.62223 7.02311L5.55675 4.96973C5.54802 4.69684 5.74446 4.5 6.02821 4.5C6.3076 4.5 6.51277 4.70131 6.50404 4.9742L6.43856 7.01864C6.42546 7.29153 6.2814 7.43916 6.03258 7.43916ZM6.03258 9.11676C5.7401 9.11676 5.5 8.9065 5.5 8.60677C5.5 8.30704 5.7401 8.09678 6.03258 8.09678C6.32506 8.09678 6.56515 8.30256 6.56515 8.60677C6.56515 8.91097 6.32069 9.11676 6.03258 9.11676Z"
                      fill="white"
                    />
                  </svg>
                </Unsupported>
              }
            >
              Connect wallet
            </Button>
          )
        }
        <LinkedProviders />
      </ModalContent>
      {!isSafeConnector(connector?.id) && (
        <Button
          onClick={() => setShouldDisconnect(true)}
          icon={<DisconnectIcon />}
        >
          {locales.disconnect}
        </Button>
      )}
      <PoweredByFooter />
    </PageContent>
  );
};

export default Profile;
