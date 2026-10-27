import React, { useMemo } from "react";
import * as THREE from "three";
import { B } from "./primitivas";
import { CAMINHO_SETA, CASA, N_CASAS, TABULEIRO, Y_BASE, Y_CASA, pastilhasDaTrilha } from "../dados/posicoes";
import { LINHAS, clamp01, easeInOutCubic } from "../util/tempo";

const BORDA = 0.3;
const PX_POR_M = 80;
const DOURADO = "#E2B341";

const useTampo = (larg: number, prof: number) =>
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

const useNumeros = () =>
  useMemo(() => {
    return Array.from({ length: N_CASAS }, (_, i) => {
      const c = document.createElement("canvas");
      c.width = 192;
      c.height = 192;
      const g = c.getContext("2d")!;
      g.fillStyle = "#D4A537";
      g.textAlign = "center";
      g.textBaseline = "middle";
      g.font = "900 140px Montserrat";
      g.fillText(String(i + 1), 96, 104);
      const t = new THREE.CanvasTexture(c);
      t.colorSpace = THREE.SRGBColorSpace;
      return t;
    });
  }, []);

// frame em que o fotografo chega em cada casa
const chegadaCasa = (n: number) => LINHAS[n].chegada;

// trilha n (casa n para n+1): comeca a acender 0,2 s depois da ancora solucao do segmento n
export const inicioTrilha = (n: number) => LINHAS[n].sol + 6;
const PASSO_PASTILHA = 4;

// pulso final do ciclo (s13): todas as trilhas piscam em sequencia, 0,08 s por trilha
export const PISCA_TRILHA = 2.4; // frames
export const inicioPisca = () => LINHAS[13].sol;

