// Reel v2: abertura com zoom e logo, digitação do endereço, tour pelo site, promessas com movimento, compra real com carrinho, dispositivos e assinatura.
// Uma única implementação para os dois formatos: o objeto Fmt traz a geometria de cada um (vertical 1080x1920 e horizontal 1920x1080).
import React from "react";
import { AbsoluteFill, Img, staticFile } from "remotion";
import { C, SANS, SERIF, clamp, expoOut, keys, mix, pr, suave } from "./tokens";
import { CENAS2 } from "./roteiro2";
import { Cursor, Fundo, Janela, Logo, LogoEscrita, Tracejado, curvaTraco } from "./Cenas";
import { Camera, Clique, Fio, GEO_H, GEO_V, Geo, Titulo, caminho, stage } from "./Reel";

const rnd = (i: number) => { const x = Math.sin(i * 127.1 + 311.7) * 43758.5453; return x - Math.floor(x); };
type P2 = [number, number];
export type Fmt = {
  W: number; H: number; c: P2; g: Geo;
  logo: { w: number; left: number; top: number }; tag: { top: number; size: number }; url: { top: number; size: number }; d1: string; d2: string;
  title: { top: number; size: number };
  z: { search: number; cta: number; ctaFim: number; card: number; drawer: number; chk: number };
  alvo: P2; alvoCta: P2; alvoC: { card: P2; drawer: P2; chk: P2 };
  frase: { top: number; size: number; d: [string, string, string, string]; ul: { left: number; w: number; top: number } };
  cards: { items: { t: string; f: string; x: number; y: number; w: number; h: number; rz: number; z: number }[]; fios: string[]; cam: { px: [number, number][]; py: [number, number][]; s: [number, number][]; ry: [number, number][]; rx: [number, number][] }; title: { top: number; size: number } };
  dev: { g: Geo; phone: { x: number; y: number; w: number; h: number } };
};

// ---------- transição: a cena atual avança (zoom in) e a próxima recua até o lugar (zoom out) ----------
const T = 0.4;
const Cena2: React.FC<{ t: number; a: number; b: number; children: (u: number) => React.ReactNode }> = ({ t, a, b, children }) => {
  if (t < a || t > b) return null;
  const ent = clamp((t - a) / T), sai = clamp((b - t) / T);
  const o = Math.min(ent, sai), sc = mix(1.22, 1, expoOut(ent)) * mix(1, 1.22, Math.pow(1 - sai, 2)), bl = (1 - o) * 16;
  return <AbsoluteFill style={{ opacity: o, transform: `scale(${sc})`, filter: bl > 0.2 ? `blur(${bl}px)` : undefined }}>{children(t - a)}</AbsoluteFill>;
};

const Letras: React.FC<{ u: number; ini: number; children: string; rosa?: boolean }> = ({ u, ini, children, rosa }) => (
  <span style={{ display: "inline-block", whiteSpace: "nowrap", marginRight: "0.28em", perspective: 600 }}>
    {[...children].map((ch, i) => {
      const p = pr(u, ini + i * 0.032, 0.45);
      return <span key={i} style={{ display: "inline-block", opacity: p, transform: `translateY(${(1 - p) * 60}px) rotateX(${(1 - p) * -80}deg)`, transformOrigin: "50% 100%", filter: `blur(${(1 - p) * 8}px)`, color: rosa ? C.rosa : C.offwhite, fontStyle: rosa ? "italic" : "normal" }}>{ch === " " ? " " : ch}</span>;
    })}
  </span>
);

