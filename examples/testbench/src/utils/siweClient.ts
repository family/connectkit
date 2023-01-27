import { configureClientSIWE } from 'connectkit-next-siwe';

export const apiRoutePrefix = '/api/siwe';

export const siweClient = configureClientSIWE({
  apiRoutePrefix,
  statement: 'fam token wen',
});
