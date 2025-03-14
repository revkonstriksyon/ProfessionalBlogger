import type { Express, Request, Response, NextFunction } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { z } from "zod";
import { 
  insertSubscriptionSchema, 
  insertContactMessageSchema,
  insertPollResponseSchema 
} from "@shared/schema";
import 'express-session';

// Extend the Express.Session interface to add our custom properties
declare module 'express-session' {
  interface Session {
    authenticated?: boolean;
    user?: { id: number; username: string; role: string };
  }
}

export async function registerRoutes(app: Express): Promise<Server> {
  const httpServer = createServer(app);

  // API route prefix
  const apiRouter = '/api';

  // Categories endpoints
  app.get(`${apiRouter}/categories`, async (_req: Request, res: Response) => {
    try {
      const categories = await storage.getCategories();
      res.json(categories);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch categories" });
    }
  });

  app.get(`${apiRouter}/categories/:slug`, async (req: Request, res: Response) => {
    try {
      const { slug } = req.params;
      const category = await storage.getCategoryBySlug(slug);
      
      if (!category) {
        return res.status(404).json({ error: "Category not found" });
      }
      
      res.json(category);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch category" });
    }
  });

  // Articles endpoints
  app.get(`${apiRouter}/articles`, async (req: Request, res: Response) => {
    try {
      const limit = parseInt(req.query.limit as string) || 10;
      const offset = parseInt(req.query.offset as string) || 0;
      
      const articles = await storage.getArticles(limit, offset);
      res.json(articles);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch articles" });
    }
  });

  app.get(`${apiRouter}/articles/featured`, async (req: Request, res: Response) => {
    try {
      const limit = parseInt(req.query.limit as string) || 3;
      
      const articles = await storage.getFeaturedArticles(limit);
      res.json(articles);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch featured articles" });
    }
  });

  app.get(`${apiRouter}/articles/popular`, async (req: Request, res: Response) => {
    try {
      const limit = parseInt(req.query.limit as string) || 3;
      
      const articles = await storage.getPopularArticles(limit);
      res.json(articles);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch popular articles" });
    }
  });

  app.get(`${apiRouter}/articles/category/:categoryId`, async (req: Request, res: Response) => {
    try {
      const categoryId = parseInt(req.params.categoryId);
      const limit = parseInt(req.query.limit as string) || 10;
      const offset = parseInt(req.query.offset as string) || 0;
      
      if (isNaN(categoryId)) {
        return res.status(400).json({ error: "Invalid category ID" });
      }
      
      const articles = await storage.getArticlesByCategory(categoryId, limit, offset);
      res.json(articles);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch articles by category" });
    }
  });

  app.get(`${apiRouter}/articles/related/:articleId`, async (req: Request, res: Response) => {
    try {
      const articleId = parseInt(req.params.articleId);
      const limit = parseInt(req.query.limit as string) || 3;
      
      if (isNaN(articleId)) {
        return res.status(400).json({ error: "Invalid article ID" });
      }
      
      const articles = await storage.getRelatedArticles(articleId, limit);
      res.json(articles);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch related articles" });
    }
  });

  app.get(`${apiRouter}/articles/search`, async (req: Request, res: Response) => {
    try {
      const query = req.query.q as string;
      const limit = parseInt(req.query.limit as string) || 10;
      const offset = parseInt(req.query.offset as string) || 0;
      
      if (!query) {
        return res.status(400).json({ error: "Search query is required" });
      }
      
      const articles = await storage.searchArticles(query, limit, offset);
      res.json(articles);
    } catch (error) {
      res.status(500).json({ error: "Failed to search articles" });
    }
  });

  app.get(`${apiRouter}/articles/:slug`, async (req: Request, res: Response) => {
    try {
      const { slug } = req.params;
      const article = await storage.getArticleBySlug(slug);
      
      if (!article) {
        return res.status(404).json({ error: "Article not found" });
      }
      
      res.json(article);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch article" });
    }
  });

  // Media endpoints
  app.get(`${apiRouter}/media`, async (req: Request, res: Response) => {
    try {
      const type = req.query.type as string | undefined;
      const limit = parseInt(req.query.limit as string) || 10;
      const offset = parseInt(req.query.offset as string) || 0;
      
      const mediaItems = await storage.getMedia(type, limit, offset);
      res.json(mediaItems);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch media" });
    }
  });

  app.get(`${apiRouter}/media/:id`, async (req: Request, res: Response) => {
    try {
      const id = parseInt(req.params.id);
      
      if (isNaN(id)) {
        return res.status(400).json({ error: "Invalid media ID" });
      }
      
      const mediaItem = await storage.getMediaById(id);
      
      if (!mediaItem) {
        return res.status(404).json({ error: "Media not found" });
      }
      
      res.json(mediaItem);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch media" });
    }
  });

  // Poll endpoints
  app.get(`${apiRouter}/polls/active`, async (req: Request, res: Response) => {
    try {
      const polls = await storage.getActivePolls();
      res.json(polls);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch active polls" });
    }
  });

  app.get(`${apiRouter}/polls/:id`, async (req: Request, res: Response) => {
    try {
      const id = parseInt(req.params.id);
      
      if (isNaN(id)) {
        return res.status(400).json({ error: "Invalid poll ID" });
      }
      
      const poll = await storage.getPollById(id);
      
      if (!poll) {
        return res.status(404).json({ error: "Poll not found" });
      }
      
      res.json(poll);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch poll" });
    }
  });

  app.get(`${apiRouter}/polls/:id/results`, async (req: Request, res: Response) => {
    try {
      const id = parseInt(req.params.id);
      
      if (isNaN(id)) {
        return res.status(400).json({ error: "Invalid poll ID" });
      }
      
      const poll = await storage.getPollById(id);
      
      if (!poll) {
        return res.status(404).json({ error: "Poll not found" });
      }
      
      const results = await storage.getPollResults(id);
      res.json(results);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch poll results" });
    }
  });

  app.post(`${apiRouter}/polls/:id/vote`, async (req: Request, res: Response) => {
    try {
      const id = parseInt(req.params.id);
      
      if (isNaN(id)) {
        return res.status(400).json({ error: "Invalid poll ID" });
      }
      
      const poll = await storage.getPollById(id);
      
      if (!poll) {
        return res.status(404).json({ error: "Poll not found" });
      }
      
      if (!poll.active || (poll.expires_at && new Date(poll.expires_at) < new Date())) {
        return res.status(400).json({ error: "Poll is no longer active" });
      }
      
      const validationResult = insertPollResponseSchema.safeParse(req.body);
      
      if (!validationResult.success) {
        return res.status(400).json({ error: "Invalid poll response data", details: validationResult.error });
      }
      
      // Get client IP address
      const ipAddress = req.headers['x-forwarded-for'] || req.socket.remoteAddress || '0.0.0.0';
      
      // Create poll response
      const response = await storage.submitPollResponse({
        ...validationResult.data,
        poll_id: id,
        ip_address: typeof ipAddress === 'string' ? ipAddress : ipAddress[0]
      });
      
      res.status(201).json(response);
    } catch (error) {
      res.status(500).json({ error: "Failed to submit poll response" });
    }
  });

  // Subscription endpoints
  app.post(`${apiRouter}/subscribe`, async (req: Request, res: Response) => {
    try {
      const validationResult = insertSubscriptionSchema.safeParse(req.body);
      
      if (!validationResult.success) {
        return res.status(400).json({ error: "Invalid subscription data", details: validationResult.error });
      }
      
      const subscription = await storage.createSubscription(validationResult.data);
      res.status(201).json(subscription);
    } catch (error) {
      res.status(500).json({ error: "Failed to create subscription" });
    }
  });

  // Auth middleware for admin routes
  const authMiddleware = (req: Request, res: Response, next: NextFunction) => {
    if (!req.session || !req.session.authenticated) {
      return res.status(401).json({ error: "Unauthorized" });
    }
    if (!req.session.user || req.session.user.role !== 'admin') {
      return res.status(403).json({ error: "Access denied" });
    }
    next();
  };

  // Admin authentication
  app.post(`${apiRouter}/admin/login`, async (req: Request, res: Response) => {
    try {
      const { username, password } = req.body;
      
      // Pou demonstrasyon sèlman, itilize enfòmasyon fiks
      // Nan yon vèsyon reyèl, fè verifye nan baz done
      if (username === "admin" && password === "admin123") {
        // Kreye sesyon
        if (req.session) {
          req.session.authenticated = true;
          req.session.user = { id: 1, username: "admin", role: "admin" };
        }
        
        return res.status(200).json({ success: true, message: "Otantifikasyon reyisi" });
      }
      
      return res.status(401).json({ success: false, message: "Non itilizatè oswa modpas la pa kòrèk" });
    } catch (error) {
      console.error('Error during login:', error);
      return res.status(500).json({ success: false, message: 'Internal server error' });
    }
  });
  
  app.get(`${apiRouter}/admin/check-auth`, async (req: Request, res: Response) => {
    try {
      if (req.session && req.session.authenticated) {
        return res.status(200).json({ authenticated: true, user: req.session.user });
      }
      
      return res.status(401).json({ authenticated: false });
    } catch (error) {
      console.error('Error checking auth:', error);
      return res.status(500).json({ success: false, message: 'Internal server error' });
    }
  });
  
  app.post(`${apiRouter}/admin/logout`, async (req: Request, res: Response) => {
    try {
      if (req.session) {
        req.session.destroy((err) => {
          if (err) {
            return res.status(500).json({ success: false, message: 'Error logging out' });
          }
          
          return res.status(200).json({ success: true, message: 'Logout successful' });
        });
      } else {
        return res.status(200).json({ success: true, message: 'Logout successful' });
      }
    } catch (error) {
      console.error('Error during logout:', error);
      return res.status(500).json({ success: false, message: 'Internal server error' });
    }
  });

  // Admin media routes
  app.get(`${apiRouter}/admin/media`, authMiddleware, async (req: Request, res: Response) => {
    try {
      const type = req.query.type as string | undefined;
      const limit = parseInt(req.query.limit as string) || 10;
      const offset = parseInt(req.query.offset as string) || 0;
      
      const mediaItems = await storage.getMedia(type, limit, offset);
      res.json(mediaItems);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch admin media" });
    }
  });

  app.post(`${apiRouter}/admin/media`, authMiddleware, async (req: Request, res: Response) => {
    try {
      const media = await storage.createMedia(req.body);
      res.status(201).json(media);
    } catch (error) {
      res.status(500).json({ error: "Failed to create media" });
    }
  });
  
  // Admin categories routes
  app.get(`${apiRouter}/admin/categories`, authMiddleware, async (req: Request, res: Response) => {
    try {
      const categories = await storage.getCategories();
      res.json(categories);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch admin categories" });
    }
  });

  app.post(`${apiRouter}/admin/categories`, authMiddleware, async (req: Request, res: Response) => {
    try {
      const category = await storage.createCategory(req.body);
      res.status(201).json(category);
    } catch (error) {
      res.status(500).json({ error: "Failed to create category" });
    }
  });

  app.delete(`${apiRouter}/admin/articles/:id`, authMiddleware, async (req: Request, res: Response) => {
    try {
      const id = parseInt(req.params.id);
      await storage.deleteArticle(id);
      res.status(204).send();
    } catch (error) {
      res.status(500).json({ error: "Failed to delete article" });
    }
  });

  // Admin endpoints
  app.get(`${apiRouter}/admin/dashboard`, authMiddleware, async (req: Request, res: Response) => {
    try {

      const articles = await storage.getArticles();
      const categories = await storage.getCategories();
      const messages = await storage.getContactMessages();
      
      res.json({
        articles,
        categories,
        messages
      });
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch admin data" });
    }
  });

  app.post(`${apiRouter}/admin/articles`, authMiddleware, async (req: Request, res: Response) => {
    try {      
      const article = await storage.createArticle(req.body);
      res.status(201).json(article);
    } catch (error) {
      res.status(500).json({ error: "Failed to create article" });
    }
  });

  app.put(`${apiRouter}/admin/articles/:id`, authMiddleware, async (req: Request, res: Response) => {
    try {
      const id = parseInt(req.params.id);
      const article = await storage.updateArticle(id, req.body);
      res.json(article);
    } catch (error) {
      res.status(500).json({ error: "Failed to update article" });
    }
  });

  app.delete(`${apiRouter}/admin/articles/:id`, authMiddleware, async (req: Request, res: Response) => {
    try {
      const id = parseInt(req.params.id);
      await storage.deleteArticle(id);
      res.status(204).send();
    } catch (error) {
      res.status(500).json({ error: "Failed to delete article" });
    }
  });

  // Contact endpoints
  app.post(`${apiRouter}/contact`, async (req: Request, res: Response) => {
    try {
      const validationResult = insertContactMessageSchema.safeParse(req.body);
      
      if (!validationResult.success) {
        return res.status(400).json({ error: "Invalid contact message data", details: validationResult.error });
      }
      
      const contactMessage = await storage.createContactMessage(validationResult.data);
      res.status(201).json(contactMessage);
    } catch (error) {
      res.status(500).json({ error: "Failed to create contact message" });
    }
  });

  return httpServer;
}
