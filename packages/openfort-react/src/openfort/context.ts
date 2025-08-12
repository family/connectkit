import { createContext } from 'react';
import { ContextValue } from './OpenfortProvider';

export const Context = createContext<ContextValue | null>(null);
