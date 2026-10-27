import React from "react";
import { B, PlanoTex } from "../primitivas";
import { useTex } from "../Texturas";
import { PecaProps, prog } from "./tipos";

const Cartao: React.FC<{ x: number; cor: string; brilho?: number; erro?: boolean }> = ({ x, cor, brilho = 0, erro }) => {
  const tex = useTex("sd");
  return (
    <group position={[x, 0, 0]}>
      <B p={[0, 0.45, 0]} s={[0.6, 0.8, 0.07]} c={cor} r={0.05} e={brilho > 0 ? "#3DDC84" : "#000000"} ei={brilho} />
      <B p={[0.17, 0.82, 0]} s={[0.26, 0.1, 0.075]} c={cor} r={0.02} e={brilho > 0 ? "#3DDC84" : "#000000"} ei={brilho} sombra={false} />
      <B p={[0, 0.1, 0]} s={[0.4, 0.12, 0.08]} c="#D4A537" r={0.015} sombra={false} />
      <PlanoTex p={[0, 0.5, 0.042]} w={0.4} h={0.2} tex={tex} />
      {erro && (
        <>
          <B p={[0, 0.5, 0.06]} s={[0.5, 0.09, 0.03]} c="#FFFFFF" rot={[0, 0, Math.PI / 4]} r={0.02} sombra={false} />
          <B p={[0, 0.5, 0.06]} s={[0.5, 0.09, 0.03]} c="#FFFFFF" rot={[0, 0, -Math.PI / 4]} r={0.02} sombra={false} />
        </>
      )}
    </group>
  );
};

export const P03Cartao: React.FC<PecaProps> = ({ fp, fs }) => {
  const erro = fp >= 0;
  const pulso = fs >= 0 ? 0.5 + 0.5 * prog(fs, 8) : 0;
  return (
    <group>
      <Cartao x={-0.45} cor={erro ? "#FF4D4D" : "#3B82F6"} erro={erro} />
      <Cartao x={0.45} cor={fs >= 0 ? "#3DDC84" : "#3B82F6"} brilho={pulso} />
    </group>
  );
};
