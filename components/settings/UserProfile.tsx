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
          <Image source={{ uri: user.imageUrl }} style={styles.avatar} />
        ) : (
          <View style={[styles.avatarPlaceholder, { backgroundColor: colors.primary }]}>
            <Text style={[styles.initials, { color: colors.isDark ? colors.text : '#FFFFFF' }]}>
              {getInitials(userName)}
            </Text>
          </View>
        )}

        <View style={styles.info}>
          <Text style={[styles.name, { color: colors.text }]}>{userName}</Text>
          {userEmail && (
            <Text style={[styles.email, { color: colors.textSecondary }]}>{userEmail}</Text>
          )}
        </View>

        <Text style={[styles.arrow, { color: colors.textSecondary }]}>›</Text>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  arrow: {
    fontSize: 28,
    fontWeight: '300',
  },
  avatar: {
    borderRadius: 28,
    height: 56,
    width: 56,
  },
  avatarPlaceholder: {
    alignItems: 'center',
    borderRadius: 28,
    height: 56,
    justifyContent: 'center',
    width: 56,
  },
  container: {
    borderRadius: 12,
    marginBottom: 24,
    marginHorizontal: 16,
    overflow: 'hidden',
  },
  content: {
    alignItems: 'center',
    flexDirection: 'row',
    padding: 16,
  },
  email: {
    fontSize: 14,
    fontWeight: '500',
  },
  info: {
    flex: 1,
    marginLeft: 16,
  },
  initials: {
    fontSize: 20,
    fontWeight: '700',
  },
  name: {
    fontSize: 18,
    fontWeight: '700',
    marginBottom: 2,
  },
});
