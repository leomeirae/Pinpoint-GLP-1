import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { useUser } from './useUser';
import { createLogger } from '@/lib/logger';

const logger = createLogger('useAlcoholLogs');

export interface AlcoholLog {
  id: string;
  user_id: string;
  date: string; // Date string in YYYY-MM-DD format
  consumed: boolean;
  drinks_count?: number;
  notes?: string;
  created_at: Date;
  updated_at: Date;
}

export const useAlcoholLogs = () => {
  const { user } = useUser();
  const [logs, setLogs] = useState<AlcoholLog[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    if (user) {
      fetchLogs();
    }
  }, [user]);

  const fetchLogs = async () => {
    if (!user) return;

    try {
      setLoading(true);
      setError(null);

      const { data, error: fetchError } = await supabase
        .from('alcohol_logs')
        .select('*')
        .eq('user_id', user.id)
        .order('date', { ascending: false });

      if (fetchError) throw fetchError;

      // Parse dates
      const parsedData = (data || []).map((log) => ({
        ...log,
        created_at: new Date(log.created_at),
        updated_at: new Date(log.updated_at),
      }));

      setLogs(parsedData);
      logger.debug('Alcohol logs fetched successfully', { count: parsedData.length });
    } catch (err) {
      logger.error('Error fetching alcohol logs:', err);
      setError(err as Error);
    } finally {
      setLoading(false);
    }
  };

  const toggleAlcoholForDate = async (
    date: string,
    consumed: boolean,
    drinksCount?: number,
    notes?: string
  ) => {
    if (!user) {
      throw new Error('User not authenticated');
    }

    try {
      // Check if log already exists for this date
      const existingLog = logs.find((log) => log.date === date);

      if (existingLog) {
        // Update existing log
        const { data, error: updateError } = await supabase
          .from('alcohol_logs')
          .update({
            consumed,
            drinks_count: drinksCount,
            notes: notes || null,
          })
          .eq('id', existingLog.id)
          .eq('user_id', user.id)
          .select()
          .single();

        if (updateError) throw updateError;

        logger.info('Alcohol log updated', { date, consumed });
      } else {
        // Insert new log
        const { data, error: insertError } = await supabase
          .from('alcohol_logs')
          .insert({
            user_id: user.id,
            date,
            consumed,
            drinks_count: drinksCount,
            notes: notes || null,
          })
          .select()
          .single();

        if (insertError) throw insertError;

        logger.info('Alcohol log created', { date, consumed });
      }

      // Refetch logs to update state
      await fetchLogs();
    } catch (err) {
      logger.error('Error toggling alcohol log:', err);
      throw err;
    }
  };

  const deleteLogForDate = async (date: string) => {
    if (!user) {
      throw new Error('User not authenticated');
    }

    try {
      const { error: deleteError } = await supabase
        .from('alcohol_logs')
        .delete()
        .eq('user_id', user.id)
        .eq('date', date);

      if (deleteError) throw deleteError;

      logger.info('Alcohol log deleted', { date });

      // Refetch logs to update state
      await fetchLogs();
    } catch (err) {
      logger.error('Error deleting alcohol log:', err);
      throw err;
    }
  };

  const getLogForDate = (date: string): AlcoholLog | null => {
    return logs.find((log) => log.date === date) || null;
  };

  const hasConsumedOnDate = (date: string): boolean => {
    const log = getLogForDate(date);
    return log?.consumed || false;
  };

  return {
    logs,
    loading,
    error,
    refetch: fetchLogs,
    toggleAlcoholForDate,
    deleteLogForDate,
    getLogForDate,
    hasConsumedOnDate,
  };
};
