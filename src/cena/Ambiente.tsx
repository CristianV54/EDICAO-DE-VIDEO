import React, { useLayoutEffect, useRef } from "react";
import * as THREE from "three";
import { B, Cil, Cone, Esf } from "./primitivas";
import { CameraModelo } from "./CameraModelo";

// ---------- estudio de fotografia de casamento ----------
// Mundo: a plataforma ocupa x de -3,8 a 3,8 e z de -6,4 a 6,4. Parede do fundo em z = -9,5; parede da esquerda em x = -8,5.
// A camera olha do lado da frente (z positivo), um pouco a direita. Tudo aqui fica atras ou ao lado da plataforma.
const Z_FUNDO = -9.5;
const X_ESQ = -8.5;

// caixa simples (sem cantos arredondados): barata para objetos de fundo
const Cx: React.FC<{ p: [number, number, number]; s: [number, number, number]; c: string; rot?: [number, number, number]; e?: string; ei?: number; sombra?: boolean }> = ({ p, s, c, rot = [0, 0, 0], e, ei = 0, sombra = false }) => (
  <mesh position={p} rotation={rot} castShadow={sombra} receiveShadow>
    <boxGeometry args={s} />
    <meshStandardMaterial color={c} emissive={e ?? "#000000"} emissiveIntensity={ei} roughness={0.8} />
  </mesh>
);

const Tabuas: React.FC<{ cor: string; par: boolean }> = ({ cor, par }) => {
  const ref = useRef<THREE.InstancedMesh>(null);
  const n = 80;
  useLayoutEffect(() => {
    const m = new THREE.Matrix4();
    for (let i = 0; i < n; i++) {
      const idx = i * 2 + (par ? 0 : 1);
      m.makeTranslation(-19.75 + idx * 0.5, 0.01, 0);
      ref.current!.setMatrixAt(i, m);
    }
    ref.current!.instanceMatrix.needsUpdate = true;
  }, [par]);
  return (
    <instancedMesh ref={ref} args={[undefined, undefined, n]} receiveShadow>
      <boxGeometry args={[0.47, 0.02, 80]} />
      <meshStandardMaterial color={cor} roughness={0.85} />
    </instancedMesh>
  );
};

// quadro com foto de casal (silhuetas), em varios tamanhos e tons
const Moldura: React.FC<{ p: [number, number, number]; w: number; h: number; tom: number; moldura?: string }> = ({ p, w, h, tom, moldura = "#17181D" }) => {
  const ceu = ["#F2C6A0", "#BFD8EA", "#F7D6E0", "#D6EBC8", "#E9D3B0"][tom % 5];
  const chao = ["#C98E6B", "#9CC08F", "#C8B6A0", "#A8D5A2", "#B88A5E"][tom % 5];
  return (
    <group position={p}>
      <Cx p={[0, 0, 0]} s={[w, h, 0.08]} c={moldura} />
      <Cx p={[0, 0, 0.045]} s={[w - 0.16, h - 0.16, 0.02]} c="#FFFFFF" />
      <Cx p={[0, 0.03, 0.058]} s={[w - 0.3, h - 0.3, 0.01]} c={ceu} />
      <Cx p={[0, -(h - 0.3) * 0.32, 0.066]} s={[w - 0.3, (h - 0.3) * 0.36, 0.01]} c={chao} />
      <Cx p={[-0.12 * w, -0.05 * h, 0.075]} s={[0.1 * w, 0.42 * h, 0.01]} c="#F7F5F0" />
      <Cx p={[0.12 * w, -0.03 * h, 0.075]} s={[0.1 * w, 0.46 * h, 0.01]} c="#1F2A44" />
      <Esf p={[-0.12 * w, 0.2 * h, 0.08]} r={0.05 * w} c="#E8B48A" seg={8} />
      <Esf p={[0.12 * w, 0.22 * h, 0.08]} r={0.05 * w} c="#E8B48A" seg={8} />
    </group>
  );
};

