import React, { useLayoutEffect } from "react";
import { useCurrentFrame } from "remotion";
import { useThree } from "@react-three/fiber";
import * as THREE from "three";
import { Ambiente } from "./Ambiente";
import { Plataforma } from "./Plataforma";
import { PECAS } from "./Pecas";
import { Cabos } from "./Cabos";
import { Confete } from "./Confete";
import { Fotografo, Noiva, Noivo, Cliente } from "./Personagem";
import { TexturasProvider } from "./Texturas";
import { cameraPorFrame } from "./cameraPorFrame";
import { POS_PECA, TOPO_PLATAFORMA } from "../dados/roteiro";
import { LINHAS, segDe, springQueda, easeInOutCubic, clamp01, lerp } from "../util/tempo";

const CameraRig: React.FC<{ frame: number }> = ({ frame }) => {
  const camera = useThree((s) => s.camera) as THREE.PerspectiveCamera;
  const pose = cameraPorFrame(frame);
  useLayoutEffect(() => {
    camera.position.set(...pose.pos);
    camera.fov = pose.fov;
    camera.lookAt(...pose.alvo);
    camera.updateProjectionMatrix();
    camera.updateMatrixWorld();
  });
  return null;
};

// fator de luz: cai a 25% em "apagaram" e volta no estouro do flash (s04)
const fatorLuz = (frame: number) => {
  const L = LINHAS[4];
  if (frame < L.prob) return 1;
  if (frame < L.sol) return lerp(1, 0.25, easeInOutCubic((frame - L.prob) / 15));
  return lerp(0.25, 1, clamp01((frame - L.sol) / 12));
};

const Luzes: React.FC<{ frame: number }> = ({ frame }) => {
  const k = fatorLuz(frame);
  const escuro = 1 - (k - 0.25) / 0.75; // 0..1
  const amb = new THREE.Color("#FFF1DC").lerp(new THREE.Color("#4A5CA8"), escuro * 0.75);
  const dir = new THREE.Color("#FFFFFF").lerp(new THREE.Color("#6F86D8"), escuro * 0.7);
  return (
    <>
      <ambientLight color={amb} intensity={0.95 * k} />
      <directionalLight
        color={dir}
        position={[6, 10, 6]}
        intensity={1.5 * k}
        castShadow
        shadow-mapSize={[1024, 1024]}
        shadow-camera-left={-12}
        shadow-camera-right={12}
        shadow-camera-top={12}
        shadow-camera-bottom={-12}
        shadow-camera-near={1}
        shadow-camera-far={40}
        shadow-bias={-0.0005}
      />
      <hemisphereLight color="#FFF3DC" groundColor="#C9955F" intensity={0.8 * k} />
    </>
  );
};

const Peca: React.FC<{ i: number; frame: number }> = ({ i, frame }) => {
  const L = LINHAS[i];
  if (frame < L.quedaIni) return null;
  const [x, z] = POS_PECA[i - 1];
  const Comp = PECAS[i - 1];
  const sp = springQueda(frame - L.quedaIni);
  const dy = Math.max(0, 1 - sp) * 3;
  const fq = frame - L.toque;
  const achata = fq >= 0 && fq < 3;
  return (
    <group position={[x, TOPO_PLATAFORMA + dy, z]} scale={achata ? [1.08, 0.85, 1.08] : [1, 1, 1]}>
      <Comp
        f={frame}
        fq={fq}
        fp={frame - L.prob}
        fs={frame - L.sol}
        fseg={L.segunda === null ? -9999 : frame - L.segunda}
      />
    </group>
  );
};

const POS_FOTOGRAFO: [number, number, number] = [-7, 0, 1.2];
const girarPara = (de: [number, number], para: [number, number]) => Math.atan2(para[0] - de[0], para[1] - de[1]);
const ROT_CAMERA = 0.48;
const ROT_PLATAFORMA = girarPara([-7, 1.2], [0, 0]);
const olharRel = (i: number) => {
  if (i < 1 || i > 13) return 0;
  const [x, z] = POS_PECA[i - 1];
  const rel = girarPara([-7, 1.2], [x, z]) - ROT_PLATAFORMA;
  return Math.max(-1.1, Math.min(1.1, rel));
};

const ElencoFotografo: React.FC<{ frame: number }> = ({ frame }) => {
  const i = segDe(frame);
  const L0 = LINHAS[0];
  const virar = easeInOutCubic((frame - L0.sol) / 18);
  const rotY = lerp(ROT_CAMERA, ROT_PLATAFORMA, virar);
  // camera sobe ao rosto antes do clique e desce depois
  const sobe = clamp01((frame - (L0.prob - 18)) / 14);
  const desce = clamp01((frame - (L0.prob + 12)) / 14);
  const levanta = easeInOutCubic(sobe) * (1 - easeInOutCubic(desce));
  // cabeca gira para a peca do segmento (0,5 s)
  const t = easeInOutCubic((frame - LINHAS[i].ini) / 15);
  const olhar = lerp(olharRel(Math.max(0, i - 1)), olharRel(i), t);
  return <Fotografo position={POS_FOTOGRAFO} rotY={rotY} olhar={olhar} levanta={levanta} />;
};

const NoivosContrato: React.FC<{ frame: number }> = ({ frame }) => {
  const L = LINHAS[8];
  const entra = clamp01((frame - (L.ini + 4)) / 12);
  const sai = 1 - clamp01((frame - (L.fim - 12)) / 12);
  const op = Math.min(entra, sai);
  if (op <= 0.01) return null;
  const dy = (1 - easeInOutCubic(entra)) * 0.7;
  return (
    <group position={[0, TOPO_PLATAFORMA + dy, 0]}>
      <Noiva position={[1.5, 0, 0.5]} rotY={0.25} escala={0.5} opacidade={op} />
      <Noivo position={[2.15, 0, 0.35]} rotY={-0.25} escala={0.5} opacidade={op} />
    </group>
  );
};

const NovoCliente: React.FC<{ frame: number }> = ({ frame }) => {
  const L = LINHAS[13];
  const t = frame - L.prob;
  if (t < 0) return null;
  const u = easeInOutCubic(t / 66);
  const x = lerp(9.5, 5.2, u);
  const andando = t < 66;
  const y = TOPO_PLATAFORMA * clamp01((6.3 - x) / 0.7);
  const rotY = andando ? -Math.PI / 2 : lerp(-Math.PI / 2, -2.2, clamp01((t - 66) / 12));
  return <Cliente position={[x, y, 2.5]} rotY={rotY} caminha={andando ? t * 0.55 : 0} />;
};

export const Cena3D: React.FC = () => {
  const frame = useCurrentFrame();
  return (
    <TexturasProvider>
      <CameraRig frame={frame} />
      <Luzes frame={frame} />
      <Ambiente />
      <Plataforma />
      {Array.from({ length: 13 }, (_, k) => (
        <Peca key={k} i={k + 1} frame={frame} />
      ))}
      <Cabos frame={frame} />
      <ElencoFotografo frame={frame} />
      <NoivosContrato frame={frame} />
      <NovoCliente frame={frame} />
      <Confete frame={frame} />
    </TexturasProvider>
  );
};
