import React, {useMemo} from 'react';
import {AbsoluteFill, Easing, Sequence, useCurrentFrame} from 'remotion';
import * as THREE from 'three';
import {cores, N} from '../tema';
import {aleatorio, chegadaRampa, expoOut, mola, power2Out, power4In, power4InOut, rampa, saidaRampa, somar, trilho, trilho1, V3} from '../anim';
import {Bloco} from '../tres/pecas';
import {Icone3D} from '../tres/Icone3D';
import {Mascote3D} from '../tres/Mascote3D';
import {DaVinci3D, Premiere3D} from '../tres/Apps3D';
import {Estilhacos} from '../tres/Estilhacos';
import {EsperaFonte, Rotulo3D, Texto3D} from '../tres/Rotulo';
import {Halo} from '../tres/Halo';
import {Destaque, Palco, TEMAS} from './mundo';
import {TelaPapel} from '../tres/Papel';
import {cenaHistoria, cenaLegenda, cenaLinha, cenaPrograma} from '../papel';

// Cena 1 do roteiro: o gancho, versão 2.
// Feita seguindo o MAPA-GANCHO.md: linha do tempo em pé, câmera que nunca para,
// troca de trecho com speed ramp e texto só nas palavras de destaque.
// Duração de cada trecho em quadros (30 por segundo), estimada pelo texto.
export const TRECHOS_3D = {
  linhaDoTempo: 225, // "Este vídeo foi editado inteiro por mim, o Claude. Cada corte, cada animação, cada movimento de câmera."
  semPrograma: 70, // "Ninguém abriu um programa de edição."
  humano: 125, // "A voz é do Cristian. Ele gravou e apertou o botão de aprovar: o resto fui eu."
  cincoPassos: 135, // "Em cinco passos, eu te mostro como fazer o mesmo com os seus vídeos:"
  doisUsos: 100, // "cortes curtos e vídeos longos."
  ferramentas: 135, // "Com o nome de cada ferramenta e o pedido exato que você escreve."
  passoUm: 75, // "Passo um."
};
export const DURACAO_GANCHO_3D = Object.values(TRECHOS_3D).reduce((a, b) => a + b, 0);

const lerp = (a: number, b: number, t: number) => a + (b - a) * t;
const lerp3 = (a: V3, b: V3, t: number): V3 => [lerp(a[0], b[0], t), lerp(a[1], b[1], t), lerp(a[2], b[2], t)];
const clarear = (cor: string, k: number) => new THREE.Color(cor).lerp(new THREE.Color('#ffffff'), k).getStyle();

// ====================== Trecho 1: a linha do tempo em pé ======================
type Clipe = {x: number; l: number; y: number; cor: string; audio?: boolean; pedaco?: 'E' | 'M' | 'D'; depois?: boolean};
const CLIPES: Clipe[] = [
  {x: -6.5, l: 3.0, y: 5.25, cor: N.clipe},
  {x: -1.9, l: 2.8, y: 5.25, cor: N.clipe},
  {x: 4.7, l: 4.4, y: 5.25, cor: N.clipe},
  {x: -6.3, l: 3.8, y: 4.25, cor: N.clipeClaro},
  {x: -2.5, l: 3.4, y: 4.25, cor: N.clipeClaro},
  // estes três começam colados, como um clipe só, e são separados por dois cortes
  {x: -0.05, l: 1.3, y: 4.25, cor: N.clipeClaro, pedaco: 'E'},
  {x: 1.3, l: 1.4, y: 4.25, cor: N.clipeClaro, pedaco: 'M'},
  {x: 3.15, l: 2.3, y: 4.25, cor: N.clipeClaro, pedaco: 'D'},
  {x: 6.2, l: 3.6, y: 4.25, cor: N.clipeClaro, depois: true},
  {x: -3.6, l: 9.4, y: 3.1, cor: '#15191c', audio: true},
  {x: 5.0, l: 6.6, y: 3.1, cor: '#15191c', audio: true},
  {x: 0, l: 16.4, y: 2.05, cor: '#15191c', audio: true},
];

