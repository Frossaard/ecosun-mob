/**
 * EcoSun AI — Lógica de dimensionamento de kits de energia solar.
 *
 * Esta camada contém toda a "inteligência" de cálculo de forma pura e isolada
 * da interface. Regras determinísticas locais simulam a IA de dimensionamento.
 */

/**
 * Tipos e parâmetros de entrada.
 */
export type TipoResidencia = 'casa' | 'apartamento' | 'comercio' | 'sitio';

export interface ResidenciaInput {
  consumoMensalKwh: number;
  tipo: TipoResidencia;
  cidade: string;
  estado: string;
  moradores?: number;
  equipamentos?: string[];
}

/**
 * Resultado do dimensionamento do kit.
 */
export interface KitResultado {
  // Geração
  consumoMensalKwh: number;
  geracaoMensalKwh: number;
  // Painéis
  quantidadePlacas: number;
  potenciaPlacaWp: number;
  potenciaSistemaKw: number;
  // Inversor
  potenciaInversorKw: number;
  quantidadeInversores: number;
  // Estrutura
  areaNecessariaM2: number;
  tipoEstrutura: 'Telhado' | 'Solo';
  // Energia estimada
  geracaoAnualKwh: number;
  // Economia
  economiaMensalBRL: number;
  economiaAnualBRL: number;
  // Custo / investimento
  custoTotalBRL: number;
  custoPlacasBRL: number;
  custoInversorBRL: number;
  custoEstruturaBRL: number;
  custoInstalacaoBRL: number;
  // Payback
  paybackAnos: number;
  // Metadados
  tarifaMediaBRL: number;
  irradiacaoKwh: number;
  localizacao: string;
}

export interface OpcaoEquipamento {
  label: string;
  consumoKwh: number;
}

/**
 * Opções de equipamentos com consumo médio mensal estimado (kWh/mês).
 */
export const EQUIPAMENTOS: OpcaoEquipamento[] = [
  { label: 'Ar-condicionado', consumoKwh: 160 },
  { label: 'Chuveiro elétrico', consumoKwh: 120 },
  { label: 'Geladeira', consumoKwh: 70 },
  { label: 'Máquina de lavar', consumoKwh: 40 },
  { label: 'Micro-ondas', consumoKwh: 14 },
  { label: 'Televisão', consumoKwh: 25 },
  { label: 'Piscina (bomba)', consumoKwh: 180 },
  { label: 'Aquecedor elétrico', consumoKwh: 90 },
];

/**
 * Fatores de irradiação solar (kWh/m²/dia) por região do Brasil.
 * Quanto maior a irradiação, maior a geração por painel.
 */
const IRRADIACAO_POR_REGIAO: Record<string, number> = {
  'nordeste': 5.5,
  'centro-oeste': 5.2,
  'sudeste': 4.8,
  'sul': 4.4,
  'norte': 4.9,
};

/**
 * Tarifa média de energia (R$/kWh) por região, usada para estimar economia.
 */
const TARIFA_POR_REGIAO: Record<string, number> = {
  'nordeste': 0.72,
  'centro-oeste': 0.78,
  'sudeste': 0.85,
  'sul': 0.82,
  'norte': 0.88,
};

/**
 * Mapa dos estados brasileiros para suas regiões.
 */
const ESTADO_POR_REGIAO: Record<string, string> = {
  AC: 'norte',
  AP: 'norte',
  AM: 'norte',
  PA: 'norte',
  RO: 'norte',
  RR: 'norte',
  TO: 'norte',
  AL: 'nordeste',
  BA: 'nordeste',
  CE: 'nordeste',
  MA: 'nordeste',
  PB: 'nordeste',
  PE: 'nordeste',
  PI: 'nordeste',
  RN: 'nordeste',
  SE: 'nordeste',
  GO: 'centro-oeste',
  MT: 'centro-oeste',
  MS: 'centro-oeste',
  DF: 'centro-oeste',
  SP: 'sudeste',
  RJ: 'sudeste',
  MG: 'sudeste',
  ES: 'sudeste',
  PR: 'sul',
  SC: 'sul',
  RS: 'sul',
};

/**
 * Propriedades padrão de um módulo fotovoltaico.
 */
const PLACA = {
  potenciaWp: 550,
  dimensaoM2: 2.6,
};

/**
 * Fator de eficiência do sistema (perdas de inversor, cabeamento, temperatura).
 */
const FATOR_DESEMPENHO = 0.8;

/**
 * Custo por componente (valores de referência em R$/Wp ou R$/unidade).
 */
const CUSTO = {
  placaPorWp: 2.9, // R$ por Wp dos módulos
  inversorPorKw: 900, // R$ por kW de inversor
  estruturaPorM2: 180, // R$ por m² de estrutura
  instalacaoPorKw: 700, // R$ por kW de mão de obra/instalação
};

/**
 * Normaliza o estado para a sigla (UF) informada pelo usuário.
 */
function normalizarUF(estado: string): string {
  const sigla = estado.trim().toUpperCase().slice(0, 2);
  return ESTADO_POR_REGIAO[sigla] ? sigla : '';
}

/**
 * Determina a região com base no estado informado.
 */
function obterRegiao(estado: string): string {
  const uf = normalizarUF(estado);
  if (uf && ESTADO_POR_REGIAO[uf]) {
    return ESTADO_POR_REGIAO[uf];
  }
  // Fallback: sudeste (região mais comum)
  return 'sudeste';
}

