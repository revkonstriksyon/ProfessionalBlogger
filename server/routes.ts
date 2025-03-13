import type { Express, Request, Response } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { z } from "zod";
import {
  insertSubscriberSchema,
  insertContactMessageSchema,
  insertCommentSchema,
  languages,
  type Language
} from "@shared/schema";

export async function registerRoutes(app: Express): Promise<Server> {
  // API Routes - all prefixed with /api
  // We're defining individual routes with their full paths, no need for a separate router

  // Categories
  app.get('/api/categories', async (_req: Request, res: Response) => {
    try {
      const categories = await storage.getCategories();
      res.json(categories);
    } catch (error) {
      res.status(500).json({ message: 'Error fetching categories' });
    }
  });

  // Articles
  app.get('/api/articles', async (req: Request, res: Response) => {
    try {
      const limit = parseInt(req.query.limit as string) || 10;
      const offset = parseInt(req.query.offset as string) || 0;
      const articles = await storage.getArticles(limit, offset);
      res.json(articles);
    } catch (error) {
      res.status(500).json({ message: 'Error fetching articles' });
    }
  });

  app.get('/api/articles/featured', async (req: Request, res: Response) => {
    try {
      const limit = parseInt(req.query.limit as string) || 3;
      const articles = await storage.getFeaturedArticles(limit);
      res.json(articles);
    } catch (error) {
      res.status(500).json({ message: 'Error fetching featured articles' });
    }
  });

  app.get('/api/articles/latest', async (req: Request, res: Response) => {
    try {
      const limit = parseInt(req.query.limit as string) || 5;
      const articles = await storage.getLatestArticles(limit);
      res.json(articles);
    } catch (error) {
      res.status(500).json({ message: 'Error fetching latest articles' });
    }
  });

  app.get('/api/articles/breaking-news', async (_req: Request, res: Response) => {
    try {
      const articles = await storage.getBreakingNews();
      res.json(articles);
    } catch (error) {
      res.status(500).json({ message: 'Error fetching breaking news' });
    }
  });

  app.get('/api/articles/category/:slug', async (req: Request, res: Response) => {
    try {
      const { slug } = req.params;
      const limit = parseInt(req.query.limit as string) || 10;
      const offset = parseInt(req.query.offset as string) || 0;
      
      const articles = await storage.getArticlesByCategory(slug, limit, offset);
      res.json(articles);
    } catch (error) {
      res.status(500).json({ message: 'Error fetching articles by category' });
    }
  });

  app.get('/api/articles/:slug', async (req: Request, res: Response) => {
    try {
      const { slug } = req.params;
      const article = await storage.getArticleBySlug(slug);
      
      if (!article) {
        return res.status(404).json({ message: 'Article not found' });
      }
      
      // Increment view count
      await storage.incrementArticleViews(article.id);
      
      res.json(article);
    } catch (error) {
      res.status(500).json({ message: 'Error fetching article' });
    }
  });

  // Media
  app.get('/api/media', async (req: Request, res: Response) => {
    try {
      const type = req.query.type as string | undefined;
      const limit = parseInt(req.query.limit as string) || 10;
      const offset = parseInt(req.query.offset as string) || 0;
      
      const mediaItems = await storage.getMediaItems(type, limit, offset);
      res.json(mediaItems);
    } catch (error) {
      res.status(500).json({ message: 'Error fetching media items' });
    }
  });

  app.get('/api/media/:id', async (req: Request, res: Response) => {
    try {
      const id = parseInt(req.params.id);
      
      if (isNaN(id)) {
        return res.status(400).json({ message: 'Invalid ID format' });
      }
      
      const mediaItem = await storage.getMediaItemById(id);
      
      if (!mediaItem) {
        return res.status(404).json({ message: 'Media item not found' });
      }
      
      res.json(mediaItem);
    } catch (error) {
      res.status(500).json({ message: 'Error fetching media item' });
    }
  });

  // Polls
  app.get('/api/polls/active', async (_req: Request, res: Response) => {
    try {
      const activePoll = await storage.getActivePoll();
      
      if (!activePoll) {
        return res.status(404).json({ message: 'No active poll found' });
      }
      
      res.json(activePoll);
    } catch (error) {
      res.status(500).json({ message: 'Error fetching active poll' });
    }
  });

  app.post('/api/polls/vote', async (req: Request, res: Response) => {
    try {
      const schema = z.object({
        optionId: z.number()
      });
      
      const result = schema.safeParse(req.body);
      
      if (!result.success) {
        return res.status(400).json({ message: 'Invalid poll option' });
      }
      
      const { optionId } = result.data;
      const updatedOption = await storage.votePoll(optionId);
      
      if (!updatedOption) {
        return res.status(404).json({ message: 'Poll option not found' });
      }
      
      // Get the updated poll with all options
      const activePoll = await storage.getActivePoll();
      res.json(activePoll);
    } catch (error) {
      res.status(500).json({ message: 'Error voting on poll' });
    }
  });

  // Comments
  app.get('/api/articles/:articleId/comments', async (req: Request, res: Response) => {
    try {
      const articleId = parseInt(req.params.articleId);
      
      if (isNaN(articleId)) {
        return res.status(400).json({ message: 'Invalid article ID format' });
      }
      
      const comments = await storage.getCommentsByArticle(articleId);
      res.json(comments);
    } catch (error) {
      res.status(500).json({ message: 'Error fetching comments' });
    }
  });

  app.post('/api/articles/:articleId/comments', async (req: Request, res: Response) => {
    try {
      const articleId = parseInt(req.params.articleId);
      
      if (isNaN(articleId)) {
        return res.status(400).json({ message: 'Invalid article ID format' });
      }
      
      // Validate comment data
      const commentValidation = insertCommentSchema.safeParse({
        ...req.body,
        articleId
      });
      
      if (!commentValidation.success) {
        return res.status(400).json({ message: 'Invalid comment data', errors: commentValidation.error.errors });
      }
      
      const comment = await storage.createComment(commentValidation.data);
      res.status(201).json(comment);
    } catch (error) {
      res.status(500).json({ message: 'Error creating comment' });
    }
  });

  // Newsletter subscription
  app.post('/api/subscribe', async (req: Request, res: Response) => {
    try {
      // Validate subscriber data
      const subscriberValidation = insertSubscriberSchema.safeParse(req.body);
      
      if (!subscriberValidation.success) {
        return res.status(400).json({ message: 'Invalid subscription data', errors: subscriberValidation.error.errors });
      }
      
      // Check if preferred language is valid
      const { preferredLanguage } = subscriberValidation.data;
      if (!languages.includes(preferredLanguage as any)) {
        return res.status(400).json({ message: 'Invalid language preference' });
      }
      
      try {
        const subscriber = await storage.createSubscriber(subscriberValidation.data);
        res.status(201).json({ message: 'Subscription successful', subscriber });
      } catch (error: any) {
        if (error.message === 'Email already subscribed') {
          return res.status(409).json({ message: 'Email already subscribed' });
        }
        throw error;
      }
    } catch (error) {
      res.status(500).json({ message: 'Error processing subscription' });
    }
  });

  // Contact form
  app.post('/api/contact', async (req: Request, res: Response) => {
    try {
      // Validate contact message data
      const messageValidation = insertContactMessageSchema.safeParse(req.body);
      
      if (!messageValidation.success) {
        return res.status(400).json({ message: 'Invalid contact message data', errors: messageValidation.error.errors });
      }
      
      const contactMessage = await storage.createContactMessage(messageValidation.data);
      res.status(201).json({ message: 'Message sent successfully', contactMessage });
    } catch (error) {
      res.status(500).json({ message: 'Error sending message' });
    }
  });

  // Search
  app.get('/api/search', async (req: Request, res: Response) => {
    try {
      const query = req.query.q as string;
      const lang = (req.query.lang as string) || 'ht';
      
      if (!query) {
        return res.status(400).json({ message: 'Search query is required' });
      }
      
      // Validate language
      if (!languages.includes(lang as Language)) {
        return res.status(400).json({ message: 'Invalid language' });
      }
      
      const results = await storage.searchArticles(query, lang as Language);
      res.json(results);
    } catch (error) {
      res.status(500).json({ message: 'Error performing search' });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
