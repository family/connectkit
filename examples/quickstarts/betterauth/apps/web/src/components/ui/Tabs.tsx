export type TabType = {
  name: string
  component: React.ReactNode
  icon: React.ComponentType<React.SVGProps<SVGSVGElement>>
}

type TabProps = {
  onClick?: () => void
  isActive?: boolean
} & TabType

const DesktopTab = ({ name, isActive, ...buttonProps }: TabProps) => {
  return (
    <button
      className="relative h-8 mx-2.5 transition-colors cursor-pointer"
      style={
        {
          '--tab-bg-color': isActive ? 'var(--color-zinc-800)' : 'var(--color-zinc-700)',
          opacity: isActive ? 1 : 0.6,
        } as React.CSSProperties
      }
      {...buttonProps}
    >
      <div className="absolute w-5 h-8 bg-(--tab-bg-color) rotate-20 transform origin-top-left top-1" />
      <div className="absolute w-5 h-8 bg-(--tab-bg-color) -rotate-20 transform origin-top-right right-0 top-1" />
      <div className="absolute inset-0 rounded-md bg-(--tab-bg-color)" />

      <span
        className={`${isActive ? 'text-white' : 'text-zinc-400'} whitespace-nowrap bg-(--tab-bg-color) z-10 relative mx-2 pb-4`}
      >
        {name}
      </span>
    </button>
  )
}

type TabGroupProps = {
  tabs: TabType[]
  currentTab?: TabType
  setCurrentTab?: (tab: TabType) => void
  showTabs?: boolean
}

export const DesktopTabGroup = ({ tabs, currentTab, setCurrentTab, showTabs }: TabGroupProps) => {
  return (
    <div className="absolute left-[100%] top-2 rotate-90 transform origin-top-left hidden xs:block">
      <div
        className="flex gap-2 transition-transform duration-500"
        style={{ transform: showTabs ? 'translateY(-100%)' : 'translateY(10px)' }}
      >
        {tabs?.map((tab) => (
          <DesktopTab
            key={tab.name}
            onClick={() => setCurrentTab?.(tab)}
            isActive={currentTab?.name === tab.name}
            {...tab}
          />
        ))}
      </div>
    </div>
  )
}

const MobileTab = ({ name, isActive, icon: Icon, ...buttonProps }: TabProps) => {
  return (
    <button className="relative h-8 mx-2.5 transition-colors cursor-pointer" {...buttonProps}>
      <Icon className="h-5 w-5 mx-auto mb-1" />
      <span className={`${isActive ? 'text-white' : 'text-zinc-400'} whitespace-nowrap`}>{name}</span>
    </button>
  )
}

export const MobileTabGroup = ({ tabs, currentTab, setCurrentTab }: TabGroupProps) => {
  return (
    <div className="mt-auto xs:hidden flex pt-6 pb-2 items-end justify-between text-zinc-400 text-sm">
      {tabs?.map((tab) => (
        <MobileTab
          key={tab.name}
          onClick={() => setCurrentTab?.(tab)}
          isActive={currentTab?.name === tab.name}
          {...tab}
        />
      ))}
    </div>
  )
}
