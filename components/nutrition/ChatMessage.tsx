import { View, Text, StyleSheet } from 'react-native';
import { useShotsyColors } from '@/hooks/useShotsyColors';
import { User, Robot } from 'phosphor-react-native';

export interface ChatMessageProps {
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

export function ChatMessage({ role, content, timestamp }: ChatMessageProps) {
  const colors = useShotsyColors();
  const styles = getStyles(colors);

  const isUser = role === 'user';

  return (
    <View style={[styles.container, isUser && styles.userContainer]}>
      <View style={styles.avatarContainer}>
        {isUser ? (
          <View style={[styles.avatar, styles.userAvatar]}>
            <User size={20} color="#fff" weight="bold" />
          </View>
        ) : (
          <View style={[styles.avatar, styles.assistantAvatar]}>
            <Robot size={20} color="#fff" weight="bold" />
          </View>
        )}
      </View>

      <View style={styles.contentContainer}>
        <View style={[
          styles.bubble,
          isUser ? styles.userBubble : styles.assistantBubble
        ]}>
          <Text style={[
            styles.messageText,
            isUser ? styles.userText : styles.assistantText
          ]}>
            {content}
          </Text>
        </View>
        
        <Text style={[styles.timestamp, isUser && styles.userTimestamp]}>
          {formatTime(timestamp)}
        </Text>
      </View>
    </View>
  );
}

function formatTime(date: Date): string {
  return date.toLocaleTimeString('pt-BR', {
    hour: '2-digit',
    minute: '2-digit',
  });
}

const getStyles = (colors: any) => StyleSheet.create({
  container: {
    flexDirection: 'row',
    marginBottom: 16,
    gap: 12,
  },
  userContainer: {
    flexDirection: 'row-reverse',
  },
  avatarContainer: {
    paddingTop: 4,
  },
  avatar: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
  },
  userAvatar: {
    backgroundColor: colors.primary,
  },
  assistantAvatar: {
    backgroundColor: colors.accent,
  },
  contentContainer: {
    flex: 1,
    gap: 4,
  },
  bubble: {
    borderRadius: 16,
    padding: 14,
    maxWidth: '85%',
  },
  userBubble: {
    backgroundColor: colors.primary,
    alignSelf: 'flex-end',
    borderBottomRightRadius: 4,
  },
  assistantBubble: {
    backgroundColor: colors.card,
    borderWidth: 1,
    borderColor: colors.border,
    borderBottomLeftRadius: 4,
  },
  messageText: {
    fontSize: 15,
    lineHeight: 22,
  },
  userText: {
    color: '#fff',
  },
  assistantText: {
    color: colors.text,
  },
  timestamp: {
    fontSize: 11,
    color: colors.textSecondary,
    paddingHorizontal: 8,
  },
  userTimestamp: {
    textAlign: 'right',
  },
});

