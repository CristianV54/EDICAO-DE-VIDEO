import React from "react";
import { B, Coracao } from "../primitivas";
import { Plaquinha } from "./Plaquinha";
import { easeOutBack } from "../../util/tempo";
import { PecaProps, prog } from "./tipos";

// miniaturas das fotos do telao
const CORES = ["#F6C28B", "#7FB8E6", "#F7B6C2", "#E9CFA3", "#2A3A6B", "#F29E7E", "#A8D5A2", "#FFD25A", "#C9A6F0"];

export const P06Instagram: React.FC<PecaProps> = ({ fs }) => (
  <group rotation={[0, 0.12, 0]}>
    <B p={[0, 0.03, 0]} s={[0.75, 0.06, 0.5]} c="#3A3D47" r={0.03} />
    <Plaquinha tex="plq_instagram" p={[0, 0.07, 0.27]} w={0.55} rot={[-0.6, 0, 0]} />
    <group position={[0, 0.58, -0.02]} rotation={[-0.1, 0, 0]}>
      <B s={[0.5, 0.9, 0.08]} c="#F7F5F0" r={0.08} />
      <B p={[0, 0, 0.045]} s={[0.42, 0.78, 0.02]} c="#D4D6DC" r={0.03} sombra={false} />
      <B p={[0, 0.34, 0.06]} s={[0.42, 0.09, 0.01]} c="#D6249F" r={0.02} sombra={false} />
      {CORES.map((c, i) => {
        const col = i % 3;
        const lin = Math.floor(i / 3);
        const e = easeOutBack(prog(fs - i * 3, 6));
        if (e <= 0) return null;
        return <B key={i} p={[-0.14 + col * 0.14, 0.16 - lin * 0.14, 0.07]} s={[0.125 * e, 0.125 * e, 0.02]} c={c} r={0.01} sombra={false} />;
      })}
    </group>
    {[0, 1, 2].map((i) => {
      const t = fs - 20 - i * 6;
      if (t < 0) return null;
      const u = prog(t, 40);
      if (u >= 1) return null;
      return <Coracao key={i} p={[-0.28 + i * 0.28 + Math.sin(u * 6 + i) * 0.05, 1.0 + u * 0.9, 0.2]} s={0.2 * (1 - u * 0.4)} c="#FF4D4D" e="#FF4D4D" ei={0.3} rot={[0, 0.2, 0]} />;
    })}
  </group>
);
