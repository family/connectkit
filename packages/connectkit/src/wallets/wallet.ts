import { ReactNode } from 'react';

export type WalletProps = {
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
