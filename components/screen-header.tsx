import { Pressable, StyleSheet, Text, View } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';

interface ScreenHeaderProps {
  title: string;
  subtitle?: string;
  step?: string;
  showBack?: boolean;
  showMenu?: boolean;
  onMenu?: () => void;
  onBack?: () => void;
}

export function ScreenHeader({ title, subtitle, step, showBack = false, showMenu = false, onMenu, onBack }: ScreenHeaderProps) {
  const router = useRouter();

  return (
    <SafeAreaView edges={['top']} style={styles.safe}>
      <View style={styles.header}>
        {showMenu ? (
          <Pressable accessibilityLabel="Abrir configurações" onPress={onMenu} hitSlop={8} style={styles.menuButton}>
            <MaterialIcons name="settings" size={23} color="#fff" />
          </Pressable>
        ) : null}
        {showBack ? (
          <MaterialIcons
            accessibilityLabel="Voltar"
            name="arrow-back"
            size={26}
            color="#fff"
            onPress={onBack ?? (() => router.back())}
            style={styles.back}
          />
        ) : null}
        {step ? <Text style={styles.step}>{step}</Text> : null}
        <Text style={styles.title}>{title}</Text>
        {subtitle ? <Text style={styles.subtitle}>{subtitle}</Text> : null}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    backgroundColor: '#rgb(6, 79, 104)',
  },
  header: {
    paddingHorizontal: 24,
    paddingTop: 16,
    paddingBottom: 28,
    backgroundColor: '#rgb(6, 79, 104)',
  },
  back: {
    marginBottom: 16,
  },
  menuButton: {
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.14)',
    borderRadius: 12,
    height: 40,
    justifyContent: 'center',
    marginBottom: 16,
    width: 40,
  },
  step: {
    alignSelf: 'flex-start',
    color: '#E0ECFF',
    fontSize: 12,
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: 0.8,
    marginBottom: 10,
  },
  title: {
    color: '#fff',
    fontSize: 30,
    fontWeight: '800',
    letterSpacing: -0.5,
  },
  subtitle: {
    color: '#E7F0FF',
    fontSize: 15,
    marginTop: 8,
    lineHeight: 22,
    maxWidth: 340,
  },
});
