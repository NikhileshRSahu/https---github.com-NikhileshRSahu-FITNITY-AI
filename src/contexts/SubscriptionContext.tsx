'use client'; // CRITICAL: This directive was missing or incorrect.

import React, { createContext, useState, useContext, useEffect, ReactNode, useCallback, Dispatch, SetStateAction } from 'react';

export type SubscriptionTier = 'free' | 'premium' | 'unlimited';

// Defines which features are accessible by which tier(s)
export interface FeatureAccessConfig {
  workoutPlan: SubscriptionTier[];
  formAnalysis: SubscriptionTier[];
  aiCoach: SubscriptionTier[];
  dashboard: SubscriptionTier[];
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

export type SubscriptionContextType = {
  subscriptionTier: SubscriptionTier;
  setSubscriptionTier: Dispatch<SetStateAction<SubscriptionTier>>;
  isFeatureAccessible: (featureKey: keyof FeatureAccessConfig) => boolean;
  mounted: boolean; // Indicates if provider is mounted and localStorage can be accessed
};

const defaultSubscriptionContextValue: SubscriptionContextType = {
  subscriptionTier: 'free',
  setSubscriptionTier: () => {
    console.warn("setSubscriptionTier called before SubscriptionProvider is fully mounted or outside of it.");
  },
  isFeatureAccessible: (featureKey: keyof FeatureAccessConfig) => {
    const accessibleTiers = featureAccess[featureKey];
    return accessibleTiers.includes('free');
  },
  mounted: false,
};

const SubscriptionContext = createContext<SubscriptionContextType>(defaultSubscriptionContextValue);

export const SubscriptionProvider = ({ children }: { children: ReactNode }) => {
  const [subscriptionTier, setSubscriptionTier] = useState<SubscriptionTier>('free');
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const storedTier = localStorage.getItem('fitnitySubscriptionTier') as SubscriptionTier | null;
    if (storedTier && ['free', 'premium', 'unlimited'].includes(storedTier)) {
      setSubscriptionTier(storedTier);
    } else {
      localStorage.setItem('fitnitySubscriptionTier', 'free'); // Initialize if not present
      setSubscriptionTier('free');
    }
  }, []);

  useEffect(() => {
    if (mounted) {
      localStorage.setItem('fitnitySubscriptionTier', subscriptionTier);
    }
  }, [subscriptionTier, mounted]);

  const isFeatureAccessible = useCallback(
    (featureKey: keyof FeatureAccessConfig): boolean => {
      if (!mounted) {
        return defaultSubscriptionContextValue.isFeatureAccessible(featureKey);
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
  // This error should not be hit if createContext has a default and Provider is correctly placed.
  if (context === undefined) {
    console.error("useSubscription hook: SubscriptionContext is undefined. Check Provider setup and default context value.");
    throw new Error('useSubscription must be used within a SubscriptionProvider (context returned undefined)');
  }
  return context;
};
