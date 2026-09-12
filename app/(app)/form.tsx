import { MaterialIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useState } from 'react';
import {
    KeyboardAvoidingView,
    Platform,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { ChipSelect } from '@/components/chip-select';
import { FormField } from '@/components/form-field';
import { PrimaryButton } from '@/components/primary-button';
import { ScreenHeader } from '@/components/screen-header';
import { SettingsDrawer } from '@/components/settings-drawer';
import { ThemedView } from '@/components/themed-view';
import { salvarSimulacao } from '@/lib/api';
import { useSettingsMenu } from '@/lib/settings-menu';
import { dimensionarKit, EQUIPAMENTOS, type TipoResidencia } from '@/lib/solar';
import { kitStore, perfilStore } from '@/lib/store';

const TIPOS: { value: TipoResidencia; label: string; icon: 'home-outline' | 'storefront-outline' | 'tree-outline' }[] = [
  { value: 'casa', label: 'Casa', icon: 'home-outline' },
  { value: 'comercio', label: 'Comércio', icon: 'storefront-outline' },
  { value: 'sitio', label: 'Sítio', icon: 'tree-outline' },
];

export default function FormScreen() {
  const router = useRouter();
  const [consumo, setConsumo] = useState('');
  const [tipo, setTipo] = useState<TipoResidencia | null>(null);
  const [cidade, setCidade] = useState('');
  const [estado, setEstado] = useState('');
  const [moradores, setMoradores] = useState('');
  const [equipamentos, setEquipamentos] = useState<string[]>([]);
  const [erro, setErro] = useState<string | null>(null);
  const { open: menuAberto, setOpen: setMenuAberto } = useSettingsMenu();

  function toggleEquipamento(nome: string) {
    setEquipamentos((prev) =>
      prev.includes(nome) ? prev.filter((e) => e !== nome) : [...prev, nome]
    );
  }

  function gerarKit() {
    setErro(null);
    const consumoNum = Number(consumo.replace(',', '.'));
    if (!consumo || isNaN(consumoNum) || consumoNum <= 0) {
      setErro('Informe um consumo médio válido em kWh.');
      return;
    }
if (!tipo) {
      setErro('Selecione o tipo de residência.');
      return;
    }
    if (!cidade.trim() || estado.trim().length < 2) {
      setErro('Informe cidade e estado (UF).');
      return;
    }
    if (moradores && (isNaN(Number(moradores)) || Number(moradores) <= 0)) {
      setErro('Número de moradores inválido.');
      return;
    }

    const input = {
      consumoMensalKwh: consumoNum,
      tipo,
      cidade: cidade.trim(),
      estado: estado.trim().toUpperCase(),
      moradores: moradores ? Number(moradores) : undefined,
      equipamentos,
    };

    const resultado = dimensionarKit(input);
    kitStore.setInput(input);
    kitStore.setResultado(resultado);
    const perfil = perfilStore.get() ?? {
      nome: 'Usuário EcoSun',
      email: 'usuario@ecosun.com.br',
    };
    void salvarSimulacao(input, resultado, perfil).catch((error: unknown) => {
      console.warn('Não foi possível sincronizar a simulação:', error);
    });
    router.push('/(app)/result');
  }

  return (
    <SafeAreaView style={styles.safe} edges={['bottom']}>
      <ScreenHeader
        showMenu
        onMenu={() => setMenuAberto(true)}
        step="Etapa 1 de 3"
        title="Sobre sua residência"
        subtitle="Informe seus dados para a IA dimensionar o kit solar ideal para você."
      />
      <KeyboardAvoidingView
        style={styles.flex}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
        <ScrollView
          contentContainerStyle={styles.content}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}>
          <ThemedView style={styles.card}>
            <FormField
              label="Consumo médio mensal (kWh)"
              hint="Encontre este valor na sua conta de energia. Ex.: 350"
              value={consumo}
              onChangeText={(t) => setConsumo(t.replace(/[^0-9.,]/g, ''))}
              keyboardType="numeric"
              placeholder="Ex.: 350"
            />

            <ChipSelect
              label="Tipo de residência"
              options={TIPOS}
              value={tipo}
              onChange={setTipo}
            />

            <View style={styles.row}>
              <View style={styles.rowItem}>
                <FormField
                  label="Cidade"
                  value={cidade}
                  onChangeText={setCidade}
                  placeholder="Ex.: Curitiba"
                />
              </View>
              <View style={styles.rowItemUF}>
                <FormField
                  label="UF"
                  value={estado}
                  onChangeText={(t) => setEstado(t.toUpperCase())}
                  placeholder="PR"
                  maxLength={2}
                  autoCapitalize="characters"
                />
              </View>
            </View>

            <FormField
              label="Número de moradores (opcional)"
              value={moradores}
              onChangeText={(t) => setMoradores(t.replace(/[^0-9]/g, ''))}
              keyboardType="numeric"
              placeholder="Ex.: 4"
            />
          </ThemedView>

          <ThemedView style={styles.card}>
            <Text style={styles.sectionTitle}>Equipamentos relevantes (opcional)</Text>
            <Text style={styles.sectionHint}>
              Selecione eletrodomésticos que aumentam seu consumo.
            </Text>
            <View style={styles.chipWrap}>
              {EQUIPAMENTOS.map((eq) => {
                const selected = equipamentos.includes(eq.label);
                return (
                  <TouchableOpacity
                    key={eq.label}
                    onPress={() => toggleEquipamento(eq.label)}
                    activeOpacity={0.78}
                    style={[styles.eqChip, selected && styles.eqChipSelected]}>
                    <Text style={[styles.eqText, selected && styles.eqTextSelected]}>
                      {eq.label}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </View>
          </ThemedView>

          {erro ? (
            <View style={styles.erroBox}>
              <MaterialIcons name="error-outline" size={18} color="#d32f2f" />
              <Text style={styles.erroText}>{erro}</Text>
            </View>
          ) : null}

          <PrimaryButton title="Continuar" onPress={gerarKit} icon="→" />
        </ScrollView>
      </KeyboardAvoidingView>
      <SettingsDrawer visible={menuAberto} onClose={() => setMenuAberto(false)} />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
safe: {
    flex: 1,
    backgroundColor: '#F7F8FA',
  },
  flex: {
    flex: 1,
  },
  content: {
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 36,
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 18,
    padding: 20,
    marginBottom: 18,
    shadowColor: '#000',
    shadowOpacity: 0.06,
    shadowRadius: 14,
    shadowOffset: { width: 0, height: 4 },
    elevation: 2,
  },
  row: {
    flexDirection: 'row',
    gap: 12,
  },
  rowItem: {
    flex: 1.4,
  },
  rowItemUF: {
    flex: 0.6,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '800',
    color: '#111827',
  },
  sectionHint: {
    fontSize: 13,
    color: '#6B7280',
    marginTop: 4,
    marginBottom: 14,
  },
  chipWrap: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 9,
  },
eqChip: {
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 22,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    backgroundColor: '#F8FAFC',
  },
  eqChipSelected: {
    backgroundColor: '#EAF2FF',
    borderColor: '#0B3D91',
  },
  eqText: {
    fontSize: 13,
    color: '#374151',
    fontWeight: '600',
  },
  eqTextSelected: {
    color: '#0B3D91',
  },
  erroBox: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: '#fdecea',
    borderRadius: 12,
    padding: 12,
    marginBottom: 16,
  },
  erroText: {
    color: '#d32f2f',
    fontSize: 14,
    flex: 1,
  },
});
