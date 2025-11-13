#!/usr/bin/env node

// src/index.ts
import * as path9 from "node:path";
import * as fs7 from "fs-extra";

// src/cli/index.ts
import * as p from "@clack/prompts";
import chalk from "chalk";
import { Command } from "commander";

// src/consts.ts
import path from "node:path";
import { fileURLToPath } from "node:url";
var __filename = fileURLToPath(import.meta.url);
var distPath = path.dirname(__filename);
var PKG_ROOT = path.join(distPath, "../");
var TITLE_TEXT = `   ___  ___  ___ _  _ ___ ___  ___ _____
  / _ \\| _ \\| __| \\| | __/ _ \\| _ \\_   _|
 | (_) |  _/| _|| .  | _| (_) |   / | |
  \\___/|_|  |___|_|\\_|_| \\___/|_|_\\ |_|
`;
var DEFAULT_APP_NAME = "openfort-project";
var CREATE_OPENFORT_APP = "create-openfort";

// src/installers/index.ts
var availableTemplates = [
  "openfort-ui",
  "headless",
  "firebase"
];
var availableThemes = [
  "auto",
  "midnight",
  "minimal",
  "soft",
  "web95",
  "rounded",
  "retro",
  "nouns"
];

// src/utils/getVersion.ts
import path2 from "node:path";
import fs from "fs-extra";
var getVersion = () => {
  const packageJsonPath = path2.join(PKG_ROOT, "package.json");
  const packageJsonContent = fs.readJSONSync(packageJsonPath);
  return packageJsonContent.version ?? "1.0.0";
};

// src/utils/isTTYError.ts
var IsTTYError = class extends Error {
};

// src/utils/logger.ts
var logger = {
  error(..._args) {
  },
  warn(..._args) {
  },
  info(..._args) {
  },
  success(..._args) {
  }
};

// src/utils/telemetry.ts
import crypto, { createHash } from "node:crypto";
import https from "node:https";
import { hostname, userInfo } from "node:os";
var posthogKey = "phc_HosujvcO5QzmU2MVvZo8AxWV0pplTZJLr3jEd8dRVPE";
var posthogHost = "https://analytics.openfort.xyz";
var getAnonymousId = () => {
  const identifier = `${hostname()}-${userInfo().username}`;
  return createHash("sha256").update(identifier).digest("hex").slice(0, 16);
};
var Telemetry = class {
  constructor() {
    this.enabled = true;
    this.send = async ({
      properties = {},
      status
    }) => {
      if (!this.enabled) return;
      if (!posthogKey || !posthogHost) return;
      const fullProperties = {
        session_id: this.sessionId,
        cli_version: getVersion(),
        node_version: process.version,
        platform: process.platform,
        cli_status: status,
        projectId: this.projectId,
        projectName: this.projectName,
        template: this.template,
        ...properties
      };
      const data = JSON.stringify({
        api_key: posthogKey,
        event: "cli_tool_used",
        distinct_id: this.anonymousId,
        properties: fullProperties
      });
      const url = new URL(`${posthogHost}/capture/`);
      const options = {
        hostname: url.hostname,
        port: url.port || 443,
        path: url.pathname,
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Content-Length": data.length
        }
      };
      return new Promise((resolve) => {
        const req = https.request(options, (res) => {
          res.on("data", () => {
          });
          res.on("end", () => {
            resolve();
          });
        });
        req.on("error", () => {
          resolve();
        });
        req.write(data);
        req.end();
      });
    };
    this.anonymousId = getAnonymousId();
    this.sessionId = createHash("sha256").update(crypto.randomBytes(16)).digest("hex").slice(0, 15);
  }
};
var telemetry = new Telemetry();

// src/utils/removeTrailingSlash.ts
var removeTrailingSlash = (input) => {
  if (input.length > 1 && input.endsWith("/")) {
    input = input.slice(0, -1);
  }
  return input;
};

// src/utils/validateAppName.ts
var validationRegExp = /^(?:@[a-z0-9-*~][a-z0-9-*._~]*\/)?[a-z0-9-~][a-z0-9-._~]*$/;
var validateAppName = (rawInput) => {
  const input = removeTrailingSlash(rawInput);
  const paths = input.split("/");
  const indexOfDelimiter = paths.findIndex((p4) => p4.startsWith("@"));
  let appName = paths[paths.length - 1];
  if (paths.findIndex((p4) => p4.startsWith("@")) !== -1) {
    appName = paths.slice(indexOfDelimiter).join("/");
  }
  if (input === "." || validationRegExp.test(appName ?? "")) {
    return;
  } else {
    return "App name must consist of only lowercase alphanumeric characters, '-', and '_'";
  }
};

