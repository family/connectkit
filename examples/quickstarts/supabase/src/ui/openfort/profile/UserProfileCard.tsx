import { BookOpenIcon } from "@heroicons/react/24/outline";
import { useUser } from "@openfort/react";
import { useAccount } from "wagmi";

import { supabase } from "../../../integrations/supabase";
import { WalletListCard } from "../wallets/WalletListCard";

type UserProfileCardProps = {
  sampleGithubUrl: string;
  description: string;
};

export function UserProfileCard({ sampleGithubUrl, description }: UserProfileCardProps) {
  const { user } = useUser();
  const { isConnected } = useAccount();
  const isLocal = window.location.hostname === "localhost";

  if (!isConnected) {
    return <WalletListCard />;
  }

  return (
    <div className="flex flex-col flex-1 gap-4">
      <h1>Welcome, {user?.player?.name || user?.linkedAccounts[0].email}</h1>
      <p className="text-zinc-400 text-sm">
        {description}
        <br />
        You can sign messages and interact with smart contracts.
      </p>

      <div className="border border-zinc-700 rounded p-4">
        <h2 className="mb-2">Get started</h2>
        <p className="mb-2 text-zinc-400 text-sm">Start by creating a wallet, minting some tokens and signing messages.</p>
        {isLocal ? (
          <p className="mb-2 text-sm">
            Edit <code>src/components/cards/main.tsx</code> to customize the app.
          </p>
        ) : (
          <p className="mb-2 text-sm">Clone this project and test it yourself, it is open source!</p>
        )}
        <div className="flex gap-4 mt-4">
          <a
            href={sampleGithubUrl}
            className="btn bg-inherit border border-zinc-600 hover:border-zinc-400 text-zinc-400 hover:text-white"
            target="_blank"
            rel="noreferrer"
          >
            <img src="/githubLogo.svg" className="w-5 h-5 mr-2" alt="GitHub logo" />
            View on github
          </a>
          <a
            href="https://www.openfort.io/docs/products/embedded-wallet/react"
            target="_blank"
            rel="noreferrer"
            className="btn"
          >
            <BookOpenIcon className="h-5 w-5 mr-2" />
            View docs
          </a>
        </div>
      </div>

      <button
        onClick={async () => {
          await supabase.auth.signOut();
        }}
        className="btn mt-auto"
      >
        Sign Out
      </button>
    </div>
  );
}
