import { useEffect } from 'react';
import { Tabs, useRouter } from 'expo-router';
import { View, ActivityIndicator } from 'react-native';
import { ClipboardText, Syringe, ChartLineUp, Calendar, GearSix } from 'phosphor-react-native';
import { useShotsyColors } from '@/hooks/useShotsyColors';
import { useAuth } from '@/lib/clerk';

export default function Layout() {
  const colors = useShotsyColors();
  const { isSignedIn, isLoaded } = useAuth();
  const router = useRouter();

  // Auth Guard: Redireciona para tela inicial se não estiver autenticado
  useEffect(() => {
    if (isLoaded && !isSignedIn) {
      console.log('User not authenticated, redirecting to welcome...');
      router.replace('/');
    }
  }, [isSignedIn, isLoaded]);

  // Mostrar loading enquanto verifica autenticação
  if (!isLoaded) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: colors.background }}>
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    );
  }

  // Se não estiver autenticado, não renderizar as tabs
  if (!isSignedIn) {
    return null;
  }

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarShowLabel: false,
        tabBarActiveTintColor: colors.primary,
        tabBarInactiveTintColor: colors.textSecondary,
        tabBarStyle: {
          backgroundColor: colors.card,
          borderTopColor: colors.border,
        },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{ href: null }} // Esconde do tab bar
      />
      <Tabs.Screen
        name="dashboard"
        options={{
          title: 'Resumo',
          tabBarIcon: ({ color, focused }) => (
            <ClipboardText
              size={28}
              color={color}
              weight={focused ? 'fill' : 'regular'}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="injections"
        options={{
          title: 'Injeções',
          tabBarIcon: ({ color, focused }) => (
            <Syringe
              size={28}
              color={color}
              weight={focused ? 'fill' : 'regular'}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="results"
        options={{
          title: 'Resultados',
          tabBarIcon: ({ color, focused }) => (
            <ChartLineUp
              size={28}
              color={color}
              weight={focused ? 'fill' : 'regular'}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="calendar"
        options={{
          title: 'Calendário',
          tabBarIcon: ({ color, focused }) => (
            <Calendar
              size={28}
              color={color}
              weight={focused ? 'fill' : 'regular'}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="settings"
        options={{
          title: 'Ajustes',
          tabBarIcon: ({ color, focused }) => (
            <GearSix
              size={28}
              color={color}
              weight={focused ? 'fill' : 'regular'}
            />
          ),
        }}
      />

      {/* Telas adicionais que NÃO devem aparecer no tab bar */}
      <Tabs.Screen
        name="add-application"
        options={{ href: null }}
      />
      <Tabs.Screen
        name="add-medication"
        options={{ href: null }}
      />
      <Tabs.Screen
        name="add-side-effect"
        options={{ href: null }}
      />
      <Tabs.Screen
        name="add-weight"
        options={{ href: null }}
      />
      <Tabs.Screen
        name="notification-settings"
        options={{ href: null }}
      />
      <Tabs.Screen
        name="profile"
        options={{ href: null }}
      />
    </Tabs>
  );
}