// src/utils/validateOpenfortKeys.ts
var uuidV4Pattern = "[\\da-f]{8}-[\\da-f]{4}-[\\da-f]{4}-[\\da-f]{4}-[\\da-f]{12}";
var keyPattern = `(test|live)_${uuidV4Pattern}`;
var skRegex = new RegExp(`^sk_${keyPattern}$`);
var pkRegex = new RegExp(`^pk_${keyPattern}$`);
var uuidV4Regex = new RegExp(`^${uuidV4Pattern}$`);
var length44Regex = /^.{44}$/;
var createValidator = ({
  label,
  required = true,
  regex,
  formatHint,
  customCheck
}) => (value) => {
  if (value === "-") return void 0;
  if (required && !value) return `${label} is required`;
  if (regex && value && !regex.test(value))
    return `${label} is invalid${formatHint ? ` (${formatHint})` : ""}`;
  if (customCheck) return customCheck(value);
  return void 0;
};
var validateOpenfortPublishableKey = createValidator({
  label: "Openfort Publishable Key",
  regex: pkRegex,
  formatHint: "expected format: pk_test_... or pk_live_..."
});
var validateOpenfortSecretKey = createValidator({
  label: "Openfort Secret Key",
  regex: skRegex,
  formatHint: "expected format: sk_test_... or sk_live_..."
});
var validateShieldPublishableKey = createValidator({
  label: "Shield Publishable Key",
  regex: uuidV4Regex,
  formatHint: "expected UUID format"
});
var validateShieldSecret = createValidator({
  label: "Shield Secret",
  required: true
});
var validateShieldEncryptionShare = createValidator({
  label: "Shield Encryption Share",
  regex: length44Regex,
  formatHint: "expected 44 characters"
});
var validateApiEndpoint = createValidator({
  label: "API endpoint",
  customCheck: (value) => {
    try {
      new URL(value);
      return void 0;
    } catch {
      return "API endpoint must be a valid URL";
    }
  }
});
var testApiEndpoint = async (endpoint) => {
  try {
    const response = await fetch(endpoint, {
      method: "POST",
      headers: { "Content-Type": "application/json" }
    });
    const body = await response.json();
    return !!body.session;
  } catch {
    return false;
  }
};

