import React from 'react';
import { MaterialIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import {
  Alert,
  ScrollView,
  Share,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { PrimaryButton } from '@/components/primary-button';
import { ThemedView } from '@/components/themed-view';
import { SimpleChart } from '@/components/simple-chart';
import { kitStore, historyStore } from '@/lib/store';
import { formatarMoeda, formatarNumero } from '@/lib/solar';

export default function ResultScreen() {
  const router = useRouter();
  const resultado = kitStore.getResultado();
  const input = kitStore.getInput();

  function voltar() {
    router.replace('/(app)/form');
  }

  function gerarNova() {
    kitStore.clear();
    router.replace('/(app)/form');
  }

  if (!resultado || !input) {
    return (
      <SafeAreaView style={styles.safe} edges={['top', 'bottom']}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.replace('/(app)/form')} style={styles.backButton} hitSlop={8}>
            <MaterialIcons name="arrow-back" size={22} color="#fff" />
            <Text style={styles.backText}>Voltar</Text>
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Resultado</Text>
        </View>
        <View style={styles.emptyWrap}>
          <Text style={styles.emptyTitle}>Nada para exibir</Text>
          <Text style={styles.emptyHint}>Realize uma simulação para ver os resultados.</Text>
          <PrimaryButton title="Nova simulação" onPress={gerarNova} />
        </View>
      </SafeAreaView>
    );
  }

  // Narrowed non-null references for TypeScript
  const r = resultado!;
  const inp = input!;

  const consumoDiario = Math.round((r.consumoMensalKwh / 30) * 10) / 10;

  async function compartilharTexto() {
    try {
      const texto = `EcoSun — Resultado\nLocal: ${r.localizacao}\nConsumo: ${formatarNumero(r.consumoMensalKwh)} kWh/mês\nSistema: ${r.quantidadePlacas} placas • ${r.potenciaSistemaKw} kWp\nEconomia: ${formatarMoeda(r.economiaMensalBRL)} / mês`;
      await Share.share({ message: texto, title: 'Resultado EcoSun' });
    } catch {
      Alert.alert('Erro', 'Não foi possível compartilhar.');
    }
  }
                <Text style={styles.statValue}>{formatarNumero(r.geracaoMensalKwh)} kWh</Text>
  function salvarHistorico() {
    const id = historyStore.add(input, resultado);
    Alert.alert('Salvo', 'Resultado salvo no histórico (id: ' + id + ')');
  }

  async function exportarCSV() {
    const headers = ['chave', 'valor'];
    const rows = [
      ['local', r.localizacao],
      ['consumo_mensal_kwh', String(r.consumoMensalKwh)],
      ['geracao_mensal_kwh', String(r.geracaoMensalKwh)],
      ['quantidade_placas', String(r.quantidadePlacas)],
      ['potencia_sistema_kw', String(r.potenciaSistemaKw)],
      ['economia_mensal_brl', String(r.economiaMensalBRL)],
      ['custo_total_brl', String(r.custoTotalBRL)],
    ];
    const csv = [headers.join(','), ...rows.map((r) => r.map((c) => `"${c}"`).join(','))].join('\n');
    try {
      await Share.share({ message: csv, title: 'EcoSun_result.csv' });
    } catch {
      Alert.alert('Erro', 'Não foi possível exportar CSV.');
    }
  }

  async function exportarPDF() {
    // Fallback simple PDF/export: if expo-print is installed it can be used later.
    try {
      const texto = `EcoSun — Resultado\nLocal: ${r.localizacao}\nConsumo mensal: ${r.consumoMensalKwh} kWh\nGeração mensal: ${r.geracaoMensalKwh} kWh\nQuantidade de placas: ${r.quantidadePlacas}\nPotência do sistema: ${r.potenciaSistemaKw} kWp\nEconomia mensal: ${formatarMoeda(r.economiaMensalBRL)}`;
      await Share.share({ message: texto, title: 'Resultado EcoSun' });
    } catch {
      await compartilharTexto();
    }
  }

  // small monthly array for chart (same value across months)
  const monthly = Array.from({ length: 12 }, () => r.geracaoMensalKwh);

  return (
    <SafeAreaView style={styles.safe} edges={['top', 'bottom']}>
      <View style={styles.header}>
        <TouchableOpacity onPress={voltar} style={styles.backButton} hitSlop={8}>
          <MaterialIcons name="arrow-back" size={22} color="#fff" />
          <Text style={styles.backText}>Voltar</Text>
        </TouchableOpacity>
        <View style={styles.headerTitles}>
          <Text style={styles.headerTitle}>Resultado da simulação</Text>
          <Text style={styles.headerSubtitle}>{r.localizacao}</Text>
        </View>
        <View style={styles.headerActions}>
          <TouchableOpacity onPress={compartilharTexto} style={styles.iconButton}>
            <MaterialIcons name="share" size={20} color="#E7F0FF" />
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <ThemedView style={styles.card}>
          <Text style={styles.sectionTitle}>Consumo</Text>
          <Text style={styles.sectionHint}>Resumo do consumo informado</Text>
          <View style={styles.statRow}>
            <View style={styles.statItem}>
              <Text style={styles.statLabel}>Consumo mensal</Text>
              <Text style={styles.statValue}>{formatarNumero(r.consumoMensalKwh)} kWh</Text>
            </View>
            <View style={styles.statItem}>
              <Text style={styles.statLabel}>Consumo diário</Text>
              <Text style={styles.statValue}>{formatarNumero(consumoDiario)} kWh</Text>
            </View>
          </View>
        </ThemedView>

        <ThemedView style={styles.card}>
          <Text style={styles.sectionTitle}>Sistema Solar Recomendado</Text>
          <Text style={styles.sectionHint}>Componentes e capacidade</Text>
          <View style={styles.statRowColumn}>
            <View style={styles.rowPair}>
              <View style={styles.statItemSmall}>
                <Text style={styles.statLabel}>Painéis</Text>
                <Text style={styles.statValue}>{formatarNumero(r.quantidadePlacas)}</Text>
                <Text style={styles.statMeta}>{r.potenciaPlacaWp} Wp / placa</Text>
              </View>
              <View style={styles.statItemSmall}>
                <Text style={styles.statLabel}>Potência total</Text>
                <Text style={styles.statValue}>{r.potenciaSistemaKw} kWp</Text>
                <Text style={styles.statMeta}>kWp (pico)</Text>
              </View>
            </View>

            <View style={styles.rowPair}>
              <View style={styles.statItemSmall}>
                <Text style={styles.statLabel}>Inversor</Text>
                <Text style={styles.statValue}>{r.potenciaInversorKw} kW</Text>
                <Text style={styles.statMeta}>{r.quantidadeInversores} unidade(s)</Text>
              </View>
              <View style={styles.statItemSmall}>
                <Text style={styles.statLabel}>Área estimada</Text>
                <Text style={styles.statValue}>{formatarNumero(r.areaNecessariaM2)} m²</Text>
                <Text style={styles.statMeta}>{r.tipoEstrutura}</Text>
              </View>
            </View>

            <View style={{ marginTop: 8 }}>
              <Text style={styles.sectionHint}>Geração mensal (visual)</Text>
              <SimpleChart values={monthly} />
            </View>
          </View>
        </ThemedView>

        <ThemedView style={styles.card}>
          <Text style={styles.sectionTitle}>Detallhamento de Custos</Text>
          <Text style={styles.sectionHint}>Desmembramento dos custos estimados</Text>
          <View style={styles.costRow}>
            <View style={styles.costItem}>
              <Text style={styles.costLabel}>Placas</Text>
              <Text style={styles.costValue}>{formatarMoeda(r.custoPlacasBRL)}</Text>
            </View>
            <View style={styles.costItem}>
              <Text style={styles.costLabel}>Inversor</Text>
              <Text style={styles.costValue}>{formatarMoeda(r.custoInversorBRL)}</Text>
            </View>
          </View>
          <View style={styles.costRow}>
            <View style={styles.costItem}>
              <Text style={styles.costLabel}>Estrutura</Text>
              <Text style={styles.costValue}>{formatarMoeda(r.custoEstruturaBRL)}</Text>
            </View>
            <View style={styles.costItem}>
              <Text style={styles.costLabel}>Instalação</Text>
              <Text style={styles.costValue}>{formatarMoeda(r.custoInstalacaoBRL)}</Text>
            </View>
          </View>
          <View style={styles.totalRow}>
            <Text style={styles.totalLabel}>Custo total estimado</Text>
            <Text style={styles.totalValue}>{formatarMoeda(r.custoTotalBRL)}</Text>
          </View>
        </ThemedView>

        <ThemedView style={styles.card}>
          <Text style={styles.sectionTitle}>Economia e Retorno</Text>
          <Text style={styles.sectionHint}>Estimativa de economia e payback</Text>
          <View style={styles.statRow}>
            <View style={styles.statItem}>
              <Text style={styles.statLabel}>Economia mensal</Text>
              <Text style={styles.statValue}>{formatarMoeda(r.economiaMensalBRL)}</Text>
            </View>
            <View style={styles.statItem}>
              <Text style={styles.statLabel}>Payback</Text>
              <Text style={styles.statValue}>{r.paybackAnos} anos</Text>
            </View>
          </View>
        </ThemedView>

        <View style={styles.actionsRow}>
          <TouchableOpacity style={styles.actionSmall} onPress={compartilharTexto}>
            <MaterialIcons name="share" size={18} color="#0B3D91" />
            <Text style={styles.actionLabel}>Compartilhar</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.actionSmall} onPress={exportarCSV}>
            <MaterialIcons name="file-download" size={18} color="#0B3D91" />
            <Text style={styles.actionLabel}>Exportar CSV</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.actionSmall} onPress={salvarHistorico}>
            <MaterialIcons name="save" size={18} color="#0B3D91" />
            <Text style={styles.actionLabel}>Salvar</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.actionSmall} onPress={exportarPDF}>
            <MaterialIcons name="picture-as-pdf" size={18} color="#0B3D91" />
            <Text style={styles.actionLabel}>Exportar PDF</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.actionWrap}>
          <PrimaryButton title="Gerar nova simulação" onPress={gerarNova} style={styles.primaryAction} />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: '#F7F8FA' },
  header: {
    backgroundColor: '#rgb(6, 79, 104)',
    paddingHorizontal: 18,
    paddingTop: 16,
    paddingBottom: 18,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  backButton: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  backText: { color: '#E7F0FF', fontWeight: '700', marginLeft: 4 },
  headerTitles: { flex: 1 },
  headerTitle: { color: '#fff', fontSize: 20, fontWeight: '800' },
  headerSubtitle: { color: '#E7F0FF', marginTop: 4, fontSize: 13 },
  headerActions: { marginLeft: 6 },
  iconButton: { padding: 8 },
  content: { paddingHorizontal: 20, paddingTop: 20, paddingBottom: 40 },
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 18,
    padding: 18,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOpacity: 0.06,
    shadowRadius: 14,
    shadowOffset: { width: 0, height: 6 },
    elevation: 3,
  },
  sectionTitle: { fontSize: 18, fontWeight: '800', color: '#111827' },
  sectionHint: { fontSize: 13, color: '#6B7280', marginTop: 6, marginBottom: 12 },
  statRow: { flexDirection: 'row', justifyContent: 'space-between', gap: 12, marginTop: 8 },
  statRowColumn: { marginTop: 6 },
  rowPair: { flexDirection: 'row', gap: 12, marginBottom: 12 },
  statItem: { flex: 1 },
  statItemSmall: { flex: 1, backgroundColor: '#F8FAFC', padding: 12, borderRadius: 12 },
  statLabel: { fontSize: 13, color: '#6B7280', fontWeight: '700' },
  statValue: { fontSize: 18, color: '#111827', fontWeight: '800', marginTop: 6 },
  statMeta: { fontSize: 12, color: '#6B7280', marginTop: 6 },
  actionWrap: { marginTop: 6, marginBottom: 24 },
  primaryAction: { borderRadius: 14, backgroundColor: '#10B981', minHeight: 56 },
  emptyWrap: { flex: 1, padding: 20, alignItems: 'center', justifyContent: 'center' },
  emptyTitle: { fontSize: 18, fontWeight: '800', color: '#111827', marginBottom: 8 },
  emptyHint: { fontSize: 14, color: '#6B7280', marginBottom: 18, textAlign: 'center' },
  actionsRow: { flexDirection: 'row', gap: 10, justifyContent: 'space-between', marginBottom: 12 },
  actionSmall: { flex: 1, backgroundColor: '#fff', borderRadius: 12, padding: 12, alignItems: 'center' },
  actionLabel: { marginTop: 6, color: '#0B3D91', fontWeight: '700' },
  costRow: { flexDirection: 'row', gap: 12, marginBottom: 8 },
  costItem: { flex: 1, backgroundColor: '#F8FAFC', padding: 12, borderRadius: 12 },
  costLabel: { fontSize: 12, color: '#6B7280' },
  costValue: { fontSize: 16, color: '#111827', fontWeight: '800', marginTop: 6 },
  totalRow: { marginTop: 12, borderTopWidth: 1, borderTopColor: '#EEF2F7', paddingTop: 12, flexDirection: 'row', justifyContent: 'space-between' },
  totalLabel: { color: '#6B7280', fontWeight: '700' },
  totalValue: { color: '#111827', fontWeight: '800' },
});
