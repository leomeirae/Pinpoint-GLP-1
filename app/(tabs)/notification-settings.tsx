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
    container: {
      flex: 1,
      backgroundColor: colors.background,
    },
    header: {
      padding: 24,
      alignItems: 'center',
    },
    emoji: {
      fontSize: 64,
      marginBottom: 16,
    },
    title: {
      fontSize: 28,
      fontWeight: 'bold',
      color: colors.text,
      marginBottom: 8,
    },
    subtitle: {
      fontSize: 14,
      color: colors.textSecondary,
      textAlign: 'center',
    },
    section: {
      padding: 24,
      borderBottomWidth: 1,
      borderBottomColor: colors.border,
    },
    sectionTitle: {
      fontSize: 18,
      fontWeight: 'bold',
      color: colors.text,
      marginBottom: 16,
    },
    settingRow: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      paddingVertical: 12,
    },
    settingInfo: {
      flex: 1,
      marginRight: 16,
    },
    settingLabel: {
      fontSize: 16,
      fontWeight: '600',
      color: colors.text,
      marginBottom: 4,
    },
    settingDescription: {
      fontSize: 14,
      color: colors.textSecondary,
    },
    radioGroup: {
      gap: 12,
    },
    radioOption: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: colors.card,
      borderRadius: 12,
      padding: 16,
      borderWidth: 2,
      borderColor: 'transparent',
    },
    radioOptionSelected: {
      borderColor: colors.primary,
      backgroundColor: colors.primaryDark,
    },
    radioOptionDisabled: {
      opacity: 0.5,
    },
    radio: {
      width: 24,
      height: 24,
      borderRadius: 12,
      borderWidth: 2,
      borderColor: colors.textMuted,
      alignItems: 'center',
      justifyContent: 'center',
      marginRight: 12,
    },
    radioSelected: {
      borderColor: colors.primary,
    },
    radioInner: {
      width: 12,
      height: 12,
      borderRadius: 6,
      backgroundColor: colors.primary,
    },
    radioText: {
      flex: 1,
    },
    radioLabel: {
      fontSize: 16,
      fontWeight: '600',
      color: colors.text,
      marginBottom: 4,
    },
    radioDescription: {
      fontSize: 14,
      color: colors.textSecondary,
    },
    disabledText: {
      opacity: 0.5,
    },
    actions: {
      padding: 24,
    },
    editReminderButton: {
      marginTop: 12,
      padding: 12,
      backgroundColor: colors.card,
      borderRadius: 8,
      borderWidth: 1,
      borderColor: colors.primary,
    },
    editReminderText: {
      fontSize: 14,
      color: colors.primary,
      fontWeight: '600',
      textAlign: 'center',
    },
  });
