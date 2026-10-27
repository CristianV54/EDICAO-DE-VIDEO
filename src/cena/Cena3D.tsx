import React, { useLayoutEffect } from "react";
import { useCurrentFrame } from "remotion";
import { useThree } from "@react-three/fiber";
import * as THREE from "three";
import { Ambiente } from "./Ambiente";
import { Plataforma } from "./Plataforma";
import { PECAS_ATO2 } from "./Pecas";
import { Cabos } from "./Cabos";
import { Confete } from "./Confete";
import { Festa } from "./Festa";
import { Telao } from "./Telao";
import { Casal } from "./Casal";
import { CameraFotografo } from "./CameraFotografo";
import { Fotografo } from "./Personagem";
import { TexturasProvider } from "./Texturas";
import { cameraPorFrame } from "./cameraPorFrame";
import {
  CASAL_AMIGOS, ROT_CASAL_AMIGOS, ENTRADA_CLIENTE, FOTOGRAFO_ATO1, FOTOGRAFO_ATO2, INDICADO_DESTINO, INDICADO_ORIGEM,
  LUGAR_CLIENTE, PECA, ROT_FOTOGRAFO_ATO1, ROT_FOTOGRAFO_ATO2, TOPO, V3,
} from "../dados/posicoes";
import { CAMINHADA_INDICADO, LINHAS, clamp01, easeInOutCubic, lerp, segDe, springQueda, FPS } from "../util/tempo";

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

// fator de luz: 25% em "apagaram", 75% no estouro do flash, 100% ao fim do segmento (s04)
export const fatorLuz = (frame: number) => {
  const L = LINHAS[4];
  if (frame < L.prob) return 1;
  if (frame < L.sol) return lerp(1, 0.25, easeInOutCubic((frame - L.prob) / 15));
  const volta = lerp(0.25, 0.75, clamp01((frame - L.sol) / 12));
  return frame < L.fim - 6 ? volta : lerp(0.75, 1, clamp01((frame - (L.fim - 6)) / 30));
};

const Luzes: React.FC<{ k: number }> = ({ k }) => {
  const escuro = 1 - (Math.min(k, 1) - 0.25) / 0.75;
  const amb = new THREE.Color("#FFF1DC").lerp(new THREE.Color("#4A5CA8"), escuro * 0.75);
  const dir = new THREE.Color("#FFFFFF").lerp(new THREE.Color("#6F86D8"), escuro * 0.7);
  return (
    <>
      <ambientLight color={amb} intensity={0.6 * k} />
      <directionalLight
        color={dir}
        position={[6, 10, 6]}
        intensity={1.3 * k}
        castShadow
        shadow-mapSize={[1024, 1024]}
        shadow-camera-left={-9}
        shadow-camera-right={9}
        shadow-camera-top={9}
        shadow-camera-bottom={-9}
        shadow-camera-near={1}
        shadow-camera-far={40}
        shadow-bias={-0.0005}
      />
      <hemisphereLight color="#FFF3DC" groundColor="#C9955F" intensity={0.5 * k} />
    </>
  );
};

// ---------- ato 2: pecas ----------
const PecaAto2: React.FC<{ n: number; frame: number }> = ({ n, frame }) => {
  const L = LINHAS[n];
  const Comp = PECAS_ATO2[n];
  const props = { f: frame, fq: frame - L.toque, fp: frame - L.prob, fs: frame - L.sol, fseg: L.segunda === null ? -9999 : frame - L.segunda };
  if (n === 13) {
    // coracao entre os dois casais, no momento da chegada do casal indicado
    if (frame < L.toque) return null;
    const mid: V3 = [(INDICADO_DESTINO[0] + LUGAR_CLIENTE[11][0]) / 2, TOPO + 1.45, (INDICADO_DESTINO[2] + LUGAR_CLIENTE[11][2]) / 2];
    return (
      <group position={mid}>
        <Comp {...props} />
      </group>
    );
  }
  if (frame < L.quedaIni) return null;
  const [x, y, z] = PECA[n];
  const sp = springQueda(frame - L.quedaIni);
  const dy = Math.max(0, 1 - sp) * 3;
  const achata = frame - L.toque >= 0 && frame - L.toque < 3;
  return (
    <group position={[x, y + dy, z]} scale={achata ? [1.08, 0.85, 1.08] : [1, 1, 1]}>
      <Comp {...props} />
    </group>
  );
};

// ---------- fotografo ----------
const girarPara = (de: [number, number], para: [number, number]) => Math.atan2(para[0] - de[0], para[1] - de[1]);
const ANGULO_ANDA = 90; // frames da caminhada do ato 1 para o ato 2