const PecaClipe: React.FC<{c: Clipe; cor: string; i: number}> = ({c, cor, i}) => {
  const claro = useMemo(() => clarear(cor, 0.1), [cor]);
  const escuro = N.linha;
  const n = c.audio ? Math.floor((c.l - 0.3) / 0.24) : Math.max(1, Math.floor(c.l / 1.15));
  return (
    <>
      <Bloco tam={[c.l, 0.82, 0.3]} cor={cor} raio={c.pedaco ? 0.025 : 0.1} rugosidade={0.42} />
      {c.audio
        ? Array.from({length: n}).map((_, k) => {
            const h = 0.1 + Math.abs(Math.sin(k * 1.7 + i * 2.3) * Math.cos(k * 0.45 + i)) * 0.56;
            return <Bloco key={k} tam={[0.12, h, 0.05]} cor={escuro} raio={0.02} sombra={false} posicao={[-c.l / 2 + 0.26 + k * 0.24, 0, 0.16]} />;
          })
        : Array.from({length: n}).map((_, k) => <Bloco key={k} tam={[0.82, 0.5, 0.05]} cor={claro} raio={0.05} sombra={false} posicao={[-c.l / 2 + 0.6 + k * 1.1, 0, 0.16]} />)}
    </>
  );
};

const MONITOR_Y = 10.0;

