
'use client';

import React, { createContext, useState, useContext, useEffect, ReactNode, useCallback, Dispatch, SetStateAction } from 'react';

export type SubscriptionTier = 'free' | 'premium' | 'unlimited';

// Defines which features are accessible by which tier(s)
export interface FeatureAccessConfig {
  workoutPlan: SubscriptionTier[];
  formAnalysis: SubscriptionTier[];
  aiCoach: SubscriptionTier[];
  dashboard: SubscriptionTier[]; // General dashboard access
  dashboardWorkoutConsistency: SubscriptionTier[];
  dashboardHealthSnapshot: SubscriptionTier[];
  dashboardBodyMeasurements: SubscriptionTier[];
  dashboardPersonalRecords: SubscriptionTier[];
  dashboardStreaksAndBadges: SubscriptionTier[];
  nutritionPlan: SubscriptionTier[];
  videos: SubscriptionTier[];
  shop: SubscriptionTier[];
  profile: SubscriptionTier[];
}

const featureAccess: FeatureAccessConfig = {
  workoutPlan: ['free', 'premium', 'unlimited'],
  formAnalysis: ['premium', 'unlimited'],
  aiCoach: ['free', 'premium', 'unlimited'],
  dashboard: ['free', 'premium', 'unlimited'],
  dashboardWorkoutConsistency: ['free', 'premium', 'unlimited'],
  dashboardHealthSnapshot: ['free', 'premium', 'unlimited'],
  dashboardBodyMeasurements: ['premium', 'unlimited'],
  dashboardPersonalRecords: ['premium', 'unlimited'],
  dashboardStreaksAndBadges: ['premium', 'unlimited'],
  nutritionPlan: ['premium', 'unlimited'],
  videos: ['free', 'premium', 'unlimited'],
  shop: ['free', 'premium', 'unlimited'],
  profile: ['free', 'premium', 'unlimited'],
};

type SubscriptionContextType = {
  subscriptionTier: SubscriptionTier;
  setSubscriptionTier: Dispatch<SetStateAction<SubscriptionTier>>;
  isFeatureAccessible: (featureKey: keyof FeatureAccessConfig) => boolean;
  mounted: boolean;
};

const initialSubscriptionContextValue: SubscriptionContextType = {
  subscriptionTier: 'free',
  setSubscriptionTier: () => {},
  isFeatureAccessible: (featureKey: keyof FeatureAccessConfig) => {
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
        // Default to 'free' if nothing stored or invalid
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
        // SSR or pre-hydration: default to 'free' access for the given feature
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
  if (context === undefined) {
    // This error should ideally not be hit if using the default value in createContext
    // and ensuring provider wraps the app.
    throw new Error('useSubscription must be used within a SubscriptionProvider');
  }
  return context;
};
