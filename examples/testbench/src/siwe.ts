import { configureSIWE } from 'connectkit-next-siwe';

export const siwe = configureSIWE({
  apiRoutePrefix: '/api/siwe',
  session: {
    // TODO: prefer SESSION_SECRET env var
    password: 'complex_password_at_least_32_characters_long',
  },
});
