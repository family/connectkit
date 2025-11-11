import path from "path";

import { createBackend } from "~/helpers/createBackend.js";
import { scaffoldProject } from "~/helpers/scaffoldProject.js";
import { type OpenfortTemplate } from "~/installers/index.js";
import { fillEnvVariables } from "~/installers/envVars.js";

interface CreateProjectOptions {
  projectName: string;
  template: OpenfortTemplate;
  openfortPublishableKey: string;
  shieldPublishableKey: string;
  apiEndpoint?: string;
  theme?: string;
  createBackendOption: boolean;
  openfortSecretKey?: string;
  shieldSecretKey?: string;
  shieldApiKey?: string;
  shieldEncryptionShare?: string;
}

export const createProject = async ({
  projectName,
  template,
  openfortPublishableKey,
  shieldPublishableKey,
  apiEndpoint,
  theme,
  createBackendOption,
  openfortSecretKey,
  shieldSecretKey,
  shieldApiKey,
  shieldEncryptionShare,
}: CreateProjectOptions) => {
  const projectDir = path.resolve(process.cwd(), projectName);

  // Scaffold the frontend with the selected template
  await scaffoldProject({
    projectName,
    projectDir,
    template,
    createBackend: createBackendOption,
  });

  // Fill environment variables for frontend
  const frontendDir = createBackendOption
    ? path.join(projectDir, "frontend")
    : projectDir;

  fillEnvVariables({
    projectDir: frontendDir,
    openfortPublishableKey,
    shieldPublishableKey,
    apiEndpoint,
    theme,
  });

  // Create backend if requested
  if (
    createBackendOption &&
    openfortSecretKey &&
    shieldSecretKey &&
    shieldApiKey &&
    shieldEncryptionShare
  ) {
    await createBackend({
      projectDir,
      openfortSecretKey,
      shieldSecretKey,
      shieldApiKey,
      shieldEncryptionShare,
    });
  }

  return projectDir;
};
