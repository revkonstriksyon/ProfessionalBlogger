import {
  categories,
  articles,
  mediaItems,
  polls,
  pollOptions,
  comments,
  subscribers,
  contactMessages,
  type Category,
  type InsertCategory,
  type Article,
  type InsertArticle,
  type MediaItem,
  type InsertMediaItem,
  type Poll,
  type InsertPoll,
  type PollOption,
  type InsertPollOption,
  type Comment,
  type InsertComment,
  type Subscriber,
  type InsertSubscriber,
  type ContactMessage,
  type InsertContactMessage,
  type Language,
} from "@shared/schema";

// Storage interface
export interface IStorage {
  // Categories
  getCategories(): Promise<Category[]>;
  getCategoryBySlug(slug: string): Promise<Category | undefined>;
  createCategory(category: InsertCategory): Promise<Category>;

  // Articles
  getArticles(limit?: number, offset?: number): Promise<Article[]>;
  getArticleBySlug(slug: string): Promise<Article | undefined>;
  getArticlesByCategory(categorySlug: string, limit?: number, offset?: number): Promise<Article[]>;
  getFeaturedArticles(limit?: number): Promise<Article[]>;
  getLatestArticles(limit?: number): Promise<Article[]>;
  getBreakingNews(): Promise<Article[]>;
  incrementArticleViews(id: number): Promise<void>;
  createArticle(article: InsertArticle): Promise<Article>;
  updateArticle(id: number, article: Partial<InsertArticle>): Promise<Article | undefined>;

  // Media
  getMediaItems(type?: string, limit?: number, offset?: number): Promise<MediaItem[]>;
  getMediaItemById(id: number): Promise<MediaItem | undefined>;
  createMediaItem(mediaItem: InsertMediaItem): Promise<MediaItem>;

  // Polls
  getActivePoll(): Promise<{ poll: Poll; options: PollOption[] } | undefined>;
  createPoll(poll: InsertPoll, options: InsertPollOption[]): Promise<{ poll: Poll; options: PollOption[] }>;
  votePoll(optionId: number): Promise<PollOption | undefined>;

  // Comments
  getCommentsByArticle(articleId: number): Promise<Comment[]>;
  createComment(comment: InsertComment): Promise<Comment>;

  // Subscribers
  createSubscriber(subscriber: InsertSubscriber): Promise<Subscriber>;
  isEmailSubscribed(email: string): Promise<boolean>;

  // Contact messages
  createContactMessage(message: InsertContactMessage): Promise<ContactMessage>;

  // Search
  searchArticles(query: string, language: Language): Promise<Article[]>;
}

export class MemStorage implements IStorage {
  private categories: Map<number, Category>;
  private articles: Map<number, Article>;
  private mediaItems: Map<number, MediaItem>;
  private polls: Map<number, Poll>;
  private pollOptions: Map<number, PollOption>;
  private comments: Map<number, Comment>;
  private subscribers: Map<number, Subscriber>;
  private contactMessages: Map<number, ContactMessage>;
  
  private categoryId: number;
  private articleId: number;
  private mediaItemId: number;
  private pollId: number;
  private pollOptionId: number;
  private commentId: number;
  private subscriberId: number;
  private contactMessageId: number;

  constructor() {
    this.categories = new Map();
    this.articles = new Map();
    this.mediaItems = new Map();
    this.polls = new Map();
    this.pollOptions = new Map();
    this.comments = new Map();
    this.subscribers = new Map();
    this.contactMessages = new Map();
    
    this.categoryId = 1;
    this.articleId = 1;
    this.mediaItemId = 1;
    this.pollId = 1;
    this.pollOptionId = 1;
    this.commentId = 1;
    this.subscriberId = 1;
    this.contactMessageId = 1;
    
    // Initialize with some categories
    this.initializeCategories();
  }

  private initializeCategories() {
    const defaultCategories: InsertCategory[] = [
      { name: 'Aktualite', slug: 'actualite' },
      { name: 'Politik', slug: 'politics' },
      { name: 'Kilti', slug: 'culture' },
      { name: 'Espò', slug: 'sports' },
      { name: 'Edikasyon', slug: 'education' },
      { name: 'Sante', slug: 'health' },
      { name: 'Teknoloji', slug: 'technology' },
      { name: 'Ekonomi', slug: 'economy' },
    ];

    for (const category of defaultCategories) {
      this.createCategory(category);
    }
  }

