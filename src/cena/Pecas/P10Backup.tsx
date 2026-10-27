import React from "react";
import { random } from "remotion";
import { B, Esf } from "../primitivas";
import { PecaProps } from "./tipos";

const FUMACA = Array.from({ length: 10 }, (_, i) => ({
  x: (random(`fumaca-x-${i}`) - 0.5) * 0.4,
  z: (random(`fumaca-z-${i}`) - 0.5) * 0.4,
  fase: random(`fumaca-f-${i}`),
  r: 0.08 + random(`fumaca-r-${i}`) * 0.07,
}));

const Hd: React.FC<{ x: number; queimado?: boolean; verde?: boolean; led: string; ledI: number }> = ({ x, queimado, verde, led, ledI }) => (
  <group position={[x, 0, 0]}>
    <B p={[0, 0.1, 0]} s={[0.62, 0.2, 0.88]} c={queimado ? "#5A5F68" : "#B8BEC8"} r={0.05} e={verde ? "#3DDC84" : "#000000"} ei={verde ? 0.35 : 0} />
    <B p={[0, 0.205, 0.0]} s={[0.5, 0.01, 0.7]} c={queimado ? "#3B3F46" : "#9AA2AE"} r={0.01} sombra={false} />
    <B p={[0, 0.1, 0.45]} s={[0.1, 0.05, 0.02]} c={led} e={led} ei={ledI} r={0.01} sombra={false} />
  </group>
);

export const P10Backup: React.FC<PecaProps> = ({ fp, fs }) => {
  const queima = fp >= 0;
  const fumacaAtiva = fp >= 0 && fs < 20;
  const piscaVerm = fp >= 0 && fs < 0 && Math.floor(fp / 4) % 2 === 0;
  const ok = fs >= 0;
  return (
    <group>
      <Hd x={-0.4} queimado={queima} led={piscaVerm ? "#FF4D4D" : queima ? "#3B3F46" : "#4DA3FF"} ledI={piscaVerm ? 2 : 0.6} />
      <Hd x={0.4} verde={ok} led={ok ? "#3DDC84" : "#4DA3FF"} ledI={1.2} />
      {fumacaAtiva &&
        FUMACA.map((s, i) => {
          const u = (fp * 0.025 + s.fase) % 1;
          return <Esf key={i} p={[-0.4 + s.x, 0.25 + u * 1.1, s.z]} r={s.r * (0.6 + u * 0.9)} c="#8A8F9C" seg={6} o={Math.max(0, 0.85 - u)} />;
        })}
      {/* nuvem fixa acima */}
      <group position={[0, 1.2, 0]} scale={0.8}>
        {([[-0.3, 0, 0.2], [0, 0.1, 0.28], [0.32, 0, 0.2], [0.05, 0.02, 0.1]] as [number, number, number][]).map(([x, y, r], i) => (
          <Esf key={i} p={[x, y, 0]} r={r + 0.12} c={ok ? "#CFF7DE" : "#FFFFFF"} e={ok ? "#3DDC84" : "#000000"} ei={ok ? 0.5 : 0} seg={8} />
        ))}
      </group>
    </group>
  );
};
