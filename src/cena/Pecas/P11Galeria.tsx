import React from "react";
import { B } from "../primitivas";
import { Plaquinha } from "./Plaquinha";
import { easeInOutCubic } from "../../util/tempo";
import { PecaProps, prog } from "./tipos";

const FOTOS = ["#F6C28B", "#7FB8E6", "#F7B6C2", "#E9CFA3", "#2A3A6B", "#F29E7E"];
const PIXEL = ["#F5D56A", "#F5C542", "#E6B94A", "#9DB9D6", "#7FA3CC", "#F0C879", "#C9A06A", "#6F8FB5", "#8FA9C8", "#E0B060", "#D9A441", "#A4BCD8"];

// tablet preto num suporte, com grade de fotos e cadeado dourado
export const P11Galeria: React.FC<PecaProps> = ({ fp, fs }) => {
  const celular = fp >= 0 ? (fs >= 0 ? 1 - easeInOutCubic(prog(fs, 8)) : Math.min(1, prog(fp, 6))) : 0;
  const pulo = fs >= 0 && fs < 14 ? Math.abs(Math.sin((fs / 14) * Math.PI)) * 0.25 : 0;
  const forte = fs >= 0 ? 0.55 : 0;
  return (
    <group rotation={[0, 0.1, 0]}>
      <B p={[0, 0.03, 0]} s={[1.1, 0.06, 0.6]} c="#3A3D47" r={0.03} />
      <Plaquinha tex="plq_galeria" p={[0, 0.08, 0.34]} w={0.56} rot={[-0.6, 0, 0]} />
      <group position={[0, 0.46, -0.05]} rotation={[-0.3, 0, 0]}>
        <B s={[0.95, 0.66, 0.07]} c="#17181D" r={0.05} />
        <B p={[0, 0, 0.042]} s={[0.85, 0.56, 0.01]} c="#2A2C33" e="#FFE9A8" ei={forte} r={0.01} sombra={false} />
        {FOTOS.map((c, i) => (
          <B key={i} p={[-0.27 + (i % 3) * 0.27, 0.13 - Math.floor(i / 3) * 0.26, 0.05]} s={[0.24, 0.22, 0.012]} c={c} e={c} ei={forte * 0.5} r={0.01} sombra={false} />
        ))}
        <group position={[0.36, -0.24 + pulo, 0.08]}>
          <B p={[0, 0.06, 0]} s={[0.17, 0.13, 0.08]} c="#D4A537" r={0.03} />
          <mesh position={[0, 0.17, 0]}>
            <torusGeometry args={[0.055, 0.018, 6, 12, Math.PI]} />
            <meshStandardMaterial color="#B38B26" />
          </mesh>
        </group>
      </group>
      {celular > 0.01 && (
        <group position={[-0.78, 0.0, 0.3]} rotation={[0, 0.3, 0]} scale={celular}>
          <B p={[0, 0.035, 0]} s={[0.28, 0.07, 0.5]} c="#F7F5F0" r={0.04} />
          {PIXEL.map((c, i) => (
            <B key={i} p={[-0.07 + (i % 3) * 0.07, 0.075, -0.17 + Math.floor(i / 3) * 0.115]} s={[0.07, 0.012, 0.115]} c={c} r={0.003} sombra={false} />
          ))}
        </group>
      )}
    </group>
  );
};
