import { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Switch, Alert, Pressable } from 'react-native';
import { useRouter } from 'expo-router';
import { useUser } from '@/hooks/useUser';
import { useNotifications } from '@/hooks/useNotifications';
import { Button } from '@/components/ui/button';
import { useColors } from '@/constants/colors';

export default function NotificationSettingsScreen() {
  const colors = useColors();
  const router = useRouter();
  const { user, refetch } = useUser();
  const { updateNotificationSettings } = useNotifications();
  const [loading, setLoading] = useState(false);

  const [enabled, setEnabled] = useState(user?.notifications_enabled ?? true);
  const [weightFrequency, setWeightFrequency] = useState(
    user?.weight_reminder_frequency || 'daily'
  );
  const [appReminders, setAppReminders] = useState(user?.application_reminders ?? true);
  const [achievementNotifs, setAchievementNotifs] = useState(
    user?.achievement_notifications ?? true
  );

  async function handleSave() {
    try {
      setLoading(true);

      await updateNotificationSettings({
        enabled,
        weightReminderFrequency: weightFrequency as 'daily' | 'weekly' | 'never',
        applicationReminders: appReminders,
        achievementNotifications: achievementNotifs,
      });

      await refetch();

      Alert.alert('Sucesso! ✅', 'Configurações salvas', [
        { text: 'OK', onPress: () => router.back() },
      ]);
    } catch (error: any) {
      Alert.alert('Erro', error.message);
    } finally {
      setLoading(false);
    }
  }

  const styles = getStyles(colors);

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.emoji}>🔔</Text>
        <Text style={styles.title}>Notificações</Text>
        <Text style={styles.subtitle}>Configure seus lembretes e alertas</Text>
      </View>

      <View style={styles.section}>
        <View style={styles.settingRow}>
          <View style={styles.settingInfo}>
            <Text style={styles.settingLabel}>Ativar Notificações</Text>
            <Text style={styles.settingDescription}>Receber todos os lembretes e alertas</Text>
          </View>
          <Switch
            value={enabled}
            onValueChange={setEnabled}
            trackColor={{ false: colors.border, true: colors.primary }}
          />
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Lembretes de Peso</Text>

        <View style={styles.radioGroup}>
          <RadioOption
            label="Diário"
            description="Todos os dias no mesmo horário"
            selected={weightFrequency === 'daily'}
            onPress={() => setWeightFrequency('daily')}
            disabled={!enabled}
          />
          <RadioOption
            label="Semanal"
            description="Uma vez por semana"
            selected={weightFrequency === 'weekly'}
            onPress={() => setWeightFrequency('weekly')}
            disabled={!enabled}
          />
          <RadioOption
            label="Nunca"
            description="Não me lembrar"
            selected={weightFrequency === 'never'}
            onPress={() => setWeightFrequency('never')}
            disabled={!enabled}
          />
        </View>
      </View>

      <View style={styles.section}>
        <View style={styles.settingRow}>
          <View style={styles.settingInfo}>
            <Text style={styles.settingLabel}>Lembretes de Aplicação</Text>
            <Text style={styles.settingDescription}>
              Notificar quando for dia de aplicar medicação
            </Text>
          </View>
          <Switch
            value={appReminders}
            onValueChange={setAppReminders}
            disabled={!enabled}
            trackColor={{ false: colors.border, true: colors.primary }}
          />
        </View>

        {/* C2: Link to edit reminder schedule */}
        {appReminders && enabled && (
          <Pressable
            style={styles.editReminderButton}
            onPress={() => router.push('/(tabs)/edit-reminder')}
          >
            <Text style={styles.editReminderText}>Editar horário do lembrete</Text>
          </Pressable>
        )}

        <View style={styles.settingRow}>
          <View style={styles.settingInfo}>
            <Text style={styles.settingLabel}>Conquistas</Text>
            <Text style={styles.settingDescription}>Notificar quando desbloquear conquistas</Text>
          </View>
          <Switch
            value={achievementNotifs}
            onValueChange={setAchievementNotifs}
            disabled={!enabled}
            trackColor={{ false: colors.border, true: colors.primary }}
          />
        </View>
      </View>

      <View style={styles.actions}>
        <Button label="Salvar Configurações" onPress={handleSave} loading={loading} />
      </View>
    </ScrollView>
  );
}

