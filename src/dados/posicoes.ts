// Todas as posicoes da cena (metros, Y para cima). Topo da plataforma em y = 0,5.
export type V3 = [number, number, number];
export const TOPO = 0.5;

export const PLATAFORMA = { largura: 12, altura: 0.5, profundidade: 7 };

// ----- ato 1: equipamento -----
export const FOTOGRAFO_ATO1: V3 = [-3.4, TOPO, -0.6];
export const ROT_FOTOGRAFO_ATO1 = Math.PI / 2; // virado para +X
export const CASAL_AMIGOS: V3 = [-0.6, TOPO, -0.6];
export const ROT_CASAL_AMIGOS = -Math.PI / 2 + (30 * Math.PI) / 180; // para o fotografo, girado 30 graus para o espectador
export const TELAO: V3 = [-1.9, TOPO, -2.9];
export const GLOBO: V3 = [-0.6, 3.0, -0.6];

// ----- ato 2: negocio -----
export const FOTOGRAFO_ATO2: V3 = [2.0, TOPO, -0.4];
export const ROT_FOTOGRAFO_ATO2 = 0.6;

export const PECA: Record<number, V3> = {
  5: [1.0, TOPO, -2.3],
  6: [2.7, TOPO, -2.3],
  7: [4.4, TOPO, -2.3],
  8: [4.6, TOPO, -0.3],
  9: [4.6, TOPO, 1.7],
  10: [2.6, TOPO, 1.9],
  11: [0.8, TOPO, 1.9],
  12: [0.6, 2.9, 0.5], // balao no alto, sobre o casal cliente
};

// onde o casal cliente fica em cada segmento
export const LUGAR_CLIENTE: Record<number, V3> = {
  6: [3.2, TOPO, -0.9],
  7: [3.7, TOPO, -1.0],
  8: [3.3, TOPO, -0.7],
  9: [3.5, TOPO, 0.9],
  11: [0.6, TOPO, 0.5],
};
export const ENTRADA_CLIENTE: V3 = [7.2, 0, -1.2]; // fora da plataforma, pela direita

// personagem curioso (s05)
export const CURIOSO: V3 = [2.0, TOPO, -1.2];

// casal indicado (s13)
export const INDICADO_ORIGEM: V3 = [5.9, TOPO, 0.75];
export const INDICADO_DESTINO: V3 = [3.2, TOPO, 0.75];

// camera do fotografo: ponto de apoio dos cabos e alvo dos planos de camera
const camLocal = 0.46;
export const CAMERA_ATO1: V3 = [FOTOGRAFO_ATO1[0] + camLocal * Math.sin(ROT_FOTOGRAFO_ATO1), 1.75, FOTOGRAFO_ATO1[2] + camLocal * Math.cos(ROT_FOTOGRAFO_ATO1)];
export const CAMERA_ATO2: V3 = [FOTOGRAFO_ATO2[0] + camLocal * Math.sin(ROT_FOTOGRAFO_ATO2), 1.75, FOTOGRAFO_ATO2[2] + camLocal * Math.cos(ROT_FOTOGRAFO_ATO2)];

// ----- cabos: pontas (a -> b) -----
export const PONTAS_CABOS: { id: string; a: V3; b: V3 }[] = [
  { id: "telao-album", a: [-1.0, 0.62, -2.7], b: [PECA[5][0] - 0.3, 0.75, PECA[5][2] + 0.1] },
  { id: "album-celular", a: [PECA[5][0] + 0.3, 0.75, PECA[5][2] + 0.1], b: [PECA[6][0] - 0.25, 0.7, PECA[6][2] + 0.1] },
  { id: "celular-proposta", a: [PECA[6][0] + 0.25, 0.7, PECA[6][2] + 0.1], b: [PECA[7][0] - 0.3, 0.7, PECA[7][2] + 0.1] },
  { id: "proposta-contrato", a: [PECA[7][0], 0.6, PECA[7][2] + 0.45], b: [PECA[8][0], 0.6, PECA[8][2] - 0.45] },
  { id: "contrato-maquininha", a: [PECA[8][0], 0.6, PECA[8][2] + 0.45], b: [PECA[9][0], 0.6, PECA[9][2] - 0.4] },
  { id: "camera-hd1", a: [CAMERA_ATO2[0], 1.6, CAMERA_ATO2[2]], b: [PECA[10][0] - 0.45, 0.75, PECA[10][2] - 0.3] },
  { id: "camera-hd2", a: [CAMERA_ATO2[0], 1.6, CAMERA_ATO2[2]], b: [PECA[10][0] + 0.45, 0.75, PECA[10][2] - 0.3] },
  { id: "hd2-nuvem", a: [PECA[10][0] + 0.45, 0.75, PECA[10][2]], b: [PECA[10][0], 1.75, PECA[10][2]] },
  { id: "nuvem-tablet", a: [PECA[10][0] - 0.3, 1.75, PECA[10][2]], b: [PECA[11][0] + 0.45, 0.75, PECA[11][2]] },
];

// entidades para a checagem de distancia minima (casais contam como 1 entidade, pelo centro)
export type Entidade = { nome: string; x: number; z: number };
export const entidadesDoSegmento = (i: number): Entidade[] => {
  const e: Entidade[] = [];
  const ato1 = i <= 5;
  if (i >= 1) e.push({ nome: "telao", x: TELAO[0], z: TELAO[2] });
  e.push({ nome: "fotografo", x: (ato1 ? FOTOGRAFO_ATO1 : FOTOGRAFO_ATO2)[0], z: (ato1 ? FOTOGRAFO_ATO1 : FOTOGRAFO_ATO2)[2] });
  if (i <= 5) e.push({ nome: "casal-amigos", x: CASAL_AMIGOS[0], z: CASAL_AMIGOS[2] });
  if (i === 5) e.push({ nome: "curioso", x: CURIOSO[0], z: CURIOSO[2] });
  for (let p = 5; p <= 11; p++) if (i >= p) e.push({ nome: `peca${p}`, x: PECA[p][0], z: PECA[p][2] });
  if (i >= 6) {
    const lugar = i <= 6 ? 6 : i === 7 ? 7 : i === 8 ? 8 : i <= 10 ? 9 : 11;
    e.push({ nome: "casal-cliente", x: LUGAR_CLIENTE[lugar][0], z: LUGAR_CLIENTE[lugar][2] });
  }
  if (i >= 13) e.push({ nome: "casal-indicado", x: INDICADO_DESTINO[0], z: INDICADO_DESTINO[2] });
  return e;
};
