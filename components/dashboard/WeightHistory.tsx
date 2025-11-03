import { View, Text, StyleSheet } from 'react-native';
import { useColors } from '@/constants/colors';
import { WeightLog } from '@/lib/types';

interface WeightHistoryProps {
  data: WeightLog[];
}

export function WeightHistory({ data }: WeightHistoryProps) {
  const colors = useColors();
  if (data.length === 0) {
    return null;
  }

  // Últimos 5 registros
  const recentLogs = data.slice(0, 5);

  const styles = getStyles(colors);

  return (
    <View style={styles.container}>
      {recentLogs.map((log, index) => {
        // Comparar com o peso anterior (mais antigo)
        const previousLog = index < recentLogs.length - 1 ? recentLogs[index + 1] : null;
        const diff = previousLog ? log.weight - previousLog.weight : 0;
        
        // Formatar data de forma mais amigável
        const logDate = new Date(log.date);
        const today = new Date();
        const yesterday = new Date(today);
        yesterday.setDate(yesterday.getDate() - 1);
        
        let dateStr = '';
        if (logDate.toDateString() === today.toDateString()) {
          dateStr = 'Hoje';
        } else if (logDate.toDateString() === yesterday.toDateString()) {
          dateStr = 'Ontem';
        } else {
          dateStr = logDate.toLocaleDateString('pt-BR', { 
            day: '2-digit', 
            month: 'short',
            year: logDate.getFullYear() !== today.getFullYear() ? 'numeric' : undefined
          });
        }
        
        const styles = getStyles(colors);

        return (
          <View key={log.id} style={styles.timelineItem}>
            <View style={[
              styles.timelineDot,
              diff < 0 && styles.timelineDotPositive,
              diff > 0 && styles.timelineDotNegative,
            ]} />
            <View style={styles.timelineContent}>
              <View style={styles.timelineHeader}>
                <Text style={styles.timelineDate}>{dateStr}</Text>
                <Text style={styles.timelineWeight}>{log.weight}kg</Text>
              </View>
              {diff !== 0 && (
                <Text style={[styles.timelineDiff, diff < 0 ? styles.diffPositive : styles.diffNegative]}>
                  {diff < 0 ? '↓' : '↑'} {Math.abs(diff).toFixed(1)}kg {diff < 0 ? 'perdido' : 'ganho'}
                </Text>
              )}
              {log.notes && <Text style={styles.timelineNotes}>{log.notes}</Text>}
            </View>
          </View>
        );
      })}
    </View>
  );
}

const getStyles = (colors: any) => StyleSheet.create({
  container: {
    padding: 16,
  },
  timelineItem: {
    flexDirection: 'row',
    marginBottom: 16,
  },
  timelineDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: colors.primary,
    marginRight: 12,
    marginTop: 4,
  },
  timelineDotPositive: {
    backgroundColor: colors.success, // Verde para peso perdido
  },
  timelineDotNegative: {
    backgroundColor: colors.error, // Vermelho para peso ganho
  },
  timelineContent: {
    flex: 1,
  },
  timelineHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  timelineDate: {
    fontSize: 14,
    color: colors.textSecondary,
  },
  timelineWeight: {
    fontSize: 16,
    fontWeight: 'bold',
    color: colors.text,
  },
  timelineDiff: {
    fontSize: 12,
    fontWeight: '600',
    marginBottom: 4,
  },
  diffPositive: {
    color: colors.success,
  },
  diffNegative: {
    color: colors.error,
  },
  timelineNotes: {
    fontSize: 12,
    color: colors.textMuted,
    fontStyle: 'italic',
  },
});





