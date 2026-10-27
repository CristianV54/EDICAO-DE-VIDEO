import React, { useLayoutEffect, useRef } from "react";
import * as THREE from "three";
import { B, Cil, Esf } from "./primitivas";

const Tabuas: React.FC<{ cor: string; par: boolean }> = ({ cor, par }) => {
  const ref = useRef<THREE.InstancedMesh>(null);
  const n = 30;
  useLayoutEffect(() => {
    const m = new THREE.Matrix4();
    for (let i = 0; i < n; i++) {
      const idx = i * 2 + (par ? 0 : 1);
      m.makeTranslation(-14.75 + idx * 0.5, 0.01, 0);
      ref.current!.setMatrixAt(i, m);
    }
    ref.current!.instanceMatrix.needsUpdate = true;
  }, [par]);
  return (
    <instancedMesh ref={ref} args={[undefined, undefined, n]} receiveShadow>
      <boxGeometry args={[0.47, 0.02, 30]} />
      <meshStandardMaterial color={cor} roughness={0.85} />
    </instancedMesh>
  );
};

const Quadro: React.FC<{ p: [number, number, number]; tom: number }> = ({ p, tom }) => {
  const ceu = ["#BFE3F5", "#F7D6E0", "#D6EBC8"][tom % 3];
  return (
    <group position={p}>
      <B s={[2.3, 1.7, 0.1]} c="#17181D" r={0.03} />
      <B p={[0, 0, 0.06]} s={[2.0, 1.4, 0.03]} c={ceu} r={0.01} sombra={false} />
      <B p={[0, -0.45, 0.08]} s={[2.0, 0.5, 0.03]} c="#A8D5A2" r={0.01} sombra={false} />
      <B p={[-0.35, 0.05, 0.1]} s={[0.35, 0.8, 0.03]} c="#F7F5F0" r={0.04} sombra={false} />
      <B p={[0.1, 0.0, 0.1]} s={[0.35, 0.9, 0.03]} c="#1F2A44" r={0.04} sombra={false} />
      <Esf p={[-0.35, 0.58, 0.11]} r={0.13} c="#E8B48A" seg={8} />
      <Esf p={[0.1, 0.58, 0.11]} r={0.13} c="#E8B48A" seg={8} />
      <B p={[0.6, 0.4, 0.09]} s={[0.4, 0.3, 0.03]} c="#F7F5F0" r={0.1} sombra={false} />
    </group>
  );
};

const MesaEdicao: React.FC = () => {
  const faixas: [number, number, string, number][] = [
    [-0.4, 0.2, "#D4A537", 0.5], [0.15, 0.2, "#3B82F6", 0.4], [-0.25, 0.05, "#F7A8C4", 0.7],
    [0.3, 0.05, "#3DDC84", 0.35], [-0.35, -0.12, "#3B82F6", 0.45], [0.2, -0.12, "#D4A537", 0.5],
  ];
  return (
    <group position={[8.5, 0, -4.6]}>
      <B p={[0, 1.0, 0]} s={[3, 0.12, 1.4]} c="#8B5E3C" />
      {[-1.35, 1.35].map((x) => [-0.55, 0.55].map((z) => <B key={`${x}${z}`} p={[x, 0.5, z]} s={[0.12, 1, 0.12]} c="#6F4A2F" />))}
      <B p={[0, 1.65, -0.3]} s={[1.5, 0.95, 0.08]} c="#17181D" r={0.04} />
      <B p={[0, 1.65, -0.25]} s={[1.36, 0.8, 0.02]} c="#1B2A44" r={0.01} />
      {faixas.map(([x, y, c, w], i) => (
        <B key={i} p={[x * 1.3 + 0.0, 1.65 + y * 1.2, -0.23]} s={[w, 0.09, 0.02]} c={c} r={0.02} sombra={false} />
      ))}
      <B p={[0, 1.2, -0.3]} s={[0.15, 0.3, 0.1]} c="#2A2C33" />
      <B p={[0.9, 1.1, 0.3]} s={[0.6, 0.06, 0.25]} c="#2A2C33" r={0.02} />
      {/* luminaria */}
      <Cil p={[-1.1, 1.1, -0.2]} r={0.17} h={0.08} c="#17181D" />
      <Cil p={[-1.1, 1.45, -0.2]} r={0.03} h={0.7} c="#17181D" />
      <Cil p={[-1.1, 1.85, -0.2]} r={0.25} rTopo={0.08} h={0.3} c="#F5C542" e="#F5C542" ei={0.5} />
      {/* cadeira */}
      <group position={[0, 0, 1.3]} rotation={[0, 0.25, 0]}>
        <B p={[0, 0.65, 0]} s={[0.9, 0.12, 0.9]} c="#3B82F6" r={0.06} />
        <B p={[0, 1.15, -0.4]} s={[0.9, 0.9, 0.1]} c="#3B82F6" r={0.06} />
        <Cil p={[0, 0.33, 0]} r={0.06} h={0.6} c="#2A2C33" />
        <Cil p={[0, 0.05, 0]} r={0.45} rTopo={0.1} h={0.1} c="#2A2C33" seg={5} />
      </group>
    </group>
  );
};

const Planta: React.FC = () => (
  <group position={[11.2, 0, -4.8]}>
    <Cil p={[0, 0.3, 0]} r={0.32} rTopo={0.4} h={0.6} c="#E07A3F" seg={10} />
    <Esf p={[0, 1.0, 0]} r={0.5} c="#4CAF6A" seg={7} />
    <Esf p={[0.3, 1.45, 0.1]} r={0.35} c="#5BC27A" seg={7} />
    <Esf p={[-0.3, 1.35, -0.1]} r={0.32} c="#3E9B5B" seg={7} />
  </group>
);

export const Ambiente: React.FC = () => (
  <group>
    {/* chao */}
    <mesh position={[0, -0.001, 0]} rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
      <planeGeometry args={[30, 30]} />
      <meshStandardMaterial color="#A9773F" roughness={0.9} />
    </mesh>
    <Tabuas cor="#C9955F" par />
    <Tabuas cor="#BD8A55" par={false} />
    {/* parede de fundo (z = -6) e lateral esquerda (x = -11) */}
    <mesh position={[0, 7, -6]} receiveShadow>
      <planeGeometry args={[40, 14]} />
      <meshStandardMaterial color="#EFE6D6" roughness={0.95} />
    </mesh>
    <B p={[0, 0.14, -5.95]} s={[30, 0.28, 0.1]} c="#D9CCB6" r={0.02} />
    <mesh position={[-11, 7, 9]} rotation={[0, Math.PI / 2, 0]} receiveShadow>
      <planeGeometry args={[30, 14]} />
      <meshStandardMaterial color="#EFE6D6" roughness={0.95} />
    </mesh>
    <B p={[-10.95, 0.14, 9]} s={[0.1, 0.28, 30]} c="#D9CCB6" r={0.02} />
    <Quadro p={[-6, 3.4, -5.9]} tom={0} />
    <Quadro p={[-2.2, 3.7, -5.9]} tom={1} />
    <Quadro p={[1.8, 3.4, -5.9]} tom={2} />
    <MesaEdicao />
    <Planta />
  </group>
);