function RadioOption({
  label,
  description,
  selected,
  onPress,
  disabled,
}: {
  label: string;
  description: string;
  selected: boolean;
  onPress: () => void;
  disabled?: boolean;
}) {
  const colors = useColors();
  const styles = getStyles(colors);

  return (
    <Pressable
      style={[
        styles.radioOption,
        selected && styles.radioOptionSelected,
        disabled && styles.radioOptionDisabled,
      ]}
      onPress={disabled ? undefined : onPress}
      disabled={disabled}
    >
      <View style={[styles.radio, selected && styles.radioSelected]}>
        {selected && <View style={styles.radioInner} />}
      </View>
      <View style={styles.radioText}>
        <Text style={[styles.radioLabel, disabled && styles.disabledText]}>{label}</Text>
        <Text style={[styles.radioDescription, disabled && styles.disabledText]}>
          {description}
        </Text>
      </View>
    </Pressable>
  );
}

const getStyles = (colors: any) =>
  StyleSheet.create({
    actions: {
      padding: 24,
    },
    container: {
      backgroundColor: colors.background,
      flex: 1,
    },
    disabledText: {
      opacity: 0.5,
    },
    editReminderButton: {
      backgroundColor: colors.card,
      borderColor: colors.primary,
      borderRadius: 8,
      borderWidth: 1,
      marginTop: 12,
      padding: 12,
    },
    editReminderText: {
      color: colors.primary,
      fontSize: 14,
      fontWeight: '600',
      textAlign: 'center',
    },
    emoji: {
      fontSize: 64,
      marginBottom: 16,
    },
    header: {
      alignItems: 'center',
      padding: 24,
    },
    radio: {
      alignItems: 'center',
      borderColor: colors.textMuted,
      borderRadius: 12,
      borderWidth: 2,
      height: 24,
      justifyContent: 'center',
      marginRight: 12,
      width: 24,
    },
    radioDescription: {
      color: colors.textSecondary,
      fontSize: 14,
    },
    radioGroup: {
      gap: 12,
    },
    radioInner: {
      backgroundColor: colors.primary,
      borderRadius: 6,
      height: 12,
      width: 12,
    },
    radioLabel: {
      color: colors.text,
      fontSize: 16,
      fontWeight: '600',
      marginBottom: 4,
    },
    radioOption: {
      alignItems: 'center',
      backgroundColor: colors.card,
      borderColor: 'transparent',
      borderRadius: 12,
      borderWidth: 2,
      flexDirection: 'row',
      padding: 16,
    },
    radioOptionDisabled: {
      opacity: 0.5,
    },
    radioOptionSelected: {
      backgroundColor: colors.primaryDark,
      borderColor: colors.primary,
    },
    radioSelected: {
      borderColor: colors.primary,
    },
    radioText: {
      flex: 1,
    },
    section: {
      borderBottomColor: colors.border,
      borderBottomWidth: 1,
      padding: 24,
    },
    sectionTitle: {
      color: colors.text,
      fontSize: 18,
      fontWeight: 'bold',
      marginBottom: 16,
    },
    settingDescription: {
      color: colors.textSecondary,
      fontSize: 14,
    },
    settingInfo: {
      flex: 1,
      marginRight: 16,
    },
    settingLabel: {
      color: colors.text,
      fontSize: 16,
      fontWeight: '600',
      marginBottom: 4,
    },
    settingRow: {
      alignItems: 'center',
      flexDirection: 'row',
      justifyContent: 'space-between',
      paddingVertical: 12,
    },
    subtitle: {
      color: colors.textSecondary,
      fontSize: 14,
      textAlign: 'center',
    },
    title: {
      color: colors.text,
      fontSize: 28,
      fontWeight: 'bold',
      marginBottom: 8,
    },
  });
