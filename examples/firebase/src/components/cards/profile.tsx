import { useUser } from "@openfort/react";
import { auth } from "../../lib/firebase";

export const Profile = () => {
  const { user } = useUser();
  // const { signOut } = useSignOut();

  return (
    <div className="flex flex-col flex-1">
      <h2>
        Welcome, {user?.player?.name || user?.linkedAccounts[0].email}
      </h2>

      <button
        onClick={() => {
          // signOut();
          auth.signOut();
        }}
        className="mt-auto w-full py-2 px-4 bg-primary text-white rounded cursor-pointer hover:bg-primary-hover transition-colors"
      >
        Sign Out
      </button>
    </div>
  );
}