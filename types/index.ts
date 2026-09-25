export interface PromptVariable {
  key: string;
  label: string;
  placeholder: string;
  defaultValue?: string;
}

export interface Category {
  id: string;
  slug: string;
  name: string;
  nameEn: string;
  description: string;
  icon: string;
  color?: string;
  promptCount?: number;
  createdAt: string;
  updatedAt: string;
}

export type DifficultyLevel = "مبتدئ" | "متوسط" | "متقدم";

export interface PromptReview {
  id: string;
  promptId: string;
  promptTitle?: string;
  userName: string;
  rating: number; // 1 to 5
  comment: string;
  createdAt: string;
}

export interface Shortcut {
  id: string;
  /** Slash command without leading slash issues, e.g. "together" */
  command: string;
  /** Full slash command, e.g. "/together" */
  slash: string;
  /** Arabic display name, e.g. "تجميع التعليقات" */
  name: string;
  nameEn: string;
  /** What the shortcut/command does (Arabic) */
  description: string;
  /** Grouping/category label, e.g. "التعاون" */
  category: string;
  /** Example of using the command (Arabic) */
  example?: string;
  /** Lucide icon name */
  icon: string;
  copies: number;
  /** Soft-delete tombstone */
  deleted?: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface Prompt {
  id: string;
  categoryId: string;
  categorySlug: string;
  title: string;
  titleEn?: string;
  slug: string;
  description: string;
  promptText: string;
  descriptionEn?: string;
  promptTextEn?: string;
  models: string[];
  targetLanguage: "ar" | "en" | "both";
  framework?: string; // e.g. RACE, CREATE, Few-Shot, CoT, Role-Task-Format
  tags: string[];
  variables: PromptVariable[];
  exampleInputs?: Record<string, string>;
  sampleOutput?: string;
  tips?: string[];
  difficulty: DifficultyLevel;
  featured: boolean;
  views: number;
  copies: number;
  likes: number;
  ratingAverage?: number;
  ratingCount?: number;
  /** Soft-delete tombstone: when true the prompt is considered deleted and excluded from results. */
  deleted?: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface AdSenseSettings {
  enabled: boolean;
  publisherId: string; // e.g. ca-pub-1234567890123456
  autoAds: boolean;
  headerSlot?: string;
  feedSlot?: string;
  modalSlot?: string;
  sidebarSlot?: string;
  stickyBottomSlot?: string;
  testMode?: boolean;
}

export interface PixelSettings {
  // Meta / Facebook / Instagram Pixel
  metaPixelId?: string;
  metaPixelEnabled?: boolean;

  // Google Analytics 4 (GA4) / Google Tag
  ga4MeasurementId?: string;
  ga4Enabled?: boolean;

  // TikTok Pixel
  tiktokPixelId?: string;
  tiktokPixelEnabled?: boolean;

  // Snapchat Pixel
  snapchatPixelId?: string;
  snapchatPixelEnabled?: boolean;

  // X / Twitter Pixel
  twitterPixelId?: string;
  twitterPixelEnabled?: boolean;

  // Pinterest Tag
  pinterestTagId?: string;
  pinterestTagEnabled?: boolean;

  // LinkedIn Insight Tag
  linkedInPartnerId?: string;
  linkedInEnabled?: boolean;

  // Custom Head Scripts
  customHeadScript?: string;
  customBodyScript?: string;
}

export interface AnalyticsEventRecord {
  id: string;
  visitorId: string;
  sessionId: string;
  eventType: 'page_view' | 'prompt_view' | 'prompt_copy' | 'prompt_share' | 'prompt_like' | 'prompt_review' | 'search' | 'category_view' | 'model_click';
  path: string;
  title?: string;
  targetId?: string; // promptId, categorySlug, search term, etc.
  targetName?: string;
  referrer?: string;
  deviceType: 'desktop' | 'mobile' | 'tablet';
  browser?: string;
  os?: string;
  country?: string;
  timestamp: string;
}

export interface AnalyticsSummary {
  realtimeActiveVisitors: number;
  totalPageViews: number;
  totalUniqueVisitors: number;
  totalCopies: number;
  totalShares: number;
  totalSearches: number;
  copyConversionRate: number; // percentage
  topPrompts: {
    id: string;
    title: string;
    views: number;
    copies: number;
    likes: number;
  }[];
  topSearches: {
    query: string;
    count: number;
    lastSearched: string;
  }[];
  topCategories: {
    slug: string;
    name: string;
    views: number;
  }[];
  deviceBreakdown: {
    desktop: number;
    mobile: number;
    tablet: number;
  };
  browserBreakdown: Record<string, number>;
  referrerBreakdown: Record<string, number>;
  recentEvents: AnalyticsEventRecord[];
}

export interface DatabaseStore {
  categories: Category[];
  prompts: Prompt[];
  shortcuts?: Shortcut[];
  reviews?: PromptReview[];
  blogPosts?: Array<import('@/lib/seed-blog').BlogPost>;
  adSenseSettings?: AdSenseSettings;
  pixelSettings?: PixelSettings;
  adminSettings: {
    adminUsername: string;
    adminPasswordHash: string;
    siteTitle: string;
    siteDescription: string;
    secretAdminPath: string;
    apiKey: string;
    lastUpdated: string;
  };
}

export interface AIModelOption {
  id: string;
  name: string;
  icon: string;
  category: "text" | "image" | "code" | "all";
}
