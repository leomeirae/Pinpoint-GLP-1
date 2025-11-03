import { View, Text, StyleSheet } from 'react-native';
import { Info } from 'phosphor-react-native';
import { useShotsyColors } from '@/hooks/useShotsyColors';

export function InstructionsCard() {
  const colors = useShotsyColors();
  const styles = getStyles(colors);

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Info size={24} color={colors.primary} weight="bold" />
        <Text style={styles.title}>Como usar</Text>
      </View>
      
      <View style={styles.content}>
        <Text style={styles.instruction}>
          🗣️ <Text style={styles.bold}>Descreva</Text> o que você comeu hoje
        </Text>
        <Text style={styles.instruction}>
          📱 Pode ser por <Text style={styles.bold}>texto</Text> ou <Text style={styles.bold}>áudio</Text>
        </Text>
        <Text style={styles.instruction}>
          🤖 A IA vai <Text style={styles.bold}>resumir</Text> e você confirma
        </Text>
      </View>

      <Text style={styles.example}>
        Exemplo: "No café da manhã tomei café com leite e pão integral. No almoço comi arroz, feijão e frango grelhado."
      </Text>
    </View>
  );
}

const getStyles = (colors: any) => StyleSheet.create({
  container: {
    backgroundColor: colors.card,
    borderRadius: 16,
    padding: 20,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: colors.border,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
    gap: 8,
  },
  title: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.text,
  },
  content: {
    gap: 12,
    marginBottom: 16,
  },
  instruction: {
    fontSize: 15,
    color: colors.text,
    lineHeight: 22,
  },
  bold: {
    fontWeight: '600',
    color: colors.primary,
  },
  example: {
    fontSize: 13,
    color: colors.textSecondary,
    fontStyle: 'italic',
    lineHeight: 19,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },
});

