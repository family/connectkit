import React, { useCallback, useEffect, useState } from 'react';

import { AnimatePresence, motion, Variants } from 'framer-motion';

import { ResetContainer } from '../../../styles';
import Portal from '../Portal';

import { isMobile } from '../../../utils';

import {
  Container,
  BoxContainer,
  ModalContainer,
  PageContainer,
  PageContents,
  ControllerContainer,
  InnerContainer,
  BackgroundOverlay,
  CloseButton,
  BackButton,
  InfoButton,
  ModalHeading,
  TextWithHr,
} from './styles';

import { routes, useContext } from '../../ConnectKit';
import useLockBodyScroll from '../../../hooks/useLockBodyScroll';

import { useTransition } from 'react-transition-state';
import FocusTrap from '../../../hooks/useFocusTrap';
import localizations, { localize } from '../../../constants/localizations';
import { supportedConnectors } from '../../..';
import usePrevious from '../../../hooks/usePrevious';
import { CustomTheme } from '../../../types';

const InfoIcon = ({ ...props }) => (
  <svg
    aria-hidden="true"
    width="22"
    height="22"
    viewBox="0 0 22 22"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    {...props}
  >
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M20 11C20 15.9706 15.9706 20 11 20C6.02944 20 2 15.9706 2 11C2 6.02944 6.02944 2 11 2C15.9706 2 20 6.02944 20 11ZM22 11C22 17.0751 17.0751 22 11 22C4.92487 22 0 17.0751 0 11C0 4.92487 4.92487 0 11 0C17.0751 0 22 4.92487 22 11ZM11.6445 12.7051C11.6445 13.1348 11.3223 13.4678 10.7744 13.4678C10.2266 13.4678 9.92578 13.1885 9.92578 12.6191V12.4795C9.92578 11.4268 10.4951 10.8574 11.2686 10.3203C12.2031 9.67578 12.665 9.32129 12.665 8.59082C12.665 7.76367 12.0205 7.21582 11.043 7.21582C10.3232 7.21582 9.80762 7.57031 9.45312 8.16113C9.38282 8.24242 9.32286 8.32101 9.2667 8.39461C9.04826 8.68087 8.88747 8.8916 8.40039 8.8916C8.0459 8.8916 7.66992 8.62305 7.66992 8.15039C7.66992 7.96777 7.70215 7.7959 7.75586 7.61328C8.05664 6.625 9.27051 5.75488 11.1182 5.75488C12.9336 5.75488 14.5234 6.71094 14.5234 8.50488C14.5234 9.7832 13.7822 10.417 12.7402 11.1045C11.999 11.5986 11.6445 11.9746 11.6445 12.5762V12.7051ZM11.9131 15.5625C11.9131 16.1855 11.376 16.6797 10.7529 16.6797C10.1299 16.6797 9.59277 16.1748 9.59277 15.5625C9.59277 14.9395 10.1191 14.4453 10.7529 14.4453C11.3867 14.4453 11.9131 14.9287 11.9131 15.5625Z"
      fill="currentColor"
    />
  </svg>
);
const CloseIcon = ({ ...props }) => (
  <motion.svg
    width={14}
    height={14}
    viewBox="0 0 14 14"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    {...props}
  >
    <path
      d="M1 13L13 1"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
    />
    <path
      d="M1 0.999999L13 13"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
    />
  </motion.svg>
);
const BackIcon = ({ ...props }) => (
  <motion.svg
    width={9}
    height={16}
    viewBox="0 0 9 16"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    {...props}
  >
    <path
      d="M8 1L1 8L8 15"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </motion.svg>
);

const contentTransitionDuration = 0.22;

export const contentVariants: Variants = {
  initial: {
    //willChange: 'transform,opacity',
    zIndex: 2,
    opacity: 0,
  },
  animate: {
    opacity: 1,
    scale: 1,
    transition: {
      duration: contentTransitionDuration * 0.75,
      delay: contentTransitionDuration * 0.25,
      ease: [0.26, 0.08, 0.25, 1],
    },
  },
  exit: {
    zIndex: 1,
    opacity: 0,
    pointerEvents: 'none',
    position: 'absolute',
    left: ['50%', '50%'],
    x: ['-50%', '-50%'],
    transition: {
      duration: contentTransitionDuration,
      ease: [0.26, 0.08, 0.25, 1],
    },
  },
};

