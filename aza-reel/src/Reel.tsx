import React, { useId } from "react";
import { AbsoluteFill, Img, staticFile } from "remotion";
import { C, SANS, SERIF, W, H, clamp, expoOut, keys, mix, pr, suave, volta } from "./tokens";
import { CENAS } from "./roteiro";
import { Cena1, Cursor, Fundo, Janela, Logo, Tracejado } from "./Cenas";

const FADE = 0.35;
// envelope de cena: entra e sai com desfoque, sobrepondo a cena vizinha
const Cena: React.FC<{ t: number; a: number; b: number; children: (u: number) => React.ReactNode }> = ({ t, a, b, children }) => {
  if (t < a || t > b) return null;
  const ent = clamp((t - a) / FADE), sai = clamp((b - t) / FADE);
  const o = Math.min(ent, sai), bl = (1 - o) * 14;
  return <AbsoluteFill style={{ opacity: o, filter: bl > 0.1 ? `blur(${bl}px)` : undefined }}>{children(t - a)}</AbsoluteFill>;
};

const Palavra: React.FC<{ u: number; ini: number; children: React.ReactNode; rosa?: boolean; saiEm?: number }> = ({ u, ini, children, rosa, saiEm }) => {
  const p = pr(u, ini, 0.7), q = saiEm ? pr(u, saiEm, 0.4, suave) : 0;
  return <span style={{ display: "inline-block", opacity: p * (1 - q), transform: `translateY(${(1 - p) * 46 - q * 20}px)`, filter: `blur(${(1 - p) * 10 + q * 8}px)`, color: rosa ? C.rosa : C.offwhite, fontStyle: rosa ? "italic" : "normal", marginRight: "0.28em" }}>{children}</span>;
};

// tracejado que se revela da origem ao destino e depois corre
const Fio: React.FC<{ d: string; p: number; t: number; largura?: number; op?: number }> = ({ d, p, t, largura = 5, op = 1 }) => {
  const id = useId().replace(/:/g, "");
  return (
    <svg width={W} height={H} style={{ position: "absolute", inset: 0, overflow: "visible", pointerEvents: "none" }}>
      <defs><mask id={id} maskUnits="userSpaceOnUse" x={-500} y={-500} width={W + 1000} height={H + 1000}><path d={d} pathLength={1} fill="none" stroke="#fff" strokeWidth={60} strokeLinecap="round" strokeDasharray={`${p} 2`} /></mask></defs>
      <g mask={`url(#${id})`}><Tracejado d={d} largura={largura} off={-t * 220} op={op} /></g>
    </svg>
  );
};

const Clique: React.FC<{ x: number; y: number; u: number; ini: number }> = ({ x, y, u, ini }) => {
  const p = pr(u, ini, 0.6, expoOut); if (u < ini || p >= 1) return null;
  return <div style={{ position: "absolute", left: x - 70, top: y - 70, width: 140, height: 140, borderRadius: 140, border: `4px solid ${C.rosa}`, opacity: 1 - p, transform: `scale(${0.2 + p * 1.1})`, boxShadow: `0 0 40px ${C.rosa}` }} />;
};

// câmera: u (s) -> transform; "foco" centraliza um ponto do palco aplicando a escala s
const Camera: React.FC<{ s: number; rx: number; ry: number; rz?: number; px: number; py: number; f: number; alvo?: [number, number]; z?: number; children: React.ReactNode }> = ({ s, rx, ry, rz = 0, px, py, f, alvo = [540, 960], children }) => {
  const tx = f * (alvo[0] - 540 - s * (px - 540)), ty = f * (alvo[1] - 960 - s * (py - 960));
  return (
    <div style={{ position: "absolute", inset: 0, perspective: 2600, perspectiveOrigin: "50% 45%" }}>
      <div style={{ position: "absolute", inset: 0, transformStyle: "preserve-3d", transform: `translate(${tx}px, ${ty}px) scale(${s}) rotateX(${rx}deg) rotateY(${ry}deg) rotateZ(${rz}deg)` }}>{children}</div>
    </div>
  );
};

const Titulo: React.FC<{ top?: number; size?: number; children: React.ReactNode }> = ({ top = 120, size = 62, children }) => (
  <div style={{ position: "absolute", left: 0, right: 0, top, textAlign: "center", fontFamily: SERIF, fontSize: size, letterSpacing: 3, color: C.offwhite, lineHeight: 1.08 }}>{children}</div>
);