// src/cli/index.ts
var defaultOptions = {
  appName: DEFAULT_APP_NAME,
  template: "openfort-ui",
  createBackend: true
};
var runCli = async () => {
  const program = new Command().name(CREATE_OPENFORT_APP).description(
    "A CLI for creating Openfort applications with embedded wallets"
  ).argument(
    "[dir]",
    "The name of the application, as well as the name of the directory to create"
  ).option(
    "--noGit",
    "Explicitly tell the CLI to not initialize a new git repo in the project",
    false
  ).option(
    "--noInstall",
    "Explicitly tell the CLI to not run the package manager's install command",
    false
  ).option(
    "-y, --default",
    "Bypass the CLI and use all default options to bootstrap a new Openfort app",
    false
  ).option("--CI", "Boolean value if we're running in CI", false).option("--template [string]", "Specify the template to use").option(
    "--theme [string]",
    "Specify the theme to use (for openfort-ui template)"
  ).option("--no-telemetry", "Disable sending anonymous usage data", false).version(getVersion(), "-v, --version", "Display the version number").addHelpText(
    "afterAll",
    `
 Learn more about Openfort at ${chalk.hex("#5B87F5").bold("https://www.openfort.xyz")} 
`
  ).parse(process.argv);
  const cliProvidedName = program.args[0];
  const opts = program.opts();
  telemetry.enabled = opts.telemetry !== false;
  telemetry.send({ status: "started" });
  const cliResults = {
    ...defaultOptions,
    appName: cliProvidedName || DEFAULT_APP_NAME,
    flags: {
      noGit: opts.noGit || false,
      noInstall: opts.noInstall || false,
      default: opts.default || false,
      CI: opts.CI || false,
      template: opts.template,
      theme: opts.theme
    }
  };
  if (cliResults.flags.CI) {
    cliResults.template = opts.template || "openfort-ui";
    cliResults.theme = opts.theme;
    cliResults.createBackend = false;
    cliResults.openfortPublishableKey = "pk_test_00000000-0000-0000-0000-000000000000";
    cliResults.shieldPublishableKey = "00000000-0000-0000-0000-000000000000";
    return cliResults;
  }
  if (cliResults.flags.default) {
    cliResults.template = "openfort-ui";
    cliResults.createBackend = false;
    cliResults.openfortPublishableKey = "";
    cliResults.shieldPublishableKey = "";
    return cliResults;
  }
  try {
    if (process.env.TERM_PROGRAM?.toLowerCase().includes("mintty")) {
      logger.warn(`  WARNING: It looks like you are using MinTTY, which is non-interactive. This is most likely because you are
  using Git Bash. If that's that case, please use Git Bash from another terminal, such as Windows Terminal.`);
      throw new IsTTYError("Non-interactive environment");
    }
    const project = await p.group(
      {
        ...!cliProvidedName && {
          name: () => p.text({
            message: "What will your project be called?",
            defaultValue: DEFAULT_APP_NAME,
            validate: validateAppName
          })
        },
        template: () => {
          return p.select({
            message: "Select an Openfort template:",
            options: availableTemplates.map((template) => ({
              value: template,
              label: template === "openfort-ui" ? "Openfort UI (default)" : template,
              hint: getTemplateHint(template)
            })),
            initialValue: "openfort-ui"
          });
        },
        createBackend: () => {
          return p.confirm({
            message: "Do you want to create a backend for automatic account recovery?",
            initialValue: true
          });
        },
        apiEndpoint: async ({ results }) => {
          if (!results.createBackend) {
            const needsEndpoint = await p.confirm({
              message: "Do you have an existing API endpoint for account recovery?",
              initialValue: false
            });
            if (p.isCancel(needsEndpoint)) {
              process.exit(1);
            }
            if (needsEndpoint) {
              let validEndpoint = false;
              let endpoint = "";
              while (!validEndpoint) {
                const endpointResult = await p.text({
                  message: "Enter your API endpoint for creating encryption sessions:",
                  placeholder: "http://localhost:3110/api/protected-create-encryption-session",
                  validate: validateApiEndpoint
                });
                if (p.isCancel(endpointResult)) {
                  process.exit(1);
                }
                endpoint = endpointResult;
                const spinner2 = p.spinner();
                spinner2.start("Testing API endpoint...");
                const isValid = await testApiEndpoint(endpoint);
                if (isValid) {
                  spinner2.stop("API endpoint validated!");
                  validEndpoint = true;
                } else {
                  spinner2.stop("API endpoint validation failed");
                  logger.error(
                    "The endpoint did not return a valid session response"
                  );
                  const retry = await p.confirm({
                    message: "Would you like to try another endpoint?",
                    initialValue: true
                  });
                  if (p.isCancel(retry) || !retry) {
                    process.exit(1);
                  }
                }
              }
              return endpoint;
            }
          }
          return void 0;
        },
        theme: ({ results }) => {
          if (results.template === "openfort-ui") {
            return p.select({
              message: "Select a theme:",
              options: availableThemes.map((theme) => ({
                value: theme,
                label: theme === "auto" ? "Auto (default)" : theme
              })),
              initialValue: "auto"
            });
          }
          return void 0;
        },
        openfortPublishableKey: () => {
          return p.text({
            message: "Enter your Openfort Publishable Key:",
            placeholder: "pk_test_...",
            validate: validateOpenfortPublishableKey
          });
        },
        openfortSecretKey: ({ results }) => {
          if (results.createBackend) {
            return p.text({
              message: "Enter your Openfort Secret Key:",
              placeholder: "sk_test_...",
              validate: validateOpenfortSecretKey
            });
          }
          return void 0;
        },
        shieldPublishableKey: () => {
          return p.text({
            message: "Enter your Shield Publishable Key:",
            placeholder: "00000000-0000-0000-0000-000000000000",
            validate: validateShieldPublishableKey
          });
        },
        shieldEncryptionShare: ({ results }) => {
          if (results.createBackend) {
            return p.text({
              message: "Enter your Shield Encryption Share:",
              placeholder: "Your 44-character encryption share",
              validate: validateShieldEncryptionShare
            });
          }
          return void 0;
        },
        shieldSecretKey: ({ results }) => {
          if (results.createBackend) {
            return p.text({
              message: "Enter your Shield Secret Key:",
              placeholder: "Your Shield Secret",
              validate: validateShieldSecret
            });
          }
          return void 0;
        },
        ...!cliResults.flags.noGit && {
          git: () => {
            return p.confirm({
              message: "Should we initialize a Git repository and stage the changes?",
              initialValue: true
            });
          }
        }
      },
      {
        onCancel() {
          process.exit(1);
        }
      }
    );
    telemetry.template = project.template;
    telemetry.projectId = project.openfortPublishableKey;
    return {
      appName: project.name || cliResults.appName,
      template: project.template,
      theme: project.theme,
      createBackend: project.createBackend,
      apiEndpoint: project.apiEndpoint,
      openfortPublishableKey: project.openfortPublishableKey,
      openfortSecretKey: project.openfortSecretKey,
      shieldPublishableKey: project.shieldPublishableKey,
      shieldSecretKey: project.shieldSecretKey,
      shieldEncryptionShare: project.shieldEncryptionShare,
      flags: {
        ...cliResults.flags,
        noGit: !project.git || cliResults.flags.noGit
      }
    };
  } catch (err) {
    if (err instanceof IsTTYError) {
      logger.warn(`
  ${CREATE_OPENFORT_APP} needs an interactive terminal to provide options`);
      const shouldContinue = await p.confirm({
        message: "Continue scaffolding a default Openfort app?",
        initialValue: true
      });
      if (!shouldContinue) {
        logger.info("Exiting...");
        process.exit(0);
      }
      logger.info(
        `Bootstrapping a default Openfort app in ./${cliResults.appName}`
      );
      return {
        ...cliResults,
        template: "openfort-ui",
        createBackend: false,
        openfortPublishableKey: "",
        shieldPublishableKey: ""
      };
    }
    throw err;
  }
};
function getTemplateHint(template) {
  switch (template) {
    case "openfort-ui":
      return "Pre-built UI components";
    case "headless":
      return "Custom, unstyled components";
    case "firebase":
      return "With Firebase authentication";
    default:
      return "";
  }
}

