import { configureSIWE } from 'connectkit-next-siwe';

export const siweClient = configureSIWE({
  apiRoutePrefix: '/api/siwe',
  statement: 'fam token wen',
});
