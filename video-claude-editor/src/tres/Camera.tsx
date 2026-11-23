import React, {useLayoutEffect} from 'react';
import {useThree} from '@react-three/fiber';
import * as THREE from 'three';

export const Camera: React.FC<{pos: [number, number, number]; alvo: [number, number, number]; fov?: number}> = ({pos, alvo, fov = 35}) => {
  const camera = useThree((s) => s.camera) as THREE.PerspectiveCamera;
  useLayoutEffect(() => {
    camera.position.set(...pos);
    camera.fov = fov;
    camera.near = 0.1;
    camera.far = 200;
    camera.lookAt(...alvo);
    camera.updateProjectionMatrix();
  }, [camera, pos[0], pos[1], pos[2], alvo[0], alvo[1], alvo[2], fov]);
  return null;
};
