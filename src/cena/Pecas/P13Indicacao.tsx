import React from "react";
import { Coracao } from "../primitivas";
import { Noiva, Noivo } from "../Personagem";
import { easeOutBack } from "../../util/tempo";
import { PecaProps, prog } from "./tipos";

export const P13Indicacao: React.FC<PecaProps> = ({ fq }) => {
  const c = easeOutBack(prog(fq - 4, 10));
  return (
    <group>
      <Noiva position={[-0.38, 0, 0]} rotY={0.35} escala={0.55} />
      <Noivo position={[0.38, 0, 0]} rotY={-0.35} escala={0.55} />
      {c > 0 && <Coracao p={[0, 1.2, 0.1]} s={0.3 * c} c="#D4A537" e="#D4A537" ei={0.6} />}
    </group>
  );
};
