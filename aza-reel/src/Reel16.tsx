// Versão horizontal 16:9 (1920x1080) do Reel: mesmas cenas e tempos (roteiro.ts), geometria própria.
import React from "react";
import { AbsoluteFill, Img, staticFile } from "remotion";
import { C, SANS, SERIF, clamp, expoOut, keys, mix, pr, suave, volta } from "./tokens";
import { CENAS } from "./roteiro";
import { Cursor, Fundo, Janela, Logo, LogoEscrita, Tracejado, curvaTraco } from "./Cenas";
import { Camera, Cena, Clique, FADE, Fio, GEO_H, Navegador, Palavra, Titulo, camT, caminho, stage } from "./Reel";

const C16: [number, number] = [960, 540];

// ---------- logo (abertura) ----------
const D1 = "M-100 660 C 380 660 620 520 960 530 S 1500 340 2020 320";
const D2 = "M-100 760 C 420 760 700 640 1000 610 S 1520 460 2020 430";
const Cena1H: React.FC<{ t: number }> = ({ t }) => {
  const p = curvaTraco(clamp((t - 0.05) / 1.2)), off = -t * 230;
  return (
    <AbsoluteFill>
      <svg width={1920} height={1080} style={{ position: "absolute", inset: 0, overflow: "visible", opacity: pr(t, 0.05, 0.5) }}>
        <Tracejado d={D1} largura={5} off={off} /><Tracejado d={D2} largura={3} dash="22 24" off={off * 1.3} op={0.55} />
      </svg>
      <div style={{ position: "absolute", left: 640, top: 290 }}><LogoEscrita w={640} p={p} /></div>
      <div style={{ position: "absolute", left: 0, right: 0, top: 770, textAlign: "center", fontFamily: SERIF, fontSize: 38, letterSpacing: mix(14, 8, expoOut(clamp((t - 1.2) / 0.6))), color: C.dim, opacity: pr(t, 1.2, 0.5), filter: `blur(${(1 - pr(t, 1.2, 0.5)) * 8}px)` }}>MOVIMENTO QUE VESTE PRESENÇA</div>
      <div style={{ position: "absolute", left: 0, right: 0, top: 880, textAlign: "center", fontFamily: SANS, fontWeight: 500, fontSize: 34, letterSpacing: 8, color: C.rosa, opacity: pr(t, 1.5, 0.4) }}>USEAZA.COM.BR</div>
    </AbsoluteFill>
  );
};

// ---------- site no navegador: passa o mouse, clica no botão e rola ----------
const CenaSiteH: React.FC<{ u: number }> = ({ u }) => {
  const ent = pr(u, 0, 0.8, expoOut);
  const s = keys(u, [[0, 0.82], [0.8, 0.9], [1.6, 1.75], [2.8, 1.75], [3.4, 1.35], [5.8, 1.2]]);
  const ry = keys(u, [[0, -26], [0.9, -7], [1.8, -3], [5.8, -5]]), rx = keys(u, [[0, 8], [1.8, 2], [5.8, 3]]);
  const [bx, by] = stage(GEO_H, 128, 673);
  const px = keys(u, [[1.6, bx], [2.9, bx], [3.8, 960]]), py = keys(u, [[1.6, by], [2.9, by], [3.8, 540]]), f = keys(u, [[0.8, 0], [1.6, 0.9], [2.9, 0.9], [3.8, 0.4]]);
  const [cx, cy] = caminho(u, [[0.5, 1420, 160], [1.2, 703, 62], [1.8, 703, 62], [2.4, 150, 690]]);
  const click = pr(u, 2.5, 0.2, suave) * (1 - pr(u, 2.75, 0.25, suave));
  const rola = keys(u, [[2.9, 0], [5.3, 1000]], curvaTraco);
  return (
    <>
      <Camera s={s} rx={rx} ry={ry} u={u} px={px} py={py} f={f} alvo={[840, 580]} c={C16}>
        <div style={{ opacity: ent, transform: `translateX(${(1 - ent) * 400}px)` }}>
          <Navegador g={GEO_H} scroll={rola} load={clamp((u - 2.6) / 0.8)}
            vista={<>
              <div style={{ position: "absolute", left: 665, top: 74, width: 80 * pr(u, 1.3, 0.4, expoOut), height: 3, background: C.rosa, boxShadow: `0 0 12px ${C.rosa}` }} />
              <Cursor x={cx} y={cy} s={1.0} />
              <Clique x={cx + 6} y={cy + 8} u={u} ini={2.5} r={70} />
            </>}
            pagina={<div style={{ position: "absolute", left: 6, top: 642, width: 244, height: 62, borderRadius: 3, boxShadow: `0 0 0 5px ${C.rosa}, 0 0 ${50 + click * 50}px ${C.rosa}`, opacity: pr(u, 2.1, 0.3) * (1 - pr(u, 3.0, 0.3)) }} />}
          />
        </div>
      </Camera>
      <Titulo top={34} size={64}><Palavra u={u} ini={0.15} saiEm={1.4}>O novo site</Palavra><Palavra u={u} ini={0.4} rosa saiEm={1.4}>da AZA</Palavra></Titulo>
    </>
  );
};

