import { Outlet, createRootRoute } from '@tanstack/react-router';
import { Nav, NavRoute } from '../components/Nav';
import { OpenfortKitButton } from '@openfort/openfort-kit';
import { ModeToggle } from '@/components/mode-toggle';

export const Route = createRootRoute({
  component: RootComponent,
})

const navRoutes: NavRoute[] = [
  {
    href: '/',
    label: 'Provider',
    exact: true,
  },
  {
    href: '/auth',
    label: 'Auth'
  },
  {
    href: '/user',
    label: 'User'
  },
  {
    href: '/wallet',
    label: 'Wallet'
  },
  {
    href: '/ui',
    label: 'UI Hooks'
  },
  {
    href: '/wagmi',
    label: 'Wagmi Hooks'
  },
]

function RootComponent() {

  return (
    <div className='w-screen h-screen bg-white bg-background dark:bg-background text-zinc-900 dark:text-white flex overflow-hidden'>
      <div className='w-xs border-r border-zinc-200 dark:border-zinc-700'>
        <div className='w-full h-40 flex items-center justify-center bg-gray-100 dark:bg-zinc-900'>
          <OpenfortKitButton />
        </div>
        <div className='border-20 border-red-900 p-4 m-4 bg-red-50 dark:bg-red-900/30 rounded'>
          <button
            onClick={() => {
              localStorage.removeItem("openfort.account");
              // window.location.reload();
            }}> fix</button>
        </div>
      </div>
      <div className='flex-1 overflow-hidden flex flex-col'>
        <Nav navRoutes={navRoutes} >
          <ModeToggle className="scale-110 ml-auto" />
        </Nav>
        <Outlet />
      </div>
    </div>
  )
}
