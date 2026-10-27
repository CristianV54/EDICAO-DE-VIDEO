import segmentos from "./segmentos.json";

export type Quando = "problema" | "segunda" | "solucao";
export type TipoEtiqueta = "problema" | "solucao" | "cinza";
export type Vec3 = [number, number, number];
export type Alvo = "peca" | { mundo: Vec3 };

export type Etiqueta = {
  quando: Quando;
  texto: string;
  tipo: TipoEtiqueta;
  alvo?: Alvo;
  ate?: Quando;
};

export type CamCfg = {
  dist?: number;
  alt?: number;
  fov?: number;
  // deslocamento aplicado ao ponto observado (e a camera acompanha)
  alvoDelta?: Vec3;
};

export type ItemRoteiro = {
  id: string;
  texto: string;
  titulo: string | null;
  tarefa: string | null;
  etiquetas: Etiqueta[];
  cam?: CamCfg;
};

// (x, z) de cada peca na plataforma. Indice 0 = peca 1.
export const POS_PECA: [number, number][] = [
  [-4, -2], [-2, -2], [0, -2], [2, -2], [4, -2],
  [-4, 0], [-2, 0], [0, 0], [2, 0], [4, 0],
  [-3, 2], [0, 2], [3, 2],
];
export const TOPO_PLATAFORMA = 0.5;

const extra: Record<string, Omit<ItemRoteiro, "id" | "texto">> = {
  s00: {
    titulo: null, tarefa: null,
    etiquetas: [{ quando: "problema", texto: "FOTÓGRAFO?", tipo: "problema", alvo: { mundo: [-7, 2.55, 1.2] }, ate: "solucao" }],
  },
  s01: {
    titulo: "CÂMERA", tarefa: "comprar uma câmera",
    etiquetas: [
      { quando: "problema", texto: "MODO AUTO", tipo: "problema" },
      { quando: "solucao", texto: "APRENDE O MANUAL", tipo: "solucao" },
    ],
  },
  s02: {
    titulo: "LENTE", tarefa: "trocar a lente do kit",
    etiquetas: [
      { quando: "problema", texto: "FOTO ESCURA", tipo: "problema" },
      { quando: "solucao", texto: "50MM", tipo: "solucao" },
    ],
  },
  s03: {
    titulo: "CARTÃO DUPLO", tarefa: "câmera com dois slots",
    etiquetas: [
      { quando: "problema", texto: "CARTÃO CORROMPEU", tipo: "problema" },
      { quando: "solucao", texto: "SLOT 2 SALVOU", tipo: "solucao" },
    ],
  },
  s04: {
    titulo: "FLASH", tarefa: "comprar um flash",
    etiquetas: [
      { quando: "segunda", texto: "ISO 12800", tipo: "problema" },
      { quando: "solucao", texto: "LUZ NA PISTA", tipo: "solucao" },
    ],
  },
  s05: {
    titulo: "PORTFÓLIO", tarefa: "montar o portfólio",
    etiquetas: [
      { quando: "problema", texto: "CADÊ SEU TRABALHO?", tipo: "problema" },
      { quando: "solucao", texto: "20 MELHORES", tipo: "solucao" },
    ],
  },
  s06: {
    titulo: "INSTAGRAM", tarefa: "criar o perfil",
    etiquetas: [
      { quando: "problema", texto: "NINGUÉM VIU", tipo: "problema" },
      { quando: "solucao", texto: "NOVO DIRECT", tipo: "solucao" },
    ],
  },
  s07: {
    titulo: "PROPOSTA", tarefa: "fazer proposta em PDF",
    etiquetas: [
      { quando: "problema", texto: "VISUALIZOU", tipo: "cinza" },
      { quando: "solucao", texto: "QUERO FECHAR", tipo: "solucao" },
    ],
  },
  s08: {
    titulo: "CONTRATO", tarefa: "contrato assinado",
    // os noivos ficam ao lado direito do contrato, na plataforma, para caberem no enquadramento
    cam: { dist: 5.4, alt: 3.0, fov: 60, alvoDelta: [0.9, -0.15, 0] },
    etiquetas: [
      { quando: "problema", texto: "DESMARCOU", tipo: "problema", alvo: { mundo: [1.65, 1.85, 0.3] } },
      { quando: "solucao", texto: "TEM O QUE COBRAR", tipo: "solucao" },
    ],
  },
  s09: {
    titulo: "SINAL", tarefa: "cobrar 30% de sinal",
    etiquetas: [
      { quando: "problema", texto: "SÓ PROMESSA", tipo: "problema" },
      { quando: "solucao", texto: "DATA RESERVADA", tipo: "solucao" },
    ],
  },
  s10: {
    titulo: "BACKUP", tarefa: "3 cópias de tudo",
    cam: { alvoDelta: [0, 0.2, 0] },
    etiquetas: [
      { quando: "problema", texto: "HD QUEIMOU", tipo: "problema" },
      { quando: "solucao", texto: "3 CÓPIAS", tipo: "solucao" },
    ],
  },
  s11: {
    titulo: "GALERIA", tarefa: "entregar em galeria",
    etiquetas: [
      { quando: "problema", texto: "FOTO COMPRIMIDA", tipo: "problema" },
      { quando: "solucao", texto: "GALERIA COM SENHA", tipo: "solucao" },
    ],
  },
  s12: {
    titulo: "DEPOIMENTO", tarefa: "pedir depoimento",
    etiquetas: [
      { quando: "problema", texto: "SÓ VOCÊ SABE", tipo: "problema" },
      { quando: "solucao", texto: "POSTOU", tipo: "solucao" },
    ],
  },
  s13: {
    titulo: "INDICAÇÃO", tarefa: "pedir indicação",
    cam: { dist: 6.4, alt: 3.4, fov: 60, alvoDelta: [0.9, -0.1, 0.2] },
    etiquetas: [{ quando: "solucao", texto: "NOVO CLIENTE", tipo: "solucao", alvo: { mundo: [5.2, 2.75, 2.5] } }],
  },
  s14: { titulo: null, tarefa: null, etiquetas: [] },
};

export const ROTEIRO: ItemRoteiro[] = segmentos.map((s) => ({
  id: s.id,
  texto: s.texto,
  ...extra[s.id],
}));

export const N_PECAS = 13;
