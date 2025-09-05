import { createUserWithEmailAndPassword, GoogleAuthProvider, signInWithEmailAndPassword, signInWithPopup, type UserCredential } from "firebase/auth";
import React, { useState } from "react";
import { auth } from "../../lib/firebase";

const GoogleSignInButton: React.FC = () => {
  // Sign in with Google
  const signInWithGoogle = async (): Promise<UserCredential> => {
    const provider = new GoogleAuthProvider();
    return signInWithPopup(auth, provider);
  };

  return (
    <button
      onClick={signInWithGoogle}
      className="w-full py-2 px-4 border border-zinc-700 text-white rounded cursor-pointer transition-colors hover:bg-zinc-900/60"
    >
      Continue with Google
    </button>
  );
};

const EmailForm = ({ isLogin }: { isLogin: boolean }) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    const form = event.target as HTMLFormElement;
    const email = (form.elements[0] as HTMLInputElement).value;
    const password = (form.elements[1] as HTMLInputElement).value;
    try {
      setLoading(true);
      if (isLogin) {
        await signInWithEmailAndPassword(auth, email, password);
      } else {
        await createUserWithEmailAndPassword(auth, email, password);
      }
    } catch (error) {
      console.error("Authentication error", error);
      setError((error as Error).message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 mb-4">
      <label
        className="block text-left text-sm font-medium mb-1"
        htmlFor="email"
      >
        Email
      </label>
      <input
        id="email"
        type="email"
        placeholder="Enter your email address"
        required
      />
      <div>
        <label
          className="block text-left text-sm font-medium mb-1"
          htmlFor="password"
        >
          Password
        </label>
        <input
          id="password"
          type="password"
          placeholder="Enter your password"
          required
        />
      </div>
      {error && <p className="text-red-500 text-sm">{error}</p>}

      <button
        type="submit"
        className="btn mt-2"
      >
        {loading ? "Loading..." : isLogin ? "Sign In" : "Sign Up"}
      </button>
    </form>
  )
}

const AuthForm = () => {
  const [isLogin, setIsLogin] = useState(true);

  return (
    <div className="space-y-6">
      <div className="relative">
        <h1 className="text-left text-2xl font-semibold tracking-tight">
          {isLogin ? "Sign in to account" : "Create an account"}
        </h1>
      </div>

      <EmailForm isLogin={isLogin} />

      <div className="relative opacity-80 mb-4">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-gray-300" />
        </div>
        <div className="relative flex justify-center text-sm">
          <span className="bg-zinc-800 px-2">
            or
          </span>
        </div>
      </div>

      <GoogleSignInButton />

      <div className="text-left text-sm">
        {isLogin ? "Already have an account? " : "Don't have an account? "}
        <button
          onClick={() => setIsLogin(!isLogin)}
          className="text-primary hover:underline cursor-pointer font-medium"
        >
          {isLogin ? "Sign Up" : "Sign In"}
        </button>
      </div>
    </div>
  );
}

export const Auth = () => {

  return (
    <div className="card relative">
      <AuthForm />
    </div>
  )
}