// ---------- navegador: janela com barra de endereço; o conteúdo usa coordenadas da janela (1440x900 css) ----------
const Nav2: React.FC<{ g: Geo; url?: string; load?: number; children: React.ReactNode }> = ({ g, url, load = 0, children }) => {
  const w = 1440 * g.k;
  return (
    <div style={{ position: "absolute", left: g.left, top: g.top, width: w, height: g.chrome + g.vh, borderRadius: 26, overflow: "hidden", background: "#1c1a1e", border: `1.5px solid ${C.borda}`, boxShadow: "0 60px 120px rgba(0,0,0,.6), 0 0 0 1px rgba(0,0,0,.4)" }}>
      <div style={{ height: g.chrome, background: "#2b282d", display: "flex", alignItems: "center", padding: "0 26px", gap: 14, position: "relative" }}>
        {["#ff5f57", "#febc2e", "#28c840"].map((c) => <span key={c} style={{ width: 16, height: 16, borderRadius: 16, background: c, opacity: 0.85 }} />)}
        <div style={{ marginLeft: 26, flex: 1, height: 44, borderRadius: 22, background: "#1c1a1e", display: "flex", alignItems: "center", padding: "0 22px", gap: 12, fontFamily: SANS, fontSize: 22, fontWeight: 500, color: url ? C.offwhite : C.dim, letterSpacing: 0.5 }}>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke={C.rosa} strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round"><rect x="5" y="11" width="14" height="9" rx="2" /><path d="M8 11V8a4 4 0 0 1 8 0v3" /></svg>
          {url ?? "Pesquisar ou digitar endereço"}
        </div>
        <div style={{ position: "absolute", left: 0, bottom: 0, height: 4, width: `${load * 100}%`, background: C.rosa, boxShadow: `0 0 14px ${C.rosa}`, opacity: load > 0 && load < 1 ? 1 : 0 }} />
      </div>
      <div style={{ position: "relative", width: w, height: g.vh, overflow: "hidden", background: "#f6f4f0" }}>
        <div style={{ position: "absolute", left: 0, top: 0, width: 1440, height: 900, transformOrigin: "0 0", transform: `scale(${g.k})` }}>{children}</div>
      </div>
    </div>
  );
};
const Pagina: React.FC<{ scroll: number; children?: React.ReactNode }> = ({ scroll, children }) => (
  <div style={{ position: "absolute", left: 0, top: 0, width: 1440, height: 4700, transform: `translateY(${-scroll}px)` }}>
    <Img src={staticFile("site/desk.jpg")} style={{ width: 1440, height: 4700, display: "block" }} />{children}
  </div>
);
const Vista: React.FC<{ src: string; o?: number }> = ({ src, o = 1 }) => <Img src={staticFile(`site/${src}.jpg`)} style={{ position: "absolute", left: 0, top: 0, width: 1440, height: 900, opacity: o }} />;

// ---------- nova aba: alguém digita o endereço ----------
const ENDERECO = "useaza.com.br";
const tChar = (i: number) => 0.5 + i * 0.095 + rnd(i) * 0.06;
const Lupa: React.FC<{ s?: number }> = ({ s = 30 }) => <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke="#6c6870" strokeWidth="2.2" strokeLinecap="round"><circle cx="11" cy="11" r="6.5" /><path d="m20 20-4.2-4.2" /></svg>;
const NovaAba: React.FC<{ u: number }> = ({ u }) => {
  const n = [...ENDERECO].filter((_, i) => u >= tChar(i)).length, texto = ENDERECO.slice(0, n);
  const pisca = Math.floor(u * 2.2) % 2 === 0, sug = pr(u, tChar(3), 0.25), enter = pr(u, 2.05, 0.25, expoOut) * (1 - pr(u, 2.5, 0.2));
  return (
    <div style={{ position: "absolute", inset: 0, background: "#f6f4f0" }}>
      <div style={{ position: "absolute", left: 370, top: 330, width: 700, height: 68, borderRadius: 34, background: "#fff", boxShadow: "0 10px 40px rgba(0,0,0,.12)", display: "flex", alignItems: "center", padding: "0 28px", gap: 18, fontFamily: SANS, fontSize: 29, color: "#1c1a1e" }}>
        <Lupa />
        <span>{texto}</span><span style={{ width: 2.5, height: 36, background: C.rosa, opacity: pisca ? 1 : 0, marginLeft: -12 }} />
        {n === 0 && <span style={{ color: "#a9a5ab", marginLeft: -8 }}>Pesquise ou digite um endereço</span>}
        <div style={{ marginLeft: "auto", padding: "6px 16px", borderRadius: 12, background: C.rosa, color: "#fff", fontSize: 20, fontWeight: 600, opacity: enter, transform: `scale(${0.7 + enter * 0.3})` }}>Enter ↵</div>
      </div>
      <div style={{ position: "absolute", left: 370, top: 410, width: 700, borderRadius: 26, background: "#fff", boxShadow: "0 16px 50px rgba(0,0,0,.12)", opacity: sug, transform: `translateY(${(1 - sug) * -12}px)`, overflow: "hidden", fontFamily: SANS, fontSize: 24, color: "#1c1a1e" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 18, padding: "20px 28px", background: "#f8eef3", borderLeft: `5px solid ${C.rosa}` }}>
          <svg width="30" height="30" viewBox="0 0 24 24" fill="none" stroke={C.rosa} strokeWidth="2" strokeLinecap="round"><circle cx="12" cy="12" r="9" /><path d="M3 12h18M12 3c3 3 3 15 0 18M12 3c-3 3-3 15 0 18" /></svg>
          <span><b>useaza.com.br</b> <span style={{ color: "#8a858c" }}>· AZA | Moda Fitness</span></span>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 18, padding: "20px 28px", color: "#6c6870" }}><Lupa s={30} />useaza moda fitness</div>
      </div>
    </div>
  );
};

