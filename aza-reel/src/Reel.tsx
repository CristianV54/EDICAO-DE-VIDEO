import React, { useId } from "react";
import { AbsoluteFill, Img, staticFile } from "remotion";
import { C, SANS, SERIF, W, H, clamp, expoOut, keys, mix, pr, suave, volta } from "./tokens";
import { CENAS } from "./roteiro";
import { Cena1, Cursor, Fundo, Janela, Logo, Tracejado, curvaTraco } from "./Cenas";

const FADE = 0.25;
// envelope de cena: entra e sai com desfoque, sobrepondo a cena vizinha
const Cena: React.FC<{ t: number; a: number; b: number; children: (u: number) => React.ReactNode }> = ({ t, a, b, children }) => {
  if (t < a || t > b) return null;
  const ent = clamp((t - a) / FADE), sai = clamp((b - t) / FADE);
  const o = Math.min(ent, sai), bl = (1 - o) * 14;
  return <AbsoluteFill style={{ opacity: o, filter: bl > 0.1 ? `blur(${bl}px)` : undefined }}>{children(t - a)}</AbsoluteFill>;
};

const Palavra: React.FC<{ u: number; ini: number; children: React.ReactNode; rosa?: boolean; saiEm?: number }> = ({ u, ini, children, rosa, saiEm }) => {
  const p = pr(u, ini, 0.5), q = saiEm ? pr(u, saiEm, 0.3, suave) : 0;
  return <span style={{ display: "inline-block", opacity: p * (1 - q), transform: `translateY(${(1 - p) * 46 - q * 20}px)`, filter: `blur(${(1 - p) * 10 + q * 8}px)`, color: rosa ? C.rosa : C.offwhite, fontStyle: rosa ? "italic" : "normal", marginRight: "0.28em" }}>{children}</span>;
};

// tracejado que se revela da origem ao destino e depois corre
const Fio: React.FC<{ d: string; p: number; t: number; largura?: number; op?: number }> = ({ d, p, t, largura = 5, op = 1 }) => {
  const id = useId().replace(/:/g, "");
  return (
    <svg width={W} height={H} style={{ position: "absolute", inset: 0, overflow: "visible", pointerEvents: "none" }}>
      <defs><mask id={id} maskUnits="userSpaceOnUse" x={-500} y={-500} width={W + 1000} height={H + 1000}><path d={d} pathLength={1} fill="none" stroke="#fff" strokeWidth={60} strokeLinecap="round" strokeDasharray={`${p} 2`} /></mask></defs>
      <g mask={`url(#${id})`}><Tracejado d={d} largura={largura} off={-t * 260} op={op} /></g>
    </svg>
  );
};

const Clique: React.FC<{ x: number; y: number; u: number; ini: number; r?: number }> = ({ x, y, u, ini, r = 70 }) => {
  const p = pr(u, ini, 0.5, expoOut); if (u < ini || p >= 1) return null;
  return <div style={{ position: "absolute", left: x - r, top: y - r, width: r * 2, height: r * 2, borderRadius: r * 2, border: `${r / 17}px solid ${C.rosa}`, opacity: 1 - p, transform: `scale(${0.2 + p * 1.1})`, boxShadow: `0 0 40px ${C.rosa}` }} />;
};

// câmera: foco centraliza um ponto do palco aplicando a escala s; sway dá um balanço contínuo
const camT = (s: number, f: number, px: number, py: number, alvo: [number, number]) => ({ tx: f * (alvo[0] - 540 - s * (px - 540)), ty: f * (alvo[1] - 960 - s * (py - 960)) });
const Camera: React.FC<{ s: number; rx: number; ry: number; u: number; px: number; py: number; f: number; alvo?: [number, number]; children: React.ReactNode }> = ({ s, rx, ry, u, px, py, f, alvo = [540, 960], children }) => {
  const { tx, ty } = camT(s, f, px, py, alvo);
  return (
    <div style={{ position: "absolute", inset: 0, perspective: 2600, perspectiveOrigin: "50% 45%" }}>
      <div style={{ position: "absolute", inset: 0, transformStyle: "preserve-3d", transform: `translate(${tx}px, ${ty}px) scale(${s}) rotateX(${rx + Math.sin(u * 0.9) * 0.8}deg) rotateY(${ry + Math.sin(u * 1.3) * 1.6}deg)` }}>{children}</div>
    </div>
  );
};

