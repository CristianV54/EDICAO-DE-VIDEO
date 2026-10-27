import React from "react";
import { B, Cil, Coracao, COR, Esf, Cone, geoEstrela } from "./primitivas";
import { Seg } from "./Personagem";
import { CameraModelo } from "./CameraModelo";
import { Fade } from "./Fade";
import { useTex, NomeTex } from "./Texturas";
import { amigos as _amigos, fotografo, maoNoivaMundo } from "./estadoElenco";
import {
  ALTURA_PED, ENTRADA_MADRINHA as _EM, V3, Y_CASA, centroCasa, posCelularCasa3, posCli, posFot, posPeca, posMesa, rotRepouso,
} from "../dados/posicoes";
import { LINHAS, TOQUE_REL, clamp01, easeInOutCubic, easeOutBack, entrada, lerp, springQueda } from "../util/tempo";

void _amigos;
void _EM;
const rampa = (f: number, f0: number, dur: number) => easeInOutCubic(clamp01((f - f0) / dur));
const mix = (a: V3, b: V3, t: number): V3 => [lerp(a[0], b[0], t), lerp(a[1], b[1], t), lerp(a[2], b[2], t)];
const FOTO_CORES = ["#BFE3F5", "#F7D6E0", "#D6EBC8", "#FFE9A8"];

// foto pequena (moldura branca + cena de cor)
const Foto: React.FC<{ cor: string; s?: number }> = ({ cor, s = 1 }) => (
  <group scale={s}>
    <B s={[0.3, 0.22, 0.015]} c="#FFFFFF" r={0.005} />
    <B p={[0, 0.0, 0.009]} s={[0.26, 0.18, 0.012]} c={cor} r={0.003} sombra={false} />
    <B p={[-0.05, -0.03, 0.017]} s={[0.05, 0.1, 0.008]} c="#F7F5F0" r={0.002} sombra={false} />
    <B p={[0.04, -0.03, 0.017]} s={[0.05, 0.1, 0.008]} c="#1F2A44" r={0.002} sombra={false} />
  </group>
);

const Plaq: React.FC<{ tex: NomeTex }> = ({ tex }) => {
  const t = useTex(tex);
  return (
    <mesh position={[0, -ALTURA_PED / 2 + 0.01, 0.452]}>
      <planeGeometry args={[0.7, 0.22]} />
      <meshBasicMaterial map={t} transparent toneMapped={false} />
    </mesh>
  );
};

// pedestal + peca: surgem juntos, caindo do alto com spring no momento da peca
const Peca: React.FC<{ n: number; f: number; plq: NomeTex; children?: React.ReactNode }> = ({ n, f, plq, children }) => {
  const L = LINHAS[n];
  const p = posPeca(n);
  const s = springQueda(f - L.quedaIni);
  if (f < L.quedaIni) return null;
  return (
    <group position={[p[0], p[1] + (1 - s) * 4.5, p[2]]}>
      <B p={[0, -ALTURA_PED / 2, 0]} s={[0.9, ALTURA_PED, 0.9]} c="#E9DFC9" r={0.03} />
      <Plaq tex={plq} />
      {children}
    </group>
  );
};

// ---------- s01: camera gigante ----------
const E01: React.FC<{ f: number }> = ({ f }) => {
  const L = LINHAS[1];
  const giro = rampa(f, L.sol, 14) * (Math.PI / 2);
  return (
    <Peca n={1} f={f} plq="plq_camera">
      <group position={[0, 0.4, -0.04]}>
        <CameraModelo escala={1.33} lente="kit" modo={f >= L.sol + 7 ? "m" : "auto"} giroSeletor={giro} />
      </group>
    </Peca>
  );
};

