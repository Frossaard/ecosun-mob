import { StyleSheet } from 'react-native';

import ParallaxScrollView from '@/components/parallax-scroll-view';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';

export default function SobreNosScreen() {
  return (
    <ParallaxScrollView
      headerBackgroundColor={{ light: '#E9F3FF', dark: '#0B1220' }}
      headerImage={<ThemedView style={{ height: 1 }} />}>
      <ThemedView style={styles.container}>
        <ThemedText type="title" style={styles.title}>
          Sobre nós
        </ThemedText>
        <ThemedText style={styles.body}>
          Somos uma equipe focada em simplificar a adoção de energia solar, do orçamento à
          instalação.
        </ThemedText>

        <ThemedView style={styles.card}>
          <ThemedText type="defaultSemiBold" style={styles.cardTitle}>
            Nosso compromisso
          </ThemedText>
          <ThemedText style={styles.cardText}>
            • Transparência nos custos e no dimensionamento
            {'\n'}• Atendimento humano e orientado ao seu caso
            {'\n'}• Qualidade técnica para garantir desempenho e segurança
          </ThemedText>
        </ThemedView>

        <ThemedView style={styles.card}>
          <ThemedText type="defaultSemiBold" style={styles.cardTitle}>
            Por que usamos kits prontos?
          </ThemedText>
          <ThemedText style={styles.cardText}>
            Para acelerar a criação do orçamento e reduzir o tempo entre sua solicitação e
            sua tomada de decisão.
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

