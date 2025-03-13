import {
  users, categories, articles, media, polls, pollResponses, subscriptions, contactMessages,
  type User, type Category, type Article, type Media, type Poll, type PollResponse, type Subscription, type ContactMessage,
  type InsertUser, type InsertCategory, type InsertArticle, type InsertMedia, type InsertPoll, type InsertPollResponse, type InsertSubscription, type InsertContactMessage
} from "@shared/schema";

export interface IStorage {
  // User operations
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;

  // Category operations
  getCategories(): Promise<Category[]>;
  getCategoryBySlug(slug: string): Promise<Category | undefined>;
  createCategory(category: InsertCategory): Promise<Category>;

  // Article operations
  getArticles(limit?: number, offset?: number): Promise<Article[]>;
  getArticleBySlug(slug: string): Promise<Article | undefined>;
  getArticlesByCategory(categoryId: number, limit?: number, offset?: number): Promise<Article[]>;
  getFeaturedArticles(limit?: number): Promise<Article[]>;
  createArticle(article: InsertArticle): Promise<Article>;
  updateArticle(id: number, article: Partial<InsertArticle>): Promise<Article | undefined>;
  getPopularArticles(limit?: number): Promise<Article[]>;
  getRelatedArticles(articleId: number, limit?: number): Promise<Article[]>;
  searchArticles(query: string, limit?: number, offset?: number): Promise<Article[]>;

  // Media operations
  getMedia(type?: string, limit?: number, offset?: number): Promise<Media[]>;
  getMediaById(id: number): Promise<Media | undefined>;
  createMedia(media: InsertMedia): Promise<Media>;

  // Poll operations
  getActivePolls(limit?: number): Promise<Poll[]>;
  getPollById(id: number): Promise<Poll | undefined>;
  createPoll(poll: InsertPoll): Promise<Poll>;
  submitPollResponse(response: InsertPollResponse): Promise<PollResponse>;
  getPollResults(pollId: number): Promise<Record<number, number>>;

  // Subscription operations
  createSubscription(subscription: InsertSubscription): Promise<Subscription>;
  getSubscriptionByEmail(email: string): Promise<Subscription | undefined>;

  // Contact operations
  createContactMessage(message: InsertContactMessage): Promise<ContactMessage>;
  getContactMessages(limit?: number, offset?: number): Promise<ContactMessage[]>;
  markContactMessageAsRead(id: number): Promise<boolean>;
}

export class MemStorage implements IStorage {
  private users: Map<number, User>;
  private categories: Map<number, Category>;
  private articles: Map<number, Article>;
  private media: Map<number, Media>;
  private polls: Map<number, Poll>;
  private pollResponses: Map<number, PollResponse>;
  private subscriptions: Map<number, Subscription>;
  private contactMessages: Map<number, ContactMessage>;

  private currentUserId: number;
  private currentCategoryId: number;
  private currentArticleId: number;
  private currentMediaId: number;
  private currentPollId: number;
  private currentPollResponseId: number;
  private currentSubscriptionId: number;
  private currentContactMessageId: number;

  constructor() {
    this.users = new Map();
    this.categories = new Map();
    this.articles = new Map();
    this.media = new Map();
    this.polls = new Map();
    this.pollResponses = new Map();
    this.subscriptions = new Map();
    this.contactMessages = new Map();

    this.currentUserId = 1;
    this.currentCategoryId = 1;
    this.currentArticleId = 1;
    this.currentMediaId = 1;
    this.currentPollId = 1;
    this.currentPollResponseId = 1;
    this.currentSubscriptionId = 1;
    this.currentContactMessageId = 1;

    // Seed some initial data
    this.seedData();
  }

