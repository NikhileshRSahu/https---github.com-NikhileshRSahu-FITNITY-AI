
'use client';

import React, { createContext, useState, useContext, useEffect, ReactNode, useCallback, Dispatch, SetStateAction } from 'react';

export type SubscriptionTier = 'free' | 'premium' | 'unlimited';

// Defines which features are accessible by which tier(s)
export interface FeatureAccessConfig {
  workoutPlan: SubscriptionTier[];
  formAnalysis: SubscriptionTier[];
  aiCoach: SubscriptionTier[];
  dashboard: SubscriptionTier[];
  nutritionPlan: SubscriptionTier[];
  videos: SubscriptionTier[];
  shop: SubscriptionTier[];
  profile: SubscriptionTier[];
  // Add other specific features as needed
}

const featureAccess: FeatureAccessConfig = {
  workoutPlan: ['free', 'premium', 'unlimited'],
  formAnalysis: ['premium', 'unlimited'], // Premium feature
  aiCoach: ['free', 'premium', 'unlimited'],
  dashboard: ['free', 'premium', 'unlimited'],
  nutritionPlan: ['premium', 'unlimited'], // Premium feature
  videos: ['free', 'premium', 'unlimited'],
  shop: ['free', 'premium', 'unlimited'],
  profile: ['free', 'premium', 'unlimited'],
};

type SubscriptionContextType = {
  subscriptionTier: SubscriptionTier;
  setSubscriptionTier: Dispatch<SetStateAction<SubscriptionTier>>;
  isFeatureAccessible: (featureKey: keyof FeatureAccessConfig) => boolean;
  mounted: boolean; // Expose mounted state for consumers if needed
};

// Define a default context value that matches the type
const initialSubscriptionContextValue: SubscriptionContextType = {
  subscriptionTier: 'free',
  setSubscriptionTier: () => {}, // No-op function for default
  isFeatureAccessible: (featureKey: keyof FeatureAccessConfig) => {
    // Default behavior: only allow features accessible to 'free' tier
    const accessibleTiers = featureAccess[featureKey];
    return accessibleTiers.includes('free');
  },
  mounted: false,
};

const SubscriptionContext = createContext<SubscriptionContextType>(initialSubscriptionContextValue);

export const SubscriptionProvider = ({ children }: { children: ReactNode }) => {
  const [subscriptionTier, setSubscriptionTier] = useState<SubscriptionTier>('free');
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    if (typeof window !== 'undefined') {
      const storedTier = localStorage.getItem('fitnitySubscriptionTier') as SubscriptionTier | null;
      if (storedTier && ['free', 'premium', 'unlimited'].includes(storedTier)) {
        setSubscriptionTier(storedTier);
      } else {
        localStorage.setItem('fitnitySubscriptionTier', 'free');
        setSubscriptionTier('free');
      }
    }
  }, []);

  useEffect(() => {
    if (mounted && typeof window !== 'undefined') {
      localStorage.setItem('fitnitySubscriptionTier', subscriptionTier);
    }
  }, [subscriptionTier, mounted]);

  const isFeatureAccessible = useCallback(
    (featureKey: keyof FeatureAccessConfig): boolean => {
      if (!mounted) {
        // Default behavior for SSR or pre-hydration
        const accessibleTiersForFeature = featureAccess[featureKey];
        return accessibleTiersForFeature.includes('free');
      }
      const accessibleTiers = featureAccess[featureKey];
      return accessibleTiers.includes(subscriptionTier);
    },
    [subscriptionTier, mounted]
  );

  const contextValue = React.useMemo(() => ({
    subscriptionTier,
    setSubscriptionTier,
    isFeatureAccessible,
    mounted,
  }), [subscriptionTier, setSubscriptionTier, isFeatureAccessible, mounted]);

  return (
    <SubscriptionContext.Provider value={contextValue}>
      {children}
    </SubscriptionContext.Provider>
  );
};

export const useSubscription = () => {
  const context = useContext(SubscriptionContext);
  // The default value provided to createContext ensures context is never undefined
  return context;
};