// A cena da linha do tempo é contínua, mas aparece em duas partes:
// a abertura (quadros 0 a 105) e a edição (105 a 225), com o trecho do humano no meio.
const LinhaDoTempo: React.FC<{inicio?: number}> = ({inicio = 0}) => {
  const local = useCurrentFrame();
  const f = local + inicio;
  const sA = 0; // a cena voltou a ser uma parte só: não há saída no meio
  const cB = inicio > 0 ? chegadaRampa(local, 26) : 0;
  // câmera: um caminho só, sem parar em nenhum ponto
  const q = [0, 35, 70, 105, 116, 138, 151, 175, 187, 199, 209, 217, 225];
  const posBase = trilho(f, q, [
    [0.6, 4.3, 8],
    [0.2, 5.2, 14.5],
    [0, 6.4, 19.5],
    [0, 6.4, 20.3],
    [1.5, 4.5, 6.0],
    [1.3, 4.5, 5.7],
    [0, MONITOR_Y, 6.3],
    [0, MONITOR_Y, 5.7],
    [-15, 5, 7],
    [-15, 12, -8],
    [0, 15, -16],
    [12, 7, -11],
    [5, 3.6, -4],
  ]);
  const alvoBase = trilho(f, q, [
    [0.6, 4.3, 0],
    [0.2, 5.2, 0],
    [0, 6.4, 0],
    [0, 6.4, 0],
    [1.3, 4.25, 0],
    [1.2, 4.25, 0],
    [0, MONITOR_Y, 0],
    [0, MONITOR_Y, 0],
    [0, 6, 0],
    [0, 6, 0],
    [0, 6, 0],
    [0, 4, -1],
    [0, 3, -2],
  ]);
  const tremorCam = [115, 122].reduce((t, tc) => t + (f >= tc ? 1 - rampa(f, tc, tc + 9) : 0), 0);
  const pos = somar(somar(somar(posBase, [10, 0, 0], sA), [0, -8, 0], cB), [Math.sin(f * 2.9) * 0.07, Math.cos(f * 3.7) * 0.05, 0], tremorCam);
  const alvo = somar(somar(alvoBase, [10, 0, 0], sA), [0, -8, 0], cB);
  // na palavra "câmera": volta quase completa em torno da parede, com inclinação e troca de lente
  const rolo = trilho1(f, [175, 190, 203, 215, 225], [0, -0.3, 0.34, -0.2, 0]);
  const fov = trilho1(f, [175, 198, 225], [40, 58, 44]);

  // bloco do Claude: chega de trás da câmera, vira o herói, depois vira a cabeça da agulha
  const chega = rampa(f, 50, 76, expoOut);
  const vira = rampa(f, 92, 106, power4InOut);
  // a agulha faz dois cortes: um em cada ponta do trecho ruim
  const CORTES: [number, number][] = [
    [115, 0.6],
    [122, 2.0],
  ];
  const xAgulha = f < 140 ? trilho1(f, [106, 115, 119, 122], [-3.2, 0.6, 0.6, 2.0]) : 2.0 + (f - 140) * 0.05;
  const batida = CORTES.reduce((a, [tc]) => a + (f >= tc && f < tc + 6 ? Math.sin(((f - tc) / 6) * Math.PI) : 0), 0);
  const tremor = CORTES.reduce((a, [tc]) => a + (f >= tc ? 1 - rampa(f, tc, tc + 9) : 0), 0);
  const posHeroi = lerp3(lerp3([7, 9, 30], [0, 6.2, 8], chega), [xAgulha, 6.95 - batida * 0.45, 0.5], vira);
  const escHeroi = lerp(1.9, 0.36, vira);
  const linhaAgulha = rampa(f, 100, 110, power2Out);

  // corte: o trecho fica vermelho, a agulha bate, o pedaço voa para a câmera
  const sep1 = mola(f, 115, {damping: 10});
  const sep2 = mola(f, 122, {damping: 10});
  const marca = rampa(f, 122, 127);
  const levanta = rampa(f, 124, 131, power2Out);
  const voa = rampa(f, 131, 147, Easing.in(Easing.quad));
  const fecha = mola(f, 134, {damping: 11, stiffness: 150});
  const clarao = Math.min(1, tremor);

  // monitor de programa em cima da linha do tempo: mostra o que está sendo editado.
  // Na palavra "animação" a câmera entra nele e uma linha se desenha.
  const chegaMonitor = mola(f + 22, 8, {damping: 14, stiffness: 110});
  const naLinha = f >= 141 && f < 184;

  return (
    <AbsoluteFill>
      <Palco f={f} pos={pos} alvo={alvo} rolo={rolo} fov={fov} borrao={saidaRampa(f, 225, 9) * 16 + sA * 16 + cB * cB * 18}>
        {/* a parede */}
        <Bloco tam={[17.8, 5.3, 0.3]} cor={N.painel} posicao={[0, 3.65, -0.2]} raio={0.14} rugosidade={0.6} />
        <Bloco tam={[17.8, 0.36, 0.36]} cor="#14181b" posicao={[0, 6.48, -0.17]} raio={0.1} />
        {Array.from({length: 17}).map((_, k) => (
          <Bloco key={k} tam={[0.05, k % 4 === 0 ? 0.26 : 0.14, 0.05]} cor={N.linha} posicao={[-8 + k, 6.48, 0.03]} raio={0.01} sombra={false} />
        ))}
        {[-7.4, 7.4].map((x) => (
          <Bloco key={x} tam={[0.34, 1.1, 0.9]} cor={N.painel} posicao={[x, 0.55, -0.2]} raio={0.08} />
        ))}
        {['V2', 'V1', 'A1', 'A2'].map((nome, k) => (
          <Texto3D key={nome} texto={nome} tam={0.3} cor={N.linha} posicao={[-9.45, [5.25, 4.25, 3.1, 2.05][k], 0]} emissao={0.2} prof={0.05} />
        ))}
        {/* os clipes voam para o lugar */}
        {CLIPES.map((c, i) => {
          const m = mola(f + 22, 1 + i * 2.5, {damping: 14, stiffness: 110});
          const fora: V3 = [c.x * 0.7 + (aleatorio(i) - 0.5) * 8, (aleatorio(i + 20) - 0.5) * 7, 17 + aleatorio(i + 40) * 9];
          const chega: V3 = [fora[0] * (1 - m), fora[1] * (1 - m), fora[2] * (1 - m)];
          const giro: V3 = [(1 - m) * 1.1, (1 - m) * 0.8, 0];
          if (c.pedaco === 'M') {
            // o trecho ruim: fica vermelho, salta para fora da parede e voa na direção da câmera
            const cor = new THREE.Color(c.cor).lerp(new THREE.Color(N.erro), marca).getStyle();
            return (
              <group key={i} position={[c.x + chega[0] - voa * 2.2, c.y + chega[1] - voa * 1.2, chega[2] + levanta * 1.3 + voa * 13]} rotation={[giro[0] + levanta * 0.25 + voa * 2.6, giro[1] + voa * 1.7, voa * 3.4]}>
                <PecaClipe c={c} cor={cor} i={i} />
              </group>
            );
          }
          const dx = c.pedaco === 'E' ? -0.07 * sep1 * (1 - fecha) : c.pedaco === 'D' ? 0.07 * sep2 * (1 - fecha) - 1.4 * fecha : c.depois ? -1.4 * fecha : 0;
          return (
            <group key={i} position={[c.x + chega[0] + dx, c.y + chega[1], chega[2]]} rotation={giro}>
              <PecaClipe c={c} cor={c.cor} i={i} />
            </group>
          );
        })}
        {/* a lâmina de cada corte: um risco de luz e faíscas */}
        {CORTES.map(([tc, xc]) => {
          if (f < tc || f > tc + 12) return null;
          const t = (f - tc) / 12;
          const luz = 1 - rampa(f, tc, tc + 8);
          return (
            <group key={tc} position={[xc, 4.25, 0.5]}>
              <Halo cor="#ffffff" tam={1.8 + luz * 2.2} z={0.1} forca={luz * 0.55} />
              <Bloco tam={[0.05, 0.3 + luz * 2.2, 0.3]} cor="#ffffff" raio={0.02} emissivo="#ffffff" intensidade={3} sombra={false} />
              {Array.from({length: 10}).map((_, k) => {
                const a = (k / 10) * Math.PI * 2 + tc;
                const d = t * (1.2 + aleatorio(k + tc) * 1.6);
                return <Bloco key={k} tam={[0.07, 0.07, 0.07]} cor={N.acento} raio={0.02} posicao={[Math.cos(a) * d * 0.5, Math.sin(a) * d - t * t * 0.8, 0.2 + d * 0.5]} emissivo={N.acento} intensidade={2 * (1 - t)} sombra={false} />;
              })}
            </group>
          );
        })}
        {/* agulha e bloco do Claude */}
        {linhaAgulha > 0 ? <Bloco tam={[0.07, 5.5 * linhaAgulha, 0.07]} cor="#ffffff" posicao={[xAgulha, 6.9 - (5.5 * linhaAgulha) / 2 - batida * 0.45, 0.5]} raio={0.03} emissivo="#ffffff" intensidade={2.6} sombra={false} /> : null}
        {f >= 48 ? <Icone3D posicao={posHeroi} rotacao={[0, (1 - chega) * -6.5 + Math.sin(f / 22) * 0.16 * (1 - vira), (1 - chega) * 0.6]} escala={escHeroi} brilho={0.35 + clarao * 0.5} halo={6} /> : null}
        {/* o verso da parede, visto quando a câmera dá a volta */}
        {CLIPES.map((c, i) => (
          <Bloco key={`v${i}`} tam={[c.l, 0.82, 0.12]} cor={c.cor} raio={0.05} posicao={[c.x, c.y, -0.42]} sombra={false} />
        ))}
        <group position={[0, MONITOR_Y + (1 - chegaMonitor) * 9, 0]}>
          <Bloco tam={[0.6, 1.2, 0.3]} cor={N.painel} posicao={[0, -2.95, -0.2]} raio={0.08} />
          <Bloco tam={[8.95, 5.15, 0.3]} cor={N.painel} raio={0.14} rugosidade={0.5} />
          <TelaPapel desenhar={naLinha ? cenaLinha : cenaPrograma} f={naLinha ? f - 141 : f} larg={8.6} alt={4.8375} px={1920} posicao={[0, 0, 0.16]} />
        </group>
      </Palco>
      <Destaque texto="100% *CLAUDE" de={66} ate={96} quadro={f} />
      <Destaque texto="*CORTE" de={116} ate={138} tam={170} quadro={f} />
      <Destaque texto="*CÂMERA" de={182} ate={218} tam={170} quadro={f} />
    </AbsoluteFill>
  );
};