type EstadoFotografo = { pos: V3; rotY: number; caminha: number };
const estadoFotografo = (frame: number): EstadoFotografo => {
  const ini = LINHAS[6].ini;
  const t = frame - ini;
  if (t < 0) return { pos: FOTOGRAFO_ATO1, rotY: ROT_FOTOGRAFO_ATO1, caminha: 0 };
  if (t < ANGULO_ANDA) {
    const u = easeInOutCubic(t / ANGULO_ANDA);
    const pos: V3 = [lerp(FOTOGRAFO_ATO1[0], FOTOGRAFO_ATO2[0], u), TOPO, lerp(FOTOGRAFO_ATO1[2], FOTOGRAFO_ATO2[2], u)];
    const rot = girarPara([FOTOGRAFO_ATO1[0], FOTOGRAFO_ATO1[2]], [FOTOGRAFO_ATO2[0], FOTOGRAFO_ATO2[2]]);
    return { pos, rotY: rot, caminha: ((t / FPS) * Math.PI * 2) % (Math.PI * 2) || 0.001 };
  }
  const rot0 = girarPara([FOTOGRAFO_ATO1[0], FOTOGRAFO_ATO1[2]], [FOTOGRAFO_ATO2[0], FOTOGRAFO_ATO2[2]]);
  const giro = easeInOutCubic((t - ANGULO_ANDA) / 15);
  return { pos: FOTOGRAFO_ATO2, rotY: lerp(rot0, ROT_FOTOGRAFO_ATO2, giro), caminha: 0 };
};

const olharRel = (i: number, rotY: number, pos: V3): number => {
  if (i < 5 || i === 14) return 0;
  const alvo = i === 12 ? ([PECA[12][0], PECA[12][2]] as [number, number]) : i === 13 ? ([INDICADO_DESTINO[0], INDICADO_DESTINO[2]] as [number, number]) : ([PECA[i][0], PECA[i][2]] as [number, number]);
  let rel = girarPara([pos[0], pos[2]], alvo) - rotY;
  while (rel > Math.PI) rel -= Math.PI * 2;
  while (rel < -Math.PI) rel += Math.PI * 2;
  return Math.max(-1.1, Math.min(1.1, rel));
};

const ElencoFotografo: React.FC<{ frame: number }> = ({ frame }) => {
  const i = segDe(frame);
  const L0 = LINHAS[0];
  const est = estadoFotografo(frame);
  const sobe = clamp01((frame - (L0.prob - 18)) / 14);
  const desce = clamp01((frame - (L0.prob + 12)) / 14);
  const levanta = easeInOutCubic(sobe) * (1 - easeInOutCubic(desce));
  const ini = LINHAS[i].ini;
  const t = easeInOutCubic((frame - ini) / 15);
  const olhar = lerp(olharRel(Math.max(0, i - 1), est.rotY, est.pos), olharRel(i, est.rotY, est.pos), t);
  return (
    <Fotografo
      position={est.pos}
      rotY={est.rotY}
      olhar={olhar}
      levanta={levanta}
      caminha={est.caminha}
      cameraNode={<CameraFotografo frame={frame} />}
    />
  );
};

// ---------- casais ----------
const CasalAmigos: React.FC<{ frame: number }> = ({ frame }) => {
  const L4 = LINHAS[4];
  const L5 = LINHAS[5];
  if (frame >= L5.fim) return null;
  const fade = 1 - clamp01((frame - (L5.fim - 20)) / 20);
  const dancando = frame >= L4.ini && frame < L4.fim;
  const balanco = dancando ? 0.1 * Math.sin(frame * 0.3) : 0;
  const dx = dancando ? 0.08 * Math.sin(frame * 0.3) : 0;
  const acena = frame >= L5.fim - 70 ? 1 : 0;
  return (
    <Casal
      tipo="amigos"
      position={[CASAL_AMIGOS[0] + dx, CASAL_AMIGOS[1], CASAL_AMIGOS[2]]}
      rotY={ROT_CASAL_AMIGOS}
      balanco={balanco}
      acena={acena}
      opacidade={fade}
    />
  );
};

const REPOUSO = 0.25; // rotY de repouso do casal cliente (de frente para o espectador)
const DUR_ANDA = 60;
type Trecho = { ini: number; de: V3; para: V3; dur: number };
const trechosCliente = (): Trecho[] => {
  const L6 = LINHAS[6];
  const entrada = Math.min(L6.segunda ?? L6.fim - DUR_ANDA - 2, L6.fim - DUR_ANDA - 2);
  return [
    { ini: entrada, de: ENTRADA_CLIENTE, para: LUGAR_CLIENTE[6], dur: DUR_ANDA },
    { ini: LINHAS[7].ini, de: LUGAR_CLIENTE[6], para: LUGAR_CLIENTE[7], dur: DUR_ANDA },
    { ini: LINHAS[8].ini, de: LUGAR_CLIENTE[7], para: LUGAR_CLIENTE[8], dur: DUR_ANDA },
    { ini: LINHAS[9].ini, de: LUGAR_CLIENTE[8], para: LUGAR_CLIENTE[9], dur: DUR_ANDA },
    { ini: LINHAS[11].ini, de: LUGAR_CLIENTE[9], para: LUGAR_CLIENTE[11], dur: DUR_ANDA },
  ];
};
const TRECHOS = trechosCliente();

