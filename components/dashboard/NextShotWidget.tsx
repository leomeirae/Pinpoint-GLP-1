import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useShotsyColors } from '@/hooks/useShotsyColors';
import { ShotsyCard } from '@/components/ui/shotsy-card';
import { ShotsyCircularProgress } from '@/components/ui/shotsy-circular-progress';
import { ShotsyButton } from '@/components/ui/shotsy-button';
import { router } from 'expo-router';

interface NextShotWidgetProps {
  totalShots: number;
  nextShotDate?: Date;
  lastShotDate?: Date;
  frequency?: 'weekly' | 'biweekly' | string;
}

interface WidgetState {
  title: string;
  subtitle: string;
  buttonText: string | null;
  progress: number;
  emoji: string;
  onButtonPress?: () => void;
}

export function NextShotWidget({
  totalShots,
  nextShotDate,
  lastShotDate,
  frequency = 'weekly',
}: NextShotWidgetProps) {
  const colors = useShotsyColors();

  // Calcular estado do widget
  const getWidgetState = (): WidgetState => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    // 1. WELCOME STATE - No injections yet
    if (totalShots === 0) {
      return {
        title: 'Bem-vindo!',
        subtitle: 'Adicione sua primeira\ninjeção para começar.',
        buttonText: 'Adicionar Injeção',
        progress: 0,
        emoji: '💉',
        onButtonPress: () => router.push('/(tabs)/add-application'),
      };
    }

    // 2. SUCCESS STATE - Injection taken today
    if (lastShotDate) {
      const lastShot = new Date(lastShotDate);
      lastShot.setHours(0, 0, 0, 0);

      if (lastShot.getTime() === today.getTime()) {
        const timeString = lastShotDate.toLocaleTimeString('pt-BR', {
          hour: '2-digit',
          minute: '2-digit'
        });

        return {
          title: 'Você conseguiu!',
          subtitle: `Injeção tomada hoje às ${timeString}`,
          buttonText: 'Editar aplicação',
          progress: 1,
          emoji: '✅',
          onButtonPress: () => {
            // Navigate to edit mode - will be implemented in next task
            router.push('/(tabs)/add-application');
          },
        };
      }
    }

    // From here, we need nextShotDate calculated
    if (!nextShotDate) {
      return {
        title: 'Configure seu perfil',
        subtitle: 'Defina a frequência das injeções',
        buttonText: 'Ir para Configurações',
        progress: 0,
        emoji: '⚙️',
        onButtonPress: () => router.push('/(tabs)/settings'),
      };
    }

    const nextShot = new Date(nextShotDate);
    nextShot.setHours(0, 0, 0, 0);

    const diffTime = nextShot.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    // 5. OVERDUE STATE - Past due date
    if (diffDays < 0) {
      const daysOverdue = Math.abs(diffDays);

      return {
        title: 'Injeção atrasada!',
        subtitle: `${daysOverdue} ${daysOverdue === 1 ? 'dia' : 'dias'} de atraso`,
        buttonText: 'Adicionar Injeção',
        progress: 0,
        emoji: '⚠️',
        onButtonPress: () => router.push('/(tabs)/add-application'),
      };
    }

    // 3. SHOT DAY STATE - Today is injection day
    if (diffDays === 0) {
      const dateString = today.toLocaleDateString('pt-BR', {
        day: 'numeric',
        month: 'long',
      });

      return {
        title: "It's shot day!",
        subtitle: dateString,
        buttonText: 'Marcar como tomada',
        progress: 0.75,
        emoji: '💉',
        onButtonPress: () => router.push('/(tabs)/add-application'),
      };
    }

    // 4. COUNTDOWN STATE - X days until next shot
    // Calculate progress based on frequency
    let totalDays = 7; // Default weekly

    if (frequency?.toLowerCase().includes('biweekly') || frequency?.toLowerCase().includes('bi-weekly')) {
      totalDays = 14;
    } else if (frequency?.toLowerCase().includes('daily')) {
      totalDays = 1;
    }

    // Calculate days passed since last shot
    let daysPassed = 0;
    if (lastShotDate) {
      const lastShot = new Date(lastShotDate);
      lastShot.setHours(0, 0, 0, 0);
      daysPassed = Math.floor((today.getTime() - lastShot.getTime()) / (1000 * 60 * 60 * 24));
    }

    // Calculate progress (0 to 1)
    const progress = totalDays > 0 ? Math.min(1, daysPassed / totalDays) : 0;

    return {
      title: `${diffDays} ${diffDays === 1 ? 'dia' : 'dias'}`,
      subtitle: 'até a próxima injeção',
      buttonText: diffDays <= 1 ? 'Adicionar Injeção' : null,
      progress,
      emoji: '📅',
      onButtonPress: diffDays <= 1 ? () => router.push('/(tabs)/add-application') : undefined,
    };
  };

  const state = getWidgetState();

  return (
    <View style={styles.container}>
      <Text style={[styles.title, { color: colors.text }]}>Próxima Injeção</Text>

      <ShotsyCard style={styles.card}>
        <ShotsyCircularProgress size={240} progress={state.progress}>
          <View style={styles.content}>
            {/* Emoji indicator */}
            <Text style={styles.emoji}>{state.emoji}</Text>

            <Text style={[styles.widgetTitle, { color: colors.text }]}>
              {state.title}
            </Text>
            <Text style={[styles.widgetSubtitle, { color: colors.textSecondary }]}>
              {state.subtitle}
            </Text>

            {state.buttonText && state.onButtonPress && (
              <ShotsyButton
                title={state.buttonText}
                onPress={state.onButtonPress}
                size="medium"
                style={styles.button}
              />
            )}
          </View>
        </ShotsyCircularProgress>
      </ShotsyCard>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: 24,
  },
  title: {
    fontSize: 20,
    fontWeight: '700',
    marginBottom: 12,
  },
  card: {
    padding: 24,
    alignItems: 'center',
  },
  content: {
    alignItems: 'center',
    gap: 8,
  },
  emoji: {
    fontSize: 36,
    marginBottom: 4,
  },
  widgetTitle: {
    fontSize: 28,
    fontWeight: '700',
    textAlign: 'center',
  },
  widgetSubtitle: {
    fontSize: 14,
    textAlign: 'center',
    lineHeight: 20,
  },
  button: {
    marginTop: 8,
  },
});