// src/helpers/createProject.ts
import path6 from "node:path";

// src/helpers/createBackend.ts
import path3 from "node:path";
import fs2 from "fs-extra";
import ora from "ora";
var createBackend = async ({
  projectDir,
  openfortSecretKey,
  shieldSecretKey,
  shieldApiKey,
  shieldEncryptionShare,
  port = 3110
}) => {
  const spinner2 = ora("Creating backend...").start();
  try {
    const backendTemplateDir = path3.join(PKG_ROOT, "template/backend");
    const backendDir = path3.join(projectDir, "backend");
    fs2.copySync(backendTemplateDir, backendDir);
    const envExamplePath = path3.join(backendDir, ".env.example");
    const envPath = path3.join(backendDir, ".env");
    if (fs2.existsSync(envExamplePath)) {
      const envContent = fs2.readFileSync(envExamplePath, "utf-8");
      const updatedEnvContent = envContent.replace(
        /OPENFORT_SECRET_KEY=.*/g,
        `OPENFORT_SECRET_KEY=${openfortSecretKey}`
      ).replace(
        /SHIELD_SECRET_KEY=.*/g,
        `SHIELD_SECRET_KEY=${shieldSecretKey}`
      ).replace(/SHIELD_API_KEY=.*/g, `SHIELD_API_KEY=${shieldApiKey}`).replace(
        /SHIELD_ENCRYPTION_SHARE=.*/g,
        `SHIELD_ENCRYPTION_SHARE=${shieldEncryptionShare}`
      ).replace(/PORT=.*/g, `PORT=${port}`);
      fs2.writeFileSync(envPath, updatedEnvContent);
    }
    await new Promise((resolve) => {
      setTimeout(() => {
        resolve(true);
      }, 1e3);
    });
    spinner2.succeed("Backend created successfully!");
  } catch (error) {
    spinner2.fail("Failed to create backend");
    logger.error(error instanceof Error ? error.message : String(error));
    throw error;
  }
};

// src/helpers/scaffoldProject.ts
import path4 from "node:path";
import * as p2 from "@clack/prompts";
import chalk2 from "chalk";
import fs3 from "fs-extra";
import ora2 from "ora";
var scaffoldProject = async ({
  projectName,
  projectDir,
  template,
  createBackend: createBackend2
}) => {
  logger.info("");
  const spinner2 = ora2(`Scaffolding in: ${projectDir}...
`).start();
  if (fs3.existsSync(projectDir)) {
    if (fs3.readdirSync(projectDir).length === 0) {
      if (projectName !== ".")
        spinner2.info(
          `${chalk2.cyan.bold(projectName)} exists but is empty, continuing...
`
        );
    } else {
      spinner2.stopAndPersist();
      const overwriteDir = await p2.select({
        message: `${chalk2.redBright.bold("Warning:")} ${chalk2.cyan.bold(
          projectName
        )} already exists and isn't empty. How would you like to proceed?`,
        options: [
          {
            label: "Abort installation (recommended)",
            value: "abort"
          },
          {
            label: "Clear the directory and continue installation",
            value: "clear"
          },
          {
            label: "Continue installation and overwrite conflicting files",
            value: "overwrite"
          }
        ],
        initialValue: "abort"
      });
      if (p2.isCancel(overwriteDir) || overwriteDir === "abort") {
        spinner2.fail("Aborting installation...");
        process.exit(1);
      }
      const confirmOverwriteDir = await p2.confirm({
        message: `Are you sure you want to ${overwriteDir === "clear" ? "clear the directory" : "overwrite conflicting files"}?`,
        initialValue: false
      });
      if (p2.isCancel(confirmOverwriteDir) || !confirmOverwriteDir) {
        spinner2.fail("Aborting installation...");
        process.exit(1);
      }
      if (overwriteDir === "clear") {
        spinner2.info(
          `Emptying ${chalk2.cyan.bold(projectName)} and creating Openfort app..
`
        );
        fs3.emptyDirSync(projectDir);
      }
    }
  }
  spinner2.start();
  fs3.mkdirSync(projectDir, { recursive: true });
  const templateSrcDir = path4.join(
    PKG_ROOT,
    "template/openfort-templates",
    template
  );
  const targetDir = createBackend2 ? path4.join(projectDir, "frontend") : projectDir;
  fs3.copySync(templateSrcDir, targetDir);
  const scaffoldedName = projectName === "." ? "App" : chalk2.cyan.bold(projectName);
  spinner2.succeed(
    `${scaffoldedName} ${chalk2.green("scaffolded successfully!")}
`
  );
};

