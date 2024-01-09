import { ReactNode } from 'react';

/*
 * Legacy Wallets are wallets that use EIP-1193 to connect to dapps.
 */
export type LegacyWalletProps = {
  id: string;
  name: string;
  shortName?: string;
  icon: ReactNode;
  iconShape?: 'squircle' | 'circle';
  iconShouldShrink?: boolean;
  scannable?: boolean;
  installed?: boolean;
  downloadUrls?: { [key: string]: string };
  createUri?: (uri: string) => string;
};
