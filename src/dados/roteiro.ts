import segmentos from "./segmentos.json";
import { CAMERA_ATO1, PECA, TOPO, V3 } from "./posicoes";

export type Quando = "problema" | "segunda" | "solucao";
export type TipoEtiqueta = "problema" | "solucao" | "cinza";
export type { V3 };
export type Vec3 = V3;

export type Etiqueta = {
  quando: Quando;
  texto: string;
  tipo: TipoEtiqueta;
  // ponto do mundo onde a etiqueta fica ancorada (padrao: acima da peca do segmento)
  alvo?: V3;
  ate?: Quando;
  // se definido, a etiqueta nasce nesta fracao (0..1) da duracao do segmento em vez de na ancora
  fracao?: number;
};

export type ItemRoteiro = {
  id: string;
  texto: string;
  titulo: string | null;
  tarefa: string | null;
  etiquetas: Etiqueta[];
};

export const N_PECAS = 13;

// ancoras padrao das etiquetas: ato 1 sobre a camera do fotografo; ato 2 sobre a peca; casal cliente
const SOBRE_CAMERA: V3 = [CAMERA_ATO1[0], 2.95, CAMERA_ATO1[2]];
const sobrePeca = (n: number, alto = 1.55): V3 => [PECA[n][0], TOPO + alto, PECA[n][2]];
const SOBRE_CASAL = (x: number, z: number): V3 => [x, 3.0, z];

const extra: Record<string, Omit<ItemRoteiro, "id" | "texto">> = {
  s00: {
    titulo: null, tarefa: null,
    etiquetas: [{ quando: "problema", texto: "FOTÓGRAFO?", tipo: "problema", alvo: [-3.4, 3.0, -0.6], ate: "solucao" }],
  },
  s01: {
    titulo: "CÂMERA", tarefa: "comprar uma câmera",
    etiquetas: [
      { quando: "problema", texto: "MODO AUTO", tipo: "problema", alvo: SOBRE_CAMERA },
      { quando: "solucao", texto: "APRENDE O MANUAL", tipo: "solucao", alvo: SOBRE_CAMERA },
    ],
  },
  s02: {
    titulo: "LENTE", tarefa: "trocar a lente do kit",
    etiquetas: [
      { quando: "problema", texto: "FOTO ESCURA", tipo: "problema", alvo: SOBRE_CAMERA },
      { quando: "solucao", texto: "50MM", tipo: "solucao", alvo: SOBRE_CAMERA },
    ],
  },
  s03: {
    titulo: "CARTÃO DUPLO", tarefa: "câmera com dois slots",
    etiquetas: [
      { quando: "problema", texto: "CARTÃO CORROMPEU", tipo: "problema", alvo: SOBRE_CAMERA },
      { quando: "solucao", texto: "SLOT 2 SALVOU", tipo: "solucao", alvo: SOBRE_CAMERA },
    ],
  },
  s04: {
    titulo: "FLASH", tarefa: "comprar um flash",
    etiquetas: [
      { quando: "segunda", texto: "ISO 12800", tipo: "problema", alvo: SOBRE_CASAL(-0.6, -0.6) },
      { quando: "solucao", texto: "LUZ NA PISTA", tipo: "solucao", alvo: SOBRE_CASAL(-0.6, -0.6) },
    ],
  },
  s05: {
    titulo: "PORTFÓLIO", tarefa: "montar o portfólio",
    etiquetas: [
      { quando: "problema", texto: "CADÊ SEU TRABALHO?", tipo: "problema", alvo: sobrePeca(5, 1.2) },
      { quando: "solucao", texto: "20 MELHORES", tipo: "solucao", alvo: sobrePeca(5, 1.2) },
    ],
  },
  s06: {
    titulo: "INSTAGRAM", tarefa: "criar o perfil",
    etiquetas: [
      { quando: "problema", texto: "NINGUÉM VIU", tipo: "problema", alvo: sobrePeca(6, 1.6) },
      { quando: "solucao", texto: "NOVO DIRECT", tipo: "solucao", alvo: SOBRE_CASAL(3.0, -1.2), fracao: 0.88 },
    ],
  },
  s07: {
    titulo: "PROPOSTA", tarefa: "fazer proposta em PDF",
    etiquetas: [
      { quando: "problema", texto: "VISUALIZOU", tipo: "cinza", alvo: SOBRE_CASAL(3.9, -1.2) },
      { quando: "solucao", texto: "QUERO FECHAR", tipo: "solucao", alvo: SOBRE_CASAL(3.9, -1.2) },
    ],
  },
  s08: {
    titulo: "CONTRATO", tarefa: "contrato assinado",
    etiquetas: [
      { quando: "problema", texto: "DESMARCOU", tipo: "problema", alvo: SOBRE_CASAL(3.4, -0.3) },
      { quando: "solucao", texto: "TEM O QUE COBRAR", tipo: "solucao", alvo: SOBRE_CASAL(3.4, -0.3) },
    ],
  },
  s09: {
    titulo: "SINAL", tarefa: "cobrar 30% de sinal",
    etiquetas: [
      { quando: "problema", texto: "SÓ PROMESSA", tipo: "problema", alvo: sobrePeca(9, 1.7) },
      { quando: "solucao", texto: "DATA RESERVADA", tipo: "solucao", alvo: sobrePeca(9, 1.7) },
    ],
  },
  s10: {
    titulo: "BACKUP", tarefa: "3 cópias de tudo",
    etiquetas: [
      { quando: "problema", texto: "HD QUEIMOU", tipo: "problema", alvo: [PECA[10][0], 3.2, PECA[10][2]] },
      { quando: "solucao", texto: "3 CÓPIAS", tipo: "solucao", alvo: [PECA[10][0], 3.2, PECA[10][2]] },
    ],
  },
  s11: {
    titulo: "GALERIA", tarefa: "entregar em galeria",
    etiquetas: [
      { quando: "problema", texto: "FOTO COMPRIMIDA", tipo: "problema", alvo: [PECA[11][0], 2.0, PECA[11][2]] },
      { quando: "solucao", texto: "GALERIA COM SENHA", tipo: "solucao", alvo: [PECA[11][0], 2.0, PECA[11][2]] },
    ],
  },
  s12: {
    titulo: "DEPOIMENTO", tarefa: "pedir depoimento",
    etiquetas: [
      { quando: "problema", texto: "SÓ VOCÊ SABE", tipo: "problema", alvo: [PECA[12][0], 3.8, PECA[12][2]] },
      { quando: "solucao", texto: "POSTOU", tipo: "solucao", alvo: [PECA[12][0], 3.8, PECA[12][2]] },
    ],
  },
  s13: {
    titulo: "INDICAÇÃO", tarefa: "pedir indicação",
    etiquetas: [{ quando: "solucao", texto: "NOVO CLIENTE", tipo: "solucao", alvo: SOBRE_CASAL(3.2, 0.75) }],
  },
  s14: { titulo: null, tarefa: null, etiquetas: [] },
};

