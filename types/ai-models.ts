export interface AIModel {
  id: string;
  slug: string;
  name: string;
  nameEn: string;
  company: string;
  companyEn: string;
  logo: string;
  category: 'text' | 'image' | 'video' | 'audio' | 'code' | 'multimodal' | 'search';
  pricing: 'free' | 'freemium' | 'paid' | 'open-source';
  pricingDetails?: string;
  website: string;
  description: string;
  descriptionEn: string;
  strengths: string[];
  weaknesses: string[];
  bestFor: string[];
  contextWindow?: string;
  languages: string[];
  releasedDate?: string;
  version?: string;
  features: ModelFeature[];
  tips: string[];
  relatedPromptCount?: number;
}

export interface ModelFeature {
  name: string;
  nameAr: string;
  description: string;
}

export interface ModelComparison {
  id: string;
  slug: string;
  title: string;
  titleEn: string;
  modelA: string;
  modelB: string;
  modelC?: string;
  category: string;
  description: string;
  verdict: string;
  criteria: ComparisonCriteria[];
}

export interface ComparisonCriteria {
  name: string;
  nameAr: string;
  scores: Record<string, number>;
  winner: string;
  explanation: string;
}
