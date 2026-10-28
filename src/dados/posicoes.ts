// Todas as posicoes da cena (metros, Y para cima). A plataforma (mesa de montagem) e um bloco em RETRATO de 3 colunas x 5 linhas:
// as 13 casas formam uma serpentina do fundo (casa 1) para a frente (casa 13). A camera olha do lado da frente.
export type V3 = [number, number, number];

export const TABULEIRO = { largura: 7.6, altura: 0.4, profundidade: 12.8 };
export const Y_BASE = TABULEIRO.altura; // topo da base
export const Y_CASA = Y_BASE + 0.04; // topo das placas das casas (placas planas de 0,04)
export const ALTURA_PED = 0.25;
export const ALTURA_PERSONAGEM = 1.7;

// centro (x, z) de cada casa; indice 0 = casa 1
export const CASA: [number, number][] = [
  [-2.3, -4.8], [0, -4.8], [2.3, -4.8], // fundo, esquerda para direita
  [2.3, -2.4], [0, -2.4], [-2.3, -2.4], // direita para esquerda
  [-2.3, 0], [0, 0], [2.3, 0], // esquerda para direita
  [2.3, 2.4], [0, 2.4], [-2.3, 2.4], // direita para esquerda
  [-2.3, 4.8], // frente
];
export const N_CASAS = 13;
export const CASAS_COM_PLACA = [1, 2, 7, 8, 9];

const c = (n: number) => CASA[n - 1];
export const centroCasa = (n: number): V3 => [c(n)[0], Y_CASA, c(n)[1]];

// ---------- BLOQUEIO DE CENA (vale para todas as casas) ----------
// Visto da camera: o fotografo fica a ESQUERDA, o cliente (ou o casal) a DIREITA, os dois virados um para o outro e em 3/4 para a camera.
// A peca fica no fundo, no meio. Quem olha para quem: fotografo e cliente se olham; a peca esta entre os dois, atras.
// s07 a s09 (casal a direita): a peca fica mais a esquerda, entre o fotografo e o casal, para nao ficar escondida atras deles
const dxPeca = (n: number) => (n >= 7 && n <= 9 ? -0.08 : n === 12 ? -0.3 : 0.1);
export const posPeca = (n: number): V3 => [c(n)[0] + dxPeca(n), Y_CASA + ALTURA_PED, c(n)[1] - 0.5]; // topo do pedestal
export const posPedestal = (n: number): V3 => [c(n)[0] + dxPeca(n), Y_CASA + ALTURA_PED / 2, c(n)[1] - 0.5];
export const posPlaca = (n: number): V3 => (n >= 7 && n <= 9 ? [c(n)[0] - 1.0, Y_CASA, c(n)[1] - 1.0] : [c(n)[0] - 0.7, Y_CASA, c(n)[1] - 0.95]); // fundo, a esquerda, atras do fotografo (s07 a s09: mais afastado para nao entrar na peca)
export const posFot = (n: number): V3 => [c(n)[0] - 0.8, Y_CASA, c(n)[1] + 0.4];
export const posCli = (n: number): V3 => [c(n)[0] + 0.95, Y_CASA, c(n)[1] + 0.45]; // cliente sozinho (noiva, madrinha)
// casal (s07 a s09): a noiva mais perto do fotografo, o noivo atras dela, lado a lado
export const posNoiva = (n: number): V3 => (n >= 7 && n <= 9 ? [c(n)[0] + 0.75, Y_CASA, c(n)[1] + 0.5] : posCli(n));
export const posNoivo = (n: number): V3 => [c(n)[0] + 1.1, Y_CASA, c(n)[1] - 0.15]; // ao lado da noiva, um pouco atras: o noivo fica legivel
// amigos do s02: diagonal a direita, de frente para o fotografo
export const posAmigoA = (n: number): V3 => [c(n)[0] + 0.55, Y_CASA, c(n)[1] + 0.5];
export const posAmigoB = (n: number): V3 => [c(n)[0] + 0.95, Y_CASA, c(n)[1] + 0.0];
export const posMesa = (n: number): V3 => [c(n)[0] + 0.9, Y_CASA, c(n)[1] + 0.5]; // mesinha do notebook (s10), a direita do fotografo
export const ENTRADA_MADRINHA: V3 = [0.7, Y_BASE, 5.9]; // entra pela frente, logo fora do quadro (a direita da casa 13)

