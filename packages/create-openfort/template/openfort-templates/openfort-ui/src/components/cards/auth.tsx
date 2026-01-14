import { OpenfortButton } from '@openfort/react'

const codeSnippet = `import { OpenfortButton } from "@openfort/react";

export const SampleComponent = () =>  {
  return (  
    <OpenfortButton />
  );
};
`

export const Auth = () => {
  return (
    <div className="space-y-6">
      <div className="relative">
        <h1 className="text-left text-2xl font-semibold tracking-tight">
          Sign in with Openfort UI
        </h1>
      </div>
      <div className="text-sm text-zinc-400">
        Start building with Openfort UI. A React component library that makes it
        easy to integrate Openfort into your React applications.
      </div>

      <div className="border border-2 border-dashed border-zinc-500 rounded p-4 w-full">
        <h2 className="mb-2">Get Started</h2>
        <p className="mb-3 text-zinc-400 text-xs">
          Click the button below to sign in with Openfort. This will open a
          modal where you can choose your authentication method.
        </p>
        <OpenfortButton label="Sign In" />
      </div>
      <div className="mt-8 space-y-2">
        <h2>Code Example</h2>
        <pre className="text-xs bg-zinc-900 p-2 text-zinc-400 rounded overflow-x-auto">
          {codeSnippet}
        </pre>
      </div>
    </div>
  )
}
