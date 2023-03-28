import { useConnect as wagmiUseConnect } from 'wagmi';
import { useContext } from '../components/ConnectKit';
import { useLastConnector } from './useLastConnector';

export function useConnect(...props) {
  const context = useContext();

  const connectProps = {
    chainId: context.options?.initialChainId,
  };

  const { updateLastConnectorId } = useLastConnector();

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
    onSuccess(data: any) {
      updateLastConnectorId(data?.connector?.id ?? '');
    },
    ...props,
  });

  return {
    connect: ({ props }) => {
      return connect({
        ...props,
        ...connectProps,
      });
    },
    connectAsync: async ({ ...props }) => {
      return await connectAsync({
        ...props,
        ...connectProps,
      });
    },
    connectors,
    ...rest,
  };
}