// ---------- 1. abertura: zoom até a logo se escrevendo ----------
const CenaLogo: React.FC<{ t: number; F: Fmt; fim?: boolean }> = ({ t, F, fim }) => {
  const push = fim ? mix(0.94, 1, expoOut(clamp(t / 1.0))) : mix(0.55, 1, expoOut(clamp(t / 1.2)));
  const p = fim ? 1 : curvaTraco(clamp((t - 0.05) / 1.2)), off = -(fim ? CENAS2.final.a + t : t) * 230, a = fim ? pr(t, 0, 0.5) : pr(t, 0.05, 0.4);
  const t0 = fim ? 0.2 : 1.2;
  return (
    <AbsoluteFill style={{ transform: `scale(${fim ? 1 : push})`, opacity: fim ? 1 : clamp(0.35 + push) }}>
      <svg width={F.W} height={F.H} style={{ position: "absolute", inset: 0, overflow: "visible", opacity: a }}>
        <Tracejado d={F.d1} largura={5} off={off} /><Tracejado d={F.d2} largura={3} dash="22 24" off={off * 1.3} op={0.55} />
      </svg>
      <div style={{ position: "absolute", left: F.logo.left, top: F.logo.top, transform: fim ? `scale(${push})` : undefined, opacity: fim ? a : 1 }}>
        {fim ? <div style={{ filter: "drop-shadow(0 0 10px hsl(332 82% 62% / .45))" }}><Logo w={F.logo.w} /></div> : <LogoEscrita w={F.logo.w} p={p} />}
      </div>
      <div style={{ position: "absolute", left: 0, right: 0, top: F.tag.top, textAlign: "center", fontFamily: SERIF, fontSize: F.tag.size, letterSpacing: mix(14, 8, expoOut(clamp((t - t0) / 0.6))), color: C.dim, opacity: pr(t, t0, 0.5), filter: `blur(${(1 - pr(t, t0, 0.5)) * 8}px)` }}>MOVIMENTO QUE VESTE PRESENÇA</div>
      <div style={{ position: "absolute", left: 0, right: 0, top: F.url.top, textAlign: "center", fontFamily: SANS, fontWeight: 500, fontSize: F.url.size, letterSpacing: 9, color: C.rosa, opacity: pr(t, t0 + 0.3, 0.4) }}>USEAZA.COM.BR</div>
    </AbsoluteFill>
  );
};

