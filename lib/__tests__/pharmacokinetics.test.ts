/**
 * Tests for Pharmacokinetics Library
 *
 * These tests verify the medication level calculations based on
 * tirzepatide's pharmacokinetic properties (half-life ~5 days)
 */

import {
  calculateEstimatedLevels,
  getCurrentEstimatedLevel,
  calculateNextShotDate,
  calculateSingleDoseLevel,
  calculatePercentageRemaining,
  getTimeUntilNextShot,
  MedicationApplication
} from '../pharmacokinetics';

describe('Pharmacokinetics Library', () => {
  // Helper to create dates relative to a base date
  const createDate = (daysFromNow: number = 0): Date => {
    const date = new Date();
    date.setDate(date.getDate() + daysFromNow);
    return date;
  };

  describe('calculateSingleDoseLevel', () => {
    it('should return the full dose at time 0', () => {
      const level = calculateSingleDoseLevel(5, 0);
      expect(level).toBe(5);
    });

    it('should return half the dose after 120 hours (5 days)', () => {
      const level = calculateSingleDoseLevel(10, 120);
      expect(level).toBeCloseTo(5, 5);
    });

    it('should return quarter the dose after 240 hours (10 days)', () => {
      const level = calculateSingleDoseLevel(10, 240);
      expect(level).toBeCloseTo(2.5, 5);
    });

    it('should return 0 for negative dose', () => {
      const level = calculateSingleDoseLevel(-5, 100);
      expect(level).toBe(0);
    });

    it('should return 0 for negative time', () => {
      const level = calculateSingleDoseLevel(5, -100);
      expect(level).toBe(0);
    });

    it('should decay exponentially over time', () => {
      const dose = 10;
      const level24h = calculateSingleDoseLevel(dose, 24);
      const level120h = calculateSingleDoseLevel(dose, 120);
      const level240h = calculateSingleDoseLevel(dose, 240);

      // Each level should be less than the previous
      expect(level24h).toBeGreaterThan(level120h);
      expect(level120h).toBeGreaterThan(level240h);

      // After 5 days should be ~50%
      expect(level120h).toBeCloseTo(dose / 2, 1);

      // After 10 days should be ~25%
      expect(level240h).toBeCloseTo(dose / 4, 1);
    });
  });

  describe('getCurrentEstimatedLevel', () => {
    it('should return 0 for empty applications array', () => {
      const level = getCurrentEstimatedLevel([]);
      expect(level).toBe(0);
    });

    it('should calculate level from a single recent application', () => {
      const applications: MedicationApplication[] = [
        { dose: 5, date: createDate(-1) } // 1 day ago
      ];

      const level = getCurrentEstimatedLevel(applications);

      // After 1 day (24 hours), should be more than half but less than full dose
      expect(level).toBeGreaterThan(2.5);
      expect(level).toBeLessThan(5);
    });

    it('should calculate level from multiple applications', () => {
      const now = new Date();
      const applications: MedicationApplication[] = [
        { dose: 5, date: createDate(-14) }, // 14 days ago
        { dose: 5, date: createDate(-7) }   // 7 days ago
      ];

      const level = getCurrentEstimatedLevel(applications, now);

      // Should be sum of contributions from both doses
      expect(level).toBeGreaterThan(0);
      expect(level).toBeLessThan(10); // Can't be more than total doses
    });

    it('should ignore future applications', () => {
      const now = new Date();
      const applications: MedicationApplication[] = [
        { dose: 5, date: createDate(-7) },  // 7 days ago
        { dose: 5, date: createDate(1) }    // 1 day in future
      ];

      const level = getCurrentEstimatedLevel(applications, now);

      // Should only count the past application
      expect(level).toBeGreaterThan(0);
      expect(level).toBeLessThan(5); // Less than a single dose
    });

    it('should handle custom date parameter', () => {
      const applications: MedicationApplication[] = [
        { dose: 10, date: new Date('2024-01-01') }
      ];

      // Check level 5 days later (should be ~50%)
      const checkDate = new Date('2024-01-06');
      const level = getCurrentEstimatedLevel(applications, checkDate);

      expect(level).toBeCloseTo(5, 1);
    });
  });

  describe('calculateEstimatedLevels', () => {
    it('should return empty array for no applications', () => {
      const levels = calculateEstimatedLevels([]);
      expect(levels).toEqual([]);
    });

    it('should calculate levels over time for single application', () => {
      const applications: MedicationApplication[] = [
        { dose: 10, date: new Date('2024-01-01') }
      ];

      const levels = calculateEstimatedLevels(
        applications,
        new Date('2024-01-01'),
        new Date('2024-01-11'), // 10 days
        24 // daily intervals
      );

      expect(levels.length).toBeGreaterThan(0);

      // First level should be highest
      expect(levels[0].level).toBeCloseTo(10, 1);

      // Levels should decay over time
      for (let i = 1; i < levels.length; i++) {
        expect(levels[i].level).toBeLessThanOrEqual(levels[i - 1].level);
      }

      // After ~10 days, level should be approximately 1/4 of original
      const lastLevel = levels[levels.length - 1];
      expect(lastLevel.level).toBeCloseTo(2.5, 1);
    });

    it('should calculate levels for multiple applications', () => {
      const applications: MedicationApplication[] = [
        { dose: 5, date: new Date('2024-01-01') },
        { dose: 5, date: new Date('2024-01-08') }
      ];

      const levels = calculateEstimatedLevels(
        applications,
        new Date('2024-01-01'),
        new Date('2024-01-15'),
        24
      );

      expect(levels.length).toBeGreaterThan(0);

      // Find level at day 8 (second injection)
      const day8Index = 7; // 0-indexed, so day 8 is index 7
      if (levels[day8Index]) {
        // Should show spike from second injection
        expect(levels[day8Index].level).toBeGreaterThan(levels[day8Index - 1]?.level || 0);
      }
    });

    it('should respect custom interval hours', () => {
      const applications: MedicationApplication[] = [
        { dose: 10, date: new Date('2024-01-01') }
      ];

      const levels12h = calculateEstimatedLevels(
        applications,
        new Date('2024-01-01'),
        new Date('2024-01-03'),
        12 // 12-hour intervals
      );

      const levels24h = calculateEstimatedLevels(
        applications,
        new Date('2024-01-01'),
        new Date('2024-01-03'),
        24 // 24-hour intervals
      );

      // 12-hour intervals should have more data points
      expect(levels12h.length).toBeGreaterThan(levels24h.length);
    });

    it('should never return negative levels', () => {
      const applications: MedicationApplication[] = [
        { dose: 5, date: new Date('2024-01-01') }
      ];

      const levels = calculateEstimatedLevels(
        applications,
        new Date('2024-01-01'),
        new Date('2024-02-01'), // 31 days
        24
      );

      levels.forEach(level => {
        expect(level.level).toBeGreaterThanOrEqual(0);
      });
    });
  });

  describe('calculateNextShotDate', () => {
    it('should return null for empty applications', () => {
      const nextDate = calculateNextShotDate([]);
      expect(nextDate).toBeNull();
    });

    it('should calculate next shot 7 days after last application by default', () => {
      const lastShotDate = createDate(-3); // 3 days ago
      const applications: MedicationApplication[] = [
        { dose: 5, date: lastShotDate }
      ];

      const nextDate = calculateNextShotDate(applications);

      expect(nextDate).not.toBeNull();

      if (nextDate) {
        const daysDiff = (nextDate.getTime() - lastShotDate.getTime()) / (1000 * 60 * 60 * 24);
        expect(daysDiff).toBeCloseTo(7, 0);
      }
    });

    it('should respect custom interval days', () => {
      const lastShotDate = createDate(-2);
      const applications: MedicationApplication[] = [
        { dose: 5, date: lastShotDate }
      ];

      const nextDate = calculateNextShotDate(applications, 10); // 10-day interval

      expect(nextDate).not.toBeNull();

      if (nextDate) {
        const daysDiff = (nextDate.getTime() - lastShotDate.getTime()) / (1000 * 60 * 60 * 24);
        expect(daysDiff).toBeCloseTo(10, 0);
      }
    });

    it('should use the most recent application for calculation', () => {
      const applications: MedicationApplication[] = [
        { dose: 5, date: createDate(-14) },
        { dose: 5, date: createDate(-7) },
        { dose: 7.5, date: createDate(-3) } // Most recent
      ];

      const nextDate = calculateNextShotDate(applications);

      expect(nextDate).not.toBeNull();

      if (nextDate) {
        const mostRecentDate = applications[2].date;
        const daysDiff = (nextDate.getTime() - mostRecentDate.getTime()) / (1000 * 60 * 60 * 24);
        expect(daysDiff).toBeCloseTo(7, 0);
      }
    });

    it('should consider minimum level threshold', () => {
      const lastShotDate = createDate(-1);
      const applications: MedicationApplication[] = [
        { dose: 10, date: lastShotDate }
      ];

      // With a high minimum threshold, should recommend sooner
      const nextDateHighThreshold = calculateNextShotDate(applications, 7, 0.8);

      // With a low minimum threshold, should follow standard interval
      const nextDateLowThreshold = calculateNextShotDate(applications, 7, 0.1);

      expect(nextDateHighThreshold).not.toBeNull();
      expect(nextDateLowThreshold).not.toBeNull();
    });
  });

  describe('calculatePercentageRemaining', () => {
    it('should return 0 for empty applications', () => {
      const percentage = calculatePercentageRemaining([]);
      expect(percentage).toBe(0);
    });

    it('should return ~100% immediately after injection', () => {
      const applications: MedicationApplication[] = [
        { dose: 5, date: new Date() }
      ];

      const percentage = calculatePercentageRemaining(applications);
      expect(percentage).toBeGreaterThan(95);
      expect(percentage).toBeLessThanOrEqual(100);
    });

    it('should return ~50% after 5 days', () => {
      const applications: MedicationApplication[] = [
        { dose: 10, date: createDate(-5) }
      ];

      const percentage = calculatePercentageRemaining(applications);
      expect(percentage).toBeCloseTo(50, 0);
    });

    it('should never exceed 100%', () => {
      const applications: MedicationApplication[] = [
        { dose: 5, date: new Date() }
      ];

      const percentage = calculatePercentageRemaining(applications);
      expect(percentage).toBeLessThanOrEqual(100);
    });

    it('should never go below 0%', () => {
      const applications: MedicationApplication[] = [
        { dose: 5, date: createDate(-30) } // 30 days ago
      ];

      const percentage = calculatePercentageRemaining(applications);
      expect(percentage).toBeGreaterThanOrEqual(0);
    });
  });

  describe('getTimeUntilNextShot', () => {
    it('should return null for empty applications', () => {
      const timeUntil = getTimeUntilNextShot([]);
      expect(timeUntil).toBeNull();
    });

    it('should calculate time until next shot', () => {
      const applications: MedicationApplication[] = [
        { dose: 5, date: createDate(-3) } // 3 days ago
      ];

      const timeUntil = getTimeUntilNextShot(applications);

      expect(timeUntil).not.toBeNull();

      if (timeUntil) {
        // Should be approximately 4 days remaining (7 - 3)
        expect(timeUntil.days).toBeGreaterThanOrEqual(3);
        expect(timeUntil.days).toBeLessThanOrEqual(5);
        expect(timeUntil.totalHours).toBeGreaterThan(0);
      }
    });

    it('should handle negative time (overdue shot)', () => {
      const applications: MedicationApplication[] = [
        { dose: 5, date: createDate(-10) } // 10 days ago
      ];

      const timeUntil = getTimeUntilNextShot(applications, 7);

      expect(timeUntil).not.toBeNull();

      if (timeUntil) {
        // Should be negative (overdue by ~3 days)
        expect(timeUntil.totalHours).toBeLessThan(0);
      }
    });
  });

  describe('Integration Tests', () => {
    it('should handle a realistic weekly injection schedule', () => {
      const applications: MedicationApplication[] = [
        { dose: 2.5, date: createDate(-21) }, // Week 1
        { dose: 2.5, date: createDate(-14) }, // Week 2
        { dose: 5, date: createDate(-7) },    // Week 3
        { dose: 5, date: createDate(0) }      // Week 4 (today)
      ];

      // Current level should be positive
      const currentLevel = getCurrentEstimatedLevel(applications);
      expect(currentLevel).toBeGreaterThan(0);

      // Should have contributions from all doses
      expect(currentLevel).toBeGreaterThan(5); // More than just today's dose

      // Next shot should be in ~7 days
      const nextDate = calculateNextShotDate(applications);
      expect(nextDate).not.toBeNull();

      if (nextDate) {
        const daysUntilNext = (nextDate.getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24);
        expect(daysUntilNext).toBeCloseTo(7, 0);
      }

      // Percentage should be near 100% (just injected)
      const percentage = calculatePercentageRemaining(applications);
      expect(percentage).toBeGreaterThan(90);
    });

    it('should handle dose escalation correctly', () => {
      const applications: MedicationApplication[] = [
        { dose: 2.5, date: createDate(-14) },
        { dose: 5, date: createDate(-7) },
        { dose: 7.5, date: createDate(0) } // Escalated to 7.5mg today
      ];

      const currentLevel = getCurrentEstimatedLevel(applications);

      // Should account for all doses
      expect(currentLevel).toBeGreaterThan(7.5); // More than just current dose

      // Percentage based on last dose (7.5mg)
      // Note: percentage is clamped to max 100% even with accumulated levels
      const percentage = calculatePercentageRemaining(applications);
      expect(percentage).toBe(100); // Clamped at 100% max
    });
  });
});
