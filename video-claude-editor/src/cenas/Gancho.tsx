import React from 'react';
import {AbsoluteFill, Sequence, useCurrentFrame} from 'remotion';
import {cores, vivas} from '../tema';
import {caminho, mola, rampa, aleatorio, V3} from '../anim';
import {Tela3D} from '../tres/Tela3D';
import {Camera} from '../tres/Camera';
import {Bloco, Clipe3D, Luzes, ChaoSombra} from '../tres/pecas';
import {Icone3D} from '../tres/Icone3D';
import {Mascote3D} from '../tres/Mascote3D';
import {DaVinci3D, Premiere3D} from '../tres/Apps3D';
import {Estilhacos} from '../tres/Estilhacos';
import {EsperaFonte, Rotulo3D, Texto3D, usarTextura} from '../tres/Rotulo';
import {Halo} from '../tres/Halo';
import {FundoVideo, Letreiro} from './comum';

// Cena 1 do roteiro: o gancho. Duração de cada trecho em quadros (30 por segundo).
// Os tempos são estimados pelo texto e serão ajustados quando a narração chegar.
export const TRECHOS = {
  linhaDoTempo: 210, // "Este vídeo foi editado inteiro por mim... cada movimento de câmera."
  semPrograma: 75, // "Ninguém abriu um programa de edição."
  humano: 135, // "As únicas coisas humanas aqui são a voz e o botão de aprovar."
  cincoPassos: 135, // "Em cinco passos, eu te mostro como fazer o mesmo com os seus vídeos:"
  tresUsos: 135, // "cortes curtos, vídeos longos e até um canal dark inteiro."
  ferramentas: 135, // "Com o nome de cada ferramenta e o pedido exato que você escreve."
  passoUm: 75, // "Passo um."
};
export const DURACAO_GANCHO = Object.values(TRECHOS).reduce((a, b) => a + b, 0);

const LUZ = {corA: '#2dd4bf', corB: '#22d3ee', forcaA: 260, forcaB: 220};

// ---------- Trecho 1: a linha do tempo ----------
const CLIPES: {x: number; l: number; cor: string}[] = [
  {x: -6.3, l: 2.6, cor: vivas.azul},
  {x: -3.4, l: 2.8, cor: vivas.verde},
  {x: -0.7, l: 2.2, cor: vivas.azul},
  {x: 1.7, l: 2.0, cor: vivas.vermelho},
  {x: 4.6, l: 3.4, cor: vivas.verde},
  {x: 8.2, l: 3.2, cor: vivas.azul},
];

