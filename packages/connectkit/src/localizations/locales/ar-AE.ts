import { LocaleProps } from './';

const arAE: LocaleProps = {
  connectWallet: 'الاتصال بالمحفظة',
  disconnect: 'قطع الاتصال',
  connected: 'متصل',
  wrongNetwork: 'شبكة خاطئة',
  switchNetworks: 'تغيير الشبكات',
  chainNetwork: 'شبكة {{ CHAIN }}',
  copyToClipboard: 'نسخ إلى الحافظة',
  copyCode: 'نسخ الكود',
  moreInformation: 'مزيد من المعلومات',
  back: 'عودة',
  close: 'إغلاق',
  or: 'أو',
  more: 'المزيد',
  tryAgain: 'حاول مجددًا',
  tryAgainQuestion: 'هل نحاول مرة أخرى؟',
  dontHaveTheApp: "ليس لديك التطبيق؟",
  scanTheQRCode: 'مسح رمز الاستجابة السريعة',
  useWalletConnectModal: 'استخدم نموذج ولِيت‌كنيكت',
  useModal: 'استخدم النموذج',
  installTheExtension: 'تثبيت الإضافة',
  getWalletName: 'الحصول على {{ CONNECTORNAME }}',
  otherWallets: 'محافظ أخرى',
  learnMore: 'تعرف على المزيد',
  getWallet: 'الحصول على محفظة',
  approveInWallet: 'الموافقة في المحفظة',
  confirmInWallet: 'تأكيد في المحفظة',
  awaitingConfirmation: 'بانتظار التأكيد',
  signIn: 'تسجيل الدخول',
  signOut: 'تسجيل الخروج',
  signedIn: 'تم تسجيل الدخول',
  signedOut: 'تم تسجيل الخروج',
  walletNotConnected: 'المحفظة غير متصلة',

  warnings_walletSwitchingUnsupported: `عذرًا، لا تدعم محفظتك تغيير الشبكات من هذا التطبيق.`,
  warnings_walletSwitchingUnsupportedResolve: `حاول تغيير الشبكات من داخل محفظتك بدلاً من ذلك.`,
  warnings_chainUnsupported: `هذا التطبيق غير متوافق مع الشبكة المتصلة حاليًا.`,
  warnings_chainUnsupportedResolve: `للمتابعة، قم بتغيير الشبكة أو قطع الاتصال.`,

  onboardingScreen_heading: `الحصول على محفظة`,
  onboardingScreen_h1: `ابدأ استكشاف الويب3`,
  onboardingScreen_p: `تعتبر محفظتك بوابتك إلى عوالم إيثريوم، التكنولوجيا السحرية التي تمكن استكشاف الويب3.`,
  onboardingScreen_ctaText: `اختر محفظتك الأولى`,
  onboardingScreen_ctaUrl: `https://ethereum.org/ar/wallets/find-wallet/`,

  aboutScreen_heading: `حول المحافظ`,
    aboutScreen_a_h1: `حافظ على أصولك الرقمية`,
  aboutScreen_a_p: `تمكنك المحافظ من إرسال واستقبال وتخزين والتفاعل مع الأصول الرقمية مثل NFTs ورموز إيثريوم الأخرى.`,
  aboutScreen_b_h1: `وسيلة أفضل لتسجيل الدخول`,
  aboutScreen_b_p: `في تطبيقات العصر الحديث، يمكن استخدام محفظتك كوسيلة سهلة لتسجيل الدخول بدلاً من الحاجة إلى تذكر كلمة مرور.`,
  aboutScreen_c_h1: `استكشاف عالم الويب3`,
  aboutScreen_c_p: `تعتبر محفظتك أداة أساسية تمكنك من استكشاف والمشاركة في عالم الويب3 الذي يتطور بسرعة.`,
  aboutScreen_ctaText: `استزيد من المعرفة`,
  aboutScreen_ctaUrl: `https://ethereum.org/ar/wallets/`,

  connectorsScreen_heading: `الاتصال بالمحفظة`,
  connectorsScreen_newcomer: `ليس لدي محفظة`,
  connectorsScreen_h1: `ما هي المحافظ؟`,
  connectorsScreen_p: `تُستخدم المحافظ لإرسال واستقبال وتخزين الأصول الرقمية. يمكنك الاتصال بمحفظة للتفاعل مع التطبيقات.`,

  mobileConnectorsScreen_heading: `اختر محفظة`,

  scanScreen_heading: `مسح باستخدام الهاتف`,
  scanScreen_heading_withConnector: `مسح باستخدام {{ CONNECTORNAME }}`,
  scanScreen_tooltip_walletConnect: `افتح محفظة تدعم ولِيت‌كنيكت \n لبدء المسح.`,
  scanScreen_tooltip_default: `افتح {{ CONNECTORNAME }} على هاتفك للمسح`,

  downloadAppScreen_heading: `الحصول على {{ CONNECTORNAME }}`,
  downloadAppScreen_iosAndroid: `استخدم كاميرا هاتفك للمسح وتنزيله على نظامي iOS أو Android

.`,
  downloadAppScreen_ios: `استخدم كاميرا هاتفك للمسح وتنزيله على نظام iOS.`,
  downloadAppScreen_android: `استخدم كاميرا هاتفك للمسح وتنزيله على نظام Android.`,

  injectionScreen_unavailable_h1: `المتصفح غير مدعوم`,
  injectionScreen_unavailable_p: `لتوصيل محفظتك {{ CONNECTORSHORTNAME }}، قم بتثبيت الإضافة على متصفح {{ SUGGESTEDEXTENSIONBROWSER }}.`,

  injectionScreen_install_h1: `تثبيت {{ CONNECTORNAME }}`,
  injectionScreen_install_p: `لتوصيل محفظتك {{ CONNECTORSHORTNAME }}، قم بتثبيت الإضافة على المتصفح.`,

  injectionScreen_connecting_h1: `طلب الاتصال`,
  injectionScreen_connecting_p: `افتح إضافة المتصفح {{ CONNECTORSHORTNAME }} لتوصيل محفظتك.`,
  injectionScreen_connecting_injected_h1: `طلب الاتصال`,
  injectionScreen_connecting_injected_p: `قبل الطلب من خلال محفظتك للاتصال بتطبيقنا.`,

  injectionScreen_connected_h1: `الاتصال بالفعل`,
  injectionScreen_connected_p: `من الآمن الآن إغلاق هذه النافذة المنبثقة.`,

  injectionScreen_rejected_h1: `تم رفض الطلب`,
  injectionScreen_rejected_p: `لقد قمت برفض الطلب. انقر أعلى للمحاولة مرة أخرى.`,

  injectionScreen_failed_h1: `فشل الاتصال`,
  injectionScreen_failed_p: `عذرًا، حدث خطأ ما. يُرجى المحاولة مرة أخرى للاتصال.`,

  injectionScreen_notconnected_h1: `تسجيل الدخول إلى {{ CONNECTORNAME }}`,
  injectionScreen_notconnected_p: `للمتابعة، يُرجى تسجيل الدخول إلى إضافة {{ CONNECTORNAME }}.`,

  profileScreen_heading: 'متصل',

  switchNetworkScreen_heading: 'تبديل الشبكات',

  signInWithEthereumScreen_tooltip:
'أنت غير مسجل الدخول حاليًا إلى هذا التطبيق.\n**سجل الدخول باستخدام إثيريوم** للمتابعة.',

  signInWithEthereumScreen_signedOut_heading: 'سجل الدخول باستخدام إثيريوم',
  signInWithEthereumScreen_signedOut_h1:
'يود هذا التطبيق التحقق منك \n كصاحب لهذه المحفظة.',
  signInWithEthereumScreen_signedOut_p: `يرجى تأكيد طلب الرسالة في محفظتك للمتابعة.`,
  signInWithEthereumScreen_signedOut_button: 'سجل الدخول',

  signInWithEthereumScreen_signedIn_heading: 'تم تسجيل الدخول باستخدام إثيريوم',
  signInWithEthereumScreen_signedIn_h1:
'لقد قمت بتأكيد نفسك كصاحب لهذه المحفظة بنجاح.',
  signInWithEthereumScreen_signedIn_p: `سيتطلب تسجيل الخروج منك إعادة المصادقة مرة أخرى في المستقبل.`,
  signInWithEthereumScreen_signedIn_button: 'تسجيل الخروج',
};

export default arAE;
