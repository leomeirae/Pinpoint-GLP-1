import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { UserInsight, getInsightIcon, getInsightColor } from '@/lib/types/insights';

interface Props {
  insight: UserInsight;
  onPress?: () => void;
  onDismiss?: () => void;
}

export const InsightCard: React.FC<Props> = ({ insight, onPress, onDismiss }) => {
  const color = getInsightColor(insight.type);
  const icon = getInsightIcon(insight.type);

  return (
    <TouchableOpacity
      style={[styles.card, !insight.is_read && styles.unread]}
      onPress={onPress}
      activeOpacity={0.7}
    >
      <View style={[styles.iconContainer, { backgroundColor: color + '20' }]}>
        <Text style={styles.icon}>{icon}</Text>
      </View>

      <View style={styles.content}>
        <Text style={styles.title}>{insight.title}</Text>
        <Text style={styles.description} numberOfLines={2}>{insight.description}</Text>

        <View style={styles.footer}>
          <Text style={styles.confidence}>{Math.round(insight.confidence * 100)}% confident</Text>
          {onDismiss && (
            <TouchableOpacity onPress={onDismiss} hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}>
              <Text style={styles.dismiss}>Dismiss</Text>
            </TouchableOpacity>
          )}
        </View>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: { flexDirection: 'row', backgroundColor: '#fff', borderRadius: 12, padding: 16, marginBottom: 12, gap: 12 },
  unread: { borderLeftWidth: 3, borderLeftColor: '#3B82F6' },
  iconContainer: { width: 40, height: 40, borderRadius: 20, justifyContent: 'center', alignItems: 'center' },
  icon: { fontSize: 20 },
  content: { flex: 1, gap: 4 },
  title: { fontSize: 15, fontWeight: '600', color: '#1a1a1a' },
  description: { fontSize: 14, color: '#666', lineHeight: 20 },
  footer: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: 4 },
  confidence: { fontSize: 12, color: '#999' },
  dismiss: { fontSize: 13, color: '#3B82F6', fontWeight: '500' },
});
