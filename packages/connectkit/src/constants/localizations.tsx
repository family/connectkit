import React from 'react';
import Logos from '../assets/logos';

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
  let result = textArray.map((str, i) => {
    if (/(\*\*.*\*\*)/g.test(str)) {
      return <strong key={i}>{str.replaceAll('**', '')}</strong>;
    }
    return `${str}`;
  });

  return result.map((r) => {
    if (typeof r === 'string') {
      return r.split(/(\[WALLETCONNECTLOGO\])/g).map((s, i) => {
        if (s === '[WALLETCONNECTLOGO]') {
          return (
            <span className="ck-tt-logo" key={i}>
              <Logos.WalletConnect />
            </span>
          );
        }
        return s;
      });
    }
    return r;
  });
};
export const replaceMarkdown = (markdownText: string) => {
  let text: any = markdownText;
  text = text.split('\n');
  text = text.map((t: string, i: number) => {
    return (
      <React.Fragment key={i}>
        {wrapTags(t)}
        {i < text.length - 1 && <br />}
      </React.Fragment>
    );
  });
  return text;
};

export const keys = {
  //appName: '{{ APPNAME }}',
  connectorName: '{{ CONNECTORNAME }}',
  connectorShortName: '{{ CONNECTORSHORTNAME }}',
  suggestedExtensionBrowser: '{{ SUGGESTEDEXTENSIONBROWSER }}',
  walletConnectLogo: '{{ WALLETCONNECTLOGO }}',
};

/**
 * Only markdown currently supported is **bold** highlighting.
 * If more is needed I suggest using a library
 */
export default {
  en: {
    connectWallet: 'Connect Wallet',
    disconnect: 'Disconnect',
    connected: 'Connected',
    wrongNetwork: 'Wrong Network',
    switchNetworks: 'Switch Networks',
    chainNetwork: '{{ CHAIN }} Network',
    copyToClipboard: 'Copy to Clipboard',
    copyCode: 'Copy Code',
    moreInformation: 'More Information',
    back: 'Back',
    close: 'Close',
    or: 'or',
    more: 'More',
    tryAgain: 'Try Again',
    tryAgainQuestion: 'Try Again?',
    dontHaveTheApp: "Don't have the app?",
    scanTheQRCode: 'Scan the QR code',
    useWalletConnectModal: 'Use WalletConnect Modal',
    useModal: 'Use Modal',
    installTheExtension: 'Install the Extension',
    getWalletName: 'Get {{ WALLETNAME }}',
    otherWallets: 'Other Wallets',
    learnMore: 'Learn More',
    getWallet: 'Get a Wallet',
    approveInWallet: 'Approve in Wallet',
    confirmInWallet: 'Confirm in Wallet',
    awaitingConfirmation: 'Awaiting Confirmation',
    signIn: 'Sign In',
    signOut: 'Sign Out',
    signedIn: 'Signed In',
    signedOut: 'Signed Out',
    walletNotConnected: 'Wallet Not Connected',
    warnings: {
      walletSwitchingUnsupported: `Your wallet does not support switching networks from this app.`,
      walletSwitchingUnsupportedResolve: `Try switching networks from within your wallet instead.`,
      chainUnsupported: `This app does not support the current connected network.`,
      chainUnsupportedResolve: `Switch or disconnect to continue.`,
    },
    onboardingScreen: {
      heading: `Get a Wallet`,
      h1: `Start Exploring Web3`,
      p: `Your wallet is the gateway to all things Ethereum, the magical technology that makes it possible to explore web3.`,
      ctaText: `Choose Your First Wallet`,
      ctaUrl: `https://ethereum.org/en/wallets/find-wallet/#main-content`,
    },
    aboutScreen: {
      heading: `About Wallets`,
      a_h1: `For your digital assets`,
      a_p: `Wallets let you send, receive, store, and interact with digital assets like NFTs and other Ethereum tokens.`,
      b_h1: `A better way to login`,
      b_p: `With modern apps, your wallet can be used as an easy way to login, instead of having to remember a password.`,
      c_h1: `Explore the world of web3`,
      c_p: `Your wallet is an essential utility that lets you explore and participate in the fast evolving world of web3.`,
      ctaText: `Learn More`,
      ctaUrl: `https://docs.ethhub.io/using-ethereum/wallets/intro-to-ethereum-wallets/`,
    },
    connectorsScreen: {
      heading: `Connect Wallet`,
      newcomer: `I don’t have a wallet`,
      h1: `What is a wallet?`,
      p: `Wallets are used to send, receive, and store digital assets. Connecting a wallet lets you interact with apps.`,
    },
    mobileConnectorsScreen: {
      heading: `Choose Wallet`,
    },
    scanScreen: {
      heading: `Scan with Phone`,
      tooltip: {
        walletConnect: `Open a [WALLETCONNECTLOGO] WalletConnect \nsupported wallet to scan`,
        default: `Open {{ CONNECTORNAME }} on \nyour mobile phone to scan`,
      },
    },
    downloadAppScreen: {
      heading: `Get {{ CONNECTORNAME }}`,
      iosAndroid: `Scan with your phone camera to download on iOS or Android.`,
      ios: `Scan with your phone camera to download on iOS.`,
      android: `Scan with your phone camera to download Android.`,
    },
    injectionScreen: {
      unavailable: {
        h1: `Unsupported Browser`,
        p: `To connect your ${keys.connectorShortName} wallet,\ninstall the extension on ${keys.suggestedExtensionBrowser}.`,
        p: `To connect your {{ CONNECTORSHORTNAME }} wallet,\ninstall the extension on {{ SUGGESTEDEXTENSIONBROWSER }}.`,
      },
      install: {
        h1: `Install {{ CONNECTORNAME }}`,
        p: `To connect your {{ CONNECTORSHORTNAME }} wallet,\ninstall the browser extension.`,
      },
      connecting: {
        h1: `Requesting Connection`,
        p: `Open the {{ CONNECTORSHORTNAME }} browser \nextension to connect your wallet.`,
        injected_h1: `Requesting Connection`,
        injected_p: `Accept the request through your wallet to connect to this app.`,
      },
      connected: {
        h1: `Already Connected`,
        p: `It is now okay to close this popup`,
      },
      rejected: {
        h1: `Request Cancelled`,
        p: `You cancelled the request.\nClick above to try again.`,
      },
      failed: {
        h1: `Connection Failed`,
        p: `Sorry, something went wrong.\nPlease try connecting again.`,
      },
      notconnected: {
        h1: `Login to {{ CONNECTORNAME }}`,
        p: `To continue, please login to your {{ CONNECTORNAME }} extension.`,
      },
    },
    profileScreen: {
      heading: 'Connected',
    },
    switchNetworkScreen: {
      heading: 'Switch Networks',
    },
    signInWithEthereumScreen: {
      tooltip:
        'You’re not signed in to this app. **Sign In with Ethereum** to continue.',
      signedOut: {
        heading: 'Sign In With Ethereum',
        h1: 'This app would like to verify you \n as the owner of this wallet.',
        p: `Please sign the message request \n in your wallet to continue.`,
        button: 'Sign In',
      },
      signedIn: {
        heading: 'Signed In With Ethereum',
        h1: 'You successfully verified yourself \n as the owner of this wallet.',
        p: `Signing out will require you to \n authenticate again in the future.`,
        button: 'Sign Out',
      },
    },
  },
};
