import React, { useState, useRef } from 'react';
import { View, Text, StyleSheet, FlatList, Dimensions, TouchableOpacity } from 'react-native';
import { useShotsyColors } from '@/hooks/useShotsyColors';
import { useTheme } from '@/lib/theme-context';
import { ShotsyButton } from '@/components/ui/shotsy-button';
import { AppIcon, InjectionsIcon, ResultsIcon, TargetIcon } from '@/components/ui/icons';

interface WelcomeScreenProps {
  onNext: () => void;
}

const { width } = Dimensions.get('window');

const slides = [
  {
    id: '1',
    icon: 'syringe',
    title: 'Bem-vindo ao Shotsy',
    description: 'Seu companheiro completo para acompanhar sua jornada com medicamentos GLP-1',
  },
  {
    id: '2',
    icon: 'chartLine',
    title: 'Acompanhe seu progresso',
    description: 'Registre aplicações, peso, efeitos colaterais e muito mais em um só lugar',
  },
  {
    id: '3',
    icon: 'target',
    title: 'Alcance seus objetivos',
    description: 'Defina metas, receba lembretes e mantenha-se motivado ao longo do caminho',
  },
];

export function WelcomeScreen({ onNext }: WelcomeScreenProps) {
  const colors = useShotsyColors();
  const { currentAccent } = useTheme();
  const [currentIndex, setCurrentIndex] = useState(0);
  const flatListRef = useRef<FlatList>(null);

  const handleNext = () => {
    if (currentIndex < slides.length - 1) {
      flatListRef.current?.scrollToIndex({ index: currentIndex + 1 });
    } else {
      onNext();
    }
  };

  const handleScroll = (event: any) => {
    const slideIndex = Math.round(event.nativeEvent.contentOffset.x / width);
    setCurrentIndex(slideIndex);
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
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
            <View style={styles.content}>
              <AppIcon name={item.icon as any} size={120} color={colors.text} />
              <Text style={[styles.title, { color: colors.text }]}>{item.title}</Text>
              <Text style={[styles.description, { color: colors.textSecondary }]}>
                {item.description}
              </Text>
            </View>
          </View>
        )}
      />

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

        <TouchableOpacity style={styles.termsContainer}>
          <Text style={[styles.termsText, { color: colors.textMuted }]}>
            Ao continuar, você concorda com nossos{' '}
            <Text style={[styles.termsLink, { color: currentAccent }]}>
              Termos de Uso
            </Text>{' '}
            e{' '}
            <Text style={[styles.termsLink, { color: currentAccent }]}>
              Política de Privacidade
            </Text>
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  slide: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 40,
  },
  content: {
    alignItems: 'center',
    maxWidth: 400,
  },
  emoji: {
    // fontSize: 120, // Removed as AppIcon handles its own size
    marginBottom: 32,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 16,
  },
  description: {
    fontSize: 18,
    textAlign: 'center',
    lineHeight: 28,
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
    marginBottom: 32,
  },
  dot: {
    height: 8,
    borderRadius: 4,
  },
  buttonContainer: {
    marginBottom: 16,
  },
  termsContainer: {
    alignItems: 'center',
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