// src/installers/envVars.ts
import path5 from "node:path";
import fs4 from "fs-extra";
var fillEnvVariables = ({
  projectDir,
  openfortPublishableKey,
  shieldPublishableKey,
  apiEndpoint,
  theme
}) => {
  const envExamplePath = path5.join(projectDir, ".env.example");
  const envPath = path5.join(projectDir, ".env");
  if (!fs4.existsSync(envExamplePath)) {
    const basicEnv = createBasicEnv({
      openfortPublishableKey,
      shieldPublishableKey,
      apiEndpoint,
      theme
    });
    fs4.writeFileSync(envPath, basicEnv);
    return;
  }
  const envExample = fs4.readFileSync(envExamplePath, "utf-8");
  let envContent = envExample;
  envContent = envContent.replace(
    /VITE_OPENFORT_PUBLISHABLE_KEY=.*/g,
    `VITE_OPENFORT_PUBLISHABLE_KEY=${openfortPublishableKey}`
  ).replace(
    /NEXT_PUBLIC_OPENFORT_PUBLISHABLE_KEY=.*/g,
    `NEXT_PUBLIC_OPENFORT_PUBLISHABLE_KEY=${openfortPublishableKey}`
  ).replace(
    /OPENFORT_PUBLISHABLE_KEY=.*/g,
    `OPENFORT_PUBLISHABLE_KEY=${openfortPublishableKey}`
  );
  envContent = envContent.replace(
    /VITE_SHIELD_PUBLISHABLE_KEY=.*/g,
    `VITE_SHIELD_PUBLISHABLE_KEY=${shieldPublishableKey}`
  ).replace(
    /NEXT_PUBLIC_SHIELD_PUBLISHABLE_KEY=.*/g,
    `NEXT_PUBLIC_SHIELD_PUBLISHABLE_KEY=${shieldPublishableKey}`
  ).replace(
    /SHIELD_PUBLISHABLE_KEY=.*/g,
    `SHIELD_PUBLISHABLE_KEY=${shieldPublishableKey}`
  );
  if (apiEndpoint) {
    envContent = envContent.replace(
      /VITE_CREATE_ENCRYPTED_SESSION_ENDPOINT=.*/g,
      `VITE_CREATE_ENCRYPTED_SESSION_ENDPOINT=${apiEndpoint}`
    ).replace(
      /NEXT_PUBLIC_CREATE_ENCRYPTED_SESSION_ENDPOINT=.*/g,
      `NEXT_PUBLIC_CREATE_ENCRYPTED_SESSION_ENDPOINT=${apiEndpoint}`
    ).replace(
      /CREATE_ENCRYPTED_SESSION_ENDPOINT=.*/g,
      `CREATE_ENCRYPTED_SESSION_ENDPOINT=${apiEndpoint}`
    );
  }
  if (theme) {
    envContent = envContent.replace(/VITE_OPENFORT_THEME=.*/g, `VITE_OPENFORT_THEME=${theme}`).replace(
      /NEXT_PUBLIC_OPENFORT_THEME=.*/g,
      `NEXT_PUBLIC_OPENFORT_THEME=${theme}`
    ).replace(/OPENFORT_THEME=.*/g, `OPENFORT_THEME=${theme}`);
  }
  fs4.writeFileSync(envPath, envContent);
};
var createBasicEnv = ({
  openfortPublishableKey,
  shieldPublishableKey,
  apiEndpoint,
  theme
}) => {
  let content = `# Openfort Configuration
VITE_OPENFORT_PUBLISHABLE_KEY=${openfortPublishableKey}
VITE_SHIELD_PUBLISHABLE_KEY=${shieldPublishableKey}
`;
  if (apiEndpoint) {
    content += `VITE_CREATE_ENCRYPTED_SESSION_ENDPOINT=${apiEndpoint}
`;
  }
  if (theme) {
    content += `VITE_OPENFORT_THEME=${theme}
`;
  }
  return content;
};

