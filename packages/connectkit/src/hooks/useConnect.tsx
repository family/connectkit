import { useConnect as wagmiUseConnect } from 'wagmi';
import { useContext } from '../components/ConnectKit';
import { useLastConnector } from './useLastConnector';

export function useConnect(...props) {
  const context = useContext();

  const connectProps = {
    chainId: context.options?.initialChainId,
  };

  const { updateLastConnectorId } = useLastConnector();

  const { connect, connectAsync, connectors } = wagmiUseConnect({
    onError: (err) => {
      if (err.message) {
        if (err.message !== 'User rejected request') {
          context.debug(err.message, err);
        }
      } else {
        context.debug(`Could not connect. See console for more details.`, err);
      }
    },
    onSuccess(data: any) {
      updateLastConnectorId(data?.connector?.id ?? '');
    },
    ...props,
  });

  return {
    connect: async ({ ...props }) => {
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
  };
}