  private seedData() {
    // Seed categories
    const categoriesData: InsertCategory[] = [
      { 
        name_ht: "Aktualite", 
        name_fr: "Actualités", 
        name_en: "News", 
        slug: "news" 
      },
      { 
        name_ht: "Politik", 
        name_fr: "Politique", 
        name_en: "Politics", 
        slug: "politics" 
      },
      { 
        name_ht: "Kilti", 
        name_fr: "Culture", 
        name_en: "Culture", 
        slug: "culture" 
      },
      { 
        name_ht: "Espò", 
        name_fr: "Sports", 
        name_en: "Sports", 
        slug: "sports" 
      },
      { 
        name_ht: "Edikasyon", 
        name_fr: "Éducation", 
        name_en: "Education", 
        slug: "education" 
      },
      { 
        name_ht: "Sante", 
        name_fr: "Santé", 
        name_en: "Health", 
        slug: "health" 
      },
      { 
        name_ht: "Teknoloji", 
        name_fr: "Technologie", 
        name_en: "Technology", 
        slug: "technology" 
      }
    ];

    categoriesData.forEach(category => this.createCategory(category));

    // Create an admin user
    this.createUser({
      username: "admin",
      password: "admin123",
      email: "admin@ayitinouvel.com",
      language: "ht"
    });

    // Seed polls
    const pollData: InsertPoll = {
      question_ht: "Kisa ou panse ki pi gwo defi pou Ayiti jounen jodi a?",
      question_fr: "Quel est, selon vous, le plus grand défi pour Haïti aujourd'hui?",
      question_en: "What do you think is the biggest challenge for Haiti today?",
      options: [
        { 
          id: 0,
          text: { 
            ht: "Sekirite", 
            fr: "Sécurité", 
            en: "Security" 
          } 
        },
        { 
          id: 1,
          text: { 
            ht: "Ekonomi", 
            fr: "Économie", 
            en: "Economy" 
          } 
        },
        { 
          id: 2,
          text: { 
            ht: "Edikasyon", 
            fr: "Éducation", 
            en: "Education" 
          } 
        },
        { 
          id: 3,
          text: { 
            ht: "Sante", 
            fr: "Santé", 
            en: "Health" 
          } 
        },
        { 
          id: 4,
          text: { 
            ht: "Politik", 
            fr: "Politique", 
            en: "Politics" 
          } 
        }
      ],
      active: true,
      expires_at: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000) // 1 week from now
    };

    this.createPoll(pollData);

    // Seed some articles for each category
    const articleBaseData = {
      author_id: 1,
      read_time: 5,
      tags: ["ayiti", "nouvèl", "actualités", "news"]
    };

    // News
    this.createArticle({
      ...articleBaseData,
      title_ht: "Pwogrè nan rekonstriksyon apre siklòn nan sid peyi a",
      title_fr: "Progrès dans la reconstruction après le cyclone dans le sud du pays",
      title_en: "Progress in reconstruction after the cyclone in the south of the country",
      content_ht: "Apre pasaj siklòn nan, efò rekonstriksyon yo ap kontinye...",
      content_fr: "Après le passage du cyclone, les efforts de reconstruction continuent...",
      content_en: "After the cyclone passed, reconstruction efforts continue...",
      excerpt_ht: "Apre pasaj siklòn nan, efò rekonstriksyon yo ap kontinye nan sid peyi a ak yon nouvo plan...",
      excerpt_fr: "Après le passage du cyclone, les efforts de reconstruction continuent dans le sud du pays avec un nouveau plan...",
      excerpt_en: "After the cyclone passed, reconstruction efforts continue in the south of the country with a new plan...",
      slug: "progres-rekonstriksyon-siklon",
      image_url: "https://images.unsplash.com/photo-1580060839134-75a5edca2e99?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
      category_id: 1,
      is_featured: true
    });

    // Politics
    this.createArticle({
      ...articleBaseData,
      title_ht: "Nouvo pwojè lwa sou eleksyon yo ap diskite nan palman an",
      title_fr: "Un nouveau projet de loi sur les élections est en discussion au parlement",
      title_en: "New election bill being discussed in parliament",
      content_ht: "Palman an prezante yon nouvo pwopozisyon pou pwochen eleksyon yo...",
      content_fr: "Le parlement a présenté une nouvelle proposition pour les prochaines élections...",
      content_en: "Parliament presented a new proposal for the next elections...",
      excerpt_ht: "Palman an prezante yon nouvo pwopozisyon pou pwochen eleksyon yo, k ap espere reyalize nan...",
      excerpt_fr: "Le parlement a présenté une nouvelle proposition pour les prochaines élections, qui devraient avoir lieu dans...",
      excerpt_en: "Parliament presented a new proposal for the next elections, which are expected to take place in...",
      slug: "nouvo-pwoje-lwa-eleksyon",
      image_url: "https://images.unsplash.com/photo-1525874684015-58379d421a52?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
      category_id: 2,
      is_featured: true
    });

