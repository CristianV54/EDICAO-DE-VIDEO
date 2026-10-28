import React, { useLayoutEffect, useRef } from "react";
import * as THREE from "three";
import { B, Cil, Coracao, COR, Esf, Cone, geoEstrela } from "./primitivas";
import { Seg } from "./Personagem";
import { CameraModelo } from "./CameraModelo";
import { Fade } from "./Fade";
import { useTex, useTelao, usePixelado, NomeTex } from "./Texturas";
import { amigos as _amigos, fotografo, maoNoivaMundo } from "./estadoElenco";
import {
  ALTURA_PED, ENTRADA_MADRINHA as _EM, V3, Y_CASA, centroCasa, posCli, posFot, posPeca, posMesa, azVista,
} from "../dados/posicoes";
import { CAMINHADA_MADRINHA, LINHAS, TOQUE_REL, clamp01, easeInOutCubic, easeOutBack, entrada, lerp, springQueda } from "../util/tempo";

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

// amarelo da revelacao ("Esse e o X"): a peca inteira clareia para amarelo por ~1,3 s, como na referencia
const AMARELO = new THREE.Color("#FFE27A");
const Tinte: React.FC<{ k: number; children: React.ReactNode }> = ({ k, children }) => {
  const ref = useRef<THREE.Group>(null);
  useLayoutEffect(() => {
    ref.current?.traverse((obj) => {
      const m = (obj as THREE.Mesh).material as THREE.Material | THREE.Material[] | undefined;
      if (!m) return;
      (Array.isArray(m) ? m : [m]).forEach((mm) => {
        const cm = mm as THREE.MeshStandardMaterial;
        if (!cm.color) return;
        if (!cm.userData.cor0) cm.userData.cor0 = cm.color.clone();
        cm.color.copy(cm.userData.cor0 as THREE.Color).lerp(AMARELO, k * 0.75);
      });
    });
  });
  return <group ref={ref}>{children}</group>;
};
export const pulsoNome = (f: number, n: number): number => {
  const d = f - LINHAS[n].nome;
  if (d < 0 || d > 44) return 0;
  return d < 5 ? d / 5 : d < 32 ? 1 : 1 - (d - 32) / 12;
};

// pedestal + peca: surgem juntos, caindo do alto com spring depois de digitado o comando do card ("Entao")
// pedestal de cada peca: cores saturadas, como as pecas azul, roxa e amarela da referencia
const COR_PED = ["", "#2F9BEB", "#E2B341", "#EC6FA6", "#7B5CE6", "#14B8A6", "#3DDC84", "#F59E42", "#4F8BF5", "#EF5B5B", "#8E6CF0", "#22B8CF", "#F5C542", "#F58BB0"];
const Peca: React.FC<{ n: number; f: number; plq: NomeTex; children?: React.ReactNode }> = ({ n, f, plq, children }) => {
  const L = LINHAS[n];
  const p = posPeca(n);
  const s = springQueda(f - L.quedaIni);
  if (f < L.quedaIni) return null;
  return (
    <group position={[p[0], p[1] + (1 - s) * 4.5, p[2]]}>
      <Tinte k={pulsoNome(f, n)}>
        <B p={[0, -ALTURA_PED / 2, 0]} s={[0.9, ALTURA_PED, 0.9]} c={COR_PED[n]} r={0.03} />
        <Plaq tex={plq} />
        {children}
      </Tinte>
    </group>
  );
};