// ---------- cards de produto em linha, a câmera percorre ----------
const CARDS = [
  { t: "Tops", f: "640", x: 140, y: 270, rz: -4, z: 40 },
  { t: "Leggings e calças", f: "351", x: 640, y: 400, rz: 3, z: -30 },
  { t: "Short", f: "320", x: 1140, y: 250, rz: -2, z: 60 },
  { t: "Jaquetas e coletes", f: "1033", x: 1640, y: 410, rz: 3, z: -60 },
  { t: "Presença", f: "428", x: 2140, y: 280, rz: -3, z: 50 },
];
const CenaCardsH: React.FC<{ u: number }> = ({ u }) => {
  const px = keys(u, [[0, 820], [2.4, 1200], [4.8, 1500]]), s = keys(u, [[0, 1.1], [3, 1.0], [4.8, 0.95]]);
  const ry = keys(u, [[0, 12], [2.4, 3], [4.8, -8]]), rx = keys(u, [[0, 6], [4.8, 2]]);
  return (
    <>
      <Camera s={s} rx={rx} ry={ry} u={u} px={px} py={540} f={1} alvo={C16} c={C16}>
        <Fio d="M540 640 C 590 640 590 700 640 700" p={pr(u, 0.5, 0.5, suave)} t={u} />
        <Fio d="M1040 760 C 1090 760 1090 560 1140 560" p={pr(u, 1.1, 0.5, suave)} t={u} />
        <Fio d="M1540 560 C 1590 560 1590 720 1640 720" p={pr(u, 1.8, 0.5, suave)} t={u} />
        <Fio d="M2040 720 C 2090 720 2090 600 2140 600" p={pr(u, 2.5, 0.5, suave)} t={u} />
        {CARDS.map((c, i) => {
          const p = pr(u, 0.05 + i * 0.3, 0.7, expoOut);
          return (
            <div key={c.f} style={{ opacity: p, transform: `translateX(${(1 - p) * 220}px) scale(${0.9 + p * 0.1})` }}>
              <Janela titulo={c.t} w={400} h={580} style={{ left: c.x, top: c.y, transform: `translateZ(${c.z}px) rotateZ(${c.rz}deg)` }}>
                <Img src={staticFile(`fotos/${c.f}.jpg`)} style={{ width: "100%", height: "100%", objectFit: "cover", objectPosition: "50% 20%" }} />
              </Janela>
            </div>
          );
        })}
      </Camera>
      <Titulo top={50} size={60}><Palavra u={u} ini={0.1} saiEm={1.9}>Uma peça,</Palavra><Palavra u={u} ini={0.35} rosa saiEm={1.9}>inúmeras possibilidades</Palavra></Titulo>
    </>
  );
};

// ---------- texto cinético ----------
const CenaTextoH: React.FC<{ u: number }> = ({ u }) => {
  const k = 2.2;
  const al = 1 - pr(u, k - 0.3, 0.3, suave), ar = pr(u, k - 0.1, 0.3, suave);
  const caixa: React.CSSProperties = { position: "absolute", left: 0, right: 0, top: 385, textAlign: "center", fontFamily: SERIF, fontSize: 150, lineHeight: 1.05 };
  return (
    <>
      <Fio d="M-60 380 C 120 380 260 520 470 600" p={pr(u, 0.1, 0.7, suave) * al} t={u} />
      <Fio d="M1980 780 C 1800 780 1660 640 1450 580" p={pr(u, 0.25, 0.7, suave) * al} t={u} />
      <Fio d="M-60 800 C 140 800 280 640 520 560" p={pr(u, k - 0.1, 0.7, suave) * ar} t={u} />
      <Fio d="M1980 340 C 1780 340 1640 480 1400 540" p={pr(u, k, 0.7, suave) * ar} t={u} />
      <div style={{ ...caixa, opacity: al }}>
        <div><Palavra u={u} ini={0.15} saiEm={k - 0.3}>Valoriza</Palavra></div>
        <div><Palavra u={u} ini={0.4} rosa saiEm={k - 0.3}>sua silhueta</Palavra></div>
      </div>
      <div style={caixa}>
        <div><Palavra u={u - k} ini={-0.15}>Feito</Palavra><Palavra u={u - k} ini={0.0}>para</Palavra></div>
        <div><Palavra u={u - k} ini={0.2} rosa>durar</Palavra></div>
      </div>
      <div style={{ position: "absolute", left: 720, width: 480 * pr(u, k + 0.8, 0.5, expoOut), top: 735, height: 4, background: C.rosa, boxShadow: `0 0 24px ${C.rosa}`, opacity: ar }} />
    </>
  );
};

