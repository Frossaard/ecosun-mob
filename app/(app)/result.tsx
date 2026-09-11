import { MaterialIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import { Alert, ScrollView, Share, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { PrimaryButton } from '@/components/primary-button';
import { SimpleChart } from '@/components/simple-chart';
import { ThemedView } from '@/components/themed-view';
import { formatarMoeda, formatarNumero } from '@/lib/solar';
import { kitStore } from '@/lib/store';

function ResultHeader({ location }: { location?: string }) {
  return <LinearGradient colors={['#063B4C', '#0B6672', '#12838B']} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={styles.headerGradient}><SafeAreaView edges={['top']}><View style={styles.headerContent}><Text style={styles.headerTitle}>Resultado da simulação</Text>{location ? <Text style={styles.headerSubtitle}>{location}</Text> : null}</View></SafeAreaView></LinearGradient>;
}

export default function ResultScreen() {
  const router = useRouter();
  const resultado = kitStore.getResultado();
  const input = kitStore.getInput();
  const voltarParaSimulacao = () => router.replace('/(app)/form');

  if (!resultado || !input) return <View style={styles.safe}><ResultHeader /><View style={styles.emptyWrap}><MaterialIcons name="solar-power" size={38} color="#0B6672" /><Text style={styles.emptyTitle}>Nenhuma simulação encontrada</Text><Text style={styles.emptyHint}>Preencha os dados para visualizar seu kit solar recomendado.</Text><PrimaryButton title="Iniciar simulação" onPress={voltarParaSimulacao} /></View></View>;

  const r = resultado;
  const consumoDiario = Math.round((r.consumoMensalKwh / 30) * 10) / 10;
  const monthly = Array.from({ length: 12 }, () => r.geracaoMensalKwh);
  async function compartilharTexto() {
    try { await Share.share({ title: 'Resultado EcoSun', message: `EcoSun — Resultado\nLocal: ${r.localizacao}\nConsumo: ${formatarNumero(r.consumoMensalKwh)} kWh/mês\nSistema: ${r.quantidadePlacas} placas • ${r.potenciaSistemaKw} kWp\nEconomia: ${formatarMoeda(r.economiaMensalBRL)} / mês` }); } catch { Alert.alert('Erro', 'Não foi possível compartilhar.'); }
  }

  return <View style={styles.safe}>
    <ResultHeader location={r.localizacao} />
    <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
      <ThemedView style={styles.card}>
        <Text style={styles.sectionEyebrow}>SEU CONSUMO</Text><Text style={styles.sectionTitle}>Energia considerada</Text>
        <View style={styles.consumptionRow}>
          <Consumption icon="bolt" value={formatarNumero(r.consumoMensalKwh)} label="por mês" />
          <View style={styles.verticalDivider} />
          <Consumption icon="wb-sunny" value={formatarNumero(consumoDiario)} label="por dia" />
        </View>
      </ThemedView>
      <ThemedView style={styles.card}>
        <Text style={styles.sectionEyebrow}>RECOMENDAÇÃO</Text><Text style={styles.sectionTitle}>Sistema solar ideal</Text>
        <View style={styles.grid}>
          <Metric icon="solar-power" label="Painéis" value={formatarNumero(r.quantidadePlacas)} detail={`${r.potenciaPlacaWp} Wp por placa`} />
          <Metric icon="flash-on" label="Potência total" value={`${r.potenciaSistemaKw} kWp`} detail="capacidade instalada" />
          <Metric icon="settings-input-component" label="Inversor" value={`${r.potenciaInversorKw} kW`} detail={`${r.quantidadeInversores} unidade(s)`} />
          <Metric icon="square-foot" label="Área estimada" value={`${formatarNumero(r.areaNecessariaM2)} m²`} detail={r.tipoEstrutura} />
        </View>
      </ThemedView>
      <ThemedView style={styles.card}>
        <View style={styles.chartHeader}><View><Text style={styles.sectionEyebrow}>PROJEÇÃO</Text><Text style={styles.sectionTitle}>Geração mensal</Text></View><View style={styles.chartPill}><MaterialIcons name="trending-up" size={15} color="#0B6672" /><Text style={styles.chartPillText}>{formatarNumero(r.geracaoMensalKwh)} kWh</Text></View></View>
        <SimpleChart values={monthly} />
      </ThemedView>
      <ThemedView style={styles.card}>
        <Text style={styles.sectionEyebrow}>INVESTIMENTO</Text><Text style={styles.sectionTitle}>Composição do kit</Text>
        <Cost label="Painéis solares" value={formatarMoeda(r.custoPlacasBRL)} /><Cost label="Inversor" value={formatarMoeda(r.custoInversorBRL)} /><Cost label="Estrutura" value={formatarMoeda(r.custoEstruturaBRL)} /><Cost label="Instalação" value={formatarMoeda(r.custoInstalacaoBRL)} last />
        <View style={styles.totalRow}><Text style={styles.totalLabel}>Investimento estimado</Text><Text style={styles.totalValue}>{formatarMoeda(r.custoTotalBRL)}</Text></View>
      </ThemedView>
      <ThemedView style={[styles.card, styles.returnCard]}><View style={styles.returnIcon}><MaterialIcons name="savings" size={23} color="#FFFFFF" /></View><View style={styles.returnText}><Text style={styles.returnTitle}>Economia e retorno</Text><Text style={styles.returnHint}>Estimativa considerando a sua região</Text></View><View style={styles.returnValues}><Text style={styles.returnValue}>{formatarMoeda(r.economiaMensalBRL)}</Text><Text style={styles.returnLabel}>por mês • retorno em {r.paybackAnos} anos</Text></View></ThemedView>
    </ScrollView>
    <SafeAreaView edges={['bottom']} style={styles.bottomBar}><View style={styles.bottomActions}><TouchableOpacity style={styles.secondaryButton} onPress={voltarParaSimulacao} activeOpacity={0.8}><MaterialIcons name="edit" size={19} color="#0B6672" /><Text style={styles.secondaryButtonText}>Voltar para simulação</Text></TouchableOpacity><TouchableOpacity style={styles.primaryButton} onPress={compartilharTexto} activeOpacity={0.8}><MaterialIcons name="share" size={19} color="#FFFFFF" /><Text style={styles.primaryButtonText}>Compartilhar</Text></TouchableOpacity></View></SafeAreaView>
  </View>;
}

type IconName = React.ComponentProps<typeof MaterialIcons>['name'];
function Consumption({ icon, value, label }: { icon: IconName; value: string; label: string }) { return <View style={styles.consumptionItem}><MaterialIcons name={icon} size={20} color="#12838B" /><Text style={styles.consumptionValue}>{value}</Text><Text style={styles.consumptionUnit}>kWh</Text><Text style={styles.consumptionLabel}>{label}</Text></View>; }
function Metric({ icon, label, value, detail }: { icon: IconName; label: string; value: string; detail: string }) { return <View style={styles.metricCard}><View style={styles.metricIcon}><MaterialIcons name={icon} size={19} color="#0B6672" /></View><Text style={styles.metricLabel}>{label}</Text><Text style={styles.metricValue}>{value}</Text><Text style={styles.metricDetail}>{detail}</Text></View>; }
function Cost({ label, value, last = false }: { label: string; value: string; last?: boolean }) { return <View style={[styles.costRow, last && styles.costRowLast]}><Text style={styles.costLabel}>{label}</Text><Text style={styles.costValue}>{value}</Text></View>; }

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: '#F3F6F7' }, headerGradient: { borderBottomLeftRadius: 32, borderBottomRightRadius: 32, overflow: 'hidden' }, headerContent: { alignItems: 'center', paddingHorizontal: 24, paddingTop: 30, paddingBottom: 38 }, headerTitle: { color: '#FFFFFF', fontSize: 25, fontWeight: '800', letterSpacing: -0.5, textAlign: 'center' }, headerSubtitle: { color: 'rgba(255,255,255,0.78)', fontSize: 14, fontWeight: '600', marginTop: 9, textAlign: 'center' }, content: { paddingHorizontal: 20, paddingTop: 22, paddingBottom: 112 }, card: { backgroundColor: '#FFFFFF', borderRadius: 20, marginBottom: 16, padding: 18, shadowColor: '#0D2D36', shadowOpacity: 0.08, shadowRadius: 14, shadowOffset: { width: 0, height: 5 }, elevation: 3 }, sectionEyebrow: { color: '#6E858C', fontSize: 11, fontWeight: '800', letterSpacing: 0.9 }, sectionTitle: { color: '#172B31', fontSize: 19, fontWeight: '800', letterSpacing: -0.25, marginTop: 4 },
  consumptionRow: { alignItems: 'center', flexDirection: 'row', marginTop: 20 }, consumptionItem: { alignItems: 'center', flex: 1 }, consumptionValue: { color: '#102B33', fontSize: 27, fontWeight: '800', letterSpacing: -0.8, marginTop: 8 }, consumptionUnit: { color: '#12838B', fontSize: 13, fontWeight: '800', marginTop: 1 }, consumptionLabel: { color: '#789097', fontSize: 12, marginTop: 4 }, verticalDivider: { backgroundColor: '#E5ECEE', height: 76, width: 1 }, grid: { flexDirection: 'row', flexWrap: 'wrap', gap: 10, marginTop: 18 }, metricCard: { backgroundColor: '#F4F8F8', borderRadius: 15, minHeight: 125, padding: 13, width: '48.5%' }, metricIcon: { alignItems: 'center', backgroundColor: '#DDF1EF', borderRadius: 10, height: 34, justifyContent: 'center', width: 34 }, metricLabel: { color: '#60767D', fontSize: 12, fontWeight: '700', marginTop: 10 }, metricValue: { color: '#172B31', fontSize: 18, fontWeight: '800', letterSpacing: -0.3, marginTop: 3 }, metricDetail: { color: '#80949A', fontSize: 11, marginTop: 4 },
  chartHeader: { alignItems: 'flex-start', flexDirection: 'row', justifyContent: 'space-between', marginBottom: 14 }, chartPill: { alignItems: 'center', backgroundColor: '#E3F3F1', borderRadius: 20, flexDirection: 'row', gap: 4, paddingHorizontal: 9, paddingVertical: 6 }, chartPillText: { color: '#0B6672', fontSize: 11, fontWeight: '800' }, costRow: { alignItems: 'center', borderBottomColor: '#EDF1F2', borderBottomWidth: 1, flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 13 }, costRowLast: { borderBottomWidth: 0 }, costLabel: { color: '#60767D', fontSize: 14 }, costValue: { color: '#263C43', fontSize: 14, fontWeight: '700' }, totalRow: { alignItems: 'center', backgroundColor: '#EAF6F4', borderRadius: 13, flexDirection: 'row', justifyContent: 'space-between', marginTop: 6, padding: 14 }, totalLabel: { color: '#0B6672', fontSize: 13, fontWeight: '700' }, totalValue: { color: '#063B4C', fontSize: 17, fontWeight: '800' },
  returnCard: { alignItems: 'center', backgroundColor: '#0B6672', flexDirection: 'row', padding: 16 }, returnIcon: { alignItems: 'center', backgroundColor: 'rgba(255,255,255,0.16)', borderRadius: 14, height: 46, justifyContent: 'center', width: 46 }, returnText: { flex: 1, marginLeft: 12 }, returnTitle: { color: '#FFFFFF', fontSize: 15, fontWeight: '800' }, returnHint: { color: 'rgba(255,255,255,0.72)', fontSize: 11, marginTop: 3 }, returnValues: { alignItems: 'flex-end' }, returnValue: { color: '#FFFFFF', fontSize: 16, fontWeight: '800' }, returnLabel: { color: 'rgba(255,255,255,0.72)', fontSize: 10, marginTop: 3, textAlign: 'right' },
  bottomBar: { backgroundColor: '#FFFFFF', borderTopColor: '#E8EEEE', borderTopWidth: 1, elevation: 10, paddingHorizontal: 20, paddingTop: 12, shadowColor: '#12313A', shadowOpacity: 0.12, shadowOffset: { width: 0, height: -4 }, shadowRadius: 12 }, bottomActions: { flexDirection: 'row', gap: 10 }, secondaryButton: { alignItems: 'center', backgroundColor: '#E8F3F2', borderRadius: 14, flex: 1.2, flexDirection: 'row', gap: 6, justifyContent: 'center', minHeight: 52 }, secondaryButtonText: { color: '#0B6672', fontSize: 11, fontWeight: '800' }, primaryButton: { alignItems: 'center', backgroundColor: '#0B6672', borderRadius: 14, flex: 1, flexDirection: 'row', gap: 7, justifyContent: 'center', minHeight: 52 }, primaryButtonText: { color: '#FFFFFF', fontSize: 13, fontWeight: '800' }, emptyWrap: { alignItems: 'center', flex: 1, justifyContent: 'center', padding: 30 }, emptyTitle: { color: '#172B31', fontSize: 19, fontWeight: '800', marginTop: 14 }, emptyHint: { color: '#70868D', fontSize: 14, lineHeight: 20, marginBottom: 22, marginTop: 8, textAlign: 'center' },
});