// src/helpers/createProject.ts
var createProject = async ({
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
  shieldEncryptionShare
}) => {
  const projectDir = path6.resolve(process.cwd(), projectName);
  await scaffoldProject({
    projectName,
    projectDir,
    template,
    createBackend: createBackendOption
  });
  const frontendDir = createBackendOption ? path6.join(projectDir, "frontend") : projectDir;
  fillEnvVariables({
    projectDir: frontendDir,
    openfortPublishableKey,
    shieldPublishableKey,
    apiEndpoint,
    theme
  });
  if (createBackendOption && openfortSecretKey && shieldSecretKey && shieldApiKey && shieldEncryptionShare) {
    await createBackend({
      projectDir,
      openfortSecretKey,
      shieldSecretKey,
      shieldApiKey,
      shieldEncryptionShare
    });
  }
  logger.info("All done!");
  return projectDir;
};

// src/helpers/git.ts
import { execSync } from "node:child_process";
import path7 from "node:path";
import * as p3 from "@clack/prompts";
import chalk3 from "chalk";
import { execa } from "execa";
import fs5 from "fs-extra";
import ora3 from "ora";
var isGitInstalled = (dir) => {
  try {
    execSync("git --version", { cwd: dir });
    return true;
  } catch {
    return false;
  }
};
var isRootGitRepo = (dir) => {
  return fs5.existsSync(path7.join(dir, ".git"));
};
var isInsideGitRepo = async (dir) => {
  try {
    await execa("git", ["rev-parse", "--is-inside-work-tree"], {
      cwd: dir,
      stdout: "ignore"
    });
    return true;
  } catch {
    return false;
  }
};
var getGitVersion = () => {
  const stdout = execSync("git --version").toString().trim();
  const gitVersionTag = stdout.split(" ")[2];
  const major = gitVersionTag?.split(".")[0];
  const minor = gitVersionTag?.split(".")[1];
  return { major: Number(major), minor: Number(minor) };
};
var getDefaultBranch = () => {
  const stdout = execSync("git config --global init.defaultBranch || echo main").toString().trim();
  return stdout;
};
var initializeGit = async (projectDir) => {
  logger.info("Initializing Git...");
  if (!isGitInstalled(projectDir)) {
    logger.warn("Git is not installed. Skipping Git initialization.");
    return;
  }
  const spinner2 = ora3("Creating a new git repo...\n").start();
  const isRoot = isRootGitRepo(projectDir);
  const isInside = await isInsideGitRepo(projectDir);
  const dirName = path7.parse(projectDir).name;
  if (isInside && isRoot) {
    spinner2.stop();
    const overwriteGit = await p3.confirm({
      message: `${chalk3.redBright.bold(
        "Warning:"
      )} Git is already initialized in "${dirName}". Initializing a new git repository would delete the previous history. Would you like to continue anyways?`,
      initialValue: false
    });
    if (!overwriteGit) {
      spinner2.info("Skipping Git initialization.");
      return;
    }
    fs5.removeSync(path7.join(projectDir, ".git"));
  } else if (isInside && !isRoot) {
    spinner2.stop();
    const initializeChildGitRepo = await p3.confirm({
      message: `${chalk3.redBright.bold(
        "Warning:"
      )} "${dirName}" is already in a git worktree. Would you still like to initialize a new git repository in this directory?`,
      initialValue: false
    });
    if (!initializeChildGitRepo) {
      spinner2.info("Skipping Git initialization.");
      return;
    }
  }
  try {
    const branchName = getDefaultBranch();
    const { major, minor } = getGitVersion();
    if (major < 2 || major === 2 && minor < 28) {
      await execa("git", ["init"], { cwd: projectDir });
      await execa("git", ["symbolic-ref", "HEAD", `refs/heads/${branchName}`], {
        cwd: projectDir
      });
    } else {
      await execa("git", ["init", `--initial-branch=${branchName}`], {
        cwd: projectDir
      });
    }
    await execa("git", ["add", "."], { cwd: projectDir });
    spinner2.succeed(
      `${chalk3.green("Successfully initialized and staged")} ${chalk3.green.bold(
        "git"
      )}
`
    );
  } catch {
    spinner2.fail(
      `${chalk3.bold.red(
        "Failed:"
      )} could not initialize git. Update git to the latest version!
`
    );
  }
};

