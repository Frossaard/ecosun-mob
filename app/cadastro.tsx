import { MaterialIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useState } from 'react';
import { KeyboardAvoidingView, Platform, Pressable, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { PrimaryButton } from '@/components/primary-button';
import { useAuth } from '@/lib/auth';

export default function CadastroScreen() {
  const router = useRouter();
  const { cadastrar } = useAuth();
  const [nome, setNome] = useState('');
  const [telefone, setTelefone] = useState('');
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [erro, setErro] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function enviar() {
    setErro(null);
    if (nome.trim().split(/\s+/).length < 2) return setErro('Informe seu nome completo.');
    if (!/\S+@\S+\.\S+/.test(email.trim())) return setErro('Informe um e-mail válido.');
    if (senha.length < 6) return setErro('A senha deve ter pelo menos 6 caracteres.');
    setLoading(true);
    const mensagem = await cadastrar({ nome: nome.trim(), telefone: telefone.trim(), email: email.trim().toLowerCase(), senha });
    setLoading(false);
    if (mensagem) return setErro(mensagem);
    router.replace('/(app)/form');
  }

  return (
    <SafeAreaView style={styles.safe}>
      <KeyboardAvoidingView style={styles.flex} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
        <ScrollView contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled">
          <Pressable onPress={() => router.back()} style={styles.back}><MaterialIcons name="arrow-back" size={22} color="#0B6672" /><Text style={styles.backText}>Voltar</Text></Pressable>
          <Text style={styles.title}>Crie sua conta</Text>
          <Text style={styles.subtitle}>Comece a planejar uma energia mais limpa.</Text>
          <View style={styles.card}>
            <Field icon="person-outline" label="Nome completo" value={nome} onChangeText={setNome} placeholder="Seu nome completo" />
            <Field icon="phone" label="Telefone" value={telefone} onChangeText={setTelefone} placeholder="(00) 00000-0000" keyboardType="phone-pad" />
            <Field icon="mail-outline" label="E-mail" value={email} onChangeText={setEmail} placeholder="seu@email.com" keyboardType="email-address" />
            <Field icon="lock-outline" label="Senha" value={senha} onChangeText={setSenha} placeholder="Mínimo de 6 caracteres" secureTextEntry />
            {erro ? <Text style={styles.error}>{erro}</Text> : null}
            <PrimaryButton title="Cadastrar e continuar" onPress={enviar} loading={loading} icon="→" />
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

function Field({ icon, label, ...props }: { icon: React.ComponentProps<typeof MaterialIcons>['name']; label: string } & React.ComponentProps<typeof TextInput>) {
  return <View style={styles.field}><Text style={styles.label}>{label}</Text><View style={styles.inputWrap}><MaterialIcons name={icon} size={20} color="#789097" /><TextInput {...props} style={styles.input} placeholderTextColor="#9aa0a6" /></View></View>;
}

const styles = StyleSheet.create({ safe: { flex: 1, backgroundColor: '#F3F6F7' }, flex: { flex: 1 }, content: { flexGrow: 1, justifyContent: 'center', padding: 24 }, back: { alignItems: 'center', flexDirection: 'row', gap: 6, marginBottom: 32 }, backText: { color: '#0B6672', fontSize: 15, fontWeight: '700' }, title: { color: '#172B31', fontSize: 32, fontWeight: '800' }, subtitle: { color: '#70868D', fontSize: 15, marginTop: 8, marginBottom: 24 }, card: { backgroundColor: '#fff', borderRadius: 22, padding: 20, shadowColor: '#0D2D36', shadowOpacity: 0.08, shadowRadius: 14, shadowOffset: { width: 0, height: 5 }, elevation: 3 }, field: { gap: 6, marginBottom: 15 }, label: { color: '#263C43', fontSize: 14, fontWeight: '700' }, inputWrap: { alignItems: 'center', borderColor: '#E1E9EA', borderRadius: 13, borderWidth: 1, flexDirection: 'row', gap: 10, paddingHorizontal: 13 }, input: { color: '#172B31', flex: 1, fontSize: 16, paddingVertical: 13 }, error: { color: '#C0392B', fontSize: 13, marginBottom: 12 } });