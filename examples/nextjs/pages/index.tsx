"use client"

import { Select, SelectContent, SelectItem, SelectTrigger } from "@radix-ui/react-select"
import { BookOpenText } from "lucide-react"
import Button from "../components/Button"

import { OpenfortKitButton, useIsMounted, useLogout, useModal, useProviders, useUser, useWallets } from "@openfort/openfort-kit"
import { Theme } from "@openfort/openfort-kit/build/types"
import { CaretDownIcon, GitHubLogoIcon } from "@radix-ui/react-icons"
import { useAccount, useEnsName } from "wagmi"
import { useSample } from "../components/SampleProvider"

import { useState } from 'react';
import { Menu, X } from 'lucide-react';

export default function Page() {
  const isMounted = useIsMounted();
  const account = useAccount();
  const { user } = useUser();
  const logout = useLogout();
  const { linkedProviders, availableProviders } = useProviders();
  const { wallets, setActiveWallet, currentWallet } = useWallets();
  const { openSwitchNetworks, setOpen, openProviders, openWallets } = useModal();
  const { sampleTheme, setSampleTheme } = useSample();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <div className="min-h-screen flex flex-col">
      {/* Header */}
      <header className="sticky top-0 z-50 w-full border-b bg-white xl:z-[2147483647]">
        <div className="px-4 md:px-6 py-4">
          <div className="flex items-center justify-between">
            {/* Logo */}
            <div className="flex items-center space-x-4">
              <svg viewBox="0 0 39 11" aria-hidden="true" className="h-6 md:h-8 w-auto">
                <path className="fill-zinc-400" transform="translate(0, 5) scale(0.04)" d="m75.9 72.3h18.2v32.4h-18.2zm94.8 32.3h-18.2v-87.1h-135v87.1h-18.2v-105.2h13.5v-0.1h157.9v0.1zm-36.5-50.7h-0.1v50.7h-18.2v-50.7h-61.9v50.7h-18.2v-66.5-2.4h98.4z" />
              </svg>
              <span className="text-gray-300 hidden md:flex">-</span>
              <p className="font-mono text-orange-600 font-medium">Openfort Kit</p>
            </div>

            {/* Desktop Navigation */}
            <div className="hidden md:flex gap-4">
              <a href="https://www.openfort.xyz/docs/guides/react/" target="_blank">
                <Button variant="outline">
                  <BookOpenText className="h-5 w-5 mr-2" />
                  View Docs
                </Button>
              </a>
              <a href="https://github.com/openfort-xyz/openfort-kit/tree/main/examples/nextjs" target="_blank">
                <Button variant="outline">
                  <GitHubLogoIcon className="h-5 w-5 mr-2" />
                  View on Github
                </Button>
              </a>
              <a href="https://dashboard.openfort.xyz/auth/register" target="_blank">
                <Button>
                  Get started with Openfort →
                </Button>
              </a>
            </div>

            {/* Mobile Menu Button */}
            <button className="md:hidden" onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}>
              {isMobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>

          {/* Mobile Navigation */}
          {isMobileMenuOpen && (
            <div className="md:hidden mt-4 space-y-2 pb-2">
              <a href="https://www.openfort.xyz/docs/guides/react/" target="_blank" className="block">
                <Button variant="outline" className="w-full">
                  <BookOpenText className="h-4 w-4 mr-2" />
                  View Docs
                </Button>
              </a>
              <a href="https://github.com/openfort-xyz/openfort-kit/tree/main/examples/nextjs" target="_blank" className="block">
                <Button variant="outline" className="w-full">
                  <GitHubLogoIcon className="h-4 w-4 mr-2" />
                  View on Github
                </Button>
              </a>
              <a href="https://dashboard.openfort.xyz/auth/register" target="_blank" className="block">
                <Button className="w-full">
                  Get started with Openfort →
                </Button>
              </a>
            </div>
          )}
        </div>
      </header>

      {/* Mobile Login Button */}
      <div className="md:hidden p-4">
        <div className="h-[80px] bg-gray-100 flex items-center justify-center rounded-lg border">
          <OpenfortKitButton label="Login" />
        </div>
      </div>

      {/* Main Content with Sidebar */}
      <div className="flex-1 grid grid-cols-1 md:grid-cols-[300px,1fr]">
        {/* Sidebar */}
        <aside className="order-2 md:order-1 border-t md:border-t-0 md:border-r bg-white xl:z-[2147483647]">
          <div className="p-4 md:p-6 md:sticky md:top-[73px] md:h-full md:flex md:flex-col">
            {/* Login Button - Desktop only */}
            <div className="hidden md:block mb-6">
              <div className="h-[100px] bg-gray-100 flex items-center justify-center rounded-lg border">
                <OpenfortKitButton label="Login" />
              </div>
            </div>

            {/* Theme Selection */}
            <div className="mb-6 relative">
              <h3 className="text-lg font-semibold mb-2">Theme</h3>
              <div className="w-full md:w-40">
                <Select value={sampleTheme} onValueChange={(value) => setSampleTheme(value as Theme)}>
                  <SelectTrigger className="h-9 w-full bg-white shadow-sm rounded-md ring-1 ring-black ring-opacity-5 text-red flex items-center px-4">
                    {sampleTheme}
                    <CaretDownIcon className="h-4 w-4 ml-auto" />
                  </SelectTrigger>
                  <SelectContent
                    position="popper"
                    className="w-[var(--radix-select-trigger-width)] bg-white border rounded-md shadow-md z-50 overflow-hidden"
                    style={{
                      position: 'absolute',
                      top: '100%',
                      left: 0,
                      maxHeight: '300px',
                      overflowY: 'auto'
                    }}
                  >
                    <div className="py-1">
                      {["auto", "web95", "retro", "soft", "midnight", "minimal", "rounded", "nouns"].map((theme) => (
                        <SelectItem
                          className="px-4 py-2 hover:bg-gray-100 cursor-pointer text-sm md:text-base"
                          key={theme}
                          value={theme}
                        >
                          {theme}
                        </SelectItem>
                      ))}
                    </div>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Navigation Buttons */}
            <div className="mb-6">
              <h3 className="text-lg font-semibold mb-2">Open page</h3>
              <div className="grid grid-cols-2 md:grid-cols-1 gap-2">
                <Button onClick={() => setOpen(true)} variant="outline">Default page</Button>
                {user && (
                  <>
                    <Button onClick={() => openSwitchNetworks()} variant="outline">Switch networks</Button>
                    <Button onClick={() => openProviders()} variant="outline">Providers</Button>
                  </>
                )}
                <Button onClick={() => openWallets()} variant="outline">
                  {!user ? "Wallets" : "Link wallets"}
                </Button>
                <Button onClick={() => setOpen(false)}>Close modal</Button>
              </div>
            </div>

            {/* Logout Button */}
            <Button
              onClick={() => logout()}
              disabled={!user}
              className="w-full bg-red-500 md:mt-auto"
            >
              Log out
            </Button>
          </div>
        </aside>

        {/* Main Content */}
        <main className="order-1 md:order-2 p-4 md:p-6">
          <div className="grid gap-4 md:gap-6 auto-rows-min">
            {[
              {
                title: "Address",
                metrics: [
                  { label: "Status", value: account.status },
                  user ? { label: "Account", value: account.address } : {},
                  user ? { label: "Chain ID", value: account.chainId } : {},
                ],
              },
              {
                title: "User",
                metrics: [
                  { label: "ID", value: user?.id },
                  { label: "Linked providers", value: linkedProviders.join(", ") || "None" },
                  { label: "Not linked providers", value: availableProviders.join(", ") || "All providers are linked" },
                ],
                needsUser: true
              },
              {
                title: "Linked wallets",
                metrics: [
                  { label: "Current connector", value: `${account.connector?.name} ${account.connector?.id}` },
                  {
                    label: "Switch connector",
                    value: (
                      <div className="flex gap-2 flex-wrap">
                        {wallets.map((wallet) => (
                          <div key={wallet.id}>
                            <Button
                              onClick={() => setActiveWallet(wallet.id!)}
                              disabled={currentWallet?.id === wallet.id}
                            >
                              {wallet.walletClientType} ({wallet.id})
                            </Button>
                          </div>
                        ))}
                        <Button onClick={() => openWallets()} disabled={!user}>+</Button>
                      </div>
                    )
                  },
                ],
                needsUser: true
              },
            ].map((card, i) => (
              <div key={i} className="rounded-lg border bg-card p-4 md:p-6 shadow-sm relative overflow-x-auto">
                {card.needsUser && !user && (
                  <div className="absolute inset-0 m-2 flex items-center justify-center bg-white/60 backdrop-blur-[5px] rounded-lg" style={{ position: 'absolute', zIndex: 10 }}>
                    <div className="text-center">
                      <h3 className="text-lg font-semibold">{card.title}</h3>
                      <p>Login to view {card.title.toLowerCase()} section</p>
                    </div>
                  </div>
                )}
                <h3 className="text-lg font-semibold mb-4">{card.title}</h3>
                <div className="space-y-4">
                  {card.metrics.map((metric, j) => (
                    <div key={j} className="space-y-1">
                      <div className="text-sm font-medium text-muted-foreground">{metric.label}</div>
                      <div className="text-sm break-words">{metric.value}</div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </main>
      </div>
    </div>
  );
}