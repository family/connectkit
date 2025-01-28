import Openfort, { AuthPlayerResponse, Provider, ShieldAuthentication, TokenType, ShieldAuthType } from '@openfort/openfort-js';
import { ThirdPartyOAuthProvider } from '@openfort/openfort-js';

// this is only for testing purposes
const openfort = new Openfort({
  baseConfiguration: {
    publishableKey: "FAKE PUBLISHABLE KEY",
  },
});

class OpenfortService {
  chainId: number;

  constructor(chainId: number) {
    this.chainId = chainId;
  }

  async authenticateWithThirdPartyProvider(identityToken: string): Promise<AuthPlayerResponse> {
    try {
      return await openfort.authenticateWithThirdPartyProvider({
        provider: ThirdPartyOAuthProvider.FIREBASE,
        token: identityToken,
        tokenType: TokenType.ID_TOKEN
      });
    } catch (error) {
      console.error('Error authenticating with Openfort:', error);
      throw error;
    }
  }
  getEvmProvider(): Provider {
    return openfort.getEthereumProvider({ policy: process.env.NEXT_PUBLIC_POLICY_ID });
  }
  async getEmbeddedState() {
    const state = await openfort.getEmbeddedState();
    return state;
  }

  async getEncryptionSession(): Promise<string> {
    const resp = await fetch(`/api/protected-create-encryption-session`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!resp.ok) {
      throw new Error("Failed to create encryption session");
    }

    const respJSON = await resp.json();
    return respJSON.session;
  }

  async setAutomaticRecoveryMethod(identityToken: string) {
    try {
      const shieldAuth: ShieldAuthentication = {
        auth: ShieldAuthType.OPENFORT,
        token: identityToken,
        authProvider: ThirdPartyOAuthProvider.FIREBASE,
        tokenType: TokenType.ID_TOKEN,
        encryptionSession: await this.getEncryptionSession(),
      };
      await openfort.configureEmbeddedSigner(this.chainId, shieldAuth);
    } catch (error) {
      console.error('Error authenticating with Openfort:', error);
      throw error;
    }
  }

  async setPasswordRecoveryMethod(identityToken: string, pin: string) {
    try {
      const shieldAuth: ShieldAuthentication = {
        auth: ShieldAuthType.OPENFORT,
        token: identityToken,
        authProvider: ThirdPartyOAuthProvider.FIREBASE,
        tokenType: TokenType.ID_TOKEN,
        encryptionSession: await this.getEncryptionSession(),
      };
      await openfort.configureEmbeddedSigner(this.chainId, shieldAuth, pin);
    } catch (error) {
      console.error('Error authenticating with Openfort:', error);
      throw error;
    }
  }
  async logout() {
    try {
      await openfort.logout();
    } catch (error) {
      console.error('Error logging out with Openfort:', error);
      throw error;
    }
  }
}

export default OpenfortService;
