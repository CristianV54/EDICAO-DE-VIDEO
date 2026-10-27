import React from "react";
import { RoundedBox } from "@react-three/drei";
import * as THREE from "three";
import type { Vec3 } from "../dados/roteiro";

export const COR = {
  dourado: "#D4A537",
  douradoLed: "#E2B341",
  azul: "#3B82F6",
  branco: "#F7F5F0",
  verde: "#3DDC84",
  vermelho: "#FF4D4D",
  preto: "#17181D",
  amarelo: "#F5C542",
};

type BProps = {
  p?: Vec3;
  s: Vec3;
  c: string;
  r?: number;
  rot?: Vec3;
  e?: string;
  ei?: number;
  o?: number;
  sombra?: boolean;
  rough?: number;
};

// caixa de cantos arredondados (low-poly)
export const B: React.FC<BProps> = ({ p = [0, 0, 0], s, c, r = 0.05, rot = [0, 0, 0], e, ei = 0, o, sombra = true, rough = 0.75 }) => {
  const raio = Math.max(0.002, Math.min(r, Math.min(s[0], s[1], s[2]) / 2 - 0.002));
  return (
    <RoundedBox args={s} radius={raio} smoothness={2} position={p} rotation={rot} castShadow={sombra} receiveShadow>
      <meshStandardMaterial color={c} emissive={e ?? "#000000"} emissiveIntensity={ei} roughness={rough} metalness={0} transparent={o !== undefined && o < 1} opacity={o ?? 1} />
    </RoundedBox>
  );
};

type CilProps = { p?: Vec3; r: number; h: number; c: string; rot?: Vec3; seg?: number; e?: string; ei?: number; rTopo?: number; sombra?: boolean };
export const Cil: React.FC<CilProps> = ({ p = [0, 0, 0], r, h, c, rot = [0, 0, 0], seg = 20, e, ei = 0, rTopo, sombra = true }) => (
  <mesh position={p} rotation={rot} castShadow={sombra} receiveShadow>
    <cylinderGeometry args={[rTopo ?? r, r, h, seg]} />
    <meshStandardMaterial color={c} emissive={e ?? "#000000"} emissiveIntensity={ei} roughness={0.7} />
  </mesh>
);

type EsfProps = { p?: Vec3; r: number; c: string; seg?: number; e?: string; ei?: number; o?: number; s?: Vec3 };
export const Esf: React.FC<EsfProps> = ({ p = [0, 0, 0], r, c, seg = 10, e, ei = 0, o, s = [1, 1, 1] }) => (
  <mesh position={p} scale={s} castShadow receiveShadow>
    <sphereGeometry args={[r, seg, Math.max(6, seg - 2)]} />
    <meshStandardMaterial color={c} emissive={e ?? "#000000"} emissiveIntensity={ei} roughness={0.8} transparent={o !== undefined && o < 1} opacity={o ?? 1} />
  </mesh>
);

type ConeProps = { p?: Vec3; r: number; h: number; c: string; seg?: number; rot?: Vec3 };
export const Cone: React.FC<ConeProps> = ({ p = [0, 0, 0], r, h, c, seg = 14, rot = [0, 0, 0] }) => (
  <mesh position={p} rotation={rot} castShadow receiveShadow>
    <coneGeometry args={[r, h, seg]} />
    <meshStandardMaterial color={c} roughness={0.8} />
  </mesh>
);

type PlanoTexProps = { p: Vec3; w: number; h: number; tex: THREE.Texture; rot?: Vec3; escala?: number };
export const PlanoTex: React.FC<PlanoTexProps> = ({ p, w, h, tex, rot = [0, 0, 0], escala = 1 }) => (
  <mesh position={p} rotation={rot} scale={escala}>
    <planeGeometry args={[w, h]} />
    <meshBasicMaterial map={tex} transparent toneMapped={false} depthWrite={false} />
  </mesh>
);

// coracao e estrela extrudados (geometrias em cache)
const cache = new Map<string, THREE.BufferGeometry>();
export const geoCoracao = (): THREE.BufferGeometry => {
  if (!cache.has("coracao")) {
    const s = new THREE.Shape();
    s.moveTo(0, -0.5);
    s.bezierCurveTo(-0.9, 0.05, -0.55, 0.75, 0, 0.35);
    s.bezierCurveTo(0.55, 0.75, 0.9, 0.05, 0, -0.5);
    const g = new THREE.ExtrudeGeometry(s, { depth: 0.25, bevelEnabled: true, bevelSize: 0.05, bevelThickness: 0.05, bevelSegments: 1, curveSegments: 6 });
    g.center();
    cache.set("coracao", g);
  }
  return cache.get("coracao")!;
};
export const geoEstrela = (): THREE.BufferGeometry => {
  if (!cache.has("estrela")) {
    const s = new THREE.Shape();
    for (let i = 0; i < 10; i++) {
      const raio = i % 2 === 0 ? 1 : 0.45;
      const a = Math.PI / 2 + (i * Math.PI) / 5;
      const x = Math.cos(a) * raio;
      const y = Math.sin(a) * raio;
      if (i === 0) s.moveTo(x, y);
      else s.lineTo(x, y);
    }
    s.closePath();
    const g = new THREE.ExtrudeGeometry(s, { depth: 0.4, bevelEnabled: false });
    g.center();
    cache.set("estrela", g);
  }
  return cache.get("estrela")!;
};

export const Coracao: React.FC<{ p: Vec3; s: number; c: string; e?: string; ei?: number; rot?: Vec3 }> = ({ p, s, c, e, ei = 0, rot = [0, 0, 0] }) => (
  <mesh position={p} scale={s} rotation={rot} geometry={geoCoracao()} castShadow>
    <meshStandardMaterial color={c} emissive={e ?? "#000000"} emissiveIntensity={ei} roughness={0.5} />
  </mesh>
);
