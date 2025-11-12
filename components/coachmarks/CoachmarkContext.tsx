import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { createLogger } from '@/lib/logger';

const logger = createLogger('CoachmarkContext');

const STORAGE_KEY = '@pinpoint:coachmarks_seen';

interface CoachmarkData {
  id: string;
  title: string;
  description: string;
  order: number;
}

interface CoachmarkContextType {
  seenCoachmarks: Set<string>;
  currentCoachmark: CoachmarkData | null;
  startCoachmarkTour: (coachmarks: CoachmarkData[]) => void;
  completeCurrentCoachmark: () => void;
  skipTour: () => void;
  shouldShow: (id: string) => boolean;
}

const CoachmarkContext = createContext<CoachmarkContextType | undefined>(undefined);

export function CoachmarkProvider({ children }: { children: ReactNode }) {
  const [seenCoachmarks, setSeenCoachmarks] = useState<Set<string>>(new Set());
  const [currentCoachmark, setCurrentCoachmark] = useState<CoachmarkData | null>(null);
  const [coachmarkQueue, setCoachmarkQueue] = useState<CoachmarkData[]>([]);

  // Load seen coachmarks from storage on mount
  useEffect(() => {
    loadSeenCoachmarks();
  }, []);

  const loadSeenCoachmarks = async () => {
    try {
      const value = await AsyncStorage.getItem(STORAGE_KEY);
      if (value) {
        const seen = JSON.parse(value) as string[];
        setSeenCoachmarks(new Set(seen));
        logger.info('Loaded seen coachmarks', { count: seen.length });
      }
    } catch (error) {
      logger.error('Error loading seen coachmarks', error as Error);
    }
  };

  const saveSeenCoachmarks = async (seen: Set<string>) => {
    try {
      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(Array.from(seen)));
      logger.debug('Saved seen coachmarks', { count: seen.size });
    } catch (error) {
      logger.error('Error saving seen coachmarks', error as Error);
    }
  };

  const startCoachmarkTour = (coachmarks: CoachmarkData[]) => {
    // Filter out already seen coachmarks
    const unseen = coachmarks.filter((cm) => !seenCoachmarks.has(cm.id));

    if (unseen.length === 0) {
      logger.info('All coachmarks already seen, skipping tour');
      return;
    }

    // Sort by order
    const sorted = unseen.sort((a, b) => a.order - b.order);
    setCoachmarkQueue(sorted);
    setCurrentCoachmark(sorted[0]);
    logger.info('Starting coachmark tour', { total: sorted.length });
  };

  const completeCurrentCoachmark = () => {
    if (!currentCoachmark) return;

    // Mark current as seen
    const newSeen = new Set(seenCoachmarks);
    newSeen.add(currentCoachmark.id);
    setSeenCoachmarks(newSeen);
    saveSeenCoachmarks(newSeen);

    logger.info('Completed coachmark', { id: currentCoachmark.id });

    // Move to next
    const remainingQueue = coachmarkQueue.slice(1);
    setCoachmarkQueue(remainingQueue);

    if (remainingQueue.length > 0) {
      setCurrentCoachmark(remainingQueue[0]);
    } else {
      setCurrentCoachmark(null);
      logger.info('Coachmark tour completed');
    }
  };

  const skipTour = () => {
    if (!currentCoachmark) return;

    // Mark all remaining as seen
    const newSeen = new Set(seenCoachmarks);
    coachmarkQueue.forEach((cm) => newSeen.add(cm.id));
    setSeenCoachmarks(newSeen);
    saveSeenCoachmarks(newSeen);

    logger.info('Skipped coachmark tour', { remaining: coachmarkQueue.length });

    setCoachmarkQueue([]);
    setCurrentCoachmark(null);
  };

  const shouldShow = (id: string): boolean => {
    return !seenCoachmarks.has(id);
  };

  return (
    <CoachmarkContext.Provider
      value={{
        seenCoachmarks,
        currentCoachmark,
        startCoachmarkTour,
        completeCurrentCoachmark,
        skipTour,
        shouldShow,
      }}
    >
      {children}
    </CoachmarkContext.Provider>
  );
}

export function useCoachmarks() {
  const context = useContext(CoachmarkContext);
  if (!context) {
    throw new Error('useCoachmarks must be used within CoachmarkProvider');
  }
  return context;
}
