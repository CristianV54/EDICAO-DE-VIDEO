import React from "react";
import { B, Cil, PlanoTex } from "../primitivas";
import { Plaquinha } from "./Plaquinha";
import { useTex } from "../Texturas";
import { pop } from "../../util/tempo";
import { PecaProps } from "./tipos";

// folha branca num suporte inclinado
export const P07Proposta: React.FC<PecaProps> = ({ fs }) => {
  const tex = useTex("folha_proposta");
  const brilha = fs >= 0 && fs < 40;
  return (
    <group rotation={[0, -0.12, 0]}>
      <B p={[0, 0.05, 0]} s={[0.8, 0.1, 0.5]} c="#3A3D47" r={0.04} />
      <Plaquinha tex="plq_proposta" p={[0, 0.06, 0.27]} w={0.56} rot={[-0.6, 0, 0]} />
      <B p={[0, 0.42, -0.2]} s={[0.76, 0.8, 0.05]} c="#E9DFC9" r={0.02} rot={[-0.25, 0, 0]} />
      <group position={[0, 0.46, -0.1]} rotation={[-0.22, 0, 0]}>
        <B s={[0.7, 0.95, 0.04]} c="#FFFFFF" r={0.02} e={brilha ? "#FFF3C4" : "#000000"} ei={brilha ? 0.6 : 0} />
        <PlanoTex p={[0, 0.34, 0.025]} w={0.56} h={0.14} tex={tex} />
        {[0.12, 0.0, -0.12].map((y, i) => (
          <B key={i} p={[0, y, 0.025]} s={[0.5 - i * 0.08, 0.04, 0.01]} c="#C9CCD3" r={0.005} sombra={false} />
        ))}
        <group position={[0.2, -0.3, 0.03]} rotation={[Math.PI / 2, 0, 0]} scale={fs >= 0 ? pop(fs, 10, 1.3) : 1}>
          <Cil r={0.12} h={0.04} c="#D4A537" seg={14} />
          <Cil p={[0, 0.03, 0]} r={0.07} h={0.03} c="#B38B26" seg={14} />
        </group>
      </group>
    </group>
  );
};
