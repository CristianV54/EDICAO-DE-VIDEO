import React from 'react';
import {AbsoluteFill, Audio, Sequence, staticFile, useCurrentFrame} from 'remotion';
import tempos from './tempos.json';
import sons from './sons.json';
import {expoOut, power3In, rampa, trilho1} from '../anim';
import {C, Fundo2D} from '../dois/base';
import {EsperaFonte} from '../tres/Rotulo';

// Motor das cenas: cada cena é uma lista de planos, e cada plano cobre algumas frases da narração.
// Os tempos vêm da voz (src/motor/tempos.json), então as animações acompanham a fala.
type Tempos = Record<string, {duracao: number; frases: number[][]; palavras: (number | string)[][]}>;
const T = tempos as unknown as Tempos;
type Manifesto = Record<string, {takes: {arquivo: string; dur: number; pico: number; lufs: number}[]}>;
const S = sons as unknown as Manifesto;

export type Ctx = {
  f: number; // quadro dentro do plano
  dur: number; // duração do plano em quadros
  t: (i: number) => number; // quadro (no plano) em que começa a frase i do plano
  fim: (i: number) => number; // quadro em que a frase i termina
  p: (texto: string, n?: number) => number; // quadro em que uma palavra é dita (n-ésima ocorrência no plano)
};
export type Som = [string, number | string, number?]; // [grupo, quando, ganho em dB]
export type Plano = {
  frases: [number, number]; // primeira e última frase da cena que este plano cobre
  C: React.FC<{c: Ctx} & Record<string, unknown>>;
  props?: Record<string, unknown>;
  troca?: 'zoom' | 'desliza' | 'sobe' | 'corte'; // como este plano entra
  brilho?: [number, number]; // posição do brilho do fundo, em %
  sons?: Som[];
  fundo?: boolean; // false para planos que trazem o próprio fundo (3D)
  // câmera 2D do plano: lista de [quando, x, y, zoom]. "quando" é o índice de uma frase do plano ou uma palavra.
  // x e y são o ponto da tela (1920x1080) que vai para o centro. Sem isso, o plano só aproxima e deriva devagar.
  cam?: [number | string, number, number, number][];
  soco?: boolean; // plano de frase central: a câmera pode aproximar mais
  inicio?: [string, number?]; // começa numa palavra da cena (n-ésima ocorrência), em vez de no começo da frase
};
export type Abertura = {C: Plano['C']; props?: Record<string, unknown>; dur: number; sons?: Som[]};

// o Whisper às vezes escreve uma palavra de outro jeito: estas são as formas alternativas
const APELIDOS: Record<string, string[]> = {claude: ['cloud', 'claud', 'clod'], corte: ['curte'], ia: ['dia'], exporte: ['esporte'], '1': ['um'], '2': ['dois'], cinquenta: ['50'], doze: ['12'], vinte: ['20'], dezessete: ['17'], olha: ['olhe'], cria: ['crie'], corto: ['cordo', 'curto'], dez: ['10', 'descortes'], tres: ['3'], instala: ['installa']};
const FOLGA = 5; // o plano entra um pouco antes da primeira palavra

const limpar = (x: string) => x.toLowerCase().normalize('NFD').replace(/[^a-z0-9]/g, '');
// desloc: quadros de abertura antes de a voz começar
export const medirCena = (numero: number, planos: Plano[], desloc = 0, cauda = 0) => {
  const fr = T[String(numero)].frases;
  const pal = T[String(numero)].palavras as [number, string][];
  const total = Math.round(T[String(numero)].duracao * 30) + 14 + desloc + cauda;
  const inicios = planos.map((pl, i) => {
    if (i === 0) return desloc;
    if (pl.inicio) {
      const achadas = pal.filter(([q, w]) => q >= fr[pl.frases[0]][0] - 2 && limpar(w).startsWith(limpar(pl.inicio![0])));
      const q = achadas[pl.inicio[1] ?? 0];
      if (q) return q[0] - FOLGA + desloc;
    }
    return Math.max(0, fr[pl.frases[0]][0] - FOLGA) + desloc;
  });
  return {total, inicios, durs: planos.map((_, i) => (i + 1 < planos.length ? inicios[i + 1] : total) - inicios[i])};
};
export const duracaoCena = (numero: number, desloc = 0, cauda = 0) => Math.round(T[String(numero)].duracao * 30) + 14 + desloc + cauda;

