/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_PUBLISHABLE_KEY: string
  readonly VITE_SHIELD_PUBLISHABLE_KEY: string
  readonly VITE_CREATE_ENCRYPTED_SESSION_ENDPOINT: string
  readonly VITE_BEAM_POLICY_ID: string
  readonly VITE_POLYGON_POLICY_ID: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
