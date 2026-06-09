// User Profile and Memory Management for Aladdin
export interface UserProfile {
  id: string;
  interests: string[];
  purchaseHistory: PurchaseItem[];
  viewedApps: string[];
  recommendations: Recommendation[];
  conversationCount: number;
  createdAt: Date;
}

export interface PurchaseItem {
  appId: string;
  appName: string;
  category: string;
  amount: number;
  currency: string;
  date: Date;
  details?: string;
}

export interface Recommendation {
  appId: string;
  appName: string;
  reason: string;
  confidence: number;
  timestamp: Date;
}

const STORAGE_KEY = 'aladdin_user_profile';
const MEMORY_KEY = 'aladdin_conversation_memory';

export function getUserProfile(): UserProfile {
  if (typeof window === 'undefined') return createEmptyProfile();
  
  const stored = localStorage.getItem(STORAGE_KEY);
  if (stored) {
    try {
      return JSON.parse(stored);
    } catch {
      return createEmptyProfile();
    }
  }
  return createEmptyProfile();
}

function createEmptyProfile(): UserProfile {
  return {
    id: generateUserId(),
    interests: [],
    purchaseHistory: [],
    viewedApps: [],
    recommendations: [],
    conversationCount: 0,
    createdAt: new Date(),
  };
}

function generateUserId(): string {
  return `user_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
}

export function saveUserProfile(profile: UserProfile): void {
  if (typeof window !== 'undefined') {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(profile));
  }
}

export function updateUserInterests(keywords: string[]): void {
  const profile = getUserProfile();
  const newInterests = [...new Set([...profile.interests, ...keywords])];
  profile.interests = newInterests.slice(0, 20); // Keep top 20
  saveUserProfile(profile);
}

export function recordAppView(appId: string, appName: string): void {
  const profile = getUserProfile();
  if (!profile.viewedApps.includes(appId)) {
    profile.viewedApps.push(appId);
  }
  saveUserProfile(profile);
}

export function recordPurchase(purchase: Omit<PurchaseItem, 'date'>): void {
  const profile = getUserProfile();
  profile.purchaseHistory.push({
    ...purchase,
    date: new Date(),
  });
  profile.conversationCount++;
  saveUserProfile(profile);
}

export function getConversationMemory(): string {
  if (typeof window === 'undefined') return '';
  
  const profile = getUserProfile();
  let memory = '';
  
  if (profile.interests.length > 0) {
    memory += `User interests: ${profile.interests.join(', ')}\n`;
  }
  
  if (profile.purchaseHistory.length > 0) {
    const recentPurchases = profile.purchaseHistory.slice(-5);
    memory += `Recent activities: ${recentPurchases.map(p => `${p.appName} (${p.amount} ${p.currency})`).join(', ')}\n`;
  }
  
  if (profile.viewedApps.length > 0) {
    memory += `Previously viewed: ${profile.viewedApps.join(', ')}\n`;
  }
  
  return memory;
}

export function generateRecommendations(userMessage: string): Recommendation[] {
  const profile = getUserProfile();
  const recommendations: Recommendation[] = [];
  
  const keywords = userMessage.toLowerCase().split(/\s+/);
  
  const appKeywords: { [key: string]: string[] } = {
    'RE Global': ['real estate', 'property', 'house', 'apartment', 'invest', 'land', 'rent'],
    'Global Motor': ['car', 'vehicle', 'automotive', 'drive', 'motor', 'auto', 'transport'],
    'Globy': ['trade', 'business', 'commerce', 'supplier', 'wholesale', 'export', 'import'],
    'GlobalWeavers': ['fabric', 'textile', 'fashion', 'clothing', 'wear', 'design', 'material'],
    'Merit': ['education', 'course', 'learn', 'training', 'certificate', 'skill', 'study'],
    'EM': ['shop', 'market', 'buy', 'sell', 'product', 'store', 'purchase', 'deal'],
    'FourHands': ['service', 'professional', 'expert', 'repair', 'help', 'consultation'],
  };
  
  for (const [appName, appKeywords_] of Object.entries(appKeywords)) {
    const matches = keywords.filter(kw => appKeywords_.includes(kw)).length;
    if (matches > 0) {
      recommendations.push({
        appId: appName.replace(/\s+/g, '_'),
        appName,
        reason: `Matches your interest in ${appKeywords_.slice(0, 2).join(' and ')}`,
        confidence: Math.min(matches / appKeywords_.length, 1),
        timestamp: new Date(),
      });
    }
  }
  
  return recommendations.sort((a, b) => b.confidence - a.confidence).slice(0, 3);
}

export function clearUserData(): void {
  if (typeof window !== 'undefined') {
    localStorage.removeItem(STORAGE_KEY);
    localStorage.removeItem(MEMORY_KEY);
  }
}
