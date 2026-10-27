import React from "react";
import { AmigaAmarela, AmigoVerde, Fotografo, Madrinha, Noiva, Noivo } from "./Personagem";
import { B } from "./primitivas";
import { CameraModelo } from "./CameraModelo";
import { amigos, fotografo, madrinha, noiva, noivo } from "./estadoElenco";
import { LINHAS, segDe } from "../util/tempo";
import { usePixelado } from "./Texturas";
import type { Estado } from "./estadoElenco";

const Celular: React.FC<{ pixelado?: boolean }> = ({ pixelado }) => {
  const tex = usePixelado();
  return (
    <group position={[0, 0.02, 0.04]}>
      <B s={[0.11, 0.2, 0.018]} c="#101114" r={0.01} sombra={false} />
      <mesh position={[0, 0, 0.011]}>
        <planeGeometry args={[0.095, 0.178]} />
        {pixelado ? <meshBasicMaterial map={tex} toneMapped={false} /> : <meshBasicMaterial color="#DDE7F5" toneMapped={false} />}
      </mesh>
    </group>
  );
};
const Buque: React.FC = () => (
  <group position={[0, 0.06, 0.02]}>
    <B p={[0, -0.08, 0]} s={[0.03, 0.18, 0.03]} c="#3E9B5B" r={0.01} sombra={false} />
    {[[-0.05, 0.04, 0], [0.05, 0.04, 0], [0, 0.07, 0.04], [0, 0.1, -0.02]].map((p, k) => (
      <mesh key={k} position={[p[0], p[1], p[2]]} castShadow>
        <sphereGeometry args={[0.065, 7, 6]} />
        <meshStandardMaterial color={k % 2 ? "#F7B6C8" : "#FFFFFF"} />
      </mesh>
    ))}
  </group>
);

const comum = (e: Estado) => ({
  position: e.pos, rotY: e.rotY, opacidade: e.opac, passo: e.passo, expr: e.expr, mp: e.mp, mn: e.mn, inclina: e.inclina, olhar: e.olhar, inclinaCabeca: e.inclinaCabeca,
});

export const Elenco: React.FC<{ frame: number }> = ({ frame }) => {
  const i = segDe(frame);
  const fo = fotografo(frame);
  const nv = noiva(frame);
  const nvo = noivo(frame);
  const am = amigos(frame);
  const ma = madrinha(frame);
  const pixelado = i === 11 && frame >= LINHAS[11].ev.whatsapp;
  return (
    <group>
      <Fotografo
        {...comum(fo)}
        lev={fo.lev}
        camera={<CameraModelo escala={0.45} lente={fo.lente} troca={fo.troca} cartoes={fo.cartoes} flash={fo.flash} etiquetaLoja={fo.etiquetaLoja} />}
      />
      {nv.vis && <Noiva {...comum(nv)} segurarMp={nv.celular ? <Celular pixelado={pixelado} /> : undefined} segurarMn={nv.buque ? <Buque /> : undefined} />}
      {nvo.vis && <Noivo {...comum(nvo)} />}
      {am.a.vis && <AmigoVerde {...comum(am.a)} />}
      {am.b.vis && <AmigaAmarela {...comum(am.b)} />}
      {ma.vis && <Madrinha {...comum(ma)} segurarMp={<Celular />} />}
    </group>
  );
};