type ModalProps = {
  open: boolean | undefined;
  pages: any;
  pageId: string;
  positionInside?: boolean;
  inline?: boolean;
  onClose?: () => void | undefined;
  onBack?: () => void | undefined;
  onInfo?: () => void | undefined;

  demo?: {
    theme: string;
    customTheme: CustomTheme;
  };
};
const Modal: React.FC<ModalProps> = ({
  open,
  pages,
  pageId,
  positionInside,
  inline,
  demo,
  onClose,
  onBack,
  onInfo,
}) => {
  const context = useContext();
  const mobile = isMobile();

  const [state, setOpen] = useTransition({
    timeout: mobile ? 360 : 160, // different animations, 10ms extra to avoid final-frame drops
    preEnter: true,
    mountOnEnter: true,
    unmountOnExit: true,
  });
  const mounted = !(state === 'exited' || state === 'unmounted');
  const rendered = state === 'preEnter' || state !== 'exiting';
  const currentDepth =
    context.route === routes.CONNECTORS
      ? 0
      : context.route === routes.DOWNLOAD
      ? 2
      : 1;
  const prevDepth = usePrevious(currentDepth, currentDepth);
  if (!positionInside) useLockBodyScroll(mounted);

  useEffect(() => {
    setOpen(open);
  }, [open]);

  const [dimensions, setDimensions] = useState<{
    width: string | undefined;
    height: string | undefined;
    rawWidth: number | undefined;
    rawHeight: number | undefined;
  }>({
    width: undefined,
    height: undefined,
    rawWidth: undefined,
    rawHeight: undefined,
  });
  const [inTransition, setInTransition] = useState<boolean>(false);

  let blockTimeout: ReturnType<typeof setTimeout>;
  const contentRef = useCallback(
    (node: any) => {
      if (!node) return;

      // Avoid transition mixups
      setInTransition(true);
      clearTimeout(blockTimeout);
      blockTimeout = setTimeout(() => setInTransition(false), 300);

      // Calculate new content bounds
      const bounds = {
        width: node?.offsetWidth,
        height: node?.offsetHeight,
      };
      setDimensions({
        width: `${bounds?.width}px`,
        height: `${bounds?.height}px`,
        rawWidth: bounds?.width,
        rawHeight: bounds?.height,
      });
    },
    [open]
  );

  useEffect(() => {
    if (!mounted) {
      setDimensions({
        width: undefined,
        height: undefined,
        rawWidth: undefined,
        rawHeight: undefined,
      });
      return;
    }

    const listener = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && onClose) onClose();
    };
    document.addEventListener('keydown', listener);
    return () => {
      document.removeEventListener('keydown', listener);
    };
  }, [mounted, onClose]);

  const dimensionsCSS = {
    '--height': dimensions.height,
    '--width': dimensions.width,
  } as React.CSSProperties;

  function shouldUseQrcode() {
    const c = supportedConnectors.filter((x) => x.id === context.connector)[0];
    if (!c) return false; // Fail states are shown in the injector flow

    const hasExtensionInstalled =
      c.extensionIsInstalled && c.extensionIsInstalled();

    const useInjector = !c.scannable || hasExtensionInstalled;
    return !useInjector;
  }

  function getHeading() {
    const c = supportedConnectors.filter((x) => x.id === context.connector)[0];

    switch (context.route) {
      case routes.ABOUT:
        return localize(localizations[context.lang].aboutScreen.heading);
      case routes.CONNECT:
        if (shouldUseQrcode()) {
          return c.id === 'walletConnect'
            ? localize(localizations[context.lang].scanScreen.heading)
            : `Scan with ${c.name}`;
        } else {
          return c.name;
        }
      case routes.CONNECTORS:
        return localize(localizations[context.lang].connectorsScreen.heading);
      case routes.MOBILECONNECTORS:
        return localize(
          localizations[context.lang].mobileConnectorsScreen.heading
        );
      case routes.DOWNLOAD:
        return localize(localizations[context.lang].downloadAppScreen.heading, {
          CONNECTORNAME: c.name,
        });
      case routes.ONBOARDING:
        return localize(localizations[context.lang].onboardingScreen.heading);
      case routes.PROFILE:
        return localize(localizations[context.lang].profileScreen.heading);
      case routes.SWITCHNETWORKS:
        return localize(
          localizations[context.lang].switchNetworkScreen.heading
        );
      default:
        return '';
    }
  }

  const Content = (
    <ResetContainer
      $useTheme={demo?.theme ?? context.theme}
      $customTheme={demo?.customTheme ?? context.customTheme}
    >
      <ModalContainer
        role="dialog"
        style={{
          pointerEvents: rendered ? 'auto' : 'none',
          position: positionInside ? 'absolute' : undefined,
        }}
      >
        {!inline && <BackgroundOverlay $active={rendered} onClick={onClose} />}
        <Container
          style={dimensionsCSS}
          initial={false}
          transition={{
            ease: [0.2555, 0.1111, 0.2555, 1.0001],
            duration: !positionInside && state !== 'entered' ? 0 : 0.24,
          }}
        >
          <BoxContainer className={`${rendered && 'active'}`}>
            <AnimatePresence>
              {context.errorMessage && (
                <motion.div
                  style={{
                    zIndex: -1,
                    position: 'absolute',
                    left: '50%',
                    transform: 'translateX(-50%)',
                    width: 'var(--width)',
                    top: 64,
                    color: '#fff',
                    fontSize: 16,
                    lineHeight: '20px',
                    fontWeight: 500,
                    background: 'var(--body-color-danger)',
                    borderRadius: 20,
                    padding: '24px 46px 82px 24px',
                    transition: 'width var(--duration) var(--ease)',
                  }}
                  initial={{ y: '10%', x: '-50%' }}
                  animate={{ y: '-100%' }}
                  exit={{ y: '100%' }}
                  transition={{ duration: 0.2, ease: 'easeInOut' }}
                >
                  <span>{context.errorMessage}</span>
                  <div
                    onClick={() => context.debug(null)}
                    style={{
                      position: 'absolute',
                      right: 24,
                      top: 24,
                    }}
                  >
                    <CloseIcon />
                  </div>
                </motion.div>
              )}
              {demo && (
                <motion.div
                  style={{
                    zIndex: -1,
                    position: 'absolute',
                    left: '50%',
                    transform: 'translateX(-50%)',
                    width: 'var(--width)',
                    bottom: '100%',
                    textAlign: 'center',
                    transition: 'width var(--duration) var(--ease)',
                  }}
                >
                  <span
                    style={{
                      display: 'inline-block',
                      padding: '8px 16px 6px',
                      color: '#fff',
                      fontSize: 12,
                      lineHeight: '20px',
                      fontWeight: 500,
                      background: 'gray',
                      borderRadius: '12px 12px 0 0',
                    }}
                  >
                    Demo Mode
                  </span>
                </motion.div>
              )}
            </AnimatePresence>
            <ControllerContainer>
              <CloseButton aria-label="Close" onClick={onClose}>
                <CloseIcon />
              </CloseButton>
              <AnimatePresence>
                {onBack ? (
                  <BackButton
                    disabled={inTransition}
                    aria-label="Back"
                    key="backButton"
                    onClick={onBack}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.1 }}
                  >
                    <BackIcon />
                  </BackButton>
                ) : (
                  onInfo && (
                    <InfoButton
                      disabled={inTransition}
                      aria-label="More information"
                      key="infoButton"
                      onClick={onInfo}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      transition={{ duration: 0.1 }}
                      style={{
                        display: context.options?.hideQuestionMarkCTA
                          ? 'none'
                          : 'flex',
                      }}
                    >
                      <InfoIcon />
                    </InfoButton>
                  )
                )}
              </AnimatePresence>
            </ControllerContainer>

            <ModalHeading>
              <AnimatePresence>
                <motion.div
                  style={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    right: 0,
                  }}
                  key={context.route}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{
                    duration: 0.17,
                  }}
                >
                  {getHeading()}
                </motion.div>
              </AnimatePresence>
            </ModalHeading>

            <InnerContainer>
              {Object.keys(pages).map((key) => {
                const page = pages[key];
                return (
                  <Page
                    key={key}
                    open={key === pageId}
                    initial={!positionInside && state !== 'entered'}
                    enterAnim={
                      key === pageId
                        ? currentDepth > prevDepth
                          ? 'active-scale-up'
                          : 'active'
                        : ''
                    }
                    exitAnim={
                      key !== pageId
                        ? currentDepth < prevDepth
                          ? 'exit-scale-down'
                          : 'exit'
                        : ''
                    }
                  >
                    <PageContents
                      key={`inner-${key}`}
                      ref={contentRef}
                      style={{
                        pointerEvents:
                          key === pageId && rendered ? 'auto' : 'none',
                      }}
                    >
                      {page}
                    </PageContents>
                  </Page>
                );
              })}
            </InnerContainer>
          </BoxContainer>
        </Container>
      </ModalContainer>
    </ResetContainer>
  );
  return (
    <>
      {mounted && (
        <>
          {positionInside ? (
            Content
          ) : (
            <>
              {
                <Portal>
                  <FocusTrap>{Content}</FocusTrap>
                </Portal>
              }
            </>
          )}
        </>
      )}
    </>
  );
};

