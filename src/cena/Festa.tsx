import React from "react";
import { GLOBO, CASAL_AMIGOS } from "../dados/posicoes";
import { LINHAS, clamp01, easeInOutCubic } from "../util/tempo";

// globo espelhado + tres luzes coloridas girando em volta do casal (s04)
export const fatorFesta = (frame: number) => {
  const L = LINHAS[4];
  return Math.min(clamp01((frame - L.ini) / 20), 1 - clamp01((frame - (L.fim - 25)) / 25));
};

export const Festa: React.FC<{ frame: number; luz: number }> = ({ frame, luz }) => {
  const f = fatorFesta(frame);
  if (f <= 0) return null;
  const y = GLOBO[1] + (1 - easeInOutCubic(f)) * 3.5;
  const ang = frame * 0.07;
  const cores = ["#FF3DA5", "#2FD6FF", "#FFD25A"];
  return (
    <group>
      <mesh position={[GLOBO[0], y + 0.9, GLOBO[2]]}>
        <cylinderGeometry args={[0.015, 0.015, 3, 6]} />
        <meshStandardMaterial color="#2A2C33" />
      </mesh>
      <mesh position={[GLOBO[0], y, GLOBO[2]]} rotation={[0, frame * 0.05, 0]} castShadow>
        <icosahedronGeometry args={[0.38, 1]} />
        <meshStandardMaterial color="#D8DCE6" metalness={0.85} roughness={0.2} flatShading emissive="#6B7280" emissiveIntensity={0.3} />
      </mesh>
      {cores.map((c, i) => {
        const a = ang + (i * Math.PI * 2) / 3;
        return <pointLight key={i} color={c} intensity={22 * f * Math.max(luz, 0.5)} distance={7} position={[CASAL_AMIGOS[0] + Math.cos(a) * 1.6, 1.6, CASAL_AMIGOS[2] + Math.sin(a) * 1.6]} />;
      })}
    </group>
  );
};
