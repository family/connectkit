import { ChainTypeEnum, EmbeddedState } from '@openfort/openfort-js'
import { act, render } from '@testing-library/react'
import { createElement } from 'react'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { createMockOpenfortClient, type MockOpenfortClient } from '../mocks/openfortClient.js'

let mockClient: MockOpenfortClient

vi.mock('../../openfort/core', () => ({
  createOpenfortClient: () => mockClient,
}))
vi.mock('../../components/Openfort/useOpenfort', () => {
  const hook = () => ({
    walletConfig: undefined,
    chainType: ChainTypeEnum.EVM,
    setChainType: () => {},
    uiConfig: { walletConnectName: undefined },
    open: false,
    route: null,
    connector: null,
  })
  return { useOpenfort: hook, useOpenfortConfig: hook, useOpenfortRouting: hook }
})
vi.mock('../../wallets/useExternalConnectors', () => ({
  mapBridgeConnectorsToWalletProps: () => [],
}))
vi.mock('../../hooks/useConnectLifecycle', () => ({
  useConnectLifecycle: () => {},
}))
vi.mock('../../ethereum/OpenfortEthereumBridgeContext', () => ({
  OpenfortEthereumBridgeContext: { Provider: ({ children }: any) => children },
}))
vi.mock('../../hooks/openfort/auth/useConnectToWalletPostAuth.js', () => ({
  useConnectToWalletPostAuth: () => ({ tryUseWallet: async () => ({}) }),
}))

const { CoreOpenfortProvider } = await import('../../openfort/CoreOpenfortProvider.js')
const { useEmailAuth } = await import('../../hooks/openfort/auth/useEmailAuth.js')
const { useEmailOtpAuth } = await import('../../hooks/openfort/auth/useEmailOtpAuth.js')
const { usePhoneOtpAuth } = await import('../../hooks/openfort/auth/usePhoneOtpAuth.js')
const { useUser } = await import('../../hooks/openfort/useUser.js')

const metadata = { acceptedTerms: true, termsVersion: '2026-11', consent: { marketing: false } }

type Hooks = {
  emailAuth: ReturnType<typeof useEmailAuth>
  emailOtpAuth: ReturnType<typeof useEmailOtpAuth>
  phoneOtpAuth: ReturnType<typeof usePhoneOtpAuth>
  user: ReturnType<typeof useUser>
}

describe('useUser metadata after sign-in', () => {
  let consoleErrorSpy: ReturnType<typeof vi.spyOn>

  beforeEach(() => {
    mockClient = createMockOpenfortClient()
    mockClient.user.get.mockImplementation(async () => ({ id: 'usr_1', linkedAccounts: [], metadata }))
    // Like openfort-js, a login announces the new embedded state before it resolves,
    // and its response carries a user without metadata.
    const logIn = vi.fn(async () => {
      mockClient._test.setEmbeddedState(EmbeddedState.EMBEDDED_SIGNER_NOT_CONFIGURED)
      return { token: 'session-token', user: { id: 'usr_1', linkedAccounts: [] } }
    })
    Object.assign(mockClient.auth, {
      logInWithEmailPassword: logIn,
      logInWithEmailOtp: logIn,
      logInWithPhoneOtp: logIn,
    })
    consoleErrorSpy = vi.spyOn(console, 'error').mockImplementation((...args: unknown[]) => {
      const msg = typeof args[0] === 'string' ? args[0] : ''
      if (msg.includes('was not wrapped in act')) return
    })
  })

  afterEach(() => {
    consoleErrorSpy.mockRestore()
    mockClient._test.reset()
  })

  it.each([
    ['email and password', (h: Hooks) => h.emailAuth.signInEmail({ email: 'a@b.co', password: 'pw' })],
    ['email OTP', (h: Hooks) => h.emailOtpAuth.signInEmailOtp({ email: 'a@b.co', otp: '123456' })],
    ['phone OTP', (h: Hooks) => h.phoneOtpAuth.logInWithPhoneOtp({ phoneNumber: '+34600000000', otp: '123456' })],
  ])('returns the metadata set from the backend after %s sign-in', async (_method, signIn) => {
    let hooks!: Hooks
    function Probe() {
      hooks = {
        emailAuth: useEmailAuth(),
        emailOtpAuth: useEmailOtpAuth(),
        phoneOtpAuth: usePhoneOtpAuth(),
        user: useUser(),
      }
      return null
    }
    await act(async () => {
      render(
        createElement(
          CoreOpenfortProvider,
          { openfortConfig: { baseConfiguration: { publishableKey: 'pk' } } },
          createElement(Probe)
        )
      )
    })
    await act(async () => mockClient._test.setEmbeddedState(EmbeddedState.UNAUTHENTICATED))

    const result = await signIn(hooks)

    expect(result.error).toBeUndefined()
    expect(result.user?.metadata).toEqual(metadata)
    expect(hooks.user.user?.metadata).toEqual(metadata)
  })
})
