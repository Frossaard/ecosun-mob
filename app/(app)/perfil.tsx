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

import { ScreenHeader } from '@/components/screen-header';
import { ThemedView } from '@/components/themed-view';
import { useAuth } from '@/lib/auth';
import { useSettingsMenu } from '@/lib/settings-menu';
import { perfilStore } from '@/lib/store';

export default function PerfilScreen() {
  const perfil = perfilStore.get();
  const router = useRouter();
  const { setOpen } = useSettingsMenu();
  const { usuario, atualizarUsuario, sair } = useAuth();
  const [nome, setNome] = useState(usuario?.nome ?? perfil?.nome ?? 'Usuário EcoSun');
  const [email, setEmail] = useState(usuario?.email ?? perfil?.email ?? 'usuario@ecosun.com.br');
  const [telefone, setTelefone] = useState(usuario?.telefone ?? perfil?.telefone ?? '');
  const [editando, setEditando] = useState(false);

  function salvarPerfil() {
    perfilStore.set({
      nome: nome.trim() || 'Usuário EcoSun',
      email: email.trim() || 'usuario@ecosun.com.br',
      telefone: telefone.trim(),
    });
    void atualizarUsuario({ nome: nome.trim() || 'Usuário EcoSun', email: email.trim() || 'usuario@ecosun.com.br', telefone: telefone.trim(), senha: usuario?.senha ?? '' });
    setNome(nome.trim() || 'Usuário EcoSun');
    setEmail(email.trim() || 'usuario@ecosun.com.br');
    setEditando(false);
  }

  async function sairDaConta() {
    await sair();
  }

  function voltarParaMenu() {
    router.back();
    setOpen(true);
  }

  return (
    <SafeAreaView style={styles.safe} edges={['bottom']}>
      <ScreenHeader
        showBack
        onBack={voltarParaMenu}
        title="Meu Perfil"
        subtitle="Gerencie suas informações pessoais."
      />
      <KeyboardAvoidingView
        style={styles.flex}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
        <ScrollView
          contentContainerStyle={styles.content}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}>
          <ThemedView style={styles.card}>
            {editando ? (
              <>
                <View style={styles.field}>
                  <Text style={styles.label}>Nome</Text>
                  <View style={styles.inputWrap}>
                    <TextInput
                      value={nome}
                      onChangeText={setNome}
                      placeholder="Seu nome"
                      placeholderTextColor="#9aa0a6"
                      style={styles.input}
                    />
                  </View>
                </View>
                <View style={styles.field}>
                  <Text style={styles.label}>E-mail</Text>
                  <View style={styles.inputWrap}>
                    <TextInput
                      value={email}
                      onChangeText={setEmail}
                      placeholder="seu@email.com"
                      placeholderTextColor="#9aa0a6"
                      keyboardType="email-address"
                      autoCapitalize="none"
                      style={styles.input}
                    />
                  </View>
                </View>
                <View style={styles.field}>
                  <Text style={styles.label}>Telefone</Text>
                  <View style={styles.inputWrap}>
                    <TextInput
                      value={telefone}
                      onChangeText={setTelefone}
                      placeholder="(00) 00000-0000"
                      placeholderTextColor="#9aa0a6"
                      keyboardType="phone-pad"
                      style={styles.input}
                    />
                  </View>
                </View>
              </>
            ) : (
              <>
                <View style={styles.infoRow}>
                  <MaterialIcons name="person" size={22} color="#0B3D91" />
                  <View style={styles.infoTextWrap}>
                    <Text style={styles.infoLabel}>Nome</Text>
                    <Text style={styles.infoValue}>{nome}</Text>
                  </View>
                </View>
                <View style={styles.divider} />
                <View style={styles.infoRow}>
                  <MaterialIcons name="mail-outline" size={22} color="#0B3D91" />
                  <View style={styles.infoTextWrap}>
                    <Text style={styles.infoLabel}>E-mail</Text>
                    <Text style={styles.infoValue}>{email}</Text>
                  </View>
                </View>
                <View style={styles.divider} />
                <View style={styles.infoRow}>
                  <MaterialIcons name="phone" size={22} color="#0B3D91" />
                  <View style={styles.infoTextWrap}>
                    <Text style={styles.infoLabel}>Telefone</Text>
                    <Text style={styles.infoValue}>{telefone || 'Não informado'}</Text>
                  </View>
                </View>
              </>
            )}

            <View style={styles.actions}>
              {editando ? (
                <Pressable style={styles.salvarButton} onPress={salvarPerfil}>
                  <MaterialIcons name="check" size={20} color="#fff" />
                  <Text style={styles.salvarText}>Salvar</Text>
                </Pressable>
              ) : (
                <Pressable style={styles.editarButton} onPress={() => setEditando(true)}>
                  <MaterialIcons name="edit" size={20} color="#fff" />
                  <Text style={styles.editarText}>Editar dados</Text>
                </Pressable>
              )}
            </View>
          </ThemedView>

          <Pressable style={styles.logoutButton} onPress={sairDaConta}>
            <MaterialIcons name="logout" size={20} color="#C0392B" />
            <Text style={styles.logoutText}>Sair da conta</Text>
          </Pressable>
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
  field: {
    marginBottom: 14,
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
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: 14,
    paddingHorizontal: 14,
  },
  input: {
    flex: 1,
    paddingVertical: 13,
    fontSize: 16,
    color: '#11181c',
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
    paddingVertical: 8,
  },
  infoTextWrap: {
    flex: 1,
  },
  infoLabel: {
    fontSize: 13,
    color: '#9aa0a6',
    fontWeight: '600',
  },
  infoValue: {
    fontSize: 16,
    color: '#11181c',
    fontWeight: '600',
    marginTop: 2,
  },
  divider: {
    height: StyleSheet.hairlineWidth,
    backgroundColor: '#eef0f2',
  },
  actions: {
    marginTop: 16,
  },
  editarButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: '#0B3D91',
    paddingVertical: 14,
    borderRadius: 14,
  },
  editarText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '700',
  },
  salvarButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: '#0B3D91',
    paddingVertical: 14,
    borderRadius: 14,
  },
  salvarText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '700',
  },
  logoutButton: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: 8,
    justifyContent: 'center',
    marginTop: 16,
    paddingVertical: 14,
  },
  logoutText: {
    color: '#C0392B',
    fontSize: 16,
    fontWeight: '700',
  },
});
