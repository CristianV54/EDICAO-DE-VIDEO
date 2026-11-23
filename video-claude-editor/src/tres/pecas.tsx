import React, {useMemo} from 'react';
import * as THREE from 'three';
import {RoundedBoxGeometry} from 'three/examples/jsm/geometries/RoundedBoxGeometry.js';

export const Bloco: React.FC<{
  tam: [number, number, number];
  cor: string;
  posicao?: [number, number, number];
  rotacao?: [number, number, number];
  raio?: number;
  rugosidade?: number;
  emissivo?: string;
  intensidade?: number;
  sombra?: boolean;
}> = ({tam, cor, posicao = [0, 0, 0], rotacao = [0, 0, 0], raio = 0.08, rugosidade = 0.5, emissivo, intensidade = 1, sombra = true}) => {
  const geo = useMemo(() => new RoundedBoxGeometry(tam[0], tam[1], tam[2], 5, Math.min(raio, Math.min(...tam) / 2 - 0.001)), [tam[0], tam[1], tam[2], raio]);
  return (
    <mesh geometry={geo} position={posicao} rotation={rotacao} castShadow={sombra} receiveShadow>
      <meshStandardMaterial color={cor} roughness={rugosidade} emissive={emissivo ?? '#000000'} emissiveIntensity={emissivo ? intensidade : 0} />
    </mesh>
  );
};

// Clipe de vídeo: bloco colorido com ondinha de áudio em relevo na frente.
export const Clipe3D: React.FC<{
  larg: number;
  cor: string;
  posicao?: [number, number, number];
  rotacao?: [number, number, number];
  semente?: number;
  alt?: number;
}> = ({larg, cor, posicao = [0, 0, 0], rotacao = [0, 0, 0], semente = 0, alt = 0.6}) => {
  const n = Math.max(3, Math.floor((larg - 0.3) / 0.13));
  const escuro = useMemo(() => new THREE.Color(cor).multiplyScalar(0.55).getStyle(), [cor]);
  return (
    <group position={posicao} rotation={rotacao}>
      <Bloco tam={[larg, alt, 1.15]} cor={cor} raio={0.13} rugosidade={0.38} />
      {Array.from({length: n}).map((_, i) => {
        const h = 0.08 + Math.abs(Math.sin(i * 1.9 + semente * 3.1)) * 0.3;
        return <Bloco key={i} tam={[0.07, 0.05, h]} cor={escuro} raio={0.02} sombra={false} posicao={[-larg / 2 + 0.2 + i * 0.13, alt / 2 + 0.01, 0.4 - h / 2]} />;
      })}
    </group>
  );
};

export const Luzes: React.FC<{corA?: string; corB?: string; forcaA?: number; forcaB?: number}> = ({corA = '#ff8a4c', corB = '#7ab0ff', forcaA = 160, forcaB = 120}) => (
  <>
    <ambientLight intensity={0.25} />
    <directionalLight
      position={[5, 9, 7]}
      intensity={2.9}
      castShadow
      shadow-mapSize-width={4096}
      shadow-mapSize-height={4096}
      shadow-camera-left={-12}
      shadow-camera-right={12}
      shadow-camera-top={12}
      shadow-camera-bottom={-12}
      shadow-bias={-0.0003}
      shadow-normalBias={0.03}
      shadow-radius={9}
    />
    <directionalLight position={[-6, 4, 5]} intensity={0.7} color="#ffe2cc" />
    <pointLight position={[-5, 4, -3]} intensity={forcaA} color={corA} />
    <pointLight position={[6, 4, -3]} intensity={forcaB} color={corB} />
  </>
);

// Chão que só mostra a sombra, para o fundo em gradiente aparecer.
export const ChaoSombra: React.FC<{y?: number; opacidade?: number}> = ({y = 0, opacidade = 0.45}) => (
  <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, y, 0]} receiveShadow>
    <planeGeometry args={[80, 80]} />
    <shadowMaterial opacity={opacidade} />
  </mesh>
);
