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
        <Text style={styles.description} numberOfLines={2}>
          {insight.description}
        </Text>

        <View style={styles.footer}>
          <Text style={styles.confidence}>{Math.round(insight.confidence * 100)}% confident</Text>
          {onDismiss && (
            <TouchableOpacity
              onPress={onDismiss}
              hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
            >
              <Text style={styles.dismiss}>Dismiss</Text>
            </TouchableOpacity>
          )}
        </View>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#fff',
    borderRadius: 12,
    flexDirection: 'row',
    gap: 12,
    marginBottom: 12,
    padding: 16,
  },
  confidence: { color: '#999', fontSize: 12 },
  content: { flex: 1, gap: 4 },
  description: { color: '#666', fontSize: 14, lineHeight: 20 },
  dismiss: { color: '#3B82F6', fontSize: 13, fontWeight: '500' },
  footer: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 4,
  },
  icon: { fontSize: 20 },
  iconContainer: {
    alignItems: 'center',
    borderRadius: 20,
    height: 40,
    justifyContent: 'center',
    width: 40,
  },
  title: { color: '#1a1a1a', fontSize: 15, fontWeight: '600' },
  unread: { borderLeftColor: '#3B82F6', borderLeftWidth: 3 },
});
