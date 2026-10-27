import React from "react";
import { B, Cil } from "../primitivas";
import { PecaProps } from "./tipos";

export const P04Flash: React.FC<PecaProps> = ({ fs }) => {
  const estouro = fs >= 0 && fs < 4;
  const brilho = estouro ? 3 : fs >= 4 ? 0.5 : 0.25;
  return (
    <group>
      <B p={[0, 0.05, 0]} s={[0.6, 0.1, 0.45]} c="#2A2C33" r={0.03} />
      <B p={[0, 0.5, 0]} s={[0.34, 0.8, 0.3]} c="#17181D" r={0.06} />
      <Cil p={[0, 0.2, 0.16]} r={0.06} h={0.05} c="#D4A537" rot={[Math.PI / 2, 0, 0]} seg={12} />
      <group position={[0, 1.05, 0.08]} rotation={[0.18, 0, 0]}>
        <B s={[0.72, 0.5, 0.36]} c="#F7F5F0" r={0.07} />
        <B p={[0, 0, 0.19]} s={[0.6, 0.4, 0.04]} c="#FFF3C4" e="#FFF3C4" ei={brilho} o={0.95} r={0.02} sombra={false} />
      </group>
      {estouro && <pointLight position={[0, 1.1, 0.9]} intensity={60} distance={9} color="#FFFFFF" />}
    </group>
  );
};