// ---------- s02: album dourado, fotos voando ----------
const E02: React.FC<{ f: number }> = ({ f }) => {
  const L = LINHAS[2];
  const aberto = rampa(f, L.sol, 14);
  const cliques = [L.ev.amigos, L.ev.amigos + 11, L.ev.amigos + 22];
  const orig = posFot(2);
  const alvo = posPeca(2);
  return (
    <>
      <Peca n={2} f={f} plq="plq_portfolio">
        <B p={[0, 0.06, 0]} s={[0.9, 0.12, 0.68]} c={COR.dourado} r={0.03} />
        <B p={[0, 0.17, 0]} s={[0.84, 0.1, 0.6]} c="#F2E4D0" r={0.01} />
        <B p={[-0.43, 0.12, 0]} s={[0.05, 0.2, 0.66]} c="#B88A24" r={0.02} />
        {cliques.map((c, k) => f >= c + 17 && (
          <group key={k} position={[-0.24 + k * 0.24, 0.231, 0.0]} rotation={[-Math.PI / 2, 0, 0]}>
            <Foto cor={FOTO_CORES[k]} s={0.85} />
          </group>
        ))}
        <group position={[0, 0.22, -0.34]} rotation={[-aberto * 1.95, 0, 0]}>
          <B p={[0, 0.0, 0.34]} s={[0.9, 0.05, 0.68]} c={COR.dourado} r={0.03} />
          <B p={[0, 0.03, 0.34]} s={[0.5, 0.01, 0.2]} c="#B88A24" r={0.01} sombra={false} />
          <B p={[0, 0.03, 0.34]} s={[0.12, 0.012, 0.12]} c="#F2E4D0" r={0.04} sombra={false} />
        </group>
      </Peca>
      {cliques.map((c, k) => {
        const t = (f - (c + 3)) / 14;
        if (t < 0 || t > 1) return null;
        const e = easeInOutCubic(t);
        const a: V3 = [orig[0], orig[1] + 1.0, orig[2] + 0.25];
        const b: V3 = [alvo[0], alvo[1] + 0.5, alvo[2]];
        const p = mix(a, b, e);
        return (
          <group key={k} position={[p[0], p[1] + 0.5 * Math.sin(Math.PI * e), p[2]]} rotation={[-0.5 * e, 0, 0.25 * (1 - e)]}>
            <Foto cor={FOTO_CORES[k]} s={1.1} />
          </group>
        );
      })}
    </>
  );
};

// ---------- s03: celular gigante + HD ----------
const E03: React.FC<{ f: number }> = ({ f }) => {
  const L = LINHAS[3];
  const t = (f - L.sol) / 10;
  const treme = t >= 0 && t < 1 ? Math.sin(t * Math.PI * 8) * 0.05 * (1 - t) : 0;
  const hd = entrada(f - L.prob, 8) * (1 - rampa(f, L.ev.instagram, 6));
  const cad = L.ev.instagram;
  const bal = f >= L.sol ? easeOutBack((f - L.sol) / 8) : 0;
  const out = 1 - rampa(f, L.fim - 12, 12);
  const base = posPeca(3);
  return (
    <>
      <Peca n={3} f={f} plq="plq_instagram">
        <group position={[treme, 0.64, -0.05]} rotation={[-0.08, 0, 0]}>
          <B s={[0.7, 1.2, 0.12]} c="#17181D" r={0.07} />
          <mesh position={[0, 0, 0.062]}>
            <planeGeometry args={[0.62, 1.1]} />
            <meshBasicMaterial color="#C9CED6" toneMapped={false} />
          </mesh>
          <B p={[0, 0.5, 0.068]} s={[0.62, 0.1, 0.01]} c="#F7F5F0" sombra={false} r={0.003} />
          <Esf p={[-0.22, 0.5, 0.08]} r={0.035} c="#E1306C" seg={8} />
          {Array.from({ length: 9 }, (_, k) => {
            const x = -0.205 + (k % 3) * 0.205;
            const y = 0.28 - Math.floor(k / 3) * 0.205;
            const e = f >= cad + k * 4 ? entrada(f - (cad + k * 4), 5) : 0;
            return (
              <group key={k} position={[x, y, 0.075]} scale={e}>
                <B s={[0.185, 0.185, 0.012]} c={FOTO_CORES[k % 4]} r={0.004} sombra={false} />
                <B p={[0, -0.03, 0.009]} s={[0.05, 0.1, 0.006]} c={k % 2 ? "#1F2A44" : "#F7F5F0"} r={0.002} sombra={false} />
              </group>
            );
          })}
        </group>
        <Fade op={out}>
          <group position={[0.18, 1.65, 0.35]} scale={bal}>
            <BalaoTex tex="bal_quanto" w={0.95} h={0.33} />
          </group>
        </Fade>
      </Peca>
      {f >= L.prob && f < L.ev.instagram + 8 && (
        <group position={[base[0] - 0.05, base[1] - ALTURA_PED + 0.08, base[2] + 0.75]} scale={hd}>
          <B s={[0.5, 0.14, 0.34]} c="#C5CAD3" r={0.03} />
          <B p={[0, 0.0, 0.175]} s={[0.4, 0.06, 0.01]} c="#8A90A0" r={0.003} sombra={false} />
          <group position={[0, 0.2, 0.14]}>
            <B p={[0, 0, 0]} s={[0.2, 0.15, 0.07]} c={COR.dourado} r={0.02} />
            <mesh position={[0, 0.1, 0]}>
              <torusGeometry args={[0.07, 0.022, 6, 10, Math.PI]} />
              <meshStandardMaterial color={COR.dourado} />
            </mesh>
          </group>
        </group>
      )}
    </>
  );
};

