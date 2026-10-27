import React from "react";
import { B, Cil, COR } from "./primitivas";
import { useTex } from "./Texturas";

// Camera reutilizavel. Unidades base: corpo 0,76 x 0,54 x 0,40, frente em +z.
// Escala 1,33 = peca gigante do s01; 0,45 = camera na mao (0,34 x 0,24 x 0,18).
export type CamProps = {
  escala: number;
  lente?: "kit" | "50";
  troca?: number; // 0..1: troca de lente (a antiga sai para a frente, a nova entra)
  modo?: "auto" | "m"; // seletor no topo
  giroSeletor?: number; // rad
  cartoes?: "nenhum" | "azuis" | "falha" | "salvo"; // dois cartoes aparecendo no slot
  flash?: number; // 0..1 escala do flash na sapata (0 = sem flash)
  etiquetaLoja?: boolean;
};

const Lente: React.FC<{ tipo: "kit" | "50"; dz?: number; esc?: number }> = ({ tipo, dz = 0, esc = 1 }) => {
  const t50 = useTex("lente");
  if (esc <= 0.01) return null;
  return (
    <group position={[0, 0, 0.2 + dz]} scale={esc}>
      {tipo === "kit" ? (
        <>
          <Cil p={[0, 0, 0.12]} r={0.17} h={0.24} c="#8D929C" rot={[Math.PI / 2, 0, 0]} />
          <Cil p={[0, 0, 0.27]} r={0.13} h={0.08} c="#6B7078" rot={[Math.PI / 2, 0, 0]} />
          <Cil p={[0, 0, 0.32]} r={0.09} h={0.02} c="#20324A" rot={[Math.PI / 2, 0, 0]} />
        </>
      ) : (
        <>
          <Cil p={[0, 0, 0.17]} r={0.2} h={0.34} c="#0E0E10" rot={[Math.PI / 2, 0, 0]} />
          <Cil p={[0, 0, 0.35]} r={0.21} h={0.03} c={COR.dourado} rot={[Math.PI / 2, 0, 0]} />
          <Cil p={[0, 0, 0.06]} r={0.21} h={0.03} c={COR.dourado} rot={[Math.PI / 2, 0, 0]} />
          <Cil p={[0, 0, 0.36]} r={0.12} h={0.02} c="#1B3A6B" rot={[Math.PI / 2, 0, 0]} />
          <mesh position={[0, 0.205, 0.2]} rotation={[-Math.PI / 2, 0, 0]}>
            <planeGeometry args={[0.2, 0.07]} />
            <meshBasicMaterial map={t50} transparent toneMapped={false} />
          </mesh>
        </>
      )}
    </group>
  );
};

export const CameraModelo: React.FC<CamProps> = ({ escala, lente = "kit", troca = 0, modo, giroSeletor = 0, cartoes = "nenhum", flash = 0, etiquetaLoja }) => {
  const tAuto = useTex("auto");
  const tM = useTex("m");
  const cor = { azuis: ["#2563EB", "#2563EB"], falha: ["#EF4444", "#2563EB"], salvo: ["#EF4444", "#3DDC84"] } as Record<string, string[]>;
  const antiga = lente === "kit" ? "kit" : "kit";
  return (
    <group scale={escala}>
      <B s={[0.76, 0.54, 0.4]} c="#17181D" r={0.05} />
      <B p={[0, 0.0, 0.0]} s={[0.78, 0.18, 0.41]} c="#22242B" r={0.04} sombra={false} />
      <B p={[0.3, -0.02, 0.18]} s={[0.17, 0.5, 0.14]} c="#2A2C33" r={0.05} />
      <B p={[0, 0.34, -0.02]} s={[0.26, 0.15, 0.26]} c="#22242B" r={0.04} />
      <B p={[0.26, 0.285, 0.08]} s={[0.12, 0.03, 0.08]} c="#6B7078" r={0.01} sombra={false} />
      {/* seletor de modo */}
      <group position={[-0.24, 0.3, 0.05]} rotation={[0, giroSeletor, 0]}>
        <Cil r={0.115} h={0.07} c="#3A3D46" seg={14} />
        <mesh position={[0, 0.037, 0]} rotation={[-Math.PI / 2, 0, 0]}>
          <planeGeometry args={[0.2, 0.1]} />
          <meshBasicMaterial map={modo === "m" ? tM : tAuto} transparent toneMapped={false} />
        </mesh>
      </group>
      <B p={[0.15, 0.285, 0.12]} s={[0.1, 0.03, 0.1]} c="#E2B341" r={0.01} sombra={false} />
      {/* lentes */}
      {troca <= 0 && <Lente tipo={lente} />}
      {troca > 0 && troca < 1 && (
        <>
          <Lente tipo={antiga} dz={troca * 0.7} esc={troca < 0.5 ? 1 : 0} />
          <Lente tipo="50" dz={(1 - troca) * 0.7} esc={troca >= 0.5 ? 1 : 0} />
        </>
      )}
      {troca >= 1 && <Lente tipo="50" />}
      {/* cartoes de memoria no slot do topo */}
      {cartoes !== "nenhum" &&
        [0, 1].map((k) => (
          <group key={k} position={[0.2 + k * 0.17, 0.43, -0.08]}>
            <B s={[0.14, 0.2, 0.025]} c={cor[cartoes][k]} r={0.01} e={cor[cartoes][k]} ei={cartoes === "salvo" && k === 1 ? 0.9 : 0.2} />
            <B p={[0, 0.07, 0.015]} s={[0.1, 0.05, 0.005]} c="#E2B341" r={0.002} sombra={false} />
          </group>
        ))}
      {/* flash pequeno na sapata */}
      {flash > 0 && (
        <group position={[0, 0.5, -0.02]} scale={flash}>
          <B p={[0, 0, 0]} s={[0.14, 0.08, 0.1]} c="#17181D" r={0.01} />
          <B p={[0, 0.1, 0.02]} s={[0.2, 0.14, 0.12]} c="#F7F5F0" r={0.02} e="#FFFFFF" ei={0.4} />
        </group>
      )}
      {/* etiqueta de loja pendurada */}
      {etiquetaLoja && (
        <group position={[-0.4, 0.1, 0.05]} rotation={[0, 0, 0.12]}>
          <B p={[0, -0.18, 0]} s={[0.04, 0.34, 0.01]} c="#EF4444" r={0.003} sombra={false} />
          <B p={[0, -0.42, 0]} s={[0.2, 0.28, 0.02]} c="#FFFFFF" r={0.01} />
          <B p={[0, -0.36, 0.015]} s={[0.12, 0.04, 0.005]} c="#EF4444" r={0.002} sombra={false} />
        </group>
      )}
    </group>
  );
};
