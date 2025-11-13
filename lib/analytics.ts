// lib/analytics.ts
// Sistema de Analytics para tracking de eventos

import AsyncStorage from '@react-native-async-storage/async-storage';
import { logger } from './logger';
import { supabase } from './supabase';

// Tipos de eventos conforme TRACKING-EVENTS-SPEC.md
export type AnalyticsEvent =
  // Onboarding
  | 'onboarding_started'
  | 'onboarding_step_viewed'
  | 'onboarding_step_completed'
  | 'onboarding_step_next'
  | 'onboarding_step_back'
  | 'onboarding_step_skipped'
  | 'onboarding_consent_accepted'
  | 'onboarding_completed'
  | 'onboarding_abandoned'
  // Paywall
  | 'paywall_viewed'
  | 'paywall_impression'
  | 'trial_start'
  | 'trial_started'
  | 'trial_convert'
  | 'trial_cancel'
  | 'trial_expire'
  | 'trial_expired'
  | 'paywall_subscription_started'
  | 'paywall_dismissed'
  | 'premium_feature_accessed'
  | 'premium_feature_blocked'
  // FAQ
  | 'faq_viewed'
  | 'faq_searched'
  | 'faq_question_opened'
  // Application
  | 'application_create_started'
  | 'application_create_completed'
  | 'application_create_failed'
  | 'application_edited'
  | 'application_deleted'
  // Navigation
  | 'screen_viewed'
  | 'tab_changed'
  // Errors
  | 'error_occurred'
  | 'error_retry_attempted'
  // Engagement
  | 'app_opened'
  | 'app_backgrounded'
  | 'pull_to_refresh'
  // Carousel
  | 'carousel_view'
  | 'carousel_slide_view'
  | 'welcome_carousel_next'
  | 'cta_start_click'
  | 'legal_open'
  // Authentication
  | 'oauth_login_started'
  | 'oauth_login_complete'
  | 'oauth_login_failed'
  | 'auth_guard_evaluation'
  | 'user_sync_started'
  | 'user_sync_complete'
  | 'user_sync_failed'
  | 'sign_out_started'
  | 'sign_out_complete'
  | 'account_deletion_started'
  | 'account_deletion_complete'
  | 'account_deletion_failed';

/**
 * Propriedades tipadas para eventos de analytics
 * Suporta tipos primitivos e objetos simples
 */
export interface AnalyticsProperties {
  screen_name?: string;
  user_id?: string;
  timestamp?: string;
  step_name?: string;
  step_index?: number;
  error_message?: string;
  feature_name?: string;
  [key: string]: string | number | boolean | undefined | null;
}

// Para desenvolvimento: apenas log no console
// Em produção: integrar com serviço de analytics (Segment, Amplitude, etc.)
const ENABLE_ANALYTICS = true; // Mudar para false em dev se necessário

const analyticsLogger = logger.createChild('Analytics');

// AsyncStorage key for analytics opt-in
const ANALYTICS_OPT_IN_KEY = '@pinpoint:analytics_opt_in';

// In-memory cache for performance (avoid AsyncStorage reads on every event)
let analyticsOptInCache: boolean | null = null;

/**
 * Get analytics opt-in status from AsyncStorage
 * Uses in-memory cache for performance
 * CRITICAL: Defaults to FALSE for fail-safe compliance (LGPD/GDPR)
 */
export async function getAnalyticsOptIn(): Promise<boolean> {
  // Return cached value if available
  if (analyticsOptInCache !== null) {
    return analyticsOptInCache;
  }

  try {
    const value = await AsyncStorage.getItem(ANALYTICS_OPT_IN_KEY);

    // FAIL-SAFE: If no value is found, default to FALSE (opt-out)
    if (value === null) {
      analyticsOptInCache = false;
      analyticsLogger.debug('Analytics opt-in not found, defaulting to FALSE (fail-safe)');
      return false;
    }

    const optIn = value === 'true';
    analyticsOptInCache = optIn;
    analyticsLogger.debug('Analytics opt-in loaded from storage', { optIn });
    return optIn;
  } catch (error) {
    analyticsLogger.error('Error reading analytics opt-in, defaulting to FALSE', error);
    // FAIL-SAFE: On error, default to FALSE (opt-out)
    analyticsOptInCache = false;
    return false;
  }
}

/**
 * Set analytics opt-in status
 * Saves to both AsyncStorage and Supabase
 * Updates in-memory cache immediately
 */
export async function setAnalyticsOptIn(value: boolean): Promise<void> {
  try {
    // Update cache immediately
    analyticsOptInCache = value;

    // Save to AsyncStorage
    await AsyncStorage.setItem(ANALYTICS_OPT_IN_KEY, value.toString());
    analyticsLogger.info('Analytics opt-in saved to AsyncStorage', { value });

    // Save to Supabase (best effort - don't fail if offline)
    try {
      const { data: { user } } = await supabase.auth.getUser();

      if (user) {
        // Get user from users table
        const { data: userData } = await supabase
          .from('users')
          .select('id')
          .eq('clerk_id', user.id)
          .maybeSingle();

        if (userData) {
          await supabase
            .from('users')
            .update({ analytics_opt_in: value })
            .eq('id', userData.id);

          analyticsLogger.info('Analytics opt-in saved to Supabase', { value });
        }
      }
    } catch (supabaseError) {
      // Log but don't throw - offline mode should still work
      analyticsLogger.warn('Failed to save analytics opt-in to Supabase (offline?)', supabaseError);
    }
  } catch (error) {
    analyticsLogger.error('Error saving analytics opt-in', error);
    throw error;
  }
}

/**
 * Clear analytics opt-in cache
 * Should be called on logout or account deletion
 */
export function clearAnalyticsOptInCache(): void {
  analyticsOptInCache = null;
  analyticsLogger.debug('Analytics opt-in cache cleared');
}

/**
 * Track analytics event
 * CRITICAL: Checks opt-in status before sending events
 * - If opt-in = false: Only logs locally (console), NEVER sends to network
 * - If opt-in = true: Sends to analytics provider (when implemented)
 */
export async function trackEvent(
  event: AnalyticsEvent,
  properties?: AnalyticsProperties
): Promise<void> {
  if (!ENABLE_ANALYTICS) {
    return;
  }

  try {
    // CRITICAL: Check opt-in status before sending ANY data
    const optIn = await getAnalyticsOptIn();

    const timestamp = new Date().toISOString();
    const eventData = {
      event,
      timestamp,
      ...properties,
    };

    if (!optIn) {
      // Opt-in = false: ONLY log locally, NEVER send to network
      analyticsLogger.debug(`[OPT-OUT] Event blocked: ${event}`, eventData);
      return;
    }

    // Opt-in = true: Send to analytics provider
    analyticsLogger.debug(`[OPT-IN] Event: ${event}`, eventData);

    // TODO: Integrar com serviço de analytics
    // Exemplo:
    // await Segment.track(event, {
    //   timestamp,
    //   userId: getCurrentUserId(),
    //   ...properties,
    // });
  } catch (error) {
    analyticsLogger.error('Error tracking event', error);
  }
}

/**
 * Track screen view event
 * Convenience wrapper around trackEvent for screen views
 */
export async function trackScreen(
  screenName: string,
  properties?: AnalyticsProperties
): Promise<void> {
  await trackEvent('screen_viewed', {
    screen_name: screenName,
    ...properties,
  });
}

// Hook para uso em componentes React
export function useAnalytics() {
  return {
    trackEvent,
    trackScreen,
  };
}