// ====================== Trecho 2: nenhum programa de edição ======================
const cair = (t: number, y0: number, chao: number): number => {
  let y = y0;
  let v = 0;
  for (let i = 0; i < t; i++) {
    v -= 0.04;
    y += v;
    if (y < chao) {
      y = chao;
      v = -v * 0.34;
      if (Math.abs(v) < 0.06) v = 0;
    }
  }
  return y;
};

const SemPrograma: React.FC = () => {
  const f = useCurrentFrame();
  const c = chegadaRampa(f, 28);
  const s = saidaRampa(f, 70, 11);
  const pos = somar(somar([0, 3.5, 10.6 - f * 0.014], [0, 6, 9], c), [10, 0, 0], s);
  const alvo = somar([0, 3.2 + c * 2, 0], [10, 0, 0], s);
  const estado = (morte: number) => {
    const vida = f < morte - 7 ? 1 : f < morte ? (aleatorio(f * 3 + morte) > 0.5 ? 1 : 0.25) : 0.12;
    const t = Math.max(0, f - morte - 2);
    const deita = Math.min(1, t / 20);
    return {vida, y: cair(t, 3.6, 0.42), deita, morto: f >= morte};
  };
  const a = estado(20);
  const b = estado(27);
  const entra = 1;
  return (
    <AbsoluteFill>
      <Palco f={f} pos={pos} alvo={alvo} tema={TEMAS.cemiterio} borrao={c * c * 18 + s * 16}>
        <Premiere3D rachado={a.morto} vida={a.vida} posicao={[-2.6, a.y + Math.sin(f / 14) * 0.08 * (1 - a.deita), 0]} rotacao={[-a.deita * 1.42, 0.3 - a.deita * 0.5, a.deita * 0.3]} escala={1.3 * entra} />
        <DaVinci3D rachado={b.morto} vida={b.vida} posicao={[2.6, b.y + Math.cos(f / 14) * 0.08 * (1 - b.deita), 0]} rotacao={[-b.deita * 1.42, -0.3 + b.deita * 0.45, -b.deita * 0.35]} escala={1.3 * entra} />
        {a.morto ? <Estilhacos centro={[-2.6, 3.4, 0.5]} quantos={16} raioMin={0.6 + rampa(f, 20, 48, power2Out) * 2} raioMax={1.4 + rampa(f, 20, 48, power2Out) * 3.4} semente={2} /> : null}
        {b.morto ? <Estilhacos centro={[2.6, 3.4, 0.5]} quantos={16} raioMin={0.6 + rampa(f, 27, 55, power2Out) * 2} raioMax={1.4 + rampa(f, 27, 55, power2Out) * 3.4} semente={4} /> : null}
      </Palco>
      <Destaque texto="*0 PROGRAMAS" de={28} ate={62} onde="topo" />
    </AbsoluteFill>
  );
};

