import {
  HomeIcon,
  PencilIcon,
  PlayIcon,
  WalletIcon,
} from '@heroicons/react/24/outline'
import { useUser } from '@openfort/react'
import { useEffect, useState } from 'react'
import { useAccount } from 'wagmi'
import { DesktopTabGroup, MobileTabGroup, type TabType } from '../ui/Tabs'
import { Actions } from './actions'
import { Head } from './head'
import { Profile } from './profile'
import { Sign } from './sign'
import { Wallets } from './wallets'

interface LayoutProps {
  children: React.ReactNode
  step: number
  tabs?: TabType[]
  currentTab?: TabType
  setCurrentTab?: (tab: TabType) => void
  showTabs?: boolean
}

const Layout = ({
  children,
  step,
  tabs,
  currentTab,
  setCurrentTab,
  showTabs,
}: LayoutProps) => {
  return (
    <div className="min-h-screen min-w-screen bg-zinc-900 flex flex-col items-center justify-center">
      <div className="relative">
        <DesktopTabGroup
          tabs={tabs || []}
          currentTab={currentTab}
          setCurrentTab={setCurrentTab}
          showTabs={showTabs}
        />
        <div className="w-(--card-group-width) layout-card-group">
          <div
            className="h-(--card-group-height) grid grid-flow-col auto-cols-max transition-transform duration-500"
            style={{
              transform: `translateX(calc(-${step} * var(--card-width)))`,
            }}
          >
            {children}
          </div>
        </div>
      </div>
    </div>
  )
}

const tabs: TabType[] = [
  {
    name: 'Home',
    component: (
      <Profile
        sampleGithubUrl="https://github.com/openfort-xyz/openfort-react/tree/main/examples/quickstarts/openfort-ui"
        description="This is a demo app using Openfort UI."
      />
    ),
    icon: HomeIcon,
  },
  {
    name: 'Signatures',
    component: <Sign />,
    icon: PencilIcon,
  },
  {
    name: 'Actions',
    component: <Actions />,
    icon: PlayIcon,
  },
  {
    name: 'Wallets',
    component: <Wallets />,
    icon: WalletIcon,
  },
]

export const Main = () => {
  const { isConnected } = useAccount()
  const { isAuthenticated } = useUser()
  const [step, setStep] = useState(0)

  const [currentTab, setCurrentTab] = useState<TabType>(tabs[0])

  useEffect(() => {
    if (!isAuthenticated) {
      setCurrentTab(tabs[0])
    }
  }, [isAuthenticated])

  return (
    <Layout
      step={step}
      showTabs={!!isAuthenticated && !!isConnected}
      tabs={tabs}
      currentTab={currentTab}
      setCurrentTab={setCurrentTab}
    >
      <Head
        onStart={() => setStep(1)}
        sample="React"
        color="rgba(88, 196, 220, 1)"
        logo="/reactLogo.svg"
        href="https://react.dev/"
        subtitle="Get started with Openfort UI"
      />
      <div className="block relative overflow-y-auto overflow-x-hidden">
        <div className="card flex-col min-h-full">
          <div className="w-full flex-1 flex">{currentTab.component}</div>
          <MobileTabGroup
            tabs={tabs}
            currentTab={currentTab}
            setCurrentTab={setCurrentTab}
          />
        </div>
      </div>
      <div className="card relative" />
    </Layout>
  )
}
