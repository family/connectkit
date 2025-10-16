import { HomeIcon, PencilIcon, PlayIcon, WalletIcon } from '@heroicons/react/24/outline';
import { useStatus } from '@openfort/react';
import { useState } from 'react';
import { BetterAuthCard } from '../../integrations/betterauth';
import { ActionsCard, SignCard, UserProfileCard, WalletListCard } from '../../ui/openfort';
import { DesktopTabGroup, MobileTabGroup, type TabType } from '../ui/Tabs';
import { Head } from './head';

interface LayoutProps {
  children: React.ReactNode;
  step: number;
  tabs?: TabType[];
  currentTab?: TabType;
  setCurrentTab?: (tab: TabType) => void;
  showTabs?: boolean;
}

const Layout = ({ children, step, tabs, currentTab, setCurrentTab, showTabs }: LayoutProps) => {
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
            style={{ transform: `translateX(calc(-${step} * var(--card-width)))` }}
          >
            {children}
          </div>
        </div>
      </div>
    </div>
  );
};

export const Main = () => {
  const { isAuthenticated, isLoading, isConnected } = useStatus();
  const [step, setStep] = useState(0);

  const tabs: TabType[] = [
    {
      name: 'Home',
      component: (
        <UserProfileCard
          sampleGithubUrl="https://github.com/openfort-xyz/quickstarts/tree/main/react/betterauth"
          description="This is a demo app using Better Auth and Openfort."
        />
      ),
      icon: HomeIcon,
    },
    {
      name: 'Signatures',
      component: <SignCard />,
      icon: PencilIcon,
    },
    {
      name: 'Actions',
      component: <ActionsCard />,
      icon: PlayIcon,
    },
    {
      name: 'Wallets',
      component: <WalletListCard />,
      icon: WalletIcon,
    },
  ];
  const [currentTab, setCurrentTab] = useState<TabType>(tabs[0]);

  if (isLoading) {
    return null;
  }

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
        sample="Better Auth"
        color="rgb(0, 0, 0)"
        backgroundColor="rgb(255, 255, 255)"
        logo="/betterauth.svg"
        href="https://www.better-auth.com/"
        subtitle="Example of integration of Openfort with Better Auth"
      />
      {!isAuthenticated ? (
        <BetterAuthCard />
      ) : (
        <div className="block relative overflow-y-auto overflow-x-hidden">
          <div className="card flex-col min-h-full">
            <div className="w-full flex-1 flex">{currentTab.component}</div>
            <MobileTabGroup tabs={tabs} currentTab={currentTab} setCurrentTab={setCurrentTab} />
          </div>
        </div>
      )}
      <div className="card relative" />
    </Layout>
  );
};
