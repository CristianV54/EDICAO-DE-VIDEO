import React, {useMemo} from 'react';
import * as THREE from 'three';
import {FontLoader} from 'three/examples/jsm/loaders/FontLoader.js';
import {TextGeometry} from 'three/examples/jsm/geometries/TextGeometry.js';
import helvetiker from 'three/examples/fonts/helvetiker_bold.typeface.json';
import {extrudar, gota, placa} from './formas';
import {Halo} from './Halo';

// Ícones de programas de edição, em desenho próprio e simplificado.
// vida: 1 = aceso e colorido, 0 = apagado e acinzentado.
const misturar = (cor: string, vida: number, apagado = '#4a4a50'): string => new THREE.Color(apagado).lerp(new THREE.Color(cor), vida).getStyle();

type Props = {posicao?: [number, number, number]; rotacao?: [number, number, number]; escala?: number; vida?: number};

// Rachadura: fita escura em zigue-zague sobre a frente do ícone.
const Rachaduras: React.FC<{origem: [number, number]; semente: number; z: number}> = ({origem, semente, z}) => {
  const geos = useMemo(() => {
    const lista: THREE.TubeGeometry[] = [];
    for (let i = 0; i < 6; i++) {
      let a = (i / 6) * Math.PI * 2 + semente;
      let [x, y] = origem;
      const pts = [new THREE.Vector3(x, y, 0)];
      for (let k = 0; k < 7; k++) {
        a += Math.sin(semente * 7.3 + i * 4.1 + k * 2.9) * 0.75;
        x += Math.cos(a) * 0.26;
        y += Math.sin(a) * 0.26;
        if (Math.abs(x) > 0.98 || Math.abs(y) > 0.98) break;
        pts.push(new THREE.Vector3(x, y, 0));
      }
      if (pts.length > 2) lista.push(new THREE.TubeGeometry(new THREE.CatmullRomCurve3(pts, false, 'catmullrom', 0.05), 60, 0.04, 5, false));
    }
    return lista;
  }, [origem[0], origem[1], semente]);
  return (
    <group position={[0, 0, z]} scale={[1, 1, 0.35]}>
      {geos.map((g, i) => (
        <mesh key={i} geometry={g}>
          <meshStandardMaterial color="#060606" roughness={0.9} />
        </mesh>
      ))}
    </group>
  );
};

export const DaVinci3D: React.FC<Props & {rachado?: boolean}> = ({posicao = [0, 0, 0], rotacao = [0, 0, 0], escala = 1, vida = 1, rachado = false}) => {
  const corpo = useMemo(() => placa(2.2, 2.2, 0.56, 0.42, 0.12), []);
  const face = useMemo(() => placa(1.86, 1.86, 0.42, 0.02, 0.03), []);
  const petala = useMemo(() => extrudar(gota(0.06, 0.5, 0.31), 0.07, 0.03), []);
  const cores = ['#2fd8ea', '#f7e11c', '#f2415c'];
  return (
    <group position={posicao} rotation={rotacao} scale={escala}>
      {vida > 0.5 ? <Halo cor="#58c8ff" tam={6} forca={vida * 0.55} /> : null}
      <mesh geometry={corpo} castShadow receiveShadow>
        <meshPhysicalMaterial color={misturar('#dfe6f2', vida, '#5a5a60')} roughness={0.35} clearcoat={0.4} emissive="#9fc4ff" emissiveIntensity={0.25 * vida} />
      </mesh>
      <mesh geometry={face} position={[0, 0, 0.335]}>
        <meshStandardMaterial color="#1e2129" roughness={0.75} />
      </mesh>
      {cores.map((cor, i) => (
        <mesh key={i} geometry={petala} position={[0, -0.04, 0.36]} rotation={[0, 0, (i * Math.PI * 2) / 3]} castShadow>
          <meshStandardMaterial color={misturar(cor, 0.25 + vida * 0.75)} roughness={0.35} emissive={cor} emissiveIntensity={0.9 * vida} />
        </mesh>
      ))}
      {rachado ? <Rachaduras origem={[-0.3, 0.25]} semente={2.2} z={0.47} /> : null}
    </group>
  );
};

export const Premiere3D: React.FC<Props & {rachado?: boolean}> = ({posicao = [0, 0, 0], rotacao = [0, 0, 0], escala = 1, vida = 1, rachado = false}) => {
  const corpo = useMemo(() => placa(2.2, 2.2, 0.56, 0.42, 0.12), []);
  const face = useMemo(() => placa(1.86, 1.86, 0.42, 0.02, 0.03), []);
  const letras = useMemo(() => {
    const fonte = new FontLoader().parse(helvetiker as never);
    const g = new TextGeometry('Pr', {font: fonte, size: 0.86, depth: 0.06, curveSegments: 12, bevelEnabled: true, bevelThickness: 0.02, bevelSize: 0.015, bevelSegments: 4});
    g.computeBoundingBox();
    const b = g.boundingBox!;
    g.translate(-(b.max.x + b.min.x) / 2, -(b.max.y + b.min.y) / 2, 0);
    return g;
  }, []);
  const lilas = '#a3a3ff';
  return (
    <group position={posicao} rotation={rotacao} scale={escala}>
      {vida > 0.5 ? <Halo cor="#7a6cff" tam={6} forca={vida * 0.6} /> : null}
      <mesh geometry={corpo} castShadow receiveShadow>
        <meshPhysicalMaterial color={misturar(lilas, vida, '#5c5c66')} roughness={0.35} clearcoat={0.4} emissive="#6a5cff" emissiveIntensity={0.35 * vida} />
      </mesh>
      <mesh geometry={face} position={[0, 0, 0.335]}>
        <meshStandardMaterial color={misturar('#12086b', 0.4 + vida * 0.6, '#1c1c24')} roughness={0.7} />
      </mesh>
      <mesh geometry={letras} position={[0, -0.02, 0.36]} castShadow>
        <meshStandardMaterial color={misturar(lilas, 0.3 + vida * 0.7)} roughness={0.35} emissive={lilas} emissiveIntensity={0.7 * vida} />
      </mesh>
      {rachado ? <Rachaduras origem={[0.3, 0.3]} semente={0.7} z={0.47} /> : null}
    </group>
  );
};
