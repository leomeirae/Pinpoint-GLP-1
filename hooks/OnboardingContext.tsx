import React, { createContext, useContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { createLogger } from '@/lib/logger';

const logger = createLogger('OnboardingContext');

// Onboarding data structure
export interface OnboardingData {
  // Compliance
  consentVersion: string;
  consentAcceptedAt: string | null;
  analyticsOptIn: boolean;

  // Medication & Dose
  medication: string | null;
  dosage: number | null;
  frequency: 'weekly'; // Only weekly for GLP-1

  // Schedule
  preferredDay: number | null; // 0-6 (Sunday-Saturday)
  preferredTime: string | null; // HH:mm format (24h)

  // Reminder window (future enhancement)
  reminderWindowStart: string | null; // HH:mm
  reminderWindowEnd: string | null; // HH:mm

  // Deferred sign-up
  isGuestMode: boolean;

  // Progress tracking
  currentStep: number;
  completedSteps: string[];
}

interface OnboardingContextType {
  data: OnboardingData;
  updateData: (updates: Partial<OnboardingData>) => void;
  resetData: () => void;
  saveToStorage: () => Promise<void>;
  loadFromStorage: () => Promise<void>;
  nextStep: () => void;
  prevStep: () => void;
  goToStep: (step: number) => void;
  markStepCompleted: (stepName: string) => void;
}

const STORAGE_KEY = '@pinpoint:onboarding_data';

const defaultData: OnboardingData = {
  consentVersion: '1.0.0',
  consentAcceptedAt: null,
  analyticsOptIn: false, // Default: false (fail-safe)
  medication: null,
  dosage: null,
  frequency: 'weekly',
  preferredDay: null,
  preferredTime: null,
  reminderWindowStart: null,
  reminderWindowEnd: null,
  isGuestMode: false,
  currentStep: 0,
  completedSteps: [],
};

const OnboardingContext = createContext<OnboardingContextType | undefined>(undefined);

export function OnboardingProvider({ children }: { children: React.ReactNode }) {
  const [data, setData] = useState<OnboardingData>(defaultData);

  // Load data from AsyncStorage on mount
  useEffect(() => {
    loadFromStorage();
  }, []);

  const updateData = (updates: Partial<OnboardingData>) => {
    setData((prev) => {
      const newData = { ...prev, ...updates };
      logger.debug('Onboarding data updated', { updates, newData });
      return newData;
    });
  };

  const resetData = () => {
    setData(defaultData);
    logger.info('Onboarding data reset');
  };

  const saveToStorage = async () => {
    try {
      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(data));
      logger.debug('Onboarding data saved to storage');
    } catch (error) {
      logger.error('Failed to save onboarding data', error as Error);
    }
  };

  const loadFromStorage = async () => {
    try {
      const stored = await AsyncStorage.getItem(STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored) as OnboardingData;
        setData(parsed);
        logger.debug('Onboarding data loaded from storage', { parsed });
      }
    } catch (error) {
      logger.error('Failed to load onboarding data', error as Error);
    }
  };

  const nextStep = () => {
    setData((prev) => ({ ...prev, currentStep: prev.currentStep + 1 }));
  };

  const prevStep = () => {
    setData((prev) => ({
      ...prev,
      currentStep: Math.max(0, prev.currentStep - 1),
    }));
  };

  const goToStep = (step: number) => {
    setData((prev) => ({ ...prev, currentStep: step }));
  };

  const markStepCompleted = (stepName: string) => {
    setData((prev) => ({
      ...prev,
      completedSteps: [...new Set([...prev.completedSteps, stepName])],
    }));
  };

  // Auto-save on data changes (debounced in real implementation)
  useEffect(() => {
    if (data.currentStep > 0) {
      saveToStorage();
    }
  }, [data]);

  const value: OnboardingContextType = {
    data,
    updateData,
    resetData,
    saveToStorage,
    loadFromStorage,
    nextStep,
    prevStep,
    goToStep,
    markStepCompleted,
  };

  return (
    <OnboardingContext.Provider value={value}>{children}</OnboardingContext.Provider>
  );
}

export function useOnboardingContext() {
  const context = useContext(OnboardingContext);
  if (!context) {
    throw new Error('useOnboardingContext must be used within OnboardingProvider');
  }
  return context;
}
