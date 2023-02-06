import React, { useEffect, useState } from 'react';
import {
  Container,
  WalletList,
  WalletItem,
  WalletIcon,
  WalletLabel,
} from './styles';

import { PageContent, ModalContent } from '../../Common/Modal/styles';

import { useConnect } from '../../../hooks/useConnect';
import useDefaultWallets from '../../../wallets/useDefaultWallets';
import { routes, useContext } from '../../ConnectKit';
import { WalletProps } from '../../../wallets/wallet';
import { useWalletConnectModal } from '../../../hooks/useWalletConnectModal';
import CopyToClipboard from '../../Common/CopyToClipboard';
import { walletConnect } from '../../../wallets/connectors/walletConnect';
import useLocales from '../../../hooks/useLocales';
import { useChains } from '../../../hooks/useChains';

const MoreIcon = (
  <svg
    width="60"
    height="60"
    viewBox="0 0 60 60"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M30 42V19M19 30.5H42"
      stroke="var(--ck-body-color-muted)"
      strokeWidth="3"
      strokeLinecap="round"
    />
  </svg>
);
const MobileConnectors: React.FC = () => {
  const context = useContext();
  const { connectAsync } = useConnect();

  const locales = useLocales();

  const chains = useChains();

  const { open: openW3M } = useWalletConnectModal();
  const wallets = useDefaultWallets().filter(
    (wallet: WalletProps) => wallet.installed === undefined // Do not show wallets that are injected connectors
  );

  const connectWallet = (wallet: WalletProps) => {
    const c = wallet.createConnector();

    if (wallet.installed) {
      context.setRoute(routes.CONNECT);
      context.setConnector(c.connector.id);
    } else {
      c.connector.on('message', async ({ type }: any) => {
        if (type === 'connecting') {
          const uri = await c.mobile.getUri();
          window.location.href = uri;
        }
      });

      try {
        connectAsync({ connector: c.connector });
      } catch (err) {
        context.debug(
          'Async connect error. See console for more details.',
          err
        );
      }
    }
  };

  async function connectWCWallet(connector: any) {
    await connectAsync({ connector: connector });
  }

  const [walletConnectUri, setWalletConnectUri] = useState('');
  useEffect(() => {
    const getWalletConnectUri = async () => {
      const c = await walletConnect({ chains }).createConnector();

      const qrUri = await c.qrCode.getUri();
      console.log(qrUri);

      c.connector.on('message', async (e) => {
        //@ts-ignore
        const p = await c.connector.getProvider();
        console.log(p);
        setWalletConnectUri(p.connector.uri);

        // User rejected, regenerate QR code
        p.connector.on('disconnect', () => {
          connectWCWallet(c.connector);
        });
      });
      try {
        await connectWCWallet(c.connector);
      } catch (err) {
        context.debug(
          <>WalletConnect cannot connect. See console for more details.</>,
          err
        );
      }
    };
    getWalletConnectUri();
  }, []);

  return (
    <PageContent style={{ width: 312 }}>
      <Container>
        <ModalContent>
          <WalletList>
            {wallets.map((wallet: WalletProps, i: number) => {
              const { name, shortName, logos, logoBackground } = wallet;
              return (
                <WalletItem key={i} onClick={() => connectWallet(wallet)}>
                  <WalletIcon
                    $outline={true}
                    style={
                      logoBackground
                        ? {
                            background: logoBackground,
                          }
                        : undefined
                    }
                  >
                    {logos.mobile ?? logos.default}
                  </WalletIcon>
                  <WalletLabel>{shortName ?? name}</WalletLabel>
                </WalletItem>
              );
            })}
            <WalletItem onClick={openW3M}>
              <WalletIcon
                style={{ background: 'var(--ck-body-background-secondary)' }}
              >
                {MoreIcon}
              </WalletIcon>
              <WalletLabel>{locales.more}</WalletLabel>
            </WalletItem>
          </WalletList>
        </ModalContent>
        {context.options?.walletConnectCTA !== 'modal' && (
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 14,
              paddingTop: 16,
            }}
          >
            <CopyToClipboard variant="button" string={walletConnectUri}>
              {locales.copyToClipboard}
            </CopyToClipboard>
          </div>
        )}
      </Container>
    </PageContent>
  );
};

export default MobileConnectors;