export const ROTEIRO: ItemRoteiro[] = segmentos.map((s) => ({
  id: s.id,
  texto: s.texto,
  ...extra[s.id],
}));

// ----- planos de camera (secao 9) -----
export type Plano = { alvo: V3; d: number; az: number; el: number; fov?: number };
export type PlanosSeg = { close: Plano; contexto: Plano };
const P = (alvo: V3, d: number, az: number, el: number, fov?: number): Plano => ({ alvo, d, az, el, fov });

export const PLANOS: PlanosSeg[] = [
  { close: P([-2.0, 1.4, -0.9], 6.5, 35, 20), contexto: P([0.8, 0.8, 0], 15, 25, 28, 70) },
  { close: P(CAMERA_ATO1, 3.0, 40, 15), contexto: P([-2.4, 2.0, -1.6], 5.2, 30, 14) },
  { close: P(CAMERA_ATO1, 3.0, 40, 15), contexto: P([-2.4, 2.0, -1.6], 5.2, 30, 14) },
  { close: P(CAMERA_ATO1, 2.8, 50, 18), contexto: P([-2.4, 2.0, -1.6], 5.2, 30, 14) },
  { close: P(CAMERA_ATO1, 3.0, 35, 22), contexto: P([-1.8, 2.0, -1.4], 5.6, 25, 16) },
  { close: P([1.0, 0.9, -2.3], 3.0, 20, 22), contexto: P([0.2, 1.5, -2.3], 6.0, 45, 18) },
  { close: P([2.7, 1.1, -2.3], 3.0, 15, 12), contexto: P([2.8, 1.0, -1.6], 4.8, 25, 18) },
  { close: P([4.4, 0.9, -2.3], 2.8, 50, 20), contexto: P([3.6, 1.0, -1.5], 5.0, 30, 18) },
  { close: P([4.6, 0.9, -0.3], 2.8, 35, 22), contexto: P([4.0, 1.0, -0.3], 4.8, 40, 18) },
  { close: P([4.6, 0.9, 1.7], 2.8, 35, 22), contexto: P([4.0, 1.0, 1.3], 4.8, 40, 18) },
  { close: P([2.6, 1.2, 1.9], 3.8, 20, 18), contexto: P([2.3, 1.3, 0.8], 5.5, 20, 22) },
  { close: P([0.8, 0.8, 1.9], 2.8, 10, 25), contexto: P([1.2, 1.0, 1.2], 4.6, 15, 20) },
  { close: P([1.6, 2.9, 0.6], 3.4, 10, 8), contexto: P([1.6, 2.2, 0.6], 4.5, 10, 12) },
  { close: P([2.6, 1.2, 0.6], 6.5, 30, 22), contexto: P([1.2, 0.8, 0], 13, 25, 30, 70) },
  { close: P([1.2, 0.6, -0.2], 14, 20, 35, 70), contexto: P([1.2, 0.6, -0.2], 14, 20, 35, 70) },
];
export const FOV_CENA = 45;
export const DESLOCA_OLHAR = 0.08; // o alvo fica acima do centro da tela
export const AZ_PLANO = 4; // graus de giro durante cada plano
