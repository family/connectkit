import { LocaleProps } from './';

const faIR: LocaleProps = {
  connectWallet: 'اتصال به کیف پول',
  disconnect: 'قطع ارتباط',
  connected: 'متصل شد',
  wrongNetwork: 'شبکه نادرست',
  switchNetworks: 'تغییر شبکه‌ها',
  chainNetwork: '{{ CHAIN }} شبکه',
  copyToClipboard: 'کپی به کلیپ‌بورد',
  copyCode: 'کپی کد',
  moreInformation: 'اطلاعات بیشتر',
  back: 'بازگشت',
  close: 'بستن',
  or: 'یا',
  more: 'بیشتر',
  tryAgain: 'تلاش دوباره',
  tryAgainQuestion: 'آیا دوباره تلاش کنیم؟',
  dontHaveTheApp: 'اپلیکیشن را ندارید؟',
  scanTheQRCode: 'اسکن کیو‌آر کد',
  useWalletConnectModal: 'استفاده از مودال والت‌‌کانکت',
  useModal: 'استفاده از مودال',
  installTheExtension: 'نصب افزونه',
  getWalletName: 'دریافت {{ CONNECTORNAME }}',
  otherWallets: 'کیف پول‌های دیگر',
  learnMore: 'بیشتر بدانید',
  getWallet: 'یک کیف پول دریافت کنید',
  approveInWallet: 'در کیف پول تأیید کنید',
  confirmInWallet: 'در کیف پول تأیید کنید',
  awaitingConfirmation: 'در انتظار تأیید',
  signIn: 'ورود',
  signOut: 'خروج',
  signedIn: 'وارد شده',
  signedOut: 'خارج شده',
  walletNotConnected: 'کیف پول متصل نیست',

  warnings_walletSwitchingUnsupported: `متاسفانه، کیف پول شما از تغییر شبکه در این برنامه پشتیبانی نمی‌کند.`,
  warnings_walletSwitchingUnsupportedResolve: `بهتر است از داخل کیف پول خود تغییر شبکه دهید.`,
  warnings_chainUnsupported: `این برنامه با شبکه‌ای که در حال حاضر متصل است، سازگاری ندارد.`,
  warnings_chainUnsupportedResolve: `برای ادامه، شبکه را تغییر دهید یا اتصال را قطع کنید.`,

  onboardingScreen_heading: `دریافت کیف پول`,
  onboardingScreen_h1: `آغاز کاوش در وب3`,
  onboardingScreen_p: `کیف پول شما دروازه‌ای است به دنیای اتریوم، فناوری جادویی که ممکن می‌سازد تا وب3 را کاوش کنید.`,
  onboardingScreen_ctaText: `کیف پول نخست خود را انتخاب کنید`,
  onboardingScreen_ctaUrl: `https://ethereum.org/fa/wallets/find-wallet/`,

  aboutScreen_heading: `درباره کیف پول‌ها`,
  aboutScreen_a_h1: `نگهبان دارایی‌های دیجیتالی شما`,
  aboutScreen_a_p: `کیف پول‌ها به شما اجازه می‌دهند دارایی‌های دیجیتالی مانند ان‌اف‌تی و توکن‌های اتریومی دیگر را ارسال، دریافت، ذخیره و تعامل دهید.`,
  aboutScreen_b_h1: `یک روش بهتر برای ورود`,
  aboutScreen_b_p: `در برنامه‌های مدرن، کیف پول شما می‌تواند به عنوان یک راه ورود آسان به جای به یادآوری یک رمز عبور مورد استفاده قرار گیرد.`,
  aboutScreen_c_h1: `جهان وب3 را کاوش کنید`,
  aboutScreen_c_p: `کیف پول شما یک ابزار ضروری است که به شما اجازه می‌دهد جهان در حال تغییر سریع وب3 را کاوش و در آن شرکت کنید.`,
  aboutScreen_ctaText: `دانش بیشتری بیافزایید`,
  aboutScreen_ctaUrl: `https://ethereum.org/fa/wallets/`,

  connectorsScreen_heading: `برقراری ارتباط با کیف پول`,
  connectorsScreen_newcomer: `کیف پول ندارم`,
  connectorsScreen_h1: `چیستی رمزگذاری کیف پول؟`,
  connectorsScreen_p: `کیف پول‌ها برای ارسال، دریافت و نگهداری دارایی‌های دیجیتال استفاده می‌شوند. برقراری ارتباط با یک کیف پول به شما امکان تعامل با برنامه‌ها را می‌دهد.`,

  mobileConnectorsScreen_heading: `انتخاب کیف پول`,

  scanScreen_heading: `اسکن با گوشی`,
  scanScreen_heading_withConnector: `اسکن با {{ CONNECTORNAME }}`,
  scanScreen_tooltip_walletConnect: `یک کیف پول با پشتیبانی از والت‌‌کانکت را باز کنید تا اسکن را آغاز کنید`,
  scanScreen_tooltip_default: `{{ CONNECTORNAME }} را روی گوشی خود باز کنید تا اسکن شود`,

  downloadAppScreen_heading: `دریافت {{ CONNECTORNAME }}`,
  downloadAppScreen_iosAndroid: `از دوربین گوشی خود برای اسکن و دریافت نسخه iOS یا Android استفاده کنید.`,
  downloadAppScreen_ios: `از دوربین گوشی خود برای دریافت نسخه iOS استفاده کنید.`,
  downloadAppScreen_android: `از دوربین گوشی خود برای دریافت نسخه Android استفاده کنید.`,

  injectionScreen_unavailable_h1: `مرورگر پشتیبانی نمی‌شود`,
  injectionScreen_unavailable_p: `برای برقراری ارتباط با کیف پول {{ CONNECTORSHORTNAME }}، افزونه مرورگر را در {{ SUGGESTEDEXTENSIONBROWSER }} نصب کنید.`,

  injectionScreen_install_h1: `نصب {{ CONNECTORNAME }}`,
  injectionScreen_install_p: `برای برقراری ارتباط با کیف پول {{ CONNECTORSHORTNAME }}، افزونه مرورگر را نصب کنید.`,

  injectionScreen_connecting_h1: `درخواست اتصال`,
  injectionScreen_connecting_p: `افزونه مرورگر {{ CONNECTORSHORTNAME }} را باز کنید تا ارتباط با کیف پول ایجاد شود.`,
  injectionScreen_connecting_injected_h1: `درخواست اتصال`,
  injectionScreen_connecting_injected_p: `درخواست را از طریق کیف پول خود بپذیرید تا به این برنامه متصل شوید.`,

  injectionScreen_connected_h1: `اتصال از قبل برقرار است`,
  injectionScreen_connected_p: `اکنون می‌توانید این پنجره‌ی بازشو را ببندید.`,

  injectionScreen_rejected_h1: `درخواست لغو شد`,
  injectionScreen_rejected_p: `شما درخواست را لغو کرده‌اید. برای تلاش مجدد، بالا کلیک کنید.`,

  injectionScreen_failed_h1: `ارتباط ناموفق`,
  injectionScreen_failed_p: `متاسفانه، مشکلی بوجود آمد. لطفاً مجدداً اتصال برقرار کنید.`,

  injectionScreen_notconnected_h1: `با ورود به {{ CONNECTORNAME }} وارد شوید`,
  injectionScreen_notconnected_p: `برای ادامه، لطفاً وارد افزونه {{ CONNECTORNAME }} خود شوید.`,

  profileScreen_heading: 'اتصال‌ها',

  switchNetworkScreen_heading: 'تغییر شبکه‌ها',

  signInWithEthereumScreen_tooltip:
    'شما در حال حاضر به این برنامه وارد نشده‌اید.\n**با اتریوم وارد شوید** تا ادامه دهید.',

  signInWithEthereumScreen_signedOut_heading: 'با اتریوم وارد شوید',
  signInWithEthereumScreen_signedOut_h1:
    'این برنامه می‌خواهد هویت شما \n به عنوان صاحب این کیف پول را تأیید کند.',
  signInWithEthereumScreen_signedOut_p: `لطفاً درخواست پیام را در کیف پول خود تأیید کنید تا ادامه دهید.`,
  signInWithEthereumScreen_signedOut_button: 'با اتریوم وارد شوید',

  signInWithEthereumScreen_signedIn_heading: 'با اتریوم وارد شده‌اید',
  signInWithEthereumScreen_signedIn_h1:
    'شما به عنوان صاحب این کیف پول هویت خود را با موفقیت تأیید کرده‌اید.',
  signInWithEthereumScreen_signedIn_p: `خروج از حساب کاربری شما در آینده نیاز به تأیید دوباره دارد.`,
  signInWithEthereumScreen_signedIn_button: 'خروج',
};

export default faIR;
