import React, { useEffect, useState } from 'react';

import localizations, { localize } from '../../../constants/localizations';
import { useContext } from '../../ConnectKit';

import {
  PageContent,
  ModalBody,
  ModalContent,
  ModalHeadingBlock,
} from '../../Common/Modal/styles';
import {
  StatusGraphic,
  LogoContainer,
  StatusIcon,
  StatusGraphicBgSvg,
  ContentContainer,
} from './styles';

import { useAccount } from 'wagmi';
import { SIWEButton } from '../../Standard/SIWE';
import { useSIWE } from '../../Standard/SIWE/useSIWE';

import { TickIcon } from '../../../assets/icons';
import Chains from '../../../assets/chains';
import Avatar from '../../Common/Avatar';
import { getAppIcon } from '../../../defaultClient';

import { AnimatePresence, motion } from 'framer-motion';

const transition = { duration: 0.2, ease: [0.26, 0.08, 0.25, 1] };
const copyTransition = { duration: 0.16, ease: [0.26, 0.08, 0.25, 1] };

const SignInWithEthereum: React.FC = () => {
  const localizeText = (text: string) => {
    return localize(text, {
      //CONNECTORNAME: connector.name,
      //APPNAME: getAppName() ?? 'this dApp',
    });
  };
  const context = useContext();
  const { signedIn } = useSIWE();

  const [status, setStatus] = useState<'signedOut' | 'signedIn'>(
    signedIn ? 'signedIn' : 'signedOut'
  );

  const copy = localizations[context.lang].signInWithEthereumScreen[status];

  useEffect(() => {
    if (signedIn) setStatus('signedIn');
  }, []);

  useEffect(() => {
    if (!signedIn) setStatus('signedOut');
  }, [signedIn]);

  const { address } = useAccount();

  // We use the favicon for the dApp logo because that's how the connectors do it
  // TODO: Allow for dev customisation
  const getFavicons = () => {
    const favicons: { svg: string | null; default: string | null } = {
      svg: null,
      default: null,
    };
    const nodeList: HTMLCollectionOf<HTMLLinkElement> =
      document.getElementsByTagName('link');
    Array.from(nodeList).forEach((node) => {
      if (
        (node.getAttribute('rel') === 'icon' ||
          node.getAttribute('rel') === 'shortcut icon') &&
        node.getAttribute('href')
      ) {
        if (node.getAttribute('type') === 'image/svg+xml') {
          favicons.svg = node.getAttribute('href');
        } else {
          favicons.default = node.getAttribute('href');
        }
      }
    });
    return favicons;
  };
  const favicons = getFavicons();
  const favicon = getAppIcon() ?? favicons.svg ?? favicons.default;

  return (
    <PageContent style={{ width: 278 }}>
      <ModalHeadingBlock />
      <ModalContent style={{ padding: 0, marginTop: -10 }}>
        <ContentContainer>
          <AnimatePresence exitBeforeEnter>
            <motion.div
              key={copy.h1}
              initial={{ opacity: 0, scale: 0.94 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.94 }}
              transition={copyTransition}
            >
              <ModalBody>{localizeText(copy.h1)}</ModalBody>
            </motion.div>
          </AnimatePresence>
        </ContentContainer>
        <StatusGraphic $connected={signedIn} key="status">
          <div style={{ position: 'absolute', inset: 0 }}>
            <StatusGraphicBgSvg
              width="262"
              height="134"
              viewBox="0 0 262 134"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <motion.rect
                x="0"
                y="0"
                width="262"
                height="134"
                strokeDasharray="3 3"
                animate={{
                  strokeDashoffset: [0, -6],
                }}
                transition={{
                  duration: 0.4,
                  ease: 'linear',
                  repeat: Infinity,
                }}
              />
            </StatusGraphicBgSvg>
          </div>

          <motion.div
            key="avatarImage"
            initial={{
              opacity: 0,
              x: 50,
              scale: 0.8,
            }}
            animate={{
              opacity: 1,
              x: 0,
              scale: 1,
            }}
            transition={transition}
          >
            <LogoContainer>
              <Avatar address={address} size={64} />
            </LogoContainer>
          </motion.div>
          <motion.div
            key="tickIcon"
            initial={{
              scale: 0.6,
            }}
            animate={{
              scale: 1,
            }}
            transition={{
              ...transition,
            }}
          >
            <StatusIcon>
              <TickIcon />
            </StatusIcon>
          </motion.div>
          <motion.div
            key="appLogo"
            initial={{
              opacity: 0,
              x: -40,
              scale: 0.8,
            }}
            animate={{
              opacity: 1,
              x: 0,
              scale: 1,
            }}
            transition={{
              ...transition,
            }}
          >
            <LogoContainer>
              {favicon ? (
                <img src={favicon} alt={'app'} />
              ) : (
                <Chains.UnknownChain />
              )}
            </LogoContainer>
          </motion.div>
        </StatusGraphic>
        <AnimatePresence exitBeforeEnter>
          <motion.div
            key={copy.p}
            initial={{ opacity: 0, scale: 0.94 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.94 }}
            transition={copyTransition}
          >
            <ModalBody style={{ marginTop: -1, marginBottom: -3 }}>
              {localizeText(copy.p)}
            </ModalBody>
          </motion.div>
        </AnimatePresence>
        <SIWEButton
          showSignOutButton={status === 'signedIn'}
          onSignIn={() => {
            setTimeout(() => {
              context.setOpen(false);
            }, 2000);
          }}
        />
      </ModalContent>
    </PageContent>
  );
};

export default SignInWithEthereum;
