import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { useUser } from './useUser';
import { createLogger } from '@/lib/logger';

const logger = createLogger('useTreatmentPauses');

export interface TreatmentPause {
  id: string;
  user_id: string;
  start_date: string; // Date string in YYYY-MM-DD format
  end_date?: string; // Date string in YYYY-MM-DD format, null if active
  reason?: string;
  notes?: string;
  created_at: Date;
  updated_at: Date;
  // Computed fields
  isActive?: boolean;
  durationDays?: number;
}

export const useTreatmentPauses = () => {
  const { user } = useUser();
  const [pauses, setPauses] = useState<TreatmentPause[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const [activePause, setActivePause] = useState<TreatmentPause | null>(null);

  useEffect(() => {
    if (user) {
      fetchPauses();
    }
  }, [user]);

  const fetchPauses = async () => {
    if (!user) return;

    try {
      setLoading(true);
      setError(null);

      const { data, error: fetchError } = await supabase
        .from('treatment_pauses')
        .select('*')
        .eq('user_id', user.id)
        .order('start_date', { ascending: false });

      if (fetchError) throw fetchError;

      // Parse dates and compute fields
      const parsedData = (data || []).map((pause) => {
        const isActive = !pause.end_date;

        // Calculate duration
        let durationDays = 0;
        if (pause.end_date) {
          const start = new Date(pause.start_date);
          const end = new Date(pause.end_date);
          durationDays = Math.ceil((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24));
        } else {
          // Active pause: calculate duration until today
          const start = new Date(pause.start_date);
          const now = new Date();
          durationDays = Math.ceil((now.getTime() - start.getTime()) / (1000 * 60 * 60 * 24));
        }

        return {
          ...pause,
          created_at: new Date(pause.created_at),
          updated_at: new Date(pause.updated_at),
          isActive,
          durationDays,
        };
      });

      setPauses(parsedData);

      // Find active pause
      const active = parsedData.find((p) => p.isActive) || null;
      setActivePause(active);

      logger.debug('Pauses fetched successfully', {
        count: parsedData.length,
        hasActivePause: !!active,
      });
    } catch (err) {
      logger.error('Error fetching pauses:', err);
      setError(err as Error);
    } finally {
      setLoading(false);
    }
  };

  const startPause = async (startDate: string, reason?: string, notes?: string) => {
    if (!user) {
      throw new Error('User not authenticated');
    }

    // Check if there's already an active pause
    if (activePause) {
      throw new Error('There is already an active pause. End it before starting a new one.');
    }

    try {
      const { data, error: insertError } = await supabase
        .from('treatment_pauses')
        .insert({
          user_id: user.id,
          start_date: startDate,
          reason: reason || null,
          notes: notes || null,
        })
        .select()
        .single();

      if (insertError) throw insertError;

      logger.info('Pause started successfully', { id: data.id, startDate });

      // Refetch pauses to update state
      await fetchPauses();

      return data;
    } catch (err) {
      logger.error('Error starting pause:', err);
      throw err;
    }
  };

  const endPause = async (pauseId: string, endDate: string) => {
    if (!user) {
      throw new Error('User not authenticated');
    }

    try {
      const { data, error: updateError } = await supabase
        .from('treatment_pauses')
        .update({
          end_date: endDate,
        })
        .eq('id', pauseId)
        .eq('user_id', user.id)
        .select()
        .single();

      if (updateError) throw updateError;

      logger.info('Pause ended successfully', { id: pauseId, endDate });

      // Refetch pauses to update state
      await fetchPauses();

      return data;
    } catch (err) {
      logger.error('Error ending pause:', err);
      throw err;
    }
  };

  const deletePause = async (pauseId: string) => {
    if (!user) {
      throw new Error('User not authenticated');
    }

    try {
      const { error: deleteError } = await supabase
        .from('treatment_pauses')
        .delete()
        .eq('id', pauseId)
        .eq('user_id', user.id);

      if (deleteError) throw deleteError;

      logger.info('Pause deleted successfully', { id: pauseId });

      // Refetch pauses to update state
      await fetchPauses();
    } catch (err) {
      logger.error('Error deleting pause:', err);
      throw err;
    }
  };

  const isCurrentlyPaused = (): boolean => {
    return !!activePause;
  };

  return {
    pauses,
    loading,
    error,
    activePause,
    isCurrentlyPaused: isCurrentlyPaused(),
    refetch: fetchPauses,
    startPause,
    endPause,
    deletePause,
  };
};