// calendario flutuante entre o fotografo e o cliente: s05 (data desmarcada, com X) e s06 (data prometida, depois reservada)
const Calendario: React.FC<{ n: number; op: number; treme?: number; x?: boolean; ok?: number; esc?: number }> = ({ n, op, treme = 0, x = false, ok = 0, esc = 1 }) => {
  const c = centroCasa(n);
  const sab = useTex("sab");
  if (op <= 0.01 || esc <= 0.01) return null;
  return (
    <Fade op={op}>
      <group position={[c[0] + 0.05 + treme, Y_CASA + 1.5, c[2] + 0.5]} rotation={[0, (azVista(n) * Math.PI) / 180, treme * 0.8]} scale={esc * 1.5}>
        <B s={[0.5, 0.46, 0.06]} c="#FFFFFF" r={0.02} />
        <B p={[0, 0.17, 0.01]} s={[0.5, 0.12, 0.07]} c="#EF4444" r={0.02} />
        {[-0.14, 0.14].map((px) => <Cil key={px} p={[px, 0.25, 0]} r={0.022} h={0.1} c="#6B7078" rot={[Math.PI / 2, 0, 0]} />)}
        <mesh position={[0, -0.04, 0.033]}>
          <planeGeometry args={[0.36, 0.18]} />
          <meshBasicMaterial map={sab} transparent toneMapped={false} />
        </mesh>
        {x && (
          <>
            <B p={[0, -0.03, 0.05]} s={[0.07, 0.5, 0.02]} c="#EF4444" r={0.01} rot={[0, 0, 0.8]} sombra={false} />
            <B p={[0, -0.03, 0.05]} s={[0.07, 0.5, 0.02]} c="#EF4444" r={0.01} rot={[0, 0, -0.8]} sombra={false} />
          </>
        )}
        {ok > 0 && (
          <mesh position={[0.2, -0.17, 0.06]} scale={ok}>
            <torusGeometry args={[0.1, 0.02, 6, 20]} />
            <meshStandardMaterial color="#3DDC84" emissive="#3DDC84" emissiveIntensity={0.6} />
          </mesh>
        )}
      </group>
    </Fade>
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
  const hd = entrada(f - L.prob, 8) * (1 - rampa(f, L.entao, 6)); // o HD trancado some no "Entao" (o celular cai)
  const cad = L.ev.instagram;
  const bal = f >= L.sol ? easeOutBack((f - L.sol) / 8) : 0;
  const out = 1 - rampa(f, L.nome - 10, 8); // o balao sai antes da revelacao (o close do nome nao o corta)
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
          <group position={[-0.55, 1.5, 0.35]} scale={bal}>
            <BalaoTex tex="bal_quanto" w={0.95} h={0.33} />
          </group>
        </Fade>
      </Peca>
      {f >= L.prob && f < L.entao + 8 && (
        <group position={[base[0] - 0.25, base[1] - ALTURA_PED + 0.12, base[2] + 1.0]} scale={hd * 1.9}>
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

const NumeroTex: React.FC<{ tex: NomeTex }> = ({ tex }) => {
  const t = useTex(tex);
  return (
    <mesh>
      <planeGeometry args={[1, 1]} />
      <meshBasicMaterial map={t} transparent toneMapped={false} depthWrite={false} />
    </mesh>
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
      {tAudio >= 0 && tAudio <= 2.3 && (() => {
        const e = easeInOutCubic(clamp01(tAudio));
        const p = mix(a, b, e);
        const op = 1 - clamp01((tAudio - 1.9) / 0.4); // a resposta em audio fica ~1 s ao lado da noiva
        return (
          <Fade op={op}>
            <group position={[p[0], p[1] + 0.25 * Math.sin(Math.PI * e), p[2]]} scale={1.6}>
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
  const cal = rampa(f, L.prob, 8) * (1 - rampa(f, L.entao + 2, 10)); // "desmarcou": a data com um X flutua entre os dois ate o "Entao"
  return (
    <>
    <Calendario n={5} op={cal} x />
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
    </>
  );
};

// ---------- s06: maquininha + calendario ----------
const E06: React.FC<{ f: number }> = ({ f }) => {
  const L = LINHAS[6];
  const rs = useTex("rs");
  const tr = useTex("trinta");
  const treme = Math.sin(f * 1.7) * 0.05;
  const fantasma = rampa(f, L.prob, 8) * (1 - rampa(f, L.entao - 4, 8)); // "so promessa": a data fantasma, tremendo, ate a maquininha cair
  const solido = rampa(f, L.sol - 6, 8) * (1 - rampa(f, L.nome - 10, 8)); // "data reservada": solida com o aro verde; sai antes da revelacao para nao tapar a peca
  const ok = f >= L.sol ? entrada(f - L.sol, 8) : 0;
  const rec = rampa(f, L.ev.trinta + 4, 18) * 0.3;
  return (
    <>
      <Calendario n={6} op={fantasma * 0.4} treme={treme} />
      <Calendario n={6} op={solido} ok={ok} />
      <Peca n={6} f={f} plq="plq_sinal">
        <group position={[0, 0.36, -0.05]} rotation={[-0.15, 0, 0]}>
          <B s={[0.46, 0.72, 0.26]} c={COR.dourado} r={0.05} />
          <B p={[0, 0.2, 0.135]} s={[0.36, 0.22, 0.01]} c="#E8F7EC" r={0.01} sombra={false} />
          <mesh position={[0, 0.2, 0.142]}>
            <planeGeometry args={[0.3, 0.15]} />
            <meshBasicMaterial map={f >= L.ev.trinta ? tr : rs} transparent toneMapped={false} />
          </mesh>
          {Array.from({ length: 12 }, (_, k) => <B key={k} p={[-0.12 + (k % 3) * 0.12, -0.0 - Math.floor(k / 3) * 0.1, 0.135]} s={[0.085, 0.07, 0.02]} c="#F7F5F0" r={0.01} sombra={false} />)}
        </group>
        {rec > 0.01 && <B p={[0, 0.012, 0.15 + rec / 2]} s={[0.22, 0.01, rec]} c="#FFFFFF" r={0.002} />}
      </Peca>
    </>
  );
};

// ---------- s07: lente gigante (a igreja escura e dada pela luz, pela placa e pela etiqueta) ----------
const E07: React.FC<{ f: number }> = ({ f }) => {
  const t50 = useTex("lente");
  return (
    <>
      <Peca n={7} f={f} plq="plq_lente">
        <group position={[0, 0.44, 0]} rotation={[Math.PI / 2, 0, 0]} scale={0.86}>
          <Cil r={0.5} h={0.7} c="#0E0E10" seg={24} />
          <Cil p={[0, 0.0, 0]} r={0.515} h={0.12} c="#2A2C33" seg={24} />
          <Cil p={[0, -0.14, 0]} r={0.515} h={0.12} c="#2A2C33" seg={24} />
          <Cil p={[0, 0.3, 0]} r={0.52} h={0.045} c={COR.dourado} seg={24} />
          <Cil p={[0, -0.3, 0]} r={0.52} h={0.045} c={COR.dourado} seg={24} />
          <Cil p={[0, 0.35, 0]} r={0.43} h={0.03} c="#1B3A6B" e="#2563EB" ei={0.5} seg={24} />
          <Cil p={[0, 0.372, 0]} r={0.28} h={0.012} c="#3A63B8" e="#5B8DEF" ei={0.5} seg={20} />
          <Cil p={[0.1, 0.382, -0.1]} r={0.09} h={0.01} c="#EAF3FF" e="#FFFFFF" ei={0.6} seg={12} />
        </group>
        <mesh position={[0, 0.915, 0]} rotation={[-Math.PI / 2, 0, 0]}>
          <planeGeometry args={[0.43, 0.15]} />
          <meshBasicMaterial map={t50} transparent toneMapped={false} />
        </mesh>
      </Peca>
    </>
  );
};

// ---------- s08: camera gigante com a portinha dos dois slots ----------
const CartaoSD: React.FC<{ cor: string; x?: boolean; ok?: boolean; ei?: number }> = ({ cor, x = false, ok = false, ei = 0.25 }) => (
  <group>
    <B s={[0.22, 0.03, 0.17]} c={cor} r={0.012} e={cor} ei={ei} />
    <B p={[0.04, 0.02, 0]} s={[0.1, 0.012, 0.11]} c="#F7F5F0" r={0.004} sombra={false} />
    <B p={[-0.085, 0.02, 0]} s={[0.035, 0.012, 0.12]} c="#E2B341" r={0.002} sombra={false} />
    {x && (
      <>
        <B p={[0.04, 0.03, 0]} s={[0.03, 0.01, 0.15]} c="#FFFFFF" r={0.004} rot={[0, 0.9, 0]} sombra={false} />
        <B p={[0.04, 0.03, 0]} s={[0.03, 0.01, 0.15]} c="#FFFFFF" r={0.004} rot={[0, -0.9, 0]} sombra={false} />
      </>
    )}
    {ok && (
      <>
        <B p={[0.02, 0.03, 0.02]} s={[0.03, 0.01, 0.07]} c="#FFFFFF" r={0.004} rot={[0, 0.8, 0]} sombra={false} />
        <B p={[0.065, 0.03, -0.015]} s={[0.03, 0.01, 0.12]} c="#FFFFFF" r={0.004} rot={[0, -0.8, 0]} sombra={false} />
      </>
    )}
  </group>
);
const E08: React.FC<{ f: number }> = ({ f }) => {
  const L = LINHAS[8];
  const porta = rampa(f, L.ev.slots, 10);
  const in1 = rampa(f, L.ev.slots + 6, 14);
  const in2 = rampa(f, L.ev.slots + 14, 14);
  const grava = f >= L.sol;
  const falha1 = f >= L.sol + 30; // o cartao 1 falha; o 2 salva
  const pulso = grava ? 0.5 + 0.5 * Math.sin((f - L.sol) * 0.5) : 0;
  const fp = posFot(8);
  const propOp = rampa(f, L.prob, 8) * (1 - rampa(f, L.quedaIni - 2, 8)); // problema: o cartao com X flutua acima da camera do fotografo
  const bob = Math.sin((f - L.prob) * 0.2) * 0.05;
  const foto = (k: number, y: number) => {
    const t = clamp01((f - (L.sol + k * 5)) / 14);
    if (t <= 0 || t >= 1) return null;
    return <B key={k} p={[lerp(1.3, 0.5, easeInOutCubic(t)), y + 0.35 * Math.sin(Math.PI * (1 - t)), 0.0]} s={[0.13, 0.02, 0.1]} c={FOTO_CORES[k % 4]} r={0.004} />;
  };
  return (
    <>
      <Fade op={propOp}>
        <group position={[fp[0] + 0.55, Y_CASA + 1.45 + bob, fp[2] + 0.2]} rotation={[0.5, 0.3, 0]} scale={1.7}>
          <CartaoSD cor="#EF4444" x ei={0.5} />
        </group>
      </Fade>
      <Peca n={8} f={f} plq="plq_slots">
        <group position={[0, 0.5, 0]} rotation={[0, -0.8, 0]} scale={1.25}>
          <CameraModelo escala={1} lente="kit" modo="m" />
          <B p={[0.382, 0, -0.04]} s={[0.012, 0.32, 0.27]} c="#050507" r={0.004} sombra={false} />
          {[0.075, -0.075].map((y) => <B key={y} p={[0.388, y, -0.04]} s={[0.012, 0.045, 0.23]} c="#2A2C33" r={0.003} sombra={false} />)}
          <group position={[0.39, 0, -0.18]} rotation={[0, porta * 1.9, 0]}>
            <B p={[0.012, 0, 0.14]} s={[0.025, 0.34, 0.29]} c="#2A2C33" r={0.008} />
            <B p={[0.028, 0, 0.26]} s={[0.012, 0.1, 0.03]} c="#6B7078" r={0.003} sombra={false} />
          </group>
          {in1 > 0 && (
            <group position={[lerp(1.0, 0.43, in1), 0.075, -0.04]}>
              <CartaoSD cor={falha1 ? "#EF4444" : grava ? "#3DDC84" : "#2563EB"} x={falha1} ei={0.25 + (falha1 ? 0.3 : pulso * 0.5)} />
            </group>
          )}
          {in2 > 0 && (
            <group position={[lerp(1.0, 0.43, in2), -0.075, -0.04]}>
              <CartaoSD cor={grava ? "#3DDC84" : "#2563EB"} ok={falha1} ei={0.25 + pulso * 0.7} />
            </group>
          )}
          {foto(0, 0.075)}
          {foto(1, -0.075)}
        </group>
      </Peca>
    </>
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
  const beam = f - L.sol >= 1 && f - L.sol < 10;
  const tetoLuz = beam ? 1 - Math.abs(((f - L.sol - 4) / 5)) : 0;
  const c = centroCasa(9);
  const yBola = lerp(6.5, 3.9, rampa(f, L.ini, 26)) + 3.4 * rampa(f, L.fim - 18, 18);
  return (
    <>
      <Peca n={9} f={f} plq="plq_flash">
        <B p={[0, 0.05, 0]} s={[0.36, 0.1, 0.24]} c="#2A2C33" r={0.02} />
        <B p={[0, 0.5, 0]} s={[0.5, 0.74, 0.3]} c="#202228" r={0.06} />
        <B p={[0, 0.62, 0.156]} s={[0.3, 0.2, 0.01]} c="#BFE6C8" r={0.01} e="#7DDC9A" ei={0.35} sombra={false} />
        {[-0.1, 0.0].map((x, k) => <B key={k} p={[x, 0.36, 0.156]} s={[0.07, 0.06, 0.02]} c="#6B7078" r={0.01} sombra={false} />)}
        <Cil p={[0.14, 0.36, 0.16]} r={0.075} h={0.03} c="#8A8F9C" rot={[Math.PI / 2, 0, 0]} seg={14} sombra={false} />
        <group position={[0, 0.9, 0.0]} rotation={[-1.05, 0, 0]}>
          <B p={[0, 0.17, 0]} s={[0.62, 0.36, 0.3]} c="#202228" r={0.05} />
          <B p={[0, 0.17, 0.158]} s={[0.54, 0.28, 0.02]} c="#FFFFFF" r={0.02} e="#FFFFFF" ei={0.3 + e * 4} o={0.9} sombra={false} />
          <B p={[0, 0.39, -0.1]} s={[0.4, 0.2, 0.012]} c="#FFFFFF" r={0.004} sombra={false} />
          {beam && (
            <mesh position={[0, 0.17, 0.158 + 0.8]} rotation={[-Math.PI / 2, 0, 0]}>
              <coneGeometry args={[0.65, 1.6, 20, 1, true]} />
              <meshBasicMaterial color="#FFF3B8" transparent opacity={0.38 * (1 - (f - L.sol - 1) / 9)} depthWrite={false} side={THREE.DoubleSide} />
            </mesh>
          )}
        </group>
        {/* o "teto": uma placa branca pendurada por cordas acima do flash recebe a luz e devolve */}
        {tetoLuz > 0 && (
          <group position={[0, 1.9, 0.6]}>
            <B s={[1.3, 0.05, 0.9]} c="#F7F5F0" r={0.01} e="#FFF3B8" ei={tetoLuz * 1.4} sombra={false} />
          </group>
        )}
      </Peca>
      {f >= L.ini && f < L.fim && (
      <group position={[c[0] + 1.35, yBola, c[2] - 0.9]} rotation={[0, f * 0.06, 0]}>
        <Fade op={1 - rampa(f, L.fim - 6, 6)}>
          <Cil p={[0, 3, 0]} r={0.012} h={6} c="#6B7078" seg={4} />
          <mesh castShadow>
            <icosahedronGeometry args={[0.24, 1]} />
            <meshStandardMaterial color="#C9CED6" metalness={0.9} roughness={0.15} flatShading emissive="#6B7280" emissiveIntensity={0.4} />
          </mesh>
        </Fade>
      </group>
      )}
    </>
  );
};

// ---------- s10: backup ----------
// fluxo de fotinhas (quadradinhos coloridos) de um ponto a outro, com atraso entre elas
const Fluxo: React.FC<{ f: number; a: V3; b: V3; t0: number; n?: number; dur?: number; arco?: number }> = ({ f, a, b, t0, n = 5, dur = 18, arco = 0.35 }) => (
  <>
    {Array.from({ length: n }, (_, k) => {
      const t = clamp01((f - (t0 + k * 4)) / dur);
      if (t <= 0 || t >= 1) return null;
      const e = easeInOutCubic(t);
      return <B key={k} p={[lerp(a[0], b[0], e), lerp(a[1], b[1], e) + arco * Math.sin(Math.PI * e), lerp(a[2], b[2], e)]} s={[0.1, 0.1, 0.02]} c={FOTO_CORES[k % 4]} r={0.006} e={FOTO_CORES[k % 4]} ei={0.3} sombra={false} />;
    })}
  </>
);
const E10: React.FC<{ f: number }> = ({ f }) => {
  const L = LINHAS[10];
  const queima = f >= L.prob;
  const s1 = f >= L.sol;
  const s2 = f >= L.ev.dois;
  const s3 = f >= L.ev.nuvem;
  const mesa = posMesa(10);
  const prog = clamp01((f - L.ev.descarrega) / Math.max(10, L.prob - L.ev.descarrega));
  const op = rampa(f, L.chegada + 4, 12) * (1 - rampa(f, L.entao, 8)); // a mesa (cena do problema) sai quando o backup cai, para nao tapar as pecas novas
  const fumaca = queima && f < L.prob + 130;
  const tHD = useTex("hd");
  return (
    <>
      <Fade op={op}>
        <group position={[mesa[0], mesa[1], mesa[2]]} rotation={[0, (azVista(10) * Math.PI) / 180, 0]} scale={1.2}>
          <B p={[0, 0.62, 0]} s={[1.2, 0.06, 0.6]} c="#8B5E3C" r={0.02} />
          {[-0.55, 0.55].map((x) => [-0.25, 0.25].map((z) => <B key={`${x}${z}`} p={[x, 0.3, z]} s={[0.06, 0.6, 0.06]} c="#6F4A2F" r={0.01} />))}
          <B p={[0.22, 0.67, 0.0]} s={[0.54, 0.03, 0.36]} c="#9AA0AC" r={0.01} />
          <group position={[0.22, 0.685, -0.17]} rotation={[-0.25, 0, 0]}>
            <B p={[0, 0.17, 0]} s={[0.54, 0.36, 0.025]} c="#17181D" r={0.01} />
            <B p={[0, 0.17, 0.014]} s={[0.48, 0.3, 0.005]} c={queima ? "#4A1F24" : "#1B2A44"} r={0.003} sombra={false} />
            <B p={[0, 0.08, 0.02]} s={[0.36, 0.05, 0.004]} c="#3A4358" r={0.003} sombra={false} />
            <B p={[-0.18 + (0.36 * prog) / 2, 0.08, 0.024]} s={[Math.max(0.001, 0.36 * prog), 0.05, 0.004]} c={queima ? "#EF4444" : "#3DDC84"} r={0.003} sombra={false} e={queima ? "#EF4444" : "#3DDC84"} ei={0.6} />
          </group>
          {/* o HD unico ao lado do notebook: recebe as fotos e queima */}
          <group position={[-0.36, 0.7, 0.08]} scale={1.4}>
            <B p={[0, 0.05, 0]} s={[0.3, 0.1, 0.22]} c={queima ? "#2A2127" : "#C5CAD3"} r={0.03} />
            <B p={[0.09, 0.05, 0.115]} s={[0.05, 0.03, 0.01]} c={queima ? "#EF4444" : "#3DDC84"} e={queima ? "#EF4444" : "#3DDC84"} ei={0.9} r={0.003} sombra={false} />
            {queima && f < L.prob + 110 && [-0.08, 0.0, 0.08].map((x, k) => (
              <mesh key={k} position={[x, 0.17 + 0.03 * Math.sin((f + k * 5) * 0.8), 0.02]} scale={[1, 0.8 + 0.4 * Math.abs(Math.sin((f + k * 7) * 0.6)), 1]}>
                <coneGeometry args={[0.055, 0.2, 7]} />
                <meshStandardMaterial color="#FF8A1F" emissive="#FF5A00" emissiveIntensity={1.6} />
              </mesh>
            ))}
            {fumaca && [0, 1, 2, 3, 4, 5].map((j) => {
              const t = (((f - L.prob - j * 6) % 36) + 36) % 36 / 36;
              return <Esf key={j} p={[Math.sin(j * 7.3) * 0.06 + t * 0.06, 0.15 + t * 0.9, Math.cos(j * 3.1) * 0.05]} r={0.06 + t * 0.12} c="#7A7F8C" o={0.85 * (1 - t)} seg={7} />;
            })}
          </group>
        </group>
      </Fade>
      <Peca n={10} f={f} plq="plq_backup">
        {[-0.3, 0.3].map((x, k) => {
          const on = k === 0 ? s1 : s2;
          return (
            <group key={k} position={[x, 0.07, 0.1]}>
              <B s={[0.42, 0.14, 0.32]} c="#C5CAD3" r={0.03} />
              <B p={[0.12, 0.0, 0.165]} s={[0.05, 0.03, 0.01]} c={on ? "#3DDC84" : "#6B7078"} e={on ? "#3DDC84" : "#000000"} ei={0.9} r={0.003} sombra={false} />
              <mesh position={[-0.06, 0.0, 0.166]}>
                <planeGeometry args={[0.18, 0.09]} />
                <meshBasicMaterial map={tHD} transparent toneMapped={false} />
              </mesh>
            </group>
          );
        })}
        {s3 && <Seg a={[-0.3, 0.15, 0.1]} b={[-0.08, 1.0, 0.0]} w={0.03} c="#3DDC84" />}
        {s3 && <Seg a={[0.3, 0.15, 0.1]} b={[0.08, 1.0, 0.0]} w={0.03} c="#3DDC84" />}
        {/* nuvem: plataforma de upload (seta verde) + cumulos */}
        <group position={[0, 1.45, 0]} scale={Math.max(0.001, entrada(f - L.ev.nuvem + 12, 10))}>
          <B p={[0, -0.28, 0]} s={[0.9, 0.08, 0.5]} c={s3 ? "#3DDC84" : "#9AA0AC"} r={0.04} e={s3 ? "#3DDC84" : undefined} ei={s3 ? 0.5 : 0} />
          {[[0, 0, 0, 0.32], [-0.3, -0.08, 0, 0.24], [0.3, -0.08, 0, 0.24], [-0.13, 0.2, 0, 0.22], [0.15, 0.17, 0, 0.24]].map((q, k) => (
            <mesh key={k} position={[q[0], q[1], q[2]]} castShadow>
              <sphereGeometry args={[q[3], 8, 6]} />
              <meshStandardMaterial color="#FFFFFF" flatShading emissive={s3 ? "#3DDC84" : "#000000"} emissiveIntensity={s3 ? 0.4 : 0} />
            </mesh>
          ))}
          {s3 && (
            <group position={[0, 0.0, 0.3]} scale={entrada(f - L.ev.nuvem, 8)}>
              <B p={[0, -0.04, 0]} s={[0.1, 0.18, 0.04]} c="#3DDC84" r={0.01} e="#3DDC84" ei={0.9} />
              <Cone p={[0, 0.12, 0]} r={0.12} h={0.16} c="#3DDC84" />
            </group>
          )}
        </group>
        {s1 && [[-0.3, 0.52], [0.3, 0.52], [0.78, 1.5]].map((q, k) => {
          const quando = [L.sol, L.ev.dois, L.ev.nuvem][k];
          if (f < quando) return null;
          return (
            <group key={k} position={[q[0], q[1], 0.12]} scale={entrada(f - quando, 6) * 0.42}>
              <NumeroTex tex={(["n1", "n2", "n3"] as NomeTex[])[k]} />
            </group>
          );
        })}
        {/* fotos: notebook -> HD 1 (solucao), HD 1 -> HD 2 (dois), HD 2 -> nuvem (nuvem) */}
        <Fluxo f={f} a={[-1.1, 0.8, 0.9]} b={[-0.3, 0.3, 0.1]} t0={L.sol} />
        <Fluxo f={f} a={[-0.3, 0.3, 0.1]} b={[0.3, 0.3, 0.1]} t0={L.ev.dois} arco={0.4} />
        <Fluxo f={f} a={[0.3, 0.3, 0.1]} b={[0, 1.4, 0.0]} t0={L.ev.nuvem} dur={22} arco={0.1} />
      </Peca>
    </>
  );
};

// ---------- s11: tablet ----------
const E11: React.FC<{ f: number }> = ({ f }) => {
  const L = LINHAS[11];
  const px = usePixelado();
  const fotos = useTelao("portfolio");
  const tBaixar = useTex("baixar");
  const tWhats = useTex("whats");
  const c11 = centroCasa(11);
  const propOp = rampa(f, L.ev.whatsapp, 8) * (1 - rampa(f, L.entao + 2, 10)); // problema: o celular da noiva, ampliado, com a foto em blocos
  const lit = f >= L.sol;
  const hop = (f - L.sol) / 12;
  const y = hop >= 0 && hop < 1 ? 0.18 * Math.sin(Math.PI * hop) : 0;
  return (
    <>
    <Fade op={propOp}>
      <group position={[c11[0] + 0.05, Y_CASA + 1.5, c11[2] + 0.5]} rotation={[0, (azVista(11) * Math.PI) / 180, 0.06]} scale={1.7}>
        <B s={[0.36, 0.64, 0.05]} c="#101114" r={0.04} />
        <mesh position={[0, 0, 0.028]}>
          <planeGeometry args={[0.32, 0.58]} />
          <meshBasicMaterial map={px} toneMapped={false} />
        </mesh>
        <mesh position={[0, 0.3, 0.06]}>
          <planeGeometry args={[0.32, 0.11]} />
          <meshBasicMaterial map={tWhats} transparent toneMapped={false} />
        </mesh>
      </group>
    </Fade>
    <Peca n={11} f={f} plq="plq_galeria">
      <B p={[0, 0.03, -0.1]} s={[0.55, 0.05, 0.4]} c="#2A2D35" r={0.02} />
      <Seg a={[0, 0.05, -0.1]} b={[0, 0.5, -0.2]} w={0.06} c="#2A2D35" />
      <group position={[0, 0.72, -0.12]} rotation={[-0.22, 0, 0]}>
        <B s={[1.05, 0.75, 0.07]} c="#17181D" r={0.05} />
        <B p={[0, 0, 0.038]} s={[0.95, 0.65, 0.01]} c="#101114" r={0.01} sombra={false} />
        <mesh position={[0, 0.0, 0.046]}>
          <planeGeometry args={[0.95, 0.65]} />
          <meshBasicMaterial map={lit ? fotos : px} toneMapped={false} />
        </mesh>
        <group position={[0.3, -0.27 + y, 0.075]} scale={lit ? 1 : 0.001}>
          <mesh>
            <planeGeometry args={[0.36, 0.14]} />
            <meshBasicMaterial map={tBaixar} transparent toneMapped={false} />
          </mesh>
        </group>
      </group>
    </Peca>
    </>
  );
};

// ---------- s12: o depoimento (cartao de 5 estrelas) nasce na propria casa 12, ao lado da noiva que chorou ----------
const E12: React.FC<{ f: number }> = ({ f }) => {
  const L = LINHAS[12];
  const heart = f >= L.sol ? entrada(f - L.sol, 8) : 0;
  return (
    <Peca n={12} f={f} plq="plq_depoimento">
      <B p={[0, 0.5, -0.05]} s={[1.05, 0.62, 0.08]} c="#F5C542" r={0.2} />
      <Cone p={[-0.25, 0.1, -0.05]} r={0.12} h={0.2} c="#F5C542" rot={[0, 0, Math.PI]} />
      {Array.from({ length: 5 }, (_, k) => {
        const acesa = f >= Math.max(L.toque + 6, L.ev.depoimento) + k * 3;
        return (
          <mesh key={k} position={[-0.4 + k * 0.2, 0.5, 0.0]} scale={0.085 * (acesa ? 1.15 : 1)} geometry={geoEstrela()}>
            <meshStandardMaterial color={acesa ? "#FFFFFF" : "#9AA0AC"} emissive={acesa ? "#FFD25A" : "#000000"} emissiveIntensity={acesa ? 1.0 : 0} />
          </mesh>
        );
      })}
      {heart > 0 && (
        <group position={[0.55, 0.95, 0.0]} scale={heart}>
          <Cil r={0.14} h={0.03} c={COR.dourado} rot={[Math.PI / 2, 0, 0]} seg={16} />
          <Coracao p={[0, 0, 0.04]} s={0.13} c="#FFFFFF" />
        </group>
      )}
    </Peca>
  );
};

// ---------- s13: madrinha, balao e aliancas ----------
const E13: React.FC<{ f: number }> = ({ f }) => {
  const L = LINHAS[13];
  const c = posCli(13);
  const chega = L.prob + CAMINHADA_MADRINHA;
  const e = f >= chega ? easeOutBack((f - chega) / 8) : 0;
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
        <group position={[c[0] - 0.2, Y_CASA + 2.0, c[2] + 0.25]} scale={e}>
          <BalaoTex tex="bal_madrinha" w={1.05} h={0.43} />
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
