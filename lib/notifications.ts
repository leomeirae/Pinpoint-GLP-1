import * as Notifications from 'expo-notifications';
import * as Device from 'expo-device';
import { Platform } from 'react-native';
import { createLogger } from '@/lib/logger';

const logger = createLogger('Notifications');

// Configurar comportamento padrão das notificações
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: true,
    shouldShowBanner: true,
    shouldShowList: true,
  }),
});

// Solicitar permissões
export async function registerForPushNotifications(): Promise<string | null> {
  if (!Device.isDevice) {
    logger.debug('Notificações só funcionam em dispositivos físicos');
    return null;
  }

  try {
    const { status: existingStatus } = await Notifications.getPermissionsAsync();
    let finalStatus = existingStatus;

    if (existingStatus !== 'granted') {
      const { status } = await Notifications.requestPermissionsAsync();
      finalStatus = status;
    }

    if (finalStatus !== 'granted') {
      logger.debug('Permissão de notificação negada');
      return null;
    }

    // Para iOS, configurar categorias
    if (Platform.OS === 'ios') {
      await Notifications.setNotificationCategoryAsync('weight_reminder', [
        {
          identifier: 'register_now',
          buttonTitle: 'Registrar Agora',
          options: { opensAppToForeground: true },
        },
        {
          identifier: 'later',
          buttonTitle: 'Mais Tarde',
          options: { opensAppToForeground: false },
        },
      ]);
    }

    return 'granted';
  } catch (error) {
    logger.error('Erro ao solicitar permissões:', error as Error);
    return null;
  }
}

// Cancelar todas as notificações
export async function cancelAllNotifications() {
  await Notifications.cancelAllScheduledNotificationsAsync();
}

// Agendar notificação de lembrete de peso
export async function scheduleWeightReminder(time: string, frequency: 'daily' | 'weekly') {
  // Cancelar lembretes anteriores de peso
  const scheduled = await Notifications.getAllScheduledNotificationsAsync();
  for (const notification of scheduled) {
    if (notification.content.data?.type === 'weight_reminder') {
      await Notifications.cancelScheduledNotificationAsync(notification.identifier);
    }
  }

  // Criar nova notificação
  const [hours, minutes] = time.split(':').map(Number);

  const trigger: Notifications.NotificationTriggerInput =
    frequency === 'daily'
      ? {
          type: Notifications.SchedulableTriggerInputTypes.DAILY,
          hour: hours,
          minute: minutes,
        }
      : {
          type: Notifications.SchedulableTriggerInputTypes.WEEKLY,
          weekday: 2,
          hour: hours,
          minute: minutes,
        };

  const identifier = await Notifications.scheduleNotificationAsync({
    content: {
      title: 'Hora de se pesar!',
      body: 'Registre seu peso para acompanhar seu progresso',
      data: { type: 'weight_reminder', screen: '/(tabs)/add-weight' },
      categoryIdentifier: 'weight_reminder',
    },
    trigger,
  });

  logger.info('Weight reminder scheduled', { identifier, frequency, time });
  return identifier;
}

/**
 * Schedule weekly medication reminder
 * C2 - Weekly Reminders
 * @param weekday - Day of week (0=Sunday, 1=Monday, ..., 6=Saturday)
 * @param time - Time in HH:mm format (24h)
 * @returns Notification identifier
 */
export async function scheduleWeeklyMedicationReminder(
  weekday: number,
  time: string
): Promise<string | null> {
  try {
    // Validate inputs
    if (weekday < 0 || weekday > 6) {
      logger.error('Invalid weekday for medication reminder', { weekday });
      return null;
    }

    // Cancel previous medication reminders
    const scheduled = await Notifications.getAllScheduledNotificationsAsync();
    for (const notification of scheduled) {
      if (notification.content.data?.type === 'medication_reminder') {
        await Notifications.cancelScheduledNotificationAsync(notification.identifier);
        logger.debug('Cancelled previous medication reminder', {
          identifier: notification.identifier,
        });
      }
    }

    // Parse time
    const [hours, minutes] = time.split(':').map(Number);
    if (isNaN(hours) || isNaN(minutes) || hours < 0 || hours > 23 || minutes < 0 || minutes > 59) {
      logger.error('Invalid time for medication reminder', { time });
      return null;
    }

    // For iOS, set up notification category
    if (Platform.OS === 'ios') {
      await Notifications.setNotificationCategoryAsync('medication_reminder', [
        {
          identifier: 'register_now',
          buttonTitle: 'Registrar Agora',
          options: { opensAppToForeground: true },
        },
        {
          identifier: 'later',
          buttonTitle: 'Mais Tarde',
          options: { opensAppToForeground: false },
        },
      ]);
    }

    // Schedule weekly notification
    const identifier = await Notifications.scheduleNotificationAsync({
      content: {
        title: 'Hora de aplicar sua dose!',
        body: 'Não esqueça de registrar sua aplicação semanal',
        data: {
          type: 'medication_reminder',
          screen: '/(tabs)/add-application',
        },
        categoryIdentifier: 'medication_reminder',
      },
      trigger: {
        type: Notifications.SchedulableTriggerInputTypes.WEEKLY,
        weekday,
        hour: hours,
        minute: minutes,
        repeats: true,
      },
    });

    logger.info('Weekly medication reminder scheduled', {
      identifier,
      weekday,
      time,
      nextTrigger: `Day ${weekday} at ${time}`,
    });

    return identifier;
  } catch (error) {
    logger.error('Error scheduling weekly medication reminder', error as Error);
    return null;
  }
}

/**
 * Update weekly medication reminder
 * Cancels existing reminder and schedules a new one
 * C2 - Weekly Reminders
 */
export async function updateWeeklyMedicationReminder(
  weekday: number,
  time: string
): Promise<string | null> {
  logger.info('Updating weekly medication reminder', { weekday, time });
  return await scheduleWeeklyMedicationReminder(weekday, time);
}

/**
 * Cancel weekly medication reminder
 * C2 - Weekly Reminders
 */
export async function cancelWeeklyMedicationReminder(): Promise<void> {
  try {
    const scheduled = await Notifications.getAllScheduledNotificationsAsync();
    for (const notification of scheduled) {
      if (notification.content.data?.type === 'medication_reminder') {
        await Notifications.cancelScheduledNotificationAsync(notification.identifier);
        logger.info('Cancelled medication reminder', {
          identifier: notification.identifier,
        });
      }
    }
  } catch (error) {
    logger.error('Error cancelling medication reminder', error as Error);
  }
}

/**
 * Get next scheduled medication reminder
 * C2 - Weekly Reminders
 */
export async function getScheduledMedicationReminder(): Promise<Notifications.NotificationRequest | null> {
  try {
    const scheduled = await Notifications.getAllScheduledNotificationsAsync();
    const medicationReminder = scheduled.find(
      (n) => n.content.data?.type === 'medication_reminder'
    );
    return medicationReminder || null;
  } catch (error) {
    logger.error('Error getting scheduled medication reminder', error as Error);
    return null;
  }
}

// Agendar notificação de aplicação
export async function scheduleApplicationReminder(
  medicationName: string,
  dosage: number,
  daysUntilNext: number
) {
  // Calcular data da próxima aplicação
  const nextDate = new Date();
  nextDate.setDate(nextDate.getDate() + daysUntilNext);
  nextDate.setHours(9, 0, 0, 0); // 9h da manhã

  const identifier = await Notifications.scheduleNotificationAsync({
    content: {
      title: `💉 Dia de aplicar ${medicationName}!`,
      body: `Aplicação de ${dosage}mg hoje`,
      data: { type: 'application_reminder', screen: '/(tabs)/add-application' },
    },
    trigger: {
      type: Notifications.SchedulableTriggerInputTypes.DATE,
      date: nextDate,
    },
  });

  return identifier;
}

// Notificação de conquista desbloqueada
export async function notifyAchievement(title: string, description: string) {
  await Notifications.scheduleNotificationAsync({
    content: {
      title: `🏆 ${title}`,
      body: description,
      data: { type: 'achievement', screen: '/(tabs)' },
    },
    trigger: null, // Imediata
  });
}

// Notificação de inatividade (usuário não usa há X dias)
export async function scheduleInactivityReminder(daysSinceLastLog: number) {
  if (daysSinceLastLog < 3) return;

  const messages = [
    { days: 3, message: 'Sentimos sua falta! Registre seu progresso hoje 💙' },
    { days: 7, message: 'Já faz uma semana! Vamos voltar aos trilhos? 🎯' },
    { days: 14, message: 'Estamos aqui para te ajudar! Não desista 💪' },
  ];

  const message = messages.find((m) => daysSinceLastLog >= m.days)?.message || messages[0].message;

  await Notifications.scheduleNotificationAsync({
    content: {
      title: '👋 Olá!',
      body: message,
      data: { type: 'inactivity', screen: '/(tabs)' },
    },
    trigger: {
      type: Notifications.SchedulableTriggerInputTypes.TIME_INTERVAL,
      seconds: 60, // 1 minuto (para teste, em prod seria horas)
      repeats: false,
    },
  });
}

// Obter próxima aplicação agendada
export async function getNextScheduledNotification(type: string) {
  const scheduled = await Notifications.getAllScheduledNotificationsAsync();
  return scheduled.find((n) => n.content.data?.type === type);
}
