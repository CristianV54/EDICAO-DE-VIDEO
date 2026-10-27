import React from "react";
import * as THREE from "three";
import { PONTAS_CABOS } from "../dados/posicoes";
import { LINHAS, clamp01 } from "../util/tempo";

const RAIO = 0.045;
const RAIO_PONTA = 0.09;
const ARCO = 0.5;
export const FRAMES_DESENHO = 18; // 0,6 s
const FRAMES_BOLINHA = 18;
const FRAMES_POR_CABO_FINAL = 4; // ~0,12 s

type Cabo = { curva: THREE.CatmullRomCurve3; geo: THREE.TubeGeometry; total: number; a: THREE.Vector3; b: THREE.Vector3 };
const cache = new Map<string, Cabo>();
const cabo = (idx: number): Cabo => {
  const def = PONTAS_CABOS[idx];
  if (!cache.has(def.id)) {
    const a = new THREE.Vector3(...def.a);
    const b = new THREE.Vector3(...def.b);
    const m = a.clone().lerp(b, 0.5);
    m.y += ARCO;
    const curva = new THREE.CatmullRomCurve3([a, m, b]);
    const geo = new THREE.TubeGeometry(curva, 48, RAIO, 8, false);
    cache.set(def.id, { curva, geo, total: geo.index!.count, a, b });
  }
  return cache.get(def.id)!;
};

// frame em que cada cabo comeca a ser desenhado (na ordem de PONTAS_CABOS)
export const INICIO_CABOS: number[] = [
  LINHAS[5].sol, // telao -> album (em "separa")
  LINHAS[6].toque + 2, // album -> celular
  LINHAS[7].toque + 2, // celular -> proposta
  LINHAS[8].toque + 2, // proposta -> contrato
  LINHAS[9].toque + 2, // contrato -> maquininha
  LINHAS[10].toque + 2, // camera -> HD 1
  LINHAS[10].toque + 8, // camera -> HD 2
  LINHAS[10].toque + 14, // HD 2 -> nuvem
  LINHAS[11].toque + 2, // nuvem -> tablet
];

const Ponta: React.FC<{ p: THREE.Vector3 }> = ({ p }) => (
  <mesh position={p}>
    <sphereGeometry args={[RAIO_PONTA, 12, 10]} />
    <meshStandardMaterial color="#3B82F6" roughness={0.5} />
  </mesh>
);

export const Cabos: React.FC<{ frame: number }> = ({ frame }) => {
  const itens: React.ReactNode[] = [];
  let bolinha: THREE.Vector3 | null = null;
  const sol13 = LINHAS[13].sol;
  PONTAS_CABOS.forEach((_, c) => {
    const ini = INICIO_CABOS[c];
    const p = clamp01((frame - ini) / FRAMES_DESENHO);
    if (p <= 0) return;
    const { curva, geo, total, a, b } = cabo(c);
    geo.setDrawRange(0, Math.floor((p * total) / 3) * 3);
    itens.push(
      <group key={c}>
        <mesh geometry={geo} castShadow>
          <meshStandardMaterial color="#2A2C33" roughness={0.6} />
        </mesh>
        <Ponta p={a} />
        {p >= 1 && <Ponta p={b} />}
      </group>
    );
    // bolinha dourada percorre o cabo uma vez ao terminar
    const u = (frame - ini - FRAMES_DESENHO) / FRAMES_BOLINHA;
    if (u >= 0 && u <= 1 && frame < sol13) bolinha = curva.getPoint(u);
    // percurso final (s13): todos os cabos em sequencia
    const uf = (frame - (sol13 + c * FRAMES_POR_CABO_FINAL)) / FRAMES_POR_CABO_FINAL;
    if (uf >= 0 && uf <= 1) bolinha = curva.getPoint(uf);
  });
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
