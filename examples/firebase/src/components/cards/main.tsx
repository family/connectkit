import { useStatus } from "@openfort/react";
import { useState } from "react";
import { Auth } from "./auth";
import { Head } from "./head";
import { Sample } from "./sample";
import type { TabType } from "../tabs/types";
import { Sign } from "./sign";
import { Wallets } from "./wallets";
import { Profile } from "./profile";
import { Actions } from "./actions";


type TabProps = {
  onClick?: () => void;
  isActive?: boolean;
} & TabType;

const Tab = ({ name, isActive, ...buttonProps }: TabProps) => {
  return (
    <button
      className="relative h-8 mx-2.5 transition-colors cursor-pointer"
      style={{
        "--tab-bg-color": isActive ? "var(--color-zinc-800)" : "var(--color-zinc-700)",
        opacity: isActive ? 1 : 0.6,
      } as React.CSSProperties}
      {...buttonProps}
    >
      <div className="absolute w-5 h-8 bg-(--tab-bg-color) rotate-20 transform origin-top-left top-1" />
      <div className="absolute w-5 h-8 bg-(--tab-bg-color) -rotate-20 transform origin-top-right right-0 top-1" />
      <div className="absolute inset-0 rounded-md bg-(--tab-bg-color)" />

      <span
        className={`${isActive ? "text-white" : "text-zinc-400"} whitespace-nowrap bg-(--tab-bg-color) z-10 relative mx-2 pb-4`}
      >
        {name}
      </span>
    </button>
  )
}

interface TabGroupProps {
  tabs: TabType[],
  currentTab?: TabType,
  setCurrentTab?: (tab: TabType) => void
  showTabs?: boolean
}

const TabGroup = ({ tabs, currentTab, setCurrentTab, showTabs }: TabGroupProps) => {
  return (
    <div
      className="absolute left-[100%] top-2 rotate-90 transform origin-top-left hidden xs:block"
    >
      <div
        className="flex gap-2 transition-transform duration-500"
        style={{ transform: showTabs ? "translateY(-100%)" : "translateY(10px)" }}
      >
        {tabs?.map((tab) => (
          <Tab
            key={tab.name}
            onClick={() => setCurrentTab && setCurrentTab(tab)}
            isActive={currentTab?.name === tab.name}
            {...tab}
          />
        ))}
      </div>
    </div>
  )
}

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
        <TabGroup
          tabs={tabs || []}
          currentTab={currentTab}
          setCurrentTab={setCurrentTab}
          showTabs={showTabs}
        />
        <div
          className="w-(--card-group-width) layout-card-group"
        >
          <div
            className="h-(--card-group-height) grid grid-flow-col auto-cols-max transition-transform duration-500"
            style={{ transform: `translateX(calc(-${step} * var(--card-width)))` }}
          >
            {children}
          </div>
        </div>
      </div>
    </div>
  )
}


export const Main = () => {
  const { isAuthenticated, isLoading, isConnected } = useStatus();
  const [step, setStep] = useState(0);

  const tabs: TabType[] = [
    {
      name: "Home",
      component: <Profile />
    },
    {
      name: "Signatures",
      component: <Sign />
    },
    {
      name: "Actions",
      component: <Actions />
    },
    {
      name: "Wallets",
      component: <Wallets />
    },
  ];

  const [currentTab, setCurrentTab] = useState<TabType>(tabs[0]);

  console.log({ isAuthenticated, isConnected });

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
      <Head onStart={() => setStep(1)} />
      {
        !isAuthenticated || !isConnected ? (
          <Auth />
        ) : (
          <Sample
            tab={currentTab}
          />
        )
      }
      <div className="card relative" />
    </Layout>
  );
};