// ---------- clique de compra: tamanho M do Top Nula Manga Rosa ----------
const SCROLL5 = 1000;
const CenaCompraH: React.FC<{ u: number }> = ({ u }) => {
  const [mx, my] = stage(GEO_H, 1256, 1576 - SCROLL5);
  const s = keys(u, [[0, 0.9], [0.9, 1.0], [1.7, 1.7], [4.3, 1.7], [5.5, 1.15]]);
  const ry = keys(u, [[0, -9], [1.7, 0], [4.3, 0], [5.5, -5]]), rx = keys(u, [[0, 5], [1.7, 0], [4.3, 0], [5.5, 3]]);
  const f = keys(u, [[0, 0], [0.9, 0.15], [1.7, 1], [4.3, 1], [5.5, 0.3]]);
  const [cx, cy] = caminho(u, [[0.4, 560, 260], [1.6, 1250, 548]]);
  const click = pr(u, 2.2, 0.2, suave) * (1 - pr(u, 2.45, 0.25, suave)), sel = pr(u, 2.25, 0.2);
  const sac = pr(u, 2.7, 0.6, volta);
  const { tx, ty } = camT(s, f, mx, my, [1060, 560], C16);
  const sx = 960 + s * (mx - 960) + tx, sy = 540 + s * (my - 540) + ty;
  return (
    <>
      <Camera s={s} rx={rx} ry={ry} u={u} px={mx} py={my} f={f} alvo={[1060, 560]} c={C16}>
        <Navegador g={GEO_H} scroll={SCROLL5}
          vista={<>
            <div style={{ position: "absolute", left: 1210, top: 556, width: 92, height: 42, borderRadius: 3, boxShadow: `0 0 0 4px ${C.rosa}, 0 0 ${34 + click * 40}px ${C.rosa}`, background: `hsl(332 82% 68% / ${sel * 0.85})`, opacity: pr(u, 1.5, 0.3) }} />
            <div style={{ position: "absolute", left: 1210, top: 556, width: 92, height: 42, display: "grid", placeItems: "center", fontFamily: SANS, fontSize: 24, fontWeight: 600, color: sel > 0.5 ? "#fff" : "transparent" }}>M</div>
            <div style={{ position: "absolute", left: 1195, top: 677, width: 124 * pr(u, 3.0, 0.5, expoOut), height: 4, background: C.rosa, boxShadow: `0 0 16px ${C.rosa}` }} />
            <Cursor x={cx} y={cy} s={1.0} />
            <Clique x={cx + 6} y={cy + 8} u={u} ini={2.2} r={60} />
          </>}
        />
      </Camera>
      <Fio d={`M${sx} ${sy} C ${sx + 120} ${sy - 300} 1780 380 1810 150`} p={pr(u, 2.5, 0.6, suave)} t={u} />
      <div style={{ position: "absolute", right: 60, top: 60, width: 110, height: 110, borderRadius: 110, background: `linear-gradient(135deg, ${C.rosa}, ${C.rosaEsc})`, display: "grid", placeItems: "center", opacity: sac, transform: `scale(${0.4 + sac * 0.6})`, boxShadow: `0 0 ${30 + sac * 30}px ${C.rosa}` }}>
        <svg width="58" height="58" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M6 8h12l1 12H5L6 8Z" /><path d="M9 8V6a3 3 0 0 1 6 0v2" /></svg>
      </div>
      <Titulo top={30} size={60}><Palavra u={u} ini={0.1} saiEm={0.8}>Feito para o</Palavra><Palavra u={u} ini={0.3} rosa saiEm={0.8}>seu momento</Palavra></Titulo>
    </>
  );
};

