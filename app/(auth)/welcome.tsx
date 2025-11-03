import React, { useState, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
  FlatList,
  Image,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { useShotsyColors } from '@/hooks/useShotsyColors';
import { useTheme } from '@/lib/theme-context';
import { ShotsyButton } from '@/components/ui/shotsy-button';

const { width } = Dimensions.get('window');

// Slides do carrossel
const slides = [
  {
    id: '1',
    image: require('@/assets/imagens_carrossel_tela_inicial/slide-1.png'),
    title: 'Bem-vindo ao Mounjaro Tracker',
    description: 'Seu companheiro completo para acompanhar sua jornada com Mounjaro',
  },
  {
    id: '2',
    image: require('@/assets/imagens_carrossel_tela_inicial/slide-2.png'),
    title: 'Acompanhe seu progresso',
    description: 'Registre aplicações, peso, efeitos colaterais e muito mais em um só lugar',
  },
  {
    id: '3',
    image: require('@/assets/imagens_carrossel_tela_inicial/slide-3.png'),
    title: 'Alcance seus objetivos',
    description: 'Defina metas, receba lembretes e mantenha-se motivado ao longo do caminho',
  },
];

export default function WelcomeScreen() {
  const colors = useShotsyColors();
  const { currentAccent } = useTheme();
  const [currentIndex, setCurrentIndex] = useState(0);
  const flatListRef = useRef<FlatList>(null);

  const handleNext = () => {
    if (currentIndex < slides.length - 1) {
      flatListRef.current?.scrollToIndex({ index: currentIndex + 1 });
    } else {
      router.push('/(auth)/sign-up');
      }
    };

  const handleScroll = (event: any) => {
    const slideIndex = Math.round(event.nativeEvent.contentOffset.x / width);
    setCurrentIndex(slideIndex);
  };

  const handleSkip = () => {
    router.push('/(auth)/sign-up');
  };

  const handleSignIn = () => {
    router.push('/(auth)/sign-in');
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      {/* Header com botão Pular */}
        <View style={styles.header}>
          <TouchableOpacity
            style={[styles.skipButton, { backgroundColor: colors.card }]}
            onPress={handleSkip}
          >
          <Text style={[styles.skipText, { color: colors.primary }]}>Pular</Text>
          </TouchableOpacity>
        </View>

      {/* Carrossel de Imagens */}
      <FlatList
        ref={flatListRef}
        data={slides}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onScroll={handleScroll}
        scrollEventThrottle={16}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={[styles.slide, { width }]}>
            <Image source={item.image} style={styles.image} resizeMode="contain" />
            <View style={styles.textContainer}>
              <Text style={[styles.title, { color: colors.text }]}>{item.title}</Text>
              <Text style={[styles.description, { color: colors.textSecondary }]}>
                {item.description}
              </Text>
            </View>
            </View>
          )}
      />

      {/* Footer com paginação e botões */}
      <View style={styles.footer}>
        <View style={styles.pagination}>
          {slides.map((_, index) => (
            <View
              key={index}
              style={[
                styles.dot,
                {
                  backgroundColor: index === currentIndex ? currentAccent : colors.border,
                  width: index === currentIndex ? 24 : 8,
                },
              ]}
            />
          ))}
        </View>

        <View style={styles.buttonContainer}>
          <ShotsyButton
            title={currentIndex === slides.length - 1 ? 'Começar' : 'Próximo'}
            onPress={handleNext}
          />
        </View>

        <TouchableOpacity style={styles.secondaryButton} onPress={handleSignIn}>
            <Text style={[styles.secondaryButtonText, { color: colors.primary }]}>
              Já tenho conta
            </Text>
          </TouchableOpacity>

          <View style={styles.termsContainer}>
            <Text style={[styles.termsText, { color: colors.textSecondary }]}>
              Ao continuar, você concorda com os{'\n'}
            <Text style={[styles.termsLink, { color: colors.primary }]}>Termos de Uso</Text>
              {' '}e a{' '}
            <Text style={[styles.termsLink, { color: colors.primary }]}>
                Política de Privacidade
              </Text>
            </Text>
          </View>
        </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 10,
    zIndex: 10,
  },
  skipButton: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  skipText: {
    fontSize: 16,
    fontWeight: '600',
  },
  slide: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  image: {
    width: width * 0.85,
    height: width * 0.85,
    marginBottom: 24,
  },
  textContainer: {
    alignItems: 'center',
    maxWidth: 400,
    paddingHorizontal: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 16,
  },
  description: {
    fontSize: 16,
    textAlign: 'center',
    lineHeight: 24,
  },
  footer: {
    paddingHorizontal: 24,
    paddingBottom: 40,
  },
  pagination: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 8,
    marginBottom: 24,
  },
  dot: {
    height: 8,
    borderRadius: 4,
  },
  buttonContainer: {
    marginBottom: 16,
  },
  secondaryButton: {
    paddingVertical: 12,
    alignItems: 'center',
  },
  secondaryButtonText: {
    fontSize: 16,
    fontWeight: '600',
  },
  termsContainer: {
    marginTop: 24,
    paddingHorizontal: 12,
  },
  termsText: {
    fontSize: 12,
    textAlign: 'center',
    lineHeight: 18,
  },
  termsLink: {
    fontWeight: '600',
  },
});