// ---------- 2. digita o endereço, o site abre, passa o mouse, clica no botão e rola ----------
const CenaSite: React.FC<{ u: number; F: Fmt }> = ({ u, F }) => {
  const { g, c } = F, [sx, sy] = stage(g, 720, 364), [bx, by] = stage(g, 128, 673);
  const mostra = pr(u, 2.9, 0.4, suave), digitou = u > 2.15;
  const s = keys(u, [[0, F.z.search], [2.2, F.z.search], [3.6, 0.95], [5.0, 0.98], [5.8, F.z.cta], [7.4, F.z.cta], [8.6, 1.3], [10.3, F.z.ctaFim]]);
  const px = keys(u, [[0, sx], [2.2, sx], [3.6, c[0]], [5.0, bx], [7.4, bx], [8.6, c[0]]]), py = keys(u, [[0, sy], [2.2, sy], [3.6, c[1]], [5.0, by], [7.4, by], [8.6, c[1]]]);
  const f = keys(u, [[0, 1], [2.2, 1], [3.6, 0], [5.0, 0], [5.8, 0.9], [7.4, 0.9], [8.6, 0.4], [10.3, 0.4]]);
  const ry = keys(u, [[0, 0], [2.2, -2], [3.6, -9], [5.8, -3], [8.6, -6]]), rx = keys(u, [[0, 0], [3.6, 5], [5.8, 2], [8.6, 4]]);
  const [cx, cy] = caminho(u, [[3.7, 1380, 140], [4.5, 703, 62], [5.1, 703, 62], [5.9, 150, 690]]);
  const click = pr(u, 6.0, 0.2, suave) * (1 - pr(u, 6.25, 0.25, suave)), rola = keys(u, [[6.4, 0], [9.2, 1000]], curvaTraco);
  const load = digita(u);
  return (
    <>
      <Camera s={s} rx={rx} ry={ry} u={u} px={px} py={py} f={f} alvo={mix2(F.c, F.alvo, clamp((u - 4.8) / 1.0)) as P2} c={c}>
        <Nav2 g={g} url={digitou ? ENDERECO : undefined} load={load}>
          <div style={{ position: "absolute", inset: 0, opacity: 1 - mostra }}><NovaAba u={u} /></div>
          <div style={{ position: "absolute", inset: 0, opacity: mostra }}>
            <Pagina scroll={rola}>
              <div style={{ position: "absolute", left: 6, top: 642, width: 244, height: 62, borderRadius: 3, boxShadow: `0 0 0 5px ${C.rosa}, 0 0 ${50 + click * 50}px ${C.rosa}`, opacity: pr(u, 5.4, 0.3) * (1 - pr(u, 6.9, 0.3)) }} />
            </Pagina>
            <div style={{ position: "absolute", left: 665, top: 74, width: 80 * pr(u, 4.5, 0.4, expoOut), height: 3, background: C.rosa, boxShadow: `0 0 12px ${C.rosa}`, opacity: 1 - pr(u, 6.4, 0.2) }} />
            <Cursor x={cx} y={cy} s={g.k < 0.8 ? 1.35 : 1.0} />
            <Clique x={cx + 8} y={cy + 10} u={u} ini={6.0} r={g.k < 0.8 ? 90 : 70} />
          </div>
        </Nav2>
      </Camera>
      <Titulo top={F.title.top} size={F.title.size}><Pal u={u} ini={3.8} sai={5.3}>O novo site</Pal><Pal u={u} ini={4.0} sai={5.3} rosa>da AZA</Pal></Titulo>
    </>
  );
};
const digita = (u: number) => clamp((u - 2.15) / 0.7) * (1 - clamp((u - 2.9) / 0.05)) + clamp((u - 6.0) / 0.8) * (1 - clamp((u - 6.8) / 0.05));
const mix2 = (a: P2, b: P2, p: number): P2 => [mix(a[0], b[0], p), mix(a[1], b[1], p)];
const Pal: React.FC<{ u: number; ini: number; sai: number; rosa?: boolean; children: React.ReactNode }> = ({ u, ini, sai, rosa, children }) => {
  const p = pr(u, ini, 0.5), q = pr(u, sai, 0.3, suave);
  return <span style={{ display: "inline-block", opacity: p * (1 - q), transform: `translateY(${(1 - p) * 46 - q * 20}px)`, filter: `blur(${(1 - p) * 10 + q * 8}px)`, color: rosa ? C.rosa : C.offwhite, fontStyle: rosa ? "italic" : "normal", marginRight: "0.28em" }}>{children}</span>;
};

