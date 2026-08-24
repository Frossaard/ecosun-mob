import type { KitResultado, ResidenciaInput } from '@/lib/solar';

/**
 * Armazenamento simples em memória para passar os dados entre as telas
 * (Formulário → Resultado → Detalhe). Simula o transporte de dados sem backend.
 */
class KitStore {
  private input: ResidenciaInput | null = null;
  private resultado: KitResultado | null = null;

  setInput(input: ResidenciaInput) {
    this.input = input;
  }

  getInput(): ResidenciaInput | null {
    return this.input;
  }

  setResultado(resultado: KitResultado) {
    this.resultado = resultado;
  }

  getResultado(): KitResultado | null {
    return this.resultado;
  }

  clear() {
    this.input = null;
    this.resultado = null;
  }
}

export const kitStore = new KitStore();

/** Dados do perfil do usuário (mantidos em memória durante a sessão). */
export interface DadosPerfil {
  nome: string;
  email: string;
  telefone?: string;
  foto?: string | null;
}

class PerfilStore {
  private dados: DadosPerfil | null = null;

  set(dados: DadosPerfil) {
    this.dados = dados;
  }

  get(): DadosPerfil | null {
    return this.dados;
  }

  clear() {
    this.dados = null;
  }
}

export const perfilStore = new PerfilStore();

/**
 * Histórico simples (em memória) de resultados de simulações.
 * Persistência pode ser adicionada posteriormente via AsyncStorage/expo-file-system.
 */
class HistoryStore {
  private items: { id: string; input: any; resultado: any; createdAt: number }[] = [];

  add(input: any, resultado: any) {
    const id = String(Date.now());
    this.items.unshift({ id, input, resultado, createdAt: Date.now() });
    return id;
  }

  list() {
    return this.items.slice();
  }

  clear() {
    this.items = [];
  }
}

export const historyStore = new HistoryStore();
