import React from "react";
import { B, Cil, PlanoTex } from "../primitivas";
import { useTex } from "../Texturas";
import { easeInOutCubic } from "../../util/tempo";
import { PecaProps, prog } from "./tipos";

export const P01Camera: React.FC<PecaProps> = ({ fp, fs }) => {
  const auto = useTex("auto");
  const m = useTex("m");
  const piscando = fp >= 0 && fs < 0 && Math.floor(fp / 5) % 2 === 0;
  const giro = easeInOutCubic(prog(fs, 20)) * Math.PI * 2;
  const trocou = fs >= 10;
  return (
    <group>
      <B p={[0, 0.4, 0]} s={[1.2, 0.8, 0.5]} c="#17181D" r={0.1} />
      <B p={[-0.45, 0.4, 0.28]} s={[0.25, 0.7, 0.12]} c="#22242B" r={0.05} />
      <Cil p={[0.05, 0.45, 0.42]} r={0.3} h={0.4} c="#22242B" rot={[Math.PI / 2, 0, 0]} seg={20} />
      <Cil p={[0.05, 0.45, 0.63]} r={0.33} h={0.08} c="#D4A537" rot={[Math.PI / 2, 0, 0]} seg={20} />
      <Cil p={[0.05, 0.45, 0.68]} r={0.22} h={0.05} c="#10131C" e="#3B82F6" ei={0.25} rot={[Math.PI / 2, 0, 0]} seg={20} />
      <Cil p={[-0.42, 0.86, 0]} r={0.08} h={0.08} c="#D4A537" seg={12} />
      {/* seletor de modo no topo */}
      <group position={[0.35, 0.86, 0]} rotation={[0, giro, 0]}>
        <Cil r={0.22} h={0.1} c={piscando ? "#FF4D4D" : "#2A2C33"} e={piscando ? "#FF4D4D" : "#000000"} ei={piscando ? 0.9 : 0} seg={16} />
        <PlanoTex p={[0, 0.056, 0]} w={0.36} h={0.18} tex={trocou ? m : auto} rot={[-Math.PI / 2, 0, 0]} />
      </group>
    </group>
  );
};
