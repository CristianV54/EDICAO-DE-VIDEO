import React from "react";
import { random } from "remotion";
import { LINHAS, FPS } from "../util/tempo";

const CORES = ["#D4A537", "#3B82F6", "#F7F5F0", "#FF4D4D", "#3DDC84"];
const PECAS = Array.from({ length: 90 }, (_, i) => ({
  x: (random(`confete-x-${i}`) - 0.5) * 18,
  z: -2 + random(`confete-z-${i}`) * 12,
  y0: 12 + random(`confete-y-${i}`) * 6,
  v: 3.2 + random(`confete-v-${i}`) * 2.6,
  rx: random(`confete-rx-${i}`) * 6.28,
  ry: random(`confete-ry-${i}`) * 6.28,
  wx: 2 + random(`confete-wx-${i}`) * 4,
  wy: 2 + random(`confete-wy-${i}`) * 4,
  cor: CORES[Math.floor(random(`confete-c-${i}`) * CORES.length)],
  t: 0.3 + random(`confete-t-${i}`) * 0.2,
}));
const PERIODO = 18; // altura percorrida antes de reaparecer no topo

export const Confete: React.FC<{ frame: number }> = ({ frame }) => {
  const t = (frame - LINHAS[14].sol) / FPS;
  if (t < 0) return null;
  return (
    <group>
      {PECAS.map((c, i) => (
        <mesh key={i} position={[c.x, c.y0 - ((c.v * t) % PERIODO), c.z]} rotation={[c.rx + c.wx * t, c.ry + c.wy * t, 0]}>
          <boxGeometry args={[c.t, c.t * 1.6, 0.02]} />
          <meshStandardMaterial color={c.cor} emissive={c.cor} emissiveIntensity={0.25} />
        </mesh>
      ))}
    </group>
  );
};
