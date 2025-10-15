import "dotenv/config";
import express from "express";
import cors from "cors";
import { toNodeHandler } from "better-auth/node";
import { auth } from "./auth";

const app = express();
const port = Number(process.env.PORT ?? 3000);
const sharedSecret = process.env.OPENFORT_SHARED_SECRET?.trim();

app.use(cors({
  origin: process.env.FRONTEND_URL,
  credentials: true,
}));
app.use(express.json());

// Mount Better Auth handler
app.all("/api/auth/*", toNodeHandler(auth));

// Endpoint used by Openfort's custom auth verification
app.post("/api/openfort/verify", async (req, res) => {
  try {
    if (sharedSecret) {
      const providedSecretHeader = req.headers["x-openfort-secret"];
      const providedSecret = (Array.isArray(providedSecretHeader)
        ? providedSecretHeader[0]
        : providedSecretHeader)?.trim();

      if (providedSecret !== sharedSecret) {
        return res.status(401).json({ error: "Invalid shared secret" });
      }
    }

    const token = [req.body?.token, req.body?.payload]
      .find((value): value is string => typeof value === "string")
      ?.trim();
    if (!token) {
      return res.status(400).json({ error: "Missing token" });
    }

    const ctx = await auth.$context;
    const session = await ctx.internalAdapter.findSession(token);
    if (!session) {
      return res.status(401).json({ error: "Invalid session" });
    }

    return res.json({
      userId: session.user.id,
      email: session.user.email ?? undefined,
    });
  } catch (error) {
    console.error("Failed to verify Openfort payload", error);
    return res.status(500).json({ error: "Internal server error" });
  }
});

// Health check endpoint
app.get("/health", (req, res) => {
  res.json({ status: "ok" });
});

app.listen(port, () => {
  console.log(`Better Auth server listening on http://localhost:${port}`);
});