    // Education
    this.createArticle({
      ...articleBaseData,
      title_ht: "10 nouvo lekòl pral ouvri nan depatman Nò a",
      title_fr: "10 nouvelles écoles ouvriront dans le département du Nord",
      title_en: "10 new schools to open in the North department",
      content_ht: "Ministè Edikasyon Nasyonal anonse konstwiksyon 10 nouvo lekòl nan depatman Nò...",
      content_fr: "Le Ministère de l'Éducation Nationale annonce la construction de 10 nouvelles écoles dans le département du Nord...",
      content_en: "The Ministry of National Education announces the construction of 10 new schools in the North department...",
      excerpt_ht: "Ministè Edikasyon Nasyonal anonse konstwiksyon 10 nouvo lekòl nan depatman Nò peyi a...",
      excerpt_fr: "Le Ministère de l'Éducation Nationale annonce la construction de 10 nouvelles écoles dans le département du Nord...",
      excerpt_en: "The Ministry of National Education announces the construction of 10 new schools in the North department...",
      slug: "10-nouvo-lekol-depatman-no",
      image_url: "https://images.unsplash.com/photo-1590452198993-7619dd50d335?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
      category_id: 5,
      is_featured: true
    });

    // Culture
    this.createArticle({
      ...articleBaseData,
      title_ht: "Festival Mizik Rasin nan Pòtoprens: Dat yo anonse",
      title_fr: "Festival de Musique Racine à Port-au-Prince : Les dates annoncées",
      title_en: "Roots Music Festival in Port-au-Prince: Dates announced",
      content_ht: "Òganizatè yo annonse dat ofisyèl pou 15yèm edisyon Festival Mizik Rasin nan Pòtoprens...",
      content_fr: "Les organisateurs annoncent les dates officielles pour la 15ème édition du Festival de Musique Racine à Port-au-Prince...",
      content_en: "Organizers announce the official dates for the 15th edition of the Roots Music Festival in Port-au-Prince...",
      excerpt_ht: "Òganizatè yo annonse dat ofisyèl pou 15yèm edisyon Festival Mizik Rasin nan Pòtoprens...",
      excerpt_fr: "Les organisateurs annoncent les dates officielles pour la 15ème édition du Festival de Musique Racine à Port-au-Prince...",
      excerpt_en: "Organizers announce the official dates for the 15th edition of the Roots Music Festival in Port-au-Prince...",
      slug: "festival-mizik-rasin-potoprens",
      image_url: "https://images.unsplash.com/photo-1497271679421-ce9c3d6a31da?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
      category_id: 3,
      is_featured: false
    });

    // Economy
    this.createArticle({
      ...articleBaseData,
      title_ht: "Analiz: Kijan ekonomi Ayiti a kapab rekipere apre pandemi COVID-19 la",
      title_fr: "Analyse : Comment l'économie haïtienne peut se remettre de la pandémie de COVID-19",
      title_en: "Analysis: How Haiti's economy can recover after the COVID-19 pandemic",
      content_ht: "Yon analiz pwofon sou pozisyon ekonomik peyi a epi kisa gouvènman an, antreprenè yo, ak sektè prive a dwe fè pou kreye yon rekiperasyon solid...",
      content_fr: "Une analyse approfondie de la position économique du pays et de ce que le gouvernement, les entrepreneurs et le secteur privé doivent faire pour créer une reprise solide...",
      content_en: "An in-depth analysis of the country's economic position and what the government, entrepreneurs, and the private sector must do to create a robust recovery...",
      excerpt_ht: "Yon analiz pwofon sou pozisyon ekonomik peyi a epi kisa gouvènman an, antreprenè yo, ak sektè prive a dwe fè pou kreye yon rekiperasyon solid...",
      excerpt_fr: "Une analyse approfondie de la position économique du pays et de ce que le gouvernement, les entrepreneurs et le secteur privé doivent faire pour créer une reprise solide...",
      excerpt_en: "An in-depth analysis of the country's economic position and what the government, entrepreneurs, and the private sector must do to create a robust recovery...",
      slug: "analiz-ekonomi-ayiti-apre-covid19",
      image_url: "https://images.unsplash.com/photo-1535581652167-3a26c90bbf86?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
      category_id: 1,
      is_featured: false
    });

