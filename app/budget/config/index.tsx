import { StyleSheet } from 'react-native';

import ParallaxScrollView from '@/components/parallax-scroll-view';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';

export default function ConfigInicialScreen() {
  return (
    <ParallaxScrollView
      headerBackgroundColor={{ light: '#E9F3FF', dark: '#0B1220' }}
      headerImage={<ThemedView style={{ height: 1 }} />}> 
      <ThemedView style={styles.container}>
        <ThemedText type="title" style={styles.title}>
          Inicial
        </ThemedText>
        <ThemedText style={styles.body}>
          Esta área organiza as informações base do seu orçamento de energia solar.
        </ThemedText>

        <ThemedView style={styles.card}>
          <ThemedText type="defaultSemiBold" style={styles.cardTitle}>
            Dados do projeto
          </ThemedText>
          <ThemedText style={styles.cardText}>
            • CEP e cidade
            {'\n'}• Tipo de telhado
            {'\n'}• Consumo estimado
            {'\n'}• Objetivo: economia e sustentabilidade
          </ThemedText>
        </ThemedView>

        <ThemedView style={styles.card}>
          <ThemedText type="defaultSemiBold" style={styles.cardTitle}>
            Próximos passos
          </ThemedText>
          <ThemedText style={styles.cardText}>
            1) Revisar o kit sugerido
            {'\n'}2) Confirmar dados técnicos
            {'\n'}3) Solicitar contato para visita/validação
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

