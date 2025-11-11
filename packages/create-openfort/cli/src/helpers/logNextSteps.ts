import path from "path";
import fs from "fs-extra";
import chalk from "chalk";

import { DEFAULT_APP_NAME } from "~/consts.js";
import { getUserPkgManager } from "~/utils/getUserPkgManager.js";
import { logger } from "~/utils/logger.js";
import { isInsideGitRepo, isRootGitRepo } from "./git.js";

interface LogNextStepsOptions {
  projectName?: string;
  projectDir: string;
  createBackend: boolean;
}

// This logs the next steps that the user should take in order to advance the project
export const logNextSteps = async ({
  projectName = DEFAULT_APP_NAME,
  projectDir,
  createBackend,
}: LogNextStepsOptions) => {
  const pkgManager = getUserPkgManager();

  logger.info("\n" + chalk.green("Success! Your Openfort project is ready."));
  logger.info("\nNext steps:");

  if (projectName !== ".") {
    logger.info(`  ${chalk.cyan(`cd ${projectName}`)}`);
  }

  if (createBackend) {
    // Check if backend has node_modules
    const backendNodeModules = path.join(projectDir, "backend", "node_modules");
    const frontendNodeModules = path.join(projectDir, "frontend", "node_modules");
    const needsInstall = !fs.existsSync(backendNodeModules) || !fs.existsSync(frontendNodeModules);

    logger.info("\n" + chalk.yellow("For the backend:"));
    logger.info(`  ${chalk.cyan("cd backend")}`);
    if (needsInstall) {
      if (pkgManager === "yarn") {
        logger.info(`  ${chalk.cyan(pkgManager)}`);
      } else {
        logger.info(`  ${chalk.cyan(`${pkgManager} install`)}`);
      }
    }
    if (["npm", "bun"].includes(pkgManager)) {
      logger.info(`  ${chalk.cyan(`${pkgManager} run dev`)}`);
    } else {
      logger.info(`  ${chalk.cyan(`${pkgManager} dev`)}`);
    }

    logger.info("\n" + chalk.yellow("For the frontend (in a new terminal):"));
    logger.info(`  ${chalk.cyan("cd frontend")}`);
    if (needsInstall) {
      if (pkgManager === "yarn") {
        logger.info(`  ${chalk.cyan(pkgManager)}`);
      } else {
        logger.info(`  ${chalk.cyan(`${pkgManager} install`)}`);
      }
    }
    if (["npm", "bun"].includes(pkgManager)) {
      logger.info(`  ${chalk.cyan(`${pkgManager} run dev`)}`);
    } else {
      logger.info(`  ${chalk.cyan(`${pkgManager} dev`)}`);
    }
  } else {
    // Single project structure
    const nodeModules = path.join(projectDir, "node_modules");
    const needsInstall = !fs.existsSync(nodeModules);

    if (needsInstall) {
      if (pkgManager === "yarn") {
        logger.info(`  ${chalk.cyan(pkgManager)}`);
      } else {
        logger.info(`  ${chalk.cyan(`${pkgManager} install`)}`);
      }
    }

    if (["npm", "bun"].includes(pkgManager)) {
      logger.info(`  ${chalk.cyan(`${pkgManager} run dev`)}`);
    } else {
      logger.info(`  ${chalk.cyan(`${pkgManager} dev`)}`);
    }
  }

  if (!(await isInsideGitRepo(projectDir)) && !isRootGitRepo(projectDir)) {
    logger.info(`\n  ${chalk.cyan("git init")}`);
    logger.info(`  ${chalk.cyan('git commit -m "initial commit"')}`);
  }

  logger.info(
    "\n" + chalk.blue("Learn more at https://www.openfort.xyz/docs")
  );
};