const LinhaDoTempo: React.FC = () => {
  const f = useCurrentFrame();
  // câmera: chega, aproxima no corte, afasta, e dá a volta
  const giro = rampa(f, 175, 210) * 1.05;
  const base = caminho(f, [0, 28, 105, 128, 150, 175], [
    [0, 5.5, 19],
    [-1.6, 2.8, 11],
    [-0.6, 2.6, 10],
    [2.2, 2.3, 7.4],
    [0.5, 3.2, 12],
    [0, 3.4, 12],
  ]);
  const raio = Math.hypot(base[0], base[2]);
  const ang0 = Math.atan2(base[0], base[2]);
  const pos: V3 = [Math.sin(ang0 + giro) * raio, base[1] + giro * 1.6, Math.cos(ang0 + giro) * raio];
  const alvo = caminho(f, [0, 28, 105, 128, 150], [
    [0, 1, 0],
    [-1, 1.3, 0],
    [0, 1.2, 0],
    [1.8, 0.7, 0],
    [0.5, 1, 0],
  ]);

  // bloco do Claude cai e quica
  const queda = mola(f, 6, {damping: 9, mass: 0.9, stiffness: 140});
  const yIcone = 12 - queda * (12 - 2.05);
  const impacto = Math.max(0, 1 - Math.abs(f - 21) / 9);

  // mascote entra pulando pela direita e anda até o clipe vermelho
  const entra = rampa(f, 55, 95);
  const anda = rampa(f, 104, 124);
  const xMasc = 11 - entra * (11 - 5.2) - anda * (5.2 - 2.9);
  const pulando = f >= 55 && f < 95 ? Math.abs(Math.sin(((f - 55) / 40) * Math.PI * 3)) * 0.9 : 0;
  const pisao = f >= 122 && f < 134 ? Math.sin(((f - 122) / 12) * Math.PI) * 1.4 : 0;

  // corte: o clipe vermelho cai, os da direita fecham o buraco
  const cai = rampa(f, 131, 152, (n) => n * n);
  const fecha = mola(f, 144, {damping: 13});
  // onda da "animação"
  const onda = (i: number) => (f >= 140 && f < 180 ? Math.sin((f - 140) / 4.5 - i * 0.9) * 0.55 * (1 - rampa(f, 165, 180)) * rampa(f, 140, 146) : 0);

  return (
    <AbsoluteFill>
      <Tela3D>
        <Camera pos={pos} alvo={alvo} fov={36} />
        <Luzes {...LUZ} />
        <ChaoSombra y={-0.55} opacidade={0.5} />
        <Bloco tam={[60, 0.5, 2.3]} cor="#20282b" posicao={[0, -0.25, 0]} raio={0.12} rugosidade={0.7} />
        {CLIPES.map((c, i) => {
          const vermelho = i === 3;
          const depois = i > 3;
          const y = 0.3 + (vermelho ? 0 : impacto * 0.35 * Math.max(0, 1 - Math.abs(c.x + 3.4) / 6) + Math.max(0, onda(i)));
          if (vermelho) {
            return <Clipe3D key={i} larg={c.l} cor={c.cor} posicao={[c.x + cai * 0.6, 0.3 - cai * 7, cai * 2.5]} rotacao={[cai * 1.6, cai * 0.5, -cai * 1.1]} semente={i} />;
          }
          return <Clipe3D key={i} larg={c.l} cor={c.cor} posicao={[c.x - (depois ? fecha * 2.25 : 0), y, 0]} semente={i} />;
        })}
        {/* agulha acompanha o mascote */}
        <Bloco tam={[0.08, 2.4, 0.08]} cor="#ffffff" posicao={[xMasc - 1.35, 0.9, 1.2]} raio={0.03} emissivo="#ffffff" intensidade={2.5} sombra={false} />
        <Icone3D posicao={[-3.4, yIcone, 0.1]} rotacao={[0, 0.25 + Math.sin(f / 30) * 0.12, (1 - queda) * 0.8]} escala={1.15} brilho={0.3 + impacto * 0.5} halo={5} />
        {f >= 50 ? <Mascote3D posicao={[xMasc, 0.6 + pulando + pisao, 0]} rotacao={[0, -0.5, 0]} escala={0.95} passo={f * 0.7} /> : null}
      </Tela3D>
      <Letreiro texto="EDITADO INTEIRO *PELO *CLAUDE" de={30} ate={103} />
      <Letreiro texto="CADA *CORTE" de={106} ate={139} />
      <Letreiro texto="CADA *ANIMAÇÃO" de={141} ate={174} />
      <Letreiro texto="CADA MOVIMENTO DE *CÂMERA" de={176} ate={210} tam={88} />
    </AbsoluteFill>
  );
};

