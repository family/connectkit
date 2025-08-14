"use client"

import { OpenfortButton } from "../../../packages/react/build";
import { useEffect } from "react";
import { useSample } from "../components/SampleProvider";

export default function Page() {
  const { setSampleTheme, setSampleProviders } = useSample();

  useEffect(() => {
    const handleMessage = (event: MessageEvent) => {
      if (event.data?.from !== "docs") return;
      console.log("Received data:", event.data);

      switch (event.data?.type) {
        case "theme":
          setSampleTheme(event.data.theme);
          break;
        case "providers":
          setSampleProviders(event.data.providers);
          break;
        case "bg":
          document.documentElement.style.setProperty('--color-background', event.data.bg);
          break;

      }
    };

    window.addEventListener("message", handleMessage);
    return () => window.removeEventListener("message", handleMessage);
  }, [setSampleTheme, setSampleProviders]);

  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="relative inline-block">
        <OpenfortButton label="Login" />
        <div className="absolute left-1/2 -translate-x-1/2 bottom-full mb-2 px-3 py-2 text-sm text-white bg-gray-800 rounded-lg transition-opacity duration-300 w-max max-w-xs animate-bounce-subtle font-semibold">
          Try me!
          <div className="absolute left-1/2 -translate-x-1/2 top-full w-0 h-0 border-l-[6px] border-l-transparent border-r-[6px] border-r-transparent border-t-[6px] border-t-gray-800"></div>
        </div>
      </div>

      <style jsx global>{`
        @keyframes bounce-subtle {
          0%, 100% {
            transform: translateY(0) translateX(-50%);
          }
          50% {
            transform: translateY(-10px) translateX(-50%);
          }
        }
        .animate-bounce-subtle {
          animation: bounce-subtle 2s infinite;
        }
      `}</style>
    </div>
  )
}

