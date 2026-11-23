import React, {useMemo} from 'react';
import * as THREE from 'three';
import {texturaHalo} from './formas';

// Brilho colorido atrás de um objeto. A cor precisa estar no formato #rrggbb.
export const Halo: React.FC<{cor: string; tam?: number; z?: number; forca?: number}> = ({cor, tam = 5, z = -0.5, forca = 1}) => {
  const tex = useMemo(() => texturaHalo(cor), [cor]);
  return (
    <mesh position={[0, 0, z]} renderOrder={-1}>
      <planeGeometry args={[tam, tam]} />
      <meshBasicMaterial map={tex} transparent opacity={forca} blending={THREE.AdditiveBlending} depthWrite={false} toneMapped={false} />
    </mesh>
  );
};
