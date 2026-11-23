import React from 'react';
import {AbsoluteFill, interpolate, spring, useCurrentFrame, useVideoConfig, Easing} from 'remotion';
import {cores, fonte} from './tema';
import {Personagem} from './Personagem';

const clipes = [
  {x: 0, w: 380, cor: cores.azul},
  {x: 390, w: 250, cor: cores.vermelho}, // trecho ruim, vai cair
  {x: 650, w: 460, cor: cores.verde},
  {x: 1120, w: 340, cor: cores.azul},
];

export const Teste: React.FC = () => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const entra = spring({frame: frame - 8, fps, config: {damping: 11, mass: 0.8}});
  // personagem anda até o clipe vermelho (quadros 40 a 70)
  const anda = interpolate(frame, [40, 70], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: Easing.inOut(Easing.cubic)});
  const px = interpolate(anda, [0, 1], [260, 780]);
  // corte no quadro 80: clipe vermelho cai, os outros fecham o buraco
  const cai = interpolate(frame, [80, 105], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: Easing.in(Easing.quad)});
  const fecha = spring({frame: frame - 98, fps, config: {damping: 14}});
  // câmera: aproxima de leve e depois afasta
  const zoom = interpolate(frame, [0, 75, 110, 150], [1.12, 1.25, 1.25, 1], {extrapolateRight: 'clamp', easing: Easing.inOut(Easing.cubic)});
  const camX = interpolate(frame, [0, 75, 110, 150], [60, -120, -120, 0], {extrapolateRight: 'clamp', easing: Easing.inOut(Easing.cubic)});
  const titulo = spring({frame: frame - 112, fps, config: {damping: 13}});
  const pulo = frame >= 76 && frame < 88 ? -Math.sin(((frame - 76) / 12) * Math.PI) * 60 : 0;

  return (
    <AbsoluteFill style={{background: cores.fundo, fontFamily: fonte}}>
      <AbsoluteFill style={{transform: `scale(${zoom}) translateX(${camX}px)`}}>
        {/* linha do tempo */}
        <div style={{position: 'absolute', left: 230, top: 640, width: 1460, height: 190, background: cores.painel, borderRadius: 24, border: `2px solid ${cores.linha}`}} />
        {clipes.map((c, i) => {
          const ruim = i === 1;
          const desloca = i > 1 ? -260 * fecha : 0;
          return (
            <div
              key={i}
              style={{
                position: 'absolute',
                left: 250 + c.x + desloca,
                top: 670 + (ruim ? cai * 520 : 0),
                width: c.w,
                height: 130,
                borderRadius: 16,
                background: c.cor,
                opacity: ruim ? 1 - cai : 0.92,
                transform: ruim ? `rotate(${cai * 14}deg)` : undefined,
              }}
            />
          );
        })}
        {/* agulha */}
        <div style={{position: 'absolute', left: px + 108, top: 620, width: 5, height: 230, background: cores.creme, borderRadius: 3}} />
        {/* personagem */}
        <div style={{position: 'absolute', left: px, top: 390 + pulo + (1 - entra) * -600, transform: `scale(${entra})`}}>
          <Personagem tamanho={220} olharX={anda < 1 ? 1 : 0} olharY={0.8} giro={anda * 180} />
        </div>
      </AbsoluteFill>
      <div style={{position: 'absolute', top: 150, width: '100%', textAlign: 'center', color: cores.creme, fontSize: 92, fontWeight: 800, letterSpacing: -2, opacity: titulo, transform: `translateY(${(1 - titulo) * 40}px)`}}>
        Este vídeo <span style={{color: cores.laranja}}>não teve editor</span>
      </div>
    </AbsoluteFill>
  );
};
