import { LocaleProps } from './';

const ptBR: LocaleProps = {
  connectWallet: 'Conectar',
  disconnect: 'Desconectar',
  connected: 'Conectado',
  wrongNetwork: 'Rede Incorreta',
  switchNetworks: 'Alterar Rede',
  chainNetwork: 'Rede {{ CHAIN }}',
  copyToClipboard: 'Copiar para a área de transferência',
  copyCode: 'Copiar Código',
  moreInformation: 'Mais Informações',
  back: 'Voltar',
  close: 'Fechar',
  or: 'ou',
  more: 'Mais',
  tryAgain: 'Tentar Novamente',
  tryAgainQuestion: 'Tentar Novamente?',
  dontHaveTheApp: 'Não tem o aplicativo?',
  scanTheQRCode: 'Escaneie o código QR',
  useWalletConnectModal: 'Use o modal do WalletConnect',
  useModal: 'Use o modal',
  installTheExtension: 'Instale a extensão',
  getWalletName: '{{ CONNECTORNAME }}',
  otherWallets: 'Outras Carteiras',
  learnMore: 'Saiba Mais',
  getWallet: 'Obter uma carteira',
  approveInWallet: 'Aprovar na carteira',
  confirmInWallet: 'Confirmar na carteira',
  awaitingConfirmation: 'Aguardando confirmação',
  signIn: 'Entrar',
  signOut: 'Sair',
  signedIn: 'Logado',
  signedOut: 'Deslogado',
  walletNotConnected: 'Carteira não conectada',

  warnings_walletSwitchingUnsupported: `A sua carteira não suporta a troca de rede.`,
  warnings_walletSwitchingUnsupportedResolve: `Tente trocar de rede manualmente através da sua carteira.`,
  warnings_chainUnsupported: `Essa aplicação não tem suporte à rede conectada.`,
  warnings_chainUnsupportedResolve: `Altere a rede ou desconecte a carteira para continuar.`,

  onboardingScreen_heading: `Obtanha uma carteira`,
  onboardingScreen_h1: `Comece a explorar a Web3`,
  onboardingScreen_p: `Sua carteira é a porta de entrada para todas as coisas Ethereum, a tecnologia mágica que torna possível explorar a web3.`,
  onboardingScreen_ctaText: `Escolha sua primeira carteira`,
  onboardingScreen_ctaUrl: `https://ethereum.org/pt-br/wallets/find-wallet/#main-content`,

  aboutScreen_heading: `Sobre Carteiras`,
  aboutScreen_a_h1: `Para seus ativos digitais`,
  aboutScreen_a_p: `As carteiras permitem que você envie, receba, armazene e interaja com ativos digitais como NFTs e outros tokens Ethereum.`,
  aboutScreen_b_h1: `A melhor maneira de fazer login`,
  aboutScreen_b_p: `Com aplicativos modernos, sua carteira pode ser usada como uma maneira fácil de fazer login, em vez de ter que lembrar uma senha.`,
  aboutScreen_c_h1: `Explore o mundo Web3`,
  aboutScreen_c_p: `Sua carteira é um utilitário essencial que permite explorar e participar do mundo em rápida evolução da web3.`,
  aboutScreen_ctaText: `Aprenda Mais`,
  aboutScreen_ctaUrl: `https://ethereum.org/pt-br/wallets/`,

  connectorsScreen_heading: `Conectar`,
  connectorsScreen_newcomer: `Eu não tenho uma carteira`,
  connectorsScreen_h1: `O que é uma carteira?`,
  connectorsScreen_p: `As carteiras são usadas para enviar, receber e armazenar ativos digitais. Conectar uma carteira permite que você interaja com aplicativos.`,

  mobileConnectorsScreen_heading: `Escolha a Carteira`,

  scanScreen_heading: `Escaneie com o celular`,
  scanScreen_heading_withConnector: `Escaneie com {{ CONNECTORNAME }}`,
  scanScreen_tooltip_walletConnect: `Abra a [WALLETCONNECTLOGO] WalletConnect \n para escanear`,
  scanScreen_tooltip_default: `Abra a carteira {{ CONNECTORNAME }} no \nseu celular para escanear`,

  downloadAppScreen_heading: `Baixe {{ CONNECTORNAME }}`,
  downloadAppScreen_iosAndroid: `Escaneie com a câmera do seu celular para baixar no iOS ou Android.`,
  downloadAppScreen_ios: `Escaneie com a câmera do seu celular para baixar no iOS.`,
  downloadAppScreen_android: `Escaneie com a câmera do seu celular para baixar no Android.`,

  injectionScreen_unavailable_h1: `Navegador Não Suportado`,
  injectionScreen_unavailable_p: `Para conectar sua carteira{{ CONNECTORSHORTNAME }},\ninstale a extensão no {{ SUGGESTEDEXTENSIONBROWSER }}.`,

  injectionScreen_install_h1: `Instalar {{ CONNECTORNAME }}`,
  injectionScreen_install_p: `Para conectar sua carteira {{ CONNECTORSHORTNAME }},\ninstale a extensão do navegador`,

  injectionScreen_connecting_h1: `Conectando`,
  injectionScreen_connecting_p: `Abra a extensão {{ CONNECTORSHORTNAME }} no navegador \npara conectar a sua carteira.`,
  injectionScreen_connecting_injected_h1: `Conectando`,
  injectionScreen_connecting_injected_p: `Aceite a solicitação por meio de sua carteira para se conectar a este aplicativo.`,

  injectionScreen_connected_h1: `Já está conectado`,
  injectionScreen_connected_p: `Agora você já pode fechar esta janela`,

  injectionScreen_rejected_h1: `Cancelado`,
  injectionScreen_rejected_p: `Você cancelou a solicitação.\nClique acima para tentar novamente.`,

  injectionScreen_failed_h1: `A Conexão Falhou`,
  injectionScreen_failed_p: `Desculpe, algo deu errado.\nPor favor, tente conectar novamente.`,

  injectionScreen_notconnected_h1: `Faça login em {{ CONNECTORNAME }}`,
  injectionScreen_notconnected_p: `Para continuar, faça login em sua extensão {{ CONNECTORNAME }}`,

  profileScreen_heading: 'Conectado',

  switchNetworkScreen_heading: 'Alternar Rede',

  signInWithEthereumScreen_tooltip:
    'Você não está conectado a este aplicativo.\n**Entre com Ethereum** para continuar.',

  signInWithEthereumScreen_signedOut_heading: 'Entre com Ethereum',
  signInWithEthereumScreen_signedOut_h1:
    'Este aplicativo gostaria de verificar você \n como o proprietário desta carteira.',
  signInWithEthereumScreen_signedOut_p: `Por favor, assine o pedido de mensagem \n em sua carteira para continuar.`,
  signInWithEthereumScreen_signedOut_button: 'Entrar',

  signInWithEthereumScreen_signedIn_heading: 'Entrar com Ethereum',
  signInWithEthereumScreen_signedIn_h1:
    'Você se verificou com sucesso \n como o proprietário desta carteira',
  signInWithEthereumScreen_signedIn_p: `Sair exigirá que você \n autentique novamente no futuro.`,
  signInWithEthereumScreen_signedIn_button: 'Sair',
};

export default ptBR;
