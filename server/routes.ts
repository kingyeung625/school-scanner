import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";

export async function registerRoutes(app: Express): Promise<Server> {
  // API endpoint to fetch Open Graph metadata from a URL
  app.get("/api/og-metadata", async (req, res) => {
    try {
      const url = req.query.url as string;
      if (!url) {
        return res.status(400).json({ error: "URL parameter is required" });
      }

      const response = await fetch(url);
      const html = await response.text();

      // Parse Open Graph meta tags
      const ogImage = html.match(/<meta[^>]*property=["']og:image["'][^>]*content=["']([^"']*)["']/i)?.[1] || '';
      const ogTitle = html.match(/<meta[^>]*property=["']og:title["'][^>]*content=["']([^"']*)["']/i)?.[1] || '';
      const ogDescription = html.match(/<meta[^>]*property=["']og:description["'][^>]*content=["']([^"']*)["']/i)?.[1] || '';

      res.json({
        ogImage,
        ogTitle,
        ogDescription,
      });
    } catch (error) {
      console.error('Error fetching OG metadata:', error);
      res.status(500).json({ error: "Failed to fetch OG metadata" });
    }
  });

  const httpServer = createServer(app);

  return httpServer;
}
