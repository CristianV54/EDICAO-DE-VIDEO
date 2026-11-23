import React, {useMemo} from 'react';
import * as THREE from 'three';

type Desenho = (g: CanvasRenderingContext2D, w: number, h: number, f: number) => void;

// Tela com animação de papel passando dentro, redesenhada a cada quadro.
// Com "recorte", o fundo é transparente e a peça fica em pé no cenário.
export const TelaPapel: React.FC<{
  desenhar: Desenho;
  f: number;
  larg: number;
  alt: number;
  px?: number; // largura do desenho em pixels
  posicao?: [number, number, number];
  rotacao?: [number, number, number];
  recorte?: boolean;
  escala?: number;
}> = ({desenhar, f, larg, alt, px = 640, posicao = [0, 0, 0], rotacao = [0, 0, 0], recorte = false, escala = 1}) => {
  const {canvas, tex} = useMemo(() => {
    const c = document.createElement('canvas');
    c.width = px;
    c.height = Math.round((px * alt) / larg);
    const t = new THREE.CanvasTexture(c);
    t.colorSpace = THREE.SRGBColorSpace;
    t.anisotropy = 8;
    return {canvas: c, tex: t};
  }, [px, larg, alt]);
  // o desenho é feito na hora, para o quadro exportado já sair com ele
  const g = canvas.getContext('2d')!;
  g.save();
  if (recorte) g.clearRect(0, 0, canvas.width, canvas.height);
  desenhar(g, canvas.width, canvas.height, f);
  g.restore();
  tex.needsUpdate = true;
  return (
    <mesh position={posicao} rotation={rotacao} scale={escala}>
      <planeGeometry args={[larg, alt]} />
      <meshBasicMaterial map={tex} toneMapped={false} transparent={recorte} alphaTest={recorte ? 0.4 : 0} side={THREE.DoubleSide} />
    </mesh>
  );
};
