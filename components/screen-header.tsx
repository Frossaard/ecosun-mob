import { StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

interface ScreenHeaderProps {
  title: string;
  subtitle?: string;
  step?: string;
}

export function ScreenHeader({ title, subtitle, step }: ScreenHeaderProps) {
  return (
    <SafeAreaView edges={['top']} style={styles.safe}>
      <View style={styles.header}>
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
