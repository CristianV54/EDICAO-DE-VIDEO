import React from "react";
import { B, Cil, Esf, PlanoTex } from "../primitivas";
import { useTex } from "../Texturas";
import { easeOutBack } from "../../util/tempo";
import { PecaProps, prog } from "./tipos";

const N_ASSINA = 36;
const DUR_ASSINA = 36;
// curva de assinatura sobre a folha (coordenadas locais, folha 0.95 x 1.25)
const ponto = (u: number): [number, number] => [-0.3 + 0.6 * u, 0.4 + 0.07 * Math.sin(u * Math.PI * 7) - 0.05 * u];

export const P08Contrato: React.FC<PecaProps> = ({ fs }) => {
  const tex = useTex("assinado");
  const u = prog(fs, DUR_ASSINA);
  const assinando = fs >= 0 && fs < DUR_ASSINA + 4;
  const [px, pz] = ponto(u);
  const carimbo = easeOutBack(prog(fs - DUR_ASSINA, 8));
  const n = Math.floor(u * N_ASSINA);
  return (
    <group rotation={[0, -0.1, 0]}>
      <B p={[0, 0.02, 0]} s={[0.95, 0.04, 1.25]} c="#FFFFFF" r={0.015} />
      {[-0.45, -0.3, -0.15, 0, 0.15].map((z, i) => (
        <B key={i} p={[i === 4 ? -0.1 : 0, 0.045, z]} s={[i === 4 ? 0.5 : 0.7, 0.01, 0.04]} c="#C9CCD3" r={0.005} sombra={false} />
      ))}
      <B p={[-0.15, 0.045, 0.43]} s={[0.55, 0.01, 0.015]} c="#9AA0AC" r={0.003} sombra={false} />
      {/* rastro da assinatura */}
      {Array.from({ length: n }, (_, i) => {
        const [x, z] = ponto(i / N_ASSINA);
        return <Esf key={i} p={[x, 0.052, z]} r={0.018} c="#1F3FA8" seg={5} />;
      })}
      {/* caneta: em repouso na lateral; ao assinar, a ponta segue a curva */}
      {assinando ? (
        <group position={[px, 0.05, pz]} rotation={[0.55, 0, -0.55]}>
          <Cil p={[0, 0.32, 0]} r={0.035} h={0.62} c="#3B82F6" seg={8} />
          <Cil p={[0, 0.0, 0]} r={0.035} rTopo={0.008} h={0.1} c="#17181D" seg={8} />
          <Cil p={[0, 0.64, 0]} r={0.04} h={0.08} c="#D4A537" seg={8} />
        </group>
      ) : (
        <group position={[0.62, 0.06, 0.5]} rotation={[0, 0.6, Math.PI / 2]}>
          <Cil r={0.035} h={0.62} c="#3B82F6" seg={8} />
          <Cil p={[0.34, 0, 0]} r={0.03} rTopo={0.008} h={0.1} c="#17181D" seg={8} />
        </group>
      )}
      {carimbo > 0 && <PlanoTex p={[0.0, 0.07, 0.0]} w={0.82} h={0.26} tex={tex} rot={[-Math.PI / 2, 0, -0.2]} escala={carimbo} />}
    </group>
  );
};
