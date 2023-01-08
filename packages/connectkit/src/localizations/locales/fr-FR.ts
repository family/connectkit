import { LocaleProps } from './';

const frFR: LocaleProps = {
  connectWallet: 'Connecter le portefeuille',
  disconnect: 'Déconnecter',
  connected: 'Connecté',
  wrongNetwork: 'Réseau incorrect',
  switchNetworks: 'Changer de réseau',
  chainNetwork: 'Réseau {{ CHAIN }}',
  copyToClipboard: 'Copier dans le presse-papiers',
  copyCode: 'Copier le code',
  moreInformation: 'Plus d’informations',
  back: 'Retour',
  close: 'Fermer',
  or: 'ou',
  more: 'Plus',
  tryAgain: 'Réessayer',
  tryAgainQuestion: 'Réessayer ?',
  dontHaveTheApp: 'Vous n’avez pas l’application ?',
  scanTheQRCode: 'Scannez le code QR',
  useWalletConnectModal: 'Utiliser la modale WalletConnect',
  useModal: 'Utiliser la modale',
  installTheExtension: 'Installer l’extension',
  getWalletName: 'Obtenez {{ CONNECTORNAME }}',
  otherWallets: 'Autres portefeuilles',
  learnMore: 'En savoir plus',
  getWallet: 'Obtenir un portefeuille',
  approveInWallet: 'Approuver dans le portefeuille',
  confirmInWallet: 'Confirmer dans le portefeuille',
  awaitingConfirmation: 'En attente de confirmation',
  signIn: 'Se connecter',
  signOut: 'Se déconnecter',
  signedIn: 'Connecté',
  signedOut: 'Déconnecté',
  walletNotConnected: 'Portefeuille non connecté',

  warnings_walletSwitchingUnsupported: `Votre portefeuille ne prend pas en charge le changement de réseau à partir de cette application.`,
  warnings_walletSwitchingUnsupportedResolve: `Essayez plutôt de changer de réseau à partir de votre portefeuille.`,
  warnings_chainUnsupported: `Cette application ne prend pas en charge le réseau connecté actuel.`,
  warnings_chainUnsupportedResolve: `Changez ou déconnectez-vous pour continuer.`,

  onboardingScreen_heading: `Obtenez un portefeuille`,
  onboardingScreen_h1: `Commencez à explorer le Web3`,
  onboardingScreen_p: `Votre portefeuille est la porte d'entrée vers tout ce qui concerne l'Ethereum, la technologie magique qui permet d'explorer le Web3.`,
  onboardingScreen_ctaText: `Choisissez votre premier portefeuille`,
  onboardingScreen_ctaUrl: `https://ethereum.org/fr/wallets/find-wallet/`,

  aboutScreen_heading: `À propos des portefeuilles`,
  aboutScreen_a_h1: `Pour vos actifs numériques`,
  aboutScreen_a_p: `Les portefeuilles vous permettent d'envoyer, de recevoir, de stocker et d'interagir avec des actifs numériques tels que des NFT et d'autres jetons Ethereum.`,
  aboutScreen_b_h1: `Une meilleure façon de se connecter`,
  aboutScreen_b_p: `Avec les applications modernes, votre portefeuille peut s'utiliser pour vous connecter facilement, au lieu d'avoir à mémoriser un mot de passe.`,
  aboutScreen_c_h1: `Explorez le monde du Web3`,
  aboutScreen_c_p: `Votre portefeuille est un utilitaire essentiel qui vous permet d'explorer et de participer au monde en évolution rapide du Web3.`,
  aboutScreen_ctaText: `En savoir plus`,
  aboutScreen_ctaUrl: `https://ethereum.org/fr/wallets/`,

  connectorsScreen_heading: `Connectez le portefeuille`,
  connectorsScreen_newcomer: `Je n’ai pas de portefeuille`,
  connectorsScreen_h1: `Qu’est-ce qu’un portefeuille ?`,
  connectorsScreen_p: `Les portefeuilles s'utilisent pour envoyer, recevoir et stocker des actifs numériques. La connexion d'un portefeuille vous permet d'interagir avec les applications.`,

  mobileConnectorsScreen_heading: `Choisissez le portefeuille`,

  scanScreen_heading: `Scannez avec le téléphone`,
  scanScreen_heading_withConnector: `Scannez avec {{ CONNECTORNAME }}`,
  scanScreen_tooltip_walletConnect: `Ouvrez un portefeuille pris en charge par WalletConnect [WALLETCONNECTLOGO] pour scanner`,
  scanScreen_tooltip_default: `Ouvrez {{ CONNECTORNAME }} sur votre téléphone mobile pour scanner`,

  downloadAppScreen_heading: `Obtenez {{ CONNECTORNAME }}`,
  downloadAppScreen_iosAndroid: `Scannez avec l'appareil photo de votre téléphone pour le télécharger sur iOS ou Android.`,
  downloadAppScreen_ios: `Scannez avec l'appareil photo de votre téléphone pour le télécharger sur iOS.`,
  downloadAppScreen_android: `Scannez avec l'appareil photo de votre téléphone pour le télécharger sur Android.`,

  injectionScreen_unavailable_h1: `Navigateur non pris en charge`,
  injectionScreen_unavailable_p: `Pour connecter votre portefeuille {{ CONNECTORSHORTNAME }}, installez l’extension sur {{ SUGGESTEDEXTENSIONBROWSER }}.`,

  injectionScreen_install_h1: `Installez {{ CONNECTORNAME }}`,
  injectionScreen_install_p: `Pour connecter votre portefeuille {{ CONNECTORSHORTNAME }}, installez l’extension de navigateur.`,

  injectionScreen_connecting_h1: `Demande de connexion`,
  injectionScreen_connecting_p: `Ouvrez l’extension de navigateur {{ CONNECTORSHORTNAME }} pour connecter votre portefeuille.`,
  injectionScreen_connecting_injected_h1: `Demande de connexion`,
  injectionScreen_connecting_injected_p: `Acceptez la demande via votre portefeuille pour vous connecter à cette application.`,

  injectionScreen_connected_h1: `Déjà connecté`,
  injectionScreen_connected_p: `Vous pouvez maintenant fermer ce pop-up`,

  injectionScreen_rejected_h1: `Demande annulée`,
  injectionScreen_rejected_p: `Vous avez annulé la demande. Cliquez ci-dessus pour réessayer.`,

  injectionScreen_failed_h1: `Échec de la connexion`,
  injectionScreen_failed_p: `Malheureusement, un problème est survenu. Veuillez réessayer de vous connecter.`,

  injectionScreen_notconnected_h1: `Connectez-vous à {{ CONNECTORNAME }}`,
  injectionScreen_notconnected_p: `Pour continuer, veuillez vous connecter à votre extension {{ CONNECTORNAME }} .`,

  profileScreen_heading: 'Connecté',

  switchNetworkScreen_heading: 'Changer de réseau',

  signInWithEthereumScreen_tooltip:
    'Vous n’êtes pas connecté à cette application.\n**Connectez-vous avec Ethereum** pour continuer.',
  signInWithEthereumScreen_signedOut_heading: 'Connectez-vous avec Ethereum',
  signInWithEthereumScreen_signedOut_h1:
    'Cette application souhaite vérifier que vous êtes bien le propriétaire de ce portefeuille.',
  signInWithEthereumScreen_signedOut_p: `Veuillez signer la demande de message dans votre portefeuille pour continuer.`,
  signInWithEthereumScreen_signedOut_button: 'Se connecter',

  signInWithEthereumScreen_signedIn_heading: 'Connecté avec Ethereum',
  signInWithEthereumScreen_signedIn_h1:
    'Vous avez réussi à vous identifier en tant que propriétaire de ce portefeuille.',
  signInWithEthereumScreen_signedIn_p: `La déconnexion vous obligera à vous authentifier à nouveau à l'avenir.`,
  signInWithEthereumScreen_signedIn_button: 'Se déconnecter',
};

export default frFR;
