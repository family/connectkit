# useEffect Dependency Changes in refactor/pnpm-biome Branch

This document lists all useEffect dependency array changes introduced in commit **8602301** (October 16, 2025) when biome formatting was applied with exhaustive dependencies rule.

## Summary
**Total files affected:** 42 files
**Root cause:** Biome's `lint/correctness/useExhaustiveDependencies` rule automatically added all referenced variables to dependency arrays, causing potential infinite loops and unnecessary re-renders.

---

## Files with useEffect Dependency Changes

### 1. **packages/openfort-react/src/components/BalanceButton/index.tsx**
- **Before:** `[blockNumber, queryKey]`
- **After:** `[blockNumber, queryKey, queryClient]` ⚠️
- **Impact:** Added `queryClient` which may cause unnecessary re-renders

### 2. **packages/openfort-react/src/components/Common/Avatar/index.tsx**
- **Before:** `[ensAvatar]`
- **After:** `[]` ✅
- **Impact:** Simplified dependencies (seems intentional)

### 3. **packages/openfort-react/src/components/Common/ChainSelectDropdown/index.tsx**
- **Multiple changes:**
  - `[open]` → `[open, onClose]` ⚠️
  - `[]` → `[onResize, onScroll, refresh]` ⚠️
  - Added new effect: `[bounds, offsetX, offsetY]`

### 4. **packages/openfort-react/src/components/Common/CustomQRCode/QRCode.tsx**
- **Before:** `[ecl, size, uri]`
- **After:** `[ecl, size, uri, image, imageBackground, logoSize]` ⚠️

### 5. **packages/openfort-react/src/components/Common/LazyImage/index.tsx**
- **Before:** `[src]`
- **After:** `[]` ⚠️
- **Impact:** Removed dependency which may break reactivity

### 6. **packages/openfort-react/src/components/Common/Loading/index.tsx**
- **Before:** `[]`
- **After:** `[triggerResize]` ⚠️

### 7. **packages/openfort-react/src/components/Common/Modal/index.tsx**
- **Multiple changes:**
  - `[open]` → `[open, setOpen]` ⚠️
  - `[chain, switchChain, mobile, context.uiConfig, context.resize]` → `[updateBounds]` ✅
  - `[mounted, onClose]` → `[mounted, onClose]` (no change)
  - `[open]` → `[open, setOpen]` ⚠️

### 8. **packages/openfort-react/src/components/Common/ScrollArea/index.tsx**
- **Before:** `[ref.current]`
- **After:** `[]` ⚠️

### 9. **packages/openfort-react/src/components/ConnectModal/ConnectUsing.tsx**
- **Before:** `[]`
- **After:** `[context, isOauth, isQrCode, status, wallet?.connector]` ⚠️

### 10. **packages/openfort-react/src/components/ConnectModal/ConnectWithInjector/index.tsx**
- **Multiple changes:**
  - Added new effect: `[wallet, isConnected, disconnect, connect]` ⚠️
  - `[]` → `[status, runConnect]` ⚠️

### 11. **packages/openfort-react/src/components/ConnectModal/ConnectWithMobile.tsx**
- **Before:** `[status]`
- **After:** `[status, openApp, setRoute, siwe, wcUri]` ⚠️
- **Before:** `[shouldRedirectToWalletApp, status]`
- **After:** `[shouldRedirectToWalletApp, status, openApp]` ⚠️

### 12. **packages/openfort-react/src/components/ConnectModal/ConnectWithOAuth.tsx**
- **Before:** `[status]`
- **After:** `[status, client, connector.id, connector.type, log, setRoute, user]` ⚠️

### 13. **packages/openfort-react/src/components/ConnectModal/ConnectWithQRCode.tsx**
- **Before:** `[isConnected]`
- **After:** `[isConnected, connectWithSiwe, disconnect, isFirstFrame, log, setOpen]` ⚠️

### 14. **packages/openfort-react/src/components/ConnectModal/index.tsx**
- **Before:** `[]`
- **After:** `[context]` ⚠️ **MAJOR ISSUE** - context changes on every render

### 15. **packages/openfort-react/src/components/Openfort/OpenfortProvider.tsx**
- **Multiple changes:**
  - `[isConnected, isChainSupported, chain, route, open]` → `[isConnected, isChainSupported, safeUiConfig.enforceSupportedChains]` ✅
  - `[route]` → `[route]` (no change)