// ---------- 3. as promessas do site, em movimento ----------
const CenaProm: React.FC<{ u: number; F: Fmt }> = ({ u, F }) => {
  const k = 2.6, al = 1 - pr(u, k - 0.35, 0.35, suave), ar = pr(u, k - 0.15, 0.35, suave);
  const [cx, cy] = F.c, ring = (i: number, off: number) => { const ph = (u * 0.65 + i / 3 + off) % 1; return <circle key={i} cx={cx} cy={cy + (F.W > F.H ? 10 : 60)} r={90 + ph * (F.W > F.H ? 520 : 600)} fill="none" stroke={C.rosa} strokeWidth={3} opacity={(1 - ph) * 0.45} />; };
  const sway = Math.sin(u * 1.4) * 4;
  const caixa: React.CSSProperties = { position: "absolute", left: 40, right: 40, top: F.frase.top, textAlign: "center", fontFamily: SERIF, fontSize: F.frase.size, lineHeight: 1.05, transform: `rotateY(${sway}deg)`, perspective: 900 };
  return (
    <>
      <div style={{ position: "absolute", inset: "-12%", opacity: 0.55, filter: "blur(24px) brightness(.55) saturate(1.3)", transform: `scale(${1.05 + u * 0.025}) translateX(${Math.sin(u * 0.7) * 30}px)` }}>
        <Img src={staticFile("fotos/385.jpg")} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
      </div>
      <svg width={F.W} height={F.H} style={{ position: "absolute", inset: 0, overflow: "visible" }}>{[0, 1, 2].map((i) => ring(i, 0))}</svg>
      <Fio d={F.frase.d[0]} p={pr(u, 0.1, 0.7, suave) * al} t={u} /><Fio d={F.frase.d[1]} p={pr(u, 0.25, 0.7, suave) * al} t={u} />
      <Fio d={F.frase.d[2]} p={pr(u, k - 0.1, 0.7, suave) * ar} t={u} /><Fio d={F.frase.d[3]} p={pr(u, k, 0.7, suave) * ar} t={u} />
      <div style={{ ...caixa, opacity: al, filter: `blur(${(1 - al) * 10}px)` }}>
        <div><Letras u={u} ini={0.15}>Valoriza</Letras></div><div><Letras u={u} ini={0.55} rosa>sua silhueta</Letras></div>
      </div>
      <div style={{ ...caixa, opacity: ar }}>
        <div><Letras u={u - k} ini={-0.1}>Feito</Letras><Letras u={u - k} ini={0.15}>para</Letras></div><div><Letras u={u - k} ini={0.5} rosa>durar</Letras></div>
      </div>
      <div style={{ position: "absolute", left: F.frase.ul.left, width: F.frase.ul.w * pr(u, k + 1.0, 0.6, expoOut), top: F.frase.ul.top, height: 4, background: C.rosa, boxShadow: `0 0 24px ${C.rosa}`, opacity: ar }} />
    </>
  );
};

// ---------- 4. cards de produto (fotos do ensaio) ----------
const CenaCards: React.FC<{ u: number; F: Fmt }> = ({ u, F }) => {
  const k = F.cards.cam;
  return (
    <>
      <Camera s={keys(u, k.s)} rx={keys(u, k.rx)} ry={keys(u, k.ry)} u={u} px={keys(u, k.px)} py={keys(u, k.py)} f={1} alvo={F.c} c={F.c}>
        {F.cards.fios.map((d, i) => <Fio key={i} d={d} p={pr(u, 0.5 + i * 0.65, 0.5, suave)} t={u} />)}
        {F.cards.items.map((cd, i) => {
          const p = pr(u, 0.05 + i * 0.3, 0.7, expoOut);
          return (
            <div key={cd.f} style={{ opacity: p, transform: `translateY(${(1 - p) * 240}px) scale(${0.9 + p * 0.1})` }}>
              <Janela titulo={cd.t} w={cd.w} h={cd.h} style={{ left: cd.x, top: cd.y, transform: `translateZ(${cd.z}px) rotateZ(${cd.rz}deg)` }}>
                <Img src={staticFile(`fotos/${cd.f}.jpg`)} style={{ width: "100%", height: "100%", objectFit: "cover", objectPosition: "50% 20%" }} />
              </Janela>
            </div>
          );
        })}
      </Camera>
      <Titulo top={F.cards.title.top} size={F.cards.title.size}><Pal u={u} ini={0.1} sai={1.9}>Uma peça,</Pal><Pal u={u} ini={0.35} sai={1.9} rosa>inúmeras possibilidades</Pal></Titulo>
    </>
  );
};