// ====================== Trecho 3: a voz e o botão de aprovar ======================
const Microfone: React.FC<{posicao: V3; escala: number; f: number}> = ({posicao, escala, f}) => (
  <group position={posicao} scale={escala}>
    <mesh position={[0, 1.55, 0]} castShadow>
      <capsuleGeometry args={[0.55, 0.75, 16, 32]} />
      <meshStandardMaterial color="#d9dee3" roughness={0.28} metalness={0.8} />
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
    {/* a voz: uma onda que sai do microfone e viaja */}
    {Array.from({length: 17}).map((_, k) => {
      const h = 0.22 + Math.abs(Math.sin(f / 2.6 - k * 0.75) * Math.cos(f / 6.7 + k * 0.4)) * Math.max(0.35, 2.4 - k * 0.11);
      return <Bloco key={k} tam={[0.17, h, 0.17]} cor={cores.laranja} posicao={[0.95 + k * 0.34, 1.55, 0]} raio={0.08} emissivo="#f2622e" intensidade={0.9} sombra={false} />;
    })}
  </group>
);

const Cursor: React.FC<{posicao: V3; aperta: number}> = ({posicao, aperta}) => {
  const geo = useMemo(() => {
    const s = new THREE.Shape();
    const pts: [number, number][] = [
      [0, 0],
      [0, -1.5],
      [0.36, -1.14],
      [0.62, -1.72],
      [0.86, -1.6],
      [0.6, -1.03],
      [1.08, -1.03],
    ];
    pts.forEach(([x, y], i) => (i === 0 ? s.moveTo(x, y) : s.lineTo(x, y)));
    s.closePath();
    return new THREE.ExtrudeGeometry(s, {depth: 0.14, bevelEnabled: true, bevelThickness: 0.03, bevelSize: 0.03, bevelSegments: 3});
  }, []);
  return (
    <mesh geometry={geo} position={posicao} scale={1 - aperta * 0.14} castShadow>
      <meshStandardMaterial color="#ffffff" roughness={0.3} emissive="#ffffff" emissiveIntensity={0.25} />
    </mesh>
  );
};

const Humano: React.FC = () => {
  const f = useCurrentFrame();
  const c = chegadaRampa(f, 28);
  const s = saidaRampa(f, 125, 12);
  const passo = rampa(f, 64, 79, power4InOut);
  const pico = rampa(f, 14, 20, expoOut) * (1 - rampa(f, 20, 40, power2Out));
  const pos = somar(somar([1.8 + f * 0.022 + passo * 12.8, 3.3, 11 - f * 0.012], [-10, 0, 0], c), [0, 9, 0], s);
  const alvo = somar(somar([3.2 + passo * 11.8, 3.05 - passo * 0.35, 0], [-10, 0, 0], c), [0, 9, 0], s);
  const botao = mola(f, 67, {damping: 12});
  const aperta = f >= 92 && f < 102 ? Math.sin(((f - 92) / 10) * Math.PI) : 0;
  const clique = f >= 92 ? 1 - rampa(f, 92, 122) * 0.7 : 0;
  const cursor = trilho(f, [74, 84, 92, 125], [
    [20.5, -1.5, 2.6],
    [18.6, 2.4, 2.4],
    [16.4, 2.75, 1.5],
    [16.6, 2.6, 1.6],
  ]);
  const faixa = rampa(f, 2, 22, power2Out);
  const seg = Math.floor(f / 30);
  return (
    <AbsoluteFill>
      <Palco f={f} pos={pos} alvo={alvo} fov={40 - pico * 5} tema={TEMAS.gravacao} borrao={c * c * 18 + s * 16}>
        {/* a voz do Cristian sendo gravada: microfone, onda e a faixa de áudio crescendo */}
        <Microfone posicao={[0.5, 1.02, 0]} escala={1.28} f={f} />
        <group position={[5.4, 3.0, -0.3]} scale={[Math.max(0.001, faixa), 1, 1]}>
          <Bloco tam={[7.9, 3.7, 0.16]} cor="#0c0e10" raio={0.2} rugosidade={0.6} />
        </group>
        <mesh position={[1.75, 5.25, 0]}>
          <sphereGeometry args={[0.13, 20, 14]} />
          <meshStandardMaterial color={N.erro} emissive="#ff3b30" emissiveIntensity={Math.floor(f / 10) % 2 ? 2.2 : 0.3} />
        </mesh>
        <Rotulo3D texto="GRAVANDO" larg={2.0} cor="#cfd6dc" posicao={[3.0, 5.25, 0]} />
        <Rotulo3D texto={`00:0${Math.min(9, seg)}`} larg={1.6} cor="#cfd6dc" posicao={[8.45, 5.25, 0]} />
        {/* o botão de aprovar */}
        <group position={[15, 2.7, 0]} rotation={[-0.08, -0.12, 0]} scale={Math.max(0.001, botao)}>
          <Halo cor="#ff7a3d" tam={12} z={-0.8} forca={clique * 0.9} />
          <Bloco tam={[5.6, 2.3, 0.6]} cor="#10191c" raio={0.34} posicao={[0, 0, -0.4]} />
          <Bloco tam={[5.0, 1.75, 0.7]} cor={N.texto} raio={0.32} posicao={[0, 0, 0.1 - aperta * 0.3]} emissivo={N.acento} intensidade={clique * 0.9} rugosidade={0.3} />
          <Rotulo3D texto="APROVAR" larg={4.3} cor="#141413" posicao={[0, 0, 0.47 - aperta * 0.3]} />
        </group>
        {f >= 74 ? <Cursor posicao={cursor} aperta={aperta} /> : null}
      </Palco>
      <Destaque texto="VOZ DO *CRISTIAN" de={14} ate={48} tam={130} />
    </AbsoluteFill>
  );
};

