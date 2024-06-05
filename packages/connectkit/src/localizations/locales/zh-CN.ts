import { LocaleProps } from './';

const zhCN: LocaleProps = {
  connectWallet: '绑定钱包',
  disconnect: '解除绑定',
  connected: '已绑定',
  wrongNetwork: '错误网络',
  switchNetworks: '切换网络',
  chainNetwork: '{{ CHAIN }}网络',
  copyToClipboard: '复制到剪贴板',
  copyCode: '复制代码',
  moreInformation: '更多信息',
  back: '返回',
  close: '关闭',
  or: '或',
  more: '更多',
  tryAgain: '重试',
  tryAgainQuestion: '重试？',
  dontHaveTheApp: '没有该应用？',
  scanTheQRCode: '扫描二维码',
  useWalletConnectModal: '使用 WalletConnect 模态窗',
  useModal: '使用模态窗',
  installTheExtension: '安装扩展程序',
  getWalletName: '获取{{ CONNECTORNAME }}',
  otherWallets: '其他钱包',
  learnMore: '了解更多',
  getWallet: '获取钱包',
  approveInWallet: '在钱包中批准',
  confirmInWallet: '在钱包中确认',
  awaitingConfirmation: '等待确认',
  signIn: '登录',
  signOut: '登出',
  signedIn: '已登录',
  signedOut: '已登出',
  walletNotConnected: '钱包未绑定',

  warnings_walletSwitchingUnsupported: `您的钱包不支持从此应用切换网络。`,
  warnings_walletSwitchingUnsupportedResolve: `请尝试从钱包中切换网络。`,
  warnings_chainUnsupported: `此应用不支持当前连接的网络。`,
  warnings_chainUnsupportedResolve: `请切换网络或断开连接以继续。`,

  onboardingScreen_heading: `获取钱包`,
  onboardingScreen_h1: `开始探索 Web3`,
  onboardingScreen_p: `您的钱包是通往以太坊的一扇大门，而以太坊是探索 Web3 的一项神奇技术。`,
  onboardingScreen_ctaText: `选择您的第一钱包`,
  onboardingScreen_ctaUrl: `https://ethereum.org/zh/wallets/find-wallet/`,

  aboutScreen_heading: `关于钱包`,
  aboutScreen_a_h1: `对于您的数字资产`,
  aboutScreen_a_p: `有了钱包，您可以发送、接收、存储数字资产及使用数字资产进行交互，例如 NFT 和其他以太坊通证等。`,
  aboutScreen_b_h1: `更好的登录方式`,
  aboutScreen_b_p: `使用现代应用，您的钱包可以用作简便的登录方法，而不必记住密码。`,
  aboutScreen_c_h1: `探索 Web3 世界`,
  aboutScreen_c_p: `您的钱包是一个重要的工具，可以让您探索并参与到快速发展的 Web3 世界。`,
  aboutScreen_ctaText: `了解更多`,
  aboutScreen_ctaUrl: `https://ethereum.org/zh/wallets/`,

  connectorsScreen_heading: `绑定钱包`,
  connectorsScreen_newcomer: `我没有钱包`,
  connectorsScreen_h1: `什么是钱包？`,
  connectorsScreen_p: `钱包可用于发送、接收和存储数字资产。通过绑定钱包，您可以与应用进行交互。`,

  mobileConnectorsScreen_heading: `选择钱包`,

  scanScreen_heading: `手机扫描`,
  scanScreen_heading_withConnector: `手机扫描{{ CONNECTORNAME }}`,
  scanScreen_tooltip_walletConnect: `打开 [WALLETCONNECTLOGO] WalletConnect 支持的钱包进行扫描`,
  scanScreen_tooltip_default: `打开您手机上的{{ CONNECTORNAME }} 进行扫描`,

  downloadAppScreen_heading: `获取{{ CONNECTORNAME }}`,
  downloadAppScreen_iosAndroid: `使用手机相机扫描以下载 iOS 或 Android 应用。`,
  downloadAppScreen_ios: `使用手机相机扫描以下载 iOS 应用。`,
  downloadAppScreen_android: `使用手机相机扫描以下载 Android 应用。`,

  injectionScreen_unavailable_h1: `不支持的浏览器`,
  injectionScreen_unavailable_p: `要绑定您的{{ CONNECTORSHORTNAME }}钱包，请在{{ SUGGESTEDEXTENSIONBROWSER }}上安装此扩展程序。`,

  injectionScreen_install_h1: `安装{{ CONNECTORNAME }}`,
  injectionScreen_install_p: `要绑定您的{{ CONNECTORSHORTNAME }}钱包，请安装此浏览器扩展程序。`,

  injectionScreen_connecting_h1: `请求绑定`,
  injectionScreen_connecting_p: `打开{{ CONNECTORSHORTNAME }}浏览器 扩展程序以绑定您的钱包。`,
  injectionScreen_connecting_injected_h1: `请求绑定`,
  injectionScreen_connecting_injected_p: `通过您的钱包接受请求，以绑定到此应用。`,

  injectionScreen_connected_h1: `已绑定`,
  injectionScreen_connected_p: `现在可以关闭此弹窗`,

  injectionScreen_rejected_h1: `请求已取消`,
  injectionScreen_rejected_p: `您已取消请求。点击上面可重试。`,

  injectionScreen_failed_h1: `绑定失败`,
  injectionScreen_failed_p: `抱歉，发生错误。请尝试重新绑定。`,

  injectionScreen_notconnected_h1: `登录{{ CONNECTORNAME }}`,
  injectionScreen_notconnected_p: `要继续，请登录到您的{{ CONNECTORNAME }}扩展程序。`,

  profileScreen_heading: '已绑定',

  switchNetworkScreen_heading: '切换网络',

  signInWithEthereumScreen_tooltip:
    '您尚未登录到此应用。\n请选择**使用以太坊登录**以继续。',
  signInWithEthereumScreen_signedOut_heading: '使用以太坊登录',
  signInWithEthereumScreen_signedOut_h1: '此应用希望验证您是 此钱包的所有者。',
  signInWithEthereumScreen_signedOut_p: `请签署钱包中的消息请求 以继续。`,
  signInWithEthereumScreen_signedOut_button: '登录',

  signInWithEthereumScreen_signedIn_heading: '已使用以太坊登录',
  signInWithEthereumScreen_signedIn_h1: '您已成功验证自己 是此钱包的所有者。',
  signInWithEthereumScreen_signedIn_p: `登出后，将来您还需要 再次进行身份验证。`,
  signInWithEthereumScreen_signedIn_button: '登出',
};

export default zhCN;
