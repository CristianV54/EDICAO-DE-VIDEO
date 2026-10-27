import React from "react";
import { B, Cil, Esf, PlanoTex } from "../primitivas";
import { Plaquinha } from "./Plaquinha";
import { useTex } from "../Texturas";
import { easeOutBack } from "../../util/tempo";
import { PecaProps, prog } from "./tipos";

const N = 34;
const DUR = 34;
// curva de assinatura sobre a folha (coordenadas locais da folha)
const ponto = (u: number): [number, number] => [-0.22 + 0.44 * u, -0.28 + 0.045 * Math.sin(u * Math.PI * 7) - 0.03 * u];

// folha com linhas e caneta azul num suporte inclinado
export const P08Contrato: React.FC<PecaProps> = ({ fs }) => {
  const stamp = useTex("assinado");
  const u = prog(fs, DUR);
  const assinando = fs >= 0 && fs < DUR + 4;
  const [px, py] = ponto(u);
  const carimbo = easeOutBack(prog(fs - DUR, 8));
  const n = Math.floor(u * N);
  return (
    <group rotation={[0, -0.15, 0]}>
      <B p={[0, 0.05, 0]} s={[0.8, 0.1, 0.5]} c="#3A3D47" r={0.04} />
      <Plaquinha tex="plq_contrato" p={[0, 0.06, 0.27]} w={0.56} rot={[-0.6, 0, 0]} />
      <B p={[0, 0.42, -0.2]} s={[0.76, 0.8, 0.05]} c="#E9DFC9" r={0.02} rot={[-0.25, 0, 0]} />
      <group position={[0, 0.46, -0.1]} rotation={[-0.22, 0, 0]}>
        <B s={[0.7, 0.95, 0.04]} c="#FFFFFF" r={0.02} />
        {[0.38, 0.26, 0.14, 0.02, -0.1].map((y, i) => (
          <B key={i} p={[0, y, 0.025]} s={[0.54, 0.035, 0.01]} c="#C9CCD3" r={0.005} sombra={false} />
        ))}
        <B p={[-0.1, -0.28, 0.025]} s={[0.4, 0.012, 0.01]} c="#9AA0AC" r={0.003} sombra={false} />
        {Array.from({ length: n }, (_, i) => {
          const [x, y] = ponto(i / N);
          return <Esf key={i} p={[x, y, 0.035]} r={0.014} c="#1F3FA8" seg={5} />;
        })}
        {carimbo > 0 && <PlanoTex p={[0.0, -0.05, 0.04]} w={0.56} h={0.18} tex={stamp} rot={[0, 0, -0.2]} escala={carimbo} />}
        {assinando && (
          <group position={[px, py, 0.04]} rotation={[0.5, 0.2, -0.55]}>
            <Cil p={[0, 0.25, 0]} r={0.025} h={0.5} c="#3B82F6" seg={8} />
            <Cil r={0.025} rTopo={0.006} h={0.08} c="#17181D" seg={8} />
          </group>
        )}
      </group>
      {!assinando && (
        <group position={[0.5, 0.1, 0.2]} rotation={[0, 0.6, Math.PI / 2]}>
          <Cil r={0.03} h={0.5} c="#3B82F6" seg={8} />
          <Cil p={[0.27, 0, 0]} r={0.025} rTopo={0.006} h={0.08} c="#17181D" seg={8} />
        </group>
      )}
    </group>
  );
};
