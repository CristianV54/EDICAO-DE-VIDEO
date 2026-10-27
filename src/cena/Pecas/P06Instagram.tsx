import React from "react";
import { B, Coracao } from "../primitivas";
import { easeOutBack } from "../../util/tempo";
import { PecaProps, prog } from "./tipos";

const CORES = ["#F7B6C2", "#7FB8E6", "#F5C542", "#A8D5A2", "#C9A6F0", "#F0A868", "#6FD0C5", "#F28DA6", "#8FA8F5"];

export const P06Instagram: React.FC<PecaProps> = ({ fs }) => (
  <group rotation={[0, 0.15, 0]}>
    <group position={[0, 0.55, 0]} rotation={[-0.1, 0, 0]}>
      <B s={[0.66, 1.12, 0.09]} c="#F7F5F0" r={0.09} />
      <B p={[0, 0, 0.05]} s={[0.56, 0.98, 0.02]} c="#D4D6DC" r={0.03} sombra={false} />
      <B p={[0, 0.42, 0.065]} s={[0.56, 0.11, 0.01]} c="#D6249F" r={0.02} sombra={false} />
      {CORES.map((c, i) => {
        const col = i % 3;
        const lin = Math.floor(i / 3);
        const e = easeOutBack(prog(fs - i * 3, 6));
        if (e <= 0) return null;
        return <B key={i} p={[-0.18 + col * 0.18, 0.2 - lin * 0.18, 0.075]} s={[0.16 * e, 0.16 * e, 0.02]} c={c} r={0.01} sombra={false} />;
      })}
      <B p={[0, -0.47, 0.06]} s={[0.15, 0.015, 0.01]} c="#9AA0AC" r={0.005} sombra={false} />
    </group>
    {[0, 1, 2].map((i) => {
      const t = fs - 18 - i * 6;
      if (t < 0) return null;
      const u = prog(t, 40);
      if (u >= 1) return null;
      return <Coracao key={i} p={[-0.3 + i * 0.3 + Math.sin(u * 6 + i) * 0.05, 1.0 + u * 0.9, 0.2]} s={0.2 * (1 - u * 0.4)} c="#FF4D4D" e="#FF4D4D" ei={0.3} rot={[0, 0.2, 0]} />;
    })}
  </group>
);
