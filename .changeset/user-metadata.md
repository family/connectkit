---
'@openfort/react': minor
---

Added `user.metadata` to the user that `useUser` returns: the custom data your backend sets on the user with your secret key. Requires `@openfort/openfort-js` 2.7.0, which adds `metadata` to `User`. Email and password, email OTP, and phone OTP sign-in now load the user from `client.user.get()` after login, because sign-in responses do not include metadata. Before, the user published after these sign-ins came from the login response, so `user.metadata` was missing until the next reload.