// ---------- 5. compra de verdade: tamanho M, gaveta do carrinho e finalizar ----------
// coordenadas na janela (1440x900): cartão 4 em (1086..1428, 104..617); tamanho M em (1256,576); gaveta de 940 a 1440; FINALIZAR em (988,527,194,64); resumo do pedido em (810..1210, 140..400)
const CenaCompra: React.FC<{ u: number; F: Fmt }> = ({ u, F }) => {
  const { g, c } = F, st = (x: number, y: number) => stage(g, x, y);
  const hov = pr(u, 1.4, 0.3, suave), hovM = pr(u, 2.3, 0.2, suave), dim = pr(u, 2.9, 0.5, suave), slide = pr(u, 2.85, 0.75, expoOut), chk = pr(u, 5.4, 0.45, suave);
  const [m1x, m1y] = st(1256, 470), [m2x, m2y] = st(1090, 440), [m3x, m3y] = st(1010, 270);
  const s = keys(u, [[0, 0.9], [0.9, 1.0], [1.6, F.z.card], [2.7, F.z.card], [3.4, F.z.drawer], [5.2, F.z.drawer], [5.9, F.z.chk], [7.8, F.z.chk], [8.8, 1.1]]);
  const px = keys(u, [[0, m1x], [2.7, m1x], [3.4, m2x], [5.2, m2x], [5.9, m3x], [8.8, m3x]]), py = keys(u, [[0, m1y], [2.7, m1y], [3.4, m2y], [5.2, m2y], [5.9, m3y], [8.8, m3y]]);
  const f = keys(u, [[0, 0], [0.9, 0.15], [1.6, 1], [8.0, 1], [8.8, 0.3]]);
  const ry = keys(u, [[0, -8], [1.6, 0], [8.0, 0], [8.8, -5]]), rx = keys(u, [[0, 5], [1.6, 0], [8.0, 0], [8.8, 3]]);
  const [cx, cy] = caminho(u, [[0.6, 520, 260], [1.4, 1256, 300], [1.9, 1256, 300], [2.4, 1256, 576], [3.3, 1256, 576], [4.0, 1090, 470], [4.6, 1085, 559]]);
  const press = pr(u, 5.0, 0.12) * (1 - pr(u, 5.15, 0.15));
  const pm = (x: number, y: number, w: number, h: number, ini: number, fim: number): React.ReactNode => <div style={{ position: "absolute", left: x, top: y, width: w, height: h, borderRadius: 4, boxShadow: `0 0 0 4px ${C.rosa}, 0 0 36px ${C.rosa}`, opacity: pr(u, ini, 0.3) * (1 - pr(u, fim, 0.25)) }} />;
  return (
    <Camera s={s} rx={rx} ry={ry} u={u} px={px} py={py} f={f} alvo={[keys(u, [[0, F.alvoC.card[0]], [2.7, F.alvoC.card[0]], [3.4, F.alvoC.drawer[0]], [5.2, F.alvoC.drawer[0]], [5.9, F.alvoC.chk[0]], [8.8, F.alvoC.chk[0]]]), keys(u, [[0, F.alvoC.card[1]], [2.7, F.alvoC.card[1]], [3.4, F.alvoC.drawer[1]], [5.2, F.alvoC.drawer[1]], [5.9, F.alvoC.chk[1]], [8.8, F.alvoC.chk[1]]])] as P2} c={c}>
      <Nav2 g={g} url={ENDERECO} load={clamp((u - 5.0) / 0.5) * (1 - clamp((u - 5.5) / 0.05))}>
        <Vista src="s_idle" /><Vista src="s_hover" o={hov} /><Vista src="s_hoverM" o={hovM} />
        {pm(1210, 556, 92, 42, 1.8, 2.8)}
        <div style={{ position: "absolute", inset: 0, background: "#000", opacity: 0.5 * dim }} />
        <div style={{ position: "absolute", left: 940 + (1 - slide) * 500, top: 0, width: 500, height: 900, overflow: "hidden", boxShadow: "-20px 0 60px rgba(0,0,0,.25)" }}>
          <Img src={staticFile("site/drawer.jpg")} style={{ width: 500, height: 900 }} />
        </div>
        <div style={{ opacity: pr(u, 3.5, 0.3) * (1 - pr(u, 5.3, 0.2)) }}>{pm(982, 520, 206, 76, 0, 99)}</div>
        <div style={{ position: "absolute", left: 988, top: 527, width: 194, height: 64, background: `hsl(332 82% 68% / ${press * 0.35})` }} />
        <Vista src="s_checkout" o={chk} />
        <div style={{ opacity: pr(u, 6.1, 0.3) * (1 - pr(u, 8.2, 0.3)) }}>{pm(804, 138, 412, 82, 0, 99)}{pm(804, 368, 412, 46, 0, 99)}</div>
        <div style={{ opacity: 1 - chk }}><Cursor x={cx} y={cy} s={g.k < 0.8 ? 1.35 : 1.0} /></div>
        <Clique x={cx + 8} y={cy + 10} u={u} ini={2.6} r={g.k < 0.8 ? 80 : 60} /><Clique x={cx + 8} y={cy + 10} u={u} ini={5.0} r={g.k < 0.8 ? 80 : 60} />
      </Nav2>
    </Camera>
  );
};