const BalaoTex: React.FC<{ tex: NomeTex; w: number; h: number }> = ({ tex, w, h }) => {
  const t = useTex(tex);
  return (
    <group>
      <mesh>
        <planeGeometry args={[w, h]} />
        <meshBasicMaterial map={t} transparent toneMapped={false} depthWrite={false} />
      </mesh>
      <Cone p={[-w * 0.3, -h / 2 - 0.04, 0]} r={0.06} h={0.1} c="#FFFFFF" rot={[0, 0, Math.PI]} />
    </group>
  );
};

// ---------- s04: proposta ----------
const E04: React.FC<{ f: number }> = ({ f }) => {
  const L = LINHAS[4];
  const orig = posPeca(4);
  const mao = maoNoivaMundo(f);
  const aLocal: V3 = [mao[0] - orig[0] + 0.05, mao[1] - orig[1] + 0.02, mao[2] - orig[2] + 0.1];
  const base: V3 = [0, 0.62, -0.04];
  const voa = rampa(f, L.sol, 20) * (1 - rampa(f, L.fim - 14, 14));
  const pos = mix(base, aLocal, voa);
  const brilho = Math.max(0, 1 - Math.abs(f - (L.sol + 4)) / 8);
  const esc = lerp(1, 0.5, voa);
  const fe = fotografo(f);
  const tAudio = (f - L.ev.audio) / 20;
  const nv = posCli(4);
  const a: V3 = [fe.pos[0], fe.pos[1] + 1.15, fe.pos[2] + 0.3];
  const b: V3 = [nv[0], nv[1] + 1.35, nv[2] + 0.3];
  return (
    <>
      <Peca n={4} f={f} plq="plq_proposta">
        <group position={pos} rotation={[-0.2 * (1 - voa), 0, 0.08 * (1 - voa)]} scale={esc}>
          <B s={[0.85, 1.1, 0.03]} c="#FFFFFF" r={0.02} e="#FFF3B0" ei={brilho * 1.2} />
          <B p={[0, 0.46, 0.02]} s={[0.85, 0.16, 0.012]} c="#3B82F6" r={0.005} sombra={false} />
          <B p={[0, 0.16, 0.02]} s={[0.6, 0.3, 0.012]} c="#BFE3F5" r={0.01} sombra={false} />
          {[0.0, -0.1, -0.2].map((y, k) => <B key={k} p={[-0.05 * (k % 2), y - 0.02, 0.02]} s={[0.6 - k * 0.1, 0.04, 0.012]} c="#C9CED6" r={0.005} sombra={false} />)}
          <Cil p={[0.25, -0.4, 0.04]} r={0.1} h={0.02} c={COR.dourado} rot={[Math.PI / 2, 0, 0]} />
          <B p={[0.2, -0.52, 0.03]} s={[0.05, 0.14, 0.01]} c="#EF4444" r={0.003} rot={[0, 0, 0.2]} sombra={false} />
          <B p={[0.3, -0.52, 0.03]} s={[0.05, 0.14, 0.01]} c="#EF4444" r={0.003} rot={[0, 0, -0.2]} sombra={false} />
        </group>
      </Peca>
      {tAudio >= 0 && tAudio <= 1.3 && (() => {
        const e = easeInOutCubic(clamp01(tAudio));
        const p = mix(a, b, e);
        const op = 1 - clamp01((tAudio - 1) / 0.3);
        return (
          <Fade op={op}>
            <group position={[p[0], p[1] + 0.25 * Math.sin(Math.PI * e), p[2]]} scale={0.9}>
              <B s={[0.5, 0.22, 0.06]} c="#25D366" r={0.08} />
              {[0.4, 0.7, 1, 0.6, 0.85, 0.45, 0.65].map((h, k) => <B key={k} p={[-0.18 + k * 0.06, 0, 0.034]} s={[0.025, 0.14 * h, 0.01]} c="#FFFFFF" r={0.004} sombra={false} />)}
            </group>
          </Fade>
        );
      })()}
    </>
  );
};

