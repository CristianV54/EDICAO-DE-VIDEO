import React from "react";
import { B, PlanoTex } from "../primitivas";
import { NomeTex, useTex } from "../Texturas";
import type { Vec3 } from "../../dados/roteiro";

// plaquinha branca com texto preto, como o "APP" / "API" / "DB" da referencia
export const Plaquinha: React.FC<{ tex: NomeTex; p: Vec3; w?: number; rot?: Vec3 }> = ({ tex, p, w = 0.62, rot = [0, 0, 0] }) => {
  const t = useTex(tex);
  const h = w * (160 / 512);
  return (
    <group position={p} rotation={rot}>
      <B s={[w + 0.04, h + 0.04, 0.03]} c="#F7F5F0" r={0.04} />
      <PlanoTex p={[0, 0, 0.018]} w={w} h={h} tex={t} />
    </group>
  );
};
