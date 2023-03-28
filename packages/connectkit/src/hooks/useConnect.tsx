import { useConnect as wagmiUseConnect } from 'wagmi';
import { useContext } from '../components/ConnectKit';

export function useConnect(...props) {
  const context = useContext();

  const { connect, connectAsync, connectors, ...rest } = wagmiUseConnect({
    onError(err) {
      if (err.message) {
        if (err.message !== 'User rejected request') {
          context.log(err.message, err);
        }
      } else {
        context.log(`Could not connect.`, err);
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
    connect: ({ ...props }) => {
      return connect({
        ...props,
        chainId: context.options?.initialChainId,
      });
    },
    connectAsync: async ({ ...props }) => {
      return await connectAsync({
        ...props,
        chainId: context.options?.initialChainId,
      });
    },
    connectors,
    ...rest,
  };
}