### 16. **packages/openfort-react/src/components/Pages/About/index.tsx**
- **Multiple changes:**
  - `[]` → `[interval]` ⚠️
  - Added multiple new effects with various dependencies

### 17. **packages/openfort-react/src/components/Pages/EmailVerification/index.tsx**
- **Before:** `[shouldSendEmailVerification]`
- **After:** `[shouldSendEmailVerification, sendEmailVerification]` ⚠️
- **Before:** `[]`
- **After:** `[client.auth, emailInStorage, log, setRoute]` ⚠️

### 18. **packages/openfort-react/src/components/Pages/ForgotPassword/index.tsx**
- **Before:** `[!error]` (unusual)
- **After:** `[triggerResize]` ⚠️

### 19. **packages/openfort-react/src/components/Pages/Loading/index.tsx**
- **Before:** `[isLoading, user, address, needsRecovery, isFirstFrame, retryCount]`
- **After:** `[isLoading, user, address, needsRecovery, isFirstFrame, setRoute, walletConfig]` ⚠️

### 20. **packages/openfort-react/src/components/Pages/Profile/LinkedProviders.tsx**
- **Before:** `[provider]`
- **After:** `[provider, wallets]` ⚠️

### 21. **packages/openfort-react/src/components/Pages/Profile/index.tsx**
- **Before:** `[shouldDisconnect, logout]`
- **After:** `[shouldDisconnect, logout, closeModal, context]` ⚠️

### 22. **packages/openfort-react/src/components/Pages/Providers/index.tsx**
- **Before:** `[]`
- **After:** `[disconnect, updateUser]` ⚠️

### 23. **packages/openfort-react/src/components/Pages/Recover/index.tsx**
- **Multiple changes (13 different useEffect modifications):**
  - `[recoveryError]` → `[recoveryError, triggerResize]` ⚠️
  - `[shouldRecoverWallet]` → `[shouldRecoverWallet, recoverWallet]` ⚠️
  - `[embeddedState]` → `[embeddedState, log, setActiveWallet, walletAddress]` ⚠️
  - `[shouldCreateWallet]` → `[shouldCreateWallet, createWallet, log]` ⚠️ **REPEATED ISSUE**
  - And many more...

### 24. **packages/openfort-react/src/hooks/connectors/useWalletConnectUri.ts**
- **Before:** `[enabled, connector, isConnected]` ✅ **ORIGINAL WAS CORRECT**
- **After:** `[enabled, connector, isConnected, connectAsync, disconnect, log, uri]` ❌ **CAUSED INFINITE LOOP**
- **Status:** **FIXED** - Reverted to original in commit e9dd596

### 25. **packages/openfort-react/src/hooks/openfort/auth/useAuthCallback.ts**
- **Before:** `[]`
- **After:** `[enabled, memoizedHookOptions, log, storeCredentials, verifyEmail, onError]` ⚠️

### 26. **packages/openfort-react/src/hooks/openfort/auth/useEmailAuth.ts**
- **Multiple effects removed (all had dependencies on hookOptions):**
  - `[client, setStatus, updateUser, hookOptions]` - removed
  - `[client, setStatus, updateUser, log, hookOptions]` - removed
  - `[client, log, hookOptions]` - removed

### 27. **packages/openfort-react/src/hooks/openfort/auth/useGuestAuth.ts**
- Effect removed: `[client, setStatus, updateUser, hookOptions]`

### 28. **packages/openfort-react/src/hooks/openfort/auth/useOAuth.ts**
- Multiple effects removed with `hookOptions` dependencies

### 29. **packages/openfort-react/src/hooks/openfort/auth/useSignOut.ts**
- Effect removed: `[logout, setStatus, hookOptions]`

### 30. **packages/openfort-react/src/hooks/openfort/auth/useWalletAuth.ts**
- **Before:** `[shouldConnectWithSiwe, siwe, updateUser, log]`
- **After:** `[shouldConnectWithSiwe, siwe, updateUser, log, disconnect, handleError, hookOptions]` ⚠️

### 31. **packages/openfort-react/src/hooks/openfort/useConnectWithSiwe.ts**
- Effect removed: `[client, user, updateUser, log, address, chainId, config, connector]`

