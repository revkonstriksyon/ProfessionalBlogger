// Navigation categories
export const CATEGORIES = [
  { 
    slug: "news", 
    name: { ht: "AKTUALITE", fr: "ACTUALITÉS", en: "NEWS" } 
  },
  { 
    slug: "politics", 
    name: { ht: "POLITIK", fr: "POLITIQUE", en: "POLITICS" } 
  },
  { 
    slug: "culture", 
    name: { ht: "KILTI", fr: "CULTURE", en: "CULTURE" } 
  },
  { 
    slug: "sports", 
    name: { ht: "ESPÒ", fr: "SPORTS", en: "SPORTS" } 
  },
  { 
    slug: "education", 
    name: { ht: "EDIKASYON", fr: "ÉDUCATION", en: "EDUCATION" } 
  },
  { 
    slug: "health", 
    name: { ht: "SANTE", fr: "SANTÉ", en: "HEALTH" } 
  },
  { 
    slug: "technology", 
    name: { ht: "TEKNOLOJI", fr: "TECHNOLOGIE", en: "TECHNOLOGY" } 
  }
];

// Colors representing Haiti
export const HAITI_COLORS = {
  blue: "#0D47A1",
  red: "#D32F2F"
};

// Media types
export const MEDIA_TYPES = [
  { value: "photo", labelKey: "mediaType.photo" },
  { value: "video", labelKey: "mediaType.video" },
  { value: "podcast", labelKey: "mediaType.podcast" }
];

// Subscription frequency options
export const SUBSCRIPTION_FREQUENCIES = [
  { value: "daily", labelKey: "subscription.frequency.daily" },
  { value: "weekly", labelKey: "subscription.frequency.weekly" },
  { value: "monthly", labelKey: "subscription.frequency.monthly" }
];

// Tags for articles
export const POPULAR_TAGS = [
  { key: "politics", labelKey: "tags.politics" },
  { key: "economy", labelKey: "tags.economy" },
  { key: "culture", labelKey: "tags.culture" },
  { key: "sports", labelKey: "tags.sports" },
  { key: "agriculture", labelKey: "tags.agriculture" },
  { key: "tourism", labelKey: "tags.tourism" },
  { key: "education", labelKey: "tags.education" },
  { key: "health", labelKey: "tags.health" },
  { key: "technology", labelKey: "tags.technology" },
  { key: "diaspora", labelKey: "tags.diaspora" }
];

// Social media links
export const SOCIAL_LINKS = [
  { platform: "facebook", url: "https://facebook.com", icon: "facebook-f" },
  { platform: "twitter", url: "https://twitter.com", icon: "twitter" },
  { platform: "instagram", url: "https://instagram.com", icon: "instagram" },
  { platform: "youtube", url: "https://youtube.com", icon: "youtube" },
  { platform: "whatsapp", url: "https://whatsapp.com", icon: "whatsapp" }
];