// ---------- Trecho 2: nenhum programa de edição ----------
const SemPrograma: React.FC = () => {
  const f = useCurrentFrame();
  const pisca = f > 18 && f < 32 ? (aleatorio(f) > 0.5 ? 1 : 0.2) : f >= 32 ? 0.15 : 1;
  const t = Math.max(0, f - 34);
  const queda = Math.min(3.6, 0.011 * t * t);
  const entra = mola(f, 2, {damping: 10});
  const sobe = mola(f, 40, {damping: 11, mass: 1});
  return (
    <AbsoluteFill>
      <Tela3D>
        <Camera pos={[Math.sin(f / 60) * 0.8, 1.6, 12.5 - rampa(f, 0, 75) * 1.2]} alvo={[0, 1.4, 0]} fov={36} />
        <Luzes {...LUZ} />
        <ChaoSombra y={-2.2} opacidade={0.45} />
        <Premiere3D rachado={f >= 30} vida={pisca} posicao={[-2.7, 2.3 - queda, 1]} rotacao={[-queda * 0.2, 0.35, queda * 0.22]} escala={1.15 * entra} />
        <DaVinci3D rachado={f >= 30} vida={pisca} posicao={[2.7, 2.3 - queda * 0.9, 1]} rotacao={[-queda * 0.24, -0.35, -queda * 0.2]} escala={1.15 * entra} />
        {f >= 32 ? <Estilhacos centro={[0, 2.2 - queda * 0.5, 1]} quantos={28} raioMin={1 + rampa(f, 32, 60) * 2.2} raioMax={2 + rampa(f, 32, 60) * 4} semente={2} /> : null}
        <Icone3D posicao={[0, -6 + sobe * 8.6, -0.5]} rotacao={[0, Math.sin(f / 25) * 0.25, 0]} escala={1.5} brilho={0.5} halo={6} />
      </Tela3D>
      <Letreiro texto="NENHUM PROGRAMA DE EDIÇÃO *ABERTO" de={8} ate={75} tam={84} />
    </AbsoluteFill>
  );
};

// ---------- Trecho 3: a voz e o botão de aprovar ----------
const Microfone: React.FC<{posicao: V3; escala: number; f: number}> = ({posicao, escala, f}) => (
  <group position={posicao} scale={escala}>
    <mesh position={[0, 1.55, 0]} castShadow>
      <capsuleGeometry args={[0.55, 0.75, 16, 32]} />
      <meshStandardMaterial color="#d9dee3" roughness={0.3} metalness={0.7} />
    </mesh>
    {[1.2, 1.55, 1.9].map((y) => (
      <mesh key={y} position={[0, y, 0]} rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[0.555, 0.03, 8, 40]} />
        <meshStandardMaterial color="#3b4046" roughness={0.5} />
      </mesh>
    ))}
    <mesh position={[0, 0.45, 0]} castShadow>
      <cylinderGeometry args={[0.2, 0.26, 0.95, 24]} />
      <meshStandardMaterial color="#2a2e33" roughness={0.45} />
    </mesh>
    <mesh position={[0, -0.25, 0]} castShadow>
      <cylinderGeometry args={[0.07, 0.07, 0.6, 12]} />
      <meshStandardMaterial color="#8a9096" roughness={0.3} metalness={0.6} />
    </mesh>
    <mesh position={[0, -0.6, 0]} castShadow>
      <cylinderGeometry args={[0.75, 0.82, 0.14, 32]} />
      <meshStandardMaterial color="#2a2e33" roughness={0.45} />
    </mesh>
    {/* onda da voz */}
    {Array.from({length: 13}).map((_, i) => {
      const lado = i < 6 ? -1 : 1;
      const k = i < 6 ? 6 - i : i - 5;
      if (i === 6) return null;
      const h = 0.25 + Math.abs(Math.sin(f / 3.2 + k * 1.3) * Math.cos(f / 7 + k)) * (1.9 - k * 0.2);
      return <Bloco key={i} tam={[0.16, h, 0.16]} cor={cores.laranja} posicao={[lado * (0.85 + k * 0.3), 1.55, 0]} raio={0.07} emissivo="#f2622e" intensidade={0.6} sombra={false} />;
    })}
  </group>
);

const Seta: React.FC<{posicao: V3; escala: number}> = ({posicao, escala}) => (
  <group position={posicao} scale={escala} rotation={[0, 0, 0.5]}>
    <mesh castShadow rotation={[0, 0, Math.PI]}>
      <coneGeometry args={[0.38, 0.8, 3]} />
      <meshStandardMaterial color="#ffffff" roughness={0.3} />
    </mesh>
    <Bloco tam={[0.2, 0.6, 0.2]} cor="#ffffff" posicao={[0, 0.6, 0]} raio={0.05} />
  </group>
);