type PageProps = {
  children?: React.ReactNode;
  open: boolean | undefined;
  initial: boolean;
  prevDepth?: number;
  currentDepth?: number;
  enterAnim?: string;
  exitAnim?: string;
};

const Page: React.FC<PageProps> = ({
  children,
  open,
  initial,
  prevDepth,
  currentDepth,
  enterAnim,
  exitAnim,
}) => {
  const [state, setOpen] = useTransition({
    timeout: 320,
    preEnter: true,
    initialEntered: open,
    mountOnEnter: true,
    unmountOnExit: true,
  });
  const mounted = !(state === 'exited' || state === 'unmounted');
  const rendered = state === 'preEnter' || state !== 'exiting';

  useEffect(() => {
    setOpen(open);
  }, [open]);

  if (!mounted) return null;

  return (
    <PageContainer
      className={`${rendered ? enterAnim : exitAnim}`}
      // className={`${
      //   rendered
      //     ? currentDepth > prevDepth
      //       ? 'active-scale-up'
      //       : 'active'
      //     : currentDepth < prevDepth
      //     ? 'exit-scale-down'
      //     : 'exit'
      // }`}
      style={{
        animationDuration: initial ? '0ms' : undefined,
        animationDelay: initial ? '0ms' : undefined,
      }}
    >
      {children}
    </PageContainer>
  );
};

export const OrDivider = ({ children }: { children?: React.ReactNode }) => {
  return (
    <TextWithHr>
      <span>{children ?? 'or'}</span>
    </TextWithHr>
  );
};

export default Modal;
