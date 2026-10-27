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
  fila?: number; // angulo da linha que une os dois (padrao: o mesmo do rumo); permite virar para um lado e ficar lado a lado para a camera
  noiva?: Partial<Omit<PoseProps, "position">>; // ajustes so da noiva (primeira do par)
  noivo?: Partial<Omit<PoseProps, "position">>;
};

// dois personagens lado a lado; o centro do casal e `position`
export const Casal: React.FC<Props> = ({ tipo, position, rotY = 0, separacao = 0.34, fila, noiva, noivo, ...pose }) => {
  const [A, Bp] = PAR[tipo];
  const resto: Omit<PoseProps, "position"> = pose;
  const defasa = pose.caminha ? pose.caminha + 0.8 : 0;
  const f = fila ?? rotY;
  const dx = Math.cos(f) * separacao;
  const dz = -Math.sin(f) * separacao;
  return (
    <group position={position}>
      <A position={[-dx, 0, -dz]} rotY={rotY} {...resto} {...noiva} />
      <Bp position={[dx, 0, dz]} rotY={rotY} {...resto} caminha={defasa} {...noivo} />
    </group>
  );
};