// A voz-guia está em -22,6 LUFS. Todo efeito fica de 13 a 19 dB abaixo dela, para nunca cobrir a fala.
const ALVO: Record<string, number> = {estalo: -40, estalo_madeira: -40, tique: -42, clique: -38, tecla: -43, corte: -37, deslize: -40, whoosh: -39, whoosh_longo: -39, whoosh_grave: -38, batida: -36, impacto: -36, queda: -40, subida: -40, subida_forte: -39, brilho: -41, sucesso: -38, revela: -38, desliga: -40, passo: -38, gaveta: -40, camera: -39};
const contagem: Record<string, number> = {};

// Um som avulso da biblioteca, com o pico no quadro pedido (usado pelo gancho).
const vez: Record<string, number> = {};
export const somFx = (grupo: string, quadro: number, db = 0): {arquivo: string; de: number; vol: number} => {
  const g = S[grupo];
  vez[grupo] = (vez[grupo] ?? -1) + 1;
  const take = g.takes[vez[grupo] % g.takes.length];
  return {arquivo: take.arquivo, de: Math.max(0, Math.round(quadro - take.pico * 30)), vol: Math.min(1, Math.pow(10, ((ALVO[grupo] ?? -30) + db - take.lufs) / 20))};
};

// Todos os sons de uma cena, com o pico de cada um no quadro pedido e takes alternados.
export const sonsDaCena = (numero: number, planos: Plano[], abertura?: Abertura, cauda = 0): {arquivo: string; de: number; vol: number}[] => {
  const desloc = abertura?.dur ?? 0;
  const {inicios} = medirCena(numero, planos, desloc, cauda);
  const fr = T[String(numero)].frases;
  const lista: {arquivo: string; de: number; vol: number}[] = [];
  Object.keys(contagem).forEach((k) => delete contagem[k]);
  const todos: {sons: Som[]; base: number; f0: number}[] = [{sons: abertura?.sons ?? [], base: 0, f0: 0}, ...planos.map((pl, i) => ({sons: pl.sons ?? [], base: inicios[i], f0: pl.frases[0]}))];
  todos.forEach(({sons: lista2, base, f0}) => {
    lista2.forEach(([grupo, quando, db = 0]) => {
      const g = S[grupo];
      if (!g) return;
      let q: number;
      if (typeof quando === 'number') q = base + quando;
      else if (quando.startsWith('p:')) {
        // "p:palavra+k" ou "p:palavra#2+k": o som cai na palavra dita (a partir do começo do plano)
        const m = /^p:([^#+-]+)(?:#(\d+))?([+-]\d+)?$/.exec(quando)!;
        const alvo = limpar(m[1]);
        const formas = [alvo, ...(APELIDOS[alvo] ?? [])];
        const pal = T[String(numero)].palavras as [number, string][];
        const achadas = pal.filter(([qq, w]) => qq >= base - desloc - 2 && formas.some((fo) => limpar(w).startsWith(fo)));
        const a = achadas[Number(m[2] ?? 1) - 1];
        if (!a) return;
        q = a[0] + Number(m[3] ?? 0) + desloc;
      } else {
        const m = /^f(\d+)([+-]\d+)?$/.exec(quando)!;
        q = fr[Math.min(fr.length - 1, f0 + Number(m[1]))][0] + Number(m[2] ?? 0) + desloc;
      }
      contagem[grupo] = (contagem[grupo] ?? -1) + 1;
      const take = g.takes[(contagem[grupo] + numero) % g.takes.length];
      const ganho = Math.pow(10, ((ALVO[grupo] ?? -30) + db - take.lufs) / 20); // 22.6: a voz-guia está em -22,6 LUFS
      lista.push({arquivo: take.arquivo, de: Math.max(0, Math.round(q - take.pico * 30)), vol: Math.min(1, ganho)});
    });
  });
  return lista;
};

const Entrada: React.FC<{f: number; dur: number; tipo: Plano['troca']; children: React.ReactNode}> = ({f, dur, tipo = 'zoom', children}) => {
  const e = 1 - rampa(f, 0, 14, expoOut);
  const s = rampa(f, dur - 7, dur, power3In);
  let transform = '';
  let filtro = 0;
  if (tipo === 'zoom') {
    transform = `scale(${1 + e * 0.1})`;
    filtro = e * 10;
  } else if (tipo === 'desliza') transform = `translateX(${e * 260}px)`;
  else if (tipo === 'sobe') transform = `translateY(${e * 160}px)`;
  return <AbsoluteFill style={{transform, opacity: Math.min(1, 1 - e * (tipo === 'corte' ? 0 : 0.9)) * (1 - s), filter: filtro > 0.3 ? `blur(${filtro.toFixed(1)}px)` : undefined}}>{children}</AbsoluteFill>;
};

// A câmera 2D nunca para: mesmo sem pontos marcados, ela aproxima e deriva o plano inteiro.
const camera = (plano: Plano, c: Ctx, indice: number): string => {
  const k = c.f / Math.max(1, c.dur);
  let z = 1.08 + 0.07 * k;
  let fx = 960 + (indice % 2 ? -1 : 1) * (14 - 28 * k);
  let fy = 540 + (indice % 3 === 0 ? 8 - 16 * k : 0);
  if (plano.cam && plano.cam.length) {
    const pontos = plano.cam.map(([quando, x, y, zz], i) => {
      let q = typeof quando === 'number' ? c.t(quando) : c.p(quando);
      if (typeof quando === 'string' && q === 0) q = Math.round(((i + 1) / (plano.cam!.length + 1)) * c.dur);
      return [q, x, y, zz] as [number, number, number, number];
    });
    // começa um pouco mais aberta e chega no primeiro ponto; depois do último, segue aproximando
    const qs = [Math.min(0, pontos[0][0] - 20), ...pontos.map((p) => p[0]), c.dur + 1];
    const xs = [pontos[0][1], ...pontos.map((p) => p[1]), pontos[pontos.length - 1][1]];
    const ys = [pontos[0][2], ...pontos.map((p) => p[2]), pontos[pontos.length - 1][2]];
    const zs = [pontos[0][3] * 0.93, ...pontos.map((p) => p[3]), pontos[pontos.length - 1][3] * 1.05];
    // remove tempos repetidos ou fora de ordem
    const ok = qs.map((q, i) => i === 0 || q > qs[i - 1]);
    const f2 = (v: number[]) => v.filter((_, i) => ok[i]);
    const q2 = f2(qs);
    z = trilho1(c.f, q2, f2(zs));
    fx = trilho1(c.f, q2, f2(xs)) + Math.sin(c.f / 70 + indice) * 6;
    fy = trilho1(c.f, q2, f2(ys));
  }
  // a câmera nunca sai da área da tela: assim nenhum texto perto da borda é cortado
  // Regra: a área útil da tela (de 90 a 1830 px na largura) fica sempre inteira no quadro, para nenhum texto
  // ser cortado. Só os planos de frase central (soco: true) podem aproximar mais que isso.
  if (!plano.soco) {
    z = Math.min(z, 1.1);
    const folga = Math.max(0, 960 / z - 870);
    fx = Math.min(960 + folga, Math.max(960 - folga, fx));
    const folgaY = Math.max(0, 540 / z - 470);
    fy = Math.min(540 + folgaY, Math.max(540 - folgaY, fy));
  } else {
    z = Math.min(z, 1.3);
    fx = Math.min(1000, Math.max(920, fx));
    fy = Math.min(600, Math.max(480, fy));
  }
  return `translate(${(960 - fx * z).toFixed(2)}px, ${(540 - fy * z).toFixed(2)}px) scale(${z.toFixed(4)})`;
};

const PlanoNaTela: React.FC<{numero: number; plano: Plano; inicio: number; dur: number; desloc: number; indice: number}> = ({numero, plano, inicio: inicioAbs, dur, desloc, indice}) => {
  const inicio = inicioAbs - desloc; // quadro do plano no tempo da voz
  const f = useCurrentFrame();
  const fr = T[String(numero)].frases;
  const pal = T[String(numero)].palavras as [number, string][];
  const limpa = (x: string) => x.toLowerCase().normalize('NFD').replace(/[^a-z0-9]/g, '');
  const c: Ctx = {
    f,
    dur,
    t: (i) => Math.max(0, fr[Math.min(plano.frases[1], plano.frases[0] + i)][0] - inicio),
    fim: (i) => fr[Math.min(plano.frases[1], plano.frases[0] + i)][1] - inicio,
    p: (texto, n = 0) => {
      const alvo = limpa(texto);
      const formas = [alvo, ...(APELIDOS[alvo] ?? [])];
      const achadas = pal.filter(([q, w]) => q >= inicio - 2 && q <= inicio + dur && formas.some((fo) => limpa(w).startsWith(fo)));
      return achadas[n] ? achadas[n][0] - inicio : 0;
    },
  };
  const Comp = plano.C;
  return (
    <AbsoluteFill>
      {plano.fundo === false ? null : <Fundo2D f={f + inicioAbs} x={plano.brilho?.[0] ?? 74} y={plano.brilho?.[1] ?? 76} />}
      <Entrada f={f} dur={dur} tipo={plano.troca}>
        {plano.fundo === false ? (
          <Comp c={c} {...(plano.props ?? {})} />
        ) : (
          <div style={{position: 'absolute', left: 0, top: 0, width: 1920, height: 1080, transformOrigin: '0 0', transform: camera(plano, c, indice)}}>
            <Comp c={c} {...(plano.props ?? {})} />
          </div>
        )}
      </Entrada>
    </AbsoluteFill>
  );
};

export const Cena: React.FC<{numero: number; planos: Plano[]; abertura?: Abertura; comVoz?: boolean; cauda?: number}> = ({numero, planos, abertura, comVoz = true, cauda = 0}) => {
  const desloc = abertura?.dur ?? 0;
  const {inicios, durs} = medirCena(numero, planos, desloc, cauda);
  const f = useCurrentFrame();
  const Ab = abertura?.C;
  return (
    <AbsoluteFill style={{background: C.fundo}}>
      <EsperaFonte>
        {Ab ? (
          <Sequence from={0} durationInFrames={desloc} name="abertura">
            <Ab c={{f, dur: desloc, t: () => 0, fim: () => desloc, p: () => 0}} {...(abertura?.props ?? {})} />
          </Sequence>
        ) : null}
        {planos.map((pl, i) => (
          <Sequence key={i} from={inicios[i]} durationInFrames={durs[i]} name={`plano ${i + 1}`}>
            <PlanoNaTela numero={numero} plano={pl} inicio={inicios[i]} dur={durs[i]} desloc={desloc} indice={i} />
          </Sequence>
        ))}
      </EsperaFonte>
      {comVoz ? <SomDaCena numero={numero} planos={planos} abertura={abertura} cauda={cauda} /> : null}
    </AbsoluteFill>
  );
};

// Voz e efeitos de uma cena. A música entra à parte, no vídeo completo.
export const SomDaCena: React.FC<{numero: number; planos: Plano[]; abertura?: Abertura; cauda?: number}> = ({numero, planos, abertura, cauda = 0}) => (
  <>
    <Sequence from={abertura?.dur ?? 0} layout="none">
      <Audio src={staticFile(`som/cena${String(numero).padStart(2, '0')}_guia.wav`)} />
    </Sequence>
    {sonsDaCena(numero, planos, abertura, cauda).map((s, i) => (
      <Sequence key={i} from={s.de} layout="none">
        <Audio src={staticFile(`som/fx/${s.arquivo}`)} volume={s.vol} />
      </Sequence>
    ))}
  </>
);
