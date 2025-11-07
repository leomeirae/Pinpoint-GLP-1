import React, { useEffect, useRef, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  Linking,
  FlatList,
  NativeSyntheticEvent,
  NativeScrollEvent,
  useWindowDimensions,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { useColors } from '@/hooks/useShotsyColors';
import { ShotsyButton } from '@/components/ui/shotsy-button';
import { useAuth } from '@/lib/clerk';
import { useUser } from '@/hooks/useUser';
import { trackEvent } from '@/lib/analytics';
import { createLogger } from '@/lib/logger';

const logger = createLogger('Welcome');

// Carousel slides data
const CAROUSEL_SLIDES = [
  {
    id: '1',
    image: require('../../assets/imagens_carrossel_tela_inicial/imagem_1 (1).png'),
    title: 'Aproveite ao máximo seu medicamento GLP-1',
    subtitle:
      'Pinpoint GLP-1 foi projetado para ajudar você a entender e acompanhar suas aplicações semanais.',
  },
  {
    id: '2',
    image: require('../../assets/imagens_carrossel_tela_inicial/imagem_2 (1).png'),
    title: 'Acompanhe seus resultados',
    subtitle:
      'Visualize gráficos de peso, níveis estimados do medicamento e progresso ao longo do tempo.',
  },
  {
    id: '3',
    image: require('../../assets/imagens_carrossel_tela_inicial/imagem_3 (1).png'),
    title: 'Registre suas aplicações',
    subtitle:
      'Nunca perca uma aplicação com lembretes inteligentes e histórico completo de injeções.',
  },
];

export default function WelcomeScreen() {
  const colors = useColors();
  const { isSignedIn, isLoaded } = useAuth();
  const { user } = useUser();
  const { width: screenWidth } = useWindowDimensions();

  // Carousel state and refs
  const [currentIndex, setCurrentIndex] = useState(0);
  const flatListRef = useRef<FlatList>(null);

  // GUARD: Se já estiver logado, redirecionar
  useEffect(() => {
    if (!isLoaded) return;

    // Se estiver logado e já completou onboarding, ir para dashboard
    if (isSignedIn && user?.onboarding_completed) {
      logger.info('User authenticated with completed onboarding, redirecting to dashboard');
      router.replace('/(tabs)');
      return;
    }

    // Se estiver logado mas não completou onboarding, ir para onboarding
    if (isSignedIn && !user?.onboarding_completed) {
      logger.info('User authenticated without onboarding, redirecting to onboarding');
      router.replace('/(auth)/onboarding-flow');
      return;
    }
  }, [isLoaded, isSignedIn, user, router]);

  // Handle scroll to track current slide
  const handleScroll = (event: NativeSyntheticEvent<NativeScrollEvent>) => {
    const offsetX = event.nativeEvent.contentOffset.x;
    const index = Math.round(offsetX / screenWidth);
    setCurrentIndex(index);
  };

  // Navigate to next slide or start if on last slide
  const handleNext = () => {
    if (currentIndex < CAROUSEL_SLIDES.length - 1) {
      const nextIndex = currentIndex + 1;
      flatListRef.current?.scrollToIndex({
        index: nextIndex,
        animated: true,
      });
      setCurrentIndex(nextIndex);

      trackEvent('welcome_carousel_next', {
        from_slide: currentIndex,
        to_slide: nextIndex,
      });
    } else {
      handleStart();
    }
  };

  const handleStart = () => {
    trackEvent('cta_start_click', {
      from: 'welcome',
      carousel_slide: currentIndex,
    });

    if (!isLoaded) {
      return;
    }

    // Se não estiver logado, ir para sign-up
    router.push('/(auth)/sign-up');
  };

  const handleOpenTerms = () => {
    trackEvent('legal_open', { which: 'terms' });
    Linking.openURL('https://pinpointglp1.app/terms');
  };

  const handleOpenPrivacy = () => {
    trackEvent('legal_open', { which: 'privacy' });
    Linking.openURL('https://pinpointglp1.app/privacy');
  };

  // Se já estiver logado, não mostrar nada (será redirecionado)
  if (isLoaded && isSignedIn) {
    return null;
  }

  // Render individual carousel item
  const renderCarouselItem = ({ item }: { item: (typeof CAROUSEL_SLIDES)[0] }) => (
    <View style={[styles.carouselItem, { width: screenWidth }]}>
      <Image
        source={item.image}
        style={styles.slideImage}
        resizeMode="contain"
        accessible={true}
        accessibilityLabel={`${item.title} - Slide ${CAROUSEL_SLIDES.indexOf(item) + 1}`}
      />
    </View>
  );

  // Get current slide data for dynamic content
  const currentSlide = CAROUSEL_SLIDES[currentIndex];
  const isLastSlide = currentIndex === CAROUSEL_SLIDES.length - 1;

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      {/* Horizontal Carousel with FlatList */}
      <View style={styles.carouselContainer}>
        <FlatList
          ref={flatListRef}
          data={CAROUSEL_SLIDES}
          renderItem={renderCarouselItem}
          keyExtractor={(item) => item.id}
          horizontal
          pagingEnabled
          showsHorizontalScrollIndicator={false}
          onScroll={handleScroll}
          scrollEventThrottle={16}
          decelerationRate="fast"
          snapToAlignment="center"
          snapToInterval={screenWidth}
          bounces={false}
          getItemLayout={(_, index) => ({
            length: screenWidth,
            offset: screenWidth * index,
            index,
          })}
        />
      </View>

      {/* Dynamic Content based on current slide */}
      <View style={[styles.contentWrapper, { backgroundColor: colors.background }]}>
        <Text style={[styles.title, { color: colors.text }]}>{currentSlide.title}</Text>
        <Text style={[styles.subtitle, { color: colors.textSecondary }]}>
          {currentSlide.subtitle}
        </Text>

        {/* Pagination Dots */}
        <View style={styles.pagination}>
          {CAROUSEL_SLIDES.map((_, index) => (
            <View
              key={index}
              style={[
                styles.dot,
                {
                  backgroundColor: colors.text,
                  opacity: index === currentIndex ? 1 : 0.3,
                  width: index === currentIndex ? 24 : 8,
                },
              ]}
            />
          ))}
        </View>

        {/* Dynamic CTA Button */}
        <View style={styles.buttonContainer}>
          <ShotsyButton
            title={isLastSlide ? 'Começar' : 'Próximo'}
            onPress={handleNext}
            accessibilityLabel={
              isLastSlide
                ? 'Começar a usar o app'
                : `Ir para o slide ${currentIndex + 2} de ${CAROUSEL_SLIDES.length}`
            }
          />
        </View>

        {/* Terms */}
        <View style={styles.termsContainer}>
          <Text style={[styles.termsText, { color: colors.textSecondary }]}>
            Ao continuar, você concorda com os{' '}
            <Text style={[styles.termsLink, { color: colors.primary }]} onPress={handleOpenTerms}>
              Termos de Uso
            </Text>{' '}
            e a{' '}
            <Text style={[styles.termsLink, { color: colors.primary }]} onPress={handleOpenPrivacy}>
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
  carouselContainer: {
    flex: 1,
    justifyContent: 'center',
  },
  carouselItem: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 24,
  },
  slideImage: {
    width: '100%',
    height: '100%',
  },
  contentWrapper: {
    paddingHorizontal: 24,
    paddingBottom: 32,
  },
  title: {
    fontSize: 36,
    fontWeight: '700',
    textAlign: 'center',
    marginBottom: 16,
    lineHeight: 44,
  },
  subtitle: {
    fontSize: 18,
    textAlign: 'center',
    marginBottom: 32,
    lineHeight: 28,
  },
  pagination: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 8,
    marginBottom: 24,
    height: 8,
  },
  dot: {
    height: 8,
    borderRadius: 4,
  },
  buttonContainer: {
    marginBottom: 16,
  },
  termsContainer: {
    paddingHorizontal: 12,
  },
  termsText: {
    fontSize: 14,
    textAlign: 'center',
    lineHeight: 20,
  },
  termsLink: {
    fontWeight: '500',
  },
});
