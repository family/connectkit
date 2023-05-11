import { configureServerSideSIWE } from 'connectkit-next-siwe';

export const siweServer = configureServerSideSIWE({
  options: {
    afterLogout: async () => console.log('afterLogout'),
    afterNonce: async () => console.log('afterNonce'),
    afterSession: async () => console.log('afterSession'),
    afterVerify: async () => console.log('afterVerify'),
  },
});
