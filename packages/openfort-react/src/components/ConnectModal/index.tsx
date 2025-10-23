import { OAuthProvider } from '@openfort/openfort-js'
import { useEffect } from 'react'
import type { ValueOf } from 'viem/_types/types/utils'
import { useAccount } from 'wagmi'
import { getAppName } from '../../defaultConfig'
import { useChainIsSupported } from '../../hooks/useChainIsSupported'
import { useOpenfortCore } from '../../openfort/useOpenfort'
import type { CustomTheme, Languages, Mode, Theme } from '../../types'
import Modal from '../Common/Modal'
import { ConnectKitThemeProvider } from '../ConnectKitThemeProvider/ConnectKitThemeProvider'
import { routes } from '../Openfort/types'
import { useOpenfort } from '../Openfort/useOpenfort'
import About from '../Pages/About'
import Connectors from '../Pages/Connectors'
import DownloadApp from '../Pages/DownloadApp'
import EmailLogin from '../Pages/EmailLogin'
import EmailVerification from '../Pages/EmailVerification'
import ForgotPassword from '../Pages/ForgotPassword'
import LinkEmail from '../Pages/LinkEmail'
import Loading from '../Pages/Loading'
import MobileConnectors from '../Pages/MobileConnectors'
import Onboarding from '../Pages/Onboarding'
import Profile from '../Pages/Profile'
import Providers from '../Pages/Providers'
import RecoverPage from '../Pages/Recover'
import SocialProviders from '../Pages/SoicalProviders'
import SwitchNetworks from '../Pages/SwitchNetworks'
import ConnectUsing from './ConnectUsing'
import ConnectWithMobile from './ConnectWithMobile'

const customThemeDefault: object = {}

const ConnectModal: React.FC<{
  mode?: Mode
  theme?: Theme
  customTheme?: CustomTheme
  lang?: Languages
}> = ({ mode = 'auto', theme = 'auto', customTheme = customThemeDefault, lang = 'en-US' }) => {
  const context = useOpenfort()
  const { logout, user } = useOpenfortCore()
  const { isConnected, chain } = useAccount()
  const chainIsSupported = useChainIsSupported(chain?.id)

  //if chain is unsupported we enforce a "switch chain" prompt
  const closeable = !(context.uiConfig.enforceSupportedChains && isConnected && !chainIsSupported)

  const mainRoutes: ValueOf<typeof routes>[] = [
    routes.PROFILE,
    routes.LOADING,
    routes.PROVIDERS,
    routes.EMAIL_VERIFICATION,
  ]

  const showBackButton =
    (closeable && !mainRoutes.includes(context.route)) || (closeable && context.route === routes.PROVIDERS && user)

  const _showInfoButton = closeable && context.route !== routes.PROFILE

  const onBack = () => {
    if (context.route === routes.CONNECT) {
      context.setRoute(routes.CONNECTORS)
      return
    }

    if (context.route === routes.FORGOT_PASSWORD) {
      context.setRoute(routes.EMAIL_LOGIN)
      return
    }

    if (context.route === routes.CONNECTORS && user) {
      context.setRoute(routes.PROFILE)
      return
    }

    if (context.route === routes.PROVIDERS || context.route === routes.SWITCHNETWORKS) {
      context.setRoute(routes.PROFILE)
      return
    }

    if (context.route === routes.RECOVER || context.route === routes.EMAIL_VERIFICATION) {
      logout()
    }

    context.setRoute(routes.PROVIDERS)
    // }
  }

  const pages: Record<ValueOf<typeof routes>, React.ReactNode> = {
    onboarding: <Onboarding />,
    about: <About />,
    loading: <Loading />,

    socialProviders: <SocialProviders />,

    emailLogin: <EmailLogin />,
    forgotPassword: <ForgotPassword />,
    emailVerification: <EmailVerification />,
    linkEmail: <LinkEmail />,

    download: <DownloadApp />,
    connectors: <Connectors />,
    mobileConnectors: <MobileConnectors />,

    providers: <Providers />,
    connect: <ConnectUsing />,
    profile: <Profile />,
    switchNetworks: <SwitchNetworks />,
    recover: <RecoverPage />,
    connectWithMobile: <ConnectWithMobile />,
  }

  function hide() {
    context.setOpen(false)
  }

  // if auth redirect
  useEffect(() => {
    const url = new URL(window.location.href)
    const provider = url.searchParams.get('openfortAuthProviderUI')
    const emailVerification = url.searchParams.get('openfortEmailVerificationUI')
    const forgotPassword = url.searchParams.get('openfortForgotPasswordUI')

    context.log('Checking for search parameters', url)

    if (emailVerification) {
      context.setOpen(true)
      context.setRoute(routes.EMAIL_VERIFICATION)
      return
    }

    if (forgotPassword) {
      context.setOpen(true)
      context.setRoute(routes.FORGOT_PASSWORD)
      return
    }

    function isProvider(value: string | null): value is OAuthProvider {
      if (!value) return false
      return Object.values(OAuthProvider).includes(value as OAuthProvider)
    }

    if (isProvider(provider)) {
      context.log('Found auth provider', provider)
      context.setOpen(true)
      context.setConnector({ id: provider, type: 'oauth' })
      context.setRoute(routes.CONNECT)
    }
  }, [])

  useEffect(() => context.setMode(mode), [mode])
  useEffect(() => context.setTheme(theme), [theme])
  useEffect(() => context.setCustomTheme(customTheme), [customTheme])
  useEffect(() => context.setLang(lang), [lang])

  /* When pulling data into WalletConnect, it prioritises the og:title tag over the title tag */
  useEffect(() => {
    const appName = getAppName()
    if (!appName || !context.open) return

    const title = document.createElement('meta')
    title.setAttribute('property', 'og:title')
    title.setAttribute('content', appName)
    document.head.prepend(title)

    /*
    // OLD_TODO:  When pulling data into WalletConnect, figure out which icon gets used and replace with appIcon if available 
    const appIcon = getAppIcon();
    const icon = document.createElement('link');
    if (appIcon) {
      icon.setAttribute('rel', 'icon');
      icon.setAttribute('href', appIcon);
      document.head.prepend(icon);
    }*/

    return () => {
      document.head.removeChild(title)
      //if (appIcon) document.head.removeChild(icon);
    }
  }, [context.open])

  return (
    <ConnectKitThemeProvider theme={theme} customTheme={customTheme} mode={mode}>
      <Modal
        open={context.open}
        pages={pages}
        pageId={context.route}
        onClose={closeable ? hide : undefined}
        // TODO: Implement onInfo
        // onInfo={
        //   showInfoButton ? () => context.setRoute(routes.ONBOARDING) : undefined
        // }
        onBack={showBackButton ? onBack : undefined}
      />
    </ConnectKitThemeProvider>
  )
}

export default ConnectModal