const Humano: React.FC = () => {
  const f = useCurrentFrame();
  const mic = mola(f, 4, {damping: 10});
  const botao = mola(f, 58, {damping: 10});
  const aperta = f >= 96 && f < 108 ? Math.sin(((f - 96) / 12) * Math.PI) : 0;
  const clique = rampa(f, 96, 100) * (1 - rampa(f, 108, 128));
  const seta = caminho(f, [70, 94, 108, 135], [
    [8, -3, 2.5],
    [4.6, 0.6, 2.2],
    [4.6, 0.6, 2.2],
    [5.4, 0.1, 2.4],
  ]);
  return (
    <AbsoluteFill>
      <Tela3D>
        <Camera pos={caminho(f, [0, 60, 135], [[-2.5, 2, 11.5], [0, 2, 12.5], [1.2, 1.9, 11.6]])} alvo={caminho(f, [0, 60, 135], [[-3, 1.3, 0], [0, 1.2, 0], [0.8, 1.1, 0]])} fov={36} />
        <Luzes {...LUZ} />
        <ChaoSombra y={-0.8} opacidade={0.5} />
        <Microfone posicao={[-3.6, 0, 0]} escala={1.25 * mic} f={f} />
        <group position={[3.6, 1.1, 0]} rotation={[-0.15, -0.25, 0]} scale={Math.max(0.001, botao)}>
          <Bloco tam={[4.6, 2, 0.5]} cor="#1c2327" raio={0.3} posicao={[0, 0, -0.35]} />
          <Bloco tam={[4.1, 1.5, 0.6]} cor="#22c55e" raio={0.28} posicao={[0, 0, 0.1 - aperta * 0.28]} emissivo="#16a34a" intensidade={0.35 + clique * 1.6} rugosidade={0.3} />
          <Rotulo3D texto="APROVAR" larg={3.5} posicao={[0, 0, 0.42 - aperta * 0.28]} />
          <Halo cor="#22c55e" tam={9} z={-0.7} forca={clique * 0.9} />
        </group>
        {f >= 70 ? <Seta posicao={seta} escala={1.1} /> : null}
      </Tela3D>
      <Letreiro texto="HUMANO AQUI: SÓ *A *VOZ" de={12} ate={62} tam={92} />
      <Letreiro texto="E O BOTÃO DE *APROVAR" de={64} ate={135} tam={92} />
    </AbsoluteFill>
  );
};

// ---------- Trecho 4: os cinco passos ----------
const PASSOS = ['PREPARAR', 'ENTENDER', 'CORTAR', 'ANIMAR', 'FINALIZAR'];

const CincoPassos: React.FC = () => {
  const f = useCurrentFrame();
  const xs = PASSOS.map((_, i) => (i - 2) * 3.1);
  const tempo = (i: number) => 10 + i * 17;
  // mascote pula de bloco em bloco
  const prog = Math.max(0, Math.min(4, (f - tempo(0)) / 17));
  const iA = Math.floor(prog);
  const fr = prog - iA;
  const xM = f < tempo(0) ? xs[0] : xs[iA] + (xs[Math.min(4, iA + 1)] - xs[iA]) * fr;
  const yM = 2.05 + (prog < 4 ? Math.sin(fr * Math.PI) * 1.5 : 0);
  return (
    <AbsoluteFill>
      <Tela3D>
        <Camera pos={caminho(f, [0, 80, 110, 135], [[-6.5, 3, 10], [4, 3, 10.5], [0, 3.4, 17], [0, 3.2, 16.4]])} alvo={caminho(f, [0, 80, 110], [[-5.5, 1.2, 0], [4.5, 1.2, 0], [0, 0.9, 0]])} fov={36} />
        <Luzes {...LUZ} />
        <ChaoSombra y={0} opacidade={0.5} />
        {PASSOS.map((nome, i) => {
          const m = mola(f, tempo(i) - 6, {damping: 9});
          const aceso = rampa(f, tempo(i), tempo(i) + 5);
          return (
            <group key={nome} position={[xs[i], 0, 0]}>
              <group scale={[1, Math.max(0.001, 0.25 + m * 0.75), 1]} position={[0, (0.25 + m * 0.75) * 1, 0]}>
                <Bloco tam={[2.3, 2, 2]} cor={aceso > 0.5 ? '#ea7648' : '#232c30'} raio={0.22} emissivo="#d2470f" intensidade={aceso * 0.5} rugosidade={0.4} />
              </group>
              {m > 0.5 ? <Texto3D texto={String(i + 1)} tam={1.15} posicao={[0, 1, 1.0]} emissao={0.2 + aceso * 0.5} /> : null}
              <Rotulo3D texto={nome} larg={2.6} posicao={[0, 0.03, 1.9]} rotacao={[-Math.PI / 2, 0, 0]} opacidade={aceso} />
            </group>
          );
        })}
        <Mascote3D posicao={[xM, yM, 0]} rotacao={[0, 0.2, 0]} escala={0.72} passo={f * 0.8} />
      </Tela3D>
      <Letreiro texto="*5 *PASSOS PARA OS SEUS VÍDEOS" de={20} ate={135} tam={86} topo={70} />
    </AbsoluteFill>
  );
};

