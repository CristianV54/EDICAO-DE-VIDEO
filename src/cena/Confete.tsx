import React from "react";
import { random } from "remotion";
import { LINHAS, FPS } from "../util/tempo";

const CORES = ["#D4A537", "#3B82F6", "#F7F5F0", "#FF4D4D", "#3DDC84"];
const PECAS = Array.from({ length: 150 }, (_, i) => ({
  x: (random(`confete-x-${i}`) - 0.5) * 12,
  z: -6 + random(`confete-z-${i}`) * 12,
  y0: random(`confete-y-${i}`) * 9,
  v: 0.8 + random(`confete-v-${i}`) * 0.7,
  rx: random(`confete-rx-${i}`) * 6.28,
  ry: random(`confete-ry-${i}`) * 6.28,
  wx: 1 + random(`confete-wx-${i}`) * 2.5,
  wy: 1 + random(`confete-wy-${i}`) * 2.5,
  cor: CORES[Math.floor(random(`confete-c-${i}`) * CORES.length)],
}));
const ALTURA = 9;

// 70 cubinhos de 0,08 caindo devagar; ao chegar embaixo reaparecem no topo
export const Confete: React.FC<{ frame: number }> = ({ frame }) => {
  const t = (frame - LINHAS[14].sol) / FPS;
  if (t < 0) return null;
  return (
    <group>
      {PECAS.map((c, i) => {
        const y = ALTURA - ((c.y0 + c.v * t) % ALTURA);
        return (
          <mesh key={i} position={[c.x, y + 0.3, c.z]} rotation={[c.rx + c.wx * t, c.ry + c.wy * t, 0]}>
            <boxGeometry args={[0.11, 0.11, 0.11]} />
            <meshStandardMaterial color={c.cor} emissive={c.cor} emissiveIntensity={0.3} />
          </mesh>
        );
      })}
    </group>
  );
};
