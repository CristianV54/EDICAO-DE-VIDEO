import React, { useEffect, useState } from "react";
import { Composition, continueRender, delayRender, staticFile } from "remotion";
import { Cena1, Still1, Still2, Still3 } from "./Cenas";
import { useCurrentFrame } from "remotion";
import { FPS, H, W } from "./tokens";

const Com: React.FC<{ c: React.FC }> = ({ c: Cena }) => {
  const [h] = useState(() => delayRender("fontes"));
  useEffect(() => {
    const f = [
      ...[400, 500, 600].map((w) => new FontFace("Cormorant", `url(${staticFile(`fontes/cormorant-latin-${w}-normal.woff2`)})`, { weight: String(w) })),
      ...[400, 500].map((w) => new FontFace("Cormorant", `url(${staticFile(`fontes/cormorant-latin-${w}-italic.woff2`)})`, { weight: String(w), style: "italic" })),
      ...[400, 500, 600].map((w) => new FontFace("Inter", `url(${staticFile(`fontes/inter-latin-${w}-normal.woff2`)})`, { weight: String(w) })),
    ];
    Promise.all(f.map((x) => x.load().then((y) => document.fonts.add(y)))).then(() => continueRender(h));
  }, [h]);
  return <Cena />;
};
const Logo1: React.FC = () => { const t = useCurrentFrame() / FPS; return <Com c={() => <Cena1 t={t} />} />; };
export const Root: React.FC = () => (
  <>
    <Composition id="Logo" component={Logo1} width={W} height={H} fps={FPS} durationInFrames={Math.round(5 * FPS)} />
    <Composition id="Still1" component={() => <Com c={Still1} />} width={W} height={H} fps={FPS} durationInFrames={30} />
    <Composition id="Still2" component={() => <Com c={Still2} />} width={W} height={H} fps={FPS} durationInFrames={30} />
    <Composition id="Still3" component={() => <Com c={Still3} />} width={W} height={H} fps={FPS} durationInFrames={30} />
  </>
);