// ---------- Trecho 5: os três usos ----------
const TresUsos: React.FC = () => {
  const f = useCurrentFrame();
  const semRosto = usarTextura(
    'sem-rosto',
    (g, w, h) => {
      g.clearRect(0, 0, w, h);
      g.fillStyle = '#39424a';
      g.beginPath();
      g.arc(w / 2, h * 0.36, h * 0.2, 0, Math.PI * 2);
      g.fill();
      g.beginPath();
      g.ellipse(w / 2, h * 0.98, h * 0.36, h * 0.36, 0, Math.PI, 0);
      g.fill();
      g.fillStyle = '#f2622e';
      g.font = `900 ${h * 0.3}px Montserrat`;
      g.textAlign = 'center';
      g.textBaseline = 'middle';
      g.fillText('?', w / 2, h * 0.38);
    },
    512,
    512
  );
  const item = (i: number) => {
    const m = mola(f, 6 + i * 40, {damping: 10});
    return {escala: Math.max(0.001, m), giro: (1 - m) * 2.2 + Math.sin(f / 26 + i) * 0.14, op: rampa(f, 14 + i * 40, 24 + i * 40)};
  };
  const a = item(0);
  const b = item(1);
  const c = item(2);
  return (
    <AbsoluteFill>
      <Tela3D>
        <Camera pos={caminho(f, [0, 135], [[-1.4, 1.7, 12.4], [1.4, 1.9, 11.6]])} alvo={[0, 1.25, 0]} fov={36} />
        <Luzes {...LUZ} />
        <ChaoSombra y={-1.3} opacidade={0.5} />
        {/* cortes: celular na vertical */}
        <group position={[-4.1, 1.9, 0]} rotation={[0, 0.3 + a.giro, -0.06]} scale={a.escala}>
          <Bloco tam={[1.9, 3.6, 0.22]} cor="#14191c" raio={0.2} />
          <Bloco tam={[1.66, 3.3, 0.04]} cor="#0e7490" raio={0.12} posicao={[0, 0, 0.12]} emissivo="#0e7490" intensidade={0.5} sombra={false} />
          <Bloco tam={[1.2, 0.2, 0.05]} cor="#ffffff" raio={0.06} posicao={[0, -0.75, 0.16]} sombra={false} />
          <Bloco tam={[0.8, 0.2, 0.05]} cor="#f2622e" raio={0.06} posicao={[0, -1.05, 0.16]} emissivo="#f2622e" intensidade={0.6} sombra={false} />
          <mesh position={[0, 0.45, 0.17]} rotation={[0, 0, -Math.PI / 2]}>
            <coneGeometry args={[0.32, 0.5, 3]} />
            <meshBasicMaterial color="#ffffff" />
          </mesh>
        </group>
        <Rotulo3D texto="CORTES" larg={3.2} posicao={[-4.1, -0.75, 0.6]} opacidade={a.op} />
        {/* vídeo longo: tela larga com linha do tempo */}
        <group position={[0, 1.9, 0]} rotation={[0, b.giro, 0]} scale={b.escala * 0.82}>
          <Bloco tam={[4.6, 2.7, 0.22]} cor="#14191c" raio={0.16} />
          <Bloco tam={[4.3, 2.4, 0.04]} cor="#0b1114" raio={0.1} posicao={[0, 0, 0.12]} sombra={false} />
          <Bloco tam={[4.0, 1.2, 0.04]} cor="#134e4a" raio={0.08} posicao={[0, 0.45, 0.15]} emissivo="#0e7490" intensidade={0.45} sombra={false} />
          {[vivas.azul, vivas.verde, '#f472b6', vivas.azul, vivas.verde].map((cor, i) => (
            <Bloco key={i} tam={[0.72, 0.3, 0.06]} cor={cor} raio={0.05} posicao={[-1.62 + i * 0.81, -0.55, 0.17]} emissivo={cor} intensidade={0.35} sombra={false} />
          ))}
          <Bloco tam={[3.9, 0.22, 0.06]} cor="#34d399" raio={0.05} posicao={[0, -0.92, 0.17]} emissivo="#34d399" intensidade={0.3} sombra={false} />
        </group>
        <Rotulo3D texto="VÍDEO LONGO" larg={4.2} posicao={[0, -0.75, 0.6]} opacidade={b.op} />
        {/* canal dark: cartão escuro com uma pessoa sem rosto */}
        <group position={[4.1, 1.9, 0]} rotation={[0, -0.3 + c.giro, 0.06]} scale={c.escala * 0.95}>
          <Bloco tam={[3, 3, 0.3]} cor="#0d1113" raio={0.34} />
          <mesh position={[0, 0, 0.16]}>
            <planeGeometry args={[2.6, 2.6]} />
            <meshBasicMaterial map={semRosto} transparent toneMapped={false} />
          </mesh>
          <Halo cor="#a855f7" tam={7} z={-0.5} forca={0.5 * c.op} />
        </group>
        <Rotulo3D texto="CANAL DARK" larg={3.8} posicao={[4.1, -0.75, 0.6]} opacidade={c.op} />
      </Tela3D>
    </AbsoluteFill>
  );
};

