import React from "react";
import { Coracao } from "../primitivas";
import { easeOutBack } from "../../util/tempo";
import { PecaProps, prog } from "./tipos";

// coracao dourado que surge entre os dois casais (os casais ficam em Cena3D)
export const P13Indicacao: React.FC<PecaProps> = ({ fq }) => {
  const c = easeOutBack(prog(fq, 10));
  return c > 0 ? <Coracao p={[0, 0, 0]} s={0.5 * c} c="#D4A537" e="#D4A537" ei={0.7} /> : null;
};
