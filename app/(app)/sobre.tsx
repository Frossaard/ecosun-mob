import { MaterialIcons } from '@expo/vector-icons';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { ScreenHeader } from '@/components/screen-header';
import { ThemedView } from '@/components/themed-view';

const IMPORTANCIA = [
  {
    icon: 'savings' as const,
    titulo: 'Redução de custos',
    texto: 'Diminui drasticamente o valor da conta de energia a cada mês.',
  },
  {
    icon: 'eco' as const,
    titulo: 'Energia limpa e sustentável',
    texto: 'Proveniente do sol, uma fonte inesgotável e renovável.',
  },
  {
    icon: 'public' as const,
    titulo: 'Baixo impacto ambiental',
    texto: 'Gera eletricidade sem emissões de poluentes ou gases de efeito estufa.',
  },
  {
    icon: 'home' as const,
    titulo: 'Valorização do imóvel',
    texto: 'Imóveis com energia solar se tornam mais valorizados no mercado.',
  },
];

const OBJETIVOS = [
  {
    icon: 'calculate' as const,
    titulo: 'Entender o investimento',
    texto: 'Ajudar você a descobrir quanto precisaria investir em um kit solar.',
  },
  {
    icon: 'extension' as const,
    titulo: 'Simular kits completos',
    texto: 'Montar kits com placas solares e inversores conforme o seu consumo.',
  },
  {
    icon: 'check-circle' as const,
    titulo: 'Facilitar a decisão',
    texto: 'Fornecer dados claros para você tomar a melhor decisão com segurança.',
  },
];

export default function SobreScreen() {
  return (
    <SafeAreaView style={styles.safe} edges={['bottom']}>
      <ScreenHeader
        title="Sobre Nós"
        subtitle="Conheça o EcoSun e a importância da energia solar."
      />
      <ScrollView
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}>
        <ThemedView style={styles.heroCard}>
          <View style={styles.logoCircle}>
            <MaterialIcons name="solar-power" size={40} color="#fff" />
          </View>
          <Text style={styles.heroTitle}>O que é o EcoSun?</Text>
          <Text style={styles.heroText}>
            O EcoSun é um aplicativo que simula a montagem e o orçamento de kits de
            energia solar. Você informa o consumo da sua residência e a IA dimensiona
            o sistema ideal — placas, inversor, estrutura e custo estimado — tudo em
            poucos cliques.
          </Text>
        </ThemedView>

        <ThemedView style={styles.card}>
          <Text style={styles.sectionTitle}>Por que energia solar?</Text>
          <View style={styles.list}>
            {IMPORTANCIA.map((item) => (
              <View key={item.titulo} style={styles.item}>
                <View style={styles.iconCircle}>
                  <MaterialIcons name={item.icon} size={22} color="#0a7ea4" />
                </View>
                <View style={styles.itemTextWrap}>
                  <Text style={styles.itemTitle}>{item.titulo}</Text>
                  <Text style={styles.itemText}>{item.texto}</Text>
                </View>
              </View>
            ))}
          </View>
        </ThemedView>

        <ThemedView style={styles.card}>
          <Text style={styles.sectionTitle}>Nosso objetivo</Text>
          <View style={styles.list}>
            {OBJETIVOS.map((item) => (
              <View key={item.titulo} style={styles.item}>
                <View style={[styles.iconCircle, styles.iconCircleAlt]}>
                  <MaterialIcons name={item.icon} size={22} color="#f59e0b" />
                </View>
                <View style={styles.itemTextWrap}>
                  <Text style={styles.itemTitle}>{item.titulo}</Text>
                  <Text style={styles.itemText}>{item.texto}</Text>
                </View>
              </View>
            ))}
          </View>
        </ThemedView>

        <ThemedView style={styles.notaBox}>
          <MaterialIcons name="info-outline" size={18} color="#7a8288" />
          <Text style={styles.notaText}>
            Todas as simulações são estimativas locais para fins educativos e de
            planejamento. Consulte um profissional para um projeto definitivo.
          </Text>
        </ThemedView>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: '#F7F8FA',
  },
  content: {
    padding: 20,
    paddingBottom: 40,
  },
  heroCard: {
    backgroundColor: '#0a7ea4',
    borderRadius: 22,
    padding: 24,
    marginBottom: 16,
    alignItems: 'center',
    shadowColor: '#0a7ea4',
    shadowOpacity: 0.3,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 6 },
    elevation: 5,
  },
  logoCircle: {
    width: 72,
    height: 72,
    borderRadius: 22,
    backgroundColor: 'rgba(255,255,255,0.18)',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 14,
  },
  heroTitle: {
    color: '#fff',
    fontSize: 22,
    fontWeight: '800',
    marginBottom: 8,
  },
  heroText: {
    color: '#e6f7fc',
    fontSize: 15,
    lineHeight: 22,
    textAlign: 'center',
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 20,
    padding: 18,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 4 },
    elevation: 2,
  },
  sectionTitle: {
    fontSize: 17,
    fontWeight: '800',
    color: '#11181c',
    marginBottom: 14,
  },
  list: {
    gap: 16,
  },
  item: {
    flexDirection: 'row',
    gap: 14,
  },
  iconCircle: {
    width: 44,
    height: 44,
    borderRadius: 14,
    backgroundColor: '#e8f6fb',
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconCircleAlt: {
    backgroundColor: '#fff3e0',
  },
  itemTextWrap: {
    flex: 1,
  },
  itemTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: '#11181c',
  },
  itemText: {
    fontSize: 14,
    color: '#7a8288',
    lineHeight: 20,
    marginTop: 2,
  },
  notaBox: {
    flexDirection: 'row',
    gap: 8,
    backgroundColor: '#f4f6f7',
    borderRadius: 12,
    padding: 12,
    alignItems: 'flex-start',
  },
  notaText: {
    color: '#7a8288',
    fontSize: 13,
    flex: 1,
    lineHeight: 18,
  },
});
