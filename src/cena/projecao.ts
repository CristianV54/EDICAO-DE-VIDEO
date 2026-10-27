import * as THREE from "three";
import { cameraPorFrame } from "./cameraPorFrame";
import { ALTURA, LARGURA } from "../util/tempo";

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

export type Ret = { x0: number; x1: number; y0: number; y1: number };
export const projetarCaixa = (frame: number, c: [number, number, number], t: [number, number, number]): Ret => {
  const r: Ret = { x0: Infinity, x1: -Infinity, y0: Infinity, y1: -Infinity };
  for (const sx of [-1, 1]) for (const sy of [-1, 1]) for (const sz of [-1, 1]) {
    const p = projetar(frame, [c[0] + (sx * t[0]) / 2, c[1] + (sy * t[1]) / 2, c[2] + (sz * t[2]) / 2]);
    r.x0 = Math.min(r.x0, p.x); r.x1 = Math.max(r.x1, p.x); r.y0 = Math.min(r.y0, p.y); r.y1 = Math.max(r.y1, p.y);
  }
  return r;
};
