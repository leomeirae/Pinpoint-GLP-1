import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';
import { useUser } from '@clerk/clerk-expo';
import { useShotsyColors } from '@/hooks/useShotsyColors';
import { router } from 'expo-router';

export const UserProfile: React.FC = () => {
  const { user } = useUser();
  const colors = useShotsyColors();

  const handlePress = () => {
    router.push('/(tabs)/profile');
  };

  const getInitials = (name: string): string => {
    const parts = name.split(' ');
    if (parts.length >= 2) {
      return `${parts[0][0]}${parts[parts.length - 1][0]}`.toUpperCase();
    }
    return name.substring(0, 2).toUpperCase();
  };

  const userName = user?.fullName || user?.firstName || 'Usuário';
  const userEmail = user?.primaryEmailAddress?.emailAddress || '';

  return (
    <TouchableOpacity
      style={[styles.container, { backgroundColor: colors.card }]}
      onPress={handlePress}
      activeOpacity={0.7}
    >
      <View style={styles.content}>
        {user?.imageUrl ? (
          <Image
            source={{ uri: user.imageUrl }}
            style={styles.avatar}
          />
        ) : (
          <View style={[styles.avatarPlaceholder, { backgroundColor: colors.primary }]}>
            <Text style={[styles.initials, { color: colors.isDark ? colors.text : '#FFFFFF' }]}>{getInitials(userName)}</Text>
          </View>
        )}

        <View style={styles.info}>
          <Text style={[styles.name, { color: colors.text }]}>{userName}</Text>
          {userEmail && (
            <Text style={[styles.email, { color: colors.textSecondary }]}>
              {userEmail}
            </Text>
          )}
        </View>

        <Text style={[styles.arrow, { color: colors.textSecondary }]}>›</Text>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    marginHorizontal: 16,
    marginBottom: 24,
    borderRadius: 12,
    overflow: 'hidden',
  },
  content: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
  },
  avatar: {
    width: 56,
    height: 56,
    borderRadius: 28,
  },
  avatarPlaceholder: {
    width: 56,
    height: 56,
    borderRadius: 28,
    justifyContent: 'center',
    alignItems: 'center',
  },
  initials: {
    fontSize: 20,
    fontWeight: '700',
  },
  info: {
    flex: 1,
    marginLeft: 16,
  },
  name: {
    fontSize: 18,
    fontWeight: '700',
    marginBottom: 2,
  },
  email: {
    fontSize: 14,
    fontWeight: '500',
  },
  arrow: {
    fontSize: 28,
    fontWeight: '300',
  },
});
