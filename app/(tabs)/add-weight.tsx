import { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Alert,
  Pressable,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  TouchableWithoutFeedback,
  Keyboard,
} from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useWeightLogs } from '@/hooks/useWeightLogs';
import { useColors } from '@/constants/colors';
import {
  AppIcon,
  SmileyIcon,
  FistIcon,
  CheckCircleIcon,
  FaceNeutralIcon,
  FaceSadIcon,
  FaceAngryIcon,
  StomachIcon,
  MoonStarsIcon,
} from '@/components/ui/icons';

const MOOD_OPTIONS = [
  { icon: 'smiley', label: 'Feliz', value: 'Feliz' },
  { icon: 'fist', label: 'Motivado', value: 'Motivado' },
  { icon: 'checkCircle', label: 'Bem', value: 'Bem' },
  { icon: 'faceNeutral', label: 'Normal', value: 'Normal' },
  { icon: 'faceSad', label: 'Triste', value: 'Triste' },
  { icon: 'faceAngry', label: 'Frustrado', value: 'Frustrado' },
  { icon: 'stomach', label: 'Nauseado', value: 'Nauseado' },
  { icon: 'moonStars', label: 'Cansado', value: 'Cansado' },
];

export default function AddWeightScreen() {
  const colors = useColors();
  const router = useRouter();
  const params = useLocalSearchParams();
  const editId = params.editId as string | undefined;
  const { addWeightLog, updateWeightLog, weightLogs, loading: weightLogsLoading } = useWeightLogs();

  const [weight, setWeight] = useState('');
  const [selectedMood, setSelectedMood] = useState<string | null>(null);
  const [additionalNotes, setAdditionalNotes] = useState('');
  const [loading, setLoading] = useState(false);

  // Load weight log data for editing
  useEffect(() => {
    if (editId && weightLogs.length > 0) {
      const log = weightLogs.find((l) => l.id === editId);
      if (log) {
        setWeight(log.weight.toString());
        // Parse notes to extract mood if it exists
        if (log.notes) {
          const moodOption = MOOD_OPTIONS.find((m) => log.notes?.includes(m.value));
          if (moodOption) {
            setSelectedMood(moodOption.value);
            // Remove mood from notes to get additional notes
            const additionalNotesText = log.notes
              .replace(moodOption.value, '')
              .replace(/^[\s-]+|[\s-]+$/g, '');
            setAdditionalNotes(additionalNotesText);
          } else {
            setAdditionalNotes(log.notes);
          }
        }
      }
    }
  }, [editId, weightLogs]);

  async function handleSubmit() {
    if (!weight) {
      Alert.alert('Erro', 'Preencha o peso');
      return;
    }

    try {
      setLoading(true);

      // Combinar mood e notas adicionais
      const finalNotes = [selectedMood, additionalNotes].filter(Boolean).join(' - ');

      if (editId) {
        // Update existing weight log
        await updateWeightLog(editId, {
          weight: parseFloat(weight),
          notes: finalNotes || null,
        });
        Alert.alert('Sucesso!', 'Peso atualizado');
      } else {
        // Add new weight log
        await addWeightLog({
          weight: parseFloat(weight),
          date: new Date().toISOString().split('T')[0],
          notes: finalNotes || null,
        });
        Alert.alert('Sucesso!', 'Peso registrado');
      }

      router.back();
    } catch (error: any) {
      Alert.alert('Erro', error.message);
    } finally {
      setLoading(false);
    }
  }

  const styles = getStyles(colors);

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.container}
    >
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          keyboardShouldPersistTaps="handled"
        >
          <Text style={styles.title}>{editId ? 'Editar Peso' : 'Registrar Peso'}</Text>

          <Input
            label="Peso (kg)"
            placeholder="Ex: 85.5"
            value={weight}
            onChangeText={setWeight}
            keyboardType="decimal-pad"
          />

          <View style={styles.moodSection}>
            <Text style={styles.moodLabel}>Como você está se sentindo?</Text>
            <View style={styles.moodGrid}>
              {MOOD_OPTIONS.map((mood) => (
                <Pressable
                  key={mood.value}
                  style={[
                    styles.moodButton,
                    selectedMood === mood.value && styles.moodButtonSelected,
                  ]}
                  onPress={() => setSelectedMood(mood.value)}
                >
                  <AppIcon name={mood.icon as any} size="xl" color={colors.text} />
                  <Text
                    style={[
                      styles.moodButtonLabel,
                      selectedMood === mood.value && styles.moodLabelSelected,
                    ]}
                  >
                    {mood.label}
                  </Text>
                </Pressable>
              ))}
            </View>
          </View>

          <Input
            label="Notas Adicionais (opcional)"
            placeholder="Ex: Comecei exercícios..."
            value={additionalNotes}
            onChangeText={setAdditionalNotes}
            multiline
          />

          {weightLogsLoading && (
            <Text style={styles.loadingText}>Carregando dados do usuário...</Text>
          )}

          <Button
            label={editId ? 'Salvar Alterações' : 'Salvar Peso'}
            onPress={handleSubmit}
            loading={loading}
            disabled={weightLogsLoading || loading}
          />
        </ScrollView>
      </TouchableWithoutFeedback>
    </KeyboardAvoidingView>
  );
}

const getStyles = (colors: any) =>
  StyleSheet.create({
    container: {
      backgroundColor: colors.background,
      flex: 1,
    },
    loadingText: {
      color: colors.textSecondary,
      fontSize: 14,
      marginTop: 8,
      textAlign: 'center',
    },
    moodButton: {
      alignItems: 'center',
      backgroundColor: colors.card,
      borderColor: 'transparent',
      borderRadius: 12,
      borderWidth: 2,
      padding: 12,
      width: '22%',
    },
    moodButtonLabel: {
      color: colors.textSecondary,
      fontSize: 10,
      textAlign: 'center',
    },
    moodButtonSelected: {
      backgroundColor: colors.backgroundLight,
      borderColor: colors.primary,
    },
    moodEmoji: {
      // fontSize: 32, // Removed as AppIcon handles its own size
      marginBottom: 4,
    },
    moodGrid: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      gap: 12,
    },
    moodLabel: {
      color: colors.text,
      fontSize: 16,
      fontWeight: '600',
      marginBottom: 12,
    },
    moodLabelSelected: {
      color: colors.primary,
      fontWeight: 'bold',
    },
    moodSection: {
      marginVertical: 20,
    },
    scrollContent: {
      flexGrow: 1,
      justifyContent: 'center',
      padding: 24,
    },
    title: {
      color: colors.text,
      fontSize: 28,
      fontWeight: 'bold',
      marginBottom: 24,
    },
  });
