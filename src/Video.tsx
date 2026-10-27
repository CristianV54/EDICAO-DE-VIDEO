import React, { useEffect, useState } from "react";
import { AbsoluteFill, Audio, continueRender, delayRender, getStaticFiles, staticFile } from "remotion";
import { ThreeCanvas } from "@remotion/three";
import "./fontes";
import { Cena3D } from "./cena/Cena3D";
import { Contador } from "./overlay/Contador";
import { CardAnotacoes } from "./overlay/CardAnotacoes";
import { TituloPeca } from "./overlay/TituloPeca";
import { Etiquetas } from "./overlay/Etiquetas";
import { Legenda } from "./overlay/Legenda";
import { TextosFinais } from "./overlay/TextosFinais";
import { FlashTela } from "./overlay/FlashTela";
import { esperarFontes } from "./cena/Texturas";
import { ALTURA, LARGURA } from "./util/tempo";

// o audio so entra se public/narracao.mp3 existir
const temAudio = () => getStaticFiles().some((f) => f.name === "narracao.mp3");

export const Video: React.FC = () => {
  const [fontesOk, setFontesOk] = useState(false);
  const [handle] = useState(() => delayRender("fontes"));
  useEffect(() => {
    esperarFontes().then(() => {
      setFontesOk(true);
      continueRender(handle);
    });
  }, [handle]);

  return (
    <AbsoluteFill style={{ background: "#EFE6D6" }}>
      {temAudio() && <Audio src={staticFile("narracao.mp3")} />}
      {fontesOk && (
        <>
          <ThreeCanvas width={LARGURA} height={ALTURA} shadows dpr={1} flat camera={{ fov: 40, near: 0.1, far: 200, position: [0, 5, 10] }}>
            <Cena3D />
          </ThreeCanvas>
          <Etiquetas />
          <CardAnotacoes />
          <Contador />
          <TituloPeca />
          <Legenda />
          <TextosFinais />
          <FlashTela />
        </>
      )}
    </AbsoluteFill>
  );
};
