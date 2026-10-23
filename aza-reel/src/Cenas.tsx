import React, { useEffect, useLayoutEffect, useRef, useState } from "react";
import { AbsoluteFill, Easing, Img, continueRender, delayRender, staticFile } from "remotion";
import { C, SANS, SERIF, W, H, clamp, expoOut, mix, pr } from "./tokens";

export const Fundo: React.FC<{ brilho?: number }> = ({ brilho = 1 }) => (
  <AbsoluteFill style={{ background: C.fundo }}>
    <div style={{ position: "absolute", inset: 0, background: `radial-gradient(ellipse 80% 45% at 50% 108%, hsl(332 80% 52% / ${0.42 * brilho}), transparent 70%), radial-gradient(ellipse 60% 30% at 85% -5%, hsl(332 60% 40% / ${0.22 * brilho}), transparent 70%)` }} />
    <div style={{ position: "absolute", inset: 0, backgroundImage: "radial-gradient(rgba(255,255,255,0.09) 1px, transparent 1.3px)", backgroundSize: "30px 30px", opacity: 0.5 }} />
  </AbsoluteFill>
);

// logo: silhueta vetorizada do PNG original, pintada com máscara para trocar a cor
export const Logo: React.FC<{ w: number; cor?: string }> = ({ w, cor = C.offwhite }) => (
  <div style={{ width: w, height: (w * 288) / 522, background: cor, WebkitMaskImage: `url(${staticFile("aza-logo.svg")})`, WebkitMaskSize: "100% 100%", WebkitMaskRepeat: "no-repeat" }} />
);

// curva tracejada rosa que "corre", com brilho (assinatura do estilo Furion)
export const Tracejado: React.FC<{ d: string; largura?: number; dash?: string; off?: number; op?: number }> = ({ d, largura = 5, dash = "34 26", off = 0, op = 1 }) => (
  <g opacity={op}>
    <path d={d} fill="none" stroke={C.rosa} strokeWidth={largura * 4} strokeDasharray={dash} strokeDashoffset={off} strokeLinecap="round" opacity={0.28} style={{ filter: "blur(14px)" }} />
    <path d={d} fill="none" stroke={C.rosa} strokeWidth={largura} strokeDasharray={dash} strokeDashoffset={off} strokeLinecap="round" />
  </g>
);

export const Janela: React.FC<{ titulo: string; w: number; h: number; children: React.ReactNode; style?: React.CSSProperties }> = ({ titulo, w, h, children, style }) => (
  <div style={{ position: "absolute", width: w, height: h, borderRadius: 30, overflow: "hidden", background: C.painel, border: `1.5px solid ${C.borda}`, boxShadow: "0 60px 120px rgba(0,0,0,.6), 0 0 0 1px rgba(0,0,0,.4)", ...style }}>
    <div style={{ height: 62, display: "flex", alignItems: "center", gap: 14, padding: "0 24px", background: `linear-gradient(90deg, ${C.rosa}, ${C.rosaEsc})`, fontFamily: SANS, fontWeight: 600, fontSize: 24, letterSpacing: 1, color: "#fff" }}>
      <span style={{ width: 20, height: 20, borderRadius: 6, border: "2.5px solid rgba(255,255,255,.92)", boxSizing: "border-box" }} />
      {titulo}
      <span style={{ marginLeft: "auto", letterSpacing: 4, fontSize: 26 }}>⋮</span>
    </div>
    <div style={{ position: "relative", width: "100%", height: h - 62 }}>{children}</div>
  </div>
);

export const Cursor: React.FC<{ x: number; y: number; s?: number }> = ({ x, y, s = 1 }) => (
  <svg width={84 * s} height={84 * s} viewBox="0 0 24 24" style={{ position: "absolute", left: x, top: y, filter: "drop-shadow(0 6px 10px rgba(0,0,0,.55))" }}>
    <path d="M4 2 L4 19 L8.6 15 L11.6 21.6 L14.4 20.3 L11.4 13.8 L17.5 13.8 Z" fill={C.rosa} stroke="#fff" strokeWidth="1.2" strokeLinejoin="round" />
  </svg>
);

