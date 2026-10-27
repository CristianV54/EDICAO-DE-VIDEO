import React from "react";
import { useCurrentFrame } from "remotion";
import { B, Cone, Esf } from "./primitivas";
import type { Vec3 } from "../dados/roteiro";

export type ParamsPersonagem = {
  pele: string;
  cabelo: string;
  camisa: string; // torso e mangas
  calca: string;
  sapato: string;
  barba?: boolean;
  mangasDobradas?: boolean;
  vestido?: string; // se definido, saia de cone no lugar das pernas
  cabeloLongo?: boolean;
  gravata?: string;
  camera?: boolean; // camera preta sempre nas maos + alca no pescoco
};

export type PoseProps = {
  position: Vec3;
  rotY?: number;
  escala?: number;
  olhar?: number; // giro da cabeca (rad, relativo ao corpo)
  levanta?: number; // 0..1: camera ao rosto
  caminha?: number; // fase da caminhada em rad (0 = parado)
  opacidade?: number;
  acena?: number; // 0..1: braco direito levantado, balancando
  // rotacao [x, z] de cada braco (substitui a pose padrao): usado em apontar, gesto de duvida, segurar o celular
  bracos?: { esq?: [number, number]; dir?: [number, number] };
  maoDir?: React.ReactNode; // objeto na ponta do braco direito
  maoEsq?: React.ReactNode;
  balanco?: number; // inclinacao lateral do corpo (danca), rad
  cameraNode?: React.ReactNode; // conteudo da camera nas maos (substitui a camera padrao)
  escalaCamera?: number;
};

export const PERSONAGENS = {
  fotografo: {
    pele: "#E8B48A", cabelo: "#3A2A1E", camisa: "#F4F4F2", calca: "#1E2230", sapato: "#FFFFFF",
    barba: true, mangasDobradas: true, camera: true,
  } as ParamsPersonagem,
  // casal de amigos (ato 1)
  noiva: {
    pele: "#EBBB95", cabelo: "#5A3A26", camisa: "#FFFFFF", calca: "#FFFFFF", sapato: "#FFFFFF",
    vestido: "#FFFFFF", cabeloLongo: true,
  } as ParamsPersonagem,
  noivo: {
    pele: "#E3AE86", cabelo: "#2C2018", camisa: "#1F2A44", calca: "#1F2A44", sapato: "#111111",
    gravata: "#D4A537",
  } as ParamsPersonagem,
  // casal cliente (ato 2)
  noivaCliente: {
    pele: "#EBBB95", cabelo: "#B5532E", camisa: "#FFFFFF", calca: "#FFFFFF", sapato: "#FFFFFF",
    vestido: "#FFFFFF", cabeloLongo: true,
  } as ParamsPersonagem,
  noivoCliente: {
    pele: "#E3AE86", cabelo: "#2C2018", camisa: "#3B5BA9", calca: "#3B5BA9", sapato: "#111111",
    gravata: "#FFFFFF",
  } as ParamsPersonagem,
  // personagem curioso (s05)
  curioso: {
    pele: "#D9A27A", cabelo: "#241A14", camisa: "#9CA3AF", calca: "#3E5C8A", sapato: "#F4F4F2",
  } as ParamsPersonagem,
  // casal indicado (s13)
  noivaIndicada: {
    pele: "#F0C4A0", cabelo: "#E3C27A", camisa: "#FFFFFF", calca: "#FFFFFF", sapato: "#FFFFFF",
    vestido: "#FFFFFF", cabeloLongo: true,
  } as ParamsPersonagem,
  noivoIndicado: {
    pele: "#D9A27A", cabelo: "#241A14", camisa: "#6B7280", calca: "#6B7280", sapato: "#111111",
    gravata: "#D4A537",
  } as ParamsPersonagem,
};