const CasalCliente: React.FC<{ frame: number }> = ({ frame }) => {
  if (frame < TRECHOS[0].ini) return null;
  let k = 0;
  TRECHOS.forEach((tr, idx) => {
    if (frame >= tr.ini) k = idx;
  });
  const tr = TRECHOS[k];
  const t = frame - tr.ini;
  const u = easeInOutCubic(t / tr.dur);
  const andando = t < tr.dur;
  let x = lerp(tr.de[0], tr.para[0], u);
  const z = lerp(tr.de[2], tr.para[2], u);
  let y = tr.de[1] + (tr.para[1] - tr.de[1]) * u;
  if (k === 0) y = TOPO * clamp01((6.5 - x) / 0.4); // sobe na plataforma
  const heading = girarPara([tr.de[0], tr.de[2]], [tr.para[0], tr.para[2]]);
  const fim = clamp01((t - (tr.dur - 12)) / 12);
  let rotY = andando ? lerp(heading, REPOUSO, fim) : REPOUSO;
  // s08: vira de costas em "desmarca" (140 graus) e recua 0,3; volta em "assinado"
  const L8 = LINHAS[8];
  const vira = easeInOutCubic((frame - L8.prob) / 12) * (1 - easeInOutCubic((frame - L8.sol) / 12));
  if (frame >= L8.prob && frame < L8.sol + 14) {
    rotY += vira * ((140 * Math.PI) / 180);
    x -= vira * 0.3;
  }
  // s11: vira para o tablet em "galeria"
  const L11 = LINHAS[11];
  if (frame >= L11.sol) rotY = lerp(REPOUSO, girarPara([LUGAR_CLIENTE[11][0], LUGAR_CLIENTE[11][2]], [PECA[11][0], PECA[11][2]]), easeInOutCubic((frame - L11.sol) / 14));
  const caminha = andando ? ((t / FPS) * Math.PI * 2) % (Math.PI * 2) || 0.001 : 0;
  // olha para a peca do segmento (s06..s11)
  const i = segDe(frame);
  const olhar = i >= 6 && i <= 11 && !andando ? Math.max(-0.9, Math.min(0.9, girarPara([x, z], [PECA[i][0], PECA[i][2]]) - rotY)) : 0;
  return <Casal tipo="cliente" position={[x, y, z]} rotY={rotY} caminha={caminha} olhar={olhar} />;
};

const CasalIndicado: React.FC<{ frame: number }> = ({ frame }) => {
  const L = LINHAS[13];
  const t = frame - L.prob;
  if (t < 0) return null;
  const u = easeInOutCubic(t / CAMINHADA_INDICADO);
  const x = lerp(INDICADO_ORIGEM[0], INDICADO_DESTINO[0], u);
  const andando = t < CAMINHADA_INDICADO;
  const rotY = andando ? -Math.PI / 2 : lerp(-Math.PI / 2, -0.9, clamp01((t - CAMINHADA_INDICADO) / 14));
  const caminha = andando ? ((t / FPS) * Math.PI * 2) % (Math.PI * 2) || 0.001 : 0;
  return <Casal tipo="indicado" position={[x, TOPO, INDICADO_DESTINO[2]]} rotY={rotY} caminha={caminha} opacidade={clamp01(t / 8)} />;
};

export const Cena3D: React.FC = () => {
  const frame = useCurrentFrame();
  const k = fatorLuz(frame);
  return (
    <TexturasProvider>
      <CameraRig frame={frame} />
      <Luzes k={k} />
      <Ambiente />
      <Plataforma />
      <Telao frame={frame} />
      {[5, 6, 7, 8, 9, 10, 11, 12, 13].map((n) => (
        <PecaAto2 key={n} n={n} frame={frame} />
      ))}
      <Cabos frame={frame} />
      <ElencoFotografo frame={frame} />
      <CasalAmigos frame={frame} />
      <CasalCliente frame={frame} />
      <CasalIndicado frame={frame} />
      <Festa frame={frame} luz={k} />
      <Confete frame={frame} />
    </TexturasProvider>
  );
};

void FOTOGRAFO_ATO1;