// ---------- CENA 2: o site em perspectiva, cursor clica em "Conheça a coleção" ----------
const BTN = { x: 200, y: 930 };   // centro do botão na janela do print (600 px)
const CenaSite: React.FC<{ u: number }> = ({ u }) => {
  const s = keys(u, [[0, 0.72], [2.6, 1.0], [5.8, 1.06]], expoOut), ry = keys(u, [[0, -26], [2.8, -9], [5.8, -6]]), rx = keys(u, [[0, 12], [2.8, 6]]);
  const cx = keys(u, [[0.9, 520], [2.4, BTN.x + 60]]), cy = keys(u, [[0.9, 330], [2.4, BTN.y + 40]]);
  const click = pr(u, 2.6, 0.25, suave) * (1 - pr(u, 2.85, 0.25, suave));
  const bp = pr(u, 3.2, 0.9, expoOut);
  return (
    <>
      <Camera s={s} rx={rx} ry={ry} px={540} py={960} f={0}>
        <Janela titulo="useaza.com.br" w={600} h={1100} style={{ left: 150, top: 250, transform: "translateZ(40px)" }}>
          <Img src={staticFile("site/hero.jpg")} style={{ width: "100%", height: "100%", objectFit: "cover", objectPosition: "top" }} />
          <div style={{ position: "absolute", left: 3, top: 886, width: 392, height: 90, borderRadius: 4, boxShadow: `0 0 0 4px ${C.rosa}, 0 0 ${46 + click * 40}px ${C.rosa}`, opacity: pr(u, 1.8, 0.5), transform: `scale(${1 + click * 0.03})` }} />
          <Cursor x={cx} y={cy} s={0.9} />
          <Clique x={cx + 6} y={cy + 8} u={u} ini={2.6} />
        </Janela>
        <div style={{ opacity: bp, transform: `translateY(${(1 - bp) * 160}px)` }}>
          <Janela titulo="Coleção Presença" w={440} h={350} style={{ left: 560, top: 1330, transform: "translateZ(120px)" }}>
            <Img src={staticFile("site/presenca.jpg")} style={{ width: "100%", height: "100%", objectFit: "cover", objectPosition: "top" }} />
          </Janela>
        </div>
        <Fio d="M510 1280 C 560 1340 520 1500 560 1500" p={pr(u, 3.3, 0.9, suave)} t={u} />
      </Camera>
      <Titulo top={120} size={70}><Palavra u={u} ini={0.5}>Do movimento</Palavra><Palavra u={u} ini={0.95} rosa>à cidade</Palavra></Titulo>
    </>
  );
};

// ---------- CENA 3: cards de produto (fotos do ensaio), câmera desce pelo canvas ----------
const CARDS = [
  { t: "Tops", f: "640", x: 50, y: 330, w: 450, h: 640, rz: -4, z: 40 },
  { t: "Leggings e calças", f: "351", x: 570, y: 250, w: 450, h: 640, rz: 3, z: -30 },
  { t: "Short", f: "320", x: 540, y: 1080, w: 450, h: 640, rz: -2, z: 60 },
  { t: "Jaquetas e coletes", f: "1033", x: 70, y: 1130, w: 450, h: 640, rz: 3, z: -60 },
  { t: "Presença", f: "428", x: 300, y: 1900, w: 460, h: 640, rz: -3, z: 50 },
];
const CenaCards: React.FC<{ u: number }> = ({ u }) => {
  const py = keys(u, [[0, 700], [3.2, 1000], [6.4, 1380]]), s = keys(u, [[0, 1.06], [4.5, 1.0], [7.0, 0.9]]);
  const ry = keys(u, [[0, 14], [3.5, 6], [7, -8]]), rx = keys(u, [[0, 8], [7, 4]]);
  return (
    <>
      <Camera s={s} rx={rx} ry={ry} px={540} py={py} f={1} alvo={[540, 960]}>
        <Fio d="M500 650 C 540 650 520 560 570 560" p={pr(u, 0.9, 0.8, suave)} t={u} />
        <Fio d="M780 890 C 780 980 760 1000 760 1080" p={pr(u, 1.8, 0.9, suave)} t={u} />
        <Fio d="M540 1400 C 400 1400 420 1260 300 1260" p={pr(u, 3.0, 0.9, suave)} t={u} />
        <Fio d="M300 1770 C 300 1850 420 1850 520 1900" p={pr(u, 4.2, 0.9, suave)} t={u} />
        {CARDS.map((c, i) => {
          const p = pr(u, 0.15 + i * 0.5, 0.9, expoOut);
          return (
            <div key={c.f} style={{ opacity: p, transform: `translateY(${(1 - p) * 220}px)` }}>
              <Janela titulo={c.t} w={c.w} h={c.h} style={{ left: c.x, top: c.y, transform: `translateZ(${c.z}px) rotateZ(${c.rz}deg)` }}>
                <Img src={staticFile(`fotos/${c.f}.jpg`)} style={{ width: "100%", height: "100%", objectFit: "cover", objectPosition: "50% 20%" }} />
              </Janela>
            </div>
          );
        })}
      </Camera>
      <Titulo top={110} size={62}><Palavra u={u} ini={0.3} saiEm={3.0}>Uma peça,</Palavra><Palavra u={u} ini={0.8} rosa saiEm={3.0}>inúmeras possibilidades</Palavra></Titulo>
    </>
  );
};

