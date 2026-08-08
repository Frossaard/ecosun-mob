import { MaterialIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { PrimaryButton } from '@/components/primary-button';
import { ScreenHeader } from '@/components/screen-header';
import { StatCard } from '@/components/stat-card';
import { ThemedView } from '@/components/themed-view';
import { formatarMoeda, formatarNumero } from '@/lib/solar';
import { kitStore } from '@/lib/store';

export default function ResultScreen() {
  const router = useRouter();
  const resultado = kitStore.getResultado();
  const input = kitStore.getInput();

  if (!resultado) {
    return (
      <SafeAreaView style={styles.safe}>
        <ThemedView style={styles.empty}>
          <MaterialIcons name="error-outline" size={40} color="#0a7ea4" />
          <Text style={styles.emptyTitle}>Nenhum kit gerado</Text>
          <Text style={styles.emptyText}>Preencha os dados para gerar seu kit.</Text>
          <PrimaryButton title="Voltar ao início" onPress={() => router.replace('/')} />
        </ThemedView>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safe} edges={['bottom']}>
      <ScreenHeader
        step="Etapa 2 de 3"
        title="Seu kit ideal"
        subtitle={`${input?.cidade || '—'} - ${input?.estado || '—'} • Consumo de ${formatarNumero(
          resultado.consumoMensalKwh
        )} kWh/mês`}
      />

      <View style={styles.content}>
        <ThemedView style={styles.hero}>
          <Text style={styles.heroIcon}>☀️</Text>
          <Text style={styles.heroValue}>
            {formatarNumero(resultado.quantidadePlacas)}{' '}
            {resultado.quantidadePlacas === 1 ? 'placa' : 'placas'}
          </Text>
          <Text style={styles.heroMeta}>
            Painéis de {resultado.potenciaPlacaWp} Wp cada
          </Text>
        </ThemedView>

        <View style={styles.grid}>
          <StatCard
            icon="⚡"
            value={`${resultado.potenciaSistemaKw} kWp`}
            label="Potência do sistema"
          />
          <StatCard
            icon="🌞"
            value={`${formatarNumero(resultado.geracaoMensalKwh)} kWh`}
            label="Geração mensal"
          />
          <StatCard
            icon="💰"
            value={formatarMoeda(resultado.economiaMensalBRL)}
            label="Economia estimada/mês"
            highlight
            big
          />
          <StatCard
            icon="📅"
            value={`${formatarNumero(resultado.geracaoAnualKwh)} kWh`}
            label="Geração anual"
          />
          <StatCard
            icon="🏠"
            value={`${resultado.areaNecessariaM2} m²`}
            label={`Área em ${resultado.tipoEstrutura}`}
          />
          <StatCard
            icon="🔌"
            value={`${resultado.potenciaInversorKw} kW`}
            label="Inversor"
          />
        </View>

        <ThemedView style={styles.infoCard}>
          <MaterialIcons name="lightbulb-outline" size={20} color="#f59e0b" />
          <Text style={styles.infoText}>
            A IA dimensionou este sistema para cobrir {formatarNumero(resultado.consumoMensalKwh)}{' '}
            kWh/mês com ~10% de folga. Veja o detalhamento completo e o custo estimado.
          </Text>
        </ThemedView>

        <PrimaryButton
          title="Ver detalhes e custo"
          onPress={() => router.push('/(app)/detail')}
          icon="→"
        />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
safe: {
    flex: 1,
    backgroundColor: '#F7F8FA',
  },
  content: {
    flex: 1,
    padding: 20,
  },
  hero: {
    backgroundColor: '#0a7ea4',
    borderRadius: 22,
    padding: 22,
    alignItems: 'center',
    marginBottom: 16,
    shadowColor: '#0a7ea4',
    shadowOpacity: 0.3,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 6 },
    elevation: 5,
  },
  heroIcon: {
    fontSize: 40,
    marginBottom: 8,
  },
  heroValue: {
    color: '#fff',
    fontSize: 34,
    fontWeight: '800',
  },
  heroMeta: {
    color: '#bfe6f2',
    fontSize: 15,
    marginTop: 4,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
    marginBottom: 16,
  },
  infoCard: {
    flexDirection: 'row',
    gap: 10,
    backgroundColor: '#fff8e6',
    borderRadius: 14,
    padding: 14,
    marginBottom: 16,
    alignItems: 'center',
  },
  infoText: {
    flex: 1,
    color: '#7c5e10',
    fontSize: 14,
    lineHeight: 20,
  },
  empty: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
    padding: 24,
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#11181c',
  },
  emptyText: {
    color: '#7a8288',
    marginBottom: 12,
  },
});
