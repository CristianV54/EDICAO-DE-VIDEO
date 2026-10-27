import React, { useMemo } from "react";
import * as THREE from "three";
import { B } from "./primitivas";
import { PLATAFORMA } from "../dados/posicoes";

const BORDA = 0.35; // borda grafite em volta do tapete
const PX_POR_M = 80;

// tapete azul com linhas de grade azul claro a cada 0,5 m
const useTapeteGrade = (larg: number, prof: number) =>
  useMemo(() => {
    const c = document.createElement("canvas");
    c.width = Math.round(larg * PX_POR_M);
    c.height = Math.round(prof * PX_POR_M);
    const g = c.getContext("2d")!;
    g.fillStyle = "#3B7BF2";
    g.fillRect(0, 0, c.width, c.height);
    g.strokeStyle = "#6E9BF5";
    g.lineWidth = 3;
    for (let x = 0; x <= larg + 1e-6; x += 0.5) {
      g.beginPath();
      g.moveTo(x * PX_POR_M, 0);
      g.lineTo(x * PX_POR_M, c.height);
      g.stroke();
    }
    for (let z = 0; z <= prof + 1e-6; z += 0.5) {
      g.beginPath();
      g.moveTo(0, z * PX_POR_M);
      g.lineTo(c.width, z * PX_POR_M);
      g.stroke();
    }
    const t = new THREE.CanvasTexture(c);
    t.colorSpace = THREE.SRGBColorSpace;
    t.anisotropy = 4;
    return t;
  }, [larg, prof]);

// plataforma 12 x 0,5 x 7: corpo e borda grafite, interior coberto pelo tapete azul quadriculado, LEDs dourados na frente
export const Plataforma: React.FC = () => {
  const { largura: L, profundidade: P } = PLATAFORMA;
  const iL = L - 2 * BORDA;
  const iP = P - 2 * BORDA;
  const grade = useTapeteGrade(iL, iP);
  return (
    <group>
      {/* tapete externo sob a plataforma */}
      <B p={[0, 0.025, 0]} s={[13.5, 0.05, 8.5]} c="#E8DCC4" r={0.02} />
      <B p={[0, 0.25, 0]} s={[L, 0.5, P]} c="#2A2D35" r={0.06} />
      <mesh position={[0, 0.502, 0]} rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
        <planeGeometry args={[iL, iP]} />
        <meshStandardMaterial map={grade} roughness={0.9} />
      </mesh>
      {Array.from({ length: 24 }, (_, i) => (
        <mesh key={i} position={[-5.5 + i * (11 / 23), 0.22, P / 2 + 0.005]}>
          <boxGeometry args={[0.36, 0.07, 0.02]} />
          <meshStandardMaterial color="#E2B341" emissive="#E2B341" emissiveIntensity={1.4} />
        </mesh>
      ))}
    </group>
  );
};
