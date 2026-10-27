import React from "react";
import { B, Cil, PlanoTex } from "../primitivas";
import { useTex } from "../Texturas";
import { pop } from "../../util/tempo";
import { PecaProps } from "./tipos";

export const P07Proposta: React.FC<PecaProps> = ({ fs }) => {
  const tex = useTex("proposta");
  const escala = fs >= 0 ? pop(fs, 10, 1.3) : 1;
  return (
    <group position={[0, 0.0, 0]} rotation={[0, 0.2, 0]}>
      <group position={[0, 0.5, 0]} rotation={[0.32, 0, 0]}>
        <B s={[0.92, 0.05, 1.25]} c="#FFFFFF" r={0.02} e={fs >= 0 ? "#FFF3C4" : "#000000"} ei={fs >= 0 ? 0.25 : 0} />
        <PlanoTex p={[0, 0.03, -0.45]} w={0.74} h={0.18} tex={tex} rot={[-Math.PI / 2, 0, 0]} />
        {[-0.2, -0.05, 0.1].map((z, i) => (
          <B key={i} p={[0, 0.03, z]} s={[0.7 - i * 0.1, 0.01, 0.05]} c="#C9CCD3" r={0.005} sombra={false} />
        ))}
        <group position={[0.22, 0.04, 0.38]} scale={escala}>
          <Cil r={0.17} h={0.04} c="#D4A537" seg={14} />
          <Cil p={[0, 0.03, 0]} r={0.1} h={0.03} c="#B38B26" seg={14} />
        </group>
      </group>
      {/* apoio atras */}
      <B p={[0, 0.35, -0.66]} s={[0.9, 0.7, 0.06]} c="#E9DFC9" r={0.02} rot={[0.0, 0, 0]} />
    </group>
  );
};
