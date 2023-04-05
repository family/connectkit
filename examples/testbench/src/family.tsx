import { wallets } from 'connectkit';

export const familyStaging = {
  ...wallets.family(),
  id: 'familyStaging',
  name: 'Family Staging',
  createUri: (uri: string) => {
    return `familyStaging://wc?uri=${encodeURIComponent(uri)}`;
  },
};
