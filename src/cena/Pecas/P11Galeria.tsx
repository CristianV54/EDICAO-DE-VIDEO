import React from "react";
import { B } from "../primitivas";
import { easeInOutCubic } from "../../util/tempo";
import { PecaProps, prog } from "./tipos";

const FOTOS = ["#7FB8E6", "#F7B6C2", "#F5C542", "#A8D5A2", "#C9A6F0", "#F0A868"];
const PIXEL = ["#F5D56A", "#F5C542", "#E6B94A", "#9DB9D6", "#7FA3CC", "#F0C879", "#C9A06A", "#6F8FB5", "#8FA9C8", "#E0B060", "#D9A441", "#A4BCD8"];

export const P11Galeria: React.FC<PecaProps> = ({ fp, fs }) => {
  const celular = fp >= 0 ? (fs >= 0 ? 1 - easeInOutCubic(prog(fs, 8)) : Math.min(1, prog(fp, 6))) : 0;
  const pulo = fs >= 0 && fs < 14 ? Math.abs(Math.sin((fs / 14) * Math.PI)) * 0.25 : 0;
  return (
    <group>
      <group position={[0.15, 0, 0]} rotation={[0, -0.08, 0]}>
        <B p={[0, 0.045, 0]} s={[1.1, 0.09, 0.78]} c="#17181D" r={0.05} />
        <B p={[0, 0.095, 0]} s={[1.0, 0.01, 0.68]} c="#2A2C33" r={0.01} sombra={false} />
        {FOTOS.map((c, i) => (
          <B key={i} p={[-0.32 + (i % 3) * 0.32, 0.105, -0.17 + Math.floor(i / 3) * 0.34]} s={[0.28, 0.015, 0.3]} c={c} r={0.01} sombra={false} />
        ))}
        {/* cadeado dourado */}
        <group position={[0.44, 0.1 + pulo, 0.3]}>
          <B p={[0, 0.07, 0]} s={[0.2, 0.15, 0.1]} c="#D4A537" r={0.03} />
          <mesh position={[0, 0.2, 0]}>
            <torusGeometry args={[0.065, 0.02, 6, 12, Math.PI]} />
            <meshStandardMaterial color="#B38B26" />
          </mesh>
          <B p={[0, 0.07, 0.055]} s={[0.04, 0.06, 0.01]} c="#17181D" r={0.005} sombra={false} />
        </group>
      </group>
      {celular > 0.01 && (
        <group position={[-0.62, 0, 0.1]} rotation={[0, 0.3, 0]} scale={celular}>
          <B p={[0, 0.035, 0]} s={[0.3, 0.07, 0.55]} c="#F7F5F0" r={0.04} />
          {PIXEL.map((c, i) => (
            <B key={i} p={[-0.075 + (i % 3) * 0.075, 0.075, -0.19 + Math.floor(i / 3) * 0.125]} s={[0.075, 0.012, 0.125]} c={c} r={0.003} sombra={false} />
          ))}
        </group>
      )}
    </group>
  );
};