  // Categories
  async getCategories(): Promise<Category[]> {
    return Array.from(this.categories.values());
  }

  async getCategoryBySlug(slug: string): Promise<Category | undefined> {
    return Array.from(this.categories.values()).find(
      (category) => category.slug === slug
    );
  }

  async createCategory(category: InsertCategory): Promise<Category> {
    const id = this.categoryId++;
    const newCategory: Category = { ...category, id };
    this.categories.set(id, newCategory);
    return newCategory;
  }

  // Articles
  async getArticles(limit = 10, offset = 0): Promise<Article[]> {
    const articles = Array.from(this.articles.values())
      .sort((a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime());
    
    return articles.slice(offset, offset + limit);
  }

  async getArticleBySlug(slug: string): Promise<Article | undefined> {
    return Array.from(this.articles.values()).find(
      (article) => article.slug === slug
    );
  }

  async getArticlesByCategory(categorySlug: string, limit = 10, offset = 0): Promise<Article[]> {
    const category = await this.getCategoryBySlug(categorySlug);
    if (!category) return [];

    const articlesInCategory = Array.from(this.articles.values())
      .filter((article) => article.categoryId === category.id)
      .sort((a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime());
    
    return articlesInCategory.slice(offset, offset + limit);
  }

  async getFeaturedArticles(limit = 3): Promise<Article[]> {
    return Array.from(this.articles.values())
      .filter((article) => article.featured)
      .sort((a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime())
      .slice(0, limit);
  }

  async getLatestArticles(limit = 5): Promise<Article[]> {
    return Array.from(this.articles.values())
      .sort((a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime())
      .slice(0, limit);
  }

  async getBreakingNews(): Promise<Article[]> {
    return Array.from(this.articles.values())
      .filter((article) => article.breakingNews)
      .sort((a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime());
  }

  async incrementArticleViews(id: number): Promise<void> {
    const article = this.articles.get(id);
    if (article) {
      article.viewCount += 1;
      this.articles.set(id, article);
    }
  }

  async createArticle(article: InsertArticle): Promise<Article> {
    const id = this.articleId++;
    const newArticle: Article = {
      ...article,
      id,
      viewCount: 0,
      commentCount: 0,
      likeCount: 0,
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

  // Media
  async getMediaItems(type?: string, limit = 10, offset = 0): Promise<MediaItem[]> {
    let mediaItems = Array.from(this.mediaItems.values())
      .sort((a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime());
    
    if (type) {
      mediaItems = mediaItems.filter(item => item.type === type);
    }
    
    return mediaItems.slice(offset, offset + limit);
  }

  async getMediaItemById(id: number): Promise<MediaItem | undefined> {
    return this.mediaItems.get(id);
  }

  async createMediaItem(mediaItem: InsertMediaItem): Promise<MediaItem> {
    const id = this.mediaItemId++;
    const newMediaItem: MediaItem = { ...mediaItem, id };
    this.mediaItems.set(id, newMediaItem);
    return newMediaItem;
  }

  // Polls
  async getActivePoll(): Promise<{ poll: Poll; options: PollOption[] } | undefined> {
    const activePoll = Array.from(this.polls.values())
      .find(poll => poll.active);
    
    if (!activePoll) return undefined;
    
    const options = Array.from(this.pollOptions.values())
      .filter(option => option.pollId === activePoll.id);
    
    return { poll: activePoll, options };
  }

  async createPoll(poll: InsertPoll, options: InsertPollOption[]): Promise<{ poll: Poll; options: PollOption[] }> {
    // Deactivate all existing polls first
    for (const [id, existingPoll] of this.polls) {
      if (existingPoll.active) {
        existingPoll.active = false;
        this.polls.set(id, existingPoll);
      }
    }
    
    // Create new poll
    const pollId = this.pollId++;
    const newPoll: Poll = { ...poll, id: pollId, createdAt: new Date() };
    this.polls.set(pollId, newPoll);
    
    // Create poll options
    const pollOptions: PollOption[] = [];
    for (const option of options) {
      const optionId = this.pollOptionId++;
      const newOption: PollOption = {
        ...option,
        id: optionId,
        pollId,
        votes: 0
      };
      this.pollOptions.set(optionId, newOption);
      pollOptions.push(newOption);
    }
    
    return { poll: newPoll, options: pollOptions };
  }

  async votePoll(optionId: number): Promise<PollOption | undefined> {
    const option = this.pollOptions.get(optionId);
    if (!option) return undefined;
    
    option.votes += 1;
    this.pollOptions.set(optionId, option);
    return option;
  }

  // Comments
  async getCommentsByArticle(articleId: number): Promise<Comment[]> {
    return Array.from(this.comments.values())
      .filter(comment => comment.articleId === articleId)
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  }

  async createComment(comment: InsertComment): Promise<Comment> {
    const id = this.commentId++;
    const newComment: Comment = {
      ...comment,
      id,
      createdAt: new Date()
    };
    this.comments.set(id, newComment);
    
    // Increment comment count for the article
    const article = this.articles.get(comment.articleId);
    if (article) {
      article.commentCount += 1;
      this.articles.set(article.id, article);
    }
    
    return newComment;
  }

  // Subscribers
  async createSubscriber(subscriber: InsertSubscriber): Promise<Subscriber> {
    // Check if email already exists
    const existing = await this.isEmailSubscribed(subscriber.email);
    if (existing) {
      throw new Error('Email already subscribed');
    }
    
    const id = this.subscriberId++;
    const newSubscriber: Subscriber = {
      ...subscriber,
      id,
      subscribedAt: new Date()
    };
    this.subscribers.set(id, newSubscriber);
    return newSubscriber;
  }

  async isEmailSubscribed(email: string): Promise<boolean> {
    return Array.from(this.subscribers.values())
      .some(subscriber => subscriber.email.toLowerCase() === email.toLowerCase());
  }

  // Contact messages
  async createContactMessage(message: InsertContactMessage): Promise<ContactMessage> {
    const id = this.contactMessageId++;
    const newMessage: ContactMessage = {
      ...message,
      id,
      createdAt: new Date()
    };
    this.contactMessages.set(id, newMessage);
    return newMessage;
  }

  // Search
  async searchArticles(query: string, language: Language): Promise<Article[]> {
    const lowercaseQuery = query.toLowerCase();
    return Array.from(this.articles.values())
      .filter(article => {
        const title = article.title[language]?.toLowerCase() || '';
        const content = article.content[language]?.toLowerCase() || '';
        const excerpt = article.excerpt[language]?.toLowerCase() || '';
        
        return title.includes(lowercaseQuery) || 
               content.includes(lowercaseQuery) || 
               excerpt.includes(lowercaseQuery);
      })
      .sort((a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime());
  }
}

// Initialize storage
export const storage = new MemStorage();

// Seed some initial data for testing
(async () => {
  // Seed some articles
  const cultureCategory = await storage.getCategoryBySlug('culture');
  const economyCategory = await storage.getCategoryBySlug('economy');
  const educationCategory = await storage.getCategoryBySlug('education');
  const technologyCategory = await storage.getCategoryBySlug('technology');
  const healthCategory = await storage.getCategoryBySlug('health');
  const agricultureCategory = await storage.createCategory({ name: 'Agrikilti', slug: 'agriculture' });
  
  if (cultureCategory && economyCategory && educationCategory) {
    // Featured articles
    await storage.createArticle({
      slug: 'importance-of-historical-monuments-in-haitian-culture',
      categoryId: cultureCategory.id,
      featured: true,
      breakingNews: false,
      publishedAt: new Date(),
      title: {
        ht: 'Enpòtans Moniman Istorik yo nan Kilti Ayisyèn',
        fr: 'L\'importance des monuments historiques dans la culture haïtienne',
        en: 'Importance of Historical Monuments in Haitian Culture'
      },
      content: {
        ht: 'Kontni atik la an kreyòl...',
        fr: 'Contenu de l\'article en français...',
        en: 'Article content in English...'
      },
      excerpt: {
        ht: 'Dekouvri kijan moniman istorik yo enpòtan nan prezèvasyon idantite ayisyèn nan mitan defi aktyèl yo...',
        fr: 'Découvrez comment les monuments historiques sont importants pour préserver l\'identité haïtienne face aux défis actuels...',
        en: 'Discover how historical monuments are important in preserving Haitian identity amid current challenges...'
      },
      author: 'Jean Baptiste',
      authorImageUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=80&h=80&fit=crop&crop=face',
      imageUrl: 'https://images.unsplash.com/photo-1547480053-7d174f67b557?w=600&h=400&fit=crop'
    });

    await storage.createArticle({
      slug: 'new-initiatives-to-support-local-businesses',
      categoryId: economyCategory.id,
      featured: true,
      breakingNews: false,
      publishedAt: new Date(),
      title: {
        ht: 'Nouvo Inisyativ pou Sipòte Biznis Lokal nan Sid Ayiti',
        fr: 'Nouvelles initiatives pour soutenir les entreprises locales dans le sud d\'Haïti',
        en: 'New Initiatives to Support Local Businesses in Southern Haiti'
      },
      content: {
        ht: 'Kontni atik la an kreyòl...',
        fr: 'Contenu de l\'article en français...',
        en: 'Article content in English...'
      },
      excerpt: {
        ht: 'Pwogram mikwo-kredi ap ede ti antreprenè yo devlope biznis lokal nan rejyon sid la...',
        fr: 'Les programmes de microcrédit aident les petits entrepreneurs à développer des entreprises locales dans la région sud...',
        en: 'Microcredit programs are helping small entrepreneurs develop local businesses in the southern region...'
      },
      author: 'Marie Louis',
      authorImageUrl: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=40&h=40&fit=crop&crop=face',
      imageUrl: 'https://images.unsplash.com/photo-1541535454939-db5133bcea0b?w=600&h=400&fit=crop'
    });

    await storage.createArticle({
      slug: 'success-in-education-more-haitian-youth-enter-university',
      categoryId: educationCategory.id,
      featured: true,
      breakingNews: false,
      publishedAt: new Date(),
      title: {
        ht: 'Reyisit nan Edikasyon: Plis Jenn Ayisyen Antre nan Inivèsite',
        fr: 'Succès dans l\'éducation: Plus de jeunes Haïtiens entrent à l\'université',
        en: 'Success in Education: More Haitian Youth Enter University'
      },
      content: {
        ht: 'Kontni atik la an kreyòl...',
        fr: 'Contenu de l\'article en français...',
        en: 'Article content in English...'
      },
      excerpt: {
        ht: 'Gen yon ogmantasyon nan kantite etidyan ki antre nan inivèsite ane sa a, ki montre pwogrè nan sektè edikasyon an...',
        fr: 'Il y a une augmentation du nombre d\'étudiants entrant à l\'université cette année, montrant des progrès dans le secteur de l\'éducation...',
        en: 'There is an increase in the number of students entering university this year, showing progress in the education sector...'
      },
      author: 'Pierre Joseph',
      authorImageUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=40&h=40&fit=crop&crop=face',
      imageUrl: 'https://images.unsplash.com/photo-1610228531761-3e8ee4922a77?w=600&h=400&fit=crop'
    });

    // Latest news
    if (agricultureCategory && technologyCategory && healthCategory) {
      await storage.createArticle({
        slug: 'new-agricultural-techniques-increase-production',
        categoryId: agricultureCategory.id,
        featured: false,
        breakingNews: false,
        publishedAt: new Date(),
        title: {
          ht: 'Nouvo Teknik Agrikòl ap Pèmèt Kiltivatè yo Ogmante Pwodiksyon',
          fr: 'De nouvelles techniques agricoles permettent aux agriculteurs d\'augmenter la production',
          en: 'New Agricultural Techniques Allow Farmers to Increase Production'
        },
        content: {
          ht: 'Kontni atik la an kreyòl...',
          fr: 'Contenu de l\'article en français...',
          en: 'Article content in English...'
        },
        excerpt: {
          ht: 'Metòd modèn agrikilti ap ede kiltivatè nan rejyon nò Ayiti yo ogmante pwodiksyon rekòt yo malgre defi klimatik...',
          fr: 'Les méthodes agricoles modernes aident les agriculteurs du nord d\'Haïti à augmenter leur production de récoltes malgré les défis climatiques...',
          en: 'Modern agricultural methods are helping farmers in northern Haiti increase crop production despite climate challenges...'
        },
        author: 'Jak Piè',
        authorImageUrl: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=40&h=40&fit=crop&crop=face',
        imageUrl: 'https://images.unsplash.com/photo-1488330890490-c291ecf62571?w=300&h=200&fit=crop'
      });

      await storage.createArticle({
        slug: 'satellite-internet-project-will-reach-rural-areas',
        categoryId: technologyCategory.id,
        featured: false,
        breakingNews: true,
        publishedAt: new Date(),
        title: {
          ht: 'Pwojè Entènèt Satelit pral Rive nan Zòn Riral yo Ann Ayiti',
          fr: 'Le projet Internet par satellite atteindra les zones rurales d\'Haïti',
          en: 'Satellite Internet Project Will Reach Rural Areas in Haiti'
        },
        content: {
          ht: 'Kontni atik la an kreyòl...',
          fr: 'Contenu de l\'article en français...',
          en: 'Article content in English...'
        },
        excerpt: {
          ht: 'Yon nouvo inisyativ pou pote aksè entènèt rapid nan kominote riral yo pral kòmanse mwa pwochen, yon gwo pwogrè pou koneksyon...',
          fr: 'Une nouvelle initiative visant à apporter un accès Internet haut débit aux communautés rurales débutera le mois prochain, une avancée majeure pour la connectivité...',
          en: 'A new initiative to bring high-speed internet access to rural communities will begin next month, a major advancement for connectivity...'
        },
        author: 'Mari Lwi',
        authorImageUrl: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=40&h=40&fit=crop&crop=face',
        imageUrl: 'https://images.unsplash.com/photo-1603739421258-4aa79ad860df?w=300&h=200&fit=crop'
      });

      await storage.createArticle({
        slug: 'vaccination-campaign-for-children-reaches-record-level',
        categoryId: healthCategory.id,
        featured: false,
        breakingNews: true,
        publishedAt: new Date(),
        title: {
          ht: 'Kanpay Vaksinasyon Pou Timoun yo Rive nan Nivo Rekò',
          fr: 'La campagne de vaccination des enfants atteint un niveau record',
          en: 'Vaccination Campaign For Children Reaches Record Level'
        },
        content: {
          ht: 'Kontni atik la an kreyòl...',
          fr: 'Contenu de l\'article en français...',
          en: 'Article content in English...'
        },
        excerpt: {
          ht: 'Nouvo estatistik montre ke plis pase 80% timoun nan peyi a resevwa vaksen de baz yo ane sa a, yon gwo siksè pou sistèm sante piblik la...',
          fr: 'De nouvelles statistiques montrent que plus de 80% des enfants du pays reçoivent leurs vaccins de base cette année, un grand succès pour le système de santé publique...',
          en: 'New statistics show that more than 80% of children in the country are receiving their basic vaccines this year, a major success for the public health system...'
        },
        author: 'Pyè Jozèf',
        authorImageUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=40&h=40&fit=crop&crop=face',
        imageUrl: 'https://images.unsplash.com/photo-1598811629267-fafdd2f1c102?w=300&h=200&fit=crop'
      });

      // Presidential announcement as breaking news
      await storage.createArticle({
        slug: 'president-announces-new-development-plan',
        categoryId: await (await storage.getCategoryBySlug('politics'))?.id || 1,
        featured: false,
        breakingNews: true,
        publishedAt: new Date(),
        title: {
          ht: 'Prezidan Ayiti a anonse nouvo plan devlopman pou peyi a',
          fr: 'Le président d\'Haïti annonce un nouveau plan de développement pour le pays',
          en: 'Haiti\'s President Announces New Development Plan for the Country'
        },
        content: {
          ht: 'Kontni atik la an kreyòl...',
          fr: 'Contenu de l\'article en français...',
          en: 'Article content in English...'
        },
        excerpt: {
          ht: 'Prezidan an te prezante yon nouvo plan 5-an pou devlopman enfrastrikti ak ekonomi peyi a...',
          fr: 'Le président a présenté un nouveau plan quinquennal pour le développement des infrastructures et de l\'économie du pays...',
          en: 'The president presented a new 5-year plan for the country\'s infrastructure and economic development...'
        },
        author: 'Jean Robert',
        authorImageUrl: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=40&h=40&fit=crop&crop=face',
        imageUrl: 'https://images.unsplash.com/photo-1523292562811-8fa7962a78c8?w=300&h=200&fit=crop'
      });
    }
  }

  // Seed Media Items
  await storage.createMediaItem({
    type: 'photo',
    title: {
      ht: 'Plaj Labadi, Nò Ayiti',
      fr: 'Plage de Labadee, Nord d\'Haïti',
      en: 'Labadee Beach, Northern Haiti'
    },
    url: 'https://images.unsplash.com/photo-1531219572328-a0171b4448a3?w=800&h=800&fit=crop',
    thumbnailUrl: 'https://images.unsplash.com/photo-1531219572328-a0171b4448a3?w=300&h=300&fit=crop',
    publishedAt: new Date()
  });

  await storage.createMediaItem({
    type: 'photo',
    title: {
      ht: 'Mache Fè, Pòtoprens',
      fr: 'Marché de Fer, Port-au-Prince',
      en: 'Iron Market, Port-au-Prince'
    },
    url: 'https://images.unsplash.com/photo-1563802560775-445d06537a8d?w=800&h=800&fit=crop',
    thumbnailUrl: 'https://images.unsplash.com/photo-1563802560775-445d06537a8d?w=300&h=300&fit=crop',
    publishedAt: new Date()
  });

  await storage.createMediaItem({
    type: 'photo',
    title: {
      ht: 'Festival Mizik Rasin',
      fr: 'Festival de Musique Racines',
      en: 'Roots Music Festival'
    },
    url: 'https://images.unsplash.com/photo-1595841696677-6489ff3f8cd1?w=800&h=800&fit=crop',
    thumbnailUrl: 'https://images.unsplash.com/photo-1595841696677-6489ff3f8cd1?w=300&h=300&fit=crop',
    publishedAt: new Date()
  });

  await storage.createMediaItem({
    type: 'photo',
    title: {
      ht: 'Atizay Bò Lanmè',
      fr: 'Art au bord de la mer',
      en: 'Seaside Art'
    },
    url: 'https://images.unsplash.com/photo-1514036783265-fba9577fc473?w=800&h=800&fit=crop',
    thumbnailUrl: 'https://images.unsplash.com/photo-1514036783265-fba9577fc473?w=300&h=300&fit=crop',
    publishedAt: new Date()
  });

  // Create an active poll
  await storage.createPoll(
    {
      question: {
        ht: 'Ki aspè kilti Ayisyen an ou panse ki pi enpòtan pou prezève?',
        fr: 'Quel aspect de la culture haïtienne pensez-vous qu\'il est le plus important de préserver?',
        en: 'Which aspect of Haitian culture do you think is most important to preserve?'
      },
      active: true
    },
    [
      {
        pollId: 1,
        text: {
          ht: 'Lang Kreyòl',
          fr: 'Langue Créole',
          en: 'Creole Language'
        }
      },
      {
        pollId: 1,
        text: {
          ht: 'Manje Tradisyonèl',
          fr: 'Cuisine Traditionnelle',
          en: 'Traditional Food'
        }
      },
      {
        pollId: 1,
        text: {
          ht: 'Mizik ak Dans',
          fr: 'Musique et Danse',
          en: 'Music and Dance'
        }
      },
      {
        pollId: 1,
        text: {
          ht: 'Atizana ak Boza',
          fr: 'Artisanat et Beaux-arts',
          en: 'Crafts and Fine Arts'
        }
      }
    ]
  );

  // Add some votes to the poll
  await storage.votePoll(1); // 45 votes for option 1
  await storage.votePoll(1);
  await storage.votePoll(1);
  await storage.votePoll(1);
  await storage.votePoll(1);
  await storage.votePoll(2); // 20 votes for option 2
  await storage.votePoll(2);
  await storage.votePoll(3); // 25 votes for option 3
  await storage.votePoll(3);
  await storage.votePoll(4); // 10 votes for option 4
})();
