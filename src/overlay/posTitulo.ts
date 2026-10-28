// Posicao e momento do titulo amarelo: y = 520 (abaixo do card). Se colidir com a cabeca de um personagem ou com a peca
// durante os 1,4 s em que aparece, vai para o y livre mais proximo (abaixo do card e acima da legenda).
import { ROTEIRO } from "../dados/roteiro";
import { LINHAS } from "../util/tempo";
import { projetarCaixa, Ret } from "../cena/projecao";
import { amigos, fotografo, madrinha, noiva, noivo } from "../cena/estadoElenco";
import { caixaDe } from "../cena/enquadramento";
const LARGURA_SEGURA = 840;

export const Y_TITULO = 520;
export const Y_TITULO_BAIXO = 1110;
const Y_MIN_ACIMA = 470; // abaixo do card (card ate ~440)

const alturaTitulo = (fs: number) => fs * 1.3;

export const obstaculos = (frame: number, i: number): { nome: string; r: Ret }[] => {
  const out: { nome: string; r: Ret }[] = [];
  const cab = (nome: string, e: { vis: boolean; opac: number; pos: [number, number, number] }) => {
    if (e.vis && e.opac > 0.3) out.push({ nome, r: projetarCaixa(frame, [e.pos[0], e.pos[1] + 1.47 + 0.05, e.pos[2]], [0.5, 0.55, 0.5]) });
  };
  cab("cabeca do fotografo", fotografo(frame));
  cab("cabeca da noiva", noiva(frame));
  cab("cabeca do noivo", noivo(frame));
  const am = amigos(frame);
  cab("cabeca do amigo", am.a);
  cab("cabeca da amiga", am.b);
  cab("cabeca da madrinha", madrinha(frame));
  if (i >= 1 && i <= 13 && frame >= LINHAS[i].quedaIni) {
    const b = caixaDe(`peca${i}`);
    void b;
    if (i <= 11) {
      const q = caixaDe(`plaq${i}`);
      out.push({ nome: `plaquinha ${i}`, r: projetarCaixa(frame, q.c, q.t) });
    }
  }
  if ([1, 7, 8, 9].indexOf(i) >= 0 && frame >= LINHAS[i].chegada) {
    const t = caixaDe(`tela${i}`);
    out.push({ nome: `placa de foto ${i}`, r: projetarCaixa(frame, t.c, t.t) });
  }
  return out;
};

export const dadosTitulo = (i: number) => {
  const titulo = ROTEIRO[i].titulo ?? "";
  // estimativa conservadora (Montserrat 900 italico ~0,72 em de largura por letra), sem medir no navegador
  const fs = Math.min(titulo.length >= 12 ? 78 : 104, Math.floor((LARGURA_SEGURA * 0.9) / (titulo.length * 0.72)));
  const h = alturaTitulo(fs);
  const w = Math.min(LARGURA_SEGURA, titulo.length * fs * 0.72);
  return { fs, h, w };
};

// O titulo entra 0,4 s depois do inicio do segmento (a camera ja assentou do corte) e fica 1,4 s.
// O titulo (1,4 s, de preferencia em y 520) nao cobre cabeca, plaquinha nem placa de foto. Para cumprir isso em todos os frames,
// procura (inicio, y): o inicio mais cedo a partir de 0,4 s do segmento e o y mais perto de 520 que ficam livres durante os 1,4 s.
// Sem combinacao livre, reduz a duracao (minimo 0,8 s); se ainda assim nao houver, usa a de menos colisoes.
const memo = new Map<number, { ini: number; fim: number; y: number; colisoes: number }>();
export const planoTitulo = (i: number) => {
  if (memo.has(i)) return memo.get(i)!;
  const L = LINHAS[i];
  const { h, w } = dadosTitulo(i);
  const f0 = L.ini + 12;
  const f1 = Math.min(L.fim - 20, L.ini + 240);
  const rects: Ret[][] = [];
  for (let f = f0; f <= f1 + 6; f++) rects[f - f0] = obstaculos(f, i).map((o) => o.r).filter((r) => r.x1 > 540 - w / 2 && r.x0 < 540 + w / 2);
  const bate = (f: number, y: number) => rects[f - f0].some((r) => r.y1 > y - h / 2 && r.y0 < y + h / 2);
  const ys: number[] = [];
  for (let c = Y_MIN_ACIMA + h / 2; c <= 1185 - h / 2 - 8; c += 5) ys.push(c);
  ys.sort((a, b) => Math.abs(a - Y_TITULO) - Math.abs(b - Y_TITULO));
  const dur0 = L.tituloFim - L.ini;
  let melhor = { ini: f0, fim: f0 + dur0, y: Y_TITULO_BAIXO, colisoes: 1e9 };
  for (const dur of [dur0, Math.round(dur0 * 0.8), Math.round(dur0 * 0.6), Math.round(dur0 * 0.45)]) {
    for (let t0 = f0; t0 + dur + 6 <= f1; t0 += 2) {
      for (const y of ys) {
        let n = 0;
        for (let f = t0; f <= t0 + dur + 6 && n < melhor.colisoes; f++) if (bate(f, y)) n++;
        if (n < melhor.colisoes) melhor = { ini: t0, fim: t0 + dur, y, colisoes: n };
        if (n === 0) break;
      }
      if (melhor.colisoes === 0) break;
    }
    if (melhor.colisoes === 0) break;
  }
  memo.set(i, melhor);
  return melhor;
};
export const janelaTitulo = (i: number) => planoTitulo(i);
export const yTitulo = (i: number): number => planoTitulo(i).y;
