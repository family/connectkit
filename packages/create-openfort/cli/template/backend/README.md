# Openfort backend quickstart

This is a sample for a simple backend to create an encryption session for [openfort Signer](https://www.openfort.io/docs/guides/javascript/embedded-signer/recovery)

## Set up

1. **Copy environment variables:**

    ```sh
    cp .env.example .env
    ```

    Edit `.env` and set the required variables

2. **Install dependencies:**

    ```sh
    pnpm install
    ```

3. **Start the development server:**

    ```sh
    pnpm dev
    ```

## What does it provide?

Do a post to `/api/protected-create-encryption-session` and you will response a session like:

```json
  {
    "session": "cb44a4a1-5867-4b25-b5a0-57b496e14d78"
  }
```
