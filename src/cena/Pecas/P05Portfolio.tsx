import React from "react";
import { B } from "../primitivas";
import { easeInOutCubic, easeOutBack } from "../../util/tempo";
import { PecaProps, prog } from "./tipos";

const FOTOS = [
  { c: "#7FB8E6", rot: -0.55, x: -0.38 },
  { c: "#F7B6C2", rot: 0, x: 0 },
  { c: "#A8D5A2", rot: 0.55, x: 0.38 },
];

export const P05Portfolio: React.FC<PecaProps> = ({ fs }) => {
  const abre = easeInOutCubic(prog(fs, 14));
  return (
    <group>
      <B p={[0, 0.07, 0]} s={[1.1, 0.14, 0.85]} c="#B38B26" r={0.05} />
      <B p={[0, 0.15, 0]} s={[1.0, 0.1, 0.78]} c="#F7F5F0" r={0.02} sombra={false} />
      {/* capa que abre em volta da lombada (fundo) */}
      <group position={[0, 0.165, -0.42]} rotation={[-abre * 2.9, 0, 0]}>
        <B p={[0, 0.0, 0.42]} s={[1.1, 0.09, 0.85]} c="#D4A537" r={0.05} />
        <B p={[0, 0.055, 0.42]} s={[0.7, 0.02, 0.5]} c="#7FB8E6" r={0.01} sombra={false} />
        <B p={[0, 0.07, 0.32]} s={[0.7, 0.02, 0.22]} c="#F7B6C2" r={0.01} sombra={false} />
      </group>
      {FOTOS.map((p, i) => {
        const e = easeOutBack(prog(fs - 12 - i * 4, 10));
        if (e <= 0) return null;
        return (
          <group key={i} position={[p.x * e, 0.21 + i * 0.012, 0.0]} rotation={[0, p.rot * e, 0]} scale={e}>
            <B p={[0, 0, 0.1]} s={[0.36, 0.02, 0.46]} c="#FFFFFF" r={0.01} />
            <B p={[0, 0.012, 0.07]} s={[0.3, 0.02, 0.32]} c={p.c} r={0.01} sombra={false} />
          </group>
        );
      })}
    </group>
  );
};