// ====================== Trecho 4: os cinco passos (uma escada) ======================
const DEGRAUS = [0, 1, 2].map((i) => ({x: -3.4 + i * 3.4, h: (i + 1) * 1.15}));

const Escada: React.FC<{f: number; sobe?: boolean; acesos: number[]}> = ({f, sobe = true, acesos}) => (
  <>
    {DEGRAUS.map((d, i) => {
      const m = sobe ? mola(f, 2 + i * 3, {damping: 13}) : 1;
      const a = acesos[i];
      const cor = new THREE.Color('#15191c').lerp(new THREE.Color('#ea7648'), a).getStyle();
      return (
        <group key={i} position={[d.x, 0, 0]} scale={[1, Math.max(0.001, m), 1]}>
          <Bloco tam={[3.3, d.h, 3.2]} cor={cor} raio={0.12} posicao={[0, d.h / 2, 0]} emissivo="#d2470f" intensidade={a * 0.45} rugosidade={0.4} />
          <Texto3D texto={String(i + 1)} tam={0.5} posicao={[0, d.h - 0.43, 1.62]} emissao={0.25 + a * 0.6} prof={0.08} />
        </group>
      );
    })}
  </>
);

export const CincoPassos: React.FC<{atraso?: number; sai?: number}> = ({atraso = 0, sai = 135}) => {
  const f = useCurrentFrame();
  const c = chegadaRampa(f, 28);
  const s = saidaRampa(f, sai, 12);
  const q = [0, 40, sai - 27, sai];
  const pos = somar(somar(trilho(f, q, [[-9, 2.2, 10], [-5, 3.4, 10.5], [5.5, 7, 12], [2.5, 6, 16.5]]), [0, -8, 0], c), [10, 0, 0], s);
  const alvo = somar(somar(trilho(f, q, [[-6.5, 1, 0], [-4, 1.6, 0], [4, 3.6, 0], [0.5, 2.4, 0]]), [0, -8, 0], c), [10, 0, 0], s);
  const pouso = (i: number) => 24 + atraso + i * 20;
  const pts: [number, number][] = [[-7, 0], ...DEGRAUS.map((d) => [d.x, d.h] as [number, number])];
  let xM = pts[0][0];
  let yM = 0;
  for (let i = 0; i < DEGRAUS.length; i++) {
    const t = rampa(f, pouso(i) - 13, pouso(i), Easing.inOut(Easing.quad));
    if (t > 0) {
      xM = lerp(pts[i][0], pts[i + 1][0], t);
      yM = lerp(pts[i][1], pts[i + 1][1], t) + Math.sin(t * Math.PI) * 1.5;
    }
  }
  const acesos = DEGRAUS.map((_, i) => rampa(f, pouso(i) - 1, pouso(i) + 4));
  return (
    <AbsoluteFill>
      <Palco f={f} pos={pos} alvo={alvo} tema={TEMAS.aurora} borrao={c * c * 18 + s * 16}>
        <Escada f={f} acesos={acesos} />
        <Mascote3D posicao={[xM, yM, 0.2]} rotacao={[0, 0.45, 0]} escala={0.85} passo={f * 0.8} />
      </Palco>
      <Destaque texto="*3 NÍVEIS" de={14 + atraso} ate={52 + atraso} onde="topo" tam={160} />
    </AbsoluteFill>
  );
};

