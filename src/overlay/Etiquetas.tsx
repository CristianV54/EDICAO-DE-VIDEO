import React from "react";
import { useCurrentFrame } from "remotion";
import * as THREE from "three";
import { ROTEIRO, Etiqueta, Quando } from "../dados/roteiro";
import { cameraPorFrame } from "../cena/cameraPorFrame";
import { LINHAS, LARGURA, ALTURA, entrada, segDe } from "../util/tempo";
import { MONTSERRAT } from "../util/texto";

const COR_BOLINHA = { problema: "#FF4D4D", solucao: "#3DDC84", cinza: "#9AA0AC" };
const Y_MIN = 480; // abaixo do card de anotacoes
const Y_MAX = 1500;
const X_MIN = 60;
const X_MAX = 960;

const quandoFrame = (i: number, q: Quando, fracao?: number): number | null => {
  const L = LINHAS[i];
  if (fracao !== undefined) return L.ini + Math.round(fracao * (L.fim - L.ini));
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
    const q = quandoFrame(i, e.quando, e.fracao);
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
  const mundo = e.alvo!;
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
