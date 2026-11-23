import React, {useMemo} from 'react';
import * as THREE from 'three';
import {RoundedBoxGeometry} from 'three/examples/jsm/geometries/RoundedBoxGeometry.js';
import {cores} from '../tema';

// Personagem principal: bloco laranja de cantos arredondados com a estrela clara em relevo.
// Desenho próprio, feito para lembrar o ícone do Claude.
const RAIOS = [0.8, 0.62, 0.76, 0.58, 0.8, 0.64, 0.74, 0.6, 0.8, 0.62, 0.72, 0.6];

export const Icone3D: React.FC<{
  posicao?: [number, number, number];
  rotacao?: [number, number, number];
  escala?: number;
  tempo?: number;
  brilho?: number; // quanto a estrela emite luz
}> = ({posicao = [0, 0, 0], rotacao = [0, 0, 0], escala = 1, tempo = 0, brilho = 0.35}) => {
  const corpo = useMemo(() => new RoundedBoxGeometry(2.2, 2.2, 0.62, 8, 0.3), []);
  const matCorpo = useMemo(() => new THREE.MeshPhysicalMaterial({color: '#ee7444', roughness: 0.3, clearcoat: 0.8, clearcoatRoughness: 0.25, emissive: '#c2410c', emissiveIntensity: 0.28}), []);
  const matEstrela = useMemo(
    () => new THREE.MeshStandardMaterial({color: cores.creme, roughness: 0.35, emissive: cores.creme, emissiveIntensity: brilho}),
    [brilho]
  );
  // cantos bem redondos: escala o bloco para o raio parecer maior nas faces
  return (
    <group position={posicao} rotation={rotacao} scale={escala}>
      <mesh geometry={corpo} material={matCorpo} castShadow receiveShadow />
      <group position={[0, 0, 0.31]}>
        {RAIOS.map((r, i) => {
          const ang = (i / RAIOS.length) * Math.PI * 2 + 0.12;
          const comp = r + Math.sin(tempo / 8 + i * 1.7) * 0.015;
          return (
            <group key={i} rotation={[0, 0, ang]}>
              <mesh material={matEstrela} position={[0, 0.1 + comp / 2, 0]} scale={[1, 1, 0.45]} castShadow>
                <capsuleGeometry args={[0.082, comp - 0.1, 8, 16]} />
              </mesh>
            </group>
          );
        })}
        <mesh material={matEstrela} scale={[1, 1, 0.45]}>
          <sphereGeometry args={[0.2, 24, 16]} />
        </mesh>
      </group>
    </group>
  );
};
