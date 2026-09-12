import type { KitResultado, ResidenciaInput } from '@/lib/solar';
import type { DadosPerfil } from '@/lib/store';

export interface UsuarioApi {
  nome: string;
  telefone: string;
  email: string;
}

const API_URL = (process.env.EXPO_PUBLIC_API_URL || 'http://localhost:3000').replace(/\/$/, '');

if (API_URL.includes('localhost') || API_URL.includes('127.0.0.1')) {
  console.warn(
    'EcoSun API: EXPO_PUBLIC_API_URL aponta para localhost. Em um aparelho físico, use uma URL pública ou o IP da máquina.'
  );
}

async function postJson(path: string, body: object) {
  try {
    return await fetch(`${API_URL}${path}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    });
  } catch {
    throw new Error(
      `Não foi possível conectar à API em ${API_URL}. Verifique EXPO_PUBLIC_API_URL e se o backend está ativo.`
    );
  }
}

async function requestAuth(path: string, body: object): Promise<UsuarioApi> {
  const response = await postJson(`/api/auth/${path}`, body);
  const payload = (await response.json()) as { success?: boolean; usuario?: UsuarioApi; message?: string };
  if (!response.ok || !payload.success || !payload.usuario) {
    throw new Error(payload.message || 'Não foi possível concluir a operação');
  }
  return payload.usuario;
}

export function cadastrarUsuario(usuario: { nome: string; telefone: string; email: string; senha: string }) {
  return requestAuth('register', usuario);
}

export function autenticarUsuario(email: string, senha: string) {
  return requestAuth('login', { email, senha });
}

export async function salvarSimulacao(
  input: ResidenciaInput,
  resultado: KitResultado,
  perfil: DadosPerfil
): Promise<{ id: number }> {
  const response = await postJson('/api/simulacoes', { input, resultado, perfil });

  const payload = (await response.json()) as { success?: boolean; id?: number; message?: string };
  if (!response.ok || !payload.success || typeof payload.id !== 'number') {
    throw new Error(payload.message || 'Não foi possível salvar a simulação');
  }

  return { id: payload.id };
}