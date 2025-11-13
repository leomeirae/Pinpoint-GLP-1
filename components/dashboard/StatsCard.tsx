import { View, Text, StyleSheet } from 'react-native';
import { useColors } from '@/constants/colors';

interface StatsCardProps {
  icon: string;
  label: string;
  value: string;
  subtitle?: string;
}

export function StatsCard({ icon, label, value, subtitle }: StatsCardProps) {
  const colors = useColors();
  const styles = getStyles(colors);

  return (
    <View style={styles.card}>
      <Text style={styles.icon}>{icon}</Text>
      <Text style={styles.label}>{label}</Text>
      <Text style={styles.value}>{value}</Text>
      {subtitle && <Text style={styles.subtitle}>{subtitle}</Text>}
    </View>
  );
}

const getStyles = (colors: any) =>
  StyleSheet.create({
    card: {
      alignItems: 'center',
      backgroundColor: colors.card,
      borderRadius: 16,
      flex: 1,
      minHeight: 120,
      padding: 16,
    },
    icon: {
      fontSize: 32,
      marginBottom: 8,
    },
    label: {
      color: colors.textMuted,
      fontSize: 12,
      marginBottom: 4,
    },
    subtitle: {
      color: colors.textSecondary,
      fontSize: 10,
      marginTop: 4,
    },
    value: {
      color: colors.text,
      fontSize: 24,
      fontWeight: 'bold',
    },
  });
