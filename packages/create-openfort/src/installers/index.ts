// Openfort template options
export const availableTemplates = [
  "openfort-ui",
  "headless",
  "firebase",
] as const;
export type OpenfortTemplate = (typeof availableTemplates)[number];

// Theme options for openfort-ui template
export const availableThemes = [
  "auto",
  "midnight",
  "minimal",
  "soft",
  "web95",
  "rounded",
  "retro",
  "nouns",
] as const;
export type OpenfortTheme = (typeof availableThemes)[number];
