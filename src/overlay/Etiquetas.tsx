import React from "react";
import { useCurrentFrame } from "remotion";
import * as THREE from "three";
import { ROTEIRO, POS_PECA, TOPO_PLATAFORMA, Etiqueta, Quando } from "../dados/roteiro";
import { cameraPorFrame } from "../cena/cameraPorFrame";
import { LINHAS, LARGURA, ALTURA, entrada, segDe } from "../util/tempo";
import { MONTSERRAT } from "../util/texto";

const COR_BOLINHA = { problema: "#FF4D4D", solucao: "#3DDC84", cinza: "#9AA0AC" };
// altura da etiqueta acima do topo da plataforma (1,4 por padrao; menor para pecas baixas, maior para as altas)
const ALTURA_ETIQUETA: Record<string, number> = {
  s01: 1.3, s02: 1.2, s03: 1.2, s04: 1.7, s05: 0.9, s06: 1.4, s07: 1.2,
  s08: 0.9, s09: 1.3, s10: 1.7, s11: 0.8, s12: 1.2, s13: 1.5,
};
const Y_MIN = 480; // abaixo do card de anotacoes
const Y_MAX = 1500;
const X_MIN = 60;
const X_MAX = 960;

const quandoFrame = (i: number, q: Quando): number | null => {
  const L = LINHAS[i];
  if (q === "problema") return L.prob;
  if (q === "segunda") return L.segunda;
  return L.sol;
};

// projeta um ponto do mundo com uma camera recriada com os mesmos parametros da cena
export const projetar = (frame: number, mundo: [number, number, number]) => {
  const pose = cameraPorFrame(frame);
  const cam = new THREE.PerspectiveCamera(pose.fov, LARGURA / ALTURA, 0.1, 1000);
  cam.position.set(...pose.pos);
  cam.lookAt(...pose.alvo);
  cam.updateMatrixWorld();
  const v = new THREE.Vector3(...mundo).project(cam);
  return { x: (v.x * 0.5 + 0.5) * LARGURA, y: (-v.y * 0.5 + 0.5) * ALTURA };
};

const ativa = (i: number, frame: number): { e: Etiqueta; ini: number } | null => {
  let achada: { e: Etiqueta; ini: number } | null = null;
  for (const e of ROTEIRO[i].etiquetas) {
    const q = quandoFrame(i, e.quando);
    if (q === null || frame < q) continue;
    if (e.ate) {
      const fimQ = quandoFrame(i, e.ate);
      if (fimQ !== null && frame >= fimQ) continue;
    }
    achada = { e, ini: q };
  }
  return achada;
};

export const Etiquetas: React.FC = () => {
  const frame = useCurrentFrame();
  const i = segDe(frame);
  const a = ativa(i, frame);
  if (!a) return null;
  const { e, ini } = a;
  let mundo: [number, number, number];
  if (e.alvo && e.alvo !== "peca") mundo = e.alvo.mundo;
  else {
    const [x, z] = POS_PECA[i - 1];
    mundo = [x, TOPO_PLATAFORMA + (ALTURA_ETIQUETA[ROTEIRO[i].id] ?? 1.4), z];
  }
  const p = projetar(frame, mundo);
  const larg = e.texto.length * 20 + 80;
  const x = Math.min(X_MAX - larg / 2, Math.max(X_MIN + larg / 2, p.x));
  const y = Math.min(Y_MAX, Math.max(Y_MIN, p.y));
  const escala = entrada(frame - ini, 6);
  return (
    <div
      style={{
        position: "absolute", left: x, top: y, transform: `translate(-50%, -50%) scale(${escala})`,
        display: "flex", alignItems: "center", gap: 12, padding: "12px 28px 12px 22px", borderRadius: 999,
        background: "#FFFFFF", border: "3px solid #1A1A1A", fontFamily: MONTSERRAT, fontWeight: 800, fontSize: 30,
        color: "#1A1A1A", whiteSpace: "nowrap", boxShadow: "0 6px 0 rgba(0,0,0,0.25)",
      }}
    >
      <div style={{ width: 14, height: 14, borderRadius: 7, background: COR_BOLINHA[e.tipo] }} />
      {e.texto}
    </div>
  );
};
