import crypto, { createHash } from "node:crypto";
import https from "node:https";
import { hostname, userInfo } from "node:os";

import { getVersion } from "./getVersion.js";

const posthogKey = "phc_HosujvcO5QzmU2MVvZo8AxWV0pplTZJLr3jEd8dRVPE";
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
          // Consume data
        });
        res.on("end", () => {
          resolve();
        });
      });

      req.on("error", () => {
        // Silently fail telemetry errors
        resolve();
      });

      req.write(data);
      req.end();
    });
  };
}

export const telemetry = new Telemetry();
