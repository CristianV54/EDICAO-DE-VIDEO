import React, {useLayoutEffect, useRef} from 'react';
import {AbsoluteFill} from 'remotion';
import '../fontes';
import {aleatorio, expoOut, power3In, rampa} from '../anim';

// Peças-base do visual em 2D: quase preto, vidro escuro, linha fina, uma cor de destaque.
// Estilo definido em 23/11/2026, depois que o Cristian achou o 3D em tudo pesado.
export const C = {
  fundo: '#050607',
  cartao: 'rgba(15,17,19,0.92)',
  cartaoClaro: '#1a1e22',
  borda: 'rgba(255,255,255,0.11)',
  texto: '#f5f2ec',
  mudo: '#7d868e',
  acento: '#f2622e',
  acentoClaro: '#ffb27a',
  erro: '#e5484d',
};
export const MONO = '"JetBrains Mono", monospace';
export const SANS = 'Montserrat, sans-serif';
export const brilho = (cor = C.acento, forca = 1) => `0 0 ${18 * forca}px ${cor}aa, 0 0 ${46 * forca}px ${cor}55`;

// Fundo: preto com dois brilhos que derivam devagar, riscos de luz e pontinhos.
export const Fundo2D: React.FC<{f: number; x?: number; y?: number; forca?: number}> = ({f, x = 76, y = 78, forca = 1}) => (
  <AbsoluteFill style={{background: C.fundo, overflow: 'hidden'}}>
    <div style={{position: 'absolute', left: `${x + Math.sin(f / 140) * 3 - 30}%`, top: `${y + Math.cos(f / 170) * 3 - 34}%`, width: '60%', height: '68%', background: `radial-gradient(ellipse, rgba(242,98,46,${0.26 * forca}) 0%, rgba(242,98,46,0) 62%)`}} />
    <div style={{position: 'absolute', left: `${100 - x - 28 + Math.cos(f / 160) * 3}%`, top: `${100 - y - 30}%`, width: '56%', height: '60%', background: 'radial-gradient(ellipse, rgba(255,255,255,0.05) 0%, rgba(255,255,255,0) 60%)'}} />
    {Array.from({length: 7}).map((_, i) => (
      <div key={i} style={{position: 'absolute', left: ((aleatorio(i + 3) * 2200 + f * (0.25 + aleatorio(i) * 0.5)) % 2200) - 200, top: 80 + aleatorio(i + 11) * 920, width: 120 + aleatorio(i + 5) * 160, height: 5, borderRadius: 3, background: 'rgba(242,98,46,0.16)', filter: 'blur(3px)'}} />
    ))}
    {Array.from({length: 46}).map((_, i) => (
      <div key={i} style={{position: 'absolute', left: aleatorio(i + 40) * 1920, top: (aleatorio(i + 90) * 1080 + f * 0.12 * (i % 3)) % 1080, width: 3, height: 3, borderRadius: 2, background: `rgba(255,255,255,${0.1 + aleatorio(i + 60) * 0.2})`}} />
    ))}
    <AbsoluteFill style={{background: 'radial-gradient(ellipse at 50% 50%, rgba(0,0,0,0) 55%, rgba(0,0,0,0.6) 100%)'}} />
  </AbsoluteFill>
);

// Câmera virtual 2D: aproxima em um ponto da tela. (fx, fy) é o ponto que fica no centro.
export const Camera2D: React.FC<{z: number; fx: number; fy: number; children: React.ReactNode}> = ({z, fx, fy, children}) => (
  <div style={{position: 'absolute', left: 0, top: 0, width: 1920, height: 1080, transformOrigin: '0 0', transform: `translate(${960 - fx * z}px, ${540 - fy * z}px) scale(${z})`}}>{children}</div>
);

// Janela de vidro escuro com barra de título.
export const Janela: React.FC<{titulo?: string; style?: React.CSSProperties; children?: React.ReactNode; luz?: number}> = ({titulo, style, children, luz = 0.5}) => (
  <div style={{position: 'absolute', background: C.cartao, border: `1px solid ${C.borda}`, borderRadius: 16, boxShadow: `0 0 80px rgba(242,98,46,${0.16 * luz}), 0 30px 70px rgba(0,0,0,0.6)`, overflow: 'hidden', ...style}}>
    {titulo !== undefined ? (
      <div style={{height: 44, display: 'flex', alignItems: 'center', gap: 8, padding: '0 16px', borderBottom: `1px solid ${C.borda}`, fontFamily: MONO, fontSize: 17, color: C.mudo}}>
        {[0, 1, 2].map((i) => (
          <div key={i} style={{width: 10, height: 10, borderRadius: 5, background: 'rgba(255,255,255,0.16)'}} />
        ))}
        <span style={{marginLeft: 14}}>
          <span style={{color: C.acento}}>✳</span> {titulo}
        </span>
      </div>
    ) : null}
    {children}
  </div>
);

