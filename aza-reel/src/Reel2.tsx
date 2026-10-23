// Reel v2: abertura com zoom e logo, digitação do endereço, tour pelo site, promessas com movimento, compra real com carrinho, dispositivos e assinatura.
// Uma única implementação para os dois formatos: o objeto Fmt traz a geometria de cada um (vertical 1080x1920 e horizontal 1920x1080).
import React from "react";
import { AbsoluteFill, Img, staticFile } from "remotion";
import { C, SANS, SERIF, clamp, expoOut, keys, mix, pr, suave } from "./tokens";
import { CENAS2 } from "./roteiro2";
import { Cursor, Fundo, Janela, Logo, LogoEscrita, Tracejado, curvaTraco } from "./Cenas";
import { Camera, Clique, GEO_H, GEO_V, Geo, Titulo, caminho, stage } from "./Reel";
const Fio: React.FC<{ d?: string; p?: number; t?: number }> = () => null;   // sem linhas tracejadas

const rnd = (i: number) => { const x = Math.sin(i * 127.1 + 311.7) * 43758.5453; return x - Math.floor(x); };
type P2 = [number, number];
export type Fmt = {
  W: number; H: number; c: P2; g: Geo;
  logo: { w: number; left: number; top: number }; tag: { top: number; size: number }; url: { top: number; size: number }; d1: string; d2: string;
  title: { top: number; size: number };
  z: { search: number; cta: number; ctaFim: number; card: number; drawer: number; chk: number; filt: number; prod: number };
  alvo: P2; alvoCta: P2; alvoC: { card: P2; drawer: P2; chk: P2 }; alvoF: P2; alvoP: P2;
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

const Letras: React.FC<{ u: number; ini: number; children: string; rosa?: boolean; t?: number }> = ({ u, ini, children, rosa, t = 0 }) => (
  <span style={{ display: "inline-block", whiteSpace: "nowrap", marginRight: "0.28em", perspective: 600 }}>
    {[...children].map((ch, i) => {
      const p = pr(u, ini + i * 0.032, 0.45);
      return <span key={i} style={{ display: "inline-block", opacity: p, transform: `translateY(${(1 - p) * 60 + Math.sin(t * 3.2 + i * 0.55) * 7 * p}px) rotateX(${(1 - p) * -80}deg)`, transformOrigin: "50% 100%", filter: `blur(${(1 - p) * 8}px)`, color: rosa ? (C.claro ? C.rosaEsc : C.rosa) : C.offwhite, fontStyle: rosa ? "italic" : "normal" }}>{ch === " " ? " " : ch}</span>;
    })}
  </span>
);

// ---------- navegador: janela com barra de endereço; o conteúdo usa coordenadas da janela (1440x900 css) ----------
const Nav2: React.FC<{ g: Geo; url?: string; load?: number; children: React.ReactNode }> = ({ g, url, load = 0, children }) => {
  const w = 1440 * g.k;
  return (
    <div style={{ position: "absolute", left: g.left, top: g.top, width: w, height: g.chrome + g.vh, borderRadius: 26, overflow: "hidden", background: C.chrome, border: `1.5px solid ${C.borda}`, boxShadow: C.sombra }}>
      <div style={{ height: g.chrome, background: C.chrome, display: "flex", alignItems: "center", padding: "0 26px", gap: 14, position: "relative" }}>
        {["#ff5f57", "#febc2e", "#28c840"].map((c) => <span key={c} style={{ width: 16, height: 16, borderRadius: 16, background: c, opacity: 0.85 }} />)}
        <div style={{ marginLeft: 26, flex: 1, height: 44, borderRadius: 22, background: C.pill, display: "flex", alignItems: "center", padding: "0 22px", gap: 12, fontFamily: SANS, fontSize: 22, fontWeight: 500, color: url ? C.offwhite : C.dim, letterSpacing: 0.5 }}>
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

// ---------- 1. abertura e final: a logo sobre o fundo limpo ----------
const CenaLogo: React.FC<{ t: number; F: Fmt; fim?: boolean }> = ({ t, F, fim }) => {
  const push = fim ? mix(0.94, 1, expoOut(clamp(t / 1.0))) : mix(0.55, 1, expoOut(clamp(t / 1.2)));
  const p = fim ? 1 : curvaTraco(clamp((t - 0.05) / 1.2)), a = pr(t, 0.02, 0.4);
  const t0 = fim ? 0.5 : 1.2, pulso = 1 + 0.03 * Math.sin(t * 5);
  return (
    <AbsoluteFill style={{ transform: `scale(${push})`, opacity: fim ? 1 : clamp(0.35 + push) }}>
      <div style={{ position: "absolute", left: F.logo.left, top: F.logo.top, opacity: a }}>{fim ? <Logo w={F.logo.w} /> : <LogoEscrita w={F.logo.w} p={p} />}</div>
      <div style={{ position: "absolute", left: 0, right: 0, top: F.tag.top, textAlign: "center", fontFamily: SERIF, fontSize: F.tag.size, letterSpacing: mix(14, 8, expoOut(clamp((t - t0) / 0.6))), color: C.dim, opacity: pr(t, t0, 0.5), filter: `blur(${(1 - pr(t, t0, 0.5)) * 8}px)` }}>MOVIMENTO QUE VESTE PRESENÇA</div>
      {fim ? (
        <>
          <div style={{ position: "absolute", left: 0, right: 0, top: F.url.top - 10, textAlign: "center", opacity: pr(t, t0 + 0.4, 0.4), transform: `scale(${pulso})` }}>
            <span style={{ display: "inline-block", padding: "16px 40px", borderRadius: 60, background: `linear-gradient(135deg, ${C.rosa}, ${C.rosaEsc})`, color: "#fff", fontFamily: SANS, fontWeight: 600, fontSize: Math.round(F.url.size * 0.62), letterSpacing: 5, boxShadow: `0 10px 40px hsl(332 82% 60% / .45)` }}>COMPRE PELO SITE ›</span>
          </div>
          <div style={{ position: "absolute", left: 0, right: 0, top: F.url.top + 105, textAlign: "center", fontFamily: SANS, fontWeight: 500, fontSize: F.url.size, letterSpacing: 9, color: C.rosa, opacity: pr(t, t0 + 0.7, 0.4) }}>USEAZA.COM.BR</div>
        </>
      ) : (
        <div style={{ position: "absolute", left: 0, right: 0, top: F.url.top, textAlign: "center", fontFamily: SANS, fontWeight: 500, fontSize: F.url.size, letterSpacing: 9, color: C.rosa, opacity: pr(t, t0 + 0.3, 0.4) }}>USEAZA.COM.BR</div>
      )}
    </AbsoluteFill>
  );
};

// ---------- 2. digita o endereço, o site abre, passa o mouse, clica no botão e a página da coleção abre ----------
// página da coleção (colecao.jpg, 1440 de largura): cartão do Top Nula Manga Rosa em (564..843, 744..1160)
const CenaSite: React.FC<{ u: number; F: Fmt }> = ({ u, F }) => {
  const { g, c } = F, [sx, sy] = stage(g, 720, 364), [bx, by] = stage(g, 128, 673), H = F.W > F.H;
  const mostra = pr(u, 2.9, 0.4, suave), digitou = u > 2.15, tr = pr(u, 6.35, 0.9, expoOut);
  const sOver = H ? 0.85 : 0.95;
  const s = keys(u, [[0, F.z.search], [2.2, F.z.search * 1.1], [3.6, sOver], [5.0, sOver + 0.03], [5.8, F.z.cta], [7.0, F.z.cta], [8.2, 1.3], [10.3, F.z.ctaFim]]);
  const px = keys(u, [[0, sx], [2.2, sx], [3.6, c[0]], [5.0, bx], [7.0, bx], [8.2, c[0]]]), py = keys(u, [[0, sy], [2.2, sy], [3.6, c[1]], [5.0, by], [7.0, by], [8.2, c[1]]]);
  const f = keys(u, [[0, 1], [2.2, 1], [3.6, 0], [5.0, 0], [5.8, 0.9], [7.0, 0.9], [8.2, 0.4], [10.3, 0.4]]);
  const ry = keys(u, [[0, 0], [2.2, -2], [3.6, -9], [5.8, -3], [8.2, -6]]), rx = keys(u, [[0, 0], [3.6, 5], [5.8, 2], [8.2, 4]]);
  const [cx, cy] = caminho(u, [[3.7, 1380, 140], [4.5, 703, 62], [5.1, 703, 62], [5.9, 150, 690], [6.9, 200, 640], [8.0, 560, 520], [9.2, 703, 440]]);
  const click = pr(u, 6.0, 0.2, suave) * (1 - pr(u, 6.25, 0.25, suave)), cs = keys(u, [[7.0, 0], [9.6, 520]], expoOut);
  const alvoP = mix2(F.c, F.alvo, clamp((u - 4.8) / 1.0));
  const url = !digitou ? undefined : tr > 0.35 ? `${ENDERECO}/collections/presenca` : ENDERECO;
  const load = digita(u);
  return (
    <>
      <Camera s={s} rx={rx} ry={ry} u={u} px={px} py={py} f={f} alvo={alvoP as P2} c={c}>
        <Nav2 g={g} url={url} load={load}>
          <div style={{ position: "absolute", inset: 0, opacity: 1 - mostra }}><NovaAba u={u} /></div>
          <div style={{ position: "absolute", inset: 0, opacity: mostra * (1 - tr), transform: `translateY(${-tr * 70}px) scale(${1 + tr * 0.05})` }}>
            <Pagina scroll={0}>
              <div style={{ position: "absolute", left: 6, top: 642, width: 244, height: 62, borderRadius: 3, boxShadow: `0 0 0 5px ${C.rosa}, 0 0 ${50 + click * 50}px ${C.rosa}`, opacity: pr(u, 5.4, 0.3) * (1 - pr(u, 6.6, 0.3)) }} />
            </Pagina>
            <div style={{ position: "absolute", left: 665, top: 74, width: 80 * pr(u, 4.5, 0.4, expoOut), height: 3, background: C.rosa, boxShadow: `0 0 12px ${C.rosa}`, opacity: 1 - pr(u, 6.4, 0.2) }} />
          </div>
          <div style={{ position: "absolute", inset: 0, opacity: tr, transform: `translateY(${(1 - tr) * 420}px)` }}>
            <div style={{ position: "absolute", left: 0, top: -cs, width: 1440, height: 2400 }}>
              <Img src={staticFile("site/colecao.jpg")} style={{ width: 1440, height: 2400, display: "block" }} />
              <div style={{ position: "absolute", left: 560, top: 740, width: 288, height: 424, borderRadius: 3, boxShadow: `0 0 0 5px ${C.rosa}, 0 0 44px ${C.rosa}`, opacity: pr(u, 9.0, 0.35) }} />
            </div>
          </div>
          <div style={{ opacity: mostra }}>
            <Cursor x={cx} y={cy} s={g.k < 0.8 ? 1.35 : 1.0} />
            <Clique x={cx + 8} y={cy + 10} u={u} ini={6.0} r={g.k < 0.8 ? 90 : 70} />
          </div>
        </Nav2>
      </Camera>
      <div style={{ position: "absolute", left: 60, right: 60, top: F.title.top, textAlign: "center", fontFamily: SERIF, fontSize: F.title.size, letterSpacing: 3, color: C.offwhite, lineHeight: 1.08 }}>
        <Pal u={u} ini={3.4} sai={4.8}>Agora você pode comprar</Pal>{!H && <br />}<Pal u={u} ini={3.7} sai={4.8} rosa>pelo site</Pal>
      </div>
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
const FOTOS_PROM = ["385", "640", "428", "1033"];
const CenaProm: React.FC<{ u: number; F: Fmt }> = ({ u, F }) => {
  const k = 2.6, al = 1 - pr(u, k - 0.5, 0.3, suave), ar = pr(u, k - 0.45, 0.3, suave);
  const [cx, cy] = F.c, ring = (i: number) => { const ph = (u * 1.0 + i / 3) % 1; return <circle key={i} cx={cx} cy={cy + (F.W > F.H ? 10 : 60)} r={90 + ph * (F.W > F.H ? 560 : 640)} fill="none" stroke={C.rosa} strokeWidth={3} opacity={(1 - ph) * 0.5} />; };
  const sway = Math.sin(u * 1.4) * 5, zoom = 1 + u * 0.018;
  const caixa: React.CSSProperties = { position: "absolute", left: 40, right: 40, top: F.frase.top, textAlign: "center", fontFamily: SERIF, fontSize: F.frase.size, lineHeight: 1.05, transform: `rotateY(${sway}deg) scale(${zoom})`, perspective: 900 };
  const dur = 1.35, idx = Math.floor(u / dur), loc = (u % dur) / dur;
  const foto = (i: number, o: number) => <div key={`${i}-${o}`} style={{ position: "absolute", inset: "-14%", opacity: o * 0.6, filter: "blur(20px) brightness(.58) saturate(1.35)", transform: `scale(${1.08 + ((i === idx ? loc : 1) * 0.3)}) translateX(${(i % 2 ? -1 : 1) * (i === idx ? loc : 1) * 90}px)` }}><Img src={staticFile(`fotos/${FOTOS_PROM[i % FOTOS_PROM.length]}.jpg`)} style={{ width: "100%", height: "100%", objectFit: "cover" }} /></div>;
  const brilhoX = ((u * 0.8) % 1) * (F.W + 500) - 250;
  return (
    <>
      {foto(idx, clamp(loc * 4))}{idx > 0 && foto(idx - 1, 1 - clamp(loc * 4))}
      <Fio d={F.frase.d[0]} p={pr(u, 0.1, 0.7, suave) * al} t={u} /><Fio d={F.frase.d[1]} p={pr(u, 0.25, 0.7, suave) * al} t={u} />
      <Fio d={F.frase.d[2]} p={pr(u, k - 0.1, 0.7, suave) * ar} t={u} /><Fio d={F.frase.d[3]} p={pr(u, k, 0.7, suave) * ar} t={u} />
      <div style={{ ...caixa, opacity: al, filter: `blur(${(1 - al) * 10}px)` }}>
        <div><Letras u={u} t={u} ini={0.15}>Valoriza</Letras></div><div><Letras u={u} t={u} ini={0.55} rosa>sua silhueta</Letras></div>
      </div>
      <div style={{ ...caixa, opacity: ar }}>
        <div><Letras u={u - k} t={u} ini={-0.4}>Feito</Letras><Letras u={u - k} t={u} ini={-0.2}>para</Letras></div><div><Letras u={u - k} t={u} ini={0.05} rosa>durar</Letras></div>
      </div>
      <div style={{ position: "absolute", left: brilhoX, top: -100, width: 220, height: F.H + 200, transform: "rotate(16deg)", background: "linear-gradient(90deg, transparent, rgba(255,255,255,.20), transparent)", mixBlendMode: "screen", pointerEvents: "none" }} />
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

// ---------- 5. jornada de compra: filtros, página do produto, carrinho e checkout (capturas reais do site) ----------
// coordenadas em px css da janela (1440x900). Coleção: Tamanho (90,304), caixa M (20,414), Cor (90,513), Rosa (30,681), cartão do Top Nula (564..840, 218..636).
// Produto: tamanho M (971,300), "Adicionar ao carrinho" (1210,366), benefícios (905,432). Gaveta de 940 a 1440; "Finalizar compra" (988,527,194,64).
const CenaJornada: React.FC<{ u: number; F: Fmt }> = ({ u, F }) => {
  const { g, c } = F, st = (x: number, y: number) => stage(g, x, y), H = F.W > F.H;
  const o1 = pr(u, 1.15, 0.2), o2 = pr(u, 2.3, 0.25), o3 = pr(u, 3.35, 0.2), o4 = pr(u, 4.4, 0.25);
  const trP = pr(u, 5.7, 0.8, expoOut), oM = pr(u, 8.0, 0.2), dim = pr(u, 9.2, 0.5, suave), slide = pr(u, 9.15, 0.75, expoOut), chk = pr(u, 11.4, 0.45, suave);
  const [f1x, f1y] = st(420, 430), [f2x, f2y] = st(1060, 330), [f3x, f3y] = st(1090, 440), [f4x, f4y] = st(1010, 270);
  const s = keys(u, [[0, 0.9], [0.8, 1.0], [1.4, F.z.filt], [5.0, F.z.filt], [5.9, 1.05], [6.7, F.z.prod], [8.8, F.z.prod], [9.5, F.z.drawer], [11.2, F.z.drawer], [11.9, F.z.chk], [14.0, F.z.chk], [14.6, 1.1]]);
  const px = keys(u, [[0, f1x], [5.0, f1x], [6.0, f2x], [8.8, f2x], [9.5, f3x], [11.2, f3x], [11.9, f4x], [14.6, f4x]]), py = keys(u, [[0, f1y], [5.0, f1y], [6.0, f2y], [8.8, f2y], [9.5, f3y], [11.2, f3y], [11.9, f4y], [14.6, f4y]]);
  const f = keys(u, [[0, 0], [0.8, 0.15], [1.4, 1], [5.0, 1], [5.9, 0.3], [6.7, 1], [14.0, 1], [14.6, 0.3]]);
  const ax = keys(u, [[0, F.alvoF[0]], [5.0, F.alvoF[0]], [6.0, F.alvoP[0]], [8.8, F.alvoP[0]], [9.5, F.alvoC.drawer[0]], [11.2, F.alvoC.drawer[0]], [11.9, F.alvoC.chk[0]], [14.6, F.alvoC.chk[0]]]);
  const ay = keys(u, [[0, F.alvoF[1]], [5.0, F.alvoF[1]], [6.0, F.alvoP[1]], [8.8, F.alvoP[1]], [9.5, F.alvoC.drawer[1]], [11.2, F.alvoC.drawer[1]], [11.9, F.alvoC.chk[1]], [14.6, F.alvoC.chk[1]]]);
  const ry = keys(u, [[0, -7], [1.4, 0], [14.0, 0], [14.6, -5]]), rx = keys(u, [[0, 4], [1.4, 0], [14.0, 0], [14.6, 3]]);
  const [cx, cy] = caminho(u, [[0.4, 600, 200], [1.0, 90, 304], [1.35, 90, 304], [1.9, 22, 414], [2.4, 22, 414], [2.9, 90, 513], [3.5, 90, 513], [4.0, 30, 681], [4.5, 30, 681], [5.4, 700, 420], [6.0, 700, 420], [7.0, 780, 320], [7.8, 971, 300], [8.2, 971, 300], [9.0, 1210, 366], [9.5, 1210, 366], [10.9, 1085, 559], [11.5, 1085, 559]]);
  const pm = (x: number, y: number, w: number, h: number, ini: number, fim: number): React.ReactNode => <div style={{ position: "absolute", left: x, top: y, width: w, height: h, borderRadius: 4, boxShadow: `0 0 0 4px ${C.rosa}, 0 0 30px ${C.rosa}`, opacity: pr(u, ini, 0.25) * (1 - pr(u, fim, 0.25)) }} />;
  const press = pr(u, 11.3, 0.12) * (1 - pr(u, 11.45, 0.15));
  const url = chk > 0.4 ? `${ENDERECO}/checkout` : trP > 0.35 ? `${ENDERECO}/products/top-nula-manga-rosa` : `${ENDERECO}/collections/presenca`;
  const cr = g.k < 0.8 ? 1.35 : 1.0, rr = g.k < 0.8 ? 80 : 60;
  return (
    <Camera s={s} rx={rx} ry={ry} u={u} px={px} py={py} f={f} alvo={[ax, ay] as P2} c={c}>
      <Nav2 g={g} url={url} load={clamp((u - 5.65) / 0.5) * (1 - clamp((u - 6.2) / 0.05))}>
        <div style={{ position: "absolute", inset: 0, opacity: 1 - trP, transform: `translateY(${-trP * 60}px) scale(${1 + trP * 0.04})` }}>
          <Vista src="a0" /><Vista src="a1" o={o1} /><Vista src="a2" o={o2} /><Vista src="a3" o={o3} /><Vista src="a4" o={o4} />
          {pm(4, 288, 242, 34, 0.9, 1.7)}{pm(4, 402, 66, 28, 2.0, 2.9)}{pm(4, 498, 242, 34, 3.1, 3.7)}{pm(4, 668, 112, 28, 4.1, 4.9)}{pm(558, 214, 290, 450, 5.0, 5.8)}
        </div>
        <div style={{ position: "absolute", inset: 0, opacity: trP, transform: `translateY(${(1 - trP) * 300}px)` }}>
          <Vista src="p0" /><Vista src="pM" o={oM} />
          {pm(900, 428, 240, 98, 6.8, 7.7)}{pm(946, 280, 48, 40, 7.5, 8.6)}{pm(1000, 336, 420, 60, 8.7, 9.7)}
        </div>
        <div style={{ position: "absolute", inset: 0, background: "#000", opacity: 0.5 * dim }} />
        <div style={{ position: "absolute", left: 940 + (1 - slide) * 500, top: 0, width: 500, height: 900, overflow: "hidden", boxShadow: "-20px 0 60px rgba(0,0,0,.25)" }}>
          <Img src={staticFile("site/drawerP.jpg")} style={{ width: 500, height: 900 }} />
        </div>
        <div style={{ opacity: pr(u, 10.3, 0.3) * (1 - pr(u, 11.6, 0.2)) }}>{pm(982, 520, 206, 76, 0, 99)}</div>
        <div style={{ position: "absolute", left: 988, top: 527, width: 194, height: 64, background: `hsl(332 82% 68% / ${press * 0.35})` }} />
        <Vista src="s_checkout" o={chk} />
        <div style={{ opacity: pr(u, 12.1, 0.3) * (1 - pr(u, 14.2, 0.3)) }}>{pm(804, 138, 412, 82, 0, 99)}{pm(804, 368, 412, 46, 0, 99)}</div>
        <div style={{ opacity: 1 - chk }}><Cursor x={cx} y={cy} s={cr} /></div>
        {[1.1, 2.2, 3.3, 4.3, 5.6, 7.9, 9.1, 11.3].map((t) => <Clique key={t} x={cx + 8} y={cy + 10} u={u} ini={t} r={rr} />)}
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
      <Cena2 t={t} a={k.jornada.a} b={k.jornada.b}>{(u) => <CenaJornada u={u} F={F} />}</Cena2>
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
  title: { top: 150, size: 74 },
  z: { search: 1.75, cta: 1.5, ctaFim: 1.2, card: 1.6, drawer: 1.25, chk: 1.4, filt: 1.6, prod: 1.7 },
  alvo: [600, 1130], alvoCta: [600, 1130], alvoC: { card: [760, 1100], drawer: [800, 1050], chk: [700, 950] }, alvoF: [560, 1050], alvoP: [650, 980],
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
  title: { top: 18, size: 56 },
  z: { search: 1.25, cta: 1.75, ctaFim: 1.2, card: 1.7, drawer: 1.3, chk: 1.5, filt: 1.4, prod: 1.55 },
  alvo: [840, 580], alvoCta: [840, 580], alvoC: { card: [1300, 560], drawer: [1250, 540], chk: [1150, 520] }, alvoF: [900, 560], alvoP: [1100, 520],
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
