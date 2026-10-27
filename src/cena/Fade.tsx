import React, { useLayoutEffect, useRef } from "react";
import * as THREE from "three";

// grupo com opacidade: percorre os materiais dos filhos e multiplica a opacidade base (itens temporarios somem com fade)
export const Fade: React.FC<{ op: number; children: React.ReactNode }> = ({ op, children }) => {
  const ref = useRef<THREE.Group>(null);
  useLayoutEffect(() => {
    ref.current?.traverse((obj) => {
      const m = (obj as THREE.Mesh).material as THREE.Material | THREE.Material[] | undefined;
      if (!m) return;
      (Array.isArray(m) ? m : [m]).forEach((mm) => {
        if (mm.userData.op0 === undefined) mm.userData.op0 = mm.opacity;
        const transp = op < 0.999 || mm.userData.op0 < 1;
        if (mm.transparent !== transp) {
          mm.transparent = transp;
          mm.needsUpdate = true;
        }
        mm.opacity = mm.userData.op0 * op;
      });
    });
  });
  return (
    <group ref={ref} visible={op > 0.004}>
      {children}
    </group>
  );
};