const Titulo: React.FC<{ top?: number; size?: number; children: React.ReactNode }> = ({ top = 120, size = 62, children }) => (
  <div style={{ position: "absolute", left: 0, right: 0, top, textAlign: "center", fontFamily: SERIF, fontSize: size, letterSpacing: 3, color: C.offwhite, lineHeight: 1.08 }}>{children}</div>
);

// ---------- navegador (o site do computador, 1440x900 css, em janela) ----------
// desk.jpg é a captura 2x da home do site (2880 de largura). "pagina" fica na camada que rola (px da página); "vista" fica fixa (px da janela do navegador).
const K = 1000 / 1440;
const NAV = { left: 40, top: 650, w: 1000, vh: 625, chrome: 78 };
const stage = (vx: number, vy: number): [number, number] => [NAV.left + vx * K, NAV.top + NAV.chrome + vy * K];
const Navegador: React.FC<{ scroll: number; load?: number; pagina?: React.ReactNode; vista?: React.ReactNode }> = ({ scroll, load = 0, pagina, vista }) => (
  <div style={{ position: "absolute", left: NAV.left, top: NAV.top, width: NAV.w, height: NAV.chrome + NAV.vh, borderRadius: 26, overflow: "hidden", background: "#1c1a1e", border: `1.5px solid ${C.borda}`, boxShadow: "0 60px 120px rgba(0,0,0,.6), 0 0 0 1px rgba(0,0,0,.4)" }}>
    <div style={{ height: NAV.chrome, background: "#2b282d", display: "flex", alignItems: "center", padding: "0 26px", gap: 14, position: "relative" }}>
      {["#ff5f57", "#febc2e", "#28c840"].map((c) => <span key={c} style={{ width: 16, height: 16, borderRadius: 16, background: c, opacity: 0.85 }} />)}
      <div style={{ marginLeft: 26, flex: 1, height: 44, borderRadius: 22, background: "#1c1a1e", display: "flex", alignItems: "center", padding: "0 22px", gap: 12, fontFamily: SANS, fontSize: 22, fontWeight: 500, color: C.offwhite, letterSpacing: 0.5 }}>
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke={C.rosa} strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round"><rect x="5" y="11" width="14" height="9" rx="2" /><path d="M8 11V8a4 4 0 0 1 8 0v3" /></svg>
        useaza.com.br
      </div>
      <div style={{ position: "absolute", left: 0, bottom: 0, height: 4, width: `${load * 100}%`, background: C.rosa, boxShadow: `0 0 14px ${C.rosa}`, opacity: load > 0 && load < 1 ? 1 : 0 }} />
    </div>
    <div style={{ position: "relative", width: NAV.w, height: NAV.vh, overflow: "hidden", background: "#f6f4f0" }}>
      <div style={{ position: "absolute", left: 0, top: 0, width: 1440, height: 4700, transformOrigin: "0 0", transform: `translateY(${-scroll * K}px) scale(${K})` }}>
        <Img src={staticFile("site/desk.jpg")} style={{ width: 1440, height: 4700, display: "block" }} />
        {pagina}
      </div>
      <div style={{ position: "absolute", left: 0, top: 0, width: 1440, height: 900, transformOrigin: "0 0", transform: `scale(${K})` }}>{vista}</div>
    </div>
  </div>
);
const caminho = (u: number, pts: [number, number, number][]) => [keys(u, pts.map((p) => [p[0], p[1]] as [number, number])), keys(u, pts.map((p) => [p[0], p[2]] as [number, number]))];

