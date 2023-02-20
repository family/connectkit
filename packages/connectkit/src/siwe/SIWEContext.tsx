import { createContext } from 'react';
//import { useQuery } from 'wagmi';

export enum StatusState {
  READY = 'ready',
  LOADING = 'loading',
  SUCCESS = 'success',
  REJECTED = 'rejected',
  ERROR = 'error',
}

export type SIWESession = {
  address: string;
  chainId: number;
};

export type SIWEConfig = {
  // Required
  getNonce: () => Promise<string>;
  createMessage: (args: {
    nonce: string;
    address: string;
    chainId: number;
  }) => string;
  verifyMessage: (args: {
    message: string;
    signature: string;
  }) => Promise<boolean>;
  getSession: () => Promise<SIWESession | null>;
  signOut: () => Promise<boolean>;

  // Optional, we have default values but they can be overridden
  enabled?: boolean;
  nonceRefetchInterval?: number;
  sessionRefetchInterval?: number;
  signOutOnDisconnect?: boolean;
  signOutOnAccountChange?: boolean;
  signOutOnNetworkChange?: boolean;
};

export type SIWEContextValue = Required<SIWEConfig> & {
  // TODO: switch to exported type once wagmi is updated
  nonce: any; //ReturnType<typeof useQuery<string | null>>;
  session: any; //ReturnType<typeof useQuery<SIWESession | null>>;
  status: StatusState;
  signIn: () => Promise<SIWESession | false>;
  resetStatus: () => void;
};

export const SIWEContext = createContext<SIWEContextValue | null>(null);
