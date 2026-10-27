import React from "react";
import { B } from "./primitivas";

export const Plataforma: React.FC = () => (
  <group>
    <B p={[0, 0.025, 0]} s={[12.5, 0.05, 8]} c="#3B7BF2" r={0.02} />
    <B p={[0, 0.25, 0]} s={[11, 0.5, 6.5]} c="#17181D" r={0.06} />
    <B p={[0, 0.49, 0]} s={[10.8, 0.03, 6.3]} c="#23252D" r={0.01} sombra={false} />
    {/* borda superior */}
    <B p={[0, 0.47, 3.2]} s={[11, 0.06, 0.12]} c="#22242B" r={0.02} sombra={false} />
    <B p={[0, 0.47, -3.2]} s={[11, 0.06, 0.12]} c="#22242B" r={0.02} sombra={false} />
    <B p={[-5.45, 0.47, 0]} s={[0.12, 0.06, 6.5]} c="#22242B" r={0.02} sombra={false} />
    <B p={[5.45, 0.47, 0]} s={[0.12, 0.06, 6.5]} c="#22242B" r={0.02} sombra={false} />
    {/* faixa de LEDs dourados na frente */}
    {Array.from({ length: 22 }, (_, i) => (
      <mesh key={i} position={[-5 + i * (10 / 21), 0.22, 3.255]}>
        <boxGeometry args={[0.32, 0.07, 0.02]} />
        <meshStandardMaterial color="#E2B341" emissive="#E2B341" emissiveIntensity={1.4} />
      </mesh>
    ))}
  </group>
);
