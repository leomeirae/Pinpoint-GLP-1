import React, { useCallback, useState } from 'react';
import { TouchableOpacity, Text, StyleSheet, ActivityIndicator, View } from 'react-native';
import { useSSO } from '@clerk/clerk-expo';
import { useRouter } from 'expo-router';
import * as AuthSession from 'expo-auth-session';
import { useWarmUpBrowser } from '@/hooks/useWarmUpBrowser';
import { useColors } from '@/constants/colors';
import { FontAwesome } from '@expo/vector-icons';
import { trackEvent } from '@/lib/analytics';

// Handle any pending authentication sessions
import * as WebBrowser from 'expo-web-browser';
import { createLogger } from '@/lib/logger';

const logger = createLogger('GoogleOAuthButton');
WebBrowser.maybeCompleteAuthSession();

interface GoogleOAuthButtonProps {
  mode?: 'signin' | 'signup';
}

export function GoogleOAuthButton({ mode = 'signin' }: GoogleOAuthButtonProps) {
  const colors = useColors();
  useWarmUpBrowser();

  const { startSSOFlow } = useSSO();
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const onPress = useCallback(async () => {
    try {
      setLoading(true);

      // Start the authentication process
      const { createdSessionId, setActive } = await startSSOFlow({
        strategy: 'oauth_google',
        // For native, you must pass a scheme
        redirectUrl: AuthSession.makeRedirectUri({}),
      });

      // If sign in was successful, set the active session
      if (createdSessionId) {
        await setActive!({
          session: createdSessionId,
          // Check for session tasks
          navigate: async ({ session }) => {
            if (session?.currentTask) {
              logger.debug('Session task', { task: session.currentTask });
              return;
            }
          },
        });

        // Wait for user creation in Supabase before navigation
        // This prevents race condition where user data isn't ready yet
        logger.info('OAuth successful, waiting for user sync');
        trackEvent('oauth_login_started', {
          provider: 'google',
          mode,
        });
        await new Promise((resolve) => setTimeout(resolve, 1500));

        // Navigate to root and let the root router decide based on onboarding status
        // This ensures new users are directed to onboarding, not dashboard
        logger.info('Redirecting to root for auth guard evaluation');
        trackEvent('oauth_login_complete', {
          provider: 'google',
          mode,
        });
        router.replace('/');
      } else {
        // If there is no createdSessionId, there are missing requirements
        logger.info('OAuth requires additional steps');
      }
    } catch (err: any) {
      logger.error('OAuth error', err as Error);

      // Tratar erros específicos
      if (err.errors && err.errors[0]) {
        const errorCode = err.errors[0].code;

        if (errorCode === 'not_allowed_access') {
          logger.error('Google account does not have access permission');
        } else if (errorCode === 'oauth_access_denied') {
          // Usuário cancelou o fluxo
          logger.info('User cancelled OAuth flow');
        } else {
          logger.error('Error logging in with Google', new Error(errorCode));
        }
      }
    } finally {
      setLoading(false);
    }
  }, [startSSOFlow, router]);

  const buttonText = mode === 'signin' ? 'Continuar com Google' : 'Cadastrar com Google';

  const styles = getStyles(colors);

  return (
    <TouchableOpacity
      style={styles.button}
      onPress={onPress}
      disabled={loading}
      activeOpacity={0.8}
    >
      {loading ? (
        <ActivityIndicator color={colors.text} />
      ) : (
        <View style={styles.content}>
          <FontAwesome name="google" size={24} color={colors.text} />
          <Text style={styles.text}>{buttonText}</Text>
        </View>
      )}
    </TouchableOpacity>
  );
}

const getStyles = (colors: any) =>
  StyleSheet.create({
    button: {
      alignItems: 'center',
      backgroundColor: colors.card,
      borderColor: colors.border,
      borderRadius: 12,
      borderWidth: 1,
      justifyContent: 'center',
      minHeight: 56,
      padding: 16,
    },
    content: {
      alignItems: 'center',
      flexDirection: 'row',
      gap: 12,
    },
    text: {
      color: colors.text,
      fontSize: 16,
      fontWeight: '600',
    },
  });
