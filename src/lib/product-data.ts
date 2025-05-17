
export type Product = {
  id: string;
  name: string;
  description: string;
  priceINR: number;
  priceUSD: number;
  imagePlaceholder: string; // URL for placeholder image
  aiHint: string; // Hint for AI image generation if needed
  category: 'Equipment' | 'Apparel' | 'Nutrition' | 'Wearables' | 'Accessories';
  slug: string; // for URL generation
};

export const products: Product[] = [
  {
    id: 'prod_001',
    name: 'Smart Hydration Bottle',
    description: 'Tracks your water intake and glows to remind you to drink. Syncs with the Fitnity AI app.',
    priceINR: 2499,
    priceUSD: 30,
    imagePlaceholder: 'https://placehold.co/300x300.png',
    aiHint: 'smart water bottle futuristic',
    category: 'Accessories',
    slug: 'smart-hydration-bottle',
  },
  {
    id: 'prod_002',
    name: 'AI-Optimized Yoga Mat',
    description: 'Premium non-slip yoga mat with alignment guides. Pairs with Fitnity AI form analysis for yoga.',
    priceINR: 3999,
    priceUSD: 49,
    imagePlaceholder: 'https://placehold.co/300x300.png',
    aiHint: 'yoga mat modern tech',
    category: 'Equipment',
    slug: 'ai-yoga-mat',
  },
  {
    id: 'prod_003',
    name: 'Performance T-Shirt',
    description: 'Lightweight, breathable fabric with moisture-wicking technology. Designed for intense workouts.',
    priceINR: 1299,
    priceUSD: 18,
    imagePlaceholder: 'https://placehold.co/300x300.png',
    aiHint: 'performance t-shirt fitness',
    category: 'Apparel',
    slug: 'performance-t-shirt',
  },
  {
    id: 'prod_004',
    name: 'Fitnity AI Whey Protein',
    description: 'High-quality whey protein isolate, optimized for muscle recovery. Recommended by Fitnity AI Nutrition.',
    priceINR: 2999,
    priceUSD: 38,
    imagePlaceholder: 'https://placehold.co/300x300.png',
    aiHint: 'protein powder modern container',
    category: 'Nutrition',
    slug: 'fitnity-whey-protein',
  },
  {
    id: 'prod_005',
    name: 'Advanced Fitness Tracker',
    description: 'Monitors heart rate, sleep, SpO2, and integrates seamlessly with your Fitnity AI dashboard.',
    priceINR: 7999,
    priceUSD: 99,
    imagePlaceholder: 'https://placehold.co/300x300.png',
    aiHint: 'fitness tracker sleek display',
    category: 'Wearables',
    slug: 'advanced-fitness-tracker',
  },
  {
    id: 'prod_006',
    name: 'Adjustable Dumbbell Set',
    description: 'Space-saving adjustable dumbbells, perfect for home workouts. Ideal for Fitnity AI strength plans.',
    priceINR: 9999,
    priceUSD: 125,
    imagePlaceholder: 'https://placehold.co/300x300.png',
    aiHint: 'adjustable dumbbell set modern',
    category: 'Equipment',
    slug: 'adjustable-dumbbell-set',
  },
];