    // Agriculture
    this.createArticle({
      ...articleBaseData,
      title_ht: "Nouvèl teknik agrikòl ki ka ogmante pwodiksyon manje a nan peyi a",
      title_fr: "Nouvelles techniques agricoles qui peuvent augmenter la production alimentaire dans le pays",
      title_en: "New agricultural techniques that can increase food production in the country",
      content_ht: "Dekouvri metòd modèn ki ede agrikiltè Ayisyen yo ogmante pwodiksyon yo pandan y ap konsève anviwonnman an...",
      content_fr: "Découvrez les méthodes modernes qui aident les agriculteurs haïtiens à augmenter leur production tout en préservant l'environnement...",
      content_en: "Discover modern methods that help Haitian farmers increase their production while preserving the environment...",
      excerpt_ht: "Dekouvri metòd modèn ki ede agrikiltè Ayisyen yo ogmante pwodiksyon yo pandan y ap konsève anviwonnman an...",
      excerpt_fr: "Découvrez les méthodes modernes qui aident les agriculteurs haïtiens à augmenter leur production tout en préservant l'environnement...",
      excerpt_en: "Discover modern methods that help Haitian farmers increase their production while preserving the environment...",
      slug: "nouvel-teknik-agrikol",
      image_url: "https://images.unsplash.com/photo-1593113630400-ea4288922497?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
      category_id: 1,
      is_featured: false
    });

    // Seed media content
    const mediaData: InsertMedia[] = [
      {
        title_ht: "Cap-Haïtien: Bèl vil istorik nan nò Ayiti",
        title_fr: "Cap-Haïtien: Belle ville historique du nord d'Haïti",
        title_en: "Cap-Haitian: Beautiful historic city in northern Haiti",
        type: "photo",
        url: "https://images.unsplash.com/photo-1533681505260-8a3f32b04b08?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
        thumbnail_url: "https://images.unsplash.com/photo-1533681505260-8a3f32b04b08?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
        description_ht: "Yon bèl vi sou Cap-Haïtien, dezyèm pi gwo vil Ayiti",
        description_fr: "Une belle vue de Cap-Haïtien, la deuxième plus grande ville d'Haïti",
        description_en: "A beautiful view of Cap-Haitian, Haiti's second-largest city"
      },
      {
        title_ht: "Plaj Labadee",
        title_fr: "Plage de Labadee",
        title_en: "Labadee Beach",
        type: "photo",
        url: "https://images.unsplash.com/photo-1602568501666-8d2a41290bcd?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
        thumbnail_url: "https://images.unsplash.com/photo-1602568501666-8d2a41290bcd?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
        description_ht: "Plaj prive Labadee nan nò Ayiti",
        description_fr: "La plage privée de Labadee dans le nord d'Haïti",
        description_en: "Private beach of Labadee in northern Haiti"
      },
      {
        title_ht: "Machann nan mache a",
        title_fr: "Vendeuse au marché",
        title_en: "Seller at the market",
        type: "photo",
        url: "https://images.unsplash.com/photo-1528405098637-b48a241ee06f?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
        thumbnail_url: "https://images.unsplash.com/photo-1528405098637-b48a241ee06f?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
        description_ht: "Yon machann k ap vann fwi nan mache lokal",
        description_fr: "Une vendeuse qui vend des fruits au marché local",
        description_en: "A seller selling fruits at the local market"
      },
      {
        title_ht: "Atizana ayisyen",
        title_fr: "Artisanat haïtien",
        title_en: "Haitian crafts",
        type: "photo",
        url: "https://images.unsplash.com/photo-1551276929-3f75950479fc?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
        thumbnail_url: "https://images.unsplash.com/photo-1551276929-3f75950479fc?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
        description_ht: "Bèl atizana fabrike pa atis ayisyen",
        description_fr: "Bel artisanat fabriqué par des artistes haïtiens",
        description_en: "Beautiful crafts made by Haitian artists"
      }
    ];