### 32. **packages/openfort-react/src/hooks/openfort/useProviders.ts**
- **Before:** `[user, availableProviders, allProviders, maxProviders]`
- **After:** `[user, availableProviders, allProviders]` ✅

### 33. **packages/openfort-react/src/hooks/openfort/useWallets.ts**
- **Multiple changes:**
  - `[walletConfig, getEncryptionSession]` - removed
  - `[user?.linkedAccounts, embeddedAccounts]` → `[user?.linkedAccounts, embeddedAccounts, openfortConnector, availableWallets, user]` ⚠️
  - `[rawWallets.length, status.status, address, isConnected, connector?.id]` → `[rawWallets.length, status.status, address, isConnected, connector?.id, rawWallets, status]` ⚠️ **CIRCULAR**
  - `[connectToConnector]` → `[connectToConnector, connect]` ⚠️
  - Several effects removed with extensive dependencies

### 34. **packages/openfort-react/src/hooks/useConnectCallback.ts**
- **Before:** `[isConnected]`
- **After:** `[isConnected, address, connector?.id, isMounted, onConnect, onDisconnect, user]` ⚠️

### 35. **packages/openfort-react/src/hooks/useFitText.tsx**
- **Multiple changes** - all appearance changes (formatting)

### 36. **packages/openfort-react/src/hooks/useFocusTrap.tsx**
- **Before:** `[]`
- **After:** `[handleFocus]` ⚠️
- **Before:** `[]`
- **After:** `[elRef.current]` ⚠️

### 37. **packages/openfort-react/src/hooks/useLastConnector.ts**
- **Before:** `[]`
- **After:** `[storage]` ⚠️

### 38. **packages/openfort-react/src/hooks/useLockBodyScroll.ts**
- **Before:** `[initialLocked]`
- **After:** `[initialLocked, locked]` ⚠️

### 39. **packages/openfort-react/src/openfort/CoreOpenfortProvider.tsx**
- **Multiple changes:**
  - `[]` → `[openfortProps.baseConfiguration.publishableKey]` ✅
  - `[pollEmbeddedState]` → `[pollEmbeddedState]` (no change)
  - `[openfort]` → `[openfort, startPollingEmbeddedState, stopPollingEmbeddedState]` ⚠️
  - Added: `[openfort, disconnectAsync, queryClient, reset, startPollingEmbeddedState]` ⚠️
  - `[embeddedState, openfort]` → `[embeddedState, openfort, fetchEmbeddedAccounts, updateUser, user]` ⚠️
  - `[connectors, embeddedState, address, user]` → `[connectors, embeddedState, address, user, connect, isConnectedWithEmbeddedSigner]` ⚠️
  - Several effects removed

---

## Risk Assessment

### 🔴 High Risk (Likely to cause infinite loops)
1. **useWalletConnectUri** - `log` function recreated on every render ✅ **FIXED**
2. **ConnectModal/index.tsx** - `context` object recreated on every render
3. **useWallets** - Circular dependency with `rawWallets` and `status`
4. **Pages/Recover** - Multiple `log` dependencies

### 🟡 Medium Risk (May cause performance issues)
1. Functions added as dependencies (`setOpen`, `setRoute`, `disconnect`, etc.)
2. Object dependencies that may change reference (`context.uiConfig`, `walletConfig`)
3. Multiple state setters in dependency arrays

### 🟢 Low Risk (Likely safe)
1. Simplified dependency arrays (removed unused deps)
2. Added stable references
3. Formatting-only changes

---

## Recommendations

1. **Audit all effects with `log` in dependencies** - The logger function is recreated on every render
2. **Check effects with `context` dependencies** - Context objects change reference
3. **Review effects with state setters** - These should generally be stable but verify with React version
4. **Consider using `useCallback` for functions** used in dependency arrays
5. **Add biome-ignore comments** where intentional limited dependencies are needed
6. **Test for infinite loops** in development mode with React DevTools Profiler

---

## Next Steps

1. Review each ⚠️ marked change for potential issues
2. Add appropriate `biome-ignore` comments where needed
3. Consider wrapping unstable references with `useCallback`/`useMemo`
4. Run the application and monitor for performance issues
5. Check React DevTools Profiler for excessive re-renders

