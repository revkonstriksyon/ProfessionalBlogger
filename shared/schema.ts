import { pgTable, text, serial, integer, boolean, timestamp, json } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// Users table
export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
  email: text("email").notNull().unique(),
  role: text("role").notNull().default("user"),
  language: text("language").notNull().default("ht"),
});

// Categories table
export const categories = pgTable("categories", {
  id: serial("id").primaryKey(),
  name_ht: text("name_ht").notNull(),
  name_fr: text("name_fr").notNull(),
  name_en: text("name_en").notNull(),
  slug: text("slug").notNull().unique(),
});

// Articles table
export const articles = pgTable("articles", {
  id: serial("id").primaryKey(),
  title_ht: text("title_ht").notNull(),
  title_fr: text("title_fr").notNull(),
  title_en: text("title_en").notNull(),
  content_ht: text("content_ht").notNull(),
  content_fr: text("content_fr").notNull(),
  content_en: text("content_en").notNull(),
  excerpt_ht: text("excerpt_ht").notNull(),
  excerpt_fr: text("excerpt_fr").notNull(),
  excerpt_en: text("excerpt_en").notNull(),
  slug: text("slug").notNull().unique(),
  image_url: text("image_url").notNull(),
  category_id: integer("category_id").notNull(),
  author_id: integer("author_id").notNull(),
  is_featured: boolean("is_featured").notNull().default(false),
  published_at: timestamp("published_at").notNull().defaultNow(),
  read_time: integer("read_time").notNull(),
  tags: text("tags").array(),
});

// Media table (for photos, videos, podcasts)
export const media = pgTable("media", {
  id: serial("id").primaryKey(),
  title_ht: text("title_ht").notNull(),
  title_fr: text("title_fr").notNull(),
  title_en: text("title_en").notNull(),
  type: text("type").notNull(), // photo, video, podcast
  url: text("url").notNull(),
  thumbnail_url: text("thumbnail_url").notNull(),
  description_ht: text("description_ht"),
  description_fr: text("description_fr"),
  description_en: text("description_en"),
  published_at: timestamp("published_at").notNull().defaultNow(),
});

// Polls table
export const polls = pgTable("polls", {
  id: serial("id").primaryKey(),
  question_ht: text("question_ht").notNull(),
  question_fr: text("question_fr").notNull(),
  question_en: text("question_en").notNull(),
  options: json("options").notNull(), // Array of options with translations
  active: boolean("active").notNull().default(true),
  created_at: timestamp("created_at").notNull().defaultNow(),
  expires_at: timestamp("expires_at"),
});

// Poll responses table
export const pollResponses = pgTable("poll_responses", {
  id: serial("id").primaryKey(),
  poll_id: integer("poll_id").notNull(),
  option_id: integer("option_id").notNull(), // Index of the option in the options array
  ip_address: text("ip_address").notNull(),
  created_at: timestamp("created_at").notNull().defaultNow(),
});

// Subscriptions table
export const subscriptions = pgTable("subscriptions", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  email: text("email").notNull().unique(),
  frequency: text("frequency").notNull(), // daily, weekly, monthly
  language: text("language").notNull().default("ht"),
  created_at: timestamp("created_at").notNull().defaultNow(),
});

// Contact messages table
export const contactMessages = pgTable("contact_messages", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  email: text("email").notNull(),
  subject: text("subject").notNull(),
  message: text("message").notNull(),
  created_at: timestamp("created_at").notNull().defaultNow(),
  read: boolean("read").notNull().default(false),
});

// Define insert schemas
export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
  email: true,
  language: true,
});

export const insertCategorySchema = createInsertSchema(categories).pick({
  name_ht: true,
  name_fr: true,
  name_en: true,
  slug: true,
});

export const insertArticleSchema = createInsertSchema(articles).omit({
  id: true,
  published_at: true,
});

export const insertMediaSchema = createInsertSchema(media).omit({
  id: true,
  published_at: true,
});

export const insertPollSchema = createInsertSchema(polls).omit({
  id: true,
  created_at: true,
});

export const insertPollResponseSchema = createInsertSchema(pollResponses).omit({
  id: true,
  created_at: true,
});

export const insertSubscriptionSchema = createInsertSchema(subscriptions).omit({
  id: true,
  created_at: true,
});

export const insertContactMessageSchema = createInsertSchema(contactMessages).omit({
  id: true,
  created_at: true,
  read: true,
});

// Define select types
export type User = typeof users.$inferSelect;
export type Category = typeof categories.$inferSelect;
export type Article = typeof articles.$inferSelect;
export type Media = typeof media.$inferSelect;
export type Poll = typeof polls.$inferSelect;
export type PollResponse = typeof pollResponses.$inferSelect;
export type Subscription = typeof subscriptions.$inferSelect;
export type ContactMessage = typeof contactMessages.$inferSelect;

// Define insert types
export type InsertUser = z.infer<typeof insertUserSchema>;
export type InsertCategory = z.infer<typeof insertCategorySchema>;
export type InsertArticle = z.infer<typeof insertArticleSchema>;
export type InsertMedia = z.infer<typeof insertMediaSchema>;
export type InsertPoll = z.infer<typeof insertPollSchema>;
export type InsertPollResponse = z.infer<typeof insertPollResponseSchema>;
export type InsertSubscription = z.infer<typeof insertSubscriptionSchema>;
export type InsertContactMessage = z.infer<typeof insertContactMessageSchema>;