    mediaData.forEach(item => this.createMedia(item));
  }

  // User operations
  async getUser(id: number): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.username === username,
    );
  }

  async createUser(user: InsertUser): Promise<User> {
    const id = this.currentUserId++;
    const newUser: User = { ...user, id };
    this.users.set(id, newUser);
    return newUser;
  }

  // Category operations
  async getCategories(): Promise<Category[]> {
    return Array.from(this.categories.values());
  }

  async getCategoryBySlug(slug: string): Promise<Category | undefined> {
    return Array.from(this.categories.values()).find(
      (category) => category.slug === slug,
    );
  }

  async createCategory(category: InsertCategory): Promise<Category> {
    const id = this.currentCategoryId++;
    const newCategory: Category = { ...category, id };
    this.categories.set(id, newCategory);
    return newCategory;
  }

  // Article operations
  async getArticles(limit = 10, offset = 0): Promise<Article[]> {
    return Array.from(this.articles.values())
      .sort((a, b) => new Date(b.published_at).getTime() - new Date(a.published_at).getTime())
      .slice(offset, offset + limit);
  }

  async getArticleBySlug(slug: string): Promise<Article | undefined> {
    return Array.from(this.articles.values()).find(
      (article) => article.slug === slug,
    );
  }

  async getArticlesByCategory(categoryId: number, limit = 10, offset = 0): Promise<Article[]> {
    return Array.from(this.articles.values())
      .filter(article => article.category_id === categoryId)
      .sort((a, b) => new Date(b.published_at).getTime() - new Date(a.published_at).getTime())
      .slice(offset, offset + limit);
  }

  async getFeaturedArticles(limit = 3): Promise<Article[]> {
    return Array.from(this.articles.values())
      .filter(article => article.is_featured)
      .sort((a, b) => new Date(b.published_at).getTime() - new Date(a.published_at).getTime())
      .slice(0, limit);
  }

  async createArticle(article: InsertArticle): Promise<Article> {
    const id = this.currentArticleId++;
    const now = new Date();
    const newArticle: Article = { 
      ...article, 
      id, 
      published_at: now 
    };
    this.articles.set(id, newArticle);
    return newArticle;
  }

  async updateArticle(id: number, article: Partial<InsertArticle>): Promise<Article | undefined> {
    const existingArticle = this.articles.get(id);
    if (!existingArticle) return undefined;

    const updatedArticle: Article = { ...existingArticle, ...article };
    this.articles.set(id, updatedArticle);
    return updatedArticle;
  }

  async getPopularArticles(limit = 3): Promise<Article[]> {
    // In a real app, this would be based on view counts, but for this example, we'll just return recent articles
    return Array.from(this.articles.values())
      .sort((a, b) => new Date(b.published_at).getTime() - new Date(a.published_at).getTime())
      .slice(0, limit);
  }

  async getRelatedArticles(articleId: number, limit = 3): Promise<Article[]> {
    const article = this.articles.get(articleId);
    if (!article) return [];

    // Get articles in the same category, excluding the current article
    return Array.from(this.articles.values())
      .filter(a => a.category_id === article.category_id && a.id !== articleId)
      .sort(() => 0.5 - Math.random()) // Simple randomization
      .slice(0, limit);
  }

  async searchArticles(query: string, limit = 10, offset = 0): Promise<Article[]> {
    const queryLower = query.toLowerCase();
    return Array.from(this.articles.values())
      .filter(article => 
        article.title_ht.toLowerCase().includes(queryLower) || 
        article.title_fr.toLowerCase().includes(queryLower) || 
        article.title_en.toLowerCase().includes(queryLower) ||
        article.content_ht.toLowerCase().includes(queryLower) || 
        article.content_fr.toLowerCase().includes(queryLower) || 
        article.content_en.toLowerCase().includes(queryLower)
      )
      .sort((a, b) => new Date(b.published_at).getTime() - new Date(a.published_at).getTime())
      .slice(offset, offset + limit);
  }

  // Media operations
  async getMedia(type?: string, limit = 10, offset = 0): Promise<Media[]> {
    let mediaList = Array.from(this.media.values());
    
    if (type) {
      mediaList = mediaList.filter(item => item.type === type);
    }
    
    return mediaList
      .sort((a, b) => new Date(b.published_at).getTime() - new Date(a.published_at).getTime())
      .slice(offset, offset + limit);
  }

  async getMediaById(id: number): Promise<Media | undefined> {
    return this.media.get(id);
  }

  async createMedia(media: InsertMedia): Promise<Media> {
    const id = this.currentMediaId++;
    const now = new Date();
    const newMedia: Media = { 
      ...media, 
      id, 
      published_at: now 
    };
    this.media.set(id, newMedia);
    return newMedia;
  }

  // Poll operations
  async getActivePolls(limit = 1): Promise<Poll[]> {
    return Array.from(this.polls.values())
      .filter(poll => poll.active && (!poll.expires_at || new Date(poll.expires_at) > new Date()))
      .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
      .slice(0, limit);
  }

  async getPollById(id: number): Promise<Poll | undefined> {
    return this.polls.get(id);
  }

  async createPoll(poll: InsertPoll): Promise<Poll> {
    const id = this.currentPollId++;
    const now = new Date();
    const newPoll: Poll = { 
      ...poll, 
      id, 
      created_at: now 
    };
    this.polls.set(id, newPoll);
    return newPoll;
  }

  async submitPollResponse(response: InsertPollResponse): Promise<PollResponse> {
    const id = this.currentPollResponseId++;
    const now = new Date();
    const newResponse: PollResponse = { 
      ...response, 
      id, 
      created_at: now 
    };
    this.pollResponses.set(id, newResponse);
    return newResponse;
  }

  async getPollResults(pollId: number): Promise<Record<number, number>> {
    const responses = Array.from(this.pollResponses.values())
      .filter(response => response.poll_id === pollId);
    
    const results: Record<number, number> = {};
    
    responses.forEach(response => {
      if (results[response.option_id]) {
        results[response.option_id]++;
      } else {
        results[response.option_id] = 1;
      }
    });
    
    return results;
  }

  // Subscription operations
  async createSubscription(subscription: InsertSubscription): Promise<Subscription> {
    // Check if email already exists
    const existingSubscription = await this.getSubscriptionByEmail(subscription.email);
    if (existingSubscription) {
      return existingSubscription;
    }
    
    const id = this.currentSubscriptionId++;
    const now = new Date();
    const newSubscription: Subscription = { 
      ...subscription, 
      id, 
      created_at: now 
    };
    this.subscriptions.set(id, newSubscription);
    return newSubscription;
  }

  async getSubscriptionByEmail(email: string): Promise<Subscription | undefined> {
    return Array.from(this.subscriptions.values()).find(
      (subscription) => subscription.email.toLowerCase() === email.toLowerCase(),
    );
  }

  // Contact operations
  async createContactMessage(message: InsertContactMessage): Promise<ContactMessage> {
    const id = this.currentContactMessageId++;
    const now = new Date();
    const newMessage: ContactMessage = { 
      ...message, 
      id, 
      created_at: now,
      read: false
    };
    this.contactMessages.set(id, newMessage);
    return newMessage;
  }

  async getContactMessages(limit = 10, offset = 0): Promise<ContactMessage[]> {
    return Array.from(this.contactMessages.values())
      .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
      .slice(offset, offset + limit);
  }

  async markContactMessageAsRead(id: number): Promise<boolean> {
    const message = this.contactMessages.get(id);
    if (!message) return false;
    
    message.read = true;
    this.contactMessages.set(id, message);
    return true;
  }
}

export const storage = new MemStorage();