// ---------- CENA 4: texto cinético (as duas promessas do site) ----------
const Linha: React.FC<{ d: string; p: number; t: number }> = ({ d, p, t }) => <Fio d={d} p={p} t={t} largura={4} op={0.8} />;
const CenaTexto: React.FC<{ u: number }> = ({ u }) => {
  const k = 3.0;   // troca de frase
  const al = (1 - pr(u, k - 0.3, 0.4, suave));
  const ar = pr(u, k + 0.1, 0.4, suave);
  return (
    <>
      <Linha d="M-60 760 C 40 760 70 900 120 1010" p={pr(u, 0.2, 1.0, suave) * al + (1 - al) * 0} t={u} />
      <Linha d="M1140 1250 C 1040 1250 1010 1120 960 1010" p={pr(u, 0.5, 1.0, suave) * al} t={u} />
      <Linha d="M-60 1250 C 80 1250 140 1100 200 950" p={pr(u, k + 0.2, 1.0, suave) * ar} t={u} />
      <Linha d="M1140 700 C 1000 700 940 840 880 950" p={pr(u, k + 0.4, 1.0, suave) * ar} t={u} />
      <div style={{ position: "absolute", left: 40, right: 40, top: 880, textAlign: "center", fontFamily: SERIF, fontSize: 112, lineHeight: 1.05, opacity: al }}>
        <div><Palavra u={u} ini={0.4} saiEm={k - 0.3}>Valoriza</Palavra></div>
        <div><Palavra u={u} ini={0.8} rosa saiEm={k - 0.3}>sua silhueta</Palavra></div>
      </div>
      <div style={{ position: "absolute", left: 40, right: 40, top: 880, textAlign: "center", fontFamily: SERIF, fontSize: 112, lineHeight: 1.05 }}>
        <div><Palavra u={u - k} ini={0.3}>Feito</Palavra><Palavra u={u - k} ini={0.55}>para</Palavra></div>
        <div><Palavra u={u - k} ini={0.9} rosa>durar</Palavra></div>
      </div>
      <div style={{ position: "absolute", left: 340, width: 400 * pr(u, k + 1.3, 0.8, expoOut), top: 1170, height: 4, background: C.rosa, boxShadow: `0 0 24px ${C.rosa}`, opacity: ar }} />
    </>
  );
};

