// Vite bundler needs Node polyfills

window.global = window.global ?? window;
window.process = window.process ?? { env: {} };

export {};
