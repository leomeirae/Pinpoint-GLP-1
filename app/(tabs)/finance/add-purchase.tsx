import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Alert,
  Platform,
} from 'react-native';
import { router } from 'expo-router';
import { ArrowLeft, Check } from 'phosphor-react-native';
import { useColors } from '@/hooks/useShotsyColors';
import { ShotsyDesignTokens } from '@/constants/shotsyDesignTokens';
import { usePurchases } from '@/hooks/usePurchases';
import { createLogger } from '@/lib/logger';
import * as Haptics from 'expo-haptics';
import DateTimePicker from '@react-native-community/datetimepicker';

const logger = createLogger('AddPurchaseScreen');

// Medication options with available dosages
const MEDICATIONS = [
  {
    id: 'mounjaro',
    name: 'Mounjaro',
    generic: 'tirzepatida',
    dosages: [2.5, 5, 7.5, 10, 12.5, 15],
  },
  {
    id: 'ozempic',
    name: 'Ozempic',
    generic: 'semaglutida',
    dosages: [0.25, 0.5, 1, 2],
  },
  {
    id: 'wegovy',
    name: 'Wegovy',
    generic: 'semaglutida',
    dosages: [0.25, 0.5, 1, 1.7, 2.4],
  },
  {
    id: 'saxenda',
    name: 'Saxenda',
    generic: 'liraglutida',
    dosages: [6],
  },
  {
    id: 'retatrutida',
    name: 'Retatrutida',
    generic: 'retatrutida',
    dosages: [2, 4, 6, 8, 10, 12],
  },
  {
    id: 'other',
    name: 'Outro',
    generic: '',
    dosages: [],
  },
];

