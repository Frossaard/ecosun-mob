import { MaterialIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useState } from 'react';
import {
    KeyboardAvoidingView,
    Platform,
    Pressable,
    ScrollView,
    StyleSheet,
    Text,
    View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { ChipSelect } from '@/components/chip-select';
import { FormField } from '@/components/form-field';
import { PrimaryButton } from '@/components/primary-button';
import { ScreenHeader } from '@/components/screen-header';
import { ThemedView } from '@/components/themed-view';
import { dimensionarKit, EQUIPAMENTOS, type TipoResidencia } from '@/lib/solar';
import { kitStore } from '@/lib/store';

const TIPOS: { value: TipoResidencia; label: string }[] = [
  { value: 'casa', label: 'Casa' },
  { value: 'apartamento', label: 'Apartamento' },
  { value: 'comercio', label: 'Comércio' },
  { value: 'sitio', label: 'Sítio' },
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
    router.push('/(app)/result');
  }

  return (
    <SafeAreaView style={styles.safe} edges={['bottom']}>
      <ScreenHeader
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
                  <Pressable
                    key={eq.label}
                    onPress={() => toggleEquipamento(eq.label)}
                    style={[styles.eqChip, selected && styles.eqChipSelected]}>
                    <Text style={[styles.eqText, selected && styles.eqTextSelected]}>
                      {eq.label}
                    </Text>
                  </Pressable>
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

          <PrimaryButton title="Gerar meu kit" onPress={gerarKit} icon="⚡" />
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: '#f2f7f9',
  },
  flex: {
    flex: 1,
  },
  content: {
    padding: 20,
    paddingBottom: 40,
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
    fontWeight: '700',
    color: '#11181c',
  },
  sectionHint: {
    fontSize: 13,
    color: '#7a8288',
    marginTop: 4,
    marginBottom: 14,
  },
  chipWrap: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  eqChip: {
    paddingHorizontal: 14,
    paddingVertical: 9,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#e0e3e5',
    backgroundColor: '#f5f7f8',
  },
  eqChipSelected: {
    backgroundColor: '#fff3e0',
    borderColor: '#f59e0b',
  },
  eqText: {
    fontSize: 13,
    color: '#37474f',
    fontWeight: '600',
  },
  eqTextSelected: {
    color: '#b45309',
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
