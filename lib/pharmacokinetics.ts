/**
 * Pharmacokinetics Library for Mounjaro (Tirzepatide)
 *
 * This library calculates estimated medication levels based on injection history
 * and the half-life of tirzepatide (~5 days / 120 hours).
 *
 * Key Formula: C(t) = C0 * (0.5)^(t/t½)
 * Where:
 * - C(t) = concentration at time t
 * - C0 = initial concentration (dose)
 * - t = time elapsed
 * - t½ = half-life (120 hours for tirzepatide)
 */

export interface MedicationApplication {
  dose: number; // in mg
  date: Date;
}

export interface EstimatedLevel {
  date: Date;
  level: number; // in mg
}

// Constants
const HALF_LIFE_HOURS = 120; // 5 days

/**
 * Calculates the medication level from a single dose at a given time
 * @param dose - Initial dose in mg
 * @param hoursElapsed - Time elapsed since dose in hours
 * @returns Estimated level in mg
 */
export function calculateSingleDoseLevel(dose: number, hoursElapsed: number): number {
  if (dose < 0 || hoursElapsed < 0) {
    return 0;
  }

  // C(t) = C0 * (0.5)^(t/t½)
  const level = dose * Math.pow(0.5, hoursElapsed / HALF_LIFE_HOURS);
  return Math.max(0, level); // Ensure no negative values
}

/**
 * Calculates estimated medication levels over time considering multiple applications
 * @param applications - Array of medication applications (dose and date)
 * @param startDate - Start date for calculation (defaults to earliest application)
 * @param endDate - End date for calculation (defaults to now + 14 days)
 * @param intervalHours - Interval between data points in hours (default: 24)
 * @returns Array of estimated levels over time
 */
export function calculateEstimatedLevels(
  applications: MedicationApplication[],
  startDate?: Date,
  endDate?: Date,
  intervalHours: number = 24
): EstimatedLevel[] {
  if (applications.length === 0) {
    return [];
  }

  // Sort applications by date
  const sortedApplications = [...applications].sort(
    (a, b) => a.date.getTime() - b.date.getTime()
  );

  // Set default date range
  const start = startDate || sortedApplications[0].date;
  const end = endDate || new Date(Date.now() + 14 * 24 * 60 * 60 * 1000); // 14 days from now

  const results: EstimatedLevel[] = [];

  // Generate data points at specified intervals
  let currentDate = new Date(start);
  while (currentDate <= end) {
    const totalLevel = applications.reduce((sum, app) => {
      const hoursElapsed = (currentDate.getTime() - app.date.getTime()) / (1000 * 60 * 60);

      // Only consider applications that have already occurred
      if (hoursElapsed >= 0) {
        return sum + calculateSingleDoseLevel(app.dose, hoursElapsed);
      }
      return sum;
    }, 0);

    results.push({
      date: new Date(currentDate),
      level: totalLevel
    });

    // Move to next interval
    currentDate = new Date(currentDate.getTime() + intervalHours * 60 * 60 * 1000);
  }

  return results;
}

/**
 * Returns the current estimated medication level
 * @param applications - Array of medication applications
 * @param currentDate - Date to calculate level for (defaults to now)
 * @returns Current estimated level in mg
 */
export function getCurrentEstimatedLevel(
  applications: MedicationApplication[],
  currentDate: Date = new Date()
): number {
  if (applications.length === 0) {
    return 0;
  }

  const totalLevel = applications.reduce((sum, app) => {
    const hoursElapsed = (currentDate.getTime() - app.date.getTime()) / (1000 * 60 * 60);

    // Only consider applications that have already occurred
    if (hoursElapsed >= 0) {
      return sum + calculateSingleDoseLevel(app.dose, hoursElapsed);
    }
    return sum;
  }, 0);

  return totalLevel;
}

/**
 * Calculates the next recommended injection date based on:
 * - Current medication level
 * - Target minimum level (typically 25% of dose)
 * - Recommended weekly interval
 *
 * @param applications - Array of medication applications
 * @param recommendedIntervalDays - Recommended days between shots (default: 7)
 * @param targetMinimumLevel - Minimum acceptable level as % of last dose (default: 0.25)
 * @returns Next recommended injection date
 */
export function calculateNextShotDate(
  applications: MedicationApplication[],
  recommendedIntervalDays: number = 7,
  targetMinimumLevel: number = 0.25
): Date | null {
  if (applications.length === 0) {
    return null;
  }

  // Sort applications by date to find the last one
  const sortedApplications = [...applications].sort(
    (a, b) => b.date.getTime() - a.date.getTime()
  );

  const lastApplication = sortedApplications[0];

  // Primary method: Use recommended interval from last shot
  const recommendedDate = new Date(
    lastApplication.date.getTime() + recommendedIntervalDays * 24 * 60 * 60 * 1000
  );

  // Secondary check: Ensure level doesn't drop too low
  // Calculate when level from last dose drops to minimum threshold
  const lastDose = lastApplication.dose;
  const minimumLevel = lastDose * targetMinimumLevel;

  // Solve: minimumLevel = lastDose * (0.5)^(t/120)
  // t = 120 * log(minimumLevel/lastDose) / log(0.5)
  const hoursToMinimum = HALF_LIFE_HOURS * Math.log(minimumLevel / lastDose) / Math.log(0.5);
  const minimumLevelDate = new Date(
    lastApplication.date.getTime() + hoursToMinimum * 60 * 60 * 1000
  );

  // Return the earlier of the two dates (more conservative approach)
  // This ensures we don't wait too long if levels drop quickly
  return recommendedDate < minimumLevelDate ? recommendedDate : minimumLevelDate;
}

/**
 * Calculates the percentage of medication remaining from the last dose
 * @param applications - Array of medication applications
 * @param currentDate - Date to calculate percentage for (defaults to now)
 * @returns Percentage remaining (0-100)
 */
export function calculatePercentageRemaining(
  applications: MedicationApplication[],
  currentDate: Date = new Date()
): number {
  if (applications.length === 0) {
    return 0;
  }

  const currentLevel = getCurrentEstimatedLevel(applications, currentDate);

  // Sort to find last application
  const sortedApplications = [...applications].sort(
    (a, b) => b.date.getTime() - a.date.getTime()
  );

  const lastDose = sortedApplications[0].dose;

  if (lastDose === 0) {
    return 0;
  }

  const percentage = (currentLevel / lastDose) * 100;
  return Math.min(100, Math.max(0, percentage)); // Clamp between 0-100
}

/**
 * Gets the time until the next recommended shot
 * @param applications - Array of medication applications
 * @param recommendedIntervalDays - Recommended days between shots (default: 7)
 * @returns Object with days, hours, and total hours until next shot
 */
export function getTimeUntilNextShot(
  applications: MedicationApplication[],
  recommendedIntervalDays: number = 7
): { days: number; hours: number; totalHours: number } | null {
  const nextShotDate = calculateNextShotDate(applications, recommendedIntervalDays);

  if (!nextShotDate) {
    return null;
  }

  const now = new Date();
  const diffMs = nextShotDate.getTime() - now.getTime();
  const totalHours = diffMs / (1000 * 60 * 60);

  const days = Math.floor(totalHours / 24);
  const hours = Math.floor(totalHours % 24);

  return {
    days,
    hours,
    totalHours
  };
}
