import { StyleSheet } from 'react-native';

import ParallaxScrollView from '@/components/parallax-scroll-view';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';

export default function MinhaContaScreen() {
  return (
    <ParallaxScrollView
      headerBackgroundColor={{ light: '#E9F3FF', dark: '#0B1220' }}
      headerImage={<ThemedView style={{ height: 1 }} />}>
      <ThemedView style={styles.container}>
        <ThemedText type="title" style={styles.title}>
          Minha conta
        </ThemedText>
        <ThemedText style={styles.body}>
          Informações do usuário para acessar e acompanhar os orçamentos.
        </ThemedText>

        <ThemedView style={styles.card}>
          <ThemedText type="defaultSemiBold" style={styles.cardTitle}>
            Perfil
          </ThemedText>
          <ThemedText style={styles.cardText}>
            • Nome
            {'\n'}• E-mail
            {'\n'}• Telefone
            {'\n'}• Endereço do projeto
          </ThemedText>
        </ThemedView>

        <ThemedView style={styles.card}>
          <ThemedText type="defaultSemiBold" style={styles.cardTitle}>
            Preferências
          </ThemedText>
          <ThemedText style={styles.cardText}>
            • Idioma
            {'\n'}• Notificações sobre atualização de orçamento
            {'\n'}• Contato preferencial
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

