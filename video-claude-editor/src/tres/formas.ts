import * as THREE from 'three';

export const retanguloRedondo = (w: number, h: number, r: number): THREE.Shape => {
  const s = new THREE.Shape();
  const x = -w / 2;
  const y = -h / 2;
  s.moveTo(0, y);
  s.lineTo(x + w - r, y);
  s.absarc(x + w - r, y + r, r, -Math.PI / 2, 0, false);
  s.lineTo(x + w, y + h - r);
  s.absarc(x + w - r, y + h - r, r, 0, Math.PI / 2, false);
  s.lineTo(x + r, y + h);
  s.absarc(x + r, y + h - r, r, Math.PI / 2, Math.PI, false);
  s.lineTo(x, y + r);
  s.absarc(x + r, y + r, r, Math.PI, Math.PI * 1.5, false);
  return s;
};

// Placa com chanfro arredondado. A frente fica em z = +prof/2 + chanfro.
export const placa = (w: number, h: number, r: number, prof: number, chanfro = 0.1): THREE.ExtrudeGeometry => {
  const g = new THREE.ExtrudeGeometry(retanguloRedondo(w - chanfro * 2, h - chanfro * 2, Math.max(0.01, r - chanfro)), {
    depth: prof,
    bevelEnabled: true,
    bevelThickness: chanfro,
    bevelSize: chanfro,
    bevelSegments: 10,
    curveSegments: 32,
  });
  g.translate(0, 0, -prof / 2);
  return g;
};

export const extrudar = (forma: THREE.Shape, prof: number, chanfro = 0.02): THREE.ExtrudeGeometry =>
  new THREE.ExtrudeGeometry(forma, {depth: prof, bevelEnabled: true, bevelThickness: chanfro, bevelSize: chanfro, bevelSegments: 5, curveSegments: 40});

// Gota: círculo com uma ponta virada para o centro.
export const gota = (ponta: number, centro: number, raio: number): THREE.Shape => {
  const s = new THREE.Shape();
  const a = Math.acos(raio / (centro - ponta));
  const ini = -(Math.PI / 2 - a);
  const fim = Math.PI * 1.5 - a;
  s.moveTo(0, ponta);
  s.lineTo(Math.cos(ini) * raio, centro + Math.sin(ini) * raio);
  s.absarc(0, centro, raio, ini, fim, false);
  s.lineTo(0, ponta);
  return s;
};

// Brilho em volta de um objeto: disco com gradiente, somado à imagem.
export const texturaHalo = (cor: string): THREE.CanvasTexture => {
  const c = document.createElement('canvas');
  c.width = 256;
  c.height = 256;
  const g = c.getContext('2d')!;
  const grad = g.createRadialGradient(128, 128, 0, 128, 128, 128);
  grad.addColorStop(0, cor);
  grad.addColorStop(0.35, cor + '88');
  grad.addColorStop(1, cor + '00');
  g.fillStyle = grad;
  g.fillRect(0, 0, 256, 256);
  const t = new THREE.CanvasTexture(c);
  t.colorSpace = THREE.SRGBColorSpace;
  return t;
};