/**
 * Ajusta o consumo informado com base nos equipamentos selecionados.
 * Simula o "entendimento" da IA sobre a carga adicional declarada.
 */
function ajustarConsumoPorEquipamentos(
  consumoInformado: number,
  equipamentos: string[] = []
): number {
  if (equipamentos.length === 0) {
    return consumoInformado;
  }
  const extra = equipamentos.reduce((soma, nome) => {
    const opcao = EQUIPAMENTOS.find((e) => e.label === nome);
    return soma + (opcao ? opcao.consumoKwh : 0);
  }, 0);
  // Leva em conta apenas o excedente que o usuário ainda não declarou no consumo médio.
  return consumoInformado + Math.round(extra * 0.7);
}

/**
 * Função principal que dimensiona o kit de energia solar.
 * @param input Dados fornecidos pelo usuário.
 * @returns KitResultado completo.
 */
export function dimensionarKit(input: ResidenciaInput): KitResultado {
  const regiao = obterRegiao(input.estado);
  const irradiacao = IRRADIACAO_POR_REGIAO[regiao];
  const tarifa = TARIFA_POR_REGIAO[regiao];

  const consumoAjustado = Math.max(
    50,
    ajustarConsumoPorEquipamentos(input.consumoMensalKwh, input.equipamentos)
  );

  // Consumo diário e geração diária necessária
  const consumoDiario = consumoAjustado / 30;
  const geracaoMensalTarget = consumoAjustado * 1.1; // 10% de folga

  // Cálculo do número de placas
  const geracaoDiariaPorPlaca = PLACA.potenciaWp / 1000 * irradiacao * FATOR_DESEMPENHO;
  const quantidadePlacas = Math.max(1, Math.ceil(consumoDiario / geracaoDiariaPorPlaca));

  // Potência do sistema (kWp)
  const potenciaSistemaKw = (quantidadePlacas * PLACA.potenciaWp) / 1000;

  // Geração mensal estimada (kWh)
  const geracaoMensalKwh = Math.round(
    quantidadePlacas * (PLACA.potenciaWp / 1000) * irradiacao * FATOR_DESEMPENHO * 30
  );
  const geracaoAnualKwh = geracaoMensalKwh * 12;

  // Inversor: recomenda ~80-90% da potência de pico
  const potenciaInversorKw = potenciaSistemaKw * 0.85;
  // Modelos comuns de inversor (kW) — escolhe o mais próximo padronizado
  const modelosInversor = [3, 5, 6, 8, 10, 12, 15, 20, 25, 30, 40, 50];
  const potenciaInversorPadrao = modelosInversor.reduce((prev, curr) =>
    Math.abs(curr - potenciaInversorKw) < Math.abs(prev - potenciaInversorKw) ? curr : prev
  );
  const quantidadeInversores = Math.ceil(potenciaInversorKw / potenciaInversorPadrao);

  // Estrutura
  const areaNecessariaM2 = Math.ceil(quantidadePlacas * PLACA.dimensaoM2);
  const tipoEstrutura: 'Telhado' | 'Solo' =
    input.tipo === 'apartamento' || input.tipo === 'comercio' ? 'Telhado' : 'Solo';

  // Economia estimada
  const economiaMensalBRL = Math.round(geracaoMensalKwh * tarifa);
  const economiaAnualBRL = economiaMensalBRL * 12;

  // Custos
  const custoPlacasBRL = potenciaSistemaKw * 1000 * CUSTO.placaPorWp;
  const custoInversorBRL = potenciaInversorPadrao * quantidadeInversores * CUSTO.inversorPorKw;
  const custoEstruturaBRL = areaNecessariaM2 * CUSTO.estruturaPorM2;
  const custoInstalacaoBRL = potenciaSistemaKw * CUSTO.instalacaoPorKw;
  const custoTotalBRL = Math.round(
    custoPlacasBRL + custoInversorBRL + custoEstruturaBRL + custoInstalacaoBRL
  );

  // Payback (anos)
  const paybackAnos = economiaAnualBRL > 0 ? custoTotalBRL / economiaAnualBRL : 0;

  return {
    consumoMensalKwh: consumoAjustado,
    geracaoMensalKwh,
    quantidadePlacas,
    potenciaPlacaWp: PLACA.potenciaWp,
    potenciaSistemaKw: Math.round(potenciaSistemaKw * 10) / 10,
    potenciaInversorKw: potenciaInversorPadrao,
    quantidadeInversores,
    areaNecessariaM2,
    tipoEstrutura,
    geracaoAnualKwh,
    economiaMensalBRL,
    economiaAnualBRL,
    custoTotalBRL,
    custoPlacasBRL: Math.round(custoPlacasBRL),
    custoInversorBRL: Math.round(custoInversorBRL),
    custoEstruturaBRL: Math.round(custoEstruturaBRL),
    custoInstalacaoBRL: Math.round(custoInstalacaoBRL),
    paybackAnos: Math.round(paybackAnos * 10) / 10,
    tarifaMediaBRL: tarifa,
    irradiacaoKwh: irradiacao,
    localizacao: `${input.cidade || '—'} - ${input.estado}`,
  };
}

/**
 * Formata valores em moeda brasileira (BRL).
 */
export function formatarMoeda(valor: number): string {
  return valor.toLocaleString('pt-BR', {
    style: 'currency',
    currency: 'BRL',
    maximumFractionDigits: 0,
  });
}

/**
 * Formata números com separador de milhar pt-BR.
 */
export function formatarNumero(valor: number): string {
  return valor.toLocaleString('pt-BR');
}
