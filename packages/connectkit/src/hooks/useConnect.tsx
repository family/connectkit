import { useConnect as wagmiUseConnect } from 'wagmi';
import { useContext } from '../components/ConnectKit';

export function useConnect(...props) {
  const context = useContext();

  const { connectAsync, connectors, ...rest } = wagmiUseConnect({
    onError(err) {
      if (err.message) {
        if (err.message !== 'User rejected request') {
          context.debug(err.message, err);
        }
      } else {
        context.debug(`Could not connect. See console for more details.`, err);
      }
    },
    ...props,
    /*
    onSuccess: (data) => {
      context.onConnect?.({
        address: data.account,
        //chainId: data.chain.id,
        connectorId: data.connector?.id,
      });
    },
    */
  });

  return {
    ...rest,
    connectAsync: async ({ ...props }) => {
      return await connectAsync({
        ...props,
        chainId: context.options?.initialChainId,
      });
    },
    connectors,
  };
}