export default function AddPurchaseScreen() {
  const colors = useColors();
  const { addPurchase } = usePurchases();

  const [medication, setMedication] = useState<string>('');
  const [brand, setBrand] = useState<string>('');
  const [dosage, setDosage] = useState<number | null>(null);
  const [quantity, setQuantity] = useState<string>('');
  const [priceReais, setPriceReais] = useState<string>('');
  const [priceCents, setPriceCents] = useState<string>('');
  const [purchaseDate, setPurchaseDate] = useState<Date>(new Date());
  const [showDatePicker, setShowDatePicker] = useState<boolean>(false);
  const [location, setLocation] = useState<string>('');
  const [notes, setNotes] = useState<string>('');
  const [isSaving, setIsSaving] = useState<boolean>(false);

  const selectedMedicationData = MEDICATIONS.find((m) => m.name === medication);
  const availableDosages = selectedMedicationData?.dosages || [];

  const handleBack = async () => {
    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    router.back();
  };

  const handleSave = async () => {
    // Validation
    if (!medication) {
      Alert.alert('Campo obrigatório', 'Selecione o medicamento');
      return;
    }

    if (dosage === null) {
      Alert.alert('Campo obrigatório', 'Selecione a dosagem');
      return;
    }

    if (!quantity || parseInt(quantity) <= 0) {
      Alert.alert('Campo obrigatório', 'Informe a quantidade de canetas');
      return;
    }

    // Validate price
    const reaisNum = parseInt(priceReais) || 0;
    const centsNum = parseInt(priceCents) || 0;

    if (reaisNum === 0 && centsNum === 0) {
      Alert.alert('Campo obrigatório', 'Informe o preço total da compra');
      return;
    }

    const totalPriceCents = reaisNum * 100 + centsNum;

    setIsSaving(true);

    try {
      await addPurchase({
        medication,
        brand: brand.trim() || undefined,
        dosage,
        quantity: parseInt(quantity),
        total_price_cents: totalPriceCents,
        purchase_date: purchaseDate.toISOString().split('T')[0], // YYYY-MM-DD
        purchase_location: location.trim() || undefined,
        notes: notes.trim() || undefined,
      });

      await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      logger.info('Purchase added successfully', { medication, dosage, quantity });

      router.back();
    } catch (error) {
      logger.error('Failed to add purchase', error as Error);
      Alert.alert('Erro', 'Não foi possível salvar a compra. Tente novamente.');
    } finally {
      setIsSaving(false);
    }
  };

  const formatDate = (date: Date): string => {
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      {/* Header */}
      <View style={[styles.header, { borderBottomColor: colors.border }]}>
        <TouchableOpacity onPress={handleBack} style={styles.backButton}>
          <ArrowLeft size={24} color={colors.text} weight="regular" />
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { color: colors.text }]}>Adicionar Compra</Text>
        <View style={styles.headerSpacer} />
      </View>

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        {/* Medication */}
        <View style={styles.field}>
          <Text style={[styles.label, { color: colors.text }]}>
            Medicamento <Text style={{ color: colors.accentRed }}>*</Text>
          </Text>
          <View style={styles.optionsGrid}>
            {MEDICATIONS.map((med) => (
              <TouchableOpacity
                key={med.id}
                style={[
                  styles.option,
                  {
                    backgroundColor:
                      medication === med.name ? colors.primary + '15' : colors.card,
                    borderColor:
                      medication === med.name ? colors.primary : 'transparent',
                    borderWidth: 2,
                  },
                ]}
                onPress={() => {
                  setMedication(med.name);
                  setDosage(null); // Reset dosage when changing medication
                }}
              >
                <Text
                  style={[
                    styles.optionText,
                    { color: medication === med.name ? colors.primary : colors.text },
                  ]}
                >
                  {med.name}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Brand (optional) */}
        <View style={styles.field}>
          <Text style={[styles.label, { color: colors.text }]}>Marca (opcional)</Text>
          <TextInput
            style={[
              styles.input,
              {
                backgroundColor: colors.card,
                color: colors.text,
                borderColor: colors.border,
              },
            ]}
            value={brand}
            onChangeText={setBrand}
            placeholder="Ex: Eli Lilly, Novo Nordisk"
            placeholderTextColor={colors.textMuted}
          />
        </View>

        {/* Dosage */}
        {medication && availableDosages.length > 0 && (
          <View style={styles.field}>
            <Text style={[styles.label, { color: colors.text }]}>
              Dosagem <Text style={{ color: colors.accentRed }}>*</Text>
            </Text>
            <View style={styles.optionsGrid}>
              {availableDosages.map((dose) => (
                <TouchableOpacity
                  key={dose}
                  style={[
                    styles.option,
                    {
                      backgroundColor:
                        dosage === dose ? colors.primary + '15' : colors.card,
                      borderColor: dosage === dose ? colors.primary : 'transparent',
                      borderWidth: 2,
                    },
                  ]}
                  onPress={() => setDosage(dose)}
                >
                  <Text
                    style={[
                      styles.optionText,
                      { color: dosage === dose ? colors.primary : colors.text },
                    ]}
                  >
                    {dose}mg
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        )}

        {/* Quantity */}
        <View style={styles.field}>
          <Text style={[styles.label, { color: colors.text }]}>
            Quantidade de canetas <Text style={{ color: colors.accentRed }}>*</Text>
          </Text>
          <TextInput
            style={[
              styles.input,
              {
                backgroundColor: colors.card,
                color: colors.text,
                borderColor: colors.border,
              },
            ]}
            value={quantity}
            onChangeText={setQuantity}
            placeholder="Ex: 4"
            placeholderTextColor={colors.textMuted}
            keyboardType="number-pad"
          />
        </View>

        {/* Price */}
        <View style={styles.field}>
          <Text style={[styles.label, { color: colors.text }]}>
            Preço total <Text style={{ color: colors.accentRed }}>*</Text>
          </Text>
          <View style={styles.priceRow}>
            <Text style={[styles.currencySymbol, { color: colors.text }]}>R$</Text>
            <TextInput
              style={[
                styles.priceInputReais,
                {
                  backgroundColor: colors.card,
                  color: colors.text,
                  borderColor: colors.border,
                },
              ]}
              value={priceReais}
              onChangeText={setPriceReais}
              placeholder="0"
              placeholderTextColor={colors.textMuted}
              keyboardType="number-pad"
            />
            <Text style={[styles.priceSeparator, { color: colors.text }]}>,</Text>
            <TextInput
              style={[
                styles.priceInputCents,
                {
                  backgroundColor: colors.card,
                  color: colors.text,
                  borderColor: colors.border,
                },
              ]}
              value={priceCents}
              onChangeText={(text) => {
                // Limit to 2 digits
                if (text.length <= 2) {
                  setPriceCents(text);
                }
              }}
              placeholder="00"
              placeholderTextColor={colors.textMuted}
              keyboardType="number-pad"
              maxLength={2}
            />
          </View>
        </View>

        {/* Purchase Date */}
        <View style={styles.field}>
          <Text style={[styles.label, { color: colors.text }]}>Data da compra</Text>
          <TouchableOpacity
            style={[
              styles.input,
              {
                backgroundColor: colors.card,
                borderColor: colors.border,
                justifyContent: 'center',
              },
            ]}
            onPress={() => setShowDatePicker(true)}
          >
            <Text style={[styles.inputText, { color: colors.text }]}>
              {formatDate(purchaseDate)}
            </Text>
          </TouchableOpacity>

          {showDatePicker && (
            <DateTimePicker
              value={purchaseDate}
              mode="date"
              display={Platform.OS === 'ios' ? 'spinner' : 'default'}
              onChange={(event, selectedDate) => {
                setShowDatePicker(Platform.OS === 'ios');
                if (selectedDate) {
                  setPurchaseDate(selectedDate);
                }
              }}
              maximumDate={new Date()}
            />
          )}
        </View>

        {/* Location (optional) */}
        <View style={styles.field}>
          <Text style={[styles.label, { color: colors.text }]}>Local (opcional)</Text>
          <TextInput
            style={[
              styles.input,
              {
                backgroundColor: colors.card,
                color: colors.text,
                borderColor: colors.border,
              },
            ]}
            value={location}
            onChangeText={setLocation}
            placeholder="Ex: Farmácia Popular, Drogaria SP"
            placeholderTextColor={colors.textMuted}
          />
        </View>

        {/* Notes (optional) */}
        <View style={styles.field}>
          <Text style={[styles.label, { color: colors.text }]}>Observações (opcional)</Text>
          <TextInput
            style={[
              styles.textArea,
              {
                backgroundColor: colors.card,
                color: colors.text,
                borderColor: colors.border,
              },
            ]}
            value={notes}
            onChangeText={setNotes}
            placeholder="Adicione observações sobre esta compra"
            placeholderTextColor={colors.textMuted}
            multiline
            numberOfLines={4}
            textAlignVertical="top"
          />
        </View>

        {/* Bottom spacing */}
        <View style={styles.bottomSpacer} />
      </ScrollView>

      {/* Footer with Save button */}
      <View style={[styles.footer, { backgroundColor: colors.background, borderTopColor: colors.border }]}>
        <TouchableOpacity
          style={[
            styles.saveButton,
            { backgroundColor: colors.primary },
            isSaving && { opacity: 0.6 },
          ]}
          onPress={handleSave}
          disabled={isSaving}
        >
          {isSaving ? (
            <Text style={styles.saveButtonText}>Salvando...</Text>
          ) : (
            <>
              <Check size={20} color="#FFFFFF" weight="bold" />
              <Text style={styles.saveButtonText}>Salvar compra</Text>
            </>
          )}
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: ShotsyDesignTokens.spacing.lg,
    paddingTop: 60,
    paddingBottom: ShotsyDesignTokens.spacing.md,
    borderBottomWidth: 1,
  },
  backButton: {
    padding: ShotsyDesignTokens.spacing.sm,
    marginLeft: -ShotsyDesignTokens.spacing.sm,
  },
  headerTitle: {
    ...ShotsyDesignTokens.typography.h3,
    flex: 1,
    textAlign: 'center',
  },
  headerSpacer: {
    width: 44,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: ShotsyDesignTokens.spacing.lg,
  },
  field: {
    marginBottom: ShotsyDesignTokens.spacing.xl,
  },
  label: {
    ...ShotsyDesignTokens.typography.label,
    fontWeight: '600',
    marginBottom: ShotsyDesignTokens.spacing.sm,
  },
  input: {
    height: 56,
    borderRadius: ShotsyDesignTokens.borderRadius.md,
    borderWidth: 1,
    paddingHorizontal: ShotsyDesignTokens.spacing.md,
    ...ShotsyDesignTokens.typography.body,
  },
  inputText: {
    ...ShotsyDesignTokens.typography.body,
  },
  textArea: {
    minHeight: 120,
    borderRadius: ShotsyDesignTokens.borderRadius.md,
    borderWidth: 1,
    padding: ShotsyDesignTokens.spacing.md,
    ...ShotsyDesignTokens.typography.body,
  },
  optionsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: ShotsyDesignTokens.spacing.sm,
  },
  option: {
    paddingHorizontal: ShotsyDesignTokens.spacing.md,
    paddingVertical: ShotsyDesignTokens.spacing.sm,
    borderRadius: ShotsyDesignTokens.borderRadius.md,
    ...ShotsyDesignTokens.shadows.card,
  },
  optionText: {
    ...ShotsyDesignTokens.typography.label,
    fontWeight: '600',
  },
  priceRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: ShotsyDesignTokens.spacing.sm,
  },
  currencySymbol: {
    ...ShotsyDesignTokens.typography.h3,
    fontWeight: '600',
  },
  priceInputReais: {
    flex: 1,
    height: 56,
    borderRadius: ShotsyDesignTokens.borderRadius.md,
    borderWidth: 1,
    paddingHorizontal: ShotsyDesignTokens.spacing.md,
    ...ShotsyDesignTokens.typography.h3,
    fontWeight: '600',
  },
  priceSeparator: {
    ...ShotsyDesignTokens.typography.h3,
    fontWeight: '600',
  },
  priceInputCents: {
    width: 70,
    height: 56,
    borderRadius: ShotsyDesignTokens.borderRadius.md,
    borderWidth: 1,
    paddingHorizontal: ShotsyDesignTokens.spacing.md,
    ...ShotsyDesignTokens.typography.h3,
    fontWeight: '600',
  },
  footer: {
    paddingHorizontal: ShotsyDesignTokens.spacing.lg,
    paddingVertical: ShotsyDesignTokens.spacing.md,
    borderTopWidth: 1,
  },
  saveButton: {
    height: 56,
    borderRadius: ShotsyDesignTokens.borderRadius.lg,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    ...ShotsyDesignTokens.shadows.card,
  },
  saveButtonText: {
    ...ShotsyDesignTokens.typography.label,
    color: '#FFFFFF',
    fontWeight: '600',
  },
  bottomSpacer: {
    height: ShotsyDesignTokens.spacing.xxl,
  },
});
