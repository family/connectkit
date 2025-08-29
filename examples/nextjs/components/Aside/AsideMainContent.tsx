"use client"

import { Select, SelectContent, SelectItem, SelectTrigger } from "@radix-ui/react-select"
import { ArrowRight, ExternalLink, LockIcon } from "lucide-react"

import { RecoveryMethod, useSignOut, useUI, useUser } from "@openfort/react"
import { Theme } from "@openfort/react"
import { CaretDownIcon } from "@radix-ui/react-icons"

import Button from "../Button"
import { CheckBox } from "../CheckBox"
import { useSample } from "../SampleProvider"
import { AsideContentType } from "./types"


type Props = {
  setContent: (content: AsideContentType) => void;
}

export const AsideMainContent = ({ setContent }: Props) => {
  const { user } = useUser();
  const { signOuta: signOut } = useSignOut();
  const { openSwitchNetworks, open, close, openProviders, openWallets } = useUI();
  const { sampleTheme, setSampleTheme, recoveryMethod, setRecoveryMethod } = useSample();

  return (
    <>
      {/* Theme Selection */}
      <div className="mb-6 relative">
        <h3 className="text-lg font-semibold mb-2">Theme</h3>
        <div className="w-full">
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
              <div className="pt-1">
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
              <a
                href="https://docs.family.co/connectkit/theme-builder"
                rel="noopener noreferrer"
                target="_blank"
                className="py-1 border-t px-4 py-2 m-0 w-full hover:bg-gray-100 cursor-pointer text-sm md:text-base"
              >
                custom theme
                <ExternalLink className="h-3 w-3 inline-block ml-1" />
              </a>
            </SelectContent>
          </Select>
        </div>
      </div >

      {/* Login methods */}
      <div className="mb-6" >
        <h3 className="text-lg font-semibold mb-2">
          Login methods
        </h3>
        <div className="grid grid-cols-2 md:grid-cols-1 gap-2 ">
          <Button onClick={() => setContent("providers")} variant="outline" className="group">
            Edit providers
            <ArrowRight className="h-4 w-4 ml-2 group-hover:translate-x-1 transition-all duration-300" />
          </Button>

          <CheckBox
            checked={recoveryMethod === RecoveryMethod.PASSWORD}
            onChange={() => setRecoveryMethod(recoveryMethod === RecoveryMethod.AUTOMATIC ? RecoveryMethod.PASSWORD : RecoveryMethod.AUTOMATIC)}
          >
            <LockIcon className="ms-2 h-3 w-3" strokeWidth={2.5} />
            <span className="ms-1 text-sm font-medium select-none">
              Recovery phrase
            </span>
          </CheckBox>

        </div>
      </div>

      {/* Navigation Buttons */}
      <div className="mb-6" >
        <h3 className="text-lg font-semibold mb-2">Open page</h3>
        <div className="grid grid-cols-2 md:grid-cols-1 gap-2">
          <Button onClick={() => open()} variant="outline">Default page</Button>
          {user && (
            <>
              <Button onClick={() => openSwitchNetworks()} variant="outline">Switch networks</Button>
              <Button onClick={() => openProviders()} variant="outline">Providers</Button>
            </>
          )}
          <Button onClick={() => openWallets()} variant="outline">
            {!user ? "Wallets" : "Link wallets"}
          </Button>
          <Button onClick={() => close()}>Close modal</Button>
        </div>
      </div >

      {/* Logout Button */}
      <Button
        onClick={() => signOut()}
        disabled={!user}
        className="w-full bg-red-500 md:mt-auto"
      >
        Log out
      </Button >
    </>
  )
}