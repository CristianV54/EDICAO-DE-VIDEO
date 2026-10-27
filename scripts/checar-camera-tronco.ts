// Interseccao da camera na mao (corpo e alca) com a caixa do tronco do fotografo, em TODOS os frames do video.
// Rodar: npx esbuild scripts/checar-camera-tronco.ts --bundle --platform=node --format=esm --external:three --outfile=out/tronco.mjs && node out/tronco.mjs
import { fotografo } from "../src/cena/estadoElenco";
import { cameraAtravessaTronco, centroCamera, CAM_CORPO, TRONCO } from "../src/cena/geometria";
import { DURACAO_FRAMES } from "../src/util/tempo";

let ruins = 0;
let levMax = 0;
for (let f = 0; f < DURACAO_FRAMES; f++) {
  const lev = fotografo(f).lev;
  levMax = Math.max(levMax, lev);
  if (cameraAtravessaTronco(lev)) ruins++;
}
const c0 = centroCamera(0);
console.log(`camera na mao: corpo ${CAM_CORPO.join(" x ")}, centro ${c0[2].toFixed(2)} a frente do eixo do peito (lev 0), tronco ${TRONCO.t.join(" x ")}`);
console.log(`${DURACAO_FRAMES} frames verificados, lev maximo ${levMax.toFixed(2)}, frames com interseccao: ${ruins}`);
process.exit(ruins ? 1 : 0);
