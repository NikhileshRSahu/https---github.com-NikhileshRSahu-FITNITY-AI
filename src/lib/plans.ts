
export interface PlanFeature {
  text: string;
  isAvailable: boolean; // To show check or cross
}
export interface Plan {
  id: 'free' | 'premium' | 'unlimited';
  name: string; // For internal use, e.g., 'Base', 'Premium', 'Unlimited'
  displayName: string; // What's shown prominently, e.g., 'FREE', 'Premium'
  priceMonthlyUsd: number;
  priceMonthlyInr: number;
  description: string;
  features: string[]; // Kept simple as array of strings
  ctaText: string;
  ctaLink: string;
  isPopular?: boolean;
  isCurrent?: boolean; // This might be dynamically set based on user's current plan
  planAccentClass?: string;
  buttonGradientClass?: string;
  icon?: React.ElementType;
}

export const plansData: Plan[] = [
  {
    id: 'free',
    name: 'Base',
    displayName: 'FREE',
    priceMonthlyUsd: 0,
    priceMonthlyInr: 0,
    description: 'Unlock offers free plan for personal use.',
    features: [
      'Adaptive AI Workouts (Limited)',
      'AI Coach (Basic)',
      'Video Library (Limited Access)',
      'Basic Progress Dashboard',
    ],
    ctaText: 'Current Plan', // Or "Get Started" if user is not on any plan
    ctaLink: '/auth/sign-up',
    isCurrent: false,
  },
  {
    id: 'premium',
    name: 'Premium',
    displayName: 'Premium',
    icon: undefined, // Will be assigned Sparkles in the component
    priceMonthlyUsd: 10,
    priceMonthlyInr: 799,
    description: 'Unlock powerful AI tools to optimize your fitness journey.',
    features: [
      'All Free features, plus:',
      'Full Adaptive AI Workouts',
      'Real-time Form Analysis',
      'AI Coach (Advanced, Voice Support placeholder)',
      'Full Video Library Access',
      'Detailed Nutrition Planner',
      'Advanced Dashboard Metrics',
    ],
    ctaText: 'Upgrade to Premium',
    ctaLink: '/subscribe/checkout?plan=premium',
    isPopular: true,
    planAccentClass: 'premium-accent-glow',
  },
  {
    id: 'unlimited',
    name: 'Unlimited',
    displayName: 'Unlimited',
    icon: undefined, // Will be assigned Zap in the component
    priceMonthlyUsd: 25,
    priceMonthlyInr: 1999,
    description: 'Unlock the ultimate fitness experience with all features.',
    features: [
      'All Premium features, plus:',
      'Priority AI Coach Support (placeholder)',
      'Exclusive Content & Challenges',
      'Early Access to New Features',
      'Full Shop Discounts (placeholder)',
    ],
    ctaText: 'Upgrade to Unlimited',
    ctaLink: '/subscribe/checkout?plan=unlimited',
    planAccentClass: 'unlimited-accent-text',
    buttonGradientClass: 'unlimited-button-gradient',
  },
];

export const getPlanById = (id: 'free' | 'premium' | 'unlimited' | string | null) => {
  return plansData.find(plan => plan.id === id) || null;
};
