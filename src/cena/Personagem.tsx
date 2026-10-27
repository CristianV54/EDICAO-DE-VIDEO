import React from "react";
import { useCurrentFrame } from "remotion";
import * as THREE from "three";
import { B } from "./primitivas";
import { ALT, CABECA_Y, OMBRO_X, OMBRO_Y, TRONCO, V3, alcaPontos, centroCamera, cotovelo, maoNaCamera } from "./geometria";

export type Expr = "normal" | "feliz" | "emocao";
export type ParamsPersonagem = {
  pele: string;
  cabelo: string;
  camisa: string; // torso e mangas (ou o terno inteiro)
  calca: string;
  sapato: string;
  barba?: boolean;
  mangasDobradas?: boolean; // antebraco com a cor da pele
  vestido?: string; // saia no lugar das pernas
  penteado?: "curto" | "coque" | "longo";
  gravata?: string;
  camera?: boolean; // alca preta no pescoco e maos na camera
};

export type PoseProps = {
  position: V3;
  rotY?: number;
  opacidade?: number;
  passo?: number; // balanco das pernas em rad (0 = parado)
  lev?: number; // camera na mao: 0 no peito, 1 ao rosto
  expr?: Expr;
  mp?: V3; // alvo local da mao do lado x positivo (substitui a pose padrao)
  mn?: V3; // alvo local da mao do lado x negativo
  segurarMp?: React.ReactNode;
  segurarMn?: React.ReactNode;
  camera?: React.ReactNode;
  olhar?: number; // giro da cabeca (rad)
  inclinaCabeca?: number; // rad, em torno de z
  inclina?: number; // balanco lateral do corpo (danca), rad
};

export const PERSONAGENS = {
  fotografo: { pele: "#E8B48A", cabelo: "#3A2A1E", camisa: "#F4F4F2", calca: "#1E2230", sapato: "#FFFFFF", barba: true, mangasDobradas: true, camera: true, penteado: "curto" } as ParamsPersonagem,
  amigo: { pele: "#E3AE86", cabelo: "#2C2018", camisa: "#22C55E", calca: "#2F3A52", sapato: "#F4F4F2", penteado: "curto" } as ParamsPersonagem,
  amiga: { pele: "#EBBB95", cabelo: "#5A3A26", camisa: "#FACC15", calca: "#FACC15", sapato: "#F4F4F2", vestido: "#FACC15", penteado: "longo" } as ParamsPersonagem,
  noiva: { pele: "#EBBB95", cabelo: "#B5532E", camisa: "#FFFFFF", calca: "#FFFFFF", sapato: "#FFFFFF", vestido: "#FFFFFF", penteado: "coque" } as ParamsPersonagem,
  noivo: { pele: "#E3AE86", cabelo: "#2C2018", camisa: "#3B5BA9", calca: "#3B5BA9", sapato: "#111111", gravata: "#FFFFFF", penteado: "curto" } as ParamsPersonagem,
  madrinha: { pele: "#D9A27A", cabelo: "#15110F", camisa: "#C084FC", calca: "#C084FC", sapato: "#F4F4F2", vestido: "#C084FC", penteado: "longo" } as ParamsPersonagem,
};

// segmento de caixa entre dois pontos (membros)
export const Seg: React.FC<{ a: V3; b: V3; w: number; c: string; o?: number }> = ({ a, b, w, c, o }) => {
  const dir = new THREE.Vector3(b[0] - a[0], b[1] - a[1], b[2] - a[2]);
  const len = Math.max(0.001, dir.length());
  const q = new THREE.Quaternion().setFromUnitVectors(new THREE.Vector3(0, 1, 0), dir.normalize());
  return (
    <mesh position={[(a[0] + b[0]) / 2, (a[1] + b[1]) / 2, (a[2] + b[2]) / 2]} quaternion={q} castShadow>
      <boxGeometry args={[w, len, w]} />
      <meshStandardMaterial color={c} roughness={0.8} transparent={o !== undefined && o < 1} opacity={o ?? 1} />
    </mesh>
  );
};