// ---------- 6. o site no computador e no celular ----------
const CenaDisp: React.FC<{ u: number; F: Fmt }> = ({ u, F }) => {
  const s = keys(u, [[0, 1.4], [2.6, 1.0]], expoOut), ry = keys(u, [[0, -10], [3.9, 6]]);
  const ph = F.dev.phone, ent = pr(u, 0.5, 0.8, expoOut);
  return (
    <Camera s={s} rx={3} ry={ry} u={u} px={F.c[0]} py={F.c[1]} f={keys(u, [[0, 1], [2.6, 0.1]])} alvo={F.c} c={F.c}>
      <Nav2 g={F.dev.g} url={ENDERECO}><Pagina scroll={0} /></Nav2>
      <div style={{ position: "absolute", left: ph.x, top: ph.y, width: ph.w, height: ph.h, borderRadius: 56, background: "#0d0c0e", padding: 11, boxShadow: "0 50px 100px rgba(0,0,0,.65), 0 0 0 2px rgba(255,255,255,.12)", transform: `translateZ(100px) translateY(${(1 - ent) * 220}px)`, opacity: ent }}>
        <div style={{ position: "relative", width: "100%", height: "100%", borderRadius: 46, overflow: "hidden" }}>
          <Img src={staticFile("site/hero.jpg")} style={{ width: "100%", height: "100%", objectFit: "cover", objectPosition: "top" }} />
          <div style={{ position: "absolute", left: "50%", top: 14, width: 110, height: 30, marginLeft: -55, borderRadius: 20, background: "#0d0c0e" }} />
        </div>
      </div>
    </Camera>
  );
};

export const Reel2: React.FC<{ t: number; F: Fmt }> = ({ t, F }) => {
  const k = CENAS2, brilho = keys(t, [[0, 0.8], [13.1, 0.9], [14.5, 1.3], [18, 0.9], [34.9, 1.1]]);
  return (
    <AbsoluteFill style={{ background: "#000" }}>
      <Fundo brilho={brilho} />
      <Cena2 t={t} a={k.logo.a} b={k.logo.b}>{(u) => <CenaLogo t={t} F={F} />}</Cena2>
      <Cena2 t={t} a={k.site.a} b={k.site.b}>{(u) => <CenaSite u={u} F={F} />}</Cena2>
      <Cena2 t={t} a={k.prom.a} b={k.prom.b}>{(u) => <CenaProm u={u} F={F} />}</Cena2>
      <Cena2 t={t} a={k.cards.a} b={k.cards.b}>{(u) => <CenaCards u={u} F={F} />}</Cena2>
      <Cena2 t={t} a={k.compra.a} b={k.compra.b}>{(u) => <CenaCompra u={u} F={F} />}</Cena2>
      <Cena2 t={t} a={k.disp.a} b={k.disp.b}>{(u) => <CenaDisp u={u} F={F} />}</Cena2>
      <Cena2 t={t} a={k.final.a} b={k.final.b + 1}>{(u) => <CenaLogo t={u} F={F} fim />}</Cena2>
    </AbsoluteFill>
  );
};

