import React from "react";
import { B, PlanoTex } from "../primitivas";
import { useTex } from "../Texturas";
import { easeOutBack } from "../../util/tempo";
import { PecaProps, prog } from "./tipos";

export const P09Sinal: React.FC<PecaProps> = ({ fs }) => {
  const rs = useTex("rs");
  const trinta = useTex("trinta");
  const anel = easeOutBack(prog(fs, 8));
  return (
    <group>
      {/* maquininha */}
      <group position={[-0.38, 0.52, 0]} rotation={[-0.2, 0.2, 0]}>
        <B s={[0.5, 1.0, 0.26]} c="#D4A537" r={0.07} />
        <B p={[0, 0.27, 0.14]} s={[0.4, 0.28, 0.03]} c="#0E0F13" r={0.02} sombra={false} />
        <PlanoTex p={[0, 0.27, 0.16]} w={0.36} h={0.18} tex={fs >= 0 ? trinta : rs} />
        {[0, 1, 2].map((l) =>
          [0, 1, 2].map((c) => <B key={`${l}${c}`} p={[-0.13 + c * 0.13, -0.02 - l * 0.14, 0.14]} s={[0.1, 0.09, 0.03]} c="#F7F5F0" r={0.02} sombra={false} />)
        )}
        <B p={[0.13, -0.46, 0.14]} s={[0.1, 0.05, 0.03]} c="#3DDC84" r={0.015} sombra={false} />
      </group>
      {/* calendario de mesa */}
      <group position={[0.5, 0.0, 0.1]} rotation={[0, -0.25, 0]}>
        <B p={[0, 0.34, 0]} s={[0.68, 0.58, 0.1]} c="#F7F5F0" r={0.04} rot={[-0.12, 0, 0]} />
        <B p={[0, 0.58, 0.02]} s={[0.68, 0.14, 0.11]} c="#FF4D4D" r={0.03} rot={[-0.12, 0, 0]} sombra={false} />
        <PlanoTex p={[0, 0.34, 0.07]} w={0.36} h={0.18} tex={useTex("sab")} rot={[-0.12, 0, 0]} />
        {anel > 0 && (
          <mesh position={[0, 0.34, 0.075]} rotation={[-0.12, 0, 0]} scale={anel}>
            <torusGeometry args={[0.2, 0.025, 6, 20]} />
            <meshStandardMaterial color="#3DDC84" emissive="#3DDC84" emissiveIntensity={0.5} />
          </mesh>
        )}
        <B p={[0, 0.05, -0.12]} s={[0.1, 0.5, 0.05]} c="#C9CCD3" r={0.02} rot={[0.5, 0, 0]} sombra={false} />
      </group>
    </group>
  );
};
