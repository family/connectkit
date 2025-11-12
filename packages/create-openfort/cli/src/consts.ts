import path from "node:path";
import { fileURLToPath } from "node:url";

// With the move to TSUP as a build tool, this keeps path routes in other files (installers, loaders, etc) in check more easily.
// Path is in relation to a single index.js file inside ./dist
const __filename = fileURLToPath(import.meta.url);
const distPath = path.dirname(__filename);
export const PKG_ROOT = path.join(distPath, "../");

//export const PKG_ROOT = path.dirname(require.main.filename);

export const TITLE_TEXT = `   ___  ___  ___ _  _ ___ ___  ___ _____
  / _ \\| _ \\| __| \\| | __/ _ \\| _ \\_   _|
 | (_) |  _/| _|| .  | _| (_) |   / | |
  \\___/|_|  |___|_|\\_|_| \\___/|_|_\\ |_|
`;
export const DEFAULT_APP_NAME = "openfort-project";
export const CREATE_OPENFORT_APP = "create-openfort";
