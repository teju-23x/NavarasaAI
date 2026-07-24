import express from "express";
import { createServer as createViteServer } from "vite";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // Proxy route for n8n to avoid CORS issues
  app.post("/api/recommendations", async (req, res) => {
    const webhookUrl = "https://navarasaai.app.n8n.cloud/webhook/recommendations";
    
    try {
      console.log("Proxying request to n8n...");
      const response = await fetch(webhookUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(req.body)
      });

      if (!response.ok) {
        throw new Error(`n8n error! status: ${response.status}`);
      }

      const data = await response.json();
      res.json(data);
    } catch (error) {
      console.error("Proxy error:", error);
      res.status(500).json({ error: "Failed to fetch from n8n" });
    }
  });

  // Proxy route for TV series recommendations
  app.post("/api/tv-recommendations", async (req, res) => {
    const webhookUrl = "https://navarasaai.app.n8n.cloud/webhook/tv-recommendations";
    try {
      console.log("Proxying TV series request to n8n...");
      const response = await fetch(webhookUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(req.body)
      });
      if (!response.ok) {
        throw new Error(`n8n error! status: ${response.status}`);
      }
      const data = await response.json();
      res.json(data);
    } catch (error) {
      console.error("TV Proxy error:", error);
      res.status(500).json({ error: "Failed to fetch TV recommendations from n8n" });
    }
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
