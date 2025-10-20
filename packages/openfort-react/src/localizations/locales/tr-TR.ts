import { LocaleProps } from './'
import enUS from './en-US'

const trTR: LocaleProps = {
  ...enUS, // fallback
  connectWallet: 'Cüzdan Bağla',
  disconnect: 'Bağlantıyı Kes',
  connected: 'Bağlandı',
  wrongNetwork: 'Yanlış Ağ',
  switchNetworks: 'Ağ Değiştir',
  chainNetwork: '{{ CHAIN }} Ağı',
  copyToClipboard: 'Panoya Kopyala',
  copyCode: 'Kodu Kopyala',
  moreInformation: 'Daha Fazla Bilgi',
  back: 'Geri',
  close: 'Kapat',
  or: 'veya',
  more: 'Daha Fazla',
  tryAgain: 'Tekrar Dene',
  tryAgainQuestion: 'Tekrar Dene?',
  dontHaveTheApp: 'Uygulaman yok mu?',
  scanTheQRCode: 'Karekodu tarat',
  useWalletConnectModal: 'WalletConnect Modalini Kullan ',
  useModal: 'Modal Kullan',
  installTheExtension: 'Eklentiyi İndir',
  getWalletName: '{{ CONNECTORNAME }} Alın',
  otherWallets: 'Diğer Cüzdanlar',
  learnMore: 'Daha Fazlasını Öğren',
  getWallet: 'Cüzdan Al',
  approveInWallet: 'Cüzdanda Yetki Ver',
  confirmInWallet: 'Cüzdanda Onayla',
  awaitingConfirmation: 'Doğrulama Bekleniyor',
  signIn: 'Giriş Yap',
  signOut: 'Çıkış Yap',
  signedIn: 'Giriş Yapıldı',
  signedOut: 'Çıkış Yapıldı',
  walletNotConnected: 'Cüzdan Bağlı Değil',

  warnings_walletSwitchingUnsupported: `Bu uygulamada ağ değiştirmeyi cüzdanın desteklemiyor.`,
  warnings_walletSwitchingUnsupportedResolve: `Bunun yerine cüzdanınızdan ağları değiştirmeyi deneyin.`,
  warnings_chainUnsupported: `Bu uygulama kullanmış olduğunuz ağı desteklemiyor.`,
  warnings_chainUnsupportedResolve: `Devam etmek için ağ değiştir veya bağlantıyı kes.`,

  onboardingScreen_heading: `Cüzdan Al`,
  onboardingScreen_h1: `Web3\'ü keşfetmeye başla`,
  onboardingScreen_p: `Cüzdanınız, Web3'ü keşfetmeyi mümkün kılan sihirli teknoloji olan Ethereum'a açılan kapıdır.`,
  onboardingScreen_ctaText: `İlk Cüzdanını Seç`,
  onboardingScreen_ctaUrl: `https://ethereum.org/tr/wallets/find-wallet/`,

  aboutScreen_heading: `Cüzdanlar Hakkında`,
  aboutScreen_a_h1: `Dijital varlıkların için`,
  aboutScreen_a_p: `Cüzdanlar, NFT'ler ve diğer Ethereum varlıkları gibi dijital varlıklar göndermenize, almanıza, saklamanıza ve bunlarla etkileşim kurmanıza olanak tanır.`,
  aboutScreen_b_h1: `Giriş yapmanın daha iyi bir yolu`,
  aboutScreen_b_p: `Modern uygulamalar ile parola hatırlamak yerine cüzdanınız ile kolayca giriş yapabilirsiniz.`,
  aboutScreen_c_h1: `Web3 dünyasını keşfet`,
  aboutScreen_c_p: `Cüzdanınız, hızla gelişen Web3 dünyasını keşfetmenizi ve bu dünyaya katılmanızı sağlayan temel bir yardımcı programdır.`,
  aboutScreen_ctaText: `Daha Fazlasını Öğren`,
  aboutScreen_ctaUrl: `https://ethereum.org/tr/wallets/`,

  connectorsScreen_heading: `Cüzdan Bağla`,
  connectorsScreen_newcomer: `Cüzdanım Yok`,
  connectorsScreen_h1: `Cüzdan nedir?`,
  connectorsScreen_p: `Cüzdanlar, dijital varlıkları göndermek, almak ve depolamak için kullanılır. Bir cüzdanı bağlamak, uygulamalarla etkileşime geçmenizi sağlar.`,

  mobileConnectorsScreen_heading: `Cüzdan Seç`,

  scanScreen_heading: `Telefon ile Tarat`,
  scanScreen_heading_withConnector: `{{ CONNECTORNAME }} ile tarat`,
  scanScreen_tooltip_walletConnect: `Desteklenen bir cüzdan taramak için\n [WALLETCONNECTLOGO] WalletConnect uygulamasını aç`,
  scanScreen_tooltip_default: `Taramak için telefonunda\n {{ CONNECTORNAME }} uygulamasını aç`,

  downloadAppScreen_heading: `{{ CONNECTORNAME }} İndir`,
  downloadAppScreen_iosAndroid: `iOS ve Android'e indirmek için telefon kameran ile tarat.`,
  downloadAppScreen_ios: `iOS'a indirmek için telefon kameran ile tarat.`,
  downloadAppScreen_android: `Android'e indirmek için telefon kameran ile tarat.`,

  injectionScreen_unavailable_h1: `Desteklenmeyen Tarayıcı`,
  injectionScreen_unavailable_p: `{{ CONNECTORSHORTNAME }} cüzdanına bağlanmak için\n{{ SUGGESTEDEXTENSIONBROWSER }} üzerinde indirmen gerekiyor.`,

  injectionScreen_install_h1: `{{ CONNECTORNAME }} İndir`,
  injectionScreen_install_p: `{{ CONNECTORSHORTNAME }} cüzdanına bağlanmak için,\ntarayıcı eklentisini indir.`,

  injectionScreen_connecting_h1: `Bağlantı İsteniyor.`,
  injectionScreen_connecting_p: `Cüzdanını bağlamak için\n tarayıcıdan {{ CONNECTORSHORTNAME }} uzantısını açın.`,
  injectionScreen_connecting_injected_h1: `Bağlantı İsteniyor.`,
  injectionScreen_connecting_injected_p: `Bu uygulamaya bağlanmak için cüzdanına gelen isteği kabul et.`,

  injectionScreen_connected_h1: `Zaten Bağlanmış`,
  injectionScreen_connected_p: `Bu açılır pencereyi artık kapatabilirsin`,

  injectionScreen_rejected_h1: `İstek iptal edildi.`,
  injectionScreen_rejected_p: `İsteği iptal ettin.\nTekrar denemek için yukarıyı tıklayın.`,

  injectionScreen_failed_h1: `Bağlantı Başarısız`,
  injectionScreen_failed_p: `Üzgünüz, bir şeyler ters gitti.\nLütfen daha sonra tekrar deneyin.`,

  injectionScreen_notconnected_h1: `{{ CONNECTORNAME }} ile giriş yap`,
  injectionScreen_notconnected_p: `Devam etmek için, {{ CONNECTORNAME }} eklentisine giriş yapın.`,

  profileScreen_heading: 'Bağlandı',

  switchNetworkScreen_heading: 'Ağ Değiştir',

  signInWithEthereumScreen_tooltip: 'Bu uygulamada oturum açmadınız.\n Devam etmek için **Ethereum İle Giriş Yap**.',

  signInWithEthereumScreen_signedOut_heading: 'Ethereum İle Giriş Yap',
  signInWithEthereumScreen_signedOut_h1: 'Bu uygulama seni \n bu cüzdanın sahibi olarak doğrulamak istiyor.',
  signInWithEthereumScreen_signedOut_p: `Devam etmek için \n cüzdanınızdaki isteği onaylayın.`,
  signInWithEthereumScreen_signedOut_button: 'Giriş Yap',

  signInWithEthereumScreen_signedIn_heading: 'Ethereum İle Giriş Yapıldı',
  signInWithEthereumScreen_signedIn_h1: 'Bu cüzdanın sahibi olduğunu \n başarıyla onayladın.',
  signInWithEthereumScreen_signedIn_p: `Çıkış yaparsan ileride \n tekrar giriş yapman gerekecek. `,
  signInWithEthereumScreen_signedIn_button: 'Çıkış Yap',
}

export default trTR
