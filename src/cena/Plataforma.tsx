import React from "react";
import { B } from "./primitivas";
import { PLATAFORMA } from "../dados/posicoes";

// plataforma grafite (12 x 0,5 x 7) com tapete azul e faixa de LEDs dourados na frente
export const Plataforma: React.FC = () => {
  const { largura: L, profundidade: P } = PLATAFORMA;
  return (
    <group>
      <B p={[0, 0.025, 0]} s={[13.5, 0.05, 8.5]} c="#3B7BF2" r={0.02} />
      <B p={[0, 0.25, 0]} s={[L, 0.5, P]} c="#2A2D35" r={0.06} />
      <B p={[0, 0.485, 0]} s={[L - 0.3, 0.03, P - 0.3]} c="#32353E" r={0.01} sombra={false} />
      {Array.from({ length: 24 }, (_, i) => (
        <mesh key={i} position={[-5.5 + i * (11 / 23), 0.22, P / 2 + 0.005]}>
          <boxGeometry args={[0.36, 0.07, 0.02]} />
          <meshStandardMaterial color="#E2B341" emissive="#E2B341" emissiveIntensity={1.4} />
        </mesh>
      ))}
    </group>
  );
};
