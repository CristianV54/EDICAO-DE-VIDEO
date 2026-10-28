import React from "react";
import { useCurrentFrame } from "remotion";
import { useThree } from "@react-three/fiber";
import type * as THREE from "three";
import { TexturasProvider } from "./Texturas";
import { Ambiente } from "./Ambiente";
import { Tabuleiro } from "./Tabuleiro";
import { Elenco } from "./Elenco";
import { Estacoes } from "./Estacoes";
import { PlacaFoto, CASAS_PLACA } from "./PlacaFoto";
import { Confete } from "./Confete";
import { cameraPorFrame } from "./cameraPorFrame";
import { centroCasa, posCelularCasa3, posFot } from "../dados/posicoes";
import { luzFesta, luzFlash, luzFogo, luzGlobal } from "./luz";
import { LINHAS } from "../util/tempo";
import { B, Cil } from "./primitivas";

const CameraRig: React.FC<{ frame: number }> = ({ frame }) => {
  const { camera } = useThree();
  const pose = cameraPorFrame(frame);
  camera.position.set(...pose.pos);
  camera.lookAt(...pose.alvo);
  const c = camera as THREE.PerspectiveCamera;
  if (c.fov !== pose.fov) {
    c.fov = pose.fov;
  }
  c.updateProjectionMatrix();
  return null;
};

// celular da casa 3 e um pedido: o balao de depoimento chega ate ele (ver Estacoes). Aqui ficam as luzes.
const Luzes: React.FC<{ frame: number }> = ({ frame }) => {
  const g = luzGlobal(frame);
  const festa = luzFesta(frame);
  const c9 = centroCasa(9);
  const ang = (frame / 30) * 2.2;
  const cores = ["#FF3DA5", "#2FD6FF", "#FFD25A"];
  const fogo = posFot(10);
  const sl = LINHAS[9].sol;
  void sl;
  return (
    <>
      <ambientLight intensity={0.85 * g} />
      <hemisphereLight args={["#FFFFFF", "#B9A98A", 0.35 * g]} />
      <directionalLight
        position={[6, 14, 9]}
        intensity={1.9 * g}
        castShadow
        shadow-mapSize={[2048, 2048]}
        shadow-camera-left={-9}
        shadow-camera-right={9}
        shadow-camera-top={9}
        shadow-camera-bottom={-9}
        shadow-camera-near={1}
        shadow-camera-far={40}
        shadow-bias={-0.0004}
      />
      {cores.map((cor, k) => {
        const a = ang + (k * Math.PI * 2) / 3;
        return <pointLight key={k} color={cor} intensity={8 * festa} distance={7} decay={1.6} position={[c9[0] + Math.cos(a) * 1.7, 2.3, c9[2] + Math.sin(a) * 1.7]} />;
      })}
      <pointLight color="#FFFFFF" intensity={luzFlash(frame)} distance={9} decay={1.5} position={[c9[0] + 0.4, 1.6, c9[2] + 0.6]} />
      <pointLight color="#FF2A2A" intensity={luzFogo(frame)} distance={4} decay={1.6} position={[fogo[0] - 0.3, 1.0, fogo[2] - 0.4]} />
    </>
  );
};

export const Cena3D: React.FC = () => {
  const frame = useCurrentFrame();
  void posCelularCasa3;
  void B;
  void Cil;
  return (
    <TexturasProvider>
      <CameraRig frame={frame} />
      <Luzes frame={frame} />
      <Ambiente />
      <Tabuleiro frame={frame} />
      <Estacoes f={frame} />
      {CASAS_PLACA.map((n) => (
        <PlacaFoto key={n} n={n} f={frame} />
      ))}
      <Elenco frame={frame} />
      <Confete frame={frame} />
    </TexturasProvider>
  );
};
