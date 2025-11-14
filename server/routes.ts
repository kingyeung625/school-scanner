import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";

export async function registerRoutes(app: Express): Promise<Server> {
  // API endpoint to fetch Open Graph metadata from a URL
  // Security: Only allows whitelisted domains to prevent SSRF attacks
  app.get("/api/og-metadata", async (req, res) => {
    try {
      const url = req.query.url as string;
      if (!url) {
        return res.status(400).json({ error: "URL parameter is required" });
      }

      // SECURITY: Whitelist allowed domains to prevent SSRF
      const allowedDomains = ['hk01.com', 'www.hk01.com'];
      let parsedUrl;
      try {
        parsedUrl = new URL(url);
      } catch {
        return res.status(400).json({ error: "Invalid URL" });
      }

      if (!allowedDomains.includes(parsedUrl.hostname)) {
        return res.status(403).json({ error: "Domain not allowed" });
      }

      // Fetch with timeout to prevent hanging
      const controller = new AbortController();
      const timeout = setTimeout(() => controller.abort(), 5000); // 5 second timeout

      const response = await fetch(url, { signal: controller.signal });
      clearTimeout(timeout);

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
      if (error instanceof Error && error.name === 'AbortError') {
        res.status(504).json({ error: "Request timeout" });
      } else {
        res.status(500).json({ error: "Failed to fetch OG metadata" });
      }
    }
  });

  const httpServer = createServer(app);

  return httpServer;
}
