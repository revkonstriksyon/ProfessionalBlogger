import type { Express, Request, Response } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertSubscriberSchema, insertContactMessageSchema } from "@shared/schema";
import { z } from "zod";

export async function registerRoutes(app: Express): Promise<Server> {
  // Categories
  app.get("/api/categories", async (req: Request, res: Response) => {
    try {
      const categories = await storage.getCategories();
      res.json(categories);
    } catch (error) {
      res.status(500).json({ message: "Error fetching categories" });
    }
  });

  app.get("/api/categories/:slug", async (req: Request, res: Response) => {
    try {
      const category = await storage.getCategoryBySlug(req.params.slug);
      if (!category) {
        return res.status(404).json({ message: "Category not found" });
      }
      res.json(category);
    } catch (error) {
      res.status(500).json({ message: "Error fetching category" });
    }
  });

  // Articles
  app.get("/api/articles", async (req: Request, res: Response) => {
    try {
      const limit = req.query.limit ? parseInt(req.query.limit as string) : undefined;
      const articles = await storage.getArticles(limit);
      res.json(articles);
    } catch (error) {
      res.status(500).json({ message: "Error fetching articles" });
    }
  });

  app.get("/api/articles/featured", async (req: Request, res: Response) => {
    try {
      const featuredArticles = await storage.getFeaturedArticles();
      res.json(featuredArticles);
    } catch (error) {
      res.status(500).json({ message: "Error fetching featured articles" });
    }
  });

  app.get("/api/articles/category/:id", async (req: Request, res: Response) => {
    try {
      const categoryId = parseInt(req.params.id);
      if (isNaN(categoryId)) {
        return res.status(400).json({ message: "Invalid category ID" });
      }
      const articles = await storage.getArticlesByCategory(categoryId);
      res.json(articles);
    } catch (error) {
      res.status(500).json({ message: "Error fetching articles by category" });
    }
  });

  app.get("/api/articles/:slug", async (req: Request, res: Response) => {
    try {
      const article = await storage.getArticleBySlug(req.params.slug);
      if (!article) {
        return res.status(404).json({ message: "Article not found" });
      }
      res.json(article);
    } catch (error) {
      res.status(500).json({ message: "Error fetching article" });
    }
  });

  // Media
  app.get("/api/media/:type", async (req: Request, res: Response) => {
    try {
      const type = req.params.type;
      if (!["photo", "video", "podcast"].includes(type)) {
        return res.status(400).json({ message: "Invalid media type" });
      }
      const mediaItems = await storage.getMediaByType(type);
      res.json(mediaItems);
    } catch (error) {
      res.status(500).json({ message: "Error fetching media" });
    }
  });

  // Polls
  app.get("/api/polls/active", async (req: Request, res: Response) => {
    try {
      const activePolls = await storage.getActivePolls();
      
      if (activePolls.length === 0) {
        return res.json({ poll: null, options: [] });
      }
      
      const activePoll = activePolls[0]; // Get the first active poll
      const pollWithOptions = await storage.getPollWithOptions(activePoll.id);
      
      if (!pollWithOptions) {
        return res.status(404).json({ message: "Poll not found" });
      }
      
      res.json(pollWithOptions);
    } catch (error) {
      res.status(500).json({ message: "Error fetching active poll" });
    }
  });

  app.post("/api/polls/vote", async (req: Request, res: Response) => {
    try {
      const schema = z.object({
        optionId: z.number()
      });
      
      const parsed = schema.safeParse(req.body);
      if (!parsed.success) {
        return res.status(400).json({ message: "Invalid option ID" });
      }
      
      const { optionId } = parsed.data;
      await storage.voteForOption(optionId);
      
      // Return the updated poll with options
      const pollOptions = Array.from(await storage.getActivePolls());
      if (pollOptions.length === 0) {
        return res.status(404).json({ message: "No active polls found" });
      }
      
      const updatedPollWithOptions = await storage.getPollWithOptions(pollOptions[0].id);
      res.json(updatedPollWithOptions);
    } catch (error) {
      res.status(500).json({ message: "Error voting for poll option" });
    }
  });

  // Subscribers
  app.post("/api/subscribers", async (req: Request, res: Response) => {
    try {
      const parsed = insertSubscriberSchema.safeParse(req.body);
      if (!parsed.success) {
        return res.status(400).json({ message: "Invalid subscriber data", errors: parsed.error.format() });
      }
      
      const newSubscriber = await storage.createSubscriber(parsed.data);
      res.status(201).json(newSubscriber);
    } catch (error) {
      res.status(500).json({ message: "Error creating subscriber" });
    }
  });

  // Contact Messages
  app.post("/api/contact", async (req: Request, res: Response) => {
    try {
      const parsed = insertContactMessageSchema.safeParse(req.body);
      if (!parsed.success) {
        return res.status(400).json({ message: "Invalid message data", errors: parsed.error.format() });
      }
      
      const newMessage = await storage.createContactMessage(parsed.data);
      res.status(201).json(newMessage);
    } catch (error) {
      res.status(500).json({ message: "Error sending message" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
