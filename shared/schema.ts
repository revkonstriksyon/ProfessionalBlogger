import { pgTable, text, serial, integer, timestamp, boolean } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
  email: text("email").notNull().unique(),
  isAdmin: boolean("is_admin").default(false),
});

export const categories = pgTable("categories", {
  id: serial("id").primaryKey(),
  nameHt: text("name_ht").notNull(),
  nameFr: text("name_fr").notNull(),
  nameEn: text("name_en").notNull(),
  slug: text("slug").notNull().unique(),
  icon: text("icon").notNull(),
  color: text("color").notNull().default("#00209F"),
});

export const articles = pgTable("articles", {
  id: serial("id").primaryKey(),
  titleHt: text("title_ht").notNull(),
  titleFr: text("title_fr").notNull(),
  titleEn: text("title_en").notNull(),
  contentHt: text("content_ht").notNull(),
  contentFr: text("content_fr").notNull(),
  contentEn: text("content_en").notNull(),
  excerpt: text("excerpt"),
  slug: text("slug").notNull().unique(),
  imageUrl: text("image_url"),
  categoryId: integer("category_id").notNull(),
  authorId: integer("author_id").notNull(),
  featured: boolean("featured").default(false),
  publishedAt: timestamp("published_at").notNull().defaultNow(),
});

export const media = pgTable("media", {
  id: serial("id").primaryKey(),
  titleHt: text("title_ht").notNull(),
  titleFr: text("title_fr").notNull(),
  titleEn: text("title_en").notNull(),
  type: text("type").notNull(), // photo, video, podcast
  url: text("url").notNull(),
  thumbnailUrl: text("thumbnail_url"),
  descriptionHt: text("description_ht"),
  descriptionFr: text("description_fr"),
  descriptionEn: text("description_en"),
  publishedAt: timestamp("published_at").notNull().defaultNow(),
});

export const polls = pgTable("polls", {
  id: serial("id").primaryKey(),
  questionHt: text("question_ht").notNull(),
  questionFr: text("question_fr").notNull(),
  questionEn: text("question_en").notNull(),
  isActive: boolean("is_active").default(true),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const pollOptions = pgTable("poll_options", {
  id: serial("id").primaryKey(),
  pollId: integer("poll_id").notNull(),
  optionHt: text("option_ht").notNull(),
  optionFr: text("option_fr").notNull(),
  optionEn: text("option_en").notNull(),
  votes: integer("votes").default(0),
});

export const subscribers = pgTable("subscribers", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  email: text("email").notNull().unique(),
  preferredLanguage: text("preferred_language").notNull(),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const contactMessages = pgTable("contact_messages", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  email: text("email").notNull(),
  subject: text("subject").notNull(),
  message: text("message").notNull(),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

// Insert schemas
export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
  email: true,
  isAdmin: true,
});

export const insertCategorySchema = createInsertSchema(categories);

export const insertArticleSchema = createInsertSchema(articles);

export const insertMediaSchema = createInsertSchema(media);

export const insertPollSchema = createInsertSchema(polls).pick({
  questionHt: true,
  questionFr: true,
  questionEn: true,
  isActive: true,
});

export const insertPollOptionSchema = createInsertSchema(pollOptions).pick({
  pollId: true,
  optionHt: true,
  optionFr: true,
  optionEn: true,
});

export const insertSubscriberSchema = createInsertSchema(subscribers).pick({
  name: true,
  email: true,
  preferredLanguage: true,
});

export const insertContactMessageSchema = createInsertSchema(contactMessages).pick({
  name: true,
  email: true,
  subject: true,
  message: true,
});

// Types
export type User = typeof users.$inferSelect;
export type InsertUser = z.infer<typeof insertUserSchema>;

export type Category = typeof categories.$inferSelect;
export type InsertCategory = z.infer<typeof insertCategorySchema>;

export type Article = typeof articles.$inferSelect;
export type InsertArticle = z.infer<typeof insertArticleSchema>;

export type Media = typeof media.$inferSelect;
export type InsertMedia = z.infer<typeof insertMediaSchema>;

export type Poll = typeof polls.$inferSelect;
export type InsertPoll = z.infer<typeof insertPollSchema>;

export type PollOption = typeof pollOptions.$inferSelect;
export type InsertPollOption = z.infer<typeof insertPollOptionSchema>;

export type Subscriber = typeof subscribers.$inferSelect;
export type InsertSubscriber = z.infer<typeof insertSubscriberSchema>;

export type ContactMessage = typeof contactMessages.$inferSelect;
export type InsertContactMessage = z.infer<typeof insertContactMessageSchema>;
