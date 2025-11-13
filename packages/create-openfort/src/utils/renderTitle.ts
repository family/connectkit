import gradient from "gradient-string";

import { TITLE_TEXT } from "~/consts.js";
import { getUserPkgManager } from "~/utils/getUserPkgManager.js";

// Openfort brand colors
const openfortTheme = ["#c3c3c3ff", "#ff3b30"];

export const renderTitle = async () => {
  const openfortGradient = gradient(openfortTheme);

  // resolves weird behavior where the ascii is offset
  const pkgManager = getUserPkgManager();
  if (pkgManager === "yarn" || pkgManager === "pnpm") {
    // biome-ignore lint/suspicious/noConsole: CLI tool needs console output
    console.log("");
  }

  // biome-ignore lint/suspicious/noConsole: CLI tool needs console output for title
  console.log(openfortGradient.multiline(TITLE_TEXT));
};