// ---------- geometria dos dois formatos ----------
export const FMT_V: Fmt = {
  W: 1080, H: 1920, c: [540, 960], g: GEO_V,
  logo: { w: 616, left: 232, top: 780 }, tag: { top: 1420, size: 40 }, url: { top: 1560, size: 44 },
  d1: "M-80 1180 C 260 1180 380 1010 540 1010 S 820 700 1160 700", d2: "M-80 1330 C 300 1330 420 1160 600 1130 S 880 880 1160 860",
  title: { top: 170, size: 78 },
  z: { search: 1.75, cta: 1.5, ctaFim: 1.2, card: 1.6, drawer: 1.25, chk: 1.4 },
  alvo: [600, 1130], alvoCta: [600, 1130], alvoC: { card: [760, 1100], drawer: [800, 1050], chk: [700, 950] },
  frase: { top: 880, size: 112, d: ["M-60 760 C 40 760 70 900 120 1010", "M1140 1250 C 1040 1250 1010 1120 960 1010", "M-60 1250 C 80 1250 140 1100 200 950", "M1140 700 C 1000 700 940 840 880 950"], ul: { left: 340, w: 400, top: 1170 } },
  cards: {
    items: [
      { t: "Tops", f: "640", x: 50, y: 330, w: 450, h: 640, rz: -4, z: 40 }, { t: "Leggings e calças", f: "351", x: 570, y: 250, w: 450, h: 640, rz: 3, z: -30 },
      { t: "Short", f: "320", x: 540, y: 1080, w: 450, h: 640, rz: -2, z: 60 }, { t: "Jaquetas e coletes", f: "1033", x: 70, y: 1130, w: 450, h: 640, rz: 3, z: -60 },
      { t: "Presença", f: "428", x: 300, y: 1900, w: 460, h: 640, rz: -3, z: 50 },
    ],
    fios: ["M500 650 C 540 650 520 560 570 560", "M780 890 C 780 980 760 1000 760 1080", "M540 1400 C 400 1400 420 1260 300 1260", "M300 1770 C 300 1850 420 1850 520 1900"],
    cam: { px: [[0, 540], [4.6, 540]], py: [[0, 700], [2.2, 1000], [4.6, 1400]], s: [[0, 1.12], [3, 1.0], [4.8, 0.92]], ry: [[0, 16], [2.4, 4], [4.8, -10]], rx: [[0, 10], [4.8, 4]] },
    title: { top: 110, size: 62 },
  },
  dev: { g: { left: 40, top: 360, vh: 625, chrome: 78, k: 1000 / 1440 }, phone: { x: 640, y: 900, w: 380, h: 760 } },
};
export const FMT_H: Fmt = {
  W: 1920, H: 1080, c: [960, 540], g: GEO_H,
  logo: { w: 640, left: 640, top: 290 }, tag: { top: 770, size: 38 }, url: { top: 880, size: 38 },
  d1: "M-100 660 C 380 660 620 520 960 530 S 1500 340 2020 320", d2: "M-100 760 C 420 760 700 640 1000 610 S 1520 460 2020 430",
  title: { top: 34, size: 64 },
  z: { search: 1.25, cta: 1.75, ctaFim: 1.2, card: 1.7, drawer: 1.3, chk: 1.5 },
  alvo: [840, 580], alvoCta: [840, 580], alvoC: { card: [1300, 560], drawer: [1250, 540], chk: [1150, 520] },
  frase: { top: 385, size: 150, d: ["M-60 380 C 120 380 260 520 470 600", "M1980 780 C 1800 780 1660 640 1450 580", "M-60 800 C 140 800 280 640 520 560", "M1980 340 C 1780 340 1640 480 1400 540"], ul: { left: 720, w: 480, top: 735 } },
  cards: {
    items: [
      { t: "Tops", f: "640", x: 140, y: 270, w: 400, h: 580, rz: -4, z: 40 }, { t: "Leggings e calças", f: "351", x: 640, y: 400, w: 400, h: 580, rz: 3, z: -30 },
      { t: "Short", f: "320", x: 1140, y: 250, w: 400, h: 580, rz: -2, z: 60 }, { t: "Jaquetas e coletes", f: "1033", x: 1640, y: 410, w: 400, h: 580, rz: 3, z: -60 },
      { t: "Presença", f: "428", x: 2140, y: 280, w: 400, h: 580, rz: -3, z: 50 },
    ],
    fios: ["M540 640 C 590 640 590 700 640 700", "M1040 760 C 1090 760 1090 560 1140 560", "M1540 560 C 1590 560 1590 720 1640 720", "M2040 720 C 2090 720 2090 600 2140 600"],
    cam: { px: [[0, 820], [2.4, 1200], [4.8, 1500]], py: [[0, 540], [4.8, 540]], s: [[0, 1.1], [3, 1.0], [4.8, 0.95]], ry: [[0, 12], [2.4, 3], [4.8, -8]], rx: [[0, 6], [4.8, 2]] },
    title: { top: 50, size: 60 },
  },
  dev: { g: { left: 130, top: 150, vh: 720, chrome: 70, k: 0.8 }, phone: { x: 1330, y: 215, w: 370, h: 700 } },
};
