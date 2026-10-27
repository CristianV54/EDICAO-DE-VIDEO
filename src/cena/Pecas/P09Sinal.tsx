import React from "react";
import { B, PlanoTex } from "../primitivas";
import { Plaquinha } from "./Plaquinha";
import { useTex } from "../Texturas";
import { easeOutBack } from "../../util/tempo";
import { PecaProps, prog } from "./tipos";

export const P09Sinal: React.FC<PecaProps> = ({ fs }) => {
  const rs = useTex("rs");
  const trinta = useTex("trinta");
  const sab = useTex("sab");
  const anel = easeOutBack(prog(fs, 8));
  return (
    <group>
      <B p={[0, 0.03, 0.05]} s={[1.15, 0.06, 0.6]} c="#3A3D47" r={0.03} />
      <Plaquinha tex="plq_sinal" p={[0, 0.08, 0.38]} w={0.5} rot={[-0.6, 0, 0]} />
      {/* maquininha dourada */}
      <group position={[-0.3, 0.5, 0]} rotation={[-0.2, 0.15, 0]}>
        <B s={[0.4, 0.8, 0.22]} c="#D4A537" r={0.07} />
        <B p={[0, 0.22, 0.12]} s={[0.32, 0.22, 0.03]} c="#0E0F13" r={0.02} sombra={false} />
        <PlanoTex p={[0, 0.22, 0.14]} w={0.28} h={0.14} tex={fs >= 0 ? trinta : rs} />
        {[0, 1, 2].map((l) =>
          [0, 1, 2].map((c) => <B key={`${l}${c}`} p={[-0.1 + c * 0.1, -0.03 - l * 0.11, 0.12]} s={[0.08, 0.07, 0.03]} c="#F7F5F0" r={0.015} sombra={false} />)
        )}
      </group>
      {/* calendario de mesa */}
      <group position={[0.32, 0.0, 0.05]} rotation={[0, -0.2, 0]}>
        <B p={[0, 0.3, 0]} s={[0.52, 0.46, 0.08]} c="#F7F5F0" r={0.04} rot={[-0.12, 0, 0]} />
        <B p={[0, 0.5, 0.02]} s={[0.52, 0.12, 0.09]} c="#FF4D4D" r={0.03} rot={[-0.12, 0, 0]} sombra={false} />
        <PlanoTex p={[0, 0.3, 0.06]} w={0.3} h={0.15} tex={sab} rot={[-0.12, 0, 0]} />
        {anel > 0 && (
          <mesh position={[0, 0.3, 0.065]} rotation={[-0.12, 0, 0]} scale={anel}>
            <torusGeometry args={[0.16, 0.022, 6, 20]} />
            <meshStandardMaterial color="#3DDC84" emissive="#3DDC84" emissiveIntensity={0.5} />
          </mesh>
        )}
      </group>
    </group>
  );
};
