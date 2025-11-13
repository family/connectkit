import * as p from "@clack/prompts";
import chalk from "chalk";
import { Command, Option } from "commander";

import { CREATE_OPENFORT_APP, DEFAULT_APP_NAME } from "~/consts.js";
import {
  availableTemplates,
  availableThemes,
  type OpenfortTemplate,
  type OpenfortTheme,
} from "~/installers/index.js";
import { getVersion } from "~/utils/getVersion.js";
import { IsTTYError } from "~/utils/isTTYError.js";
import { logger } from "~/utils/logger.js";
import { telemetry } from "~/utils/telemetry.js";
import { validateAppName } from "~/utils/validateAppName.js";
import {
  testApiEndpoint,
  validateApiEndpoint,
  validateOpenfortPublishableKey,
  validateOpenfortSecretKey,
  validateShieldEncryptionShare,
  validateShieldPublishableKey,
  validateShieldSecret,
} from "~/utils/validateOpenfortKeys.js";

interface CliFlags {
  noGit: boolean;
  noInstall: boolean;
  default: boolean;

  /** @internal Used in CI. */
  CI: boolean;
  /** @internal Used in CI. */
  template?: OpenfortTemplate;
  /** @internal Used in CI. */
  theme?: OpenfortTheme;
}

interface CliResults {
  appName: string;
  flags: CliFlags;
  template: OpenfortTemplate;
  theme?: OpenfortTheme;
  createBackend: boolean;
  apiEndpoint?: string;
  openfortPublishableKey: string;
  openfortSecretKey?: string;
  shieldPublishableKey: string;
  shieldSecretKey?: string;
  shieldEncryptionShare?: string;
}

const defaultOptions: Partial<CliResults> = {
  appName: DEFAULT_APP_NAME,
  template: "openfort-ui",
  createBackend: true,
};

