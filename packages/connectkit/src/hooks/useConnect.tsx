import { useConnect as wagmiUseConnect } from 'wagmi';
import { useContext } from '../components/ConnectKit';

export function useConnect(...props) {
  const context = useContext();

  const { connect, connectAsync, connectors, ...rest } = wagmiUseConnect({
    onError(err) {
      if (err.message) {
        if (err.message !== 'User rejected request') {
          console.log(err.message, err);
        }
      } else {
        console.log(`Could not connect.`, err);
      }
    },
    ...props,
  });

  return {
    connect: ({ props }) => {
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
