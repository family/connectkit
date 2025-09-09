![openfort_kit_8d6f715e38](https://github.com/user-attachments/assets/e652c9d8-c2ff-4f13-b046-405338fdea01)

<div align="center">
  <h4>
    <a href="https://www.openfort.io/">
      Website
    </a>
    <span> | </span>
    <a href="https://www.openfort.io/docs/products/embedded-wallet/react/">
      Documentation
    </a>
    <span> | </span>
    <a href="https://x.com/openfort_hq">
      X
    </a>
   <span> | </span>
    <a href="https://playground.openfort.io/">
      Demo
    </a>
  </h4>
</div>


# Openfort React SDK

[![Downloads](https://img.shields.io/npm/dm/@openfort/react.svg)](https://www.npmjs.com/package/@openfort/react)
[![License](https://img.shields.io/badge/license-MIT-green.svg)](LICENSE)
[![Documentation](https://img.shields.io/badge/docs-openfort.io-blue)](https://www.openfort.io/docs/products/embedded-wallet/react/)
[![Version](https://img.shields.io/npm/v/@openfort/react.svg)](https://www.npmjs.org/package/@openfort/react)


The easiest way to use embedded wallets, with built-in authentication and payments capabilities in React.

## Features

- 💡 TypeScript Ready — Get types straight out of the box.
- 🌱 Ecosystem Friendly — Uses top libraries such as [wagmi](https://github.com/wagmi-dev/wagmi) for hooks.
- 🎨 Simple UI — Use prebuilt elements for authenticaiton and wallet connection.
- 🖥️ React Hooks - To interact directly with embedded wallet capabilities.

and much more...

## Quick Start

### New app

Get started with `create` Openfort + [wagmi](https://wagmi.sh/) + [viem](https://viem.sh) project by running one of the following in your terminal:

#### npm

```sh
npx create openfort
```

#### yarn

```sh
yarn create openfort
```

#### pnpm

```sh
pnpm create openfort
```

### Import `Openfort` to your project

Add Openfort to your already existing project.

#### npm

```sh
npm install @openfort/react @tanstack/react-query wagmi viem
```

#### yarn

```sh
yarn add @openfort/react @tanstack/react-query wagmi viem
```

#### pnpm

```sh
pnpm add @openfort/react @tanstack/react-query wagmi viem
```

## Examples

There are various runnable examples included in this repository in the [examples folder](https://github.com/openfort-xyz/openfort-react/tree/main/examples):

- [Create React App Example (TypeScript)](https://github.com/openfort-xyz/openfort-react/tree/main/examples/cra)
- [Next.js Example (TypeScript)](https://github.com/openfort-xyz/openfort-react/tree/main/examples/nextjs)
- [Vite Example (TypeScript)](https://github.com/openfort-xyz/openfort-react/tree/main/examples/vite)

### Running Examples Locally

Clone the project and install the necessary dependencies:

```sh
$ git clone git@github.com:openfort-xyz/openfort-react.git
$ cd openfort
$ yarn install
```

and start the code bundler:

```sh
$ yarn dev:kit
```

and then simply select the example you'd like to run:

```sh
$ yarn dev:vite # Vite
$ yarn dev:nextjs # Next.js
$ yarn dev:cra # Create React App
```

## License

See [LICENSE](https://github.com/openfort-xyz/openfort-react/blob/main/LICENSE) for more information.

## Credits

Openfort is a fork of [Connectkit](https://github.com/openfort-xyz/openfort-react) developed by [Family](https://family.co). We're grateful to them for making Connectkit fast, beautiful and open-source.
