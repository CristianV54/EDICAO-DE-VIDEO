import React from "react";
import { PointLight } from "three";
import { B, Cil, PlanoTex } from "./primitivas";
import { useTex } from "./Texturas";
import { LINHAS, clamp01, easeInOutCubic, easeOutBack, springQueda, TOQUE_REL } from "../util/tempo";

// Camera caricata (maior que a real) segurada pelo fotografo. Frente = +Z local.
// Recebe as pecas do ato 1: lente (s02), cartoes (s03) e flash (s04). Tudo e funcao do frame.
const PRETO = "#1C1C1F";
const DOURADO = "#D4A537";

export const CameraFotografo: React.FC<{ frame: number }> = ({ frame }) => {
  const auto = useTex("auto");
  const modoM = useTex("m");
  const sd = useTex("sd");
  const lente50 = useTex("lente");
  const L1 = LINHAS[1];
  const L2 = LINHAS[2];
  const L3 = LINHAS[3];
  const L4 = LINHAS[4];

  // s01: pulso no momento da peca; seletor gira em "caro"
  const fp1 = frame - L1.toque;
  const pulso = fp1 >= 0 && fp1 < 10 ? 1 + 0.15 * Math.sin((fp1 / 10) * Math.PI) : 1;
  const brilho = fp1 >= 0 && fp1 < 10 ? 0.9 * Math.sin((fp1 / 10) * Math.PI) : 0;
  const giro = easeInOutCubic(clamp01((frame - L1.sol) / 18)) * Math.PI * 2;
  const mostraM = frame - L1.sol >= 9;
  const piscaAuto = frame >= L1.prob && frame < L1.sol && Math.floor((frame - L1.prob) / 5) % 2 === 0;

  // s02: lente do kit pisca no inicio; em "cinquenta" sai em arco e a 50mm rosqueia
  const piscaKit = frame >= L2.ini && frame < L2.prob && Math.floor((frame - L2.ini) / 6) % 2 === 0;
  const tSaida = clamp01((frame - L2.sol) / 14); // kit sai
  const tEntra = clamp01((frame - L2.sol - 4) / 10); // 50mm chega
  const tRosca = clamp01((frame - L2.sol - 14) / 9); // 50mm gira 90 graus
  const kitVisivel = tSaida < 1;
  const lente50Visivel = frame - L2.sol >= 4;

  // s03: porta do slot abre 100 graus e os cartoes entram deslizando
  const tPorta = easeInOutCubic(clamp01((frame - L3.toque) / 5));
  const tCartoes = easeInOutCubic(clamp01((frame - L3.toque - 3) / 8));
  const cartaoEsq = frame >= L3.prob ? "#FF4D4D" : "#3B82F6";
  const cartaoDir = frame >= L3.sol ? "#3DDC84" : "#3B82F6";

  // s04: flash cai na sapata com spring, painel estoura
  const fq4 = frame - L4.quedaIni;
  const flashVisivel = fq4 >= 0;
  const dyFlash = Math.max(0, 1 - springQueda(fq4)) * 2.2;
  const fe = frame - L4.sol;
  const estouro = fe >= 0 && fe < 4;
  const painel = estouro ? 3 : fe >= 4 ? 0.6 : 0.25;
  void TOQUE_REL;
  void easeOutBack;
  void PointLight;

  return (
    <group scale={pulso}>
      {/* corpo */}
      <B s={[0.75, 0.55, 0.42]} c={PRETO} r={0.09} e={DOURADO} ei={brilho} />
      {/* empunhadura do lado direito (do fotografo) */}
      <B p={[-0.36, -0.02, 0.1]} s={[0.16, 0.5, 0.2]} c="#26262B" r={0.06} />
      {/* visor */}
      <B p={[0.0, 0.34, -0.08]} s={[0.22, 0.14, 0.2]} c={PRETO} r={0.04} />
      <B p={[0.0, 0.34, -0.17]} s={[0.12, 0.08, 0.02]} c="#3B82F6" r={0.01} sombra={false} />
      {/* botao disparador */}
      <Cil p={[-0.3, 0.3, 0.08]} r={0.05} h={0.06} c="#FF4D4D" seg={12} />
      {/* seletor de modo */}
      <group position={[0.24, 0.3, 0.0]} rotation={[0, giro, 0]}>
        <Cil r={0.13} h={0.07} c={piscaAuto ? "#FF4D4D" : "#2E2E34"} e={piscaAuto ? "#FF4D4D" : "#000000"} ei={piscaAuto ? 0.9 : 0} seg={16} />
        <PlanoTex p={[0, 0.04, 0]} w={0.22} h={0.11} tex={mostraM ? modoM : auto} rot={[-Math.PI / 2, 0, 0]} />
      </group>

      {/* lente do kit (cinza) */}
      {kitVisivel && (
        <group position={[0, 0.0, 0.35 + 0.0]} {...(tSaida > 0 ? {} : {})}>
          <group position={[-1.3 * tSaida, Math.sin(tSaida * Math.PI) * 0.7, 0.7 * tSaida]} rotation={[0, 0, tSaida * 1.5]}>
            <Cil r={0.18} h={0.28} c="#8A8F98" e={piscaKit ? "#FFD25A" : "#000000"} ei={piscaKit ? 0.8 : 0} rot={[Math.PI / 2, 0, 0]} seg={20} />
            <Cil p={[0, 0, 0.15]} r={0.12} h={0.03} c="#10131C" rot={[Math.PI / 2, 0, 0]} seg={20} />
          </group>
        </group>
      )}

      {/* lente 50mm: chega pela frente e rosqueia */}
      {lente50Visivel && (
        <group position={[0, 0.0, 0.36 + (1 - easeInOutCubic(tEntra)) * 0.6]} rotation={[0, 0, (1 - tRosca) * (Math.PI / 2)]}>
          <Cil r={0.21} h={0.3} c="#17181D" rot={[Math.PI / 2, 0, 0]} seg={22} />
          <Cil p={[0, 0, -0.1]} r={0.225} h={0.04} c={DOURADO} rot={[Math.PI / 2, 0, 0]} seg={22} />
          <Cil p={[0, 0, 0.1]} r={0.225} h={0.04} c={DOURADO} rot={[Math.PI / 2, 0, 0]} seg={22} />
          <Cil p={[0, 0, 0.16]} r={0.15} h={0.03} c="#0B1B3A" e="#3B82F6" ei={0.3} rot={[Math.PI / 2, 0, 0]} seg={22} />
          <PlanoTex p={[0, 0.222, 0]} w={0.3} h={0.09} tex={lente50} rot={[-Math.PI / 2, 0, 0]} />
        </group>
      )}

      {/* slot de cartoes no lado virado para o espectador (-X local) */}
      <B p={[-0.372, 0.0, -0.04]} s={[0.02, 0.3, 0.22]} c="#0E0E10" r={0.005} sombra={false} />
      <group position={[-0.375, 0.0, -0.15]} rotation={[0, -tPorta * (100 * Math.PI) / 180, 0]}>
        <B p={[0, 0, 0.11]} s={[0.025, 0.32, 0.24]} c="#2E2E34" r={0.01} />
      </group>
      {tCartoes > 0 && (
        <>
          {[
            { z: -0.12, cor: cartaoEsq, erro: frame >= L3.prob },
            { z: 0.12, cor: cartaoDir, erro: false },
          ].map((c, i) => (
            <group key={i} position={[-0.375 - 0.16 + (1 - tCartoes) * 0.5, 0.0, c.z]}>
              <B s={[0.32, 0.04, 0.22]} c={c.cor} r={0.015} />
              <PlanoTex p={[-0.02, 0.025, 0]} w={0.2} h={0.1} tex={sd} rot={[-Math.PI / 2, 0, -Math.PI / 2]} />
              {c.erro && (
                <>
                  <B p={[0, 0.03, 0]} s={[0.3, 0.02, 0.05]} c="#FFFFFF" rot={[0, Math.PI / 4, 0]} r={0.005} sombra={false} />
                  <B p={[0, 0.03, 0]} s={[0.3, 0.02, 0.05]} c="#FFFFFF" rot={[0, -Math.PI / 4, 0]} r={0.005} sombra={false} />
                </>
              )}
            </group>
          ))}
        </>
      )}

      {/* flash na sapata (em cima do corpo) */}
      {flashVisivel && (
        <group position={[0, 0.275 + 0.03 + dyFlash, -0.02]}>
          <B s={[0.14, 0.05, 0.12]} c="#2E2E34" r={0.015} />
          <B p={[0, 0.2, 0]} s={[0.26, 0.3, 0.2]} c={PRETO} r={0.05} />
          <group position={[0, 0.42, 0.04]} rotation={[0.28, 0, 0]}>
            <B s={[0.32, 0.2, 0.26]} c="#F7F5F0" r={0.05} />
            <B p={[0, 0, 0.14]} s={[0.26, 0.15, 0.03]} c="#FFF3C4" e="#FFF3C4" ei={painel} o={0.95} r={0.01} sombra={false} />
          </group>
          {estouro && <pointLight position={[0, 0.5, 0.6]} intensity={40} distance={8} color="#FFFFFF" />}
        </group>
      )}
    </group>
  );
};
