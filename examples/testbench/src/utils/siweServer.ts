import { configureServerSideSIWE } from 'connectkit-next-siwe';
import { PublicClient, createPublicClient, http } from 'viem';
import { mainnet } from 'viem/chains';

const publicClient: PublicClient = createPublicClient({
  chain: mainnet,
  transport: http(),
});

export const siweServer = configureServerSideSIWE({
  publicClient,
  options: {
    afterLogout: async () => console.log('afterLogout'),
    afterNonce: async () => console.log('afterNonce'),
    afterSession: async () => console.log('afterSession'),
    afterVerify: async () => console.log('afterVerify'),
  },
});
