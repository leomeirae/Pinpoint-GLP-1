import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  Dimensions,
  TouchableOpacity,
  Image,
  Linking,
} from 'react-native';
import { useColors } from '@/hooks/useShotsyColors';
import { useTheme } from '@/lib/theme-context';
import { ShotsyButton } from '@/components/ui/shotsy-button';
import { trackEvent } from '@/lib/analytics';

interface WelcomeScreenProps {
  onNext: () => void;
}

const { width } = Dimensions.get('window');

// Slides do carrossel - 4 imagens do Shotsy
const slides = [
  {
    id: '1',
    image: require('../../assets/imagens_carrossel_tela_inicial/imagem_1 (1).png'),
    title: 'Aproveite ao máximo seu medicamento GLP-1',
    subtitle:
      'Pinpoint GLP-1 foi projetado para ajudar você a entender e acompanhar suas aplicações semanais.',
    accessibilityLabel: 'Aproveite ao máximo seu medicamento GLP-1',
  },
  {
    id: '2',
    image: require('../../assets/imagens_carrossel_tela_inicial/imagem_2 (1).png'),
    title: 'Acompanhe com widgets personalizáveis',
    subtitle: 'Nunca perca uma dose com widgets na tela inicial e lembretes por notificação.',
    accessibilityLabel: 'Acompanhe com widgets personalizáveis',
  },
  {
    id: '3',
    image: require('../../assets/imagens_carrossel_tela_inicial/imagem_3 (1).png'),
    title: 'Entenda seu progresso com gráficos bonitos',
    subtitle:
      'Aprenda mais sobre seu medicamento com ferramentas baseadas em resultados de ensaios clínicos.',
    accessibilityLabel: 'Entenda seu progresso com gráficos bonitos',
  },
  {
    id: '4',
    image: require('../../assets/imagens_carrossel_tela_inicial/imagem_4.png'),
    title: 'Personalize o app para combinar com seu estilo',
    subtitle: 'Personalize sua jornada com temas personalizados. Você pode até mudar o ícone!',
    accessibilityLabel: 'Personalize o app para combinar com seu estilo',
  },
];

export function WelcomeScreen({ onNext }: WelcomeScreenProps) {
  const colors = useColors();
  const { currentAccent } = useTheme();
  const [currentIndex, setCurrentIndex] = useState(0);
  const flatListRef = useRef<FlatList>(null);

  // Track carousel view on mount
  useEffect(() => {
    trackEvent('carousel_view', {
      slides: 4,
      source: 'onboarding',
    });
  }, []);

  const handleNext = () => {
    if (currentIndex < slides.length - 1) {
      flatListRef.current?.scrollToIndex({ index: currentIndex + 1 });
      trackEvent('carousel_slide_view', {
        index: currentIndex + 2,
      });
    } else {
      trackEvent('cta_start_click', {
        from: 'onboarding_carousel',
      });
      onNext();
    }
  };

  const handleScroll = (event: any) => {
    const slideIndex = Math.round(event.nativeEvent.contentOffset.x / width);
    setCurrentIndex(slideIndex);
  };

  const handleOpenTerms = () => {
    trackEvent('legal_open', { which: 'terms' });
    Linking.openURL('https://pinpointglp1.app/terms');
  };

  const handleOpenPrivacy = () => {
    trackEvent('legal_open', { which: 'privacy' });
    Linking.openURL('https://pinpointglp1.app/privacy');
  };

  const currentSlide = slides[currentIndex];

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
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
            <View style={styles.imageContainer}>
              <Image
                source={item.image}
                style={styles.appImage}
                resizeMode="contain"
                accessible={true}
                accessibilityLabel={item.accessibilityLabel}
              />
            </View>
          </View>
        )}
      />

      {/* Conteúdo abaixo da imagem */}
      <View style={styles.contentWrapper}>
        {/* Título e Subtítulo */}
        <View style={styles.textContainer}>
          <Text style={[styles.title, { color: colors.text }]}>{currentSlide.title}</Text>
          {currentSlide.subtitle && (
            <Text style={[styles.subtitle, { color: colors.textSecondary }]}>
              {currentSlide.subtitle}
            </Text>
          )}
        </View>

        {/* Pagination dots */}
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

        {/* Botão */}
        <View style={styles.buttonContainer}>
          <ShotsyButton
            title={currentIndex === slides.length - 1 ? 'Começar' : 'Próximo'}
            onPress={handleNext}
          />
        </View>

        {/* Links legais */}
        <TouchableOpacity style={styles.termsContainer}>
          <Text style={[styles.termsText, { color: colors.textSecondary }]}>
            Ao continuar, você concorda com os{'\n'}
            <Text style={[styles.termsLink, { color: currentAccent }]} onPress={handleOpenTerms}>
              Termos de Uso
            </Text>{' '}
            e a{' '}
            <Text style={[styles.termsLink, { color: currentAccent }]} onPress={handleOpenPrivacy}>
              Política de Privacidade
            </Text>
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  appImage: {
    height: '100%',
    width: '100%',
  },
  buttonContainer: {
    marginBottom: 16,
  },
  container: {
    flex: 1,
  },
  contentWrapper: {
    paddingBottom: 40,
    paddingHorizontal: 24,
    paddingTop: 24,
  },
  dot: {
    borderRadius: 4,
    height: 8,
  },
  imageContainer: {
    backgroundColor: 'transparent',
    borderRadius: 20,
    elevation: 8,
    height: width * 1.2,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    width: width * 0.85,
  },
  pagination: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: 8,
    justifyContent: 'center',
    marginBottom: 24,
  },
  slide: {
    alignItems: 'center',
    flex: 1,
    justifyContent: 'center',
    paddingTop: 20,
  },
  subtitle: {
    fontSize: 16,
    lineHeight: 24,
    textAlign: 'center',
  },
  termsContainer: {
    alignItems: 'center',
    paddingHorizontal: 12,
  },
  termsLink: {
    fontWeight: '600',
  },
  termsText: {
    fontSize: 12,
    lineHeight: 18,
    textAlign: 'center',
  },
  textContainer: {
    alignItems: 'center',
    marginBottom: 24,
  },
  title: {
    fontSize: 30,
    fontWeight: 'bold',
    lineHeight: 36,
    marginBottom: 12,
    textAlign: 'center',
  },
});