// ---------- s05: contrato, caneta, carimbo ----------
const sig = (u: number): [number, number] => [-0.25 + 0.5 * u, -0.34 + 0.07 * Math.sin(u * 17) * (1 - u * 0.4) + 0.04 * Math.cos(u * 9)];
const E05: React.FC<{ f: number }> = ({ f }) => {
  const L = LINHAS[5];
  const u = clamp01((f - L.ev.contrato) / 26);
  const N = 26;
  const dentro = rampa(f, L.ev.contrato - 10, 10) * (1 - rampa(f, L.ev.contrato + 30, 10));
  const rep: V3 = [0.58, -0.4, 0.06];
  const [sx, sy] = sig(u);
  const ponta = mix(rep, [sx, sy, 0.05], dentro);
  const dir: V3 = [0.45, 0.8, 0.35];
  const k = 0.45;
  const stampY = 0.8 * (1 - rampa(f, L.sol - 8, 8)) + 0.8 * rampa(f, L.sol + 8, 10);
  const marca = f >= L.sol;
  const texA = useTex("assinado");
  return (
    <Peca n={5} f={f} plq="plq_contrato">
      <group position={[0, 0.66, -0.06]} rotation={[-0.12, 0, 0]}>
        <B s={[0.85, 1.15, 0.03]} c="#FFFFFF" r={0.02} />
        <B p={[0, 0.48, 0.02]} s={[0.5, 0.06, 0.012]} c="#17181D" r={0.005} sombra={false} />
        {[0.34, 0.24, 0.14, 0.04, -0.06, -0.16].map((y, j) => <B key={j} p={[0, y, 0.02]} s={[0.68 - (j % 3) * 0.06, 0.03, 0.012]} c="#C9CED6" r={0.005} sombra={false} />)}
        <B p={[0, -0.4, 0.02]} s={[0.6, 0.012, 0.012]} c="#6B7078" r={0.002} sombra={false} />
        {Array.from({ length: N }, (_, j) => {
          if (j >= u * N) return null;
          const a = sig(j / N);
          const b = sig((j + 1) / N);
          return <Seg key={j} a={[a[0], a[1], 0.03]} b={[b[0], b[1], 0.03]} w={0.016} c="#1D4ED8" />;
        })}
        <group position={ponta}>
          <group position={[dir[0] * k, dir[1] * k, dir[2] * k]} rotation={[0.3, 0, -0.5]}>
            <Cil r={0.05} h={0.9} c="#2563EB" />
            <Cil p={[0, -0.5, 0]} r={0.05} rTopo={0.012} h={0.12} c="#17181D" />
            <Cil p={[0, 0.3, 0]} r={0.056} h={0.06} c="#E2B341" />
          </group>
        </group>
        {marca && (
          <group position={[0.12, -0.12, 0.03]} rotation={[0, 0, -0.2]} scale={entrada(f - L.sol, 4)}>
            <mesh>
              <planeGeometry args={[0.6, 0.19]} />
              <meshBasicMaterial map={texA} transparent toneMapped={false} depthWrite={false} />
            </mesh>
            <B s={[0.62, 0.21, 0.004]} c="#2BB673" r={0.02} o={0.18} sombra={false} />
          </group>
        )}
        <group position={[0.12, -0.12 + stampY, 0.08]}>
          <B p={[0, 0.0, 0]} s={[0.4, 0.14, 0.12]} c="#2BB673" r={0.03} />
          <Cil p={[0, 0.2, 0]} r={0.05} h={0.3} c="#17181D" rot={[Math.PI / 2, 0, 0]} />
        </group>
      </group>
    </Peca>
  );
};

// ---------- s06: maquininha + calendario ----------
const E06: React.FC<{ f: number }> = ({ f }) => {
  const L = LINHAS[6];
  const rs = useTex("rs");
  const tr = useTex("trinta");
  const sab = useTex("sab");
  const prob = f >= L.prob && f < L.sol;
  const op = prob ? 0.4 : 1;
  const treme = prob ? Math.sin(f * 1.7) * 0.07 : 0;
  const rec = rampa(f, L.ev.trinta + 4, 18) * 0.3;
  const ok = f >= L.sol;
  return (
    <Peca n={6} f={f} plq="plq_sinal">
      <group position={[0.22, 0.36, -0.05]} rotation={[-0.15, 0, 0]}>
        <B s={[0.46, 0.72, 0.26]} c={COR.dourado} r={0.05} />
        <B p={[0, 0.2, 0.135]} s={[0.36, 0.22, 0.01]} c="#E8F7EC" r={0.01} sombra={false} />
        <mesh position={[0, 0.2, 0.142]}>
          <planeGeometry args={[0.3, 0.15]} />
          <meshBasicMaterial map={f >= L.ev.trinta ? tr : rs} transparent toneMapped={false} />
        </mesh>
        {Array.from({ length: 12 }, (_, k) => <B key={k} p={[-0.12 + (k % 3) * 0.12, -0.0 - Math.floor(k / 3) * 0.1, 0.135]} s={[0.085, 0.07, 0.02]} c="#F7F5F0" r={0.01} sombra={false} />)}
      </group>
      {rec > 0.01 && <B p={[0.22, 0.012, 0.15 + rec / 2]} s={[0.22, 0.01, rec]} c="#FFFFFF" r={0.002} />}
      <group position={[-0.24 + treme, 0.0, 0.0]}>
        <Fade op={op}>
          <group rotation={[0, 0, treme * 0.8]} position={[0, 0.26, 0]}>
            <B s={[0.42, 0.42, 0.08]} c="#FFFFFF" r={0.02} />
            <B p={[0, 0.17, 0.01]} s={[0.42, 0.1, 0.09]} c="#EF4444" r={0.02} />
            {[-0.12, 0.12].map((x) => <Cil key={x} p={[x, 0.24, 0]} r={0.025} h={0.1} c="#6B7078" rot={[Math.PI / 2, 0, 0]} />)}
            <mesh position={[0, -0.03, 0.043]}>
              <planeGeometry args={[0.3, 0.15]} />
              <meshBasicMaterial map={sab} transparent toneMapped={false} />
            </mesh>
          </group>
        </Fade>
        {ok && (
          <mesh position={[0, 0.24, 0.07]} scale={entrada(f - L.sol, 8)}>
            <torusGeometry args={[0.15, 0.02, 6, 20]} />
            <meshStandardMaterial color="#3DDC84" emissive="#3DDC84" emissiveIntensity={0.5} />
          </mesh>
        )}
      </group>
    </Peca>
  );
};

