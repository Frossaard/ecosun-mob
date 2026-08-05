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
