"use client"

import { OpenfortKitButton } from "@openfort/openfort-kit";
import { useEffect } from "react";
import { useSample } from "../components/SampleProvider";

export default function Page() {
  const { setSampleTheme } = useSample();

  useEffect(() => {
    const handleMessage = (event: MessageEvent) => {
      if (event.data?.from != "docs") return;
      // console.log("Received data:", event.data);

      switch (event.data?.type) {
        case "theme":
          setSampleTheme(event.data.theme);
          break;
        case "providers":
          setSampleTheme(event.data.providers);
          break;

      }
    };

    window.addEventListener("message", handleMessage);
    return () => window.removeEventListener("message", handleMessage);
  }, [setSampleTheme]);

  return (
    <div className="flex items-center justify-center min-h-screen">
      <OpenfortKitButton label="Login" />
    </div>
  )
}

