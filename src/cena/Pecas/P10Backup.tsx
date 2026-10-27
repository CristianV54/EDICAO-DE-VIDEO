import React from "react";
import { random } from "remotion";
import { B, Esf } from "../primitivas";
import { Plaquinha } from "./Plaquinha";
import { PecaProps } from "./tipos";

const FUMACA = Array.from({ length: 12 }, (_, i) => ({
  x: (random(`fumaca-x-${i}`) - 0.5) * 0.35,
  z: (random(`fumaca-z-${i}`) - 0.5) * 0.35,
  fase: random(`fumaca-f-${i}`),
  r: 0.09 + random(`fumaca-r-${i}`) * 0.07,
}));

const Hd: React.FC<{ x: number; queimado?: boolean; verde?: boolean; led: string; ledI: number }> = ({ x, queimado, verde, led, ledI }) => (
  <group position={[x, 0, 0]}>
    <B p={[0, 0.1, 0]} s={[0.5, 0.2, 0.7]} c={queimado ? "#5A5F68" : "#B8BEC8"} r={0.05} e={verde ? "#3DDC84" : "#000000"} ei={verde ? 0.35 : 0} />
    <B p={[0, 0.205, 0]} s={[0.4, 0.01, 0.55]} c={queimado ? "#3B3F46" : "#9AA2AE"} r={0.01} sombra={false} />
    <B p={[0, 0.1, 0.36]} s={[0.1, 0.05, 0.02]} c={led} e={led} ei={ledI} r={0.01} sombra={false} />
  </group>
);

// dois HDs prateados e a nuvem acima
export const P10Backup: React.FC<PecaProps> = ({ fp, fs }) => {
  const queima = fp >= 0;
  const fumacaAtiva = fp >= 0 && fs < 20;
  const piscaVerm = fp >= 0 && fs < 0 && Math.floor(fp / 4) % 2 === 0;
  const ok = fs >= 0;
  return (
    <group>
      <B p={[0, 0.03, 0]} s={[1.5, 0.06, 0.9]} c="#3A3D47" r={0.03} />
      <Plaquinha tex="plq_backup" p={[0, 0.1, 0.5]} w={0.56} rot={[-0.6, 0, 0]} />
      <group position={[0, 0.06, 0]}>
        <Hd x={-0.45} queimado={queima} led={piscaVerm ? "#FF4D4D" : queima ? "#3B3F46" : "#4DA3FF"} ledI={piscaVerm ? 2 : 0.6} />
        <Hd x={0.45} verde={ok} led={ok ? "#3DDC84" : "#4DA3FF"} ledI={1.2} />
      </group>
      {fumacaAtiva &&
        FUMACA.map((s, i) => {
          const u = (fp * 0.025 + s.fase) % 1;
          return <Esf key={i} p={[-0.45 + s.x, 0.4 + u * 1.2, s.z]} r={s.r * (0.6 + u * 0.9)} c="#8A8F9C" seg={6} o={Math.max(0, 0.85 - u)} />;
        })}
      {/* luz vermelha piscando no HD queimado */}
      {piscaVerm && <pointLight position={[-0.45, 0.6, 0.3]} intensity={6} distance={3} color="#FF4D4D" />}
      {/* nuvem fixa acima, sem animacao automatica */}
      <group position={[0, 1.25, 0]} scale={0.85}>
        {([[-0.3, 0, 0.2], [0, 0.1, 0.28], [0.32, 0, 0.2], [0.05, 0.02, 0.1]] as [number, number, number][]).map(([x, y, r], i) => (
          <Esf key={i} p={[x, y, 0]} r={r + 0.12} c={ok ? "#CFF7DE" : "#FFFFFF"} e={ok ? "#3DDC84" : "#000000"} ei={ok ? 0.5 : 0} seg={8} />
        ))}
      </group>
    </group>
  );
};
