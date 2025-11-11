import path from "path";
import fs from "fs-extra";

interface FillEnvOptions {
  projectDir: string;
  openfortPublishableKey: string;
  shieldPublishableKey: string;
  apiEndpoint?: string;
  theme?: string;
}

export const fillEnvVariables = ({
  projectDir,
  openfortPublishableKey,
  shieldPublishableKey,
  apiEndpoint,
  theme,
}: FillEnvOptions) => {
  const envExamplePath = path.join(projectDir, ".env.example");
  const envPath = path.join(projectDir, ".env");

  if (!fs.existsSync(envExamplePath)) {
    // If no .env.example exists, create a basic one
    const basicEnv = createBasicEnv({
      openfortPublishableKey,
      shieldPublishableKey,
      apiEndpoint,
      theme,
    });
    fs.writeFileSync(envPath, basicEnv);
    return;
  }

  // Read .env.example
  const envExample = fs.readFileSync(envExamplePath, "utf-8");

  // Fill in the values
  let envContent = envExample;

  // Replace Openfort keys (handle both VITE_ and NEXT_PUBLIC_ prefixes)
  envContent = envContent
    .replace(
      /VITE_OPENFORT_PUBLISHABLE_KEY=.*/g,
      `VITE_OPENFORT_PUBLISHABLE_KEY=${openfortPublishableKey}`
    )
    .replace(
      /NEXT_PUBLIC_OPENFORT_PUBLISHABLE_KEY=.*/g,
      `NEXT_PUBLIC_OPENFORT_PUBLISHABLE_KEY=${openfortPublishableKey}`
    )
    .replace(
      /OPENFORT_PUBLISHABLE_KEY=.*/g,
      `OPENFORT_PUBLISHABLE_KEY=${openfortPublishableKey}`
    );

  // Replace Shield keys
  envContent = envContent
    .replace(
      /VITE_SHIELD_PUBLISHABLE_KEY=.*/g,
      `VITE_SHIELD_PUBLISHABLE_KEY=${shieldPublishableKey}`
    )
    .replace(
      /NEXT_PUBLIC_SHIELD_PUBLISHABLE_KEY=.*/g,
      `NEXT_PUBLIC_SHIELD_PUBLISHABLE_KEY=${shieldPublishableKey}`
    )
    .replace(
      /SHIELD_PUBLISHABLE_KEY=.*/g,
      `SHIELD_PUBLISHABLE_KEY=${shieldPublishableKey}`
    );

  // Replace API endpoint if provided
  if (apiEndpoint) {
    envContent = envContent
      .replace(
        /VITE_CREATE_ENCRYPTED_SESSION_ENDPOINT=.*/g,
        `VITE_CREATE_ENCRYPTED_SESSION_ENDPOINT=${apiEndpoint}`
      )
      .replace(
        /NEXT_PUBLIC_CREATE_ENCRYPTED_SESSION_ENDPOINT=.*/g,
        `NEXT_PUBLIC_CREATE_ENCRYPTED_SESSION_ENDPOINT=${apiEndpoint}`
      )
      .replace(
        /CREATE_ENCRYPTED_SESSION_ENDPOINT=.*/g,
        `CREATE_ENCRYPTED_SESSION_ENDPOINT=${apiEndpoint}`
      );
  }

  // Replace theme if provided
  if (theme) {
    envContent = envContent
      .replace(/VITE_OPENFORT_THEME=.*/g, `VITE_OPENFORT_THEME=${theme}`)
      .replace(/NEXT_PUBLIC_OPENFORT_THEME=.*/g, `NEXT_PUBLIC_OPENFORT_THEME=${theme}`)
      .replace(/OPENFORT_THEME=.*/g, `OPENFORT_THEME=${theme}`);
  }

  fs.writeFileSync(envPath, envContent);
};

const createBasicEnv = ({
  openfortPublishableKey,
  shieldPublishableKey,
  apiEndpoint,
  theme,
}: Omit<FillEnvOptions, "projectDir">) => {
  let content = `# Openfort Configuration
VITE_OPENFORT_PUBLISHABLE_KEY=${openfortPublishableKey}
VITE_SHIELD_PUBLISHABLE_KEY=${shieldPublishableKey}
`;

  if (apiEndpoint) {
    content += `VITE_CREATE_ENCRYPTED_SESSION_ENDPOINT=${apiEndpoint}\n`;
  }

  if (theme) {
    content += `VITE_OPENFORT_THEME=${theme}\n`;
  }

  return content;
};
