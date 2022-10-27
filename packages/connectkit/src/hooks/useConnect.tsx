import { useConnect as wagmiUseConnect, useNetwork } from 'wagmi';
import { useContext } from '../components/ConnectKit';

export function useConnect() {
  const context = useContext();
  const { chains } = useNetwork();
  const { connectAsync, connectors } = wagmiUseConnect({
    onError(err) {
      if (err.message) {
        if (err.message !== 'User rejected request') {
          context.debug(err.message, err);
        }
      } else {
        context.debug(`Could not connect. See console for more details.`, err);
      }
    },
  });
  return {
    connectAsync: ({ ...props }) =>
      connectAsync({
        ...props,
        chainId: context.options?.initialChainId ?? chains[0]?.id,
      }),
    connectors,
  };
}
