<a href="https://docs.family.co/connectkit">
  <img width="1080" alt="connectkit" src="https://github.com/family/connectkit/assets/1930210/87c2e868-3228-44b8-82c3-a38adf6d1bbf">
</a>

# ConnectKit

ConnectKit is a powerful [React](https://reactjs.org/) component library for connecting a wallet to your dApp. It supports the most popular connectors and chains out of the box and provides a beautiful, seamless experience.

## Features

- 💡 TypeScript Ready — Get types straight out of the box.
- 🌱 Ecosystem Standards — Uses top libraries such as [wagmi](https://github.com/wagmi-dev/wagmi).
- 🖥️ Simple UX — Give users a simple, attractive experience.
- 🎨 Beautiful Themes — Predesigned themes or full customization.

and much more...

## Quick Start

Install ConnectKit along with its peer dependencies, [wagmi](https://wagmi.sh/) v3, [viem](https://viem.sh) and [TanStack Query](https://tanstack.com/query):

```sh
npm install connectkit wagmi viem @tanstack/react-query
```

Wrap your app with the providers and you're ready to go — out of the box ConnectKit includes the connectors that need no additional dependencies (Aave Account and MetaMask/injected):

```tsx
import { WagmiProvider, createConfig } from 'wagmi';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ConnectKitProvider, ConnectKitButton, getDefaultConfig } from 'connectkit';

const config = createConfig(
  getDefaultConfig({
    appName: 'My App',
  })
);

const queryClient = new QueryClient();

const App = () => (
  <WagmiProvider config={config}>
    <QueryClientProvider client={queryClient}>
      <ConnectKitProvider>
        <ConnectKitButton />
      </ConnectKitProvider>
    </QueryClientProvider>
  </WagmiProvider>
);
```

### Adding more connectors

Following wagmi v3's model, connector SDKs are optional peer dependencies — install only the ones you use and add their connectors individually:

```sh
npm install @coinbase/wallet-sdk @walletconnect/ethereum-provider \
  @safe-global/safe-apps-provider @safe-global/safe-apps-sdk
```

```tsx
import { getDefaultConfig, aaveAccount, metaMask } from 'connectkit';
import { coinbaseWallet } from 'connectkit/connectors/coinbaseWallet';
import { walletConnect } from 'connectkit/connectors/walletConnect';
import { safe } from 'connectkit/connectors/safe';

const config = createConfig(
  getDefaultConfig({
    appName: 'My App',
    appIcon: 'https://myapp.example/icon.png', // used by Coinbase Wallet & WalletConnect
    walletConnectProjectId: '...', // get one at https://cloud.reown.com/sign-in
    connectors: [
      aaveAccount(),
      safe(), // only active inside app frames (e.g. Safe{Wallet})
      metaMask(),
      coinbaseWallet(),
      walletConnect(),
    ],
  })
);
```

Connector factories inherit app-level options from `getDefaultConfig` (options passed to a factory directly take precedence), and plain wagmi connectors can be mixed into the same `connectors` array.

For more, follow the documentation [here](https://docs.family.co/connectkit/getting-started).

### Migrating from v1

ConnectKit 2.0 upgrades to wagmi v3 and changes how connectors are added — see the [migration guide](https://github.com/family/connectkit/blob/main/packages/connectkit/MIGRATION.md).

## Documentation

You can find the full ConnectKit documentation in the docs [here](https://docs.family.co/connectkit).

## API Reference

You can find the full API Reference in the docs [here](https://docs.family.co/connectkit/api-reference).

## Examples

There are various runnable examples included in this repository in the [examples folder](https://github.com/family/connectkit/tree/main/examples):

- [Next.js Example (TypeScript)](https://github.com/family/connectkit/tree/main/examples/nextjs)
- [Vite Example (TypeScript)](https://github.com/family/connectkit/tree/main/examples/vite)

### Try in CodeSandbox

You can try out some ConnectKit examples directly in your browser through CodeSandbox:

- [Next.js (TypeScript)](https://codesandbox.io/s/qnvyqe?file=/README.md)
- [Vite Example (TypeScript)](https://codesandbox.io/s/4jtssh?file=/README.md)

### Running Examples Locally

Clone the ConnectKit project and install the necessary dependencies:

```sh
$ git clone git@github.com:family/connectkit.git
$ cd connectkit
$ yarn install
```

and start the code bundler:

```sh
$ yarn dev:connectkit
$ yarn dev:connectkit-next-siwe
```

and then simply select the example you'd like to run:

```sh
$ yarn dev:vite # Vite
$ yarn dev:nextjs # Next.js
$ yarn dev:nextjs-siwe # Next.js with SIWE
```

## Contribute

Before starting on anything, please have a read through our [Contribution Guidelines](https://github.com/family/connectkit/blob/main/CONTRIBUTING.md).

## Twitter

Follow [@aave](https://twitter.com/aave) on Twitter for the latest updates on ConnectKit.

## License

See [LICENSE](https://github.com/family/connectkit/blob/main/LICENSE) for more information.
