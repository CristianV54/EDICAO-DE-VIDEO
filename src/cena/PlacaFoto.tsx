import React from "react";
import { B } from "./primitivas";
import { Seg } from "./Personagem";
import { useTelao } from "./Texturas";
import type { EstadoTelao } from "./telaoDesenho";
import { LINHAS, entrada, pop } from "../util/tempo";
import { posPlaca, rotRepouso } from "../dados/posicoes";

export const CASAS_PLACA = [1, 7, 8, 9];

// estado da foto na placa e frame em que mudou (para o pulso)
export const estadoPlaca = (n: number, f: number): { estado: EstadoTelao | "vazio"; mudou: number } => {
  const L = LINHAS[n];
  if (n === 1) return f < L.sol ? { estado: "auto", mudou: L.ini } : { estado: "manual", mudou: L.sol }; // a foto chapada (auto) ja esta na placa; o clique em "automatico" so dispara o flash
  if (n === 7) return f < L.sol + 14 ? { estado: "escura", mudou: L.ini } : { estado: "cinquenta", mudou: L.sol + 14 };
  if (n === 8) return f < L.prob ? { estado: "cinquenta", mudou: L.ini } : f < L.sol ? { estado: "corrompida", mudou: L.prob } : { estado: "restaurada", mudou: L.sol };
  return f < L.sol ? { estado: "festa_granulada", mudou: L.ini } : { estado: "festa_flash", mudou: L.sol };
};

const Tela: React.FC<{ estado: EstadoTelao }> = ({ estado }) => {
  const tex = useTelao(estado);
  return (
    <mesh position={[0, 0, 0.032]}>
      <planeGeometry args={[1.0, 0.664]} />
      <meshBasicMaterial map={tex} toneMapped={false} />
    </mesh>
  );
};

// moldura preta de 1,0 x 0,72 num cavalete
export const PlacaFoto: React.FC<{ n: number; f: number }> = ({ n, f }) => {
  const L = LINHAS[n];
  if (f < L.chegada) return null;
  const { estado, mudou } = estadoPlaca(n, f);
  const p = posPlaca(n);
  const esc = entrada(f - L.chegada, 8) * pop(f - mudou, 8, 1.08);
  return (
    <group position={[p[0], p[1], p[2]]} rotation={[0, rotRepouso(n), 0]} scale={esc}>
      <Seg a={[-0.38, 0, -0.1]} b={[-0.34, 1.42, -0.02]} w={0.05} c="#6F4A2F" />
      <Seg a={[0.38, 0, -0.1]} b={[0.34, 1.42, -0.02]} w={0.05} c="#6F4A2F" />
      <Seg a={[0, 0, 0.3]} b={[0, 1.4, -0.02]} w={0.05} c="#6F4A2F" />
      <group position={[0, 1.8, 0]} rotation={[-0.1, 0, 0]}>
        <B s={[1.1, 0.75, 0.05]} c="#17181D" r={0.03} />
        {estado === "vazio" ? (
          <mesh position={[0, 0, 0.032]}>
            <planeGeometry args={[1.0, 0.664]} />
            <meshBasicMaterial color="#2A2D35" toneMapped={false} />
          </mesh>
        ) : (
          <Tela estado={estado} />
        )}
      </group>
    </group>
  );
};
