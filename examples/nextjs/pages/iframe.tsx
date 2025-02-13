"use client"

import { Select, SelectContent, SelectItem, SelectTrigger } from "@radix-ui/react-select"
import { BookOpenText } from "lucide-react"
import Button from "../components/Button"

import { OpenfortKitButton, useIsMounted, useLogout, useModal, useProviders, useUser, useWallets } from "@openfort/openfort-kit"
import { Theme } from "@openfort/openfort-kit/build/types"
import { CaretDownIcon, GitHubLogoIcon } from "@radix-ui/react-icons"
import { useAccount, useEnsName } from "wagmi"
import { useSample } from "../components/SampleProvider"
import { useEffect } from "react"

export default function Page() {
  const { setSampleTheme } = useSample();

  useEffect(() => {
    const handleMessage = (event: MessageEvent) => {
      if (event.data?.from != "docs") return;
      console.log("Received data:", event.data);

      switch (event.data?.type) {
        case "theme":
          setSampleTheme(event.data.theme);
          break;

      }
    };

    window.addEventListener("message", handleMessage);
    return () => window.removeEventListener("message", handleMessage);
  }, [setSampleTheme]);

  return (
    <div className="flex items-center justify-center min-h-screen">
      <OpenfortKitButton />
    </div>
  )
}

