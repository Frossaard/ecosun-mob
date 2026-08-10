import { MaterialIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { PrimaryButton } from '@/components/primary-button';
import { ScreenHeader } from '@/components/screen-header';
import { ThemedView } from '@/components/themed-view';
import { formatarMoeda, formatarNumero } from '@/lib/solar';
import { kitStore } from '@/lib/store';

export default function DetailScreen() {
  const router = useRouter();
  const resultado = kitStore.getResultado();

  if (!resultado) {
    return (
      <SafeAreaView style={styles.safe}>
        <ThemedView style={styles.empty}>
          <MaterialIcons name="error-outline" size={40} color="#0B3D91" />
          <Text style={styles.emptyTitle}>Nenhum kit disponível</Text>
          <PrimaryButton title="Gerar novo kit" onPress={() => router.replace('/')} />
        </ThemedView>
      </SafeAreaView>
    );
  }

  const itensCusto = [
    {
      nome: 'Painéis solares',
      detalhe: `${resultado.quantidadePlacas} × ${resultado.potenciaPlacaWp} Wp (${resultado.potenciaSistemaKw} kWp)`,
      valor: resultado.custoPlacasBRL,
    },
    {
      nome: 'Inversor',
      detalhe: `${resultado.quantidadeInversores} × ${resultado.potenciaInversorKw} kW`,
      valor: resultado.custoInversorBRL,
    },
    {
      nome: 'Estrutura',
      detalhe: `${resultado.tipoEstrutura} • ${resultado.areaNecessariaM2} m²`,
      valor: resultado.custoEstruturaBRL,
    },
    {
      nome: 'Instalação e materiais',
      detalhe: 'Mão de obra, cabeamento e componentes',
      valor: resultado.custoInstalacaoBRL,
    },
  ];

  return (
    <SafeAreaView style={styles.safe} edges={['bottom']}>
      <ScreenHeader
        step="Etapa 3 de 3"
        title="Detalhes do kit"
        subtitle="Tudo o que será necessário para montar seu sistema de energia solar."
      />

      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <ThemedView style={styles.summaryCard}>
          <Text style={styles.cardLabel}>Custo total estimado</Text>
          <Text style={styles.totalValue}>{formatarMoeda(resultado.custoTotalBRL)}</Text>
          <Text style={styles.cardHint}>
            Investimento para montagem completa do sistema (estimativa).
          </Text>
        </ThemedView>

        <ThemedView style={styles.section}>
          <Text style={styles.sectionTitle}>Composição do kit</Text>
          {itensCusto.map((item) => (
            <View key={item.nome} style={styles.itemRow}>
              <View style={styles.itemInfo}>
                <Text style={styles.itemName}>{item.nome}</Text>
                <Text style={styles.itemDetalhe}>{item.detalhe}</Text>
              </View>
              <Text style={styles.itemValor}>{formatarMoeda(item.valor)}</Text>
            </View>
          ))}
        </ThemedView>

        <ThemedView style={styles.section}>
          <Text style={styles.sectionTitle}>Investimento x Economia</Text>
          <View style={styles.metricRow}>
            <View style={styles.metricItem}>
              <Text style={styles.metricValue}>{formatarMoeda(resultado.economiaMensalBRL)}</Text>
              <Text style={styles.metricLabel}>Economia/mês</Text>
            </View>
            <View style={styles.metricDivider} />
            <View style={styles.metricItem}>
              <Text style={styles.metricValue}>{formatarMoeda(resultado.economiaAnualBRL)}</Text>
              <Text style={styles.metricLabel}>Economia/ano</Text>
            </View>
          </View>
          <View style={styles.paybackBox}>
            <MaterialIcons name="schedule" size={20} color="#0B3D91" />
            <Text style={styles.paybackText}>
              Tempo estimado de retorno: <Text style={styles.paybackStrong}>{resultado.paybackAnos} anos</Text>.
            </Text>
          </View>
        </ThemedView>

        <ThemedView style={styles.section}>
          <Text style={styles.sectionTitle}>Dados de referência</Text>
          <View style={styles.refRow}>
            <Text style={styles.refLabel}>Localização</Text>
            <Text style={styles.refValue}>{resultado.localizacao}</Text>
          </View>
          <View style={styles.refRow}>
            <Text style={styles.refLabel}>Irradiação solar</Text>
            <Text style={styles.refValue}>{resultado.irradiacaoKwh} kWh/m²/dia</Text>
          </View>
          <View style={styles.refRow}>
            <Text style={styles.refLabel}>Tarifa média</Text>
            <Text style={styles.refValue}>{formatarMoeda(resultado.tarifaMediaBRL)}/kWh</Text>
          </View>
          <View style={styles.refRow}>
            <Text style={styles.refLabel}>Consumo considerado</Text>
            <Text style={styles.refValue}>{formatarNumero(resultado.consumoMensalKwh)} kWh/mês</Text>
          </View>
        </ThemedView>

        <ThemedView style={styles.notaBox}>
          <MaterialIcons name="info-outline" size={18} color="#7a8288" />
          <Text style={styles.notaText}>
            Valores são estimativas locais para fins de simulação. O orçamento final pode variar
            conforme o telhado, padrão de entrada de energia e região.
          </Text>
        </ThemedView>

        <View style={styles.actions}>
          <PrimaryButton
            title="Recalcular novo kit"
            onPress={() => router.replace('/(app)/form')}
          />
          <Text style={styles.actionsHint}>
            Deseja ajustar o consumo ou o tipo de residência? Simule novamente.
          </Text>
        </View>
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
  summaryCard: {
    backgroundColor: '#0B3D91',
    borderRadius: 22,
    padding: 22,
    marginBottom: 16,
    shadowColor: '#0B3D91',
    shadowOpacity: 0.3,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 6 },
    elevation: 5,
  },
  cardLabel: {
    color: '#bfe6f2',
    fontSize: 14,
    fontWeight: '600',
  },
  totalValue: {
    color: '#fff',
    fontSize: 38,
    fontWeight: '800',
    marginTop: 4,
  },
  cardHint: {
    color: '#d9f2fa',
    fontSize: 13,
    marginTop: 6,
  },
  section: {
    backgroundColor: '#fff',
    borderRadius: 18,
    padding: 18,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOpacity: 0.04,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 3 },
    elevation: 1,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#11181c',
    marginBottom: 14,
  },
  itemRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 10,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: '#eef0f2',
  },
  itemInfo: {
    flex: 1,
    paddingRight: 12,
  },
  itemName: {
    fontSize: 15,
    fontWeight: '600',
    color: '#11181c',
  },
  itemDetalhe: {
    fontSize: 13,
    color: '#7a8288',
    marginTop: 2,
  },
  itemValor: {
    fontSize: 15,
    fontWeight: '700',
    color: '#0B3D91',
  },
  metricRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  metricItem: {
    flex: 1,
    alignItems: 'center',
  },
  metricValue: {
    fontSize: 24,
    fontWeight: '800',
    color: '#0B3D91',
  },
  metricLabel: {
    fontSize: 13,
    color: '#7a8288',
    marginTop: 4,
  },
  metricDivider: {
    width: StyleSheet.hairlineWidth,
    height: 40,
    backgroundColor: '#e0e3e5',
  },
  paybackBox: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: '#e8f6fb',
    borderRadius: 12,
    padding: 12,
    marginTop: 14,
  },
  paybackText: {
    color: '#0B3D91',
    fontSize: 14,
    flex: 1,
  },
  paybackStrong: {
    fontWeight: '700',
  },
  refRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 8,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: '#eef0f2',
  },
  refLabel: {
    color: '#7a8288',
    fontSize: 14,
  },
  refValue: {
    color: '#11181c',
    fontSize: 14,
    fontWeight: '600',
  },
  notaBox: {
    flexDirection: 'row',
    gap: 8,
    backgroundColor: '#f4f6f7',
    borderRadius: 12,
    padding: 12,
    marginBottom: 16,
    alignItems: 'flex-start',
  },
  notaText: {
    color: '#7a8288',
    fontSize: 13,
    flex: 1,
    lineHeight: 18,
  },
  actions: {
    gap: 12,
  },
  actionsHint: {
    textAlign: 'center',
    color: '#7a8288',
    fontSize: 13,
  },
  empty: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 12,
    padding: 24,
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#11181c',
  },
});