// src/helpers/logNextSteps.ts
import path8 from "node:path";
import chalk4 from "chalk";
import fs6 from "fs-extra";

// src/utils/getUserPkgManager.ts
var getUserPkgManager = () => {
  const userAgent = process.env.npm_config_user_agent;
  if (userAgent) {
    if (userAgent.startsWith("yarn")) {
      return "yarn";
    } else if (userAgent.startsWith("pnpm")) {
      return "pnpm";
    } else if (userAgent.startsWith("bun")) {
      return "bun";
    } else {
      return "npm";
    }
  } else {
    return "npm";
  }
};

// src/helpers/logNextSteps.ts
var logNextSteps = async ({
  projectName = DEFAULT_APP_NAME,
  projectDir,
  createBackend: createBackend2
}) => {
  const pkgManager = getUserPkgManager();
  logger.info(`
${chalk4.green("Success! Your Openfort project is ready.")}`);
  logger.info("\nNext steps:");
  if (projectName !== ".") {
    logger.info(`  ${chalk4.cyan(`cd ${projectName}`)}`);
  }
  if (createBackend2) {
    const backendNodeModules = path8.join(projectDir, "backend", "node_modules");
    const frontendNodeModules = path8.join(
      projectDir,
      "frontend",
      "node_modules"
    );
    const needsInstall = !fs6.existsSync(backendNodeModules) || !fs6.existsSync(frontendNodeModules);
    logger.info(`
${chalk4.yellow("For the backend:")}`);
    logger.info(`  ${chalk4.cyan("cd backend")}`);
    if (needsInstall) {
      if (pkgManager === "yarn") {
        logger.info(`  ${chalk4.cyan(pkgManager)}`);
      } else {
        logger.info(`  ${chalk4.cyan(`${pkgManager} install`)}`);
      }
    }
    if (["npm", "bun"].includes(pkgManager)) {
      logger.info(`  ${chalk4.cyan(`${pkgManager} run dev`)}`);
    } else {
      logger.info(`  ${chalk4.cyan(`${pkgManager} dev`)}`);
    }
    logger.info(`
${chalk4.yellow("For the frontend (in a new terminal):")}`);
    logger.info(`  ${chalk4.cyan("cd frontend")}`);
    if (needsInstall) {
      if (pkgManager === "yarn") {
        logger.info(`  ${chalk4.cyan(pkgManager)}`);
      } else {
        logger.info(`  ${chalk4.cyan(`${pkgManager} install`)}`);
      }
    }
    if (["npm", "bun"].includes(pkgManager)) {
      logger.info(`  ${chalk4.cyan(`${pkgManager} run dev`)}`);
    } else {
      logger.info(`  ${chalk4.cyan(`${pkgManager} dev`)}`);
    }
  } else {
    const nodeModules = path8.join(projectDir, "node_modules");
    const needsInstall = !fs6.existsSync(nodeModules);
    if (needsInstall) {
      if (pkgManager === "yarn") {
        logger.info(`  ${chalk4.cyan(pkgManager)}`);
      } else {
        logger.info(`  ${chalk4.cyan(`${pkgManager} install`)}`);
      }
    }
    if (["npm", "bun"].includes(pkgManager)) {
      logger.info(`  ${chalk4.cyan(`${pkgManager} run dev`)}`);
    } else {
      logger.info(`  ${chalk4.cyan(`${pkgManager} dev`)}`);
    }
  }
  if (!await isInsideGitRepo(projectDir) && !isRootGitRepo(projectDir)) {
    logger.info(`
  ${chalk4.cyan("git init")}`);
    logger.info(`  ${chalk4.cyan('git commit -m "initial commit"')}`);
  }
  logger.info(`
${chalk4.blue("Learn more at https://www.openfort.xyz/docs")}`);
};

// src/utils/parseNameAndPath.ts
import pathModule from "node:path";
var parseNameAndPath = (rawInput) => {
  const input = removeTrailingSlash(rawInput);
  const paths = input.split("/");
  let appName = paths[paths.length - 1];
  if (appName === ".") {
    const parsedCwd = pathModule.resolve(process.cwd());
    appName = pathModule.basename(parsedCwd);
  }
  const indexOfDelimiter = paths.findIndex((p4) => p4.startsWith("@"));
  if (paths.findIndex((p4) => p4.startsWith("@")) !== -1) {
    appName = paths.slice(indexOfDelimiter).join("/");
  }
  const path10 = paths.filter((p4) => !p4.startsWith("@")).join("/");
  return [appName, path10];
};

