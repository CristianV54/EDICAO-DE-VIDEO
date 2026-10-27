import React from "react";
import { Composition } from "remotion";
import { Video } from "./Video";
import { ALTURA, DURACAO_FRAMES, FPS, LARGURA, MARCOS } from "./util/tempo";

export const RemotionRoot: React.FC = () => (
  <Composition
    id="PecasFotografo"
    component={Video}
    fps={FPS}
    durationInFrames={DURACAO_FRAMES}
    width={LARGURA}
    height={ALTURA}
    defaultProps={{ marcos: MARCOS }}
  />
);