const Janela: React.FC = () => (
  <group position={[-2.6, 3.3, Z_FUNDO + 0.05]}>
    <Cx p={[0, 0, 0]} s={[3.6, 2.8, 0.1]} c="#FFFFFF" />
    <Cx p={[0, 0, 0.06]} s={[3.3, 2.5, 0.02]} c="#DDF1FF" e="#CFEAFF" ei={0.9} />
    <Cx p={[0, 0, 0.09]} s={[0.1, 2.5, 0.04]} c="#FFFFFF" />
    <Cx p={[-0.8, 0, 0.09]} s={[0.08, 2.5, 0.04]} c="#FFFFFF" />
    <Cx p={[0.8, 0, 0.09]} s={[0.08, 2.5, 0.04]} c="#FFFFFF" />
    <Cx p={[0, 0.0, 0.09]} s={[3.3, 0.1, 0.04]} c="#FFFFFF" />
    <Cx p={[0, -1.5, 0.15]} s={[3.9, 0.12, 0.35]} c="#FFFFFF" />
    {/* nuvens low-poly do lado de fora */}
    <Esf p={[-0.9, 0.55, 0.075]} r={0.28} c="#FFFFFF" seg={7} s={[1.6, 0.8, 0.2]} />
    <Esf p={[0.8, 0.2, 0.075]} r={0.22} c="#FFFFFF" seg={7} s={[1.6, 0.8, 0.2]} />
  </group>
);

// fundo infinito: rolo de papel em dois tripes, a folha cai e dobra no chao
const FundoInfinito: React.FC = () => (
  <group position={[5.6, 0, Z_FUNDO + 1.0]}>
    {[-1.9, 1.9].map((x) => (
      <group key={x} position={[x, 0, 0]}>
        <Cil p={[0, 1.6, 0]} r={0.035} h={3.2} c="#2A2C33" seg={6} />
        {[0, 2.1, 4.2].map((a) => (
          <Cx key={a} p={[Math.sin(a) * 0.3, 0.04, Math.cos(a) * 0.3]} s={[0.06, 0.06, 0.7]} c="#2A2C33" rot={[0, a, 0]} />
        ))}
      </group>
    ))}
    <Cil p={[0, 3.2, 0]} r={0.06} h={4.0} c="#17181D" rot={[0, 0, Math.PI / 2]} seg={8} />
    <Cil p={[0, 3.2, 0.05]} r={0.17} h={3.5} c="#8A8F9C" rot={[0, 0, Math.PI / 2]} seg={14} />
    <Cx p={[0, 1.6, 0.12]} s={[3.5, 3.2, 0.03]} c="#C8CCD4" />
    <Cx p={[0, 0.02, 0.95]} s={[3.5, 0.03, 1.7]} c="#C8CCD4" />
  </group>
);

const Softbox: React.FC = () => (
  <group position={[-5.7, 0, -1.2]} rotation={[0, 0.9, 0]}>
    <Cil p={[0, 1.4, 0]} r={0.035} h={2.8} c="#2A2C33" seg={6} />
    {[0, 2.1, 4.2].map((a) => (
      <Cx key={a} p={[Math.sin(a) * 0.35, 0.05, Math.cos(a) * 0.35]} s={[0.06, 0.06, 0.8]} c="#2A2C33" rot={[0, a, 0]} />
    ))}
    <group position={[0, 2.6, 0.25]} rotation={[0.2, 0, 0]}>
      <Cx p={[0, 0, -0.25]} s={[1.3, 1.3, 0.5]} c="#17181D" sombra />
      <Cx p={[0, 0, 0.01]} s={[1.2, 1.2, 0.02]} c="#FFFFFF" e="#FFF7E0" ei={1.1} />
    </group>
  </group>
);

const Tripe: React.FC = () => (
  <group position={[5.6, 0, -2.4]} rotation={[0, -0.9, 0]}>
    {[0, 2.1, 4.2].map((a) => (
      <Cx key={a} p={[Math.sin(a) * 0.28, 0.65, Math.cos(a) * 0.28]} s={[0.05, 1.35, 0.05]} c="#2A2C33" rot={[Math.cos(a) * 0.22, 0, -Math.sin(a) * 0.22]} />
    ))}
    <Cil p={[0, 1.35, 0]} r={0.06} h={0.1} c="#17181D" seg={8} />
    <group position={[0, 1.65, 0]}>
      <CameraModelo escala={0.55} lente="kit" modo="m" />
    </group>
  </group>
);