// ---------- logo se escrevendo ----------
// public/logo-tempo.png guarda, por pixel da silhueta, a distância medida ao longo da própria forma a partir da ponta
// inferior esquerda (R,G = distância em 16 bits, B = opacidade). A frente de revelação anda nessa distância.
type Mapa = { w: number; h: number; dist: Float32Array; alfa: Uint8Array; maxDist: number };
const useMapa = (): Mapa | null => {
  const [m, setM] = useState<Mapa | null>(null);
  const [h] = useState(() => delayRender("mapa da logo"));
  useEffect(() => {
    fetch(staticFile("logo-tempo.json")).then((r) => r.json()).then((j) => {
      const img = new window.Image();
      img.onload = () => {
        const cv = document.createElement("canvas"); cv.width = j.w; cv.height = j.h;
        const cx = cv.getContext("2d", { willReadFrequently: true })!; cx.drawImage(img, 0, 0);
        const d = cx.getImageData(0, 0, j.w, j.h).data; const n = j.w * j.h;
        const dist = new Float32Array(n), alfa = new Uint8Array(n);
        for (let i = 0; i < n; i++) { dist[i] = ((d[i * 4] << 8) | d[i * 4 + 1]) / 65535 * j.maxDist; alfa[i] = d[i * 4 + 2]; }
        setM({ w: j.w, h: j.h, dist, alfa, maxDist: j.maxDist }); continueRender(h);
      };
      img.src = staticFile("logo-tempo.png");
    });
  }, [h]);
  return m;
};
const hsl = (hh: number, ss: number, ll: number) => { const a = ss * Math.min(ll, 1 - ll); const f = (n: number) => { const k = (n + hh / 30) % 12; return ll - a * Math.max(-1, Math.min(k - 3, 9 - k, 1)); }; return [f(0) * 255, f(8) * 255, f(4) * 255]; };
const ROSA = hsl(332, 0.82, 0.68), BRANCO = [244, 241, 236];
// curva do traço: velocidade medida varia pouco ao longo do gesto (ver nota no commit)
export const curvaTraco = Easing.bezier(0.3, 0.2, 0.7, 0.8);
export const LogoEscrita: React.FC<{ w: number; p: number }> = ({ w, p }) => {
  const m = useMapa(); const ref = useRef<HTMLCanvasElement>(null);
  useLayoutEffect(() => {
    if (!m || !ref.current) return;
    const cx = ref.current.getContext("2d")!; const img = cx.createImageData(m.w, m.h); const o = img.data;
    const borda = 16, rastro = 0.2 * m.maxDist, frente = p * (m.maxDist + rastro + borda);
    for (let i = 0; i < m.w * m.h; i++) {
      const a = m.alfa[i]; if (!a) continue;
      const atras = frente - m.dist[i]; if (atras <= 0) continue;
      const r = Math.min(1, atras / borda);
      const t = Math.pow(clamp(1 - atras / rastro), 1.6);
      o[i * 4] = BRANCO[0] + (ROSA[0] - BRANCO[0]) * t; o[i * 4 + 1] = BRANCO[1] + (ROSA[1] - BRANCO[1]) * t; o[i * 4 + 2] = BRANCO[2] + (ROSA[2] - BRANCO[2]) * t;
      o[i * 4 + 3] = a * r;
    }
    cx.putImageData(img, 0, 0);
  }, [m, p]);
  return <canvas ref={ref} width={m?.w ?? 1566} height={m?.h ?? 864} style={{ width: w, height: (w * 288) / 522, filter: `drop-shadow(0 0 ${14 * (1 - p) + 4}px hsl(332 82% 62% / .55))` }} />;
};

// ---------- CENA 1: abertura com a logo se escrevendo (t em segundos) ----------
export const Cena1: React.FC<{ t: number; fundoProprio?: boolean }> = ({ t, fundoProprio = true }) => {
  const fundo = pr(t, 0, 0.6), traco = clamp((t - 0.4) / 2.3);
  const p = curvaTraco(traco);
  const off = -t * 230;   // tracejado corre em velocidade constante
  return (
    <AbsoluteFill>
      {fundoProprio && <div style={{ opacity: fundo }}><Fundo /></div>}
      <svg width={W} height={H} style={{ position: "absolute", inset: 0, overflow: "visible", opacity: pr(t, 0.1, 0.8) }}>
        <Tracejado d={`M-80 1180 C 260 1180 380 1010 540 1010 S 820 700 1160 700`} largura={5} off={off} />
        <Tracejado d={`M-80 1330 C 300 1330 420 1160 600 1130 S 880 880 1160 860`} largura={3} dash="22 24" off={off * 1.3} op={0.55} />
      </svg>
      <div style={{ position: "absolute", left: (W - W * 0.57) / 2, top: 780 }}><LogoEscrita w={W * 0.57} p={p} /></div>
      <div style={{ position: "absolute", left: 0, right: 0, top: 1420, textAlign: "center", fontFamily: SERIF, fontSize: 40, letterSpacing: mix(14, 8, expoOut(clamp((t - 2.7) / 0.8))), color: C.dim, opacity: pr(t, 2.7, 0.7), filter: `blur(${(1 - pr(t, 2.7, 0.7)) * 8}px)` }}>MOVIMENTO QUE VESTE PRESENÇA</div>
      <div style={{ position: "absolute", left: 0, right: 0, bottom: 150, textAlign: "center", fontFamily: SANS, fontWeight: 500, fontSize: 30, letterSpacing: 8, color: C.rosa, opacity: pr(t, 3.1, 0.6) }}>USEAZA.COM.BR</div>
    </AbsoluteFill>
  );
};

