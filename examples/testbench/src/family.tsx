import { Types, defaultWallets } from 'connectkit';

export const familyStaging: Types.Wallet = {
  id: 'familyStaging',
  name: 'Family Staging',
  logos: {
    default: defaultWallets.find((w) => w.id === 'family')?.logos?.default,
  },
  scannable: true,
  createUri: (uri: string) => {
    return `familyStaging://wc?uri=${encodeURIComponent(uri)}`;
  },
};