const Refletor: React.FC = () => (
  <group position={[5.5, 0, 2.6]} rotation={[0, -0.7, 0]}>
    <Cil p={[0, 1.3, 0]} r={0.03} h={2.6} c="#2A2C33" seg={6} />
    {[0, 2.1, 4.2].map((a) => (
      <Cx key={a} p={[Math.sin(a) * 0.3, 0.05, Math.cos(a) * 0.3]} s={[0.06, 0.06, 0.7]} c="#2A2C33" rot={[0, a, 0]} />
    ))}
    <group position={[0, 1.75, 0.05]} rotation={[0, 0, 0.15]}>
      <Cil r={0.8} h={0.04} c="#F7F5F0" rot={[Math.PI / 2, 0, 0]} seg={20} />
      <Cil p={[0, 0, 0.025]} r={0.8} rTopo={0.8} h={0.02} c="#F7F5F0" rot={[Math.PI / 2, 0, 0]} seg={20} />
      <Cil p={[0, 0, 0.0]} r={0.84} h={0.03} c="#17181D" rot={[Math.PI / 2, 0, 0]} seg={20} sombra={false} />
      <Cil p={[0, 0, 0.032]} r={0.74} h={0.01} c="#E2B341" rot={[Math.PI / 2, 0, 0]} seg={20} sombra={false} />
    </group>
  </group>
);

const Estante: React.FC = () => {
  const lombadas = ["#D4A537", "#3B82F6", "#EF4444", "#F7F5F0", "#3DDC84", "#8B5E3C", "#F7A8C4", "#17181D"];
  return (
    <group position={[X_ESQ + 0.4, 0, -4.6]} rotation={[0, Math.PI / 2, 0]}>
      <Cx p={[0, 1.5, 0]} s={[2.4, 3.0, 0.1]} c="#8B5E3C" sombra />
      <Cx p={[-1.15, 1.5, 0.3]} s={[0.1, 3.0, 0.7]} c="#6F4A2F" />
      <Cx p={[1.15, 1.5, 0.3]} s={[0.1, 3.0, 0.7]} c="#6F4A2F" />
      {[0.05, 0.85, 1.65, 2.45, 3.0].map((y, i) => (
        <Cx key={i} p={[0, y, 0.3]} s={[2.4, 0.08, 0.7]} c="#6F4A2F" />
      ))}
      {/* albuns de casamento (prateleiras 1 e 2) */}
      {Array.from({ length: 14 }, (_, k) => (
        <Cx key={k} p={[-1.0 + k * 0.15, 1.3 + 0.0, 0.3]} s={[0.12, 0.7 + (k % 3) * 0.04, 0.5]} c={lombadas[k % lombadas.length]} />
      ))}
      {Array.from({ length: 10 }, (_, k) => (
        <Cx key={k} p={[-1.0 + k * 0.2, 0.48, 0.3]} s={[0.16, 0.62, 0.5]} c={lombadas[(k + 3) % lombadas.length]} />
      ))}
      {/* lentes (prateleira de cima) */}
      {[-0.8, -0.35, 0.1, 0.55].map((x, k) => (
        <group key={k} position={[x, 1.88 + 0.12 * (k % 2), 0.3]}>
          <Cil r={0.12 + 0.02 * (k % 2)} h={0.34} c="#17181D" seg={12} />
          <Cil p={[0, 0.17, 0]} r={0.12 + 0.02 * (k % 2)} h={0.03} c="#E2B341" seg={12} sombra={false} />
        </group>
      ))}
      <Cx p={[0.95, 2.1, 0.3]} s={[0.3, 0.4, 0.3]} c="#F7F5F0" />
      {/* topo: porta-retratos e planta */}
      <Cx p={[-0.7, 3.25, 0.3]} s={[0.5, 0.42, 0.05]} c="#17181D" />
      <Cx p={[-0.7, 3.25, 0.33]} s={[0.4, 0.32, 0.02]} c="#F2C6A0" />
    </group>
  );
};