// ---------- s07: lente gigante + portal ----------
const E07: React.FC<{ f: number }> = ({ f }) => {
  const L = LINHAS[7];
  const t50 = useTex("lente");
  const c = centroCasa(7);
  const op = rampa(f, L.ini, 14) * (1 - rampa(f, L.fim - 12, 12));
  const arcos = Array.from({ length: 9 }, (_, k) => {
    const a = (k / 8) * Math.PI;
    return { x: Math.cos(a) * 1.05, y: Math.sin(a) * 1.05, a };
  });
  const cores = ["#F59E0B", "#3B82F6", "#A855F7", "#EF4444", "#22C55E"];
  return (
    <>
      <Peca n={7} f={f} plq="plq_lente">
        <group position={[0, 0.5, 0]} rotation={[Math.PI / 2, 0, 0]}>
          <Cil r={0.5} h={0.7} c="#0E0E10" seg={24} />
          <Cil p={[0, 0.28, 0]} r={0.52} h={0.045} c={COR.dourado} seg={24} />
          <Cil p={[0, -0.28, 0]} r={0.52} h={0.045} c={COR.dourado} seg={24} />
          <Cil p={[0, -0.355, 0]} r={0.4} h={0.02} c="#1B3A6B" e="#2563EB" ei={0.25} seg={24} />
          <Cil p={[0, -0.37, 0.1]} r={0.1} h={0.01} c="#BFD7FF" seg={12} />
        </group>
        <mesh position={[0, 1.003, 0]} rotation={[-Math.PI / 2, 0, 0]}>
          <planeGeometry args={[0.5, 0.17]} />
          <meshBasicMaterial map={t50} transparent toneMapped={false} />
        </mesh>
      </Peca>
      <Fade op={op}>
        <group position={[c[0], Y_CASA, c[2] - 1.4]} scale={[1, 0.7 + 0.3 * op, 1]}>
          <B p={[-1.05, 1.2, 0]} s={[0.22, 2.4, 0.22]} c="#F7F5F0" r={0.04} />
          <B p={[1.05, 1.2, 0]} s={[0.22, 2.4, 0.22]} c="#F7F5F0" r={0.04} />
          {arcos.map((a, k) => <B key={k} p={[a.x, 2.4 + a.y, 0]} s={[0.24, 0.3, 0.22]} c="#F7F5F0" r={0.04} rot={[0, 0, a.a - Math.PI / 2]} />)}
          {cores.map((col, k) => <B key={k} p={[-0.64 + k * 0.32, 1.0 + (k % 2 ? 0.3 : 0.55), -0.05]} s={[0.26, 0.9 + (k === 2 ? 0.8 : 0), 0.06]} c={col} e={col} ei={0.35} r={0.04} sombra={false} />)}
        </group>
      </Fade>
    </>
  );
};

