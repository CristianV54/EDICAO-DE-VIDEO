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
export const P08Contrato: React.FC<PecaProps> = ({ fs, fp9 = -9999, fs9 = -9999 }) => {
  // s09: em "promessa" a folha fica semitransparente com o contorno piscando; em "reservada" volta solida com brilho verde
  const fraca = fp9 >= 0 && fs9 < 0;
  const op = fraca ? 0.35 : 1;
  const piscaContorno = fraca && Math.floor(fp9 / 4) % 2 === 0;
  const brilhoVerde = fs9 >= 0 && fs9 < 14;

  const stamp = useTex("assinado");
  const u = prog(fs, DUR);
  const assinando = fs >= 0 && fs < DUR + 4;
  const [px, py] = ponto(u);
  const carimbo = easeOutBack(prog(fs - DUR, 8));
  const n = Math.floor(u * N);
  return (
    <group rotation={[0, -0.15, 0]}>
      <B p={[0, 0.05, 0]} s={[1.4, 0.1, 0.55]} c="#3A3D47" r={0.04} />
      <Plaquinha tex="plq_contrato" p={[0, 0.06, 0.27]} w={0.56} rot={[-0.6, 0, 0]} />
      <B p={[0, 0.42, -0.2]} s={[0.76, 0.8, 0.05]} c="#E9DFC9" r={0.02} rot={[-0.25, 0, 0]} />
      <group position={[0, 0.46, -0.1]} rotation={[-0.22, 0, 0]}>
        {(fraca || brilhoVerde) && <B p={[0, 0, -0.012]} s={[0.76, 1.01, 0.04]} c={brilhoVerde ? "#3DDC84" : "#FF4D4D"} e={brilhoVerde ? "#3DDC84" : "#FF4D4D"} ei={brilhoVerde ? 1.6 : piscaContorno ? 1.6 : 0.1} o={brilhoVerde || piscaContorno ? 1 : 0.35} r={0.02} sombra={false} />}
        <B s={[0.7, 0.95, 0.04]} c="#FFFFFF" r={0.02} o={op} e={brilhoVerde ? "#3DDC84" : "#000000"} ei={brilhoVerde ? 0.8 : 0} />
        {[0.38, 0.26, 0.14, 0.02, -0.1].map((y, i) => (
          <B key={i} p={[0, y, 0.025]} s={[0.54, 0.035, 0.01]} c="#C9CCD3" r={0.005} sombra={false} o={op} />
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
        <group position={[0.12, 0.13, 0.12]} rotation={[0, 0.25, Math.PI / 2]}>
          <Cil r={0.03} h={0.5} c="#3B82F6" seg={8} />
          <Cil p={[0.25, 0, 0]} r={0.025} rTopo={0.006} h={0.08} c="#17181D" seg={8} />
        </group>
      )}
    </group>
  );
};
