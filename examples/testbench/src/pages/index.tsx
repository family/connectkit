import type { NextPage } from 'next';
import { Avatar, ConnectKitButton, Types } from 'connectkit';
import { useTestBench } from '../TestbenchProvider';
import { Checkbox, Textbox, Select, SelectProps } from '../components/inputs';
import {
  useAccount,
  useBalance,
  useDeprecatedSendTransaction,
  useNetwork,
  useSignMessage,
  useSignTypedData,
} from 'wagmi';
import { useEffect, useState } from 'react';
import { BigNumber } from 'ethers';

import CustomAvatar from '../components/CustomAvatar';

/** TODO: import this data from the connectkit module */
const themes: SelectProps[] = [
  { label: 'Auto', value: 'auto' },
  { label: 'Web95', value: 'web95' },
  { label: 'Retro', value: 'retro' },
  { label: 'Soft', value: 'soft' },
  { label: 'Minimal', value: 'minimal' },
  { label: 'Rounded', value: 'rounded' },
  { label: 'Midnight', value: 'midnight' },
  { label: 'Nouns', value: 'nouns' },
];
const modes: SelectProps[] = [
  { label: 'Auto', value: 'auto' },
  { label: 'Light', value: 'light' },
  { label: 'Dark', value: 'dark' },
];
const languages: SelectProps[] = [{ label: 'English (US)', value: 'en' }];

const AccountInfo = () => {
  const { isConnected, address, connector } = useAccount();
  const { data: balanceData } = useBalance({
    addressOrName: address,
  });
  const { chain } = useNetwork();

  if (!isConnected) return null;
  return (
    <ul>
      <li>ChainID: {chain?.id}</li>
      <li>Chain name: {chain?.name}</li>
      <li>Chain Supported: {chain?.unsupported ? 'No' : 'Yes'}</li>
      <li>Address: {address}</li>
      <li>Connector: {connector?.id}</li>
      <li>Balance: {balanceData?.formatted}</li>
    </ul>
  );
};

const Actions = () => {
  const { isConnected, address } = useAccount();

  const {
    signMessage,
    isLoading: signMessageIsLoading,
    isError: signMessageIsError,
  } = useSignMessage({
    message: 'fam token wen',
  });
  const {
    signTypedData,
    isLoading: signTypedDataIsLoading,
    isError: signTypedDataIsError,
  } = useSignTypedData({
    // All properties on a domain are optional
    domain: {
      name: 'Ether Mail',
      version: '1',
      chainId: 1,
      verifyingContract: '0xCcCCccccCCCCcCCCCCCcCcCccCcCCCcCcccccccC',
    },
    // The named list of all type definitions
    types: {
      Person: [
        { name: 'name', type: 'string' },
        { name: 'wallet', type: 'address' },
      ],
      Mail: [
        { name: 'from', type: 'Person' },
        { name: 'to', type: 'Person' },
        { name: 'contents', type: 'string' },
      ],
    },
    value: {
      from: {
        name: 'Cow',
        wallet: '0xCD2a3d9F938E13CD947Ec05AbC7FE734Df8DD826',
      },
      to: {
        name: 'Bob',
        wallet: '0xbBbBBBBbbBBBbbbBbbBbbbbBBbBbbbbBbBbbBBbB',
      },
      contents: 'Hello, Bob!',
    },
  });
  const {
    sendTransaction,
    isLoading: sendTransactionIsLoading,
    isError: sendTransactionIsError,
  } = useDeprecatedSendTransaction({
    request: {
      to: address,
      value: BigNumber.from('0'),
    },
  });

  const testSignMessage = () => {
    signMessage();
  };
  const testSignTypedData = () => {
    signTypedData();
  };
  const testSendTransaction = () => {
    sendTransaction();
  };

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        gap: 8,
        flexWrap: 'wrap',
      }}
    >
      <h2>Actions {!isConnected && `(connect to test)`}</h2>
      <button disabled={!isConnected} onClick={testSignMessage}>
        {signMessageIsError
          ? 'Error. Check console'
          : signMessageIsLoading
          ? 'Waiting...'
          : 'Sign message'}
      </button>
      <button disabled={!isConnected} onClick={testSignTypedData}>
        {signTypedDataIsError
          ? 'Error. Check console'
          : signTypedDataIsLoading
          ? 'Waiting...'
          : 'Sign typed data'}
      </button>
      <button disabled={!isConnected} onClick={testSendTransaction}>
        {sendTransactionIsError
          ? 'Error. Check console'
          : sendTransactionIsLoading
          ? 'Waiting...'
          : 'Send transaction'}
      </button>
    </div>
  );
};

