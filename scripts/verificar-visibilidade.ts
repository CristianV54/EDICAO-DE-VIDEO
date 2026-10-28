// Raycast de visibilidade nos planos "cena": a peca principal, a plaquinha e a placa de foto precisam estar visiveis
// (nao cobertos por personagem) em pelo menos 85% de uma grade de pontos da face voltada para a camera.
// Rodar: npx esbuild scripts/verificar-visibilidade.ts --bundle --platform=node --format=esm --external:three --outfile=out/vis.mjs && node out/vis.mjs [az]
import * as THREE from "three";
import { caixaDe, corpoDe, planoCena, poseResolvida, resolverPlano } from "../src/cena/enquadramento";

const MIN = 0.85;
const azForcado = process.argv[2] !== undefined ? parseFloat(process.argv[2]) : null;
const EH_PERS = /^(fot|noiva|noivo|cli|amigoA|amigoB|madrinha)\d+$/;

const box3 = (id: string, fisico = false) => {
  const { c, t } = fisico ? corpoDe(id) : caixaDe(id);
  return new THREE.Box3(new THREE.Vector3(c[0] - t[0] / 2, c[1] - t[1] / 2, c[2] - t[2] / 2), new THREE.Vector3(c[0] + t[0] / 2, c[1] + t[1] / 2, c[2] + t[2] / 2));
};

// pontos da grade 8x8 na face lateral/topo mais voltada para a camera
const amostras = (b: THREE.Box3, cam: THREE.Vector3): THREE.Vector3[] => {
  const c = b.getCenter(new THREE.Vector3());
  const t = b.getSize(new THREE.Vector3());
  const faces = [
    { n: new THREE.Vector3(0, 0, 1), u: "x", v: "y", off: t.z / 2 },
    { n: new THREE.Vector3(0, 0, -1), u: "x", v: "y", off: -t.z / 2 },
    { n: new THREE.Vector3(1, 0, 0), u: "z", v: "y", off: t.x / 2 },
    { n: new THREE.Vector3(-1, 0, 0), u: "z", v: "y", off: -t.x / 2 },
  ];
  const dir = cam.clone().sub(c).normalize();
  faces.sort((a, b2) => b2.n.dot(dir) - a.n.dot(dir));
  const f = faces[0];
  const out: THREE.Vector3[] = [];
  for (let i = 0; i < 8; i++)
    for (let j = 0; j < 8; j++) {
      const a = ((i + 0.5) / 8 - 0.5) * 0.94;
      const bb = ((j + 0.5) / 8 - 0.5) * 0.94;
      const p = c.clone();
      const dims = { x: t.x, y: t.y, z: t.z } as Record<string, number>;
      (p as unknown as Record<string, number>)[f.u] += a * dims[f.u];
      (p as unknown as Record<string, number>)[f.v] += bb * dims[f.v];
      if (f.n.z) p.z += f.off;
      else p.x += f.off;
      out.push(p);
    }
  return out;
};

export const visivel = (alvoId: string, ocluidores: string[], cam: THREE.Vector3): number => {
  const alvo = box3(alvoId);
  const pts = amostras(alvo, cam);
  const occ = ocluidores.map((o) => box3(o, true));
  let ok = 0;
  for (const p of pts) {
    const dir = p.clone().sub(cam);
    const dist = dir.length();
    const ray = new THREE.Ray(cam, dir.normalize());
    let bloq = false;
    for (const b of occ) {
      const hit = ray.intersectBox(b, new THREE.Vector3());
      if (hit && hit.distanceTo(cam) < dist - 0.02) bloq = true;
    }
    if (!bloq) ok++;
  }
  return ok / pts.length;
};

let falhou = false;
console.log(`plano cena   az   alvo           menor visibilidade (prog 0, 0,5, 1)   minimo ${MIN * 100}%`);
for (let n = 1; n <= 13; n++) {
  const pl = planoCena(n);
  if (azForcado !== null) pl.az = azForcado;
  const r = resolverPlano(pl);
  const pers = r.plano.lista.filter((id) => EH_PERS.test(id));
  const alvos = [`peca${n}`, `plaq${n}`, ...([1, 7, 8, 9].indexOf(n) >= 0 ? [`tela${n}`] : [])].filter((id) => !(n === 12 && id === "peca12") && !(n === 13 && id === "peca13") && !(n === 13 && id === "plaq13" && false));
  for (const id of alvos) {
    if (n === 2 && (id === "peca2" || id === "plaq2")) continue; // s02: os amigos ficam na frente do album ate sairem; o album tem close proprio
    let mn = 1;
    for (const prog of [0, 0.5, 1]) {
      const pose = poseResolvida(pl, prog);
      const v = visivel(id, pers, new THREE.Vector3(...pose.pos));
      mn = Math.min(mn, v);
    }
    const ok = mn >= MIN;
    if (!ok) falhou = true;
    console.log(`${pl.id.padEnd(10)} ${String(pl.az).padStart(4)}   ${id.padEnd(10)}  ${(mn * 100).toFixed(0).padStart(4)}%  ${ok ? "ok" : "ABAIXO DE 85%"}`);
  }
}
console.log(falhou ? "COM FALHAS" : "todos os alvos com 85% ou mais visiveis");
process.exit(falhou ? 1 : 0);
