import express from "express";
import path from "path";
import { fileURLToPath } from "url";
import { createServer as createViteServer } from "vite";
import cors from "cors";
import "dotenv/config";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(cors());
  app.use(express.json());

  // --- Ad Injection Logic ---
  const injectAdsIntoArticle = (articleHTML: string, adSlots: any) => {
    if (!articleHTML) return "";
    if (!adSlots) return articleHTML;
    let modifiedHTML = articleHTML;
    
    // Logic: Inject adSlots.insideArticle1 after 2nd paragraph
    const paragraphs = modifiedHTML.split("</p>");
    if (paragraphs.length > 2 && adSlots.insideArticle1) {
      paragraphs[1] += `\n<div class="my-8 ad-slot ad-inside-1">${adSlots.insideArticle1}</div>`;
    }
    
    // Inject adSlots.insideArticle2 in the middle
    const middleIndex = Math.floor(paragraphs.length / 2);
    if (paragraphs.length > 4 && adSlots.insideArticle2 && middleIndex !== 1) {
      paragraphs[middleIndex] += `\n<div class="my-8 ad-slot ad-inside-2">${adSlots.insideArticle2}</div>`;
    }

    return paragraphs.join("</p>");
  };

  app.post("/api/news/inject-ads", (req, res) => {
    const { content, ads } = req.body;
    const adInjectedContent = injectAdsIntoArticle(content, ads);
    res.json({ content: adInjectedContent });
  });

  // --- Vite Setup ---
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
