import React, {useMemo} from 'react';
import * as THREE from 'three';

// Estilhaços de vidro espalhados em volta de um ponto.
const aleatorio = (n: number) => {
  const x = Math.sin(n * 127.1 + 311.7) * 43758.5453;
  return x - Math.floor(x);
};

export const Estilhacos: React.FC<{centro: [number, number, number]; quantos?: number; raioMin?: number; raioMax?: number; semente?: number}> = ({centro, quantos = 34, raioMin = 2, raioMax = 4.6, semente = 1}) => {
  const geo = useMemo(() => {
    const f = new THREE.Shape();
    f.moveTo(0, 0.5);
    f.lineTo(0.32, -0.35);
    f.lineTo(-0.42, -0.2);
    f.closePath();
    return new THREE.ExtrudeGeometry(f, {depth: 0.03, bevelEnabled: false});
  }, []);
  const mat = useMemo(
    () => new THREE.MeshPhysicalMaterial({color: '#c9f3ff', roughness: 0.05, metalness: 0.1, transparent: true, opacity: 0.62, emissive: '#5eead4', emissiveIntensity: 0.35, side: THREE.DoubleSide, envMapIntensity: 2.5}),
    []
  );
  return (
    <group position={centro}>
      {Array.from({length: quantos}).map((_, i) => {
        const k = i + semente * 100;
        const ang = (i / quantos) * Math.PI * 2 + aleatorio(k) * 0.5;
        const r = raioMin + aleatorio(k + 1) * (raioMax - raioMin);
        const tam = 0.35 + aleatorio(k + 2) * 0.95;
        return (
          <mesh
            key={i}
            geometry={geo}
            material={mat}
            position={[Math.cos(ang) * r * 1.15, Math.sin(ang) * r * 0.8, -0.6 + aleatorio(k + 3) * 2.6]}
            rotation={[aleatorio(k + 4) * 3, aleatorio(k + 5) * 3, ang + aleatorio(k + 6) * 2]}
            scale={[tam, tam * (0.6 + aleatorio(k + 7)), 1]}
          />
        );
      })}
    </group>
  );
};
