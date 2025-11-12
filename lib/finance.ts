// lib/finance.ts
// Financial calculations for medication purchases
// C4 - Financeiro MVP

import { Purchase } from '@/hooks/usePurchases';
import { createLogger } from '@/lib/logger';

const logger = createLogger('Finance');

/**
 * Format cents to Brazilian Real currency (BRL)
 * Example: 123456 -> "R$ 1.234,56"
 * @param cents - Amount in cents
 * @returns Formatted currency string
 */
export function formatCurrency(cents: number): string {
  if (cents < 0) {
    logger.warn('Negative cents value', { cents });
    return 'R$ 0,00';
  }

  const reais = cents / 100;

  // Format with Brazilian locale (pt-BR)
  // Uses period for thousands and comma for decimals
  return reais.toLocaleString('pt-BR', {
    style: 'currency',
    currency: 'BRL',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
}

/**
 * Calculate total spent across all purchases
 * @param purchases - Array of purchases
 * @returns Total spent in cents
 */
export function calculateTotalSpent(purchases: Purchase[]): number {
  if (purchases.length === 0) {
    return 0;
  }

  const total = purchases.reduce((sum, purchase) => {
    return sum + purchase.total_price_cents;
  }, 0);

  logger.debug('Total spent calculated', { total, purchaseCount: purchases.length });
  return total;
}

/**
 * Calculate average weekly spending
 * Based on total spent divided by number of weeks since first purchase
 * @param purchases - Array of purchases
 * @returns Average weekly spending in cents
 */
export function calculateWeeklySpent(purchases: Purchase[]): number {
  if (purchases.length === 0) {
    return 0;
  }

  const total = calculateTotalSpent(purchases);

  // Find earliest purchase date
  const sortedPurchases = [...purchases].sort((a, b) => {
    const dateA = new Date(a.purchase_date);
    const dateB = new Date(b.purchase_date);
    return dateA.getTime() - dateB.getTime();
  });

  const firstPurchaseDate = new Date(sortedPurchases[0].purchase_date);
  const now = new Date();

  // Calculate weeks elapsed since first purchase
  const msInWeek = 1000 * 60 * 60 * 24 * 7;
  const weeksElapsed = Math.max(1, (now.getTime() - firstPurchaseDate.getTime()) / msInWeek);

  const weeklySpent = Math.round(total / weeksElapsed);

  logger.debug('Weekly spending calculated', {
    total,
    weeksElapsed: weeksElapsed.toFixed(1),
    weeklySpent,
  });

  return weeklySpent;
}

/**
 * Calculate cost per kg lost
 * CRITICAL: Only show if user opted in (finance_opt_in = true)
 * Requires at least 2 weight measurements
 *
 * @param purchases - Array of purchases
 * @param startWeight - Starting weight in kg
 * @param currentWeight - Current weight in kg
 * @returns Cost per kg lost in cents, or null if not enough data
 */
export function calculateCostPerKg(
  purchases: Purchase[],
  startWeight: number | null,
  currentWeight: number | null
): number | null {
  // Validation: Need purchases and weight data
  if (purchases.length === 0) {
    logger.debug('No purchases for cost per kg calculation');
    return null;
  }

  if (startWeight === null || currentWeight === null) {
    logger.debug('Missing weight data for cost per kg calculation');
    return null;
  }

  // Calculate weight loss
  const weightLoss = startWeight - currentWeight;

  // Need positive weight loss
  if (weightLoss <= 0) {
    logger.debug('No weight loss for cost per kg calculation', {
      startWeight,
      currentWeight,
      weightLoss,
    });
    return null;
  }

  const totalSpent = calculateTotalSpent(purchases);
  const costPerKg = Math.round(totalSpent / weightLoss);

  logger.debug('Cost per kg calculated', {
    totalSpent,
    weightLoss: weightLoss.toFixed(2),
    costPerKg,
  });

  return costPerKg;
}

/**
 * Predict next purchase date based on purchase history
 * Uses average days between purchases
 * Requires at least 2 purchases
 *
 * @param purchases - Array of purchases (should be sorted by date desc)
 * @returns Predicted next purchase date, or null if not enough data
 */
export function predictNextPurchase(purchases: Purchase[]): Date | null {
  if (purchases.length < 2) {
    logger.debug('Not enough purchases to predict next purchase date');
    return null;
  }

  // Sort purchases by date (oldest first)
  const sortedPurchases = [...purchases].sort((a, b) => {
    const dateA = new Date(a.purchase_date);
    const dateB = new Date(b.purchase_date);
    return dateA.getTime() - dateB.getTime();
  });

  // Calculate average days between purchases
  let totalDays = 0;
  let intervals = 0;

  for (let i = 1; i < sortedPurchases.length; i++) {
    const prevDate = new Date(sortedPurchases[i - 1].purchase_date);
    const currDate = new Date(sortedPurchases[i].purchase_date);
    const daysBetween = (currDate.getTime() - prevDate.getTime()) / (1000 * 60 * 60 * 24);

    totalDays += daysBetween;
    intervals++;
  }

  const averageDaysBetween = totalDays / intervals;

  // Add average interval to most recent purchase date
  const lastPurchaseDate = new Date(sortedPurchases[sortedPurchases.length - 1].purchase_date);
  const nextPurchaseDate = new Date(lastPurchaseDate);
  nextPurchaseDate.setDate(nextPurchaseDate.getDate() + Math.round(averageDaysBetween));

  logger.debug('Next purchase predicted', {
    averageDaysBetween: averageDaysBetween.toFixed(1),
    lastPurchaseDate: lastPurchaseDate.toISOString(),
    nextPurchaseDate: nextPurchaseDate.toISOString(),
  });

  return nextPurchaseDate;
}

/**
 * Calculate price per pen/vial
 * @param totalPriceCents - Total price in cents
 * @param quantity - Number of pens/vials
 * @returns Price per pen in cents
 */
export function calculatePricePerPen(totalPriceCents: number, quantity: number): number {
  if (quantity === 0) {
    logger.warn('Division by zero in price per pen calculation');
    return 0;
  }

  return Math.round(totalPriceCents / quantity);
}

/**
 * Get purchase summary statistics
 * @param purchases - Array of purchases
 * @param startWeight - Starting weight in kg (optional)
 * @param currentWeight - Current weight in kg (optional)
 * @param financeOptIn - Whether user opted in to see R$/kg metric
 * @returns Summary object with all metrics
 */
export interface PurchaseSummary {
  totalSpent: number; // in cents
  weeklySpent: number; // in cents
  costPerKg: number | null; // in cents, null if not available
  nextPurchaseDate: Date | null;
  purchaseCount: number;
  totalPens: number;
}

export function getPurchaseSummary(
  purchases: Purchase[],
  startWeight: number | null = null,
  currentWeight: number | null = null,
  financeOptIn: boolean = false
): PurchaseSummary {
  const totalSpent = calculateTotalSpent(purchases);
  const weeklySpent = calculateWeeklySpent(purchases);
  const nextPurchaseDate = predictNextPurchase(purchases);

  // Only calculate cost per kg if user opted in
  const costPerKg = financeOptIn
    ? calculateCostPerKg(purchases, startWeight, currentWeight)
    : null;

  // Calculate total pens purchased
  const totalPens = purchases.reduce((sum, p) => sum + p.quantity, 0);

  return {
    totalSpent,
    weeklySpent,
    costPerKg,
    nextPurchaseDate,
    purchaseCount: purchases.length,
    totalPens,
  };
}