// ---------- s08: bloco de slots ----------
const E08: React.FC<{ f: number }> = ({ f }) => {
  const L = LINHAS[8];
  const corrompe = f >= L.prob;
  const salva = f >= L.sol;
  const tr = f >= L.prob && f < L.prob + 24 ? Math.sin((f - L.prob) * 2.4) * 0.03 * (1 - (f - L.prob) / 24) : 0;
  const pulso = salva ? 0.7 + 0.3 * Math.sin((f - L.sol) * 0.5) : 0;
  return (
    <Peca n={8} f={f} plq="plq_slots">
      <B p={[0, 0.3, 0]} s={[0.9, 0.6, 0.4]} c="#17181D" r={0.05} />
      <B p={[0, 0.58, 0.0]} s={[0.78, 0.04, 0.3]} c="#0A0A0C" r={0.01} sombra={false} />
      <group position={[-0.22 + tr, 0.75, 0.0]}>
        <B s={[0.3, 0.4, 0.03]} c={corrompe ? "#EF4444" : "#2563EB"} r={0.02} e={corrompe ? "#EF4444" : "#2563EB"} ei={0.25} />
        <B p={[0, 0.14, 0.02]} s={[0.22, 0.07, 0.006]} c="#F7F5F0" r={0.003} sombra={false} />
        {corrompe && (
          <>
            <B p={[0, -0.03, 0.025]} s={[0.05, 0.26, 0.01]} c="#FFFFFF" r={0.004} rot={[0, 0, 0.7]} sombra={false} />
            <B p={[0, -0.03, 0.025]} s={[0.05, 0.26, 0.01]} c="#FFFFFF" r={0.004} rot={[0, 0, -0.7]} sombra={false} />
          </>
        )}
      </group>
      <group position={[0.22, 0.75, 0.0]} scale={1 + pulso * 0.04}>
        <B s={[0.3, 0.4, 0.03]} c={salva ? "#3DDC84" : "#2563EB"} r={0.02} e={salva ? "#3DDC84" : "#2563EB"} ei={salva ? 0.5 + pulso : 0.25} />
        <B p={[0, 0.14, 0.02]} s={[0.22, 0.07, 0.006]} c="#F7F5F0" r={0.003} sombra={false} />
      </group>
    </Peca>
  );
};

// ---------- s09: flash gigante + globo ----------
export const EstrondoFlash = (f: number) => {
  const d = f - LINHAS[9].sol;
  return d >= 2 && d < 6 ? 1 : 0;
};
const E09: React.FC<{ f: number }> = ({ f }) => {
  const L = LINHAS[9];
  const e = EstrondoFlash(f);
  const c = centroCasa(9);
  const yBola = lerp(6.5, 3.1, rampa(f, L.ini, 26)) + 3.4 * rampa(f, L.fim - 18, 18);
  return (
    <>
      <Peca n={9} f={f} plq="plq_flash">
        <B p={[0, 0.42, 0]} s={[0.5, 0.84, 0.36]} c="#17181D" r={0.05} />
        {[-0.12, 0, 0.12].map((x, k) => <B key={k} p={[x, 0.55, 0.19]} s={[0.07, 0.07, 0.02]} c={["#EF4444", "#F5C542", "#3DDC84"][k]} r={0.01} sombra={false} />)}
        <B p={[0, 0.3, 0.19]} s={[0.3, 0.12, 0.02]} c="#2A2C33" r={0.01} sombra={false} />
        <group position={[0, 0.98, 0.0]} rotation={[-0.45, 0, 0]}>
          <B s={[0.66, 0.36, 0.3]} c="#F7F5F0" r={0.05} />
          <B p={[0, 0.0, 0.16]} s={[0.56, 0.26, 0.02]} c="#FFFFFF" r={0.02} e="#FFFFFF" ei={0.25 + e * 4} o={0.85} sombra={false} />
        </group>
      </Peca>
      {f >= L.ini && f < L.fim && (
      <group position={[c[0], yBola, c[2]]} rotation={[0, f * 0.06, 0]}>
        <Fade op={1 - rampa(f, L.fim - 6, 6)}>
          <Cil p={[0, 3, 0]} r={0.012} h={6} c="#6B7078" seg={4} />
          <mesh castShadow>
            <icosahedronGeometry args={[0.38, 1]} />
            <meshStandardMaterial color="#C9CED6" metalness={0.9} roughness={0.15} flatShading emissive="#6B7280" emissiveIntensity={0.4} />
          </mesh>
        </Fade>
      </group>
      )}
    </>
  );
};

