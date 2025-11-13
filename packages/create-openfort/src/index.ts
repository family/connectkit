#!/usr/bin/env node
import * as path from "node:path";
import * as fs from "fs-extra";
import type { PackageJson } from "type-fest";
import { runCli } from "~/cli/index.js";
import { createProject } from "~/helpers/createProject.js";
import { initializeGit } from "~/helpers/git.js";
import { logNextSteps } from "~/helpers/logNextSteps.js";
import { logger } from "~/utils/logger.js";
import { parseNameAndPath } from "~/utils/parseNameAndPath.js";
import { renderTitle } from "~/utils/renderTitle.js";
import { getVersion } from "./utils/getVersion.js";
import {
  getNpmVersion,
  renderVersionWarning,
} from "./utils/renderVersionWarning.js";
import { telemetry } from "./utils/telemetry.js";

type OpenfortPackageJSON = PackageJson & {
  openfortMetadata?: {
    initVersion: string;
    template: string;
  };
};

const main = async () => {
  const npmVersion = await getNpmVersion();
  renderTitle();
  if (npmVersion) {
    renderVersionWarning(npmVersion);
  }

  const {
    appName,
    template,
    theme,
    createBackend,
    apiEndpoint,
    openfortPublishableKey,
    openfortSecretKey,
    shieldPublishableKey,
    shieldSecretKey,
    shieldEncryptionShare,
    flags: { noGit },
  } = await runCli();

  // e.g. dir/@mono/app returns ["@mono/app", "dir/app"]
  const [scopedAppName, appDir] = parseNameAndPath(appName);

  telemetry.projectName = scopedAppName;

  const projectDir = await createProject({
    projectName: appDir,
    template,
    openfortPublishableKey,
    shieldPublishableKey,
    apiEndpoint:
      apiEndpoint ||
      (createBackend
        ? "http://localhost:3110/api/protected-create-encryption-session"
        : undefined),
    theme,
    createBackendOption: createBackend,
    openfortSecretKey,
    shieldSecretKey,
    shieldApiKey: shieldPublishableKey, // For backend, we use the publishable key as API key
    shieldEncryptionShare,
  });

  logger.info("Project setup is complete!");

  // Update package.json in frontend (or root if no backend)
  const pkgJsonPath = createBackend
    ? path.join(projectDir, "frontend", "package.json")
    : path.join(projectDir, "package.json");

  if (fs.existsSync(pkgJsonPath)) {
    const pkgJson = fs.readJSONSync(pkgJsonPath) as OpenfortPackageJSON;
    pkgJson.name = scopedAppName;
    pkgJson.openfortMetadata = {
      initVersion: getVersion(),
      template,
    };

    fs.writeJSONSync(pkgJsonPath, pkgJson, {
      spaces: 2,
    });
  }

  logger.info("Git?!");

  if (!noGit) {
    await initializeGit(projectDir);
  }

  await logNextSteps({
    projectName: appDir,
    projectDir,
    createBackend,
  });

  // Send completion telemetry
  telemetry.send({ status: "completed" });

  process.exit(0);
};

main().catch((err) => {
  logger.error("Aborting installation...");
  if (err instanceof Error) {
    logger.error(err);
  } else {
    logger.error(
      "An unknown error has occurred. Please open an issue on GitHub with the below:",
    );
  }

  // Send error telemetry
  telemetry.send({
    status: "error",
    properties: {
      error: err instanceof Error ? err.message : String(err),
    },
  });

  process.exit(1);
});
