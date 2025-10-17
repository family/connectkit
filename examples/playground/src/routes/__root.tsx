import type { Theme } from '@openfort/react'
import { createRootRoute, Outlet, useLocation } from '@tanstack/react-router'
import { useEffect } from 'react'
import { useAccount } from 'wagmi'
import z from 'zod'
import { Nav } from '@/components/Nav'
import { useAppStore } from '@/lib/useAppStore'

export const Route = createRootRoute({
  component: RootComponent,
  validateSearch: z.object({
    focus: z.string().optional(),
  }),
})

const themes: Theme[] = ['auto', 'midnight', 'nouns', 'retro', 'rounded', 'soft', 'web95', 'minimal']

let themeIndex = 0

function RootComponent() {
  const { isConnected } = useAccount()
  const location = useLocation()

  const { setProviderOptions, providerOptions } = useAppStore()

  useEffect(() => {
    const handleKeydown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowRight' || e.key === 'ArrowLeft') {
        const delta = e.key === 'ArrowRight' ? 1 : -1
        themeIndex = (themeIndex + delta + themes.length) % themes.length
        console.log('Switching theme to', themes[themeIndex])

        setProviderOptions({
          ...providerOptions,
          uiConfig: {
            ...providerOptions.uiConfig,
            theme: themes[themeIndex],
          },
        })
      }
    }

    document.addEventListener('keydown', handleKeydown)
    return () => document.removeEventListener('keydown', handleKeydown)
  }, [setProviderOptions, providerOptions])

  return (
    <div className="flex flex-col min-h-screen w-[100vw]">
      <Nav showLogo={location.pathname !== '/showcase/auth' || isConnected} />
      <Outlet />
    </div>
  )
}