// ---------- s10: backup ----------
const E10: React.FC<{ f: number }> = ({ f }) => {
  const L = LINHAS[10];
  const queima = f >= L.prob;
  const tres = f >= L.sol;
  const mesa = posMesa(10);
  const prog = clamp01((f - L.ev.descarrega) / Math.max(10, L.prob - L.ev.descarrega));
  const op = rampa(f, L.ini, 12) * (1 - rampa(f, L.fim - 12, 12));
  const tex3 = useTex("tres_x");
  return (
    <>
      <Peca n={10} f={f} plq="plq_backup">
        {[-0.22, 0.22].map((x, k) => (
          <group key={k} position={[x, 0.07, 0.08]}>
            <B s={[0.4, 0.14, 0.32]} c={queima && k === 0 ? "#3A3D46" : "#C5CAD3"} r={0.03} />
            <B p={[0.12, 0.0, 0.165]} s={[0.05, 0.03, 0.01]} c={k === 0 ? (queima ? "#EF4444" : "#3DDC84") : tres ? "#3DDC84" : "#6B7078"} e={k === 0 ? (queima ? "#EF4444" : "#3DDC84") : tres ? "#3DDC84" : "#000000"} ei={0.8} r={0.003} sombra={false} />
          </group>
        ))}
        <Seg a={[-0.22, 0.15, 0.08]} b={[-0.1, 1.05, 0.0]} w={0.03} c="#2A2C33" />
        <Seg a={[0.22, 0.15, 0.08]} b={[0.1, 1.05, 0.0]} w={0.03} c={tres ? "#3DDC84" : "#2A2C33"} />
        <group position={[0, 1.35, 0]}>
          {[[0, 0, 0, 0.3], [-0.3, -0.07, 0, 0.22], [0.3, -0.07, 0, 0.22], [-0.12, 0.2, 0, 0.2], [0.14, 0.18, 0, 0.22]].map((q, k) => (
            <mesh key={k} position={[q[0], q[1], q[2]]} castShadow>
              <sphereGeometry args={[q[3], 8, 6]} />
              <meshStandardMaterial color="#FFFFFF" flatShading emissive={tres ? "#3DDC84" : "#000000"} emissiveIntensity={tres ? 0.45 : 0} />
            </mesh>
          ))}
        </group>
        {queima && f < L.prob + 100 && [0, 1, 2, 3, 4, 5].map((j) => {
          const t = (((f - L.prob - j * 6) % 36) + 36) % 36 / 36;
          const sx = (Math.sin(j * 7.3) * 0.5) * 0.12;
          return (
            <Esf key={j} p={[-0.22 + sx + t * 0.08, 0.2 + t * 1.0, 0.1 + sx]} r={0.07 + t * 0.12} c="#7A7F8C" o={0.85 * (1 - t)} seg={7} />
          );
        })}
        {tres && (
          <mesh position={[0.82, 1.55, 0.1]} scale={entrada(f - L.sol, 8) * 0.6}>
            <planeGeometry args={[0.9, 0.675]} />
            <meshBasicMaterial map={tex3} transparent toneMapped={false} depthWrite={false} />
          </mesh>
        )}
      </Peca>
      <Fade op={op}>
        <group position={[mesa[0], mesa[1], mesa[2]]} rotation={[0, rotRepouso(10), 0]}>
          <B p={[0, 0.62, 0]} s={[0.9, 0.06, 0.6]} c="#8B5E3C" r={0.02} />
          {[-0.4, 0.4].map((x) => [-0.25, 0.25].map((z) => <B key={`${x}${z}`} p={[x, 0.3, z]} s={[0.06, 0.6, 0.06]} c="#6F4A2F" r={0.01} />))}
          <B p={[0, 0.67, 0.0]} s={[0.54, 0.03, 0.36]} c="#9AA0AC" r={0.01} />
          <group position={[0, 0.685, -0.17]} rotation={[-0.25, 0, 0]}>
            <B p={[0, 0.17, 0]} s={[0.54, 0.36, 0.025]} c="#17181D" r={0.01} />
            <B p={[0, 0.17, 0.014]} s={[0.48, 0.3, 0.005]} c="#1B2A44" r={0.003} sombra={false} />
            <B p={[0, 0.08, 0.02]} s={[0.36, 0.05, 0.004]} c="#3A4358" r={0.003} sombra={false} />
            <B p={[-0.18 + (0.36 * prog) / 2, 0.08, 0.024]} s={[Math.max(0.001, 0.36 * prog), 0.05, 0.004]} c="#3DDC84" r={0.003} sombra={false} e="#3DDC84" ei={0.6} />
          </group>
        </group>
      </Fade>
    </>
  );
};

// ---------- s11: tablet ----------
const E11: React.FC<{ f: number }> = ({ f }) => {
  const L = LINHAS[11];
  const lit = f >= L.sol;
  const hop = (f - L.sol) / 12;
  const y = hop >= 0 && hop < 1 ? 0.18 * Math.sin(Math.PI * hop) : 0;
  return (
    <Peca n={11} f={f} plq="plq_galeria">
      <B p={[0, 0.03, -0.1]} s={[0.55, 0.05, 0.4]} c="#2A2D35" r={0.02} />
      <Seg a={[0, 0.05, -0.1]} b={[0, 0.5, -0.2]} w={0.06} c="#2A2D35" />
      <group position={[0, 0.72, -0.12]} rotation={[-0.22, 0, 0]}>
        <B s={[1.05, 0.75, 0.07]} c="#17181D" r={0.05} />
        <B p={[0, 0, 0.038]} s={[0.95, 0.65, 0.01]} c="#101114" r={0.01} sombra={false} />
        {Array.from({ length: 12 }, (_, k) => {
          const cor = FOTO_CORES[k % 4];
          return <B key={k} p={[-0.34 + (k % 4) * 0.227, 0.19 - Math.floor(k / 4) * 0.2, 0.046]} s={[0.2, 0.17, 0.008]} c={cor} r={0.004} e={cor} ei={lit ? 0.9 : 0.1} sombra={false} />;
        })}
        <group position={[0.38, -0.26 + y, 0.075]}>
          <B s={[0.18, 0.15, 0.06]} c={COR.dourado} r={0.02} e={COR.dourado} ei={lit ? 0.5 : 0} />
          <mesh position={[0, 0.1, 0]}>
            <torusGeometry args={[0.06, 0.02, 6, 10, Math.PI]} />
            <meshStandardMaterial color={COR.dourado} />
          </mesh>
        </group>
      </group>
    </Peca>
  );
};

