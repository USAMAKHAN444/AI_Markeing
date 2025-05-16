
// Common API types

export interface User {
  id: string;
  email: string;
  fullName: string;
  profileImage?: string;
}

export interface CampaignMetrics {
  impressions: number;
  clicks: number;
  conversions: number;
  costPerClick: number;
  roi: number;
}

export interface AdCreative {
  headlines: string[];
  descriptions: string[];
  businessName: string;
  displayUrl: string;
  finalUrl: string;
  imageUrls?: string[];
}

export interface AudienceTargeting {
  demographics: {
    gender: Record<string, number>;
    ageRange: Record<string, number>;
  };
  interests: string[];
  devices: Record<string, number>;
  locations: Record<string, number>;
}

export interface Campaign {
  id: string;
  name: string;
  budget: number;
  days: number;
  url: string;
  status: 'pending' | 'running' | 'completed' | 'failed';
  createdAt: string;
  lastUpdated: string;
  metrics?: CampaignMetrics;
  adCreatives?: AdCreative[];
  audienceTargeting?: AudienceTargeting;
  bidStrategy?: string;
  adRotationSettings?: string;
  // New fields for Google Ads campaign data
  languageTargeting?: string[];
  contentExclusions?: string[];
  schedules?: Array<{
    dayOfWeek: string;
    startHour: number;
    endHour: number;
  }>;
  trackingTemplate?: string;
}

export interface AuthResponse {
  user: User;
  token: string;
}

export interface CampaignRequest {
  budget: string;
  days: string;
  campaignId: string;
  url: string;
}

export interface ApiResponse {
  responses: Array<{
    state: string;
    response: string;
    duration: number;
    audience_criteria?: Record<string, any>;
  }>;
}

// Add Google Ads API interface
export interface GoogleAdsCampaignDetail {
  name: string;
  budget: number;
  startDate: string;
  endDate: string;
  status: string;
  bidStrategy: string;
  adRotation: string;
  locations: string[];
  languages: string[];
  devices: string[];
  schedules: Array<{
    dayOfWeek: string;
    startHour: number;
    endHour: number;
    startMinute: number;
    endMinute: number;
  }>;
  adCreatives: {
    headlines: string[];
    descriptions: string[];
    businessName: string;
    finalUrls: string[];
    imageAssets: string[];
  };
  audienceTargeting: {
    interests: string[];
    demographics: {
      genders: Record<string, number>;
      ages: Record<string, number>;
    };
  };
  trackingTemplate?: string;
}
