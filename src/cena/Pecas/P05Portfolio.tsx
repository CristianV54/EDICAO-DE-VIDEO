import React from "react";
import { B } from "../primitivas";
import { Plaquinha } from "./Plaquinha";
import { easeInOutCubic, easeOutBack } from "../../util/tempo";
import { PecaProps, prog } from "./tipos";

const FOTOS = ["#7FB8E6", "#F7B6C2", "#F5C542"];

// album dourado num pedestal baixo; abre em "separa" e recebe as fotos que voam do telao
export const P05Portfolio: React.FC<PecaProps> = ({ fs }) => {
  const abre = easeInOutCubic(prog(fs - 8, 14));
  return (
    <group rotation={[0, 0.1, 0]}>
      <B p={[0, 0.15, 0]} s={[0.95, 0.3, 0.8]} c="#3A3D47" r={0.06} />
      <Plaquinha tex="plq_portfolio" p={[0, 0.15, 0.42]} w={0.6} />
      <B p={[0, 0.37, 0]} s={[0.9, 0.14, 0.7]} c="#B38B26" r={0.05} />
      <B p={[0, 0.455, 0]} s={[0.8, 0.04, 0.6]} c="#F7F5F0" r={0.015} sombra={false} />
      {/* capa que abre em volta da lombada */}
      <group position={[0, 0.46, -0.36]} rotation={[-abre * 2.9, 0, 0]}>
        <B p={[0, 0, 0.36]} s={[0.9, 0.08, 0.72]} c="#D4A537" r={0.05} />
        <B p={[0, 0.05, 0.36]} s={[0.58, 0.02, 0.4]} c="#7FB8E6" r={0.01} sombra={false} />
        <B p={[0, 0.06, 0.28]} s={[0.58, 0.02, 0.18]} c="#F7B6C2" r={0.01} sombra={false} />
      </group>
      {FOTOS.map((c, i) => {
        const e = easeOutBack(prog(fs - 16 - i * 4, 10));
        if (e <= 0) return null;
        return (
          <group key={i} position={[(i - 1) * 0.3 * e, 0.5 + i * 0.012, 0]} rotation={[0, (i - 1) * 0.5 * e, 0]} scale={e}>
            <B s={[0.28, 0.02, 0.36]} c="#FFFFFF" r={0.01} />
            <B p={[0, 0.012, -0.02]} s={[0.23, 0.02, 0.25]} c={c} r={0.01} sombra={false} />
          </group>
        );
      })}
    </group>
  );
};