const Arco: React.FC<{ p: V3; r: number; rot?: number; cor?: string; esp?: number }> = ({ p, r, rot = 0, cor = "#1A1A1A", esp = 0.014 }) => (
  <mesh position={p} rotation={[0, 0, rot]}>
    <torusGeometry args={[r, esp, 5, 10, Math.PI]} />
    <meshStandardMaterial color={cor} />
  </mesh>
);

export function criarPersonagem(P: ParamsPersonagem): React.FC<PoseProps> {
  const Personagem: React.FC<PoseProps> = ({ position, rotY = 0, opacidade = 1, passo = 0, lev = 0, expr = "normal", mp, mn, segurarMp, segurarMn, camera, olhar = 0, inclinaCabeca = 0, inclina = 0 }) => {
    const frame = useCurrentFrame();
    const o = opacidade < 1 ? opacidade : undefined;
    const respira = 1 + 0.015 * Math.sin((frame / 90) * Math.PI * 2);
    const corTronco = P.vestido ?? P.camisa;
    // alvos das maos
    const alvo = (lado: 1 | -1): V3 => {
      const dado = lado === 1 ? mp : mn;
      if (dado) return dado;
      if (P.camera) return maoNaCamera(lado, lev);
      return [lado * 0.36, 0.57, 0.03 - lado * passo * 0.3];
    };
    const braco = (lado: 1 | -1) => {
      const ombro: V3 = [lado * OMBRO_X, OMBRO_Y, 0];
      const mao = alvo(lado);
      const cot = cotovelo(ombro, mao, [lado * 0.6, -0.8, -0.35]);
      const manga = P.vestido && !P.camera ? P.pele : P.camisa;
      const ante = P.mangasDobradas || P.vestido ? P.pele : P.camisa;
      return (
        <group key={lado}>
          <Seg a={ombro} b={cot} w={0.14} c={manga} o={o} />
          <Seg a={cot} b={mao} w={0.12} c={ante} o={o} />
          <B p={mao} s={[0.1, 0.1, 0.1]} c={P.pele} r={0.03} o={o} />
          <B p={cot} s={[0.14, 0.14, 0.14]} c={manga} r={0.04} o={o} sombra={false} />
          {(lado === 1 ? segurarMp : segurarMn) && <group position={mao}>{lado === 1 ? segurarMp : segurarMn}</group>}
        </group>
      );
    };
    const alca = P.camera
      ? ([1, -1] as const).map((lado) => {
          const { de, para } = alcaPontos(lado, lev);
          return <Seg key={lado} a={de} b={para} w={0.035} c="#101114" o={o} />;
        })
      : null;
    return (
      <group position={position} rotation={[0, rotY, 0]}>
        <group rotation={[0, 0, inclina]}>
          {/* pernas ou saia */}
          {P.vestido ? (
            <>
              <mesh position={[0, 0.42, 0]} castShadow receiveShadow>
                <cylinderGeometry args={[0.27, 0.42, 0.8, 10]} />
                <meshStandardMaterial color={P.vestido} roughness={0.85} transparent={o !== undefined} opacity={o ?? 1} />
              </mesh>
              {[-1, 1].map((l) => (
                <B key={l} p={[l * 0.12, 0.05, 0.06 + l * passo * 0.12]} s={[0.2, 0.1, 0.3]} c={P.sapato} o={o} />
              ))}
            </>
          ) : (
            [-1, 1].map((l) => (
              <group key={l} position={[l * 0.13, 0.62, 0]} rotation={[l * passo, 0, 0]}>
                <B p={[0, -0.26, 0]} s={[0.2, 0.52, 0.22]} c={P.calca} o={o} />
                <B p={[0, -0.57, 0.05]} s={[0.22, 0.1, 0.34]} c={P.sapato} o={o} />
              </group>
            ))
          )}
          {/* tronco */}
          <group position={[0, 0.62, 0]} scale={[1, respira, 1]}>
            <B p={[0, 0.25, 0]} s={[TRONCO.t[0], TRONCO.t[1], TRONCO.t[2]]} c={corTronco} o={o} />
            {P.gravata && <B p={[0, 0.3, 0.125]} s={[0.07, 0.34, 0.02]} c={P.gravata} r={0.01} o={o} />}
            {P.camera && <B p={[0, 0.5, 0]} s={[0.3, 0.04, 0.2]} c="#101114" r={0.01} o={o} sombra={false} />}
          </group>
          {braco(1)}
          {braco(-1)}
          {alca}
          {camera && <group position={centroCamera(lev)}>{camera}</group>}
          {/* pescoco e cabeca (cubo de 0,42) */}
          <B p={[0, 1.19, 0]} s={[0.12, 0.14, 0.12]} c={P.pele} o={o} sombra={false} />
          <group position={[0, CABECA_Y, 0]} rotation={[0, olhar, inclinaCabeca]}>
            <B s={[0.42, 0.42, 0.42]} c={P.pele} r={0.04} o={o} />
            <B p={[0, 0.22, -0.01]} s={[0.45, 0.1, 0.44]} c={P.cabelo} r={0.03} o={o} />
            <B p={[0, 0.15, 0.2]} s={[0.4, 0.07, 0.06]} c={P.cabelo} r={0.02} o={o} sombra={false} />
            <B p={[0, 0.04, -0.2]} s={[0.45, 0.3, 0.06]} c={P.cabelo} r={0.02} o={o} />
            {[-1, 1].map((l) => (
              <B key={l} p={[l * 0.215, 0.06, -0.02]} s={[0.05, 0.22, 0.36]} c={P.cabelo} r={0.015} o={o} sombra={false} />
            ))}
            {P.penteado === "longo" && <B p={[0, -0.2, -0.22]} s={[0.46, 0.55, 0.08]} c={P.cabelo} r={0.03} o={o} />}
            {P.penteado === "coque" && (
              <mesh position={[0, 0.34, -0.06]} castShadow>
                <sphereGeometry args={[0.11, 8, 6]} />
                <meshStandardMaterial color={P.cabelo} transparent={o !== undefined} opacity={o ?? 1} />
              </mesh>
            )}
            {P.barba && <B p={[0, -0.13, 0.19]} s={[0.38, 0.14, 0.06]} c={P.cabelo} r={0.03} o={o} />}
            {/* rosto */}
            {expr === "normal" &&
              [-1, 1].map((l) => <B key={l} p={[l * 0.1, 0.04, 0.215]} s={[0.06, 0.09, 0.01]} c="#1A1A1A" r={0.005} sombra={false} />)}
            {expr !== "normal" && [-1, 1].map((l) => <Arco key={l} p={[l * 0.1, 0.02, 0.215]} r={0.04} />)}
            {expr === "feliz" && <Arco p={[0, -0.04, 0.215]} r={0.05} rot={Math.PI} esp={0.012} />}
            {expr === "normal" && <B p={[0, -0.09, 0.215]} s={[0.1, 0.018, 0.01]} c="#7A3F2A" r={0.005} sombra={false} />}
            {expr === "emocao" && <Arco p={[0, -0.07, 0.215]} r={0.04} rot={Math.PI} esp={0.012} />}
            {expr === "emocao" &&
              [-1, 1].map((l) =>
                [0, 9].map((atraso) => {
                  const t = ((frame + atraso) % 18) / 18;
                  return (
                    <mesh key={`${l}${atraso}`} position={[l * 0.115, 0 - t * 0.28, 0.225]} scale={1 - t * 0.4}>
                      <sphereGeometry args={[0.035, 6, 5]} />
                      <meshBasicMaterial color="#7DD3FC" transparent opacity={0.95 - t * 0.5} />
                    </mesh>
                  );
                }),
              )}
          </group>
        </group>
      </group>
    );
  };
  return Personagem;
}

export const Fotografo = criarPersonagem(PERSONAGENS.fotografo);
export const AmigoVerde = criarPersonagem(PERSONAGENS.amigo);
export const AmigaAmarela = criarPersonagem(PERSONAGENS.amiga);
export const Noiva = criarPersonagem(PERSONAGENS.noiva);
export const Noivo = criarPersonagem(PERSONAGENS.noivo);
export const Madrinha = criarPersonagem(PERSONAGENS.madrinha);
export { ALT };