export const Tabuleiro: React.FC<{ frame: number }> = ({ frame }) => {
  const { largura: L, profundidade: P } = TABULEIRO;
  const iL = L - 2 * BORDA;
  const iP = P - 2 * BORDA;
  const tampo = useTampo(iL, iP);
  const nums = useNumeros();
  const curva = useMemo(() => new THREE.CatmullRomCurve3(CAMINHO_SETA.map((p) => new THREE.Vector3(...p))), []);
  const pontosSeta = useMemo(() => curva.getPoints(36), [curva]);

  // progresso da seta: acende em "pronto" do s13 durante 1,2 s
  const seta = clamp01((frame - LINHAS[13].sol) / 36);
  const NSEG = pontosSeta.length - 1;

  return (
    <group>
      <B p={[0, 0.025, 0]} s={[L + 1.3, 0.05, P + 0.8]} c="#E8DCC4" r={0.02} />
      <B p={[0, Y_BASE / 2, 0]} s={[L, Y_BASE, P]} c="#2A2D35" r={0.06} />
      <mesh position={[0, Y_BASE + 0.002, 0]} rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
        <planeGeometry args={[iL, iP]} />
        <meshStandardMaterial map={tampo} roughness={0.9} />
      </mesh>
      {Array.from({ length: 22 }, (_, i) => (
        <mesh key={i} position={[-5.4 + i * (10.8 / 21), 0.2, P / 2 + 0.005]}>
          <boxGeometry args={[0.36, 0.07, 0.02]} />
          <meshStandardMaterial color={DOURADO} emissive={DOURADO} emissiveIntensity={1.4} />
        </mesh>
      ))}
      {/* casas */}
      {CASA.map(([x, z], i) => {
        const n = i + 1;
        const opFinal = 0.4 + 0.6 * easeInOutCubic(clamp01((frame - chegadaCasa(n)) / 8));
        return (
          <group key={n} position={[x, 0, z]}>
            <B p={[0, Y_BASE + 0.02, 0]} s={[2.0, 0.04, 2.0]} c="#F7F5F0" r={0.015} o={opFinal < 1 ? opFinal : undefined} sombra={false} />
            <mesh position={[-0.68, Y_CASA + 0.002, 0.68]} rotation={[-Math.PI / 2, 0, 0]}>
              <planeGeometry args={[0.4, 0.4]} />
              <meshBasicMaterial map={nums[i]} transparent opacity={opFinal} toneMapped={false} depthWrite={false} />
            </mesh>
          </group>
        );
      })}
      {/* trilhas */}
      {Array.from({ length: N_CASAS - 1 }, (_, k) => {
        const n = k + 1;
        const ini = inicioTrilha(n);
        const pts = pastilhasDaTrilha(n);
        const pisca = (() => {
          const f0 = inicioPisca() + (n - 1) * PISCA_TRILHA;
          const d = frame - f0;
          return d >= 0 && d < PISCA_TRILHA * 2 ? 1 - Math.abs(d / PISCA_TRILHA - 1) : 0;
        })();
        // bolinha dourada percorre a trilha em 30 frames depois de acender as pastilhas
        const tb = (frame - (ini + 6)) / 30;
        const bola = tb >= 0 && tb <= 1 ? pts.length > 0 : false;
        const a = pts[0];
        const b = pts[pts.length - 1];
        return (
          <group key={n}>
            {pts.map((p, j) => {
              const acesa = frame >= ini + j * PASSO_PASTILHA;
              return (
                <mesh key={j} position={[p[0], p[1] + 0.008, p[2]]} scale={acesa ? 1 + pisca * 0.5 : 1}>
                  <cylinderGeometry args={[0.04, 0.04, 0.016, 12]} />
                  <meshStandardMaterial color={acesa ? DOURADO : "#3B7BF2"} transparent opacity={acesa ? 1 : 0.3} emissive={DOURADO} emissiveIntensity={acesa ? 0.8 + pisca * 1.6 : 0} roughness={0.6} />
                </mesh>
              );
            })}
            {bola && (
              <mesh position={[a[0] + (b[0] - a[0]) * tb, a[1] + 0.1, a[2] + (b[2] - a[2]) * tb]}>
                <sphereGeometry args={[0.07, 10, 8]} />
                <meshStandardMaterial color={DOURADO} emissive={DOURADO} emissiveIntensity={1.6} />
              </mesh>
            )}
          </group>
        );
      })}
      {/* seta dourada do ciclo (casa 13 para a casa 1): apagada ate "pronto" */}
      {pontosSeta.slice(0, NSEG).map((p, k) => {
        const q = pontosSeta[k + 1];
        const acesa = seta * NSEG > k;
        if (!acesa) return null;
        const dir = new THREE.Vector3().subVectors(q, p);
        const len = dir.length();
        const quat = new THREE.Quaternion().setFromUnitVectors(new THREE.Vector3(0, 1, 0), dir.clone().normalize());
        return (
          <mesh key={k} position={[(p.x + q.x) / 2, (p.y + q.y) / 2, (p.z + q.z) / 2]} quaternion={quat} castShadow>
            <cylinderGeometry args={[0.06, 0.06, len * 1.05, 10]} />
            <meshStandardMaterial color={acesa ? DOURADO : "#6F6A5C"} emissive={DOURADO} emissiveIntensity={acesa ? 1.2 : 0} roughness={0.5} />
          </mesh>
        );
      })}
      {seta >= 1 && (() => {
        const p = pontosSeta[NSEG];
        const q = pontosSeta[NSEG - 1];
        const dir = new THREE.Vector3().subVectors(p, q).normalize();
        const quat = new THREE.Quaternion().setFromUnitVectors(new THREE.Vector3(0, 1, 0), dir);
        const pos = p.clone().addScaledVector(dir, 0.12);
        return (
          <mesh position={pos} quaternion={quat} castShadow>
            <coneGeometry args={[0.16, 0.3, 12]} />
            <meshStandardMaterial color={seta >= 1 ? DOURADO : "#6F6A5C"} emissive={DOURADO} emissiveIntensity={seta >= 1 ? 1.2 : 0} />
          </mesh>
        );
      })()}
    </group>
  );
};
