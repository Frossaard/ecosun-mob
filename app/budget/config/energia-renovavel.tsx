import { StyleSheet } from 'react-native';

import ParallaxScrollView from '@/components/parallax-scroll-view';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';

export default function EnergiaRenovavelScreen() {
  return (
    <ParallaxScrollView
      headerBackgroundColor={{ light: '#E9F3FF', dark: '#0B1220' }}
      headerImage={<ThemedView style={{ height: 1 }} />}>
      <ThemedView style={styles.container}>
        <ThemedText type="title" style={styles.title}>
          Por que usar energia renovável
        </ThemedText>
        <ThemedText style={styles.body}>
          Reduza sua dependência da rede e contribua para um futuro mais sustentável.
        </ThemedText>

        <ThemedView style={styles.card}>
          <ThemedText type="defaultSemiBold" style={styles.cardTitle}>
            Benefícios
          </ThemedText>
          <ThemedText style={styles.cardText}>
            • Economia na conta de luz
            {'\n'}• Valorização do imóvel
            {'\n'}• Menor impacto ambiental
            {'\n'}• Energia mais inteligente e previsível
          </ThemedText>
        </ThemedView>

        <ThemedView style={styles.card}>
          <ThemedText type="defaultSemiBold" style={styles.cardTitle}>
            Como isso se conecta ao seu orçamento?
          </ThemedText>
          <ThemedText style={styles.cardText}>
            Os kits são dimensionados para seu consumo estimado, ajudando a criar um
            orçamento claro e objetivo.
          </ThemedText>
        </ThemedView>
      </ThemedView>
    </ParallaxScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 16,
    paddingTop: 10,
    paddingBottom: 40,
    gap: 12,
  },
  title: {
    marginTop: 6,
  },
  body: {
    opacity: 0.85,
  },
  card: {
    borderRadius: 16,
    padding: 14,
    backgroundColor: 'rgba(0,0,0,0.03)',
  },
  cardTitle: {
    marginBottom: 6,
  },
  cardText: {
    opacity: 0.9,
  },
});