// mesa de edicao: monitor com grade de fotos, teclado, luminaria e cadeira
const MesaEdicao: React.FC = () => {
  const faixas = ["#F2C6A0", "#BFD8EA", "#F7D6E0", "#D6EBC8", "#E9D3B0", "#BFD8EA", "#F2C6A0", "#D6EBC8"];
  return (
    <group position={[-5.3, 0, Z_FUNDO + 1.0]}>
      <Cx p={[0, 1.0, 0]} s={[3.2, 0.12, 1.4]} c="#8B5E3C" sombra />
      {[-1.45, 1.45].map((x) => [-0.55, 0.55].map((z) => <Cx key={`${x}${z}`} p={[x, 0.5, z]} s={[0.12, 1, 0.12]} c="#6F4A2F" />))}
      <Cx p={[0, 1.78, -0.3]} s={[1.9, 1.15, 0.08]} c="#17181D" sombra />
      <Cx p={[0, 1.78, -0.255]} s={[1.78, 1.03, 0.02]} c="#1B2A44" />
      {faixas.map((c, i) => (
        <Cx key={i} p={[-0.6 + (i % 4) * 0.4, 1.98 - Math.floor(i / 4) * 0.5, -0.24]} s={[0.34, 0.4, 0.02]} c={c} e={c} ei={0.35} />
      ))}
      <Cx p={[0, 1.25, -0.3]} s={[0.15, 0.3, 0.1]} c="#2A2C33" />
      <Cx p={[0.2, 1.08, 0.2]} s={[0.8, 0.04, 0.28]} c="#2A2C33" />
      <Cx p={[1.0, 1.07, 0.2]} s={[0.1, 0.03, 0.16]} c="#F7F5F0" />
      <Cil p={[-1.3, 1.1, -0.2]} r={0.17} h={0.08} c="#17181D" />
      <Cil p={[-1.3, 1.45, -0.2]} r={0.03} h={0.7} c="#17181D" />
      <Cil p={[-1.3, 1.85, -0.2]} r={0.25} rTopo={0.08} h={0.3} c="#F5C542" e="#F5C542" ei={0.5} />
      <Cil p={[1.35, 1.2, -0.1]} r={0.1} rTopo={0.08} h={0.2} c="#EF4444" />
      <group position={[-0.1, 0, 1.4]} rotation={[0, 0.25, 0]}>
        <B p={[0, 0.65, 0]} s={[0.9, 0.12, 0.9]} c="#3B82F6" r={0.06} />
        <B p={[0, 1.15, -0.4]} s={[0.9, 0.9, 0.1]} c="#3B82F6" r={0.06} />
        <Cil p={[0, 0.33, 0]} r={0.06} h={0.6} c="#2A2C33" />
        <Cil p={[0, 0.05, 0]} r={0.45} rTopo={0.1} h={0.1} c="#2A2C33" seg={5} />
      </group>
    </group>
  );
};

const Planta: React.FC<{ p: [number, number, number]; k?: number }> = ({ p, k = 1 }) => (
  <group position={p} scale={k}>
    <Cil p={[0, 0.3, 0]} r={0.32} rTopo={0.4} h={0.6} c="#E07A3F" seg={10} />
    <Esf p={[0, 1.0, 0]} r={0.5} c="#4CAF6A" seg={7} />
    <Esf p={[0.3, 1.45, 0.1]} r={0.35} c="#5BC27A" seg={7} />
    <Esf p={[-0.3, 1.35, -0.1]} r={0.32} c="#3E9B5B" seg={7} />
  </group>
);

// manequim com vestido de noiva
const Manequim: React.FC = () => (
  <group position={[7.2, 0, -6.2]} rotation={[0, -0.5, 0]}>
    <Cil p={[0, 0.05, 0]} r={0.35} h={0.08} c="#2A2C33" seg={10} />
    <Cil p={[0, 0.8, 0]} r={0.03} h={1.5} c="#2A2C33" seg={6} />
    <Cone p={[0, 0.85, 0]} r={0.62} h={1.7} c="#FFFFFF" seg={14} rot={[Math.PI, 0, 0]} />
    <B p={[0, 1.82, 0]} s={[0.42, 0.46, 0.26]} c="#FFFFFF" r={0.08} />
    <Esf p={[0, 2.18, 0]} r={0.13} c="#E9DFC9" seg={8} />
    <B p={[0, 1.7, 0.14]} s={[0.46, 0.06, 0.04]} c="#F7A8C4" r={0.01} sombra={false} />
  </group>
);

const Flores: React.FC = () => (
  <group position={[-5.9, 0, 3.8]}>
    <Cil p={[0, 0.35, 0]} r={0.3} h={0.7} c="#8B5E3C" seg={10} />
    <Cil p={[0, 0.9, 0]} r={0.16} rTopo={0.12} h={0.4} c="#BFD8EA" seg={10} />
    {[[0, 1.3, 0, "#FFFFFF"], [0.15, 1.25, 0.08, "#F7B6C8"], [-0.14, 1.28, -0.05, "#FFFFFF"], [0.02, 1.4, 0.1, "#F7B6C8"], [-0.08, 1.2, 0.14, "#FFFFFF"]].map((q, k) => (
      <Esf key={k} p={[q[0] as number, q[1] as number, q[2] as number]} r={0.13} c={q[3] as string} seg={7} />
    ))}
  </group>
);