// direcao (rotY) dos personagens: 0 = de frente para a camera; positivo = vira para a direita da tela
export const rotRepouso = (_n: number) => 0.44; // s00 e s14: o fotografo olha para a camera
export const rotFot = (_n: number) => 0.9; // fotografo: virado para o cliente (direita), em 3/4 para a camera
export const rotCli = (_n: number) => -0.9; // cliente: virado para o fotografo (esquerda), em 3/4 para a camera (a camera fica de frente: az 0, os dois se veem em V)

// azimute dos planos close, cena e placa (graus): camera de frente (os dois personagens, a esquerda e a direita, aparecem em 3/4)
export const azVista = (_n: number) => 0;

// trilha entre casas consecutivas: 5 pastilhas entre os pontos onde o fotografo para
export const pastilhasDaTrilha = (n: number): V3[] => {
  const a = posFot(n);
  const b = posFot(n + 1);
  return [1, 2, 3, 4, 5].map((k) => [a[0] + ((b[0] - a[0]) * k) / 6, Y_CASA, a[2] + ((b[2] - a[2]) * k) / 6]);
};

// seta dourada do ciclo: sai da casa 13, sobe pela borda esquerda e desce na casa 1
export const CAMINHO_SETA: V3[] = [
  [-3.4, 0.75, 4.8],
  [-4.6, 1.9, 3.2],
  [-5.0, 2.8, 0.0],
  [-4.6, 3.0, -3.0],
  [-3.8, 2.4, -5.3],
  [-3.4, 1.4, -5.3],
  [-3.4, 0.75, -4.8],
];

// local do celular da casa 3 (onde o selo do depoimento chega)
export const posCelularCasa3 = (): V3 => [c(3)[0] + 0.35, Y_CASA + ALTURA_PED + 0.75, c(3)[1] - 0.5];

// ---------- entidades para a checagem de distancia minima ----------
export type Entidade = { nome: string; x: number; z: number };
export const entidadesDoSegmento = (i: number): Entidade[] => {
  const e: Entidade[] = [];
  if (i >= 1) {
    const n = Math.min(i, 13);
    e.push({ nome: "fotografo", x: posFot(n)[0], z: posFot(n)[2] });
    if (i >= 1) e.push({ nome: `peca${n}`, x: posPeca(n)[0], z: posPeca(n)[2] });
    if (CASAS_COM_PLACA.includes(n)) e.push({ nome: `placa${n}`, x: posPlaca(n)[0], z: posPlaca(n)[2] });
    if (i === 2) {
      e.push({ nome: "amigo-a", x: posAmigoA(2)[0], z: posAmigoA(2)[2] });
      e.push({ nome: "amigo-b", x: posAmigoB(2)[0], z: posAmigoB(2)[2] });
    }
    if (i >= 4 && i <= 9) e.push({ nome: "noiva", x: posNoiva(n)[0], z: posNoiva(n)[2] });
    if (i >= 7 && i <= 9) e.push({ nome: "noivo", x: posNoivo(n)[0], z: posNoivo(n)[2] });
    if (i === 11 || i === 12) e.push({ nome: "noiva", x: posCli(n)[0], z: posCli(n)[2] });
    if (i === 13) e.push({ nome: "madrinha", x: posCli(13)[0], z: posCli(13)[2] });
    if (i === 10) e.push({ nome: "mesa", x: posMesa(10)[0], z: posMesa(10)[2] });
  }
  return e;
};