export const runCli = async (): Promise<CliResults> => {
  const program = new Command()
    .name(CREATE_OPENFORT_APP)
    .description(
      "A CLI for creating Openfort applications with embedded wallets",
    )
    .argument(
      "[dir]",
      "The name of the application, as well as the name of the directory to create",
    )
    .option(
      "--noGit",
      "Explicitly tell the CLI to not initialize a new git repo in the project",
      false,
    )
    .option(
      "--noInstall",
      "Explicitly tell the CLI to not run the package manager's install command",
      false,
    )
    .option(
      "-y, --default",
      "Bypass the CLI and use all default options to bootstrap a new Openfort app",
      false,
    )
    .option("--CI", "Boolean value if we're running in CI", false)
    .option("--template [string]", "Specify the template to use")
    .option(
      "--theme [string]",
      "Specify the theme to use (for openfort-ui template)",
    )
    .option("--noTelemetry", "Disable sending anonymous usage data", false)
    .addOption(new Option("--debug").hideHelp(true))
    .version(getVersion(), "-v, --version", "Display the version number")
    .addHelpText(
      "afterAll",
      `\n Learn more about Openfort at ${chalk
        .hex("#5B87F5")
        .bold("https://www.openfort.xyz")} \n`,
    )
    .parse(process.argv);

  const cliProvidedName = program.args[0];
  const opts = program.opts();

  // Disable debug logging
  if (!opts.debug) logger.debug = () => {};

  telemetry.enabled = !opts.noTelemetry;
  logger.debug("Telemetry enabled:", telemetry.enabled);

  // Send telemetry start event
  telemetry.send({ status: "started" });

  const cliResults: Partial<CliResults> = {
    ...defaultOptions,
    appName: cliProvidedName || DEFAULT_APP_NAME,
    flags: {
      noGit: opts.noGit || false,
      noInstall: opts.noInstall || false,
      default: opts.default || false,
      CI: opts.CI || false,
      template: opts.template,
      theme: opts.theme,
    },
  };

  // Handle CI mode
  if (cliResults.flags!.CI) {
    // In CI mode, use provided options or defaults
    cliResults.template = (opts.template as OpenfortTemplate) || "openfort-ui";
    cliResults.theme = opts.theme as OpenfortTheme;
    cliResults.createBackend = false;

    // Mock values for CI
    cliResults.openfortPublishableKey =
      "pk_test_00000000-0000-0000-0000-000000000000";
    cliResults.shieldPublishableKey = "00000000-0000-0000-0000-000000000000";

    return cliResults as CliResults;
  }

  // Handle default mode
  if (cliResults.flags!.default) {
    cliResults.template = "openfort-ui";
    cliResults.createBackend = false;
    cliResults.openfortPublishableKey = "";
    cliResults.shieldPublishableKey = "";

    return cliResults as CliResults;
  }

  // Interactive mode
  try {
    if (process.env.TERM_PROGRAM?.toLowerCase().includes("mintty")) {
      logger.warn(`  WARNING: It looks like you are using MinTTY, which is non-interactive. This is most likely because you are
  using Git Bash. If that's that case, please use Git Bash from another terminal, such as Windows Terminal.`);

      throw new IsTTYError("Non-interactive environment");
    }

    const project = await p.group(
      {
        ...(!cliProvidedName && {
          name: () =>
            p.text({
              message: "What will your project be called?",
              defaultValue: DEFAULT_APP_NAME,
              validate: validateAppName,
            }),
        }),
        template: () => {
          return p.select({
            message: "Select an Openfort template:",
            options: availableTemplates.map((template) => ({
              value: template,
              label:
                template === "openfort-ui" ? "Openfort UI (default)" : template,
              hint: getTemplateHint(template),
            })),
            initialValue: "openfort-ui",
          });
        },
        createBackend: () => {
          return p.confirm({
            message:
              "Do you want to create a backend for automatic account recovery?",
            initialValue: true,
          });
        },
        apiEndpoint: async ({ results }) => {
          if (!results.createBackend) {
            const needsEndpoint = await p.confirm({
              message:
                "Do you have an existing API endpoint for account recovery?",
              initialValue: false,
            });

            if (p.isCancel(needsEndpoint)) {
              process.exit(1);
            }

            if (needsEndpoint) {
              let validEndpoint = false;
              let endpoint = "";

              while (!validEndpoint) {
                const endpointResult = await p.text({
                  message:
                    "Enter your API endpoint for creating encryption sessions:",
                  placeholder:
                    "http://localhost:3110/api/protected-create-encryption-session",
                  validate: validateApiEndpoint,
                });

                if (p.isCancel(endpointResult)) {
                  process.exit(1);
                }

                endpoint = endpointResult as string;

                // Test the endpoint
                const spinner = p.spinner();
                spinner.start("Testing API endpoint...");

                const isValid = await testApiEndpoint(endpoint);

                if (isValid) {
                  spinner.stop("API endpoint validated!");
                  validEndpoint = true;
                } else {
                  spinner.stop("API endpoint validation failed");
                  logger.error(
                    "The endpoint did not return a valid session response",
                  );

                  const retry = await p.confirm({
                    message: "Would you like to try another endpoint?",
                    initialValue: true,
                  });

                  if (p.isCancel(retry) || !retry) {
                    process.exit(1);
                  }
                }
              }

              return endpoint;
            }
          }
          return undefined;
        },
        theme: ({ results }) => {
          if (results.template === "openfort-ui") {
            return p.select({
              message: "Select a theme:",
              options: availableThemes.map((theme) => ({
                value: theme,
                label: theme === "auto" ? "Auto (default)" : theme,
              })),
              initialValue: "auto",
            });
          }
          return undefined;
        },
        openfortPublishableKey: () => {
          return p.text({
            message: "Enter your Openfort Publishable Key:",
            placeholder: "pk_test_...",
            validate: validateOpenfortPublishableKey,
          });
        },
        openfortSecretKey: ({ results }) => {
          if (results.createBackend) {
            return p.text({
              message: "Enter your Openfort Secret Key:",
              placeholder: "sk_test_...",
              validate: validateOpenfortSecretKey,
            });
          }
          return undefined;
        },
        shieldPublishableKey: () => {
          return p.text({
            message: "Enter your Shield Publishable Key:",
            placeholder: "00000000-0000-0000-0000-000000000000",
            validate: validateShieldPublishableKey,
          });
        },
        shieldEncryptionShare: ({ results }) => {
          if (results.createBackend) {
            return p.text({
              message: "Enter your Shield Encryption Share:",
              placeholder: "Your 44-character encryption share",
              validate: validateShieldEncryptionShare,
            });
          }
          return undefined;
        },
        shieldSecretKey: ({ results }) => {
          if (results.createBackend) {
            return p.text({
              message: "Enter your Shield Secret Key:",
              placeholder: "Your Shield Secret",
              validate: validateShieldSecret,
            });
          }
          return undefined;
        },
        ...(!cliResults.flags!.noGit && {
          git: () => {
            return p.confirm({
              message:
                "Should we initialize a Git repository and stage the changes?",
              initialValue: true,
            });
          },
        }),
      },
      {
        onCancel() {
          process.exit(1);
        },
      },
    );

    // Update telemetry with project details
    telemetry.template = project.template as OpenfortTemplate;
    telemetry.projectId = project.openfortPublishableKey as string;

    return {
      appName: (project.name as string) || cliResults.appName!,
      template: project.template as OpenfortTemplate,
      theme: project.theme as OpenfortTheme | undefined,
      createBackend: project.createBackend as boolean,
      apiEndpoint: project.apiEndpoint as string | undefined,
      openfortPublishableKey: project.openfortPublishableKey as string,
      openfortSecretKey: project.openfortSecretKey as string | undefined,
      shieldPublishableKey: project.shieldPublishableKey as string,
      shieldSecretKey: project.shieldSecretKey as string | undefined,
      shieldEncryptionShare: project.shieldEncryptionShare as
        | string
        | undefined,
      flags: {
        ...cliResults.flags!,
        noGit: !project.git || cliResults.flags!.noGit,
      },
    };
  } catch (err) {
    if (err instanceof IsTTYError) {
      logger.warn(`
  ${CREATE_OPENFORT_APP} needs an interactive terminal to provide options`);

      const shouldContinue = await p.confirm({
        message: "Continue scaffolding a default Openfort app?",
        initialValue: true,
      });

      if (!shouldContinue) {
        logger.info("Exiting...");
        process.exit(0);
      }

      logger.info(
        `Bootstrapping a default Openfort app in ./${cliResults.appName}`,
      );

      return {
        ...cliResults,
        template: "openfort-ui",
        createBackend: false,
        openfortPublishableKey: "",
        shieldPublishableKey: "",
      } as CliResults;
    }
    throw err;
  }
};

function getTemplateHint(template: OpenfortTemplate): string {
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