// ---------- CENA 5: o clique de compra no site (mais vendidos) ----------
// print 1170x2055 exibido a 640 px de largura (escala 0,547): "+" em (865,1620) -> (473,886) no conteúdo; preço em (494,1851) -> (270,1013)
const PL = { left: 220, top: 320, w: 640 };
const PLUS = { x: PL.left + 473, y: PL.top + 62 + 886 };
const CenaCompra: React.FC<{ u: number }> = ({ u }) => {
  const s = keys(u, [[0, 0.78], [2.2, 1.0], [4.8, 1.2]], expoOut), f = keys(u, [[0, 0], [2.2, 0.1], [4.8, 0.85]]);
  const cx = keys(u, [[0.6, PL.left + 120], [2.2, 473 + 10]]), cy = keys(u, [[0.6, 420], [2.2, 886 + 20]]);
  const click = pr(u, 2.4, 0.2, suave) * (1 - pr(u, 2.65, 0.25, suave));
  const sac = pr(u, 3.0, 0.7, volta);
  return (
    <>
      <Camera s={s} rx={keys(u, [[0, 8], [3, 3]])} ry={keys(u, [[0, 12], [3, -4]])} px={PLUS.x} py={PLUS.y - 120} f={f} alvo={[690, 1080]}>
        <Janela titulo="Mais vendidos" w={PL.w} h={1186} style={{ left: PL.left, top: PL.top, transform: "translateZ(40px)" }}>
          <Img src={staticFile("site/best.jpg")} style={{ width: "100%", height: "100%", objectFit: "cover", objectPosition: "top" }} />
          <div style={{ position: "absolute", left: 473 - 36, top: 886 - 36, width: 72, height: 72, boxShadow: `0 0 0 4px ${C.rosa}, 0 0 ${40 + click * 40}px ${C.rosa}`, opacity: pr(u, 1.8, 0.4), borderRadius: 4 }} />
          <div style={{ position: "absolute", left: 175, top: 1036, width: 190 * pr(u, 3.4, 0.7, expoOut), height: 4, background: C.rosa, boxShadow: `0 0 18px ${C.rosa}` }} />
          <Cursor x={cx} y={cy} s={0.9} />
          <Clique x={cx + 6} y={cy + 8} u={u} ini={2.4} />
        </Janela>
      </Camera>
      <Fio d={`M${PLUS.x} ${PLUS.y} C 900 700 930 400 900 250`} p={pr(u, 2.7, 0.8, suave)} t={u} />
      <div style={{ position: "absolute", right: 70, top: 150, width: 120, height: 120, borderRadius: 120, background: `linear-gradient(135deg, ${C.rosa}, ${C.rosaEsc})`, display: "grid", placeItems: "center", opacity: sac, transform: `scale(${0.4 + sac * 0.6})`, boxShadow: `0 0 ${30 + sac * 30}px ${C.rosa}` }}>
        <svg width="62" height="62" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M6 8h12l1 12H5L6 8Z" /><path d="M9 8V6a3 3 0 0 1 6 0v2" /></svg>
      </div>
      <Titulo top={110} size={64}><Palavra u={u} ini={0.4} saiEm={2.9}>Feito para o</Palavra><Palavra u={u} ini={0.85} rosa saiEm={2.9}>seu momento</Palavra></Titulo>
    </>
  );
};

// ---------- CENA 6: a câmera recua e mostra o site e as fotos juntos ----------
const CenaRecuo: React.FC<{ u: number }> = ({ u }) => {
  const s = keys(u, [[0, 1.5], [3.2, 1.02]], expoOut), ry = keys(u, [[0, -4], [4, 8]]);
  const alf = pr(u, 1.6, 0.9);
  return (
    <>
      <Camera s={s} rx={5} ry={ry} px={540} py={900} f={keys(u, [[0, 1], [3, 0.2]])} alvo={[540, 960]}>
        <Janela titulo="Mais vendidos" w={380} h={760} style={{ left: 350, top: 520, transform: "translateZ(40px)" }}>
          <Img src={staticFile("site/best.jpg")} style={{ width: "100%", height: "100%", objectFit: "cover", objectPosition: "top" }} />
        </Janela>
        <div style={{ opacity: alf, transform: `translateX(${(1 - alf) * -200}px)` }}>
          <Janela titulo="useaza.com.br" w={330} h={640} style={{ left: 10, top: 640, transform: "translateZ(-80px) rotateY(22deg)" }}>
            <Img src={staticFile("site/hero.jpg")} style={{ width: "100%", height: "100%", objectFit: "cover", objectPosition: "top" }} />
          </Janela>
          <Janela titulo="Coleção Presença" w={340} h={340} style={{ left: 735, top: 700, transform: "translateZ(-80px) rotateY(-22deg)" }}>
            <Img src={staticFile("site/presenca.jpg")} style={{ width: "100%", height: "100%", objectFit: "cover", objectPosition: "top" }} />
          </Janela>
          {[["640", 40, 250, -5], ["1033", 560, 1250, 4], ["428", 40, 1320, 3], ["351", 740, 300, 4]].map(([f, x, y, r]) => (
            <Janela key={String(f)} titulo="AZA" w={290} h={400} style={{ left: Number(x), top: Number(y), transform: `translateZ(-120px) rotateZ(${r}deg)` }}>
              <Img src={staticFile(`fotos/${f}.jpg`)} style={{ width: "100%", height: "100%", objectFit: "cover", objectPosition: "50% 20%" }} />
            </Janela>
          ))}
        </div>
      </Camera>
      <div style={{ position: "absolute", left: 0, right: 0, top: 1735, textAlign: "center", fontFamily: SERIF, fontSize: 64, color: C.offwhite, opacity: pr(u, 1.6, 0.8), textShadow: "0 4px 24px rgba(0,0,0,.8)" }}>Siga <span style={{ color: C.rosa, fontStyle: "italic" }}>@useazabr</span></div>
    </>
  );
};

