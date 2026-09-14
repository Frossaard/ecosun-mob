import AsyncStorage from '@react-native-async-storage/async-storage';
import { usePathname, useRouter, useSegments } from 'expo-router';
import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from 'react';

import { autenticarUsuario, cadastrarUsuario } from '@/lib/api';
import { perfilStore } from '@/lib/store';

export interface Usuario {
  nome: string;
  telefone: string;
  email: string;
  senha?: string;
}

interface AuthContextValue {
  usuario: Usuario | null;
  carregando: boolean;
  entrar: (email: string, senha: string) => Promise<string | null>;
  cadastrar: (usuario: Usuario) => Promise<string | null>;
  atualizarUsuario: (usuario: Usuario) => Promise<void>;
  sair: () => Promise<void>;
}

const SESSION_KEY = '@ecosun/sessao';
const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [usuario, setUsuario] = useState<Usuario | null>(null);
  const [carregando, setCarregando] = useState(true);

  useEffect(() => {
    AsyncStorage.getItem(SESSION_KEY)
      .then((value) => {
        if (!value) return null;
        try {
          const sessao = JSON.parse(value) as Usuario;
          setUsuario(sessao);
          if (sessao) perfilStore.set(sessao);
          return sessao;
        } catch (err) {
          // valor armazenado inválido — remover para evitar loop de parse
          AsyncStorage.removeItem(SESSION_KEY).catch(() => {});
          console.warn('Sessão inválida no AsyncStorage; limpando chave de sessão');
          setUsuario(null);
          return null;
        }
      })
      .catch(() => setUsuario(null))
      .finally(() => setCarregando(false));
  }, []);

  async function entrar(email: string, senha: string) {
    try {
      const remoto = await autenticarUsuario(email, senha);
      const encontrado = { ...remoto, senha };
      await AsyncStorage.setItem(SESSION_KEY, JSON.stringify(encontrado));
      setUsuario(encontrado);
      perfilStore.set(encontrado);
      return null;
    } catch (error) {
      return error instanceof Error ? error.message : 'Não foi possível entrar agora.';
    }
  }

  async function cadastrar(novoUsuario: Usuario) {
    try {
      const remoto = await cadastrarUsuario({
        nome: novoUsuario.nome,
        telefone: novoUsuario.telefone,
        email: novoUsuario.email,
        senha: novoUsuario.senha || '',
      });
      const criado = { ...remoto, senha: novoUsuario.senha };
      await AsyncStorage.setItem(SESSION_KEY, JSON.stringify(criado));
      setUsuario(criado);
      perfilStore.set(criado);
      return null;
    } catch (error) {
      return error instanceof Error ? error.message : 'Não foi possível criar a conta.';
    }
  }

  async function atualizarUsuario(atualizado: Usuario) {
    await AsyncStorage.setItem(SESSION_KEY, JSON.stringify(atualizado));
    setUsuario(atualizado);
    perfilStore.set(atualizado);
  }

  async function sair() {
    await AsyncStorage.removeItem(SESSION_KEY);
    setUsuario(null);
    perfilStore.clear();
  }

  const value = useMemo(
    () => ({ usuario, carregando, entrar, cadastrar, atualizarUsuario, sair }),
    [usuario, carregando]
  );
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth deve ser usado dentro de AuthProvider');
  return context;
}

export function AuthGate() {
  const { usuario, carregando } = useAuth();
  const segments = useSegments();
  const pathname = usePathname();
  const router = useRouter();
  const areaPublica = pathname === '/' || pathname === '/cadastro';

  useEffect(() => {
    if (carregando) return;
    if (!usuario && !areaPublica) router.replace('/');
    if (usuario && areaPublica) router.replace('/(app)/form');
  }, [carregando, usuario, areaPublica, router, segments]);

  return null;
}