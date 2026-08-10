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
    TextInput,
    View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { PrimaryButton } from '@/components/primary-button';

/**
 * Credenciais de demonstração (mock de autenticação).
 * Qualquer e-mail válido + senha com 6+ caracteres funciona.
 */
const USUARIO_DEMO = {
  email: 'demo@ecosun.com.br',
  senha: '123456',
};

export default function LoginScreen() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [loading, setLoading] = useState(false);
  const [erro, setErro] = useState<string | null>(null);
  const [verSenha, setVerSenha] = useState(false);

  function autenticar() {
    setErro(null);

    const emailValido = /\S+@\S+\.\S+/.test(email.trim());
    if (!emailValido) {
      setErro('Informe um e-mail válido.');
      return;
    }
    if (senha.length < 6) {
      setErro('A senha deve ter pelo menos 6 caracteres.');
      return;
    }

    setLoading(true);

    // Simula chamada de autenticação (mock).
    setTimeout(() => {
      setLoading(false);
      if (
        email.trim().toLowerCase() === USUARIO_DEMO.email &&
        senha === USUARIO_DEMO.senha
      ) {
        router.replace('/(app)/form');
      } else {
        // Aceita qualquer e-mail válido como login de demonstração.
        router.replace('/(app)/form');
      }
    }, 900);
  }

  function preencherDemo() {
    setEmail(USUARIO_DEMO.email);
    setSenha(USUARIO_DEMO.senha);
    setErro(null);
  }

  return (
    <SafeAreaView style={styles.safe}>
      <KeyboardAvoidingView
        style={styles.flex}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
        <ScrollView
          contentContainerStyle={styles.content}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}>
          <View style={styles.brand}>
            <View style={styles.logoCircle}>
              <MaterialIcons name="solar-power" size={52} color="#fff" />
            </View>
            <Text style={styles.brandName}>EcoSun</Text>
            <Text style={styles.brandTagline}>
              Dimensionamento inteligente de energia solar
            </Text>
          </View>

          <View style={styles.card}>
            <Text style={styles.cardTitle}>Acesse sua conta</Text>
            <Text style={styles.cardSubtitle}>
              Entre para simular seu kit solar personalizado.
            </Text>

            <View style={styles.field}>
              <Text style={styles.label}>E-mail</Text>
              <View style={styles.inputWrap}>
                <MaterialIcons name="mail-outline" size={20} color="#9aa0a6" />
                <TextInput
                  value={email}
                  onChangeText={setEmail}
                  placeholder="seu@email.com"
                  placeholderTextColor="#9aa0a6"
                  keyboardType="email-address"
                  autoCapitalize="none"
                  autoCorrect={false}
                  style={styles.input}
                />
              </View>
            </View>

            <View style={styles.field}>
              <Text style={styles.label}>Senha</Text>
              <View style={styles.inputWrap}>
                <MaterialIcons name="lock-outline" size={20} color="#9aa0a6" />
                <TextInput
                  value={senha}
                  onChangeText={setSenha}
                  placeholder="••••••"
                  placeholderTextColor="#9aa0a6"
                  secureTextEntry={!verSenha}
                  style={styles.input}
                />
                <Pressable onPress={() => setVerSenha((v) => !v)} hitSlop={8}>
                  <MaterialIcons
                    name={verSenha ? 'visibility-off' : 'visibility'}
                    size={20}
                    color="#9aa0a6"
                  />
                </Pressable>
              </View>
            </View>

            {erro ? <Text style={styles.erro}>{erro}</Text> : null}

            <PrimaryButton
              title="Entrar"
              onPress={autenticar}
              loading={loading}
              icon="→"
            />

            <Pressable onPress={preencherDemo} style={styles.demoButton}>
              <Text style={styles.demoText}>Usar credenciais de demonstração</Text>
            </Pressable>
          </View>

          <Text style={styles.footer}>
            EcoSun AI • Simulação local • Dados não enviados a servidores
          </Text>
        </ScrollView>
      </KeyboardAvoidingView>
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
    flexGrow: 1,
    justifyContent: 'center',
    paddingHorizontal: 24,
    paddingVertical: 32,
  },
  brand: {
    alignItems: 'center',
    marginBottom: 32,
  },
  logoCircle: {
    width: 92,
    height: 92,
    borderRadius: 30,
    backgroundColor: '#rgb(6, 79, 104)',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
    shadowColor: '#rgb(6, 79, 104)',
    shadowOpacity: 0.35,
    shadowRadius: 14,
    shadowOffset: { width: 0, height: 6 },
    elevation: 6,
  },
  brandName: {
    fontSize: 34,
    fontWeight: '800',
    color: '#rgb(6, 79, 104)',
    letterSpacing: 0.5,
  },
  brandTagline: {
    fontSize: 15,
    color: '#607d8b',
    marginTop: 6,
    textAlign: 'center',
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 24,
    padding: 24,
    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowRadius: 16,
    shadowOffset: { width: 0, height: 6 },
    elevation: 4,
  },
  cardTitle: {
    fontSize: 22,
    fontWeight: '800',
    color: '#11181c',
  },
  cardSubtitle: {
    fontSize: 14,
    color: '#7a8288',
    marginTop: 4,
    marginBottom: 20,
  },
  field: {
    marginBottom: 16,
    gap: 6,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: '#111827',
  },
inputWrap: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: 14,
    paddingHorizontal: 14,
  },
  input: {
    flex: 1,
    paddingVertical: 14,
    fontSize: 16,
    color: '#11181c',
  },
  erro: {
    color: '#d32f2f',
    fontSize: 13,
    marginBottom: 12,
  },
  demoButton: {
    marginTop: 16,
    alignItems: 'center',
    paddingVertical: 8,
  },
  demoText: {
    color: '#rgb(6, 79, 104)',
    fontSize: 14,
    fontWeight: '600',
  },
  footer: {
    textAlign: 'center',
    color: '#90a4ae',
    fontSize: 12,
    marginTop: 24,
  },
});
