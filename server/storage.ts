import {
  users,
  categories,
  articles,
  media,
  polls,
  pollOptions,
  subscribers,
  contactMessages,
  type User,
  type InsertUser,
  type Category,
  type InsertCategory,
  type Article,
  type InsertArticle,
  type Media,
  type InsertMedia,
  type Poll,
  type InsertPoll,
  type PollOption,
  type InsertPollOption,
  type Subscriber,
  type InsertSubscriber,
  type ContactMessage,
  type InsertContactMessage
} from "@shared/schema";

export interface IStorage {
  // Users
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;

  // Categories
  getCategories(): Promise<Category[]>;
  getCategoryBySlug(slug: string): Promise<Category | undefined>;
  createCategory(category: InsertCategory): Promise<Category>;

  // Articles
  getArticles(limit?: number): Promise<Article[]>;
  getFeaturedArticles(): Promise<Article[]>;
  getArticlesByCategory(categoryId: number): Promise<Article[]>;
  getArticleBySlug(slug: string): Promise<Article | undefined>;
  createArticle(article: InsertArticle): Promise<Article>;

  // Media
  getMediaByType(type: string): Promise<Media[]>;
  createMedia(media: InsertMedia): Promise<Media>;

  // Polls
  getActivePolls(): Promise<Poll[]>;
  getPollWithOptions(pollId: number): Promise<{ poll: Poll; options: PollOption[] } | undefined>;
  createPoll(poll: InsertPoll, options: Omit<InsertPollOption, "pollId">[]): Promise<Poll>;
  voteForOption(optionId: number): Promise<void>;

  // Subscribers
  createSubscriber(subscriber: InsertSubscriber): Promise<Subscriber>;

  // Contact Messages
  createContactMessage(message: InsertContactMessage): Promise<ContactMessage>;
}

export class MemStorage implements IStorage {
  private users: Map<number, User>;
  private categories: Map<number, Category>;
  private articles: Map<number, Article>;
  private media: Map<number, Media>;
  private polls: Map<number, Poll>;
  private pollOptions: Map<number, PollOption>;
  private subscribers: Map<number, Subscriber>;
  private contactMessages: Map<number, ContactMessage>;

  private userIdCounter: number;
  private categoryIdCounter: number;
  private articleIdCounter: number;
  private mediaIdCounter: number;
  private pollIdCounter: number;
  private pollOptionIdCounter: number;
  private subscriberIdCounter: number;
  private contactMessageIdCounter: number;

  constructor() {
    this.users = new Map();
    this.categories = new Map();
    this.articles = new Map();
    this.media = new Map();
    this.polls = new Map();
    this.pollOptions = new Map();
    this.subscribers = new Map();
    this.contactMessages = new Map();

    this.userIdCounter = 1;
    this.categoryIdCounter = 1;
    this.articleIdCounter = 1;
    this.mediaIdCounter = 1;
    this.pollIdCounter = 1;
    this.pollOptionIdCounter = 1;
    this.subscriberIdCounter = 1;
    this.contactMessageIdCounter = 1;

    // Initialize with sample data
    this.initializeData();
  }

  private initializeData() {
    // Add categories
    const categories = [
      {
        nameHt: "Aktualite",
        nameFr: "Actualités",
        nameEn: "News",
        slug: "news",
        icon: "newspaper",
        color: "#D42E12"
      },
      {
        nameHt: "Politik",
        nameFr: "Politique",
        nameEn: "Politics",
        slug: "politics",
        icon: "landmark",
        color: "#00209F"
      },
      {
        nameHt: "Kilti",
        nameFr: "Culture",
        nameEn: "Culture",
        slug: "culture",
        icon: "palette",
        color: "#FFCC00"
      },
      {
        nameHt: "Espò",
        nameFr: "Sports",
        nameEn: "Sports",
        slug: "sports",
        icon: "futbol",
        color: "#22C55E"
      },
      {
        nameHt: "Edikasyon",
        nameFr: "Éducation",
        nameEn: "Education",
        slug: "education",
        icon: "graduation-cap",
        color: "#A855F7"
      },
      {
        nameHt: "Sante",
        nameFr: "Santé",
        nameEn: "Health",
        slug: "health",
        icon: "heartbeat",
        color: "#EF4444"
      },
      {
        nameHt: "Teknoloji",
        nameFr: "Technologie",
        nameEn: "Technology",
        slug: "technology",
        icon: "microchip",
        color: "#3B82F6"
      }
    ];

    categories.forEach(category => {
      this.createCategory({
        ...category,
      });
    });

    // Create active poll
    const poll = {
      questionHt: "Ki pi gwo priyorite pou devlopman Ayiti?",
      questionFr: "Quelle est la plus grande priorité pour le développement d'Haïti?",
      questionEn: "What is the biggest priority for Haiti's development?",
      isActive: true
    };

    const pollOptions = [
      {
        optionHt: "Edikasyon",
        optionFr: "Éducation",
        optionEn: "Education",
        votes: 533
      },
      {
        optionHt: "Sekirite",
        optionFr: "Sécurité",
        optionEn: "Security",
        votes: 427
      },
      {
        optionHt: "Enfrastrikti",
        optionFr: "Infrastructure",
        optionEn: "Infrastructure",
        votes: 274
      },
      {
        optionHt: "Agrikilti",
        optionFr: "Agriculture",
        optionEn: "Agriculture",
        votes: 183
      },
      {
        optionHt: "Swen Sante",
        optionFr: "Soins de Santé",
        optionEn: "Healthcare",
        votes: 106
      }
    ];

    this.createPoll(poll, pollOptions);
  }

