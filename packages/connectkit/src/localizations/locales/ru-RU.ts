import { LocaleProps } from './';

const ruRU: LocaleProps = {
  connectWallet: 'Подключить кошелек',
  disconnect: 'Отключить',
  connected: 'Подключена',
  wrongNetwork: 'Неверная сеть',
  switchNetworks: 'Переключение сети',
  chainNetwork: 'Сеть {{ CHAIN }}',
  copyToClipboard: 'Скопировать в буфер обмена',
  copyCode: 'Скопировать код',
  moreInformation: 'Больше информации',
  back: 'Назад',
  close: 'Закрыть',
  or: 'или',
  more: 'Еще',
  tryAgain: 'Попробовать снова',
  tryAgainQuestion: 'Попробовать снова?',
  dontHaveTheApp: 'У вас нет приложения?',
  scanTheQRCode: 'Отсканируйте QR-код',
  useWalletConnectModal: 'Использовать окно WalletConnect',
  useModal: 'Использовать модальное окно',
  installTheExtension: 'Установить расширение',
  getWalletName: 'Скачать {{ CONNECTORNAME }}',
  otherWallets: 'Другие кошельки',
  learnMore: 'Узнать больше',
  getWallet: 'Завести кошелек',
  approveInWallet: 'Подтвердите',
  confirmInWallet: 'Подтвердите',
  awaitingConfirmation: 'Ожидаем подтверждение',
  signIn: 'Войти',
  signOut: 'Выйти',
  signedIn: 'Вошли',
  signedOut: 'Вышли',
  walletNotConnected: 'Кошелек не подключен',

  warnings_walletSwitchingUnsupported: `Ваш кошелек не поддерживает переключение сетей из этого приложения.`,
  warnings_walletSwitchingUnsupportedResolve: `Попробуйте переключиться на другую сеть прямо в вашем кошельке.`,
  warnings_chainUnsupported: `Это приложение не поддерживает текущую подключенную сеть.`,
  warnings_chainUnsupportedResolve: `Для продолжения переключите сеть или отключите кошелек.`,

  onboardingScreen_heading: `Завести кошелек`,
  onboardingScreen_h1: `Начните исследовать веб3`,
  onboardingScreen_p: `Ваш кошелек — это врата в мир Ethereum, волшебной технологии, которая позволяет исследовать веб3.`,
  onboardingScreen_ctaText: `Выбрать свой первый кошелек`,
  onboardingScreen_ctaUrl: `https://ethereum.org/en/wallets/find-wallet/`,

  aboutScreen_heading: `О кошельках`,
    aboutScreen_a_h1: `Для ваших цифровых активов`,
  aboutScreen_a_p: `Кошельки позволяют вам отправлять, получать, хранить и взаимодействовать с цифровыми активами, такими как NFT и другие токены Ethereum.`,
  aboutScreen_b_h1: `Лучший способ входа`,
  aboutScreen_b_p: `В современных приложениях ваш кошелек можно использовать как удобный способ входа без необходимости помнить пароль.`,
  aboutScreen_c_h1: `Исследуйте мир веб3`,
  aboutScreen_c_p: `Ваш кошелек - это неотъемлемый инструмент, который позволяет вам исследовать и участвовать в быстро развивающемся мире веб3.`,
  aboutScreen_ctaText: `Узнать больше`,
  aboutScreen_ctaUrl: `https://ethereum.org/en/wallets/`,

  connectorsScreen_heading: `Подключение кошелька`,
  connectorsScreen_newcomer: `У меня нет кошелька`,
  connectorsScreen_h1: `Что такое кошелек?`,
  connectorsScreen_p: `Кошельки используются для отправки, получения и хранения цифровых активов. Подключение кошелька позволяет вам взаимодействовать с приложениями.`,

  mobileConnectorsScreen_heading: `Выберите кошелек`,

  scanScreen_heading: `Сканирование с телефона`,
  scanScreen_heading_withConnector: `Сканирование с помощью {{ CONNECTORNAME }}`,
  scanScreen_tooltip_walletConnect: `Откройте [WALLETCONNECTLOGO] поддерживаемый WalletConnect кошелек для сканирования`,
  scanScreen_tooltip_default: `Откройте {{ CONNECTORNAME }} на вашем мобильном телефоне для сканирования`,

  downloadAppScreen_heading: `Скачивание {{ CONNECTORNAME }}`,
  downloadAppScreen_iosAndroid: `Отсканируйте камерой телефона для загрузки приложения на iOS или Android.`,
  downloadAppScreen_ios: `Отсканируйте камерой телефона для загрузки приложения на iOS.`,
  downloadAppScreen_android: `Сканируйте камерой телефона для загрузки приложения на Android.`,

  injectionScreen_unavailable_h1: `Неподдерживаемый браузер`,
  injectionScreen_unavailable_p: `Для подключения вашего кошелька {{ CONNECTORSHORTNAME }}, установите расширение для браузера {{ SUGGESTEDEXTENSIONBROWSER }}.`,

  injectionScreen_install_h1: `Установите {{ CONNECTORNAME }}`,
  injectionScreen_install_p: `Для подключения вашего кошелька {{ CONNECTORSHORTNAME }}, установите расширение для браузера.`,

  injectionScreen_connecting_h1: `Запрос на подключение`,
  injectionScreen_connecting_p: `Откройте расширение для браузера {{ CONNECTORSHORTNAME }} для подключения вашего кошелька.`,
  injectionScreen_connecting_injected_h1: `Запрос на подключение`,
  injectionScreen_connecting_injected_p: `Примите запрос в вашем кошельке, чтобы подключиться к приложению.`,

  injectionScreen_connected_h1: `Уже подключен`,
  injectionScreen_connected_p: `Можно закрыть это окно`,

  injectionScreen_rejected_h1: `Запрос отменен`,
  injectionScreen_rejected_p: `Вы отменили запрос.\nНажмите выше, чтобы попробовать снова.`,

  injectionScreen_failed_h1: `Сбой подключения`,
  injectionScreen_failed_p: `Извините, что-то пошло не так.\nПожалуйста, попробуйте подключиться снова.`,

  injectionScreen_notconnected_h1: `Войдите в {{ CONNECTORNAME }}`,
  injectionScreen_notconnected_p: `Для продолжения войдите в расширение {{ CONNECTORNAME }}.`,

  profileScreen_heading: 'Кошелек подключен',

  switchNetworkScreen_heading: 'Переключение сетей',

  signInWithEthereumScreen_tooltip:
    'Вы не вошли в это приложение.\n**Войдите с помощью Ethereum**, чтобы продолжить.',

  signInWithEthereumScreen_signedOut_heading: 'Войти с помощью Ethereum',
  signInWithEthereumScreen_signedOut_h1:
    'Это приложение хочет подтвердить вас \n в качестве владельца этого кошелька.',
  signInWithEthereumScreen_signedOut_p: `Пожалуйста, подпишите запрос на сообщение \n в своем кошельке, чтобы продолжить.`,
  signInWithEthereumScreen_signedOut_button: 'Войти',

  signInWithEthereumScreen_signedIn_heading: 'Вошли с помощью Ethereum',
  signInWithEthereumScreen_signedIn_h1:
    'Вы успешно подтвердили себя \n в качестве владельца этого кошелька.',
  signInWithEthereumScreen_signedIn_p: `Выйти потребуется \n повторная аутентификация в будущем.`,
  signInWithEthereumScreen_signedIn_button: 'Выйти',
};

export default ruRU;