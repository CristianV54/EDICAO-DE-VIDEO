import React from "react";
import * as THREE from "three";
import { POS_PECA, TOPO_PLATAFORMA } from "../dados/roteiro";
import { LINHAS, clamp01 } from "../util/tempo";

const ALTURA_ARCO = 0.6;
const ALTURA_PONTA = TOPO_PLATAFORMA + 0.12;
const FRAMES_BOLINHA = 18;

type Cabo = { curva: THREE.CatmullRomCurve3; geo: THREE.TubeGeometry; total: number };
const cache = new Map<number, Cabo>();

// cabo `c` liga a peca c-1 a peca c (c = 2..13)
const cabo = (c: number): Cabo => {
  if (!cache.has(c)) {
    const [ax, az] = POS_PECA[c - 2];
    const [bx, bz] = POS_PECA[c - 1];
    const a = new THREE.Vector3(ax, ALTURA_PONTA, az);
    const b = new THREE.Vector3(bx, ALTURA_PONTA, bz);
    const m = a.clone().lerp(b, 0.5);
    m.y += ALTURA_ARCO;
    const curva = new THREE.CatmullRomCurve3([a, m, b]);
    const geo = new THREE.TubeGeometry(curva, 48, 0.04, 6, false);
    cache.set(c, { curva, geo, total: geo.index!.count });
  }
  return cache.get(c)!;
};

export const Cabos: React.FC<{ frame: number }> = ({ frame }) => {
  const itens: React.ReactNode[] = [];
  let bolinha: THREE.Vector3 | null = null;
  const sol13 = LINHAS[13].sol;

  for (let c = 2; c <= 13; c++) {
    const L = LINHAS[c];
    const p = clamp01((frame - L.caboIni) / Math.max(1, L.caboFim - L.caboIni));
    if (p <= 0) continue;
    const { curva, geo, total } = cabo(c);
    geo.setDrawRange(0, Math.floor((p * total) / 3) * 3);
    itens.push(
      <mesh key={c} geometry={geo} castShadow>
        <meshStandardMaterial color="#2A2C33" roughness={0.6} />
      </mesh>
    );
    // bolinha dourada percorre o cabo uma vez quando ele termina
    const u = (frame - L.caboFim) / FRAMES_BOLINHA;
    if (u >= 0 && u <= 1 && frame < sol13) bolinha = curva.getPoint(u);
    // percurso final (s13): todos os cabos em sequencia, 3 frames (0,1 s) por cabo
    const uf = (frame - (sol13 + (c - 2) * 3)) / 3;
    if (uf >= 0 && uf <= 1) bolinha = curva.getPoint(uf);
  }
  return (
    <group>
      {itens}
      {bolinha && (
        <mesh position={bolinha}>
          <sphereGeometry args={[0.1, 10, 8]} />
          <meshStandardMaterial color="#D4A537" emissive="#FFD25A" emissiveIntensity={2} />
        </mesh>
      )}
    </group>
  );
};
