import React from "react";
import { B, Cil, PlanoTex, Esf } from "../primitivas";
import { useTex } from "../Texturas";
import { easeInOutCubic } from "../../util/tempo";
import { PecaProps, prog } from "./tipos";

export const P02Lente: React.FC<PecaProps> = ({ fp, fs }) => {
  const tex = useTex("lente");
  const escuro = fp >= 0 && fs < 0;
  const claro = easeInOutCubic(prog(fs, 12));
  const corFoto = fs >= 0 ? "#F5D9A8" : escuro ? "#34343C" : "#B9BCC4";
  return (
    <group>
      <group position={[-0.3, 0.42, 0]}>
        <Cil r={0.4} h={0.9} c="#17181D" rot={[Math.PI / 2, 0, 0]} seg={22} />
        <Cil p={[0, 0, -0.25]} r={0.42} h={0.1} c="#D4A537" rot={[Math.PI / 2, 0, 0]} seg={22} />
        <Cil p={[0, 0, 0.25]} r={0.42} h={0.1} c="#D4A537" rot={[Math.PI / 2, 0, 0]} seg={22} />
        <Cil p={[0, 0, 0.46]} r={0.3} h={0.04} c="#0E1119" e="#3B82F6" ei={0.3} rot={[Math.PI / 2, 0, 0]} seg={22} />
        <PlanoTex p={[0, 0.405, 0]} w={0.55} h={0.2} tex={tex} rot={[-Math.PI / 2, 0, 0]} />
      </group>
      {/* porta-retrato */}
      <group position={[0.55, 0.0, 0.1]} rotation={[0, -0.35, 0]}>
        <B p={[0, 0.4, 0]} s={[0.62, 0.78, 0.08]} c="#17181D" r={0.03} />
        <B p={[0, 0.4, 0.045]} s={[0.5, 0.64, 0.02]} c={corFoto} r={0.01} sombra={false} />
        {claro > 0 && (
          <>
            {/* fundo desfocado: manchas suaves */}
            <Esf p={[-0.12, 0.62, 0.065]} r={0.09} c="#F7B6C2" seg={8} s={[1, 1, 0.1]} o={0.8} />
            <Esf p={[0.14, 0.2, 0.065]} r={0.1} c="#F0A868" seg={8} s={[1, 1, 0.1]} o={0.8} />
            <Esf p={[0.15, 0.66, 0.065]} r={0.07} c="#BFE3F5" seg={8} s={[1, 1, 0.1]} o={0.8} />
            {/* circulo nitido no centro */}
            <Cil p={[0, 0.4, 0.07]} r={0.14 * claro} h={0.03} c="#FFFFFF" rot={[Math.PI / 2, 0, 0]} seg={18} />
            <Cil p={[0, 0.4, 0.09]} r={0.07 * claro} h={0.03} c="#E8B48A" rot={[Math.PI / 2, 0, 0]} seg={14} />
          </>
        )}
        <B p={[0, 0.0, -0.18]} s={[0.1, 0.5, 0.05]} c="#2A2C33" rot={[0.5, 0, 0]} sombra={false} />
      </group>
    </group>
  );
};