// ---------- CENA 7: assinatura final ----------
const CenaFinal: React.FC<{ u: number }> = ({ u }) => {
  const a = pr(u, 0, 0.8), sc = mix(0.94, 1, expoOut(clamp(u / 1.2)));
  return (
    <>
      <svg width={W} height={H} style={{ position: "absolute", inset: 0, overflow: "visible", opacity: a }}>
        <Tracejado d={`M-80 1180 C 260 1180 380 1010 540 1010 S 820 700 1160 700`} largura={5} off={-(CENAS.final.a + u) * 230} />
        <Tracejado d={`M-80 1330 C 300 1330 420 1160 600 1130 S 880 880 1160 860`} largura={3} dash="22 24" off={-(CENAS.final.a + u) * 300} op={0.55} />
      </svg>
      <div style={{ position: "absolute", left: (W - W * 0.57) / 2, top: 780, opacity: a, transform: `scale(${sc})`, filter: `drop-shadow(0 0 ${6 + a * 8}px hsl(332 82% 62% / .45))` }}><Logo w={W * 0.57} /></div>
      <div style={{ position: "absolute", left: 0, right: 0, top: 1420, textAlign: "center", fontFamily: SERIF, fontSize: 40, letterSpacing: 8, color: C.dim, opacity: pr(u, 0.3, 0.7) }}>MOVIMENTO QUE VESTE PRESENÇA</div>
      <div style={{ position: "absolute", left: 0, right: 0, top: 1560, textAlign: "center", fontFamily: SANS, fontWeight: 500, fontSize: 44, letterSpacing: 9, color: C.rosa, opacity: pr(u, 0.7, 0.6) }}>USEAZA.COM.BR</div>
    </>
  );
};

export const Reel: React.FC<{ t: number }> = ({ t }) => {
  const k = CENAS;
  const brilho = keys(t, [[0, 0.5], [4, 0.8], [16.6, 0.8], [19, 1.25], [22.6, 0.85], [33, 1.1]]);
  const negro = 1 - pr(t, 0, 0.6, suave);
  return (
    <AbsoluteFill style={{ background: "#000" }}>
      <Fundo brilho={brilho} />
      {t < k.logo.b && <div style={{ opacity: clamp((k.logo.b - t) / FADE), filter: `blur(${(1 - clamp((k.logo.b - t) / FADE)) * 14}px)` }}><Cena1 t={t} fundoProprio={false} /></div>}
      <Cena t={t} a={k.site.a} b={k.site.b}>{(u) => <CenaSite u={u} />}</Cena>
      <Cena t={t} a={k.cards.a} b={k.cards.b}>{(u) => <CenaCards u={u} />}</Cena>
      <Cena t={t} a={k.texto.a} b={k.texto.b}>{(u) => <CenaTexto u={u} />}</Cena>
      <Cena t={t} a={k.compra.a} b={k.compra.b}>{(u) => <CenaCompra u={u} />}</Cena>
      <Cena t={t} a={k.recuo.a} b={k.recuo.b}>{(u) => <CenaRecuo u={u} />}</Cena>
      <Cena t={t} a={k.final.a} b={k.final.b + 1}>{(u) => <CenaFinal u={u} />}</Cena>
      <div style={{ position: "absolute", inset: 0, background: "#000", opacity: negro, pointerEvents: "none" }} />
    </AbsoluteFill>
  );
};