  // User methods
  async getUser(id: number): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(user => user.username === username);
  }

  async createUser(user: InsertUser): Promise<User> {
    const id = this.userIdCounter++;
    const newUser: User = { id, ...user };
    this.users.set(id, newUser);
    return newUser;
  }

  // Category methods
  async getCategories(): Promise<Category[]> {
    return Array.from(this.categories.values());
  }

  async getCategoryBySlug(slug: string): Promise<Category | undefined> {
    return Array.from(this.categories.values()).find(category => category.slug === slug);
  }

  async createCategory(category: InsertCategory): Promise<Category> {
    const id = this.categoryIdCounter++;
    const newCategory: Category = { id, ...category };
    this.categories.set(id, newCategory);
    return newCategory;
  }

  // Article methods
  async getArticles(limit?: number): Promise<Article[]> {
    const articles = Array.from(this.articles.values())
      .sort((a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime());
    
    return limit ? articles.slice(0, limit) : articles;
  }

  async getFeaturedArticles(): Promise<Article[]> {
    return Array.from(this.articles.values())
      .filter(article => article.featured)
      .sort((a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime());
  }

  async getArticlesByCategory(categoryId: number): Promise<Article[]> {
    return Array.from(this.articles.values())
      .filter(article => article.categoryId === categoryId)
      .sort((a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime());
  }

  async getArticleBySlug(slug: string): Promise<Article | undefined> {
    return Array.from(this.articles.values()).find(article => article.slug === slug);
  }

  async createArticle(article: InsertArticle): Promise<Article> {
    const id = this.articleIdCounter++;
    const newArticle: Article = { id, ...article };
    this.articles.set(id, newArticle);
    return newArticle;
  }

  // Media methods
  async getMediaByType(type: string): Promise<Media[]> {
    return Array.from(this.media.values())
      .filter(item => item.type === type)
      .sort((a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime());
  }

  async createMedia(media: InsertMedia): Promise<Media> {
    const id = this.mediaIdCounter++;
    const newMedia: Media = { id, ...media };
    this.media.set(id, newMedia);
    return newMedia;
  }

  // Poll methods
  async getActivePolls(): Promise<Poll[]> {
    return Array.from(this.polls.values())
      .filter(poll => poll.isActive)
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  }

  async getPollWithOptions(pollId: number): Promise<{ poll: Poll; options: PollOption[] } | undefined> {
    const poll = this.polls.get(pollId);
    if (!poll) return undefined;

    const options = Array.from(this.pollOptions.values())
      .filter(option => option.pollId === pollId);

    return { poll, options };
  }

  async createPoll(poll: InsertPoll, options: Omit<InsertPollOption, "pollId">[]): Promise<Poll> {
    const id = this.pollIdCounter++;
    const newPoll: Poll = { id, ...poll, createdAt: new Date() };
    this.polls.set(id, newPoll);

    // Create options for the poll
    options.forEach(option => {
      const optionId = this.pollOptionIdCounter++;
      const newOption: PollOption = {
        id: optionId,
        pollId: id,
        optionHt: option.optionHt,
        optionFr: option.optionFr,
        optionEn: option.optionEn,
        votes: option.votes || 0
      };
      this.pollOptions.set(optionId, newOption);
    });

    return newPoll;
  }

  async voteForOption(optionId: number): Promise<void> {
    const option = this.pollOptions.get(optionId);
    if (option) {
      option.votes = (option.votes || 0) + 1;
      this.pollOptions.set(optionId, option);
    }
  }

  // Subscriber methods
  async createSubscriber(subscriber: InsertSubscriber): Promise<Subscriber> {
    // Check if email already exists
    const existingSubscriber = Array.from(this.subscribers.values())
      .find(s => s.email === subscriber.email);
    
    if (existingSubscriber) {
      return existingSubscriber;
    }

    const id = this.subscriberIdCounter++;
    const newSubscriber: Subscriber = { id, ...subscriber, createdAt: new Date() };
    this.subscribers.set(id, newSubscriber);
    return newSubscriber;
  }

  // Contact Message methods
  async createContactMessage(message: InsertContactMessage): Promise<ContactMessage> {
    const id = this.contactMessageIdCounter++;
    const newMessage: ContactMessage = { id, ...message, createdAt: new Date() };
    this.contactMessages.set(id, newMessage);
    return newMessage;
  }
}

export const storage = new MemStorage();