// ====================== Trecho 5: os dois usos ======================
const DoisUsos: React.FC = () => {
  const f = useCurrentFrame();
  const c = chegadaRampa(f, 28);
  const s = saidaRampa(f, 100, 12);
  const x = 10 * rampa(f, 40, 55, power4InOut);
  const pos = somar(somar([x, 3.2, 9.6 - f * 0.009], [-10, 0, 0], c), [10, 0, 0], s);
  const alvo = somar(somar([x, 2.85, 0], [-10, 0, 0], c), [10, 0, 0], s);
  return (
    <AbsoluteFill>
      <Palco f={f} pos={pos} alvo={alvo} tema={TEMAS.vitrine} borrao={c * c * 18 + s * 16}>
        {/* cortes: celular na vertical, com um vídeo de papel cheio de cortes secos e legenda */}
        <group position={[0, 3.15, 0]} rotation={[0, Math.sin(f / 26) * 0.16 + 0.12, -0.04]}>
          <Bloco tam={[2.6, 4.75, 0.26]} cor="#0d1416" raio={0.28} />
          <TelaPapel desenhar={cenaLegenda} f={f} larg={2.3} alt={4.4} px={560} posicao={[0, 0, 0.14]} />
        </group>
        <Rotulo3D texto="CORTES" larg={3.6} posicao={[0, 0.42, 1.2]} />
        {/* vídeos longos: tela larga com a história passando, o relógio correndo e a linha do tempo embaixo */}
        <group position={[10, 3.35, 0]} rotation={[0, Math.sin(f / 26 + 1) * 0.14, 0]}>
          <Bloco tam={[6.5, 4.9, 0.26]} cor="#0d1416" raio={0.18} />
          <TelaPapel desenhar={cenaHistoria} f={f} larg={6.0} alt={3.375} px={1280} posicao={[0, 0.56, 0.14]} />
          {Array.from({length: 9}).map((_, k) => (
            <Bloco key={k} tam={[0.6, 0.34, 0.06]} cor={k === Math.min(8, Math.floor(f / 24) + 2) ? N.acento : k < Math.floor(f / 24) + 2 ? N.clipeClaro : '#14181b'} raio={0.05} posicao={[-2.68 + k * 0.67, -1.48, 0.17]} sombra={false} />
          ))}
          <Bloco tam={[5.96, 0.3, 0.06]} cor={N.clipe} raio={0.05} posicao={[0, -1.96, 0.17]} sombra={false} />
          <Bloco tam={[0.05, 1.0, 0.05]} cor="#ffffff" raio={0.02} posicao={[-2.68 + Math.min(8, f / 24 + 2) * 0.67, -1.72, 0.24]} emissivo="#ffffff" intensidade={2} sombra={false} />
        </group>
        <Rotulo3D texto="VÍDEOS LONGOS" larg={5.2} posicao={[10, 0.42, 1.2]} />
      </Palco>
    </AbsoluteFill>
  );
};

// ====================== Trecho 6: as ferramentas e o pedido ======================
const FERRAMENTAS: [string, string][] = ['Whisper', 'auto-editor', 'FFmpeg', 'Remotion'].map((n) => [n, '#171b1e'] as [string, string]);
const PEDIDO = 'transcreva este vídeo palavra por palavra';

