import { pgTable, text, serial, integer, boolean, timestamp, jsonb } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// Categories for blog posts
export const categories = pgTable("categories", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  slug: text("slug").notNull().unique(),
});

export const insertCategorySchema = createInsertSchema(categories).pick({
  name: true,
  slug: true,
});

// Languages supported
export const languages = ["ht", "fr", "en"] as const;
export type Language = typeof languages[number];

// Articles/posts
export const articles = pgTable("articles", {
  id: serial("id").primaryKey(),
  slug: text("slug").notNull().unique(),
  categoryId: integer("category_id").notNull(),
  featured: boolean("featured").default(false),
  breakingNews: boolean("breaking_news").default(false),
  publishedAt: timestamp("published_at").notNull().defaultNow(),
  // Using jsonb to store translations for title, content, and excerpt
  title: jsonb("title").notNull().$type<Record<Language, string>>(),
  content: jsonb("content").notNull().$type<Record<Language, string>>(),
  excerpt: jsonb("excerpt").notNull().$type<Record<Language, string>>(),
  author: text("author").notNull(),
  authorImageUrl: text("author_image_url"),
  imageUrl: text("image_url").notNull(),
  viewCount: integer("view_count").default(0),
  commentCount: integer("comment_count").default(0),
  likeCount: integer("like_count").default(0),
});

// Media items (photos, videos, podcasts)
export const mediaItems = pgTable("media_items", {
  id: serial("id").primaryKey(),
  type: text("type").notNull(), // 'photo', 'video', 'podcast'
  title: jsonb("title").notNull().$type<Record<Language, string>>(),
  url: text("url").notNull(),
  thumbnailUrl: text("thumbnail_url"),
  publishedAt: timestamp("published_at").notNull().defaultNow(),
});

// Comments
export const comments = pgTable("comments", {
  id: serial("id").primaryKey(),
  articleId: integer("article_id").notNull(),
  name: text("name").notNull(),
  email: text("email").notNull(),
  content: text("content").notNull(),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

// Polls
export const polls = pgTable("polls", {
  id: serial("id").primaryKey(),
  question: jsonb("question").notNull().$type<Record<Language, string>>(),
  active: boolean("active").default(true),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

// Poll options
export const pollOptions = pgTable("poll_options", {
  id: serial("id").primaryKey(),
  pollId: integer("poll_id").notNull(),
  text: jsonb("text").notNull().$type<Record<Language, string>>(),
  votes: integer("votes").default(0),
});

// Newsletter subscribers
export const subscribers = pgTable("subscribers", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  email: text("email").notNull().unique(),
  preferredLanguage: text("preferred_language").notNull(),
  subscribedAt: timestamp("subscribed_at").notNull().defaultNow(),
});

// Contact messages
export const contactMessages = pgTable("contact_messages", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  email: text("email").notNull(),
  subject: text("subject").notNull(),
  message: text("message").notNull(),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

// Insert schemas
export const insertArticleSchema = createInsertSchema(articles).omit({
  id: true,
  viewCount: true,
  commentCount: true,
  likeCount: true,
});

export const insertMediaItemSchema = createInsertSchema(mediaItems).omit({
  id: true,
});

export const insertCommentSchema = createInsertSchema(comments).omit({
  id: true,
  createdAt: true,
});

export const insertPollSchema = createInsertSchema(polls).omit({
  id: true,
  createdAt: true,
});

export const insertPollOptionSchema = createInsertSchema(pollOptions).omit({
  id: true,
  votes: true,
});

export const insertSubscriberSchema = createInsertSchema(subscribers).omit({
  id: true,
  subscribedAt: true,
});

export const insertContactMessageSchema = createInsertSchema(contactMessages).omit({
  id: true,
  createdAt: true,
});

// Types
export type Category = typeof categories.$inferSelect;
export type InsertCategory = z.infer<typeof insertCategorySchema>;

export type Article = typeof articles.$inferSelect;
export type InsertArticle = z.infer<typeof insertArticleSchema>;

export type MediaItem = typeof mediaItems.$inferSelect;
export type InsertMediaItem = z.infer<typeof insertMediaItemSchema>;

export type Comment = typeof comments.$inferSelect;
export type InsertComment = z.infer<typeof insertCommentSchema>;

export type Poll = typeof polls.$inferSelect;
export type InsertPoll = z.infer<typeof insertPollSchema>;

export type PollOption = typeof pollOptions.$inferSelect;
export type InsertPollOption = z.infer<typeof insertPollOptionSchema>;

export type Subscriber = typeof subscribers.$inferSelect;
export type InsertSubscriber = z.infer<typeof insertSubscriberSchema>;

export type ContactMessage = typeof contactMessages.$inferSelect;
export type InsertContactMessage = z.infer<typeof insertContactMessageSchema>;
