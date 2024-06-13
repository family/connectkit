import { LocaleProps } from './';

const eeEE: LocaleProps = {
  connectWallet: 'Ühenda rahakott',
  disconnect: 'Katkesta ühendus',
  connected: 'Ühendatud',
  wrongNetwork: 'Vale võrk',
  switchNetworks: 'Vaheta võrke',
  chainNetwork: '{{ CHAIN }} Võrk',
  copyToClipboard: 'Kopeeri lõikelauale',
  copyCode: 'Kopeeri koodi',
  moreInformation: 'Rohkem infot',
  back: 'Tagasi',
  close: 'Pane kinni',
  or: 'või',
  more: 'Rohkem',
  tryAgain: 'Proovi uuesti',
  tryAgainQuestion: 'Proovi uuesti?',
  dontHaveTheApp: 'Kas teil pole rakendust?',
  scanTheQRCode: 'Skaneeri QR-kood',
  useWalletConnectModal: 'Kasuta WalletConnecti modalit',
  useModal: 'Kasuta Modalit',
  installTheExtension: 'Installi laiendust',
  getWalletName: 'Hanki {{ CONNECTORNAME }}',
  otherWallets: 'Teised rahakotid',
  learnMore: 'Avasta rohkem',
  getWallet: 'Lae alla rahakott',
  approveInWallet: 'Kiita heaks rahakotis',
  confirmInWallet: 'Kinnita rahakotis',
  awaitingConfirmation: 'Kinnituse ootel',
  signIn: 'Logi sisse',
  signOut: 'Logi välja',
  signedIn: 'Sisse logitud',
  signedOut: 'Välja logitud',
  walletNotConnected: 'Raakott pole ühendatud',

  warnings_walletSwitchingUnsupported: `Teie rahakott ei toeta võrgu vahetamist sellest rakendusest.`,
  warnings_walletSwitchingUnsupportedResolve: `Proovige võrgu vahetamist teha oma rahakoti seest.`,
  warnings_chainUnsupported: `See rakendus ei toeta praegu ühendatud võrku.`,
  warnings_chainUnsupportedResolve: `Jätkamiseks vahetage või ühendage lahti.`,

  onboardingScreen_heading: `Hankige rahakott`,
  onboardingScreen_h1: `Alustage Web3 uurimist`,
  onboardingScreen_p: `Teie rahakott on värav kõigele, mis puudutab Ethereumit, maagilist tehnoloogiat, mis võimaldab uurida Web3.`,
  onboardingScreen_ctaText: `Valige oma esimene rahakott`,
  onboardingScreen_ctaUrl: `https://ethereum.org/en/wallets/find-wallet/`,

  aboutScreen_heading: `Rahakottidest`,
  aboutScreen_a_h1: `Teie digitaalsetele varadele`,
  aboutScreen_a_p: `Rahakotid võimaldavad teil saata, vastu võtta, salvestada ja suhelda digitaalsete varadega nagu NFT-d ja teised Ethereumi tokenid.`,
  aboutScreen_b_h1: `Parem viis sisse logimiseks`,
  aboutScreen_b_p: `Kaasaegsete rakendustega saab teie rahakotti kasutada lihtsa sisselogimisviisina, ilma et peaksite meeles pidama parooli.`,
  aboutScreen_c_h1: `Uurige Web3 maailma`,
  aboutScreen_c_p: `Teie rahakott on oluline tööriist, mis võimaldab teil uurida ja osaleda kiiresti arenevas Web3 maailmas.`,
  aboutScreen_ctaText: `Lisateavet saamiseks`,
  aboutScreen_ctaUrl: `https://ethereum.org/en/wallets/`,

  connectorsScreen_heading: `Ühendage rahakott`,
  connectorsScreen_newcomer: `Mul pole rahakotti`,
  connectorsScreen_h1: `Mis on rahakott?`,
  connectorsScreen_p: `Rahakotte kasutatakse digitaalsete varade saatmiseks, vastuvõtmiseks ja salvestamiseks. Rahakoti ühendamine võimaldab teil rakendustega suhelda.`,

  mobileConnectorsScreen_heading: `Valige rahakott`,

  scanScreen_heading: `Skaneerige telefoni abil`,
  scanScreen_heading_withConnector: `Skaneerige koos {{ CONNECTORNAME }}-ga`,
  scanScreen_tooltip_walletConnect: `Ava [WALLETCONNECTLOGO] WalletConnect \ntoetatud rahakott skaneerimiseks`,
  scanScreen_tooltip_default: `Ava {{ CONNECTORNAME }} oma \nmobiiltelefonil skaneerimiseks`,

  downloadAppScreen_heading: `Hankige {{ CONNECTORNAME }}`,
  downloadAppScreen_iosAndroid: `Skaneerige oma telefoni kaameraga allalaadimiseks iOS-i või Androidi jaoks.`,
  downloadAppScreen_ios: `Skaneerige oma telefoni kaameraga allalaadimiseks iOS-i jaoks.`,
  downloadAppScreen_android: `Skaneerige oma telefoni kaameraga Androidi allalaadimiseks.`,

  injectionScreen_unavailable_h1: `Toetuseta brauser`,
  injectionScreen_unavailable_p: `Teie {{ CONNECTORSHORTNAME }} rahakoti ühendamiseks\ninstallige laiendus {{ SUGGESTEDEXTENSIONBROWSER }}-le.`,

  injectionScreen_install_h1: `Installige {{ CONNECTORNAME }}`,
  injectionScreen_install_p: `Teie {{ CONNECTORSHORTNAME }} rahakoti ühendamiseks\ninstallige brauseri laiendus.`,

  injectionScreen_connecting_h1: `Ühenduse taotlemine`,
  injectionScreen_connecting_p: `Ava {{ CONNECTORSHORTNAME }} brauseri \nlaiendus rahakoti ühendamiseks.`,
  injectionScreen_connecting_injected_h1: `Ühenduse taotlemine`,
  injectionScreen_connecting_injected_p: `Nõustuge rakendusega ühendamiseks oma rahakotis.`,

  injectionScreen_connected_h1: `Juba ühendatud`,
  injectionScreen_connected_p: `Selle popup-i saab nüüd sulgeda`,

  injectionScreen_rejected_h1: `Taotlus tühistatud`,
  injectionScreen_rejected_p: `Tühistasite taotluse.\nKlõpsake ülal, et uuesti proovida.`,

  injectionScreen_failed_h1: `Ühenduse loomine ebaõnnestus`,
  injectionScreen_failed_p: `Vabandame, midagi läks valesti.\nProovige ühendust uuesti luua.`,

  injectionScreen_notconnected_h1: `Logige sisse {{ CONNECTORNAME }}-ga`,
  injectionScreen_notconnected_p: `Jätkamiseks logige sisse oma {{ CONNECTORNAME }} laiendisse.`,

  profileScreen_heading: 'Ühendatud',

  switchNetworkScreen_heading: 'Võrkude vahetamine',

  signInWithEthereumScreen_tooltip:
    'Te pole selle rakendusse sisse logitud.\n**Logi sisse Ethereumiga** jätkamiseks.',

  signInWithEthereumScreen_signedOut_heading: 'Logi sisse Ethereumiga',
  signInWithEthereumScreen_signedOut_h1:
    'See rakendus soovib teid autentida \n selle rahakoti omanikuna.',
  signInWithEthereumScreen_signedOut_p: `Jätkamiseks allkirjastage sõnumipäring \n oma rahakotis.`,
  signInWithEthereumScreen_signedOut_button: 'Logi sisse',

  signInWithEthereumScreen_signedIn_heading: 'Logi välja',
  signInWithEthereumScreen_signedIn_h1:
    'Olete edukalt autentinud end \n selle rahakoti omanikuna.',
  signInWithEthereumScreen_signedIn_p: `Välja logimine nõuab tulevikus \n uuesti autentimist.`,
  signInWithEthereumScreen_signedIn_button: 'Logi välja',
};

export default eeEE;