// ---------- Trecho 6: as ferramentas e o pedido ----------
const FERRAMENTAS: [string, string][] = [
  ['Whisper', '#10a37f'],
  ['auto-editor', '#3b82f6'],
  ['FFmpeg', '#22a34a'],
  ['Remotion', '#2563eb'],
  ['yt-dlp', '#dc2626'],
];
const PEDIDO = 'transcreva este vídeo palavra por palavra';

const Ferramentas: React.FC = () => {
  const f = useCurrentFrame();
  const barra = mola(f, 68, {damping: 13});
  const letras = Math.max(0, Math.min(PEDIDO.length, Math.floor((f - 80) * 1.15)));
  return (
    <AbsoluteFill>
      <Tela3D>
        <Camera pos={caminho(f, [0, 65, 135], [[-2, 3.2, 15.5], [0, 2.4, 14.8], [0.8, 2.9, 15.8]])} alvo={caminho(f, [0, 65, 135], [[0, 1, 0], [0, 0.8, 0], [0, -0.3, 0]])} fov={36} />
        <Luzes {...LUZ} />
        <ChaoSombra y={0} opacidade={0.5} />
        {FERRAMENTAS.map(([nome, cor], i) => {
          const m = mola(f, 5 + i * 9, {damping: 8, mass: 0.9});
          const x = (i - 2) * 3.25;
          return (
            <group key={nome} position={[x, 13 - m * (13 - 0.8), 0]} rotation={[0, Math.sin(f / 22 + i) * 0.14, (1 - m) * (i % 2 ? 0.7 : -0.7)]}>
              <Bloco tam={[2.9, 1.6, 1.3]} cor={cor} raio={0.22} rugosidade={0.38} emissivo={cor} intensidade={0.18} />
              <Rotulo3D texto={nome} larg={2.6} posicao={[0, 0, 0.67]} />
            </group>
          );
        })}
      </Tela3D>
      <Letreiro texto="O NOME DE CADA *FERRAMENTA" de={12} ate={66} tam={86} topo={70} />
      <Letreiro texto="E O *PEDIDO *EXATO" de={70} ate={135} tam={86} topo={70} />
      <div
        style={{
          position: 'absolute',
          left: 260,
          right: 260,
          bottom: 86 - (1 - barra) * 260,
          height: 128,
          borderRadius: 36,
          background: 'rgba(15,22,25,0.94)',
          border: '3px solid rgba(94,234,212,0.55)',
          boxShadow: '0 0 60px rgba(45,212,191,0.45), 0 24px 50px rgba(0,0,0,0.7)',
          display: 'flex',
          alignItems: 'center',
          padding: '0 28px 0 44px',
          fontFamily: 'Poppins, sans-serif',
          fontWeight: 500,
          fontSize: 50,
          color: '#fff',
        }}
      >
        <span style={{flex: 1, whiteSpace: 'nowrap'}}>
          {PEDIDO.slice(0, letras)}
          <span style={{opacity: Math.floor(f / 8) % 2 ? 1 : 0, color: '#f2622e'}}>|</span>
        </span>
        <div style={{width: 84, height: 84, borderRadius: 26, background: 'linear-gradient(180deg, #ff9a5c, #f2622e)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 50, fontWeight: 800}}>↑</div>
      </div>
    </AbsoluteFill>
  );
};

// ---------- Trecho 7: passo um ----------
const PassoUm: React.FC = () => {
  const f = useCurrentFrame();
  const chega = mola(f, 2, {damping: 11, mass: 1.1});
  const clarao = rampa(f, 64, 75);
  return (
    <AbsoluteFill>
      <Tela3D>
        <Camera pos={[0, 1.6, 12 - rampa(f, 20, 75) * 2.4]} alvo={[0, 1.5, 0]} fov={36} />
        <Luzes {...LUZ} />
        <group position={[0, 1.5, -30 + chega * 30]} rotation={[0, (1 - chega) * 5 + Math.sin(f / 20) * 0.18, 0]}>
          <Halo cor="#ff7a3d" tam={12} z={-0.6} forca={0.8} />
          <Bloco tam={[3.6, 3.6, 1.1]} cor="#ea7648" raio={0.5} emissivo="#d2470f" intensidade={0.4} rugosidade={0.38} />
          <Texto3D texto="1" tam={2.3} posicao={[0, 0, 0.56]} emissao={0.6} prof={0.2} />
        </group>
        <Estilhacos centro={[0, 1.5, -2]} quantos={26} raioMin={3.4 + f * 0.03} raioMax={7 + f * 0.04} semente={8} />
      </Tela3D>
      <Letreiro texto="PASSO UM: *PREPARAR" de={16} ate={75} tam={100} />
      <AbsoluteFill style={{background: '#f2622e', opacity: clarao}} />
    </AbsoluteFill>
  );
};

// ---------- Cena completa ----------
export const Gancho: React.FC = () => {
  const ordem: [keyof typeof TRECHOS, React.FC][] = [
    ['linhaDoTempo', LinhaDoTempo],
    ['semPrograma', SemPrograma],
    ['humano', Humano],
    ['cincoPassos', CincoPassos],
    ['tresUsos', TresUsos],
    ['ferramentas', Ferramentas],
    ['passoUm', PassoUm],
  ];
  let inicio = 0;
  return (
    <AbsoluteFill>
      <FundoVideo />
      <EsperaFonte>
      {ordem.map(([nome, Trecho]) => {
        const de = inicio;
        inicio += TRECHOS[nome];
        return (
          <Sequence key={nome} from={de} durationInFrames={TRECHOS[nome]} name={nome}>
            <Trecho />
          </Sequence>
        );
      })}
      </EsperaFonte>
    </AbsoluteFill>
  );
};
