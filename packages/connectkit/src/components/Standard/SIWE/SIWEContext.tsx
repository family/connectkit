import { createContext } from 'react';
import { useQuery } from 'wagmi';

export type SIWESession = {
  address: string;
  chainId: number;
};
export enum StatusState {
  READY = 'ready',
  LOADING = 'loading',
  SUCCESS = 'success',
  REJECTED = 'rejected',
  ERROR = 'error',
}

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
  signIn: () => Promise<void>;
  // Optional, we have default values but they can be overridden
  enabled?: boolean;
  nonceRefetchInterval?: number;
  sessionRefetchInterval?: number;
  signOutOnDisconnect?: boolean;
  signOutOnAccountChange?: boolean;
  signOutOnNetworkChange?: boolean;
  status: StatusState;
};

export type SIWEContextValue = Required<SIWEConfig> & {
  // TODO: switch to exported type once wagmi is updated
  nonce: ReturnType<typeof useQuery<string | null>>;
  session: ReturnType<typeof useQuery<SIWESession | null>>;
  signOutAndRefetch: () => Promise<void>;
  signIn: () => Promise<void>;
};

export const SIWEContext = createContext<SIWEContextValue | null>(null);
