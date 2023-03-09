import { LocaleProps } from './';

const ptBR: LocaleProps = {
  connectWallet: 'Conectar carteira',
  disconnect: 'Desconectar',
  connected: 'Conectado',
  wrongNetwork: 'Rede incorreta',
  switchNetworks: 'Alternar rede',
  chainNetwork: 'Rede {{ CHAIN }}',
  copyToClipboard: 'Copiar para a área de transferência',
  copyCode: 'Copiar código',
  moreInformation: 'Mais informações',
  back: 'Voltar',
  close: 'Fechar',
  or: 'ou',
  more: 'Mais',
  tryAgain: 'Tentar novamente',
  tryAgainQuestion: 'Tentar novamente?',
  dontHaveTheApp: 'Não tem o aplicativo?',
  scanTheQRCode: 'Escaneie o código QR',
  useWalletConnectModal: 'Use o modal do WalletConnect',
  useModal: 'Usar modal',
  installTheExtension: 'Instale a extensão',
  getWalletName: 'Obter {{ CONNECTORNAME }}',
  otherWallets: 'Outras carteiras',
  learnMore: 'Saiba mais',
  getWallet: 'Obtenha uma carteira',
  approveInWallet: 'Aprovar na carteira',
  confirmInWallet: 'Confirmar na carteira',
  awaitingConfirmation: 'Aguardando confirmação',
  signIn: 'Entrar',
  signOut: 'Sair',
  signedIn: 'Conectado',
  signedOut: 'Desconectado',
  walletNotConnected: 'Carteira não conectada',

  warnings_walletSwitchingUnsupported: `A sua carteira não permite a troca de rede a partir deste aplicativo.`,
  warnings_walletSwitchingUnsupportedResolve: `Tente trocar de rede de dentro da sua carteira.`,

  warnings_chainUnsupported: `Este aplicativo não é compatível com a rede conectada.`,
  warnings_chainUnsupportedResolve: `Altere a rede ou desconecte para continuar.`,

  onboardingScreen_heading: `Obtenha uma carteira`,
  onboardingScreen_h1: `Comece a explorar a Web3`,
  onboardingScreen_p: `Sua carteira é a porta de entrada para todas as coisas Ethereum, a tecnologia mágica que torna possível explorar a web3.`,
  onboardingScreen_ctaText: `Escolha sua primeira carteira`,
  onboardingScreen_ctaUrl: `https://ethereum.org/pt-br/wallets/find-wallet/`,

  aboutScreen_heading: `Sobre as carteiras`,
  aboutScreen_a_h1: `Para seus ativos digitais`,
  aboutScreen_a_p: `As carteiras permitem que você envie, receba, armazene e interaja com ativos digitais como NFTs e outros tokens Ethereum.`,
  aboutScreen_b_h1: `Uma maneira melhor de fazer login`,
  aboutScreen_b_p: `Com aplicativos modernos, sua carteira pode ser usada como uma maneira fácil de fazer login, em vez de ter que lembrar uma senha.`,
  aboutScreen_c_h1: `Explore o mundo da Web3`,
  aboutScreen_c_p: `Sua carteira é uma utilidade essencial que permite explorar e participar do mundo em rápida evolução da Web3.`,
  aboutScreen_ctaText: `Saiba mais`,
  aboutScreen_ctaUrl: `https://ethereum.org/pt-br/wallets/`,

  connectorsScreen_heading: `Conectar carteira`,
  connectorsScreen_newcomer: `Eu não tenho uma carteira`,
  connectorsScreen_h1: `O que é uma carteira?`,
  connectorsScreen_p: `As carteiras são usadas para enviar, receber e armazenar ativos digitais. A conexão de uma carteira permite que você interaja com aplicativos.`,

  mobileConnectorsScreen_heading: `Escolha uma carteira`,

  scanScreen_heading: `Escanear com o celular`,
  scanScreen_heading_withConnector: `Escanear com o {{ CONNECTORNAME }}`,
  scanScreen_tooltip_walletConnect: `Abra uma carteira compatível \ncom o WalletConnect [WALLETCONNECTLOGO] para escanear`,
  scanScreen_tooltip_default: `Abra o {{ CONNECTORNAME }} no \nseu celular para escanear`,

  downloadAppScreen_heading: `Obter {{ CONNECTORNAME }}`,
  downloadAppScreen_iosAndroid: `Escaneie com a câmera do seu celular para baixar no iOS ou Android.`,
  downloadAppScreen_ios: `Escaneie com a câmera do seu celular para baixar no iOS.`,
  downloadAppScreen_android: `Escaneie com a câmera do seu celular para baixar no Android.`,

  injectionScreen_unavailable_h1: `Navegador não compatível`,
  injectionScreen_unavailable_p: `Para conectar sua carteira {{ CONNECTORSHORTNAME }},\ninstale a extensão no {{ SUGGESTEDEXTENSIONBROWSER }}.`,

  injectionScreen_install_h1: `Instalar {{ CONNECTORNAME }}`,
  injectionScreen_install_p: `Para conectar sua carteira {{ CONNECTORSHORTNAME }},\ninstale a extensão do navegador`,

  injectionScreen_connecting_h1: `Solicitando conexão`,
  injectionScreen_connecting_p: `Abra a extensão do navegador do {{ CONNECTORSHORTNAME }} \npara conectar a sua carteira.`,

  injectionScreen_connecting_injected_h1: `Solicitando conexão`,
  injectionScreen_connecting_injected_p: `Aceite a solicitação por meio de sua carteira para se conectar a este aplicativo.`,

  injectionScreen_connected_h1: `Já conectado`,
  injectionScreen_connected_p: `Agora você já pode fechar esta janela`,

  injectionScreen_rejected_h1: `Solicitação cancelada`,
  injectionScreen_rejected_p: `Você cancelou a solicitação.\nClique acima para tentar novamente.`,

  injectionScreen_failed_h1: `A conexão falhou`,
  injectionScreen_failed_p: `Desculpe, ocorreu um erro.\nPor favor, tente conectar novamente.`,

  injectionScreen_notconnected_h1: `Faça login no {{ CONNECTORNAME }}`,
  injectionScreen_notconnected_p: `Para continuar, faça login na sua extensão do {{ CONNECTORNAME }}.`,

  profileScreen_heading: 'Conectado',

  switchNetworkScreen_heading: 'Alternar rede',

  signInWithEthereumScreen_tooltip: 'Você não está conectado a este aplicativo.\n**Entre com Ethereum** para continuar.',
  signInWithEthereumScreen_signedOut_heading: 'Entrar com Ethereum',
  signInWithEthereumScreen_signedOut_h1: 'Este aplicativo gostaria de verificar você \n como o proprietário desta carteira.',
  signInWithEthereumScreen_signedOut_p: `Por favor, assine o pedido de mensagem \n em sua carteira para continuar.`,
  signInWithEthereumScreen_signedOut_button: 'Entrar',

  signInWithEthereumScreen_signedIn_heading: 'Conectado com Ethereum',
  signInWithEthereumScreen_signedIn_h1: 'Você se verificou com sucesso \n como o proprietário desta carteira',
  signInWithEthereumScreen_signedIn_p: `Se sair, será necessário que você \n autentique novamente no futuro.`,
  signInWithEthereumScreen_signedIn_button: 'Sair'
};

export default ptBR;
