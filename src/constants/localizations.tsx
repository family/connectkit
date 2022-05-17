import React from 'react';

export const localize = (text: string, replacements?: any[string]) => {
  let parsedText: string = text;
  if (replacements) {
    Object.keys(replacements).forEach((key) => {
      parsedText = parsedText.replaceAll(
        `{{ ${key} }}`,
        replacements[key as keyof typeof replacements]
      );
    });
  }
  return replaceMarkdown(parsedText);
};

const wrapTags = (text: string) => {
  const textArray = text.split(/(\*\*[^\*]*\*\*)/g);
  return textArray.map((str, i) => {
    if (/(\*\*.*\*\*)/g.test(str)) {
      return <strong key={i}>{str.replaceAll('**', '')}</strong>;
    }
    return `${str}`;
  });
};
export const replaceMarkdown = (markdownText: string) => {
  let text: any = markdownText;
  text = text.split('\n');
  text = text.map((t: string, i: number) => {
    return (
      <React.Fragment key={i}>
        {wrapTags(t)}
        {i < text.length && <br />}
      </React.Fragment>
    );
  });
  return text;
};

export const keys = {
  connectorName: '{{ CONNECTORNAME }}',
  suggestedExtensionBrowser: '{{ SUGGESTEDEXTENSIONBROWSER }}',
};

/**
 * Only markdown currently supported is **bold** highlighting.
 * If more is needed I suggest using a library
 */
export default {
  en: {
    connectorsScreen: {
      heading: `Connect Wallet`,
      newcomer: `I don't have a wallet`,
    },
    onboardingScreen: {
      heading: `Get a Wallet`,
      h1: `Start Exploring Web3`,
      p: `Your wallet is the gateway to all things Ethereum, the magical technology that makes it possible to explore web3.`,
      ctaText: `Choose Your First Wallet`,
      ctaUrl: `https://ethereum.org/en/wallets/find-wallet/#main-content`,
    },
    scanScreen: {
      heading: `Scan with Phone`,
      tooltip: {
        walletConnect: `Open your preferred wallet and scan the QR code`,
        default: `Open **${keys.connectorName}** on your mobile phone and scan`,
      },
    },
    downloadAppScreen: {
      heading: `Get ${keys.connectorName}`,
      iosAndroid: `Scan with your phone camera to download on **iOS** or **Android**.`,
      ios: `Scan with your phone camera to download on **iOS**.`,
      android: `Scan with your phone camera to download **Android**.`,
    },
    injectionScreen: {
      unavailable: {
        h1: `Unsupported Browser`,
        p: `To connect your ${keys.connectorName} wallet,\ninstall the extension on ${keys.suggestedExtensionBrowser}.`,
      },
      install: {
        h1: `Install ${keys.connectorName}`,
        p: `To connect your ${keys.connectorName} wallet,\ninstall the browser extension.`,
      },
      connecting: {
        h1: `Requesting Connection`,
        p: `Open the ${keys.connectorName} browser extension to connect your wallet.`,
      },
      expiring: {
        requestWillExpiryIn: `This request will expire in`,
      },
      connected: {
        h1: `Already Connected`,
        p: `It is now okay to close this popup`,
      },
      rejected: {
        h1: `Request Cancelled`,
        p: `You cancelled the connection request.\nClick above to try again.`,
      },
      failed: {
        h1: `Connection Failed`,
        p: `Sorry, the request expired.\nPlease try connecting again.`,
      },
      notconnected: {
        h1: `Login to ${keys.connectorName}`,
        p: `To continue, please login to your ${keys.connectorName} extension.`,
      },
    },
    profileScreen: {
      heading: 'Connected',
    },
  },
  /**
   * TODO: These are just Google Translated for testing
   */
  fr: {
    connectorsScreen: {
      heading: `Connecter le portefeuille`,
      newcomer: `je n'ai pas de portefeuille`,
    },
    onboardingScreen: {
      heading: `Obtenez un portefeuille`,
      h1: `Commencez à explorer Web3`,
      p: `Votre portefeuille est la passerelle vers tout ce qui concerne Ethereum, la technologie magique qui permet d'explorer le Web3.`,
      ctaText: `Choisissez votre premier portefeuille`,
      ctaUrl: `https://ethereum.org/fr/wallets/find-wallet/#main-content`,
    },
    scanScreen: {
      heading: `Numériser avec le téléphone`,
      tooltip: {
        walletConnect: `Ouvrez votre portefeuille préféré et scannez le code QR`,
        default: `Ouvrez **${keys.connectorName}** sur votre téléphone portable et scannez`,
      },
    },
    downloadAppScreen: {
      heading: `Obtenir ${keys.connectorName}`,
      iosAndroid: `Numérisez avec l'appareil photo de votre téléphone pour télécharger sur **iOS** ou **Android**.`,
      ios: `Numérisez avec l'appareil photo de votre téléphone pour télécharger sur **iOS**.`,
      android: `Numérisez avec l'appareil photo de votre téléphone pour télécharger sur **Android**.`,
    },
    injectionScreen: {
      unavailable: {
        h1: `Navigateur non supporté`,
        p: `Pour connecter votre portefeuille ${keys.connectorName},\ninstallez l'extension sur ${keys.suggestedExtensionBrowser}.`,
      },
      install: {
        h1: `Installez ${keys.connectorName}`,
        p: `Pour connecter votre portefeuille ${keys.connectorName},\ninstallez l'extension de navigateur.`,
      },
      connecting: {
        h1: `Demande de connexion`,
        p: `Ouvrez l'extension de navigateur ${keys.connectorName} pour connecter votre portefeuille.`,
      },
      expiring: {
        requestWillExpiryIn: `Cette requête expirera dans`,
      },
      connected: {
        h1: `Déjà connecté`,
        p: `Vous pouvez maintenant fermer cette fenêtre contextuelle`,
      },
      rejected: {
        h1: `Demande annulée`,
        p: `Vous avez annulé la demande de connexion.\nCliquez ci-dessus pour réessayer.`,
      },
      failed: {
        h1: `La connexion a échoué`,
        p: `Désolé, la demande a expiré.\nVeuillez réessayer de vous connecter.`,
      },
      notconnected: {
        h1: `Connectez-vous à ${keys.connectorName}`,
        p: `Pour continuer, veuillez vous connecter à votre extension ${keys.connectorName}.`,
      },
    },
    profileScreen: {
      heading: 'Connecté',
    },
  },
};
