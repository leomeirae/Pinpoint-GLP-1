import { useState } from 'react';
import { View, Text, StyleSheet, KeyboardAvoidingView, Platform } from 'react-native';
import { useSignUp } from '@clerk/clerk-expo';
import { useRouter } from 'expo-router';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { GoogleOAuthButton } from '@/components/auth/GoogleOAuthButton';
import { useColors } from '@/constants/colors';

export default function SignUpScreen() {
  const colors = useColors();
  const { signUp, isLoaded } = useSignUp();
  const router = useRouter();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSignUp = async () => {
    if (!isLoaded) return;

    setLoading(true);
    setError('');

    try {
      await signUp.create({
        emailAddress: email,
        password,
      });

      // Enviar código de verificação
      await signUp.prepareEmailAddressVerification({ strategy: 'email_code' });

      // Redirecionar para tela de verificação
      router.push('/(auth)/verify-email');
    } catch (err: any) {
      setError(err.errors?.[0]?.message || 'Erro ao criar conta');
    } finally {
      setLoading(false);
    }
  };

  const styles = getStyles(colors);

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.container}
    >
      <View style={styles.content}>
        <Text style={styles.title}>Crie sua conta</Text>
        <Text style={styles.subtitle}>Comece a acompanhar seu progresso</Text>

        <View style={styles.form}>
          <GoogleOAuthButton mode="signup" />

          {/* Divider */}
          <View style={styles.divider}>
            <View style={styles.dividerLine} />
            <Text style={styles.dividerText}>OU</Text>
            <View style={styles.dividerLine} />
          </View>

          <Input
            label="Email"
            placeholder="seu@email.com"
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            autoCapitalize="none"
            autoComplete="email"
          />

          <Input
            label="Senha"
            placeholder="••••••••"
            value={password}
            onChangeText={setPassword}
            secureTextEntry
            autoComplete="password"
          />

          {error && <Text style={styles.errorText}>{error}</Text>}

          <Button label="Criar Conta" onPress={handleSignUp} loading={loading} />

          <Button
            label="Já tenho conta"
            onPress={() => router.push('/(auth)/sign-in')}
            variant="outline"
          />
        </View>
      </View>
    </KeyboardAvoidingView>
  );
}

const getStyles = (colors: any) =>
  StyleSheet.create({
    container: {
      backgroundColor: colors.background,
      flex: 1,
    },
    content: {
      flex: 1,
      justifyContent: 'center',
      padding: 24,
    },
    divider: {
      alignItems: 'center',
      flexDirection: 'row',
      marginVertical: 24,
    },
    dividerLine: {
      backgroundColor: colors.border,
      flex: 1,
      height: 1,
    },
    dividerText: {
      color: colors.textMuted,
      fontSize: 14,
      fontWeight: '600',
      marginHorizontal: 16,
    },
    errorText: {
      color: colors.error,
      fontSize: 14,
      textAlign: 'center',
    },
    form: {
      gap: 16,
    },
    subtitle: {
      color: colors.textSecondary,
      fontSize: 16,
      marginBottom: 32,
    },
    title: {
      color: colors.text,
      fontSize: 32,
      fontWeight: 'bold',
      marginBottom: 8,
    },
  });
