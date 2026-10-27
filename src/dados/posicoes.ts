// Todas as posicoes da cena (metros, Y para cima). O tabuleiro tem 13 casas em serpentina.
export type V3 = [number, number, number];

export const TABULEIRO = { largura: 12.4, altura: 0.4, profundidade: 8 };
export const Y_BASE = TABULEIRO.altura; // topo da base
export const Y_CASA = Y_BASE + 0.08; // topo das placas das casas
export const ALTURA_PED = 0.25;
export const ALTURA_PERSONAGEM = 1.7;

// centro (x, z) de cada casa; indice 0 = casa 1
export const CASA: [number, number][] = [
  [-4.6, -2.6], [-2.3, -2.6], [0, -2.6], [2.3, -2.6], [4.6, -2.6], // fundo, esquerda para direita
  [4.6, 0], [2.3, 0], [0, 0], [-2.3, 0], [-4.6, 0], // meio, direita para esquerda
  [-4.6, 2.6], [-2.3, 2.6], [0, 2.6], // frente, esquerda para direita
];
export const N_CASAS = 13;
export const CASAS_COM_PLACA = [1, 7, 8, 9];

const c = (n: number) => CASA[n - 1];
export const centroCasa = (n: number): V3 => [c(n)[0], Y_CASA, c(n)[1]];
export const posPeca = (n: number): V3 => [c(n)[0] + 0.4, Y_CASA + ALTURA_PED, c(n)[1] - 0.45]; // topo do pedestal
export const posPedestal = (n: number): V3 => [c(n)[0] + 0.4, Y_CASA + ALTURA_PED / 2, c(n)[1] - 0.45];
export const posPlaca = (n: number): V3 => [c(n)[0] - 0.52, Y_CASA, c(n)[1] - 0.45]; // 2 cm alem de x - 0,5: a moldura de 1,0 nao toca o pedestal e a distancia fica acima de 0,9
export const posFot = (n: number): V3 => [c(n)[0] + 0.6, Y_CASA, c(n)[1] + 0.55];
export const posCli = (n: number): V3 => [c(n)[0] - 0.6, Y_CASA, c(n)[1] + 0.55];
// do casal cliente: de s07 a s09 a noiva e o noivo ficam lado a lado
export const posNoiva = (n: number): V3 => (n >= 7 && n <= 9 ? [c(n)[0] - 0.75, Y_CASA, c(n)[1] + 0.55] : posCli(n));
export const posNoivo = (n: number): V3 => [c(n)[0] - 0.3, Y_CASA, c(n)[1] + 0.6]; // 5 cm alem de z + 0,55: distancia ao fotografo acima de 0,9
export const posMesa = (n: number): V3 => [c(n)[0] - 0.5, Y_CASA, c(n)[1] + 0.45]; // mesinha do notebook (s10), a esquerda do fotografo
export const posAmigoA = (n: number): V3 => [c(n)[0] - 0.9, Y_CASA, c(n)[1] + 0.55];
export const posAmigoB = (n: number): V3 => [c(n)[0] - 0.35, Y_CASA, c(n)[1] + 0.55];
export const ENTRADA_MADRINHA: V3 = [6.9, Y_BASE, 3.5]; // entra pela frente direita do tabuleiro

// direcao de repouso (rotY) para os personagens olharem para a camera (a -25 graus nos planos de close e cena)
export const lado = (_n: number) => -1; // os planos de close e cena ficam a esquerda (azimute negativo): todos olham para la
export const rotRepouso = (n: number) => lado(n) * 0.44;

// trilha entre casas consecutivas: 5 pastilhas entre os pontos onde o fotografo para
export const pastilhasDaTrilha = (n: number): V3[] => {
  const a = posFot(n);
  const b = posFot(n + 1);
  return [1, 2, 3, 4, 5].map((k) => [a[0] + ((b[0] - a[0]) * k) / 6, Y_CASA, a[2] + ((b[2] - a[2]) * k) / 6]);
};

// seta dourada do ciclo: sai da casa 13, contorna o tabuleiro pela direita e pelo fundo e chega na casa 1
export const CAMINHO_SETA: V3[] = [
  [1.4, Y_CASA + 0.12, 2.6],
  [4.0, Y_CASA + 0.3, 3.0],
  [6.9, 0.3, 2.8],
  [7.4, 0.3, -0.5],
  [7.0, 0.3, -4.7],
  [2.5, 0.3, -5.0],
  [-4.6, 0.3, -5.0],
  [-4.6, 0.5, -3.8],
];

// local do celular da casa 3 (onde o selo do depoimento chega)
export const posCelularCasa3 = (): V3 => [c(3)[0] + 0.4, Y_CASA + ALTURA_PED + 0.75, c(3)[1] - 0.45];

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