// Ênfase: poucas palavras, cada uma entrando no seu quadro. Palavras com * ficam na cor de destaque.
export const Enfase: React.FC<{
  f: number;
  palavras: [string, number][]; // [texto, quadro em que entra]
  ate: number;
  tam?: number;
  style?: React.CSSProperties;
}> = ({f, palavras, ate, tam = 96, style}) => {
  if (f < palavras[0][1] || f > ate) return null;
  const sai = rampa(f, ate - 8, ate, power3In);
  return (
    <div style={{position: 'absolute', left: 0, right: 0, textAlign: 'center', fontFamily: SANS, fontWeight: 900, fontSize: tam, letterSpacing: -2, lineHeight: 1.05, opacity: 1 - sai, transform: `translateY(${sai * 30}px)`, filter: `blur(${sai * 8}px)`, ...style}}>
      {palavras.map(([p, de], i) => {
        const e = rampa(f, de, de + 8, expoOut);
        const cor = p.startsWith('*');
        return (
          <span key={i} style={{display: 'inline-block', marginRight: '0.26em', opacity: e, transform: `translateY(${(1 - e) * 22}px)`, filter: `blur(${(1 - e) * 10}px)`, color: cor ? C.acento : C.texto, textShadow: cor ? brilho(C.acento, 0.9) : '0 4px 24px rgba(0,0,0,0.8)'}}>
            {p.replace(/\*/g, '')}
          </span>
        );
      })}
    </div>
  );
};

// Etiqueta pequena em letra de máquina, com um ponto aceso.
export const Etiqueta: React.FC<{children: React.ReactNode; style?: React.CSSProperties; cor?: string}> = ({children, style, cor = C.acento}) => (
  <div style={{fontFamily: MONO, fontSize: 27, letterSpacing: 5, color: C.mudo, display: 'flex', alignItems: 'center', gap: 12, ...style}}>
    <span style={{width: 10, height: 10, borderRadius: 5, background: cor, boxShadow: `0 0 12px ${cor}`}} />
    {children}
  </div>
);

// Tela desenhada em canvas, redesenhada a cada quadro.
export const Quadro: React.FC<{desenhar: (g: CanvasRenderingContext2D, w: number, h: number, f: number) => void; f: number; w: number; h: number; style?: React.CSSProperties}> = ({desenhar, f, w, h, style}) => {
  const ref = useRef<HTMLCanvasElement>(null);
  useLayoutEffect(() => {
    const g = ref.current?.getContext('2d');
    if (!g) return;
    g.save();
    g.clearRect(0, 0, w, h);
    desenhar(g, w, h, f);
    g.restore();
  }, [f, w, h, desenhar]);
  return <canvas ref={ref} width={w} height={h} style={{display: 'block', ...style}} />;
};

// Troca de trecho: chega um pouco maior e desfocado e assenta; sai acelerando para dentro.
export const Troca: React.FC<{f: number; dur: number; children: React.ReactNode}> = ({f, dur, children}) => {
  const chega = 1 - rampa(f, 0, 16, expoOut);
  const sai = rampa(f, dur - 9, dur, (n) => n * n * n * n);
  return <AbsoluteFill style={{transform: `scale(${1 + chega * 0.16 + sai * 0.5})`, filter: chega + sai > 0.02 ? `blur(${(chega * 14 + sai * 20).toFixed(1)}px)` : undefined, opacity: 1 - sai * 0.5}}>{children}</AbsoluteFill>;
};

// Marca do Claude em 2D: quadrado laranja arredondado com a estrela clara.
export const Marca: React.FC<{tam: number; style?: React.CSSProperties}> = ({tam, style}) => (
  <svg width={tam} height={tam} viewBox="-50 -50 100 100" style={{filter: `drop-shadow(0 0 ${tam * 0.18}px rgba(242,98,46,0.7))`, ...style}}>
    <rect x={-50} y={-50} width={100} height={100} rx={24} fill={C.acento} />
    {[1, 0.76, 0.94, 0.72, 1, 0.78, 0.92, 0.74, 1, 0.76, 0.9, 0.74].map((r, i) => (
      <line key={i} x1={0} y1={0} x2={0} y2={-34 * r} stroke="#fffaf2" strokeWidth={6.5} strokeLinecap="round" transform={`rotate(${i * 30 + 4})`} />
    ))}
  </svg>
);