const Home: NextPage = () => {
  const {
    theme,
    setTheme,
    mode,
    setMode,
    options,
    setOptions,
    label,
    setLabel,
    hideAvatar,
    setHideAvatar,
    hideBalance,
    setHideBalance,
  } = useTestBench();

  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  if (!mounted) return null;

  return (
    <div
      style={{
        padding: 32,
        paddingLeft: 352,
        display: 'flex',
        gap: 64,
      }}
    >
      <div
        style={{
          zIndex: 2147483647,
          position: 'fixed',
          overflow: 'scroll',
          top: 0,
          left: 0,
          bottom: 0,
          width: 256,
          padding: 32,
          background: '#fff',
        }}
      >
        <ConnectKitButton.Custom>
          {({ isConnected, show, address, ensName }) => {
            return (
              <button onClick={show}>
                {isConnected ? (
                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: 8,
                    }}
                  >
                    <Avatar address={address} size={12} />
                    {ensName ?? address}
                  </div>
                ) : (
                  'Custom Connect'
                )}
              </button>
            );
          }}
        </ConnectKitButton.Custom>

        <Actions />
        <h2>ConnectKitButton props</h2>
        <Checkbox
          label="customAvatar"
          value="customAvatar"
          checked={options.customAvatar !== undefined}
          onChange={() =>
            setOptions({
              ...options,
              customAvatar: options.customAvatar ? undefined : CustomAvatar,
            })
          }
        />
        <Textbox
          label="ConnectKitButton Label"
          value={label}
          onChange={(e: any) => {
            setLabel(e.target.value);
          }}
        />
        <Checkbox
          label="hideAvatar"
          value="hideAvatar"
          checked={hideAvatar}
          onChange={() => setHideAvatar(!hideAvatar)}
        />
        <Checkbox
          label="hideBalance"
          value="hideBalance"
          checked={hideBalance}
          onChange={() => setHideBalance(!hideBalance)}
        />
        <h2>ConnectKitProvider props</h2>
        <Select
          label="Theme"
          value={theme}
          options={themes}
          onChange={(e) => setTheme(e.target.value as Types.Theme)}
        />
        <Select
          label="Mode"
          value={mode}
          options={modes}
          onChange={(e) => setMode(e.target.value as Types.Mode)}
        />
        <Select
          label="Language"
          value={options.lang}
          options={languages}
          onChange={(e) =>
            setOptions({ ...options, lang: e.target.value as Types.Languages })
          }
        />
        <h3>options</h3>
        <Textbox
          label="disclaimer"
          value={options.disclaimer}
          onChange={(e: any) => {
            setOptions({ ...options, disclaimer: e.target.value });
          }}
        />
        <Textbox
          label="walletConnectName"
          value={options.walletConnectName}
          onChange={(e: any) => {
            setOptions({ ...options, walletConnectName: e.target.value });
          }}
        />
        <Checkbox
          label="reduceMotion"
          value="reduceMotion"
          checked={options.reduceMotion}
          onChange={() =>
            setOptions({ ...options, reducedMotion: !options.reduceMotion })
          }
        />
        <Checkbox
          label="truncateLongENSAddress"
          value="truncateLongENSAddress"
          checked={options.truncateLongENSAddress}
          onChange={() =>
            setOptions({
              ...options,
              truncateLongENSAddress: !options.truncateLongENSAddress,
            })
          }
        />
        <Checkbox
          label="hideTooltips"
          value="hideTooltips"
          checked={options.hideTooltips}
          onChange={() =>
            setOptions({ ...options, hideTooltips: !options.hideTooltips })
          }
        />
        <Checkbox
          label="hideQuestionMarkCTA"
          value="hideQuestionMarkCTA"
          checked={options.hideQuestionMarkCTA}
          onChange={() =>
            setOptions({
              ...options,
              hideQuestionMarkCTA: !options.hideQuestionMarkCTA,
            })
          }
        />
        <Checkbox
          label="hideNoWalletCTA"
          value="hideNoWalletCTA"
          checked={options.hideNoWalletCTA}
          onChange={() =>
            setOptions({
              ...options,
              hideNoWalletCTA: !options.hideNoWalletCTA,
            })
          }
        />
        <Checkbox
          label="avoidLayoutShift"
          value="avoidLayoutShift"
          checked={options.avoidLayoutShift}
          onChange={() =>
            setOptions({
              ...options,
              avoidLayoutShift: !options.avoidLayoutShift,
            })
          }
        />
        <Checkbox
          disabled
          label="embedGoogleFonts"
          value="embedGoogleFonts"
          checked={options.embedGoogleFonts}
          onChange={() =>
            setOptions({
              ...options,
              embedGoogleFonts: !options.embedGoogleFonts,
            })
          }
        />
        <Checkbox
          disabled
          label="bufferPolyfill"
          value="bufferPolyfill"
          checked={options.bufferPolyfill}
          onChange={() =>
            setOptions({
              ...options,
              bufferPolyfill: !options.bufferPolyfill,
            })
          }
        />
      </div>
      <div>
        <ConnectKitButton label={label} />

        <p>Avatars</p>
        <div style={{ display: 'flex', gap: 8 }}>
          <Avatar name="lochie.eth" />
          <Avatar name="pugson.eth" />
          <Avatar address="0xd8dA6BF26964aF9D7eEd9e03E53415D37aA96045" />
          <Avatar name="benjitaylor.eth" />
        </div>
      </div>
      <div>
        <AccountInfo />
      </div>
    </div>
  );
};

export default Home;