// ---------- CENA 2: o site no navegador, passa o mouse, clica no botão e rola ----------
const CenaSite: React.FC<{ u: number }> = ({ u }) => {
  const ent = pr(u, 0, 0.8, expoOut);
  const s = keys(u, [[0, 0.8], [0.8, 1.0], [1.6, 1.75], [2.8, 1.75], [3.4, 1.4], [5.8, 1.3]]);
  const ry = keys(u, [[0, -34], [0.9, -8], [1.8, -3], [5.8, -7]]), rx = keys(u, [[0, 10], [1.8, 3], [5.8, 5]]);
  const [cbx, cby] = stage(128, 673);
  const px = keys(u, [[1.6, cbx], [3.4, 540]]), py = keys(u, [[1.6, cby], [3.4, 1040]]), f = keys(u, [[0.8, 0], [1.6, 0.9], [3.4, 0.5]]);
  const [cx, cy] = caminho(u, [[0.5, 1420, 160], [1.2, 703, 62], [1.8, 703, 62], [2.4, 150, 690]]);
  const click = pr(u, 2.5, 0.2, suave) * (1 - pr(u, 2.75, 0.25, suave));
  const rola = keys(u, [[2.9, 0], [5.3, 1000]], curvaTraco);
  return (
    <>
      <Camera s={s} rx={rx} ry={ry} u={u} px={px} py={py} f={f} alvo={[540, 1130]}>
        <div style={{ opacity: ent, transform: `translateX(${(1 - ent) * 260}px)` }}>
          <Navegador scroll={rola} load={clamp((u - 2.6) / 0.8)}
            vista={<>
              <div style={{ position: "absolute", left: 665, top: 74, width: 80 * pr(u, 1.3, 0.4, expoOut), height: 3, background: C.rosa, boxShadow: `0 0 12px ${C.rosa}` }} />
              <Cursor x={cx} y={cy} s={1.35} />
              <Clique x={cx + 8} y={cy + 10} u={u} ini={2.5} r={90} />
            </>}
            pagina={<div style={{ position: "absolute", left: 6, top: 642, width: 244, height: 62, borderRadius: 3, boxShadow: `0 0 0 5px ${C.rosa}, 0 0 ${50 + click * 50}px ${C.rosa}`, opacity: pr(u, 2.1, 0.3) * (1 - pr(u, 3.0, 0.3)) }} />}
          />
        </div>
      </Camera>
      <Titulo top={170} size={78}><Palavra u={u} ini={0.15} saiEm={1.4}>O novo site</Palavra><Palavra u={u} ini={0.4} rosa saiEm={1.4}>da AZA</Palavra></Titulo>
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
  const py = keys(u, [[0, 700], [2.2, 1000], [4.6, 1400]]), s = keys(u, [[0, 1.12], [3, 1.0], [4.8, 0.92]]);
  const ry = keys(u, [[0, 16], [2.4, 4], [4.8, -10]]), rx = keys(u, [[0, 10], [4.8, 4]]);
  return (
    <>
      <Camera s={s} rx={rx} ry={ry} u={u} px={540} py={py} f={1} alvo={[540, 960]}>
        <Fio d="M500 650 C 540 650 520 560 570 560" p={pr(u, 0.5, 0.5, suave)} t={u} />
        <Fio d="M780 890 C 780 980 760 1000 760 1080" p={pr(u, 1.1, 0.5, suave)} t={u} />
        <Fio d="M540 1400 C 400 1400 420 1260 300 1260" p={pr(u, 1.8, 0.5, suave)} t={u} />
        <Fio d="M300 1770 C 300 1850 420 1850 520 1900" p={pr(u, 2.5, 0.5, suave)} t={u} />
        {CARDS.map((c, i) => {
          const p = pr(u, 0.05 + i * 0.3, 0.7, expoOut);
          return (
            <div key={c.f} style={{ opacity: p, transform: `translateY(${(1 - p) * 260}px) scale(${0.9 + p * 0.1})` }}>
              <Janela titulo={c.t} w={c.w} h={c.h} style={{ left: c.x, top: c.y, transform: `translateZ(${c.z}px) rotateZ(${c.rz}deg)` }}>
                <Img src={staticFile(`fotos/${c.f}.jpg`)} style={{ width: "100%", height: "100%", objectFit: "cover", objectPosition: "50% 20%" }} />
              </Janela>
            </div>
          );
        })}
      </Camera>
      <Titulo top={110} size={62}><Palavra u={u} ini={0.1} saiEm={1.9}>Uma peça,</Palavra><Palavra u={u} ini={0.35} rosa saiEm={1.9}>inúmeras possibilidades</Palavra></Titulo>
    </>
  );
};

// ---------- CENA 4: texto cinético (as duas promessas do site) ----------
const CenaTexto: React.FC<{ u: number }> = ({ u }) => {
  const k = 2.2;
  const al = 1 - pr(u, k - 0.3, 0.3, suave), ar = pr(u, k - 0.1, 0.3, suave);
  return (
    <>
      <Fio d="M-60 760 C 40 760 70 900 120 1010" p={pr(u, 0.1, 0.7, suave) * al} t={u} />
      <Fio d="M1140 1250 C 1040 1250 1010 1120 960 1010" p={pr(u, 0.25, 0.7, suave) * al} t={u} />
      <Fio d="M-60 1250 C 80 1250 140 1100 200 950" p={pr(u, k - 0.1, 0.7, suave) * ar} t={u} />
      <Fio d="M1140 700 C 1000 700 940 840 880 950" p={pr(u, k, 0.7, suave) * ar} t={u} />
      <div style={{ position: "absolute", left: 40, right: 40, top: 880, textAlign: "center", fontFamily: SERIF, fontSize: 112, lineHeight: 1.05, opacity: al }}>
        <div><Palavra u={u} ini={0.15} saiEm={k - 0.3}>Valoriza</Palavra></div>
        <div><Palavra u={u} ini={0.4} rosa saiEm={k - 0.3}>sua silhueta</Palavra></div>
      </div>
      <div style={{ position: "absolute", left: 40, right: 40, top: 880, textAlign: "center", fontFamily: SERIF, fontSize: 112, lineHeight: 1.05 }}>
        <div><Palavra u={u - k} ini={-0.15}>Feito</Palavra><Palavra u={u - k} ini={0.0}>para</Palavra></div>
        <div><Palavra u={u - k} ini={0.2} rosa>durar</Palavra></div>
      </div>
      <div style={{ position: "absolute", left: 340, width: 400 * pr(u, k + 0.8, 0.5, expoOut), top: 1170, height: 4, background: C.rosa, boxShadow: `0 0 24px ${C.rosa}`, opacity: ar }} />
    </>
  );
};

// ---------- CENA 5: no site, escolhe o tamanho M do Top Nula Manga Rosa e põe na sacola ----------
// medidas em px css da página (1440 de largura): cartão 4 em x 1086..1428, y 1104..1617; tamanho M em (1256,1576); preço em (1257,1666)
const SCROLL5 = 1000;
const CenaCompra: React.FC<{ u: number }> = ({ u }) => {
  const [mx, my] = stage(1256, 1576 - SCROLL5);
  const s = keys(u, [[0, 0.9], [0.9, 1.0], [1.7, 2.1], [4.3, 2.1], [5.5, 1.25]]);
  const ry = keys(u, [[0, -10], [1.7, 0], [4.3, 0], [5.5, -6]]), rx = keys(u, [[0, 6], [1.7, 0], [4.3, 0], [5.5, 4]]);
  const f = keys(u, [[0, 0], [0.9, 0.15], [1.7, 1], [4.3, 1], [5.5, 0.3]]);
  const [cx, cy] = caminho(u, [[0.4, 560, 260], [1.6, 1250, 548]]);
  const click = pr(u, 2.2, 0.2, suave) * (1 - pr(u, 2.45, 0.25, suave)), sel = pr(u, 2.25, 0.2);
  const sac = pr(u, 2.7, 0.6, volta);
  const { tx, ty } = camT(s, f, mx, my, [470, 1100]);
  const sx = 540 + s * (mx - 540) + tx, sy = 960 + s * (my - 960) + ty;
  return (
    <>
      <Camera s={s} rx={rx} ry={ry} u={u} px={mx} py={my} f={f} alvo={[470, 1100]}>
        <Navegador scroll={SCROLL5}
          vista={<>
            <div style={{ position: "absolute", left: 1210, top: 556, width: 92, height: 42, borderRadius: 3, boxShadow: `0 0 0 4px ${C.rosa}, 0 0 ${34 + click * 40}px ${C.rosa}`, background: `hsl(332 82% 68% / ${sel * 0.85})`, opacity: pr(u, 1.5, 0.3) }} />
            <div style={{ position: "absolute", left: 1210, top: 556, width: 92, height: 42, display: "grid", placeItems: "center", fontFamily: SANS, fontSize: 24, fontWeight: 600, color: sel > 0.5 ? "#fff" : "transparent" }}>M</div>
            <div style={{ position: "absolute", left: 1195, top: 677, width: 124 * pr(u, 3.0, 0.5, expoOut), height: 4, background: C.rosa, boxShadow: `0 0 16px ${C.rosa}` }} />
            <Cursor x={cx} y={cy} s={1.35} />
            <Clique x={cx + 8} y={cy + 10} u={u} ini={2.2} r={80} />
          </>}
        />
      </Camera>
      <Fio d={`M${sx} ${sy} C ${sx + 160} ${sy - 300} 960 560 930 250`} p={pr(u, 2.5, 0.6, suave)} t={u} />
      <div style={{ position: "absolute", right: 60, top: 150, width: 120, height: 120, borderRadius: 120, background: `linear-gradient(135deg, ${C.rosa}, ${C.rosaEsc})`, display: "grid", placeItems: "center", opacity: sac, transform: `scale(${0.4 + sac * 0.6})`, boxShadow: `0 0 ${30 + sac * 30}px ${C.rosa}` }}>
        <svg width="62" height="62" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M6 8h12l1 12H5L6 8Z" /><path d="M9 8V6a3 3 0 0 1 6 0v2" /></svg>
      </div>
      <Titulo top={150} size={70}><Palavra u={u} ini={0.1} saiEm={1.3}>Feito para o</Palavra><Palavra u={u} ini={0.3} rosa saiEm={1.3}>seu momento</Palavra></Titulo>
    </>
  );
};

// ---------- CENA 6: a câmera recua, o site e as fotos juntos ----------
const FOTOS6 = [["640", 50, 150, -5], ["351", 690, 190, 4], ["1033", 70, 1470, 3], ["428", 700, 1500, -4]] as const;
const CenaRecuo: React.FC<{ u: number }> = ({ u }) => {
  const s = keys(u, [[0, 1.7], [2.6, 1.0]], expoOut), ry = keys(u, [[0, -6], [4, 8]]);
  const alf = pr(u, 0.6, 0.7);
  return (
    <>
      <Camera s={s} rx={5} ry={ry} u={u} px={540} py={1000} f={keys(u, [[0, 1], [2.6, 0.2]])} alvo={[540, 960]}>
        <Navegador scroll={1830} />
        <div style={{ opacity: alf, transform: `translateY(${(1 - alf) * 120}px)` }}>
          {FOTOS6.map(([f, x, y, r]) => (
            <Janela key={f} titulo="AZA" w={300} h={410} style={{ left: x, top: y, transform: `translateZ(-60px) rotateZ(${r}deg)` }}>
              <Img src={staticFile(`fotos/${f}.jpg`)} style={{ width: "100%", height: "100%", objectFit: "cover", objectPosition: "50% 20%" }} />
            </Janela>
          ))}
        </div>
      </Camera>
      <div style={{ position: "absolute", left: 0, right: 0, top: 1385, textAlign: "center", fontFamily: SERIF, fontSize: 66, color: C.offwhite, opacity: pr(u, 0.9, 0.5) }}>Siga <span style={{ color: C.rosa, fontStyle: "italic" }}>@useazabr</span></div>
    </>
  );
};

// ---------- CENA 7: assinatura final ----------
const CenaFinal: React.FC<{ u: number }> = ({ u }) => {
  const a = pr(u, 0, 0.5), sc = mix(0.94, 1, expoOut(clamp(u / 1.0)));
  return (
    <>
      <svg width={W} height={H} style={{ position: "absolute", inset: 0, overflow: "visible", opacity: a }}>
        <Tracejado d={`M-80 1180 C 260 1180 380 1010 540 1010 S 820 700 1160 700`} largura={5} off={-(CENAS.final.a + u) * 230} />
        <Tracejado d={`M-80 1330 C 300 1330 420 1160 600 1130 S 880 880 1160 860`} largura={3} dash="22 24" off={-(CENAS.final.a + u) * 300} op={0.55} />
      </svg>
      <div style={{ position: "absolute", left: (W - W * 0.57) / 2, top: 780, opacity: a, transform: `scale(${sc})`, filter: `drop-shadow(0 0 ${6 + a * 8}px hsl(332 82% 62% / .45))` }}><Logo w={W * 0.57} /></div>
      <div style={{ position: "absolute", left: 0, right: 0, top: 1420, textAlign: "center", fontFamily: SERIF, fontSize: 40, letterSpacing: 8, color: C.dim, opacity: pr(u, 0.2, 0.5) }}>MOVIMENTO QUE VESTE PRESENÇA</div>
      <div style={{ position: "absolute", left: 0, right: 0, top: 1560, textAlign: "center", fontFamily: SANS, fontWeight: 500, fontSize: 44, letterSpacing: 9, color: C.rosa, opacity: pr(u, 0.4, 0.5) }}>USEAZA.COM.BR</div>
    </>
  );
};

export const Reel: React.FC<{ t: number }> = ({ t }) => {
  const k = CENAS;
  const brilho = keys(t, [[0, 0.8], [12.2, 0.8], [14, 1.25], [16.3, 0.85], [25.7, 1.1]]);
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
    </AbsoluteFill>
  );
};
