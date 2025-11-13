import { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Alert,
  KeyboardAvoidingView,
  Platform,
  TouchableWithoutFeedback,
  Keyboard,
  Pressable,
} from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useSideEffects } from '@/hooks/useSideEffects';
import { useColors } from '@/constants/colors';

const COMMON_SIDE_EFFECTS = [
  { emoji: '🤢', label: 'Náusea', value: 'Náusea' },
  { emoji: '🤮', label: 'Vômito', value: 'Vômito' },
  { emoji: '😣', label: 'Dor de cabeça', value: 'Dor de cabeça' },
  { emoji: '💩', label: 'Diarreia', value: 'Diarreia' },
  { emoji: '😴', label: 'Fadiga', value: 'Fadiga' },
  { emoji: '🥵', label: 'Tontura', value: 'Tontura' },
  { emoji: '😰', label: 'Ansiedade', value: 'Ansiedade' },
  { emoji: '🍽️', label: 'Falta de apetite', value: 'Falta de apetite' },
  { emoji: '💭', label: 'Outro', value: 'outro' },
];

const SEVERITY_LEVELS = [
  { value: 1, label: 'Muito Leve', color: '#10b981', description: 'Quase imperceptível' },
  { value: 2, label: 'Leve', color: '#84cc16', description: 'Incômodo, mas suportável' },
  { value: 3, label: 'Moderado', color: '#f59e0b', description: 'Desconfortável' },
  { value: 4, label: 'Forte', color: '#f97316', description: 'Muito desconfortável' },
  { value: 5, label: 'Muito Forte', color: '#ef4444', description: 'Insuportável' },
];