// ---------- recuo: o site e as fotos juntos ----------
const FOTOS6 = [["640", 70, 70, -5], ["351", 70, 540, 3], ["1033", 1550, 70, 3], ["428", 1550, 540, -4]] as const;
const CenaRecuoH: React.FC<{ u: number }> = ({ u }) => {
  const s = keys(u, [[0, 1.6], [2.6, 0.8]], expoOut), ry = keys(u, [[0, -5], [4, 6]]);
  const alf = pr(u, 0.6, 0.7);
  return (
    <>
      <Camera s={s} rx={4} ry={ry} u={u} px={960} py={540} f={keys(u, [[0, 1], [2.6, 0.2]])} alvo={C16} c={C16}>
        <Navegador g={GEO_H} scroll={1830} />
        <div style={{ opacity: alf, transform: `translateY(${(1 - alf) * 100}px)` }}>
          {FOTOS6.map(([f, x, y, r]) => (
            <Janela key={f} titulo="AZA" w={300} h={410} style={{ left: x, top: y, transform: `translateZ(-60px) rotateZ(${r}deg)` }}>
              <Img src={staticFile(`fotos/${f}.jpg`)} style={{ width: "100%", height: "100%", objectFit: "cover", objectPosition: "50% 20%" }} />
            </Janela>
          ))}
        </div>
      </Camera>
      <div style={{ position: "absolute", left: 0, right: 0, top: 962, textAlign: "center", fontFamily: SERIF, fontSize: 56, color: C.offwhite, opacity: pr(u, 0.9, 0.5) }}>Siga <span style={{ color: C.rosa, fontStyle: "italic" }}>@useazabr</span></div>
    </>
  );
};

// ---------- assinatura final ----------
const CenaFinalH: React.FC<{ u: number }> = ({ u }) => {
  const a = pr(u, 0, 0.5), sc = mix(0.94, 1, expoOut(clamp(u / 1.0))), off = -(CENAS.final.a + u) * 230;
  return (
    <>
      <svg width={1920} height={1080} style={{ position: "absolute", inset: 0, overflow: "visible", opacity: a }}>
        <Tracejado d={D1} largura={5} off={off} /><Tracejado d={D2} largura={3} dash="22 24" off={off * 1.3} op={0.55} />
      </svg>
      <div style={{ position: "absolute", left: 640, top: 290, opacity: a, transform: `scale(${sc})`, filter: `drop-shadow(0 0 ${6 + a * 8}px hsl(332 82% 62% / .45))` }}><Logo w={640} /></div>
      <div style={{ position: "absolute", left: 0, right: 0, top: 770, textAlign: "center", fontFamily: SERIF, fontSize: 38, letterSpacing: 8, color: C.dim, opacity: pr(u, 0.2, 0.5) }}>MOVIMENTO QUE VESTE PRESENÇA</div>
      <div style={{ position: "absolute", left: 0, right: 0, top: 870, textAlign: "center", fontFamily: SANS, fontWeight: 500, fontSize: 46, letterSpacing: 9, color: C.rosa, opacity: pr(u, 0.4, 0.5) }}>USEAZA.COM.BR</div>
    </>
  );
};

export const ReelH: React.FC<{ t: number }> = ({ t }) => {
  const k = CENAS;
  const brilho = keys(t, [[0, 0.8], [12.2, 0.8], [14, 1.25], [16.3, 0.85], [25.7, 1.1]]);
  return (
    <AbsoluteFill style={{ background: "#000" }}>
      <Fundo brilho={brilho} />
      {t < k.logo.b && <div style={{ opacity: clamp((k.logo.b - t) / FADE), filter: `blur(${(1 - clamp((k.logo.b - t) / FADE)) * 14}px)` }}><Cena1H t={t} /></div>}
      <Cena t={t} a={k.site.a} b={k.site.b}>{(u) => <CenaSiteH u={u} />}</Cena>
      <Cena t={t} a={k.cards.a} b={k.cards.b}>{(u) => <CenaCardsH u={u} />}</Cena>
      <Cena t={t} a={k.texto.a} b={k.texto.b}>{(u) => <CenaTextoH u={u} />}</Cena>
      <Cena t={t} a={k.compra.a} b={k.compra.b}>{(u) => <CenaCompraH u={u} />}</Cena>
      <Cena t={t} a={k.recuo.a} b={k.recuo.b}>{(u) => <CenaRecuoH u={u} />}</Cena>
      <Cena t={t} a={k.final.a} b={k.final.b + 1}>{(u) => <CenaFinalH u={u} />}</Cena>
    </AbsoluteFill>
  );
};
