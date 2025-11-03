import { useState, useEffect } from 'react';
import { TouchableOpacity, Text, StyleSheet, View, Alert } from 'react-native';
import { 
  useAudioRecorder, 
  RecordingOptions, 
  AudioModule,
} from 'expo-audio';
import { Microphone, Stop } from 'phosphor-react-native';
import { useShotsyColors } from '@/hooks/useShotsyColors';
import * as Haptics from 'expo-haptics';

interface AudioRecorderProps {
  onRecordComplete: (text: string) => void;
  disabled?: boolean;
}

export function AudioRecorder({ onRecordComplete, disabled }: AudioRecorderProps) {
  const colors = useShotsyColors();
  const styles = getStyles(colors);

  // Configure audio recorder with proper options
  const audioRecorder = useAudioRecorder({
    android: {
      extension: '.m4a',
      outputFormat: 2, // MPEG_4
      audioEncoder: 3, // AAC
      sampleRate: 44100,
      numberOfChannels: 2,
      bitRate: 128000,
    },
    ios: {
      extension: '.m4a',
      audioQuality: 0x7F, // High quality
      sampleRate: 44100,
      numberOfChannels: 2,
      bitRate: 128000,
      linearPCMBitDepth: 16,
      linearPCMIsBigEndian: false,
      linearPCMIsFloat: false,
    },
    web: {
      mimeType: 'audio/webm',
      bitsPerSecond: 128000,
    },
  });
  
  const [duration, setDuration] = useState(0);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    
    if (audioRecorder.isRecording) {
      interval = setInterval(() => {
        setDuration(prev => prev + 1);
      }, 1000);
    } else {
      setDuration(0);
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [audioRecorder.isRecording]);

  async function startRecording() {
    try {
      // Request permissions
      const permission = await AudioModule.requestRecordingPermissionsAsync();
      
      if (!permission.granted) {
        Alert.alert(
          'Permissão necessária',
          'Precisamos de acesso ao microfone para gravar áudio.'
        );
        return;
      }

      // Start recording
      await audioRecorder.record();
      
      await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    } catch (err) {
      console.error('Failed to start recording', err);
      Alert.alert('Erro', 'Não foi possível iniciar a gravação');
    }
  }

  async function stopRecording() {
    try {
      const uri = await audioRecorder.stop();
      
      await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);

      // For now, we'll show a placeholder message
      // In a real app, you'd send this to a speech-to-text service
      Alert.alert(
        'Áudio gravado',
        'Por enquanto, use o input de texto. Transcrição de áudio será implementada em breve.',
        [{ text: 'OK' }]
      );

      // TODO: Implement speech-to-text with a service like:
      // - Google Cloud Speech-to-Text
      // - OpenAI Whisper API
      // - Azure Speech Services
      
    } catch (err) {
      console.error('Failed to stop recording', err);
      Alert.alert('Erro', 'Não foi possível parar a gravação');
    }
  }

  function formatDuration(seconds: number): string {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  }

  return (
    <TouchableOpacity
      style={[
        styles.button,
        audioRecorder.isRecording && styles.recordingButton,
        disabled && styles.disabledButton,
      ]}
      onPress={audioRecorder.isRecording ? stopRecording : startRecording}
      disabled={disabled}
    >
      {audioRecorder.isRecording ? (
        <View style={styles.recordingContent}>
          <Stop size={20} color="#fff" weight="fill" />
          <Text style={styles.durationText}>{formatDuration(duration)}</Text>
        </View>
      ) : (
        <Microphone size={20} color={colors.primary} weight="bold" />
      )}
    </TouchableOpacity>
  );
}

const getStyles = (colors: any) => StyleSheet.create({
  button: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: colors.card,
    borderWidth: 2,
    borderColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  recordingButton: {
    backgroundColor: '#EF4444',
    borderColor: '#DC2626',
    paddingHorizontal: 16,
    width: 'auto',
    minWidth: 80,
  },
  disabledButton: {
    opacity: 0.5,
  },
  recordingContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  durationText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
  },
});

