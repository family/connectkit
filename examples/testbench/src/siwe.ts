import { configureClientSIWE } from 'connectkit-next-siwe';

export const apiRoutePrefix = '/api/siwe';

export const siwe = configureClientSIWE({ apiRoutePrefix });