// ---------- IMAGEM 1: logo + traço ----------
export const Still1: React.FC = () => <Cena1 t={4.2} />;

// ---------- IMAGEM 2: site em perspectiva ----------
// o print (1170x1900) preenche a janela de 600x1038 com object-fit cover: escala 0,546, cortado 19,5 px de cada lado; o botão "Conheça a coleção" (x 48..744, y 1629..1779) cai em x 7..387, y 890..971
export const Still2: React.FC = () => (
  <AbsoluteFill>
    <Fundo brilho={0.8} />
    <div style={{ position: "absolute", inset: 0, perspective: 2600, perspectiveOrigin: "50% 45%" }}>
      <div style={{ position: "absolute", left: 0, top: 0, width: W, height: H, transformStyle: "preserve-3d", transform: "rotateX(6deg) rotateY(-9deg)" }}>
        <Janela titulo="useaza.com.br" w={600} h={1100} style={{ left: 110, top: 250, transform: "translateZ(40px)" }}>
          <Img src={staticFile("site/hero.jpg")} style={{ width: "100%", height: "100%", objectFit: "cover", objectPosition: "top" }} />
          <div style={{ position: "absolute", left: 3, top: 886, width: 392, height: 90, borderRadius: 4, boxShadow: `0 0 0 4px ${C.rosa}, 0 0 46px ${C.rosa}` }} />
          <Cursor x={300} y={930} s={0.9} />
        </Janela>
        <Janela titulo="Coleção Presença" w={440} h={350} style={{ left: 560, top: 1330, transform: "translateZ(120px)" }}>
          <Img src={staticFile("site/presenca.jpg")} style={{ width: "100%", height: "100%", objectFit: "cover", objectPosition: "top" }} />
        </Janela>
      </div>
    </div>
    <div style={{ position: "absolute", left: 0, right: 0, top: 120, textAlign: "center", fontFamily: SERIF, fontSize: 66, letterSpacing: 4, color: C.offwhite }}>
      Do movimento <span style={{ color: C.rosa, fontStyle: "italic" }}>à cidade</span>
    </div>
  </AbsoluteFill>
);

// ---------- IMAGEM 3: cards de produto com as fotos do ensaio ----------
const cards = [
  { t: "Tops", f: "640", x: 40, y: 330, w: 450, h: 640, rz: -4, z: 40 },
  { t: "Leggings e calças", f: "351", x: 560, y: 230, w: 450, h: 640, rz: 3, z: -30 },
  { t: "Jaquetas e coletes", f: "1033", x: 90, y: 1080, w: 450, h: 640, rz: 3, z: -60 },
  { t: "Presença", f: "428", x: 600, y: 960, w: 420, h: 600, rz: -3, z: 70 },
];
export const Still3: React.FC = () => (
  <AbsoluteFill>
    <Fundo brilho={0.9} />
    <div style={{ position: "absolute", inset: 0, perspective: 2300, perspectiveOrigin: "50% 48%" }}>
      <div style={{ position: "absolute", inset: 0, transformStyle: "preserve-3d", transform: "rotateX(6deg) rotateY(10deg)" }}>
        <svg width={W} height={H} style={{ position: "absolute", inset: 0, overflow: "visible" }}>
          <Tracejado d={`M490 640 C 540 640 520 520 560 520`} largura={5} off={-10} />
          <Tracejado d={`M300 970 C 300 1030 330 1030 330 1080`} largura={5} off={-20} />
          <Tracejado d={`M780 870 C 780 920 800 920 810 960`} largura={5} off={-30} />
        </svg>
        {cards.map((c) => (
          <Janela key={c.f} titulo={c.t} w={c.w} h={c.h} style={{ left: c.x, top: c.y, transform: `translateZ(${c.z}px) rotateZ(${c.rz}deg)` }}>
            <Img src={staticFile(`fotos/${c.f}.jpg`)} style={{ width: "100%", height: "100%", objectFit: "cover", objectPosition: "50% 20%" }} />
          </Janela>
        ))}
        <Cursor x={820} y={1380} />
      </div>
    </div>
    <div style={{ position: "absolute", left: 0, right: 0, top: 120, textAlign: "center", fontFamily: SERIF, fontSize: 60, letterSpacing: 4, color: C.offwhite }}>
      Uma peça, <span style={{ color: C.rosa, fontStyle: "italic" }}>inúmeras possibilidades</span>
    </div>
  </AbsoluteFill>
);
