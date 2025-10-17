# Remaining useEffect Dependency Fixes Needed

## Already Fixed (Batch 1)
✅ ConnectModal/index.tsx
✅ ConnectModal/ConnectWithOAuth.tsx  
✅ ConnectModal/ConnectWithQRCode.tsx
✅ Pages/EmailVerification (needs comment position fix)
✅ Pages/Recover
✅ hooks/openfort/auth/useAuthCallback.ts (needs comment position fix)
✅ hooks/openfort/useWallets.ts (needs openfortConnector added)
✅ hooks/openfort/useProviders.ts (needs comment position fix)
✅ hooks/useLastConnector.ts (needs comment position fix)
✅ hooks/useLockBodyScroll.ts
✅ BalanceButton/index.tsx
✅ openfort/CoreOpenfortProvider.tsx

## Still Need Fixing
- Common/Avatar/index.tsx
- Common/ChainSelectDropdown/index.tsx
- Common/CustomQRCode/QRCode.tsx
- Common/LazyImage/index.tsx
- Common/Loading/index.tsx
- Common/Modal/index.tsx
- Common/ScrollArea/index.tsx
- Common/Tooltip/index.tsx
- Common/Portal/index.tsx
- Common/ChainSelect/index.tsx
- ConnectModal/ConnectUsing.tsx
- ConnectModal/ConnectWithInjector/index.tsx
- ConnectModal/ConnectWithMobile.tsx
- Pages/About/index.tsx
- Pages/ForgotPassword/index.tsx
- Pages/Loading/index.tsx
- Pages/Profile/LinkedProviders.tsx
- Pages/Profile/index.tsx
- Pages/Providers/index.tsx
- hooks/openfort/auth/useWalletAuth.ts
- hooks/useConnectCallback.ts
- hooks/useFocusTrap.tsx
- hooks/useIsMobile.ts
- hooks/useLocales.tsx
- hooks/useGoogleFont.tsx
- hooks/useWindowSize.ts
- hooks/useFitText.tsx
- PasswordStrength/PasswordStrengthIndicator.tsx
- utils/index.ts
- utils/useOnUserReturn.ts

## Summary
- High Priority (Infinite Loop): ✅ All fixed in Batch 1
- Circular Dependencies: ✅ All fixed in Batch 1
- Function Dependencies: Partially done
- Remaining: ~30 files with medium/low priority changes

Most remaining files have simple changes (stable function refs or formatting).
