import { LocaleProps } from './';

const esES: LocaleProps = {
  connectWallet: 'Conecta una cartera',
  disconnect: 'Desconectar',
  connected: 'Conectado',
  wrongNetwork: 'Red incorrecta',
  switchNetworks: 'Cambio de red',
  chainNetwork: 'Red {{ CHAIN }}',
  copyToClipboard: 'Copiar al portapapeles',
  copyCode: 'Copiar código',
  moreInformation: 'Más información',
  back: 'Atrás',
  close: 'Cerrar',
  or: 'o',
  more: 'Más',
  tryAgain: 'Intentar de nuevo',
  tryAgainQuestion: '¿Intentar de nuevo?',
  dontHaveTheApp: '¿No tienes la aplicación?',
  scanTheQRCode: 'Escanea el código QR',
  useWalletConnectModal: 'Utilizar WalletConnect Modal',
  useModal: 'Utilizar Modal',
  installTheExtension: 'Instalar la extensión',
  getWalletName: 'Obtén {{ CONNECTORNAME }}',
  otherWallets: 'Otras carteras',
  learnMore: 'Más información',
  getWallet: 'Obtén una cartera',
  approveInWallet: 'Aprobar en la cartera',
  confirmInWallet: 'Confirmar en la cartera',
  awaitingConfirmation: 'A la espera de confirmación',
  signIn: 'Iniciar sesión',
  signOut: 'Cerrar sesión',
  signedIn: 'Sesión iniciada',
  signedOut: 'Sesión cerrada',
  walletNotConnected: 'Cartera no conectada',

  warnings_walletSwitchingUnsupported: `Tu cartera no permite cambiar de red desde esta aplicación.`,
  warnings_walletSwitchingUnsupportedResolve: `Prueba a cambiar de red desde tu cartera.`,
  warnings_chainUnsupported: `Esta aplicación no es compatible con la red conectada actualmente.`,
  warnings_chainUnsupportedResolve: `Cambia o desconecta para continuar.`,

  onboardingScreen_heading: `Obtén una cartera`,
  onboardingScreen_h1: `Comienza a explorar la Web3`,
  onboardingScreen_p: `Tu cartera es el portal de acceso a todo lo relacionado con Ethereum, la tecnología mágica que permite explorar la Web3.`,
  onboardingScreen_ctaText: `Elige tu primera cartera`,
  onboardingScreen_ctaUrl: `https://ethereum.org/es/wallets/find-wallet/`,

  aboutScreen_heading: `Acerca de las carteras`,
  aboutScreen_a_h1: `Para tus activos digitales`,
  aboutScreen_a_p: `Las carteras te permiten enviar, recibir, almacenar e interactuar con activos digitales como los NFT y otros tokens de Ethereum.`,
  aboutScreen_b_h1: `Una manera mejor de iniciar sesión`,
  aboutScreen_b_p: `Con las aplicaciones modernas, puedes utilizar tu cartera para iniciar sesión fácilmente, en vez de tener que recordar una contraseña.`,
  aboutScreen_c_h1: `Explora el mundo de la Web3`,
  aboutScreen_c_p: `Tu cartera es una herramienta esencial que te permite explorar y participar en el mundo en rápida evolución de la Web3.`,
  aboutScreen_ctaText: `Más información`,
  aboutScreen_ctaUrl: `https://ethereum.org/es/wallets/`,

  connectorsScreen_heading: `Conecta una cartera`,
  connectorsScreen_newcomer: `No tengo una cartera`,
  connectorsScreen_h1: `¿Qué es una cartera?`,
  connectorsScreen_p: `Las carteras se utilizan para enviar, recibir y almacenar activos digitales. Si conectas una cartera, podrás interactuar con las aplicaciones.`,

  mobileConnectorsScreen_heading: `Elige una cartera`,

  scanScreen_heading: `Escanea con el teléfono`,
  scanScreen_heading_withConnector: `Escanea con {{ CONNECTORNAME }}`,
  scanScreen_tooltip_walletConnect: `Abre una cartera compatible con WalletConnect [WALLETCONNECTLOGO] para escanear`,
  scanScreen_tooltip_default: `Abre {{ CONNECTORNAME }} en tu teléfono móvil para escanear`,

  downloadAppScreen_heading: `Obtén {{ CONNECTORNAME }}`,
  downloadAppScreen_iosAndroid: `Escanea con la cámara de tu teléfono para descargarla en iOS o Android.`,
  downloadAppScreen_ios: `Escanea con la cámara de tu teléfono para descargarla en iOS.`,
  downloadAppScreen_android: `Escanea con la cámara de tu teléfono para descargarla en Android.`,

  injectionScreen_unavailable_h1: `Navegador no compatible`,
  injectionScreen_unavailable_p: `Para conectar tu cartera de {{ CONNECTORSHORTNAME }}, instala la extensión en {{ SUGGESTEDEXTENSIONBROWSER }}.`,

  injectionScreen_install_h1: `Instala {{ CONNECTORNAME }}`,
  injectionScreen_install_p: `Para conectar tu cartera de {{ CONNECTORSHORTNAME }}, instala la extensión del navegador.`,

  injectionScreen_connecting_h1: `Solicitud de conexión`,
  injectionScreen_connecting_p: `Abre la extensión del navegador de {{ CONNECTORSHORTNAME }}  para conectar tu cartera.`,
  injectionScreen_connecting_injected_h1: `Solicitud de conexión`,
  injectionScreen_connecting_injected_p: `Acepta la solicitud a través de tu cartera para conectarte a esta aplicación.`,

  injectionScreen_connected_h1: `Ya conectada`,
  injectionScreen_connected_p: `Ya puedes cerrar esta ventana emergente`,

  injectionScreen_rejected_h1: `Solicitud cancelada`,
  injectionScreen_rejected_p: `Has cancelado la solicitud. Haz clic arriba para intentarlo de nuevo.`,

  injectionScreen_failed_h1: `Error de conexión`,
  injectionScreen_failed_p: `Lo sentimos, ha habido un problema. Intenta conectarte de nuevo.`,

  injectionScreen_notconnected_h1: `Inicia sesión en {{ CONNECTORNAME }}`,
  injectionScreen_notconnected_p: `Para continuar, inicia sesión en tu extensión de {{ CONNECTORNAME }}.`,

  profileScreen_heading: 'Conectado',

  switchNetworkScreen_heading: 'Cambio de red',

  signInWithEthereumScreen_tooltip:
    'No has iniciado sesión en esta aplicación.\n**Inicia sesión con Ethereum** para continuar.',
  signInWithEthereumScreen_signedOut_heading: 'Inicia sesión con Ethereum',
  signInWithEthereumScreen_signedOut_h1:
    'Esta aplicación desea verificar que eres el propietario de esta cartera.',
  signInWithEthereumScreen_signedOut_p: `Firma la solicitud de mensaje en tu cartera para continuar.`,
  signInWithEthereumScreen_signedOut_button: 'Iniciar sesión',

  signInWithEthereumScreen_signedIn_heading: 'Sesión iniciada con Ethereum',
  signInWithEthereumScreen_signedIn_h1:
    'Te has verificado correctamente como propietario de esta cartera.',
  signInWithEthereumScreen_signedIn_p: `Si cierras la sesión, tendrás que volver a autenticarte más adelante.`,
  signInWithEthereumScreen_signedIn_button: 'Cerrar sesión',
};

export default esES;
