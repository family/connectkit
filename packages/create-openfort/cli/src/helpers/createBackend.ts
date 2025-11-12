import path from "node:path";
import fs from "fs-extra";
import ora from "ora";

import { PKG_ROOT } from "~/consts.js";
import { logger } from "~/utils/logger.js";

interface CreateBackendOptions {
  projectDir: string;
  openfortSecretKey: string;
  shieldSecretKey: string;
  shieldApiKey: string;
  shieldEncryptionShare: string;
  port?: number;
}

export const createBackend = async ({
  projectDir,
  openfortSecretKey,
  shieldSecretKey,
  shieldApiKey,
  shieldEncryptionShare,
  port = 3110,
}: CreateBackendOptions) => {
  const spinner = ora("Creating backend...").start();

  try {
    const backendTemplateDir = path.join(PKG_ROOT, "template/backend");
    const backendDir = path.join(projectDir, "backend");

    // Copy backend template
    fs.copySync(backendTemplateDir, backendDir);

    // Read .env.example
    const envExamplePath = path.join(backendDir, ".env.example");
    const envPath = path.join(backendDir, ".env");

    if (fs.existsSync(envExamplePath)) {
      const envContent = fs.readFileSync(envExamplePath, "utf-8");

      // Replace environment variables
      const updatedEnvContent = envContent
        .replace(
          /OPENFORT_SECRET_KEY=.*/g,
          `OPENFORT_SECRET_KEY=${openfortSecretKey}`,
        )
        .replace(
          /SHIELD_SECRET_KEY=.*/g,
          `SHIELD_SECRET_KEY=${shieldSecretKey}`,
        )
        .replace(/SHIELD_API_KEY=.*/g, `SHIELD_API_KEY=${shieldApiKey}`)
        .replace(
          /SHIELD_ENCRYPTION_SHARE=.*/g,
          `SHIELD_ENCRYPTION_SHARE=${shieldEncryptionShare}`,
        )
        .replace(/PORT=.*/g, `PORT=${port}`);

      fs.writeFileSync(envPath, updatedEnvContent);
    }

    spinner.succeed("Backend created successfully!");
  } catch (error) {
    spinner.fail("Failed to create backend");
    logger.error(error instanceof Error ? error.message : String(error));
    throw error;
  }
};
