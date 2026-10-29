import assert from 'node:assert/strict';
import { after, test } from 'node:test';
import { renderToStaticMarkup } from 'react-dom/server';
import { createConfig, http } from 'wagmi';
import { mainnet } from 'wagmi/chains';

import { wallets } from '../src/wallets';
import { walletConfigs } from '../src/wallets/walletConfigs';

const originalNavigator = Object.getOwnPropertyDescriptor(
  globalThis,
  'navigator'
);
const setUserAgent = (userAgent: string) =>
  Object.defineProperty(globalThis, 'navigator', {
    configurable: true,
    value: { userAgent },
  });
after(() => {
  if (originalNavigator)
    Object.defineProperty(globalThis, 'navigator', originalNavigator);
  else Reflect.deleteProperty(globalThis, 'navigator');
});

const oath = walletConfigs.oath;
const pairing = `wc:${'a'.repeat(64)}@2?relay-protocol=irn&symKey=${'b'.repeat(
  64
)}`;

test('the exported Oath selector is a native-only entry without an injected provider', async () => {
  const config = createConfig({
    chains: [mainnet],
    connectors: [wallets.oathWallet],
    transports: { [mainnet.id]: http() },
    ssr: true,
  });
  const connector = config.connectors[0];
  assert.equal(connector.id, 'oath');
  assert.equal(connector.name, 'Oath Wallet');
  assert.equal(oath.walletConnectOnly, true);
  assert.equal(await connector.getProvider(), undefined);
  assert.equal(await connector.isAuthorized(), false);
});

test('desktop QR contains the original WalletConnect URI', () => {
  setUserAgent(
    'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 Chrome/130.0.0.0 Safari/537.36'
  );
  assert.equal(oath.getWalletConnectDeeplink?.(pairing), pairing);
});

test('iOS handoff encodes the full pairing URI exactly once', () => {
  setUserAgent(
    'Mozilla/5.0 (iPhone; CPU iPhone OS 18_2 like Mac OS X) AppleWebKit/605.1.15 Version/18.2 Mobile/15E148 Safari/604.1'
  );
  const url = new URL(oath.getWalletConnectDeeplink!(pairing));
  assert.equal(url.protocol, 'oathwallet:');
  assert.equal(url.hostname, 'wc');
  assert.equal(url.searchParams.get('uri'), pairing);
});

test('no empty native launch or Android application is advertised', () => {
  assert.equal(oath.getWalletConnectDeeplink?.(''), '');
  setUserAgent(
    'Mozilla/5.0 (Linux; Android 14; Pixel 8) AppleWebKit/537.36 Chrome/130.0.0.0 Mobile Safari/537.36'
  );
  assert.equal(oath.getWalletConnectDeeplink?.(pairing), pairing);
  assert.equal(oath.downloadUrls?.android, undefined);
  assert.equal(
    oath.downloadUrls?.ios,
    'https://apps.apple.com/app/id6780187283'
  );
});

test('the logo renders the original rounded blue mark as SVG', () => {
  const svg = renderToStaticMarkup(oath.icon as React.ReactElement);
  assert.match(svg, /viewBox="0 0 1024 1024"/);
  assert.match(svg, /rx="256"/);
  assert.match(svg, /linearGradient/);
});

test('the generic WalletConnect catalog entry remains unchanged', () => {
  assert.equal(walletConfigs.walletConnect.walletConnectOnly, undefined);
  assert.equal(
    walletConfigs.walletConnect.getWalletConnectDeeplink?.(pairing),
    pairing
  );
  assert.equal(walletConfigs.walletConnect.name, 'Other Wallets');
});
