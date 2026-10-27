import React, { useMemo } from "react";
import * as THREE from "three";
import { B } from "./primitivas";
import { LINHAS, clamp01, springQueda } from "../util/tempo";
import { TELAO } from "../dados/posicoes";
import { ESTADOS, EstadoTelao, criarCanvasTelao } from "./telaoDesenho";

// momentos em que o estado muda (frame, estado)
const trocas = (): [number, EstadoTelao][] => [
  [LINHAS[1].toque, "auto"],
  [LINHAS[1].sol, "manual"],
  [LINHAS[2].prob, "escura"],
  [LINHAS[2].sol, "cinquenta"],
  [LINHAS[3].prob, "corrompida"],
  [LINHAS[3].sol, "restaurada"],
  [LINHAS[4].prob, "festa_granulada"],
  [LINHAS[4].sol, "festa_flash"],
];
const TROCAS = trocas();
const FADE = 8;

export const estadoDoTelao = (frame: number): { atual: EstadoTelao; anterior: EstadoTelao | null; t: number } | null => {
  let k = -1;
  for (let i = 0; i < TROCAS.length; i++) if (frame >= TROCAS[i][0]) k = i;
  if (k < 0) return null;
  const t = clamp01((frame - TROCAS[k][0]) / FADE);
  return { atual: TROCAS[k][1], anterior: k > 0 ? TROCAS[k - 1][1] : null, t };
};

const Tela: React.FC<{ tex: THREE.Texture; opacidade: number; z: number }> = ({ tex, opacidade, z }) => (
  <mesh position={[0, 0, z]}>
    <planeGeometry args={[2.42, 1.6]} />
    <meshBasicMaterial map={tex} transparent opacity={opacidade} toneMapped={false} depthWrite={false} />
  </mesh>
);

export const Telao: React.FC<{ frame: number }> = ({ frame }) => {
  const texs = useMemo(() => {
    const m = {} as Record<EstadoTelao, THREE.CanvasTexture>;
    for (const e of ESTADOS) {
      const t = new THREE.CanvasTexture(criarCanvasTelao(e));
      t.colorSpace = THREE.SRGBColorSpace;
      m[e] = t;
    }
    return m;
  }, []);
  const inicio = LINHAS[1].toque;
  if (frame < inicio) return null;
  const esc = Math.min(1, Math.max(0.001, springQueda(frame - inicio)));
  const est = estadoDoTelao(frame)!;
  return (
    <group position={[TELAO[0], TELAO[1], TELAO[2]]} scale={esc}>
      {/* pedestal de 1,0 de altura */}
      <B p={[0, 0.5, 0]} s={[0.36, 1.0, 0.3]} c="#2A2D35" r={0.05} />
      <B p={[0, 0.04, 0]} s={[1.1, 0.08, 0.7]} c="#2A2D35" r={0.03} />
      {/* moldura 2,6 x 1,7 */}
      <group position={[0, 1.0 + 0.85, 0]}>
        <B s={[2.6, 1.7, 0.12]} c="#1C1C1F" r={0.06} />
        {est.anterior && <Tela tex={texs[est.anterior]} opacidade={1} z={0.065} />}
        <Tela tex={texs[est.atual]} opacidade={est.anterior ? est.t : 1} z={0.07} />
      </group>
    </group>
  );
};
