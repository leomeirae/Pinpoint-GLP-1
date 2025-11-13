import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useColors } from '@/constants/colors';

interface CollapsibleSectionProps {
  title: string;
  icon?: string;
  children: React.ReactNode;
  defaultExpanded?: boolean;
}

export function CollapsibleSection({
  title,
  icon,
  children,
  defaultExpanded = false,
}: CollapsibleSectionProps) {
  const colors = useColors();
  const [isExpanded, setIsExpanded] = useState(defaultExpanded);

  const styles = getStyles(colors);

  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={styles.header}
        onPress={() => setIsExpanded(!isExpanded)}
        activeOpacity={0.7}
      >
        <View style={styles.headerContent}>
          {icon && <Text style={styles.icon}>{icon}</Text>}
          <Text style={styles.title}>{title}</Text>
        </View>
        <Text style={styles.chevron}>{isExpanded ? '▼' : '▶'}</Text>
      </TouchableOpacity>

      {isExpanded && <View style={styles.content}>{children}</View>}
    </View>
  );
}

const getStyles = (colors: any) =>
  StyleSheet.create({
    chevron: {
      color: colors.textMuted,
      fontSize: 14,
      marginLeft: 12,
    },
    container: {
      marginBottom: 16,
    },
    content: {
      marginTop: 12,
    },
    header: {
      alignItems: 'center',
      backgroundColor: colors.card,
      borderLeftColor: colors.primary,
      borderLeftWidth: 4,
      borderRadius: 12,
      flexDirection: 'row',
      justifyContent: 'space-between',
      padding: 16,
    },
    headerContent: {
      alignItems: 'center',
      flexDirection: 'row',
      flex: 1,
    },
    icon: {
      fontSize: 20,
      marginRight: 12,
    },
    title: {
      color: colors.text,
      fontSize: 16,
      fontWeight: '600',
    },
  });