// Constroi um personagem low-poly de caixas. Reutilizado pelo fotografo, noivos e novo cliente.
export function criarPersonagem(params: ParamsPersonagem): React.FC<PoseProps> {
  const P = params;
  const Personagem: React.FC<PoseProps> = ({ position, rotY = 0, escala = 1, olhar = 0, levanta = 0, caminha = 0, opacidade = 1, acena = 0, balanco = 0, cameraNode, escalaCamera = 1, bracos, maoDir, maoEsq }) => {
    const frame = useCurrentFrame();
    const respira = 1 + 0.015 * Math.sin((frame / 90) * Math.PI * 2); // ciclo de 3 s a 30 fps
    const o = opacidade < 1 ? opacidade : undefined;
    const passo = caminha !== 0 ? Math.sin(caminha) * 0.5 : 0;
    // bracos: com camera, ficam a frente; sem camera, balancam ao andar
    const anguloBraco = P.camera ? -0.95 + (-1.75 + 0.95) * levanta : 0;
    const cameraPos: Vec3 = [0, 1.25 + 0.45 * levanta, 0.46 + 0.04 * levanta];
    const rotBraco = (lado: number): [number, number, number] => {
      const ov = bracos?.[lado === 1 ? "dir" : "esq"];
      if (ov) return [ov[0], 0, ov[1]];
      if (lado === 1 && acena > 0) return [-0.3, 0, 2.45 + 0.35 * Math.sin(frame * 0.7) * acena];
      return [P.camera ? anguloBraco : -lado * passo, 0, P.camera ? -lado * 0.36 : lado * 0.05];
    };
    const manga = P.mangasDobradas ? P.camisa : P.camisa;
    const antebraco = P.mangasDobradas ? P.pele : P.camisa;
    return (
      <group position={position} rotation={[0, rotY, 0]} scale={escala}>
        <group rotation={[0, 0, balanco]}>
        {/* pernas / saia */}
        {P.vestido ? (
          <>
            <Cone p={[0, 0.5, 0]} r={0.52} h={1.0} c={P.vestido} seg={12} />
            <B p={[-0.1, 0.03, 0.05]} s={[0.16, 0.06, 0.26]} c={P.sapato} o={o} />
            <B p={[0.1, 0.03, 0.05]} s={[0.16, 0.06, 0.26]} c={P.sapato} o={o} />
          </>
        ) : (
          [-1, 1].map((lado) => (
            <group key={lado} position={[lado * 0.13, 0.85, 0]} rotation={[lado * passo, 0, 0]}>
              <B p={[0, -0.4, 0]} s={[0.2, 0.8, 0.23]} c={P.calca} o={o} />
              <B p={[0, -0.8, 0.05]} s={[0.22, 0.12, 0.34]} c={P.sapato} o={o} />
            </group>
          ))
        )}
        {/* tronco com respiracao */}
        <group position={[0, 0.85, 0]} scale={[1, respira, 1]}>
          <B p={[0, 0.35, 0]} s={[0.64, 0.72, 0.34]} c={P.camisa} o={o} />
          {P.gravata && <B p={[0, 0.4, 0.18]} s={[0.09, 0.42, 0.03]} c={P.gravata} r={0.01} o={o} />}
          {P.vestido && <B p={[0, 0.58, 0.18]} s={[0.4, 0.04, 0.03]} c="#F2E4D0" r={0.01} o={o} />}
          {P.camera && <B p={[0, 0.66, 0]} s={[0.46, 0.05, 0.3]} c="#111114" r={0.02} o={o} />}
          {/* bracos */}
          {[-1, 1].map((lado) => (
            <group key={lado} position={[lado * 0.4, 0.6, 0]} rotation={rotBraco(lado)}>
              <B p={[0, -0.14, 0]} s={[0.18, 0.3, 0.18]} c={manga} o={o} />
              <B p={[0, -0.42, 0]} s={[0.15, 0.3, 0.15]} c={antebraco} o={o} />
              <B p={[0, -0.6, 0]} s={[0.14, 0.1, 0.14]} c={P.pele} o={o} />
              {(lado === 1 ? maoDir : maoEsq) && <group position={[0, -0.68, 0.04]}>{lado === 1 ? maoDir : maoEsq}</group>}
            </group>
          ))}
        </group>
        {/* camera preta nas maos */}
        {P.camera && (
          <group position={cameraPos} scale={escalaCamera}>
            {cameraNode ?? <B s={[0.38, 0.24, 0.2]} c="#111114" r={0.03} />}
          </group>
        )}
        {/* cabeca */}
        <group position={[0, 1.78, 0]} rotation={[0, olhar, 0]}>
          <B p={[0, -0.18, 0]} s={[0.12, 0.12, 0.12]} c={P.pele} o={o} />
          <B p={[0, 0.05, 0]} s={[0.4, 0.42, 0.38]} c={P.pele} o={o} />
          <B p={[0, 0.27, -0.01]} s={[0.43, 0.14, 0.41]} c={P.cabelo} o={o} />
          <B p={[0, 0.34, 0.1]} s={[0.3, 0.12, 0.2]} c={P.cabelo} r={0.04} o={o} />
          <B p={[-0.2, 0.12, -0.02]} s={[0.05, 0.22, 0.36]} c={P.cabelo} o={o} />
          <B p={[0.2, 0.12, -0.02]} s={[0.05, 0.22, 0.36]} c={P.cabelo} o={o} />
          <B p={[0, 0.1, -0.2]} s={[0.4, 0.3, 0.05]} c={P.cabelo} o={o} />
          {P.cabeloLongo && <B p={[0, -0.12, -0.2]} s={[0.42, 0.5, 0.08]} c={P.cabelo} o={o} />}
          {P.cabeloLongo && <Esf p={[0, 0.4, -0.12]} r={0.1} c={P.cabelo} seg={8} o={o} />}
          {P.barba && <B p={[0, -0.07, 0.17]} s={[0.36, 0.12, 0.08]} c={P.cabelo} r={0.03} o={o} />}
          <B p={[-0.09, 0.07, 0.19]} s={[0.05, 0.06, 0.02]} c="#1A1A1A" r={0.01} o={o} />
          <B p={[0.09, 0.07, 0.19]} s={[0.05, 0.06, 0.02]} c="#1A1A1A" r={0.01} o={o} />
          <B p={[0, 0.0, 0.2]} s={[0.05, 0.07, 0.04]} c={P.pele} r={0.015} o={o} />
        </group>
        </group>
      </group>
    );
  };
  return Personagem;
}

export const Fotografo = criarPersonagem(PERSONAGENS.fotografo);
export const Noiva = criarPersonagem(PERSONAGENS.noiva);
export const Noivo = criarPersonagem(PERSONAGENS.noivo);
export const NoivaCliente = criarPersonagem(PERSONAGENS.noivaCliente);
export const NoivoCliente = criarPersonagem(PERSONAGENS.noivoCliente);
export const Curioso = criarPersonagem(PERSONAGENS.curioso);
export const NoivaIndicada = criarPersonagem(PERSONAGENS.noivaIndicada);
export const NoivoIndicado = criarPersonagem(PERSONAGENS.noivoIndicado);