// src/utils/renderTitle.ts
import gradient from "gradient-string";
var openfortTheme = ["#ffffff", "#000000", "#ff3b30"];
var renderTitle = () => {
  const openfortGradient = gradient(openfortTheme);
  const pkgManager = getUserPkgManager();
  if (pkgManager === "yarn" || pkgManager === "pnpm") {
    console.log("");
  }
  console.log(openfortGradient.multiline(TITLE_TEXT));
};

// src/utils/renderVersionWarning.ts
import { execSync as execSync2 } from "node:child_process";
import https2 from "node:https";
var renderVersionWarning = (npmVersion) => {
  const currentVersion = getVersion();
  if (currentVersion.includes("beta")) {
    logger.warn("  You are using a beta version of create-openfort-app.");
    logger.warn("  Please report any bugs you encounter.");
  } else if (currentVersion.includes("next")) {
    logger.warn(
      "  You are running create-openfort-app with the @next tag which is no longer maintained."
    );
    logger.warn("  Please run the CLI with @latest instead.");
  } else if (currentVersion !== npmVersion) {
    logger.warn("  You are using an outdated version of create-openfort-app.");
    logger.warn(
      "  Your version:",
      `${currentVersion}.`,
      "Latest version in the npm registry:",
      npmVersion
    );
    logger.warn("  Please run the CLI with @latest to get the latest updates.");
  }
};
function checkForLatestVersion() {
  return new Promise((resolve, reject) => {
    https2.get(
      "https://registry.npmjs.org/-/package/create-openfort-app/dist-tags",
      (res) => {
        if (res.statusCode === 200) {
          let body = "";
          res.on("data", (data) => {
            body += data;
          });
          res.on("end", () => {
            resolve(JSON.parse(body).latest);
          });
        } else {
          reject();
        }
      }
    ).on("error", () => {
      reject();
    });
  });
}
var getNpmVersion = () => (
  // `fetch` to the registry is faster than `npm view` so we try that first
  checkForLatestVersion().catch(() => {
    try {
      return execSync2("npm view create-openfort-app version").toString().trim();
    } catch {
      return null;
    }
  })
);

// src/index.ts
var main = async () => {
  const npmVersion = await getNpmVersion();
  renderTitle();
  if (npmVersion) {
    renderVersionWarning(npmVersion);
  }
  const {
    appName,
    template,
    theme,
    createBackend: createBackend2,
    apiEndpoint,
    openfortPublishableKey,
    openfortSecretKey,
    shieldPublishableKey,
    shieldSecretKey,
    shieldEncryptionShare,
    flags: { noGit }
  } = await runCli();
  const [scopedAppName, appDir] = parseNameAndPath(appName);
  telemetry.projectName = scopedAppName;
  const projectDir = await createProject({
    projectName: appDir,
    template,
    openfortPublishableKey,
    shieldPublishableKey,
    apiEndpoint: apiEndpoint || (createBackend2 ? "http://localhost:3110/api/protected-create-encryption-session" : void 0),
    theme,
    createBackendOption: createBackend2,
    openfortSecretKey,
    shieldSecretKey,
    shieldApiKey: shieldPublishableKey,
    // For backend, we use the publishable key as API key
    shieldEncryptionShare
  });
  logger.info("Project setup is complete!");
  const pkgJsonPath = createBackend2 ? path9.join(projectDir, "frontend", "package.json") : path9.join(projectDir, "package.json");
  if (fs7.existsSync(pkgJsonPath)) {
    const pkgJson = fs7.readJSONSync(pkgJsonPath);
    pkgJson.name = scopedAppName;
    pkgJson.openfortMetadata = {
      initVersion: getVersion(),
      template
    };
    fs7.writeJSONSync(pkgJsonPath, pkgJson, {
      spaces: 2
    });
  }
  logger.info("Git?!");
  if (!noGit) {
    await initializeGit(projectDir);
  }
  await logNextSteps({
    projectName: appDir,
    projectDir,
    createBackend: createBackend2
  });
  telemetry.send({ status: "completed" });
  process.exit(0);
};
main().catch((err) => {
  logger.error("Aborting installation...");
  if (err instanceof Error) {
    logger.error(err);
  } else {
    logger.error(
      "An unknown error has occurred. Please open an issue on GitHub with the below:"
    );
  }
  telemetry.send({
    status: "error",
    properties: {
      error: err instanceof Error ? err.message : String(err)
    }
  });
  process.exit(1);
});
