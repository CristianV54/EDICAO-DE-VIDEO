import React from "react";
import { Noiva, Noivo, NoivaCliente, NoivoCliente, NoivaIndicada, NoivoIndicado, PoseProps } from "./Personagem";
import type { Vec3 } from "../dados/roteiro";

export type TipoCasal = "amigos" | "cliente" | "indicado";
const PAR = {
  amigos: [Noiva, Noivo],
  cliente: [NoivaCliente, NoivoCliente],
  indicado: [NoivaIndicada, NoivoIndicado],
} as const;

type Props = {
  tipo: TipoCasal;
  position: Vec3;
  rotY?: number;
  olhar?: number;
  caminha?: number;
  opacidade?: number;
  acena?: number;
  balanco?: number;
  escala?: number;
  separacao?: number; // distancia lateral de cada um ao centro
  noiva?: Partial<Omit<PoseProps, "position">>; // ajustes so da noiva (primeira do par)
  noivo?: Partial<Omit<PoseProps, "position">>;
};

// dois personagens lado a lado; o centro do casal e `position`
export const Casal: React.FC<Props> = ({ tipo, position, rotY = 0, separacao = 0.34, noiva, noivo, ...pose }) => {
  const [A, Bp] = PAR[tipo];
  const resto: Omit<PoseProps, "position"> = pose;
  const defasa = pose.caminha ? pose.caminha + 0.8 : 0;
  return (
    <group position={position} rotation={[0, rotY, 0]}>
      <A position={[-separacao, 0, 0]} {...resto} {...noiva} />
      <Bp position={[separacao, 0, 0]} {...resto} caminha={defasa} {...noivo} />
    </group>
  );
};