// ---------- s12: balao de depoimento ----------
export const posBalao12 = (): V3 => {
  const p = posCli(12);
  return [p[0], Y_CASA + 2.3, p[2]];
};
export const ARCO_VOO = 36;
const E12: React.FC<{ f: number }> = ({ f }) => {
  const L = LINHAS[12];
  const base = posBalao12();
  const alvo = posCelularCasa3();
  const t = clamp01((f - L.sol) / ARCO_VOO);
  const e = easeInOutCubic(t);
  const p = mix(base, [alvo[0], alvo[1] + 0.9, alvo[2] + 0.4], e);
  const esc = easeOutBack((f - L.quedaIni) / 10) * lerp(1, 0.28, e);
  const voando = t < 1 && f >= L.quedaIni;
  const chegou = f >= L.sol + ARCO_VOO;
  return (
    <>
      <Peca n={12} f={f} plq="plq_depoimento" />
      {voando && (
        <group position={[p[0], p[1] + 1.2 * Math.sin(Math.PI * e), p[2]]} scale={Math.max(0.001, esc)}>
          <B s={[1.1, 0.62, 0.08]} c="#F5C542" r={0.2} />
          <Cone p={[-0.25, -0.38, 0]} r={0.12} h={0.2} c="#F5C542" rot={[0, 0, Math.PI]} />
          {Array.from({ length: 5 }, (_, k) => {
            const acesa = f >= L.ev.depoimento + k * 3;
            return (
              <mesh key={k} position={[-0.42 + k * 0.21, 0, 0.06]} scale={0.085 * (acesa ? 1.15 : 1)} geometry={geoEstrela()} rotation={[0, 0, 0]}>
                <meshStandardMaterial color={acesa ? "#FFFFFF" : "#9AA0AC"} emissive={acesa ? "#FFD25A" : "#000000"} emissiveIntensity={acesa ? 1.0 : 0} />
              </mesh>
            );
          })}
        </group>
      )}
      {chegou && (
        <group position={[alvo[0] + 0.28, alvo[1] + 0.45, alvo[2] + 0.1]} scale={entrada(f - L.sol - ARCO_VOO, 8)}>
          <Cil r={0.14} h={0.03} c={COR.dourado} rot={[Math.PI / 2, 0, 0]} seg={16} />
          <Coracao p={[0, 0, 0.04]} s={0.13} c="#FFFFFF" />
        </group>
      )}
    </>
  );
};

// ---------- s13: madrinha, balao e aliancas ----------
const E13: React.FC<{ f: number }> = ({ f }) => {
  const L = LINHAS[13];
  const c = posCli(13);
  const e = f >= L.toque ? easeOutBack((f - L.toque) / 8) : 0;
  return (
    <>
      <Peca n={13} f={f} plq="plq_indicacao">
        <mesh position={[-0.12, 0.2, 0]} rotation={[Math.PI / 2.3, 0, 0]}>
          <torusGeometry args={[0.15, 0.04, 8, 18]} />
          <meshStandardMaterial color={COR.dourado} metalness={0.3} roughness={0.4} />
        </mesh>
        <mesh position={[0.12, 0.2, 0.0]} rotation={[Math.PI / 2.3, 0, 0]}>
          <torusGeometry args={[0.15, 0.04, 8, 18]} />
          <meshStandardMaterial color="#F7F5F0" metalness={0.3} roughness={0.4} />
        </mesh>
      </Peca>
      {e > 0 && (
        <group position={[c[0] + 0.2, Y_CASA + 2.45, c[2] + 0.25]} scale={e}>
          <BalaoTex tex="bal_madrinha" w={1.2} h={0.5} />
        </group>
      )}
    </>
  );
};

export const Estacoes: React.FC<{ f: number }> = ({ f }) => (
  <group>
    <E01 f={f} />
    <E02 f={f} />
    <E03 f={f} />
    <E04 f={f} />
    <E05 f={f} />
    <E06 f={f} />
    <E07 f={f} />
    <E08 f={f} />
    <E09 f={f} />
    <E10 f={f} />
    <E11 f={f} />
    <E12 f={f} />
    <E13 f={f} />
  </group>
);

export { TOQUE_REL };