export default function AddSideEffectScreen() {
  const colors = useColors();
  const router = useRouter();
  const params = useLocalSearchParams();
  const editId = params.editId as string | undefined;
  const {
    addSideEffect,
    updateSideEffect,
    sideEffects,
    loading: sideEffectsLoading,
  } = useSideEffects();

  const [selectedType, setSelectedType] = useState<string | null>(null);
  const [customType, setCustomType] = useState('');
  const [severity, setSeverity] = useState<1 | 2 | 3 | 4 | 5>(3);
  const [notes, setNotes] = useState('');
  const [loading, setLoading] = useState(false);

  // Load side effect data for editing
  useEffect(() => {
    if (editId && sideEffects.length > 0) {
      const effect = sideEffects.find((e) => e.id === editId);
      if (effect) {
        const commonEffect = COMMON_SIDE_EFFECTS.find((e) => e.value === effect.type);
        if (commonEffect) {
          setSelectedType(commonEffect.value);
        } else {
          setSelectedType('outro');
          setCustomType(effect.type);
        }
        setSeverity(effect.severity);
        setNotes(effect.notes || '');
      }
    }
  }, [editId, sideEffects]);

  async function handleSubmit() {
    const effectType = selectedType === 'outro' ? customType : selectedType;

    if (!effectType) {
      Alert.alert('Atenção', 'Selecione ou digite um efeito colateral');
      return;
    }

    if (selectedType === 'outro' && !customType.trim()) {
      Alert.alert('Atenção', 'Digite o efeito colateral');
      return;
    }

    try {
      setLoading(true);

      if (editId) {
        // Update existing side effect
        await updateSideEffect(editId, {
          type: effectType,
          severity,
          notes: notes.trim() || null,
        });
        Alert.alert('Sucesso!', 'Efeito colateral atualizado');
      } else {
        // Add new side effect
        await addSideEffect({
          type: effectType,
          severity,
          date: new Date().toISOString().split('T')[0],
          notes: notes.trim() || null,
        });
        Alert.alert('Sucesso!', 'Efeito colateral registrado');
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
          <Text style={styles.title}>
            {editId ? 'Editar Efeito Colateral' : 'Registrar Efeito Colateral'}
          </Text>
          <Text style={styles.subtitle}>
            Registre qualquer sintoma ou desconforto que você está sentindo
          </Text>

          <View style={styles.section}>
            <Text style={styles.label}>Tipo de Efeito</Text>
            <View style={styles.effectsGrid}>
              {COMMON_SIDE_EFFECTS.map((effect) => (
                <Pressable
                  key={effect.value}
                  style={[
                    styles.effectButton,
                    selectedType === effect.value && styles.effectButtonSelected,
                  ]}
                  onPress={() => setSelectedType(effect.value)}
                >
                  <Text style={styles.effectEmoji}>{effect.emoji}</Text>
                  <Text
                    style={[
                      styles.effectLabel,
                      selectedType === effect.value && styles.effectLabelSelected,
                    ]}
                  >
                    {effect.label}
                  </Text>
                </Pressable>
              ))}
            </View>

            {selectedType === 'outro' && (
              <Input
                label="Descreva o efeito"
                placeholder="Ex: Dor abdominal..."
                value={customType}
                onChangeText={setCustomType}
              />
            )}
          </View>

          <View style={styles.section}>
            <Text style={styles.label}>Intensidade do Sintoma</Text>
            <View style={styles.severityContainer}>
              {SEVERITY_LEVELS.map((level) => (
                <Pressable
                  key={level.value}
                  style={[
                    styles.severityButton,
                    severity === level.value && [
                      styles.severityButtonSelected,
                      { borderColor: level.color },
                    ],
                  ]}
                  onPress={() => setSeverity(level.value as 1 | 2 | 3 | 4 | 5)}
                >
                  <View style={[styles.severityIndicator, { backgroundColor: level.color }]} />
                  <View style={styles.severityContent}>
                    <Text
                      style={[
                        styles.severityLabel,
                        severity === level.value && styles.severityLabelSelected,
                      ]}
                    >
                      {level.label}
                    </Text>
                    <Text style={styles.severityDescription}>{level.description}</Text>
                  </View>
                </Pressable>
              ))}
            </View>
          </View>

          <Input
            label="Observações (opcional)"
            placeholder="Ex: Ocorreu após a aplicação..."
            value={notes}
            onChangeText={setNotes}
            multiline
          />

          {sideEffectsLoading && (
            <Text style={styles.loadingText}>Carregando dados do usuário...</Text>
          )}

          <Button
            label={editId ? 'Salvar Alterações' : 'Registrar Efeito Colateral'}
            onPress={handleSubmit}
            loading={loading}
            disabled={sideEffectsLoading || loading}
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
    effectButton: {
      alignItems: 'center',
      backgroundColor: colors.card,
      borderColor: 'transparent',
      borderRadius: 12,
      borderWidth: 2,
      padding: 12,
      width: '30%',
    },
    effectButtonSelected: {
      backgroundColor: colors.backgroundLight,
      borderColor: colors.primary,
    },
    effectEmoji: {
      fontSize: 32,
      marginBottom: 4,
    },
    effectLabel: {
      color: colors.textSecondary,
      fontSize: 11,
      textAlign: 'center',
    },
    effectLabelSelected: {
      color: colors.primary,
      fontWeight: 'bold',
    },
    effectsGrid: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      gap: 12,
      marginBottom: 16,
    },
    label: {
      color: colors.text,
      fontSize: 16,
      fontWeight: '600',
      marginBottom: 12,
    },
    loadingText: {
      color: colors.textSecondary,
      fontSize: 14,
      marginTop: 8,
      textAlign: 'center',
    },
    scrollContent: {
      flexGrow: 1,
      padding: 24,
    },
    section: {
      marginBottom: 24,
    },
    severityButton: {
      alignItems: 'center',
      backgroundColor: colors.card,
      borderColor: 'transparent',
      borderRadius: 12,
      borderWidth: 2,
      flexDirection: 'row',
      padding: 16,
    },
    severityButtonSelected: {
      backgroundColor: colors.backgroundLight,
      borderWidth: 2,
    },
    severityContainer: {
      gap: 12,
    },
    severityContent: {
      flex: 1,
    },
    severityDescription: {
      color: colors.textMuted,
      fontSize: 12,
    },
    severityIndicator: {
      borderRadius: 6,
      height: 12,
      marginRight: 12,
      width: 12,
    },
    severityLabel: {
      color: colors.text,
      fontSize: 16,
      fontWeight: '600',
      marginBottom: 2,
    },
    severityLabelSelected: {
      color: colors.primary,
    },
    subtitle: {
      color: colors.textSecondary,
      fontSize: 14,
      marginBottom: 24,
    },
    title: {
      color: colors.text,
      fontSize: 28,
      fontWeight: 'bold',
      marginBottom: 8,
    },
  });
