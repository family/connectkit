import { Connector, useConnect } from 'wagmi';

export function useConnectors() {
  const { connectors } = useConnect();
  return connectors;
}

export function useConnector(id: string) {
  const connectors = useConnectors();
  return connectors.find((c) => c.id === id) as Connector;
}

export function useInjectedConnector() {
  /*
  options: {
    shimDisconnect: true,
    name: (
      detectedName: string | string[] // Detects the name of the injected wallet
    ) =>
      `Injected (${
        typeof detectedName === 'string'
          ? detectedName
          : detectedName.join(', ')
      })`,
  }
  */
  return useConnector('injected');
}
export function useWalletConnectConnector() {
  /*
  options: {
    qrcode: false,
    // or
    showQrModal: false,
  }
  */
  return useConnector('walletConnect');
}
export function useCoinbaseWalletConnector() {
  /*
  options: {
    headlessMode: true,
  }
  */
  return useConnector('coinbaseWallet');
}
export function useMetaMaskConnector() {
  /*
  options: {
    shimDisconnect: true,
    shimChainChangedDisconnect: true,
    UNSTABLE_shimOnConnectSelectAccount: true,
  }
  */
  return useConnector('metaMask');
}
