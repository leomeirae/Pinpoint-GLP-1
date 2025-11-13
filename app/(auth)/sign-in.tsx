import { useState } from 'react';
import { View, Text, StyleSheet, KeyboardAvoidingView, Platform } from 'react-native';
import { useSignIn } from '@clerk/clerk-expo';
import { useRouter } from 'expo-router';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { GoogleOAuthButton } from '@/components/auth/GoogleOAuthButton';
import { useColors } from '@/constants/colors';

export default function SignInScreen() {
  const colors = useColors();
  const { signIn, setActive, isLoaded } = useSignIn();
  const router = useRouter();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSignIn = async () => {
    if (!isLoaded) return;

    setLoading(true);
    setError('');

    try {
      const result = await signIn.create({
        identifier: email,
        password,
      });

      if (result.status === 'complete') {
        await setActive({ session: result.createdSessionId });
        // Aguardar um pouco para garantir que o usuário foi sincronizado
        await new Promise((resolve) => setTimeout(resolve, 500));
        // O index.tsx vai verificar o estado e redirecionar corretamente
        // Usar router.push para voltar ao index que decide o destino
        router.push('/');
      }
    } catch (err: any) {
      setError(err.errors?.[0]?.message || 'Erro ao fazer login');
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
        <Text style={styles.title}>Bem-vindo de volta!</Text>
        <Text style={styles.subtitle}>Entre na sua conta</Text>

        <View style={styles.form}>
          <GoogleOAuthButton mode="signin" />

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

          <Button label="Entrar" onPress={handleSignIn} loading={loading} />

          <Button
            label="Criar nova conta"
            onPress={() => router.push('/(auth)/sign-up')}
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