const Malas: React.FC = () => (
  <group position={[-5.5, 0, 5.0]} rotation={[0, 0.5, 0]}>
    <B p={[0, 0.28, 0]} s={[0.9, 0.56, 0.5]} c="#17181D" r={0.06} sombra />
    <Cx p={[0.0, 0.58, 0]} s={[0.4, 0.04, 0.08]} c="#8A8F9C" />
    <B p={[0.3, 0.8, 0.0]} s={[0.55, 0.4, 0.4]} c="#2A2C33" r={0.06} />
    <Cx p={[0.3, 0.8, 0.205]} s={[0.12, 0.08, 0.02]} c="#E2B341" />
    <Cil p={[-0.65, 0.2, 0.1]} r={0.1} h={0.4} c="#2A2C33" seg={10} />
  </group>
);

const Luzinhas: React.FC = () => (
  <group>
    {Array.from({ length: 26 }, (_, i) => {
      const x = -7 + (i * 14) / 25;
      const y = 6.0 - 0.55 * Math.sin((i / 25) * Math.PI);
      return <Esf key={i} p={[x, y, Z_FUNDO + 0.15]} r={0.07} c="#FFE9A8" e="#FFD25A" ei={1.2} seg={6} />;
    })}
  </group>
);

export const Ambiente: React.FC = () => (
  <group>
    {/* chao */}
    <mesh position={[0, -0.001, 0]} rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
      <planeGeometry args={[80, 80]} />
      <meshStandardMaterial color="#A9773F" roughness={0.9} />
    </mesh>
    <Tabuas cor="#C9955F" par />
    <Tabuas cor="#BD8A55" par={false} />
    {/* parede do fundo e parede da esquerda */}
    <mesh position={[0, 7, Z_FUNDO]} receiveShadow>
      <planeGeometry args={[80, 14]} />
      <meshStandardMaterial color="#EFE6D6" roughness={0.95} />
    </mesh>
    <B p={[0, 0.14, Z_FUNDO + 0.05]} s={[40, 0.28, 0.1]} c="#D9CCB6" r={0.02} />
    <mesh position={[X_ESQ, 7, 0]} rotation={[0, Math.PI / 2, 0]} receiveShadow>
      <planeGeometry args={[40, 14]} />
      <meshStandardMaterial color="#EAE0CE" roughness={0.95} />
    </mesh>
    <B p={[X_ESQ + 0.05, 0.14, 0]} s={[0.1, 0.28, 40]} c="#D9CCB6" r={0.02} />
    <Janela />
    <Luzinhas />
    {/* quadros de casamento na parede do fundo */}
    <Moldura p={[1.2, 3.9, Z_FUNDO + 0.06]} w={1.5} h={1.1} tom={0} />
    <Moldura p={[3.1, 3.4, Z_FUNDO + 0.06]} w={1.1} h={1.5} tom={1} moldura="#8B5E3C" />
    <Moldura p={[4.6, 4.1, Z_FUNDO + 0.06]} w={1.3} h={0.95} tom={2} />
    <Moldura p={[0.9, 2.5, Z_FUNDO + 0.06]} w={0.9} h={0.9} tom={3} moldura="#E2B341" />
    {/* quadros na parede da esquerda */}
    <group rotation={[0, Math.PI / 2, 0]} position={[X_ESQ, 0, 0]}>
      <Moldura p={[-1.5, 3.6, 0.06]} w={1.6} h={1.15} tom={4} />
      <Moldura p={[0.6, 3.9, 0.06]} w={1.1} h={1.5} tom={0} moldura="#8B5E3C" />
      <Moldura p={[2.4, 3.5, 0.06]} w={1.4} h={1.0} tom={2} />
    </group>
    <MesaEdicao />
    <FundoInfinito />
    <Softbox />
    <Tripe />
    <Refletor />
    <Estante />
    <Manequim />
    <Flores />
    <Malas />
    <Planta p={[-7.7, 0, -8.6]} />
    <Planta p={[8.4, 0, -8.7]} k={1.2} />
    <Planta p={[6.8, 0, 5.2]} k={0.8} />
  </group>
);