const Ferramentas: React.FC = () => {
  const f = useCurrentFrame();
  const c = chegadaRampa(f, 28);
  const s = saidaRampa(f, 135, 12);
  const desce = rampa(f, 58, 80);
  const pos = somar(somar([0, 4.0 + desce * 0.3, 15.6 - f * 0.014], [-10, 0, 0], c), [0, 0, -9], s);
  const alvo = somar([0, 3.1 - desce * 1.3, 0], [-10, 0, 0], c);
  const barra = mola(f, 62, {damping: 14});
  const letras = Math.max(0, Math.min(PEDIDO.length, Math.floor((f - 72) * 0.77)));
  return (
    <AbsoluteFill>
      <Palco f={f} pos={pos} alvo={alvo} tema={TEMAS.oficina} borrao={c * c * 18 + s * 16}>
        <Bloco tam={[17.6, 0.3, 2.3]} cor="#101316" posicao={[0, 1.9, 0]} raio={0.1} />
        {[-7.5, 7.5].map((x) => (
          <Bloco key={x} tam={[0.3, 1.8, 1.6]} cor="#101316" posicao={[x, 0.9, 0]} raio={0.08} />
        ))}
        {FERRAMENTAS.map(([nome, cor], i) => {
          const ini = -7 + i * 3;
          const cai = rampa(f, ini, ini + 11, Easing.in(Easing.quad));
          const amassa = Math.max(0, 1 - Math.abs(f - (ini + 12)) / 4) * 0.22;
          if (f < ini) return null;
          return (
            <group key={nome} position={[(i - 1.5) * 3.6, 2.05 + (1 - cai) * 11, 0]} scale={[1 + amassa * 0.5, 1 - amassa, 1]} rotation={[0, Math.sin(f / 24 + i) * 0.1, (1 - cai) * (i % 2 ? 0.5 : -0.5)]}>
              <Bloco tam={[3.0, 1.7, 1.4]} cor={cor} raio={0.24} posicao={[0, 0.85, 0]} rugosidade={0.4} />
              <Bloco tam={[2.2, 0.07, 0.05]} cor={N.acento} raio={0.02} posicao={[0, 0.3, 0.72]} emissivo={N.acento} intensidade={1.2} sombra={false} />
              <Rotulo3D texto={nome} larg={2.7} posicao={[0, 0.85, 0.72]} />
            </group>
          );
        })}
      </Palco>
      <div
        style={{
          position: 'absolute',
          left: 250,
          right: 250,
          bottom: 92 - (1 - barra) * 280,
          height: 132,
          borderRadius: 38,
          background: 'rgba(8,16,18,0.96)',
          border: '2px solid rgba(245,242,236,0.28)',
          boxShadow: '0 0 70px rgba(242,98,46,0.28), 0 24px 50px rgba(0,0,0,0.7)',
          display: 'flex',
          alignItems: 'center',
          padding: '0 26px 0 46px',
          fontFamily: 'Poppins, sans-serif',
          fontWeight: 500,
          fontSize: 52,
          color: '#fff',
        }}
      >
        <span style={{flex: 1, whiteSpace: 'nowrap'}}>
          {PEDIDO.slice(0, letras)}
          <span style={{opacity: Math.floor(f / 8) % 2 ? 1 : 0, color: '#f2622e'}}>|</span>
        </span>
        <div style={{width: 88, height: 88, borderRadius: 28, background: 'linear-gradient(180deg, #ff9a5c, #f2622e)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 52, fontWeight: 800}}>↑</div>
      </div>
    </AbsoluteFill>
  );
};

// ====================== Trecho 7: passo um ======================
export const PassoUm: React.FC = () => {
  const f = useCurrentFrame();
  const c = chegadaRampa(f, 22);
  const mergulho = rampa(f, 0, 38, power4InOut);
  const pos = somar(lerp3([2.5, 6, 16.5], [-6, 0.6, 4.7 - f * 0.014], mergulho), [0, 0, 9], c);
  const alvo = lerp3([0.5, 2.4, 0], [-6, 0.43, 0], mergulho);
  const clarao = rampa(f, 65, 75);
  return (
    <AbsoluteFill>
      <Palco f={f} pos={pos} alvo={alvo} tema={TEMAS.aurora} borrao={c * c * 18}>
        <Escada f={f} sobe={false} acesos={[1, 0, 0, 0, 0]} />
        <Mascote3D posicao={[6, 4.25, 0.2]} rotacao={[0, -0.4, 0]} escala={0.85} passo={f * 0.3} />
      </Palco>
      <Destaque texto="*PREPARAR" de={34} ate={72} tam={170} />
      <AbsoluteFill style={{background: '#f2622e', opacity: clarao}} />
    </AbsoluteFill>
  );
};

// ====================== Cena completa ======================
export const Gancho3D: React.FC = () => {
  const ordem: [keyof typeof TRECHOS_3D, React.FC][] = [
    ['linhaDoTempo', LinhaDoTempo],
    ['semPrograma', SemPrograma],
    ['humano', Humano],
    ['cincoPassos', CincoPassos],
    ['doisUsos', DoisUsos],
    ['ferramentas', Ferramentas],
    ['passoUm', PassoUm],
  ];
  let inicio = 0;
  return (
    <AbsoluteFill style={{background: '#020807'}}>
      <EsperaFonte>
        {ordem.map(([nome, Trecho]) => {
          const de = inicio;
          inicio += TRECHOS_3D[nome];
          return (
            <Sequence key={nome} from={de} durationInFrames={TRECHOS_3D[nome]} name={nome}>
              <Trecho />
            </Sequence>
          );
        })}
      </EsperaFonte>
    </AbsoluteFill>
  );
};
