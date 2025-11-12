import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { useUser } from './useUser';
import { createLogger } from '@/lib/logger';

const logger = createLogger('usePurchases');

export interface Purchase {
  id: string;
  user_id: string;
  medication: string;
  brand?: string;
  dosage: number;
  quantity: number;
  total_price_cents: number;
  purchase_date: string; // Date string in YYYY-MM-DD format
  purchase_location?: string;
  notes?: string;
  receipt_url?: string;
  created_at: Date;
  updated_at: Date;
  // Computed field
  date?: Date;
}

export const usePurchases = () => {
  const { user } = useUser();
  const [purchases, setPurchases] = useState<Purchase[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    if (user) {
      fetchPurchases();
    }
  }, [user]);

  const fetchPurchases = async () => {
    if (!user) return;

    try {
      setLoading(true);
      setError(null);

      const { data, error: fetchError } = await supabase
        .from('purchases')
        .select('*')
        .eq('user_id', user.id)
        .order('purchase_date', { ascending: false });

      if (fetchError) throw fetchError;

      // Parse dates
      const parsedData = (data || []).map((purchase) => ({
        ...purchase,
        date: new Date(purchase.purchase_date),
        created_at: new Date(purchase.created_at),
        updated_at: new Date(purchase.updated_at),
      }));

      setPurchases(parsedData);
      logger.debug('Purchases fetched successfully', { count: parsedData.length });
    } catch (err) {
      logger.error('Error fetching purchases:', err);
      setError(err as Error);
    } finally {
      setLoading(false);
    }
  };

  const addPurchase = async (
    purchaseData: Omit<Purchase, 'id' | 'user_id' | 'created_at' | 'updated_at' | 'date'>
  ) => {
    if (!user) {
      throw new Error('User not authenticated');
    }

    try {
      const { data, error: insertError } = await supabase
        .from('purchases')
        .insert({
          user_id: user.id,
          medication: purchaseData.medication,
          brand: purchaseData.brand,
          dosage: purchaseData.dosage,
          quantity: purchaseData.quantity,
          total_price_cents: purchaseData.total_price_cents,
          purchase_date: purchaseData.purchase_date,
          purchase_location: purchaseData.purchase_location,
          notes: purchaseData.notes,
          receipt_url: purchaseData.receipt_url,
        })
        .select()
        .single();

      if (insertError) throw insertError;

      logger.info('Purchase added successfully', { id: data.id, medication: data.medication });

      // Refetch purchases to update state
      await fetchPurchases();

      return data;
    } catch (err) {
      logger.error('Error adding purchase:', err);
      throw err;
    }
  };

  const updatePurchase = async (id: string, updates: Partial<Omit<Purchase, 'id' | 'user_id' | 'created_at' | 'updated_at' | 'date'>>) => {
    if (!user) {
      throw new Error('User not authenticated');
    }

    try {
      const { data, error: updateError } = await supabase
        .from('purchases')
        .update({
          medication: updates.medication,
          brand: updates.brand,
          dosage: updates.dosage,
          quantity: updates.quantity,
          total_price_cents: updates.total_price_cents,
          purchase_date: updates.purchase_date,
          purchase_location: updates.purchase_location,
          notes: updates.notes,
          receipt_url: updates.receipt_url,
        })
        .eq('id', id)
        .eq('user_id', user.id)
        .select()
        .single();

      if (updateError) throw updateError;

      logger.info('Purchase updated successfully', { id });

      // Refetch purchases to update state
      await fetchPurchases();

      return data;
    } catch (err) {
      logger.error('Error updating purchase:', err);
      throw err;
    }
  };

  const deletePurchase = async (id: string) => {
    if (!user) {
      throw new Error('User not authenticated');
    }

    try {
      const { error: deleteError } = await supabase
        .from('purchases')
        .delete()
        .eq('id', id)
        .eq('user_id', user.id);

      if (deleteError) throw deleteError;

      logger.info('Purchase deleted successfully', { id });

      // Refetch purchases to update state
      await fetchPurchases();
    } catch (err) {
      logger.error('Error deleting purchase:', err);
      throw err;
    }
  };

  return {
    purchases,
    loading,
    error,
    refetch: fetchPurchases,
    addPurchase,
    updatePurchase,
    deletePurchase,
  };
};
