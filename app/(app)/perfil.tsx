import { MaterialIcons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import { useState } from 'react';
import {
  Image,
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
import { perfilStore } from '@/lib/store';

export default function PerfilScreen() {
  const perfil = perfilStore.get();
  const [foto, setFoto] = useState<string | null>(perfil?.foto ?? null);
  const [nome, setNome] = useState(perfil?.nome ?? 'Usuário EcoSun');
  const [email, setEmail] = useState(perfil?.email ?? 'usuario@ecosun.com.br');
  const [telefone, setTelefone] = useState(perfil?.telefone ?? '');
  const [editando, setEditando] = useState(false);

  function salvarPerfil() {
    perfilStore.set({
      foto,
      nome: nome.trim() || 'Usuário EcoSun',
      email: email.trim() || 'usuario@ecosun.com.br',
      telefone: telefone.trim(),
    });
    setNome(nome.trim() || 'Usuário EcoSun');
    setEmail(email.trim() || 'usuario@ecosun.com.br');
    setEditando(false);
  }

  async function alterarFoto() {
    const permissao = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!permissao.granted) {
      const camera = await ImagePicker.requestCameraPermissionsAsync();
      if (!camera.granted) {
        return;
      }
    }

    const resultado = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images'],
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.8,
    });

    if (!resultado.canceled && resultado.assets[0]) {
      setFoto(resultado.assets[0].uri);
    }
  }

  return (
    <SafeAreaView style={styles.safe} edges={['bottom']}>
      <ScreenHeader
        title="Meu Perfil"
        subtitle="Gerencie suas informações pessoais e foto de perfil."
      />
      <KeyboardAvoidingView
        style={styles.flex}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
        <ScrollView
          contentContainerStyle={styles.content}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}>
          {/* Foto de perfil */}
          <ThemedView style={styles.photoCard}>
            <Pressable onPress={alterarFoto} style={styles.avatarWrap}>
              {foto ? (
                <Image source={{ uri: foto }} style={styles.avatar} />
              ) : (
                <View style={styles.avatarPlaceholder}>
                  <MaterialIcons name="person" size={56} color="#0a7ea4" />
                </View>
              )}
              <View style={styles.cameraBadge}>
                <MaterialIcons name="photo-camera" size={18} color="#fff" />
              </View>
            </Pressable>
            <Text style={styles.photoName}>{nome}</Text>
            <Text style={styles.photoEmail}>{email}</Text>
          </ThemedView>

          {/* Dados */}
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
                  <MaterialIcons name="person" size={22} color="#0a7ea4" />
                  <View style={styles.infoTextWrap}>
                    <Text style={styles.infoLabel}>Nome</Text>
                    <Text style={styles.infoValue}>{nome}</Text>
                  </View>
                </View>
                <View style={styles.divider} />
                <View style={styles.infoRow}>
                  <MaterialIcons name="mail-outline" size={22} color="#0a7ea4" />
                  <View style={styles.infoTextWrap}>
                    <Text style={styles.infoLabel}>E-mail</Text>
                    <Text style={styles.infoValue}>{email}</Text>
                  </View>
                </View>
                <View style={styles.divider} />
                <View style={styles.infoRow}>
                  <MaterialIcons name="phone" size={22} color="#0a7ea4" />
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

          <Pressable style={styles.fotoButton} onPress={alterarFoto}>
            <MaterialIcons name="add-a-photo" size={20} color="#0a7ea4" />
            <Text style={styles.fotoButtonText}>Alterar foto</Text>
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
  photoCard: {
    backgroundColor: '#fff',
    borderRadius: 22,
    padding: 24,
    alignItems: 'center',
    marginBottom: 16,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 4 },
    elevation: 2,
  },
  avatarWrap: {
    position: 'relative',
    marginBottom: 12,
  },
  avatar: {
    width: 110,
    height: 110,
    borderRadius: 55,
    backgroundColor: '#eef2f5',
  },
  avatarPlaceholder: {
    width: 110,
    height: 110,
    borderRadius: 55,
    backgroundColor: '#e8f6fb',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 3,
    borderColor: '#0a7ea4',
  },
  cameraBadge: {
    position: 'absolute',
    right: 0,
    bottom: 0,
    width: 34,
    height: 34,
    borderRadius: 17,
    backgroundColor: '#0a7ea4',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 3,
    borderColor: '#fff',
  },
  photoName: {
    fontSize: 20,
    fontWeight: '800',
    color: '#11181c',
  },
  photoEmail: {
    fontSize: 14,
    color: '#7a8288',
    marginTop: 4,
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
    backgroundColor: '#0a7ea4',
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
    backgroundColor: '#0a7ea4',
    paddingVertical: 14,
    borderRadius: 14,
  },
  salvarText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '700',
  },
  fotoButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#0a7ea4',
    paddingVertical: 14,
    borderRadius: 14,
  },
  fotoButtonText: {
    color: '#0a7ea4',
    fontSize: 16,
    fontWeight: '700',
  },
});
