"use client"

import Image from "next/image"
import { ArrowDown, BellIcon, BookIcon, BookOpen, BookOpenIcon, BookOpenText, MenuIcon } from "lucide-react"
import Button from "../components/Button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@radix-ui/react-select"
import { OpenfortKitButton } from "@openfort/openfort-kit"

import { useIsMounted, useModal, useOpenfort, useProviders, useWallets } from "@openfort/openfort-kit";
import { useAccount, useEnsName } from "wagmi";
import { CaretDownIcon, GitHubLogoIcon } from "@radix-ui/react-icons"
import { useSample } from "../components/SampleProvider"
import { Theme } from "@openfort/openfort-kit/build/types"

export default function Page() {
  const isMounted = useIsMounted();
  const account = useAccount();
  const { data: ensName } = useEnsName({ address: account.address })
  const { user, logout } = useOpenfort()
  const { linkedProviders, availableProviders } = useProviders()
  const { wallets, setActiveWallet, currentWallet } = useWallets()
  const { openSwitchNetworks, setOpen, openProviders, openWallets } = useModal();

  const { sampleTheme, setSampleTheme } = useSample();

  return (
    <>
      {/* Header */}
      <header className="fixed h-20 w-full border-b px-6 py-3 flex items-center z-[2147483647] bg-white">
        <div className="max-w-7xl mx-auto col-span-2 flex items-center w-full justify-between">
          <div className="flex items-center space-x-4">
            <svg
              viewBox="0 0 39 11"
              aria-hidden="true"
              className="h-8 w-auto md:flex hidden"
            >
              <path
                className="fill-zinc-400"
                transform="translate(0, 5) scale(0.04)"
                d="m75.9 72.3h18.2v32.4h-18.2zm94.8 32.3h-18.2v-87.1h-135v87.1h-18.2v-105.2h13.5v-0.1h157.9v0.1zm-36.5-50.7h-0.1v50.7h-18.2v-50.7h-61.9v50.7h-18.2v-66.5-2.4h98.4z"
              ></path>
              <path
                className="fill-zinc-400"
                transform="scale(0.04) translate(220, 90)"
                d="m48.4 137.1q-14.9 0-25.8-6.7-10.9-6.7-16.8-18.5-5.9-11.7-5.9-27.1 0-15.5 6.1-27.3 6-11.7 16.9-18.3 10.9-6.5 25.5-6.5 14.8 0 25.7 6.6 10.9 6.7 16.9 18.5 5.9 11.7 5.9 27 0 15.5-6 27.2-6 11.8-16.9 18.4-10.9 6.7-25.6 6.7zm0-18.1q14.2 0 21.2-9.5 7-9.6 7-24.7 0-15.5-7.1-24.8-7.1-9.3-21.1-9.3-9.6 0-15.9 4.4-6.2 4.3-9.2 12-3 7.6-3 17.7 0 15.5 7.1 24.9 7.2 9.3 21 9.3zm68.6 59.3v-142.9h17v8.9q2.6-2.7 5.6-4.8 9.5-6.8 23.5-6.8 14 0 24.1 6.8 10.1 6.8 15.6 18.6 5.5 11.8 5.5 26.7 0 14.8-5.5 26.7-5.4 11.8-15.4 18.7-10.1 6.9-23.9 6.9-14.2 0-23.8-6.9-1.8-1.3-3.5-2.8v50.9c0 0-19.2 0-19.2 0zm43.9-58.5q9.1 0 15.1-4.7 6-4.7 9-12.6 3-7.9 3-17.7 0-9.7-3-17.6-3-7.9-9.1-12.5-6.1-4.7-15.7-4.7-8.9 0-14.8 4.4-5.8 4.4-8.6 12.3-2.8 7.8-2.8 18.1 0 10.3 2.8 18.1 2.7 7.9 8.7 12.4 5.9 4.5 15.4 4.5zm111.4 17.3q-14.7 0-25.8-6.5-11.2-6.4-17.4-18-6.1-11.6-6.1-26.9 0-16.2 6-28.1 6.1-11.9 17-18.4 10.9-6.5 25.4-6.5 15.1 0 25.7 7 10.7 7 15.9 19.9 5.3 12.9 4.2 30.7h-9.5v-0.3h-9.6v0.3h-54.1v0.7h-0.4q1.1 11.9 6.9 19.1 7.3 8.9 20.9 9 9 0 15.5-4.1 6.6-4.1 10.2-11.7l18.8 5.9q-5.8 13.3-17.5 20.6-11.7 7.3-26.1 7.3zm19.2-79.2q-6.4-8.3-19.4-8.3-14.3 0-21.6 9.1-4.9 6.2-6.5 16.2v0.5l53-0.1v-0.3h0.5q-1.3-11-6-17.1zm43.4 76.4v-98.9h17.1v11.9q4.1-5.2 9.9-8.8 9.5-5.7 22.8-5.7 10.3 0 17.3 3.3 6.9 3.3 11.3 8.6 4.3 5.4 6.6 11.7 2.3 6.3 3.1 12.4 0.8 6 0.8 10.6v55h-19.4v-48.7q0-5.8-0.9-11.9-1-6-3.7-11.3-2.7-5.2-7.6-8.4-4.9-3.2-12.8-3.2-5.1 0-9.7 1.7-4.6 1.7-8 5.4-3.4 3.8-5.4 9.9-2 6.2-2 15v51.4zm105.4-83.5v-15.4h16.4v-3.5q0-3.7 0.3-8 0.3-4.2 1.6-8.4 1.3-4.2 4.5-7.7 3.7-4.1 8.2-5.8 4.5-1.8 8.9-2 4.5-0.3 8.2-0.3h12.5v15.8h-11.5q-6.8-0.1-10.2 3.3-3.3 3.3-3.3 9.5v7.1h25v15.4h-25v83.5h-19.2v-83.5zm114.5 86.3q-14.8 0-25.7-6.7-10.9-6.7-16.8-18.5-5.9-11.7-5.9-27.1 0-15.5 6-27.3 6.1-11.7 17-18.3 10.9-6.5 25.4-6.5 14.9 0 25.8 6.6 10.9 6.7 16.8 18.5 6 11.7 6 27 0 15.5-6 27.2-6 11.8-16.9 18.4-10.9 6.7-25.7 6.7zm0-18.1q14.2 0 21.2-9.5 7-9.6 7-24.7 0-15.5-7.1-24.8-7.1-9.3-21.1-9.3-9.6 0-15.8 4.4-6.3 4.3-9.3 12-3 7.6-3 17.7 0 15.5 7.1 24.9 7.2 9.3 21 9.3zm68.7-83.6h17.1v15.8q1.1-1.9 2.3-3.7 3-3.9 6.8-6.5 3.8-2.8 8.4-4.3 4.6-1.5 9.5-1.8 4.8-0.3 9.3 0.5v17.9q-4.8-1.2-10.7-0.7-5.9 0.6-10.9 3.8-4.7 3-7.4 7.3-2.7 4.3-3.9 9.6-1.2 5.2-1.2 11.1v49.9h-19.3zm17.1 15.8q-0.5 0.9-1 1.8h1zm42.7-0.4v-15.4h19v-27.5h19.2v27.5h29.4v15.4h-29.4v43.7q0 5.9 0.2 10.3 0.1 4.4 1.9 7.4 3.2 5.7 10.4 6.5 7.2 0.8 16.9-0.6v16.2q-9.3 1.9-18.3 1.6-9-0.3-16-3.5-7.1-3.2-10.7-10.1-3.2-6.1-3.4-12.5-0.2-6.3-0.2-14.4v-44.6z"
              ></path>
            </svg>
            <span
              className="text-gray-300 md:flex hidden"
            >-</span>
            <p className="font-mono text-orange-600 font-medium pt-2">
              Openfort Kit
            </p>
          </div>
          <div className="space-x-2 flex pointer-events-auto">
            <a
              target="_blank"
              href="https://www.openfort.xyz/docs/guides/getting-started"
            >
              <Button variant="outline">
                <BookOpenText className="h-5 w-5 mr-2" />
                {"View Docs"}
              </Button>
            </a>
            <a
              target="_blank"
              href="https://github.com/openfort-xyz/openfort-kit/tree/main/examples/nextjs"
            >
              <Button variant="outline">
                <GitHubLogoIcon className="h-5 w-5 mr-2" />
                {"View on Github"}
              </Button>
            </a>
            <a
              target="_blank"
              href="https://dashboard.openfort.xyz/auth/register"
            >
              <Button>
                {"Get started with Openfort ->"}
              </Button>
            </a>
          </div>
        </div>
      </header>

      <div className="relative pt-20 min-h-screen grid grid-cols-[300px,1fr] max-w-7xl mx-auto">


        {/* Right Sidebar */}
        <aside className="relative border-r p-6  z-[2147483647]">
          <div className="absolute right-0 top-0 bottom-0 bg-white w-screen"></div>
          <div className="relative flex flex-col h-full">
            <div className="mb-6 flex h-[100px] bg-gray-100 items-center justify-center rounded-lg border bg-muted">
              <OpenfortKitButton />
            </div>
            <div className="">
              <h3 className="text-lg font-semibold">Theme</h3>
              <div className="w-40">
                <Select value={sampleTheme} onValueChange={(value) => setSampleTheme(value as Theme)}>
                  <SelectTrigger className="h-9 w-full bg-white shadow-sm rounded-md ring-1 ring-black ring-opacity-5 text-red flex items-center px-4">
                    {sampleTheme}
                    <CaretDownIcon className="h-4 w-4 ml-auto" />
                  </SelectTrigger>
                  <SelectContent className="bg-white shadow-lg rounded-md ring-1 ring-black ring-opacity-5 w-full">
                    {
                      [
                        "auto", "web95", "retro", "soft", "midnight", "minimal", "rounded", "nouns"
                      ].map((theme) => (
                        <SelectItem
                          className="p-2 hover:bg-gray-100 cursor-pointer rounded-md w-40 text pl-4"
                          key={theme} value={theme}
                        >
                          {theme}
                        </SelectItem>
                      ))
                    }
                  </SelectContent>
                </Select>

              </div>
              {/* <div className="rounded-lg border bg-card p-4">
              <h4 className="font-medium">Quick Stats</h4>
              <p className="mt-2 text-sm text-muted-foreground">
                Your account has shown a 12% increase in activity over the last 7 days.
              </p>
            </div> */}
            </div>
            <div className="flex gap-2 mt-2 flex-col">
              <h3 className="text-lg font-semibold">Open page</h3>
              <div>
                <Button
                  onClick={() => { setOpen(true) }}
                  variant="outline"
                >
                  Default page
                </Button>
              </div>
              {
                user && (
                  <>
                    <div>
                      <Button
                        onClick={() => openSwitchNetworks()}
                        variant="outline"
                      >
                        Switch networks page
                      </Button>
                    </div>
                    <div>
                      <Button
                        onClick={() => openProviders()}
                        variant="outline"
                      >
                        Providers page
                      </Button>
                    </div>
                  </>
                )
              }
              <div>
                <Button
                  onClick={() => openWallets()}
                  variant="outline"
                >
                  {!user ? "Wallets page" : "Link wallets page"}
                </Button>
              </div>
            </div>
            <div className="mt-auto">
              <Button
                onClick={() => logout()}
                disabled={!user}
                className="bg-red-500"
              >
                Log out
              </Button>
            </div>
          </div>
        </aside >

        {/* Main Content */}
        <main className="p-6 relative" >
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-2">
            {[
              {
                title: "Address",
                metrics: [
                  {
                    label: "Status",
                    value: account.status,
                  },
                  user ? {
                    label: "Account",
                    value: account.address,
                  } : {},
                  user ? {
                    label: "Chain ID",
                    value: account.chainId,
                  } : {},
                ],
              },
              {
                title: "User",
                metrics: [
                  {
                    label: "Player",
                    value: user?.id
                  },
                  {
                    label: "Linked providers",
                    value: linkedProviders.join(", ")
                  },
                  {
                    label: "Not linked providers",
                    value: availableProviders.join(", ")
                  },
                ],
                needsUser: true
              },
              {
                title: "Linked wallets",
                metrics: [
                  {
                    label: "Current connector",
                    value: `${account.connector?.name} ${account.connector?.id}`
                  },
                  {
                    label: "Switch connector",
                    value: <div className="flex gap-2 flex-wrap">
                      {
                        wallets.map((wallet) => (

                          <div key={wallet.id}>
                            <Button
                              onClick={() => setActiveWallet(wallet.id!)}
                              disabled={currentWallet?.id === wallet.id}
                            >
                              {wallet.walletClientType} ({wallet.id})
                            </Button>
                          </div>
                        ))}
                      <Button
                        onClick={() => openWallets()}
                        disabled={!user}
                      >
                        +
                      </Button>
                    </div>
                  },
                ],
                needsUser: true
              },
            ].map((card, i) => (
              <div key={i} className="relative rounded-lg border bg-card p-6 shadow-sm">
                {
                  card.needsUser && !user && (
                    <div
                      className="p-10 text-center bg-white/60 absolute inset-0 z-10 m-2 flex items-center justify-center gap-2 flex-col"
                      style={{ backdropFilter: "blur(5px)" }}
                    >
                      <h3 className="text-lg font-semibold">{card.title}</h3>
                      <div>
                        Connect wallet to view {card.title.toLowerCase()} section
                      </div>
                    </div>
                  )
                }

                <h3 className="text-lg font-semibold mb-4">{card.title}</h3>
                <div className="space-y-6">
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
        </main >
      </div >
    </>
  )
}

