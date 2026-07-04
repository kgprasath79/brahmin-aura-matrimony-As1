/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import express from "express";
import path from "path";
import dotenv from "dotenv";
import { createServer as createViteServer } from "vite";
import compression from "compression";
import apiRoutes from "./backend/routes/index";
import { securityHeaders } from "./backend/middleware/security";

// Load environment variables
dotenv.config();

const app = express();
const PORT = Number(process.env.PORT) || 3000;

// Enterprise Middleware
app.use(compression());
app.use(express.json({ limit: "50mb" }));
app.use(securityHeaders);

// Modular API Routes
app.use("/api", apiRoutes);

// -------------------------------------------------------------------------
// VITE DEV SERVER OR STATIC SERVER SETUP
// -------------------------------------------------------------------------
async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath, {
      maxAge: "1y",
      immutable: true,
      setHeaders: (res, filePath) => {
        if (filePath.endsWith("index.html")) {
          res.setHeader("Cache-Control", "no-cache, no-store, must-revalidate");
        } else if (filePath.includes("/assets/")) {
          res.setHeader("Cache-Control", "public, max-age=31536000, immutable");
        } else {
          res.setHeader("Cache-Control", "public, max-age=86400, must-revalidate");
        }
      }
    }));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"), {
        headers: {
          "Cache-Control": "no-cache, no-store, must-revalidate"
        }
      });
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`\n🚀 BRAHMIN AURA MATRIMONY - ENTERPRISE SERVER`);
    console.log(`📡 Status: OPERATIONAL`);
    console.log(`🌐 URL: http://localhost:${PORT}`);
    console.log(`🛡️  Security: OWASP Headers Active\n`);
  });
}

startServer();
