import crypto, { createHash } from "node:crypto";
import https from "node:https";
import { hostname, userInfo } from "node:os";
import dotenv from "dotenv";
import { logger } from "~/utils/logger.js";
import { getVersion } from "./getVersion.js";

dotenv.config();

const posthogKey = process.env.POSTHOG_API_KEY;
const posthogHost = "https://analytics.openfort.xyz";

const getAnonymousId = () => {
  // Combines hostname + username, hashed = anonymous but consistent
  const identifier = `${hostname()}-${userInfo().username}`;
  return createHash("sha256").update(identifier).digest("hex").slice(0, 16);
};

class Telemetry {
  anonymousId: string;
  enabled: boolean = true;
  sessionId: string;

  projectId?: string;
  template?: string;
  projectName?: string;

  constructor() {
    this.anonymousId = getAnonymousId();
    this.sessionId = createHash("sha256")
      .update(crypto.randomBytes(16))
      .digest("hex")
      .slice(0, 15);
  }

  send = async ({
    properties = {},
    status,
  }: {
    properties?: Record<string, unknown>;
    status: "started" | "completed" | "error";
  }) => {
    logger.debug("Sending telemetry...", {
      status,
      properties,
    });

    if (!this.enabled) return;

    if (!posthogKey || !posthogHost) {
      logger.warn(
        "Telemetry is not configured properly. Please contact openfort developers at support@openfort.xyz.",
      );
      return;
    }

    const fullProperties = {
      session_id: this.sessionId,
      cli_version: getVersion(),
      node_version: process.version,
      platform: process.platform,
      cli_status: status,

      projectId: this.projectId,
      projectName: this.projectName,
      template: this.template,

      ...properties,
    };

    const data = JSON.stringify({
      api_key: posthogKey,
      event: "cli_tool_used",
      distinct_id: this.anonymousId,
      properties: fullProperties,
    });

    const url = new URL(`${posthogHost}/capture/`);

    const options = {
      hostname: url.hostname,
      port: url.port || 443,
      path: url.pathname,
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Content-Length": data.length,
      },
    };

    return new Promise<void>((resolve) => {
      const req = https.request(options, (res) => {
        res.on("data", () => {
          logger.debug(
            "Telemetry request response received",
            res.statusMessage,
          );
        });
        res.on("end", () => {
          resolve();
        });
      });

      req.on("error", (e) => {
        // Silently fail telemetry errors
        logger.debug("Telemetry request error", e);
        resolve();
      });

      req.write(data);
      req.end();
    });
  };
}

export const telemetry = new Telemetry();
