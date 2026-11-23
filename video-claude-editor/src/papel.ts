// Animação de papel recortado, desenhada em canvas quadro a quadro.
// Cada peça tem cor chapada, borda clara e sombra, como papel colado em camadas.
type G = CanvasRenderingContext2D;

const sombra = (g: G, forca = 1) => {
  g.shadowColor = `rgba(0,0,0,${0.36 * forca})`;
  g.shadowBlur = 12 * forca;
  g.shadowOffsetX = 3 * forca;
  g.shadowOffsetY = 7 * forca;
};
const semSombra = (g: G) => {
  g.shadowColor = 'transparent';
  g.shadowBlur = 0;
  g.shadowOffsetX = 0;
  g.shadowOffsetY = 0;
};
const peca = (g: G, cor: string, caminho: () => void, borda = true) => {
  g.beginPath();
  caminho();
  g.fillStyle = cor;
  g.fill();
  if (borda) {
    const s = g.shadowColor;
    semSombra(g);
    g.strokeStyle = 'rgba(255,255,255,0.5)';
    g.lineWidth = 2;
    g.stroke();
    g.shadowColor = s;
    sombra(g);
  }
};
const mistura = (a: [number, number, number], b: [number, number, number], t: number) => `rgb(${a.map((v, i) => Math.round(v + (b[i] - v) * t)).join(',')})`;

export type Pose = {
  bracoE?: number; // 0 = para baixo; positivo levanta
  bracoD?: number;
  pernaE?: number;
  pernaD?: number;
  cabeca?: number;
  boca?: number; // 0 a 1
  achata?: number; // 1 = normal; menor que 1 achata
  roupa?: string;
  pele?: string;
  cabelo?: string;
  silhueta?: string; // se definido, pinta tudo dessa cor
};

// Boneco de papel. (x, y) é o ponto entre os pés; alt é a altura em pixels.
export const boneco = (g: G, x: number, y: number, alt: number, p: Pose = {}) => {
  const u = alt / 4.1;
  const a = p.achata ?? 1;
  const roupa = p.silhueta ?? p.roupa ?? '#f2622e';
  const pele = p.silhueta ?? p.pele ?? '#f4c9a0';
  const cabelo = p.silhueta ?? p.cabelo ?? '#3b2a20';
  g.save();
  g.translate(x, y);
  g.scale(1 / Math.sqrt(a), a);
  sombra(g);
  const membro = (px: number, py: number, comp: number, larg: number, ang: number, cor: string) => {
    g.save();
    g.translate(px, py);
    g.rotate(ang);
    peca(g, cor, () => g.roundRect(-larg / 2, -larg / 2, larg, comp + larg / 2, larg / 2));
    g.restore();
  };
  membro(-0.24 * u, -1.35 * u, 1.3 * u, 0.36 * u, p.pernaE ?? 0, '#334155');
  membro(0.24 * u, -1.35 * u, 1.3 * u, 0.36 * u, p.pernaD ?? 0, '#334155');
  membro(-0.6 * u, -2.55 * u, 1.1 * u, 0.3 * u, p.bracoE ?? 0.25, pele);
  peca(g, roupa, () => g.roundRect(-0.64 * u, -2.75 * u, 1.28 * u, 1.55 * u, 0.36 * u));
  membro(0.6 * u, -2.55 * u, 1.1 * u, 0.3 * u, -(p.bracoD ?? 0.25), pele);
  // cabeça
  g.save();
  g.translate(0, -2.7 * u);
  g.rotate(p.cabeca ?? 0);
  peca(g, pele, () => g.arc(0, -0.66 * u, 0.7 * u, 0, Math.PI * 2));
  peca(g, cabelo, () => {
    g.arc(0, -0.72 * u, 0.72 * u, Math.PI * 1.02, Math.PI * 1.98);
    g.quadraticCurveTo(0, -0.95 * u, -0.72 * u, -0.74 * u);
  });
  if (!p.silhueta) {
    semSombra(g);
    g.fillStyle = '#1c1b1a';
    g.beginPath();
    g.arc(-0.24 * u, -0.6 * u, 0.075 * u, 0, Math.PI * 2);
    g.arc(0.24 * u, -0.6 * u, 0.075 * u, 0, Math.PI * 2);
    g.fill();
    g.fillStyle = '#7f1d1d';
    g.beginPath();
    g.ellipse(0, -0.3 * u, 0.17 * u, (0.04 + (p.boca ?? 0) * 0.15) * u, 0, 0, Math.PI * 2);
    g.fill();
  }
  g.restore();
  g.restore();
  semSombra(g);
};

const nuvem = (g: G, x: number, y: number, s: number) => {
  peca(g, '#ffffff', () => {
    g.arc(x, y, s * 0.5, 0, Math.PI * 2);
    g.arc(x + s * 0.55, y - s * 0.2, s * 0.62, 0, Math.PI * 2);
    g.arc(x + s * 1.2, y, s * 0.5, 0, Math.PI * 2);
    g.rect(x, y, s * 1.2, s * 0.5);
  }, false);
};
const sol = (g: G, x: number, y: number, r: number, giro: number, cor = '#fde047') => {
  g.save();
  g.translate(x, y);
  g.rotate(giro);
  for (let i = 0; i < 10; i++) {
    g.rotate((Math.PI * 2) / 10);
    peca(g, '#fbbf24', () => {
      g.moveTo(-r * 0.22, -r * 1.05);
      g.lineTo(0, -r * 1.65);
      g.lineTo(r * 0.22, -r * 1.05);
    }, false);
  }
  peca(g, cor, () => g.arc(0, 0, r, 0, Math.PI * 2));
  g.restore();
};
const estrela = (g: G, x: number, y: number, r: number, giro: number, cor: string) => {
  g.save();
  g.translate(x, y);
  g.rotate(giro);
  peca(g, cor, () => {
    for (let i = 0; i < 10; i++) {
      const rr = i % 2 ? r * 0.45 : r;
      const a = (i / 10) * Math.PI * 2 - Math.PI / 2;
      if (i === 0) g.moveTo(Math.cos(a) * rr, Math.sin(a) * rr);
      else g.lineTo(Math.cos(a) * rr, Math.sin(a) * rr);
    }
    g.closePath();
  });
  g.restore();
};
const morro = (g: G, cx: number, base: number, larg: number, alt: number, cor: string) => peca(g, cor, () => g.ellipse(cx, base, larg, alt, 0, Math.PI, 0), false);

// ---- Cena "animação": boneco pulando num cenário de papel ----
export const cenaAnimacao = (g: G, w: number, h: number, f: number) => {
  semSombra(g);
  g.fillStyle = '#7dd3fc';
  g.fillRect(0, 0, w, h);
  sombra(g);
  sol(g, w * 0.82, h * 0.26, h * 0.12, f * 0.05);
  nuvem(g, ((f * 2.2 + 80) % (w + 260)) - 200, h * 0.2, h * 0.11);
  nuvem(g, ((f * 1.4 + 520) % (w + 260)) - 200, h * 0.38, h * 0.08);
  morro(g, w * 0.25, h * 0.95, w * 0.5, h * 0.36, '#4ade80');
  morro(g, w * 0.8, h * 1.0, w * 0.55, h * 0.4, '#22c55e');
  peca(g, '#15803d', () => g.rect(-10, h * 0.86, w + 20, h * 0.2), false);
  const t = (f % 22) / 22;
  const pulo = Math.sin(t * Math.PI);
  const noChao = t < 0.14 || t > 0.86;
  boneco(g, w * 0.42, h * 0.88 - pulo * h * 0.34, h * 0.56, {
    achata: noChao ? 0.8 : 1.08,
    bracoE: 0.3 + pulo * 2.3,
    bracoD: 0.3 + pulo * 2.3,
    pernaE: -pulo * 0.5,
    pernaD: pulo * 0.5,
    boca: pulo,
    cabeca: Math.sin(f / 4) * 0.08,
  });
  for (let i = 0; i < 5; i++) {
    const a = f * 0.09 + i * 1.26;
    estrela(g, w * 0.42 + Math.cos(a) * w * 0.2, h * 0.42 + Math.sin(a) * h * 0.26, h * (0.035 + pulo * 0.03), f * 0.15 + i, ['#f472b6', '#fde047', '#ffffff', '#fb923c', '#a78bfa'][i]);
  }
  semSombra(g);
};

// ---- Cena "cortes": vídeo vertical, pessoa falando, corte seco a cada meio segundo, legenda ----
export const cenaCorte = (g: G, w: number, h: number, f: number) => {
  const k = Math.floor(f / 14);
  const fundo = ['#fda4af', '#93c5fd', '#fde68a', '#a7f3d0'][k % 4];
  const zoom = [1, 1.4, 1.15, 1.6][k % 4];
  const lado = [0, -0.08, 0.1, 0.03][k % 4];
  semSombra(g);
  g.fillStyle = fundo;
  g.fillRect(0, 0, w, h);
  sombra(g);
  peca(g, 'rgba(255,255,255,0.45)', () => g.roundRect(w * 0.08, h * 0.12, w * 0.36, h * 0.2, 14), false);
  peca(g, 'rgba(0,0,0,0.12)', () => g.roundRect(w * 0.62, h * 0.2, w * 0.3, h * 0.36, 14), false);
  boneco(g, w * (0.5 + lado), h * (0.62 + zoom * 0.62), h * 1.0 * zoom, {
    boca: Math.abs(Math.sin(f * 0.95)),
    cabeca: Math.sin(f / 5) * 0.07,
    bracoD: 0.5 + Math.abs(Math.sin(f / 6)) * 1.4,
    bracoE: 0.3,
    roupa: ['#f2622e', '#7c3aed', '#0d9488', '#db2777'][k % 4],
  });
  semSombra(g);
  // barrinhas de progresso, como nos vídeos curtos
  for (let i = 0; i < 4; i++) {
    g.fillStyle = 'rgba(255,255,255,0.4)';
    g.beginPath();
    g.roundRect(w * 0.05 + i * w * 0.23, h * 0.03, w * 0.2, 8, 4);
    g.fill();
    if (i <= k % 4) {
      g.fillStyle = '#fff';
      g.beginPath();
      g.roundRect(w * 0.05 + i * w * 0.23, h * 0.03, w * 0.2 * (i < k % 4 ? 1 : (f % 14) / 14), 8, 4);
      g.fill();
    }
  }
  // legenda palavra por palavra
  const larguras = [0.2, 0.26, 0.22];
  let x = w * 0.13;
  const ativa = Math.floor(f / 5) % 3;
  sombra(g, 0.7);
  larguras.forEach((l, i) => {
    peca(g, i === ativa ? '#f2622e' : '#ffffff', () => g.roundRect(x, h * (0.8 - (i === ativa ? 0.012 : 0)), w * l, h * 0.055, h * 0.02), false);
    x += w * (l + 0.03);
  });
  semSombra(g);
  // clarão do corte seco
  if (f % 14 === 0 && f > 0) {
    g.fillStyle = 'rgba(255,255,255,0.75)';
    g.fillRect(0, 0, w, h);
  }
};

// ---- Cena "vídeos longos": o dia vira noite enquanto o boneco anda e o relógio corre ----
export const cenaLongo = (g: G, w: number, h: number, f: number) => {
  const t = Math.min(1, f / 125);
  semSombra(g);
  const ceu = t < 0.5 ? mistura([125, 211, 252], [251, 146, 60], t * 2) : mistura([251, 146, 60], [30, 27, 75], (t - 0.5) * 2);
  g.fillStyle = ceu;
  g.fillRect(0, 0, w, h);
  if (t > 0.6) {
    g.fillStyle = `rgba(255,255,255,${(t - 0.6) * 2.2})`;
    for (let i = 0; i < 26; i++) g.fillRect((i * 97.3) % w, (i * 53.7) % (h * 0.5), 3, 3);
  }
  sombra(g);
  const ang = Math.PI * (1 - t * 1.7);
  if (t < 0.62) sol(g, w * 0.5 + Math.cos(ang) * w * 0.42, h * 0.75 - Math.sin(ang) * h * 0.6, h * 0.09, f * 0.04);
  else peca(g, '#f8fafc', () => g.arc(w * 0.78, h * 0.22, h * 0.09, 0, Math.PI * 2));
  const noite = t > 0.6 ? 0.55 : 1;
  for (let i = -1; i < 4; i++) morro(g, ((i * w * 0.5 - f * 1.6) % (w * 2) + w * 2) % (w * 2) - w * 0.4, h * 0.95, w * 0.34, h * 0.33, noite < 1 ? '#166534' : '#4ade80');
  for (let i = -1; i < 6; i++) {
    const x = (((i * w * 0.36 - f * 5) % (w * 1.8)) + w * 1.8) % (w * 1.8) - w * 0.3;
    peca(g, '#78350f', () => g.rect(x - 6, h * 0.66, 12, h * 0.2), false);
    peca(g, noite < 1 ? '#14532d' : '#16a34a', () => {
      g.moveTo(x - h * 0.11, h * 0.72);
      g.lineTo(x, h * 0.42);
      g.lineTo(x + h * 0.11, h * 0.72);
    });
  }
  peca(g, noite < 1 ? '#052e16' : '#15803d', () => g.rect(-10, h * 0.86, w + 20, h * 0.2), false);
  const passo = Math.sin(f * 0.55);
  boneco(g, w * 0.34, h * 0.88 - Math.abs(Math.cos(f * 0.55)) * h * 0.02, h * 0.46, {pernaE: passo * 0.6, pernaD: -passo * 0.6, bracoE: 0.2 - passo * 0.7, bracoD: 0.2 + passo * 0.7, cabeca: 0.04});
  semSombra(g);
  // relógio correndo
  const seg = Math.floor(f * 21.5);
  const texto = `${String(Math.floor(seg / 60)).padStart(2, '0')}:${String(seg % 60).padStart(2, '0')}`;
  g.fillStyle = 'rgba(0,0,0,0.6)';
  g.beginPath();
  g.roundRect(w * 0.72, h * 0.05, w * 0.24, h * 0.14, 12);
  g.fill();
  g.fillStyle = '#fff';
  g.font = `900 ${h * 0.1}px Montserrat`;
  g.textAlign = 'center';
  g.textBaseline = 'middle';
  g.fillText(texto, w * 0.84, h * 0.125);
};

// ---- Cena "canal dark": cidade à noite, narrador sem rosto e a voz em barras ----
export const cenaDark = (g: G, w: number, h: number, f: number) => {
  semSombra(g);
  const ceu = g.createLinearGradient(0, 0, 0, h);
  ceu.addColorStop(0, '#1b1f5e');
  ceu.addColorStop(1, '#4a2a7a');
  g.fillStyle = ceu;
  g.fillRect(0, 0, w, h);
  g.fillStyle = 'rgba(255,255,255,0.8)';
  for (let i = 0; i < 30; i++) g.fillRect((i * 97.3) % w, (i * 53.7) % (h * 0.5), 3, 3);
  sombra(g);
  peca(g, '#fef3c7', () => g.arc(w * 0.8, h * 0.2, h * 0.1, 0, Math.PI * 2));
  for (let i = 0; i < 7; i++) {
    const x = i * w * 0.15 - 10;
    const alt = h * (0.3 + ((i * 37) % 5) * 0.07);
    peca(g, i % 2 ? '#2a2f7a' : '#343a8f', () => g.rect(x, h * 0.92 - alt, w * 0.13, alt), false);
    semSombra(g);
    for (let j = 0; j < 6; j++) {
      if ((i * 7 + j * 3 + Math.floor(f / 9)) % 3 !== 0) {
        g.fillStyle = '#fbbf24';
        g.fillRect(x + 10 + (j % 2) * w * 0.055, h * 0.92 - alt + 14 + Math.floor(j / 2) * h * 0.075, w * 0.035, h * 0.04);
      }
    }
    sombra(g);
  }
  // narrador sem rosto, grande, com contorno claro para destacar do fundo
  boneco(g, w * 0.5, h * 1.34, h * 1.41, {silhueta: '#a78bfa'});
  boneco(g, w * 0.5, h * 1.32, h * 1.35, {silhueta: '#070914'});
  semSombra(g);
  g.fillStyle = '#f2622e';
  g.font = `900 ${h * 0.26}px Montserrat`;
  g.textAlign = 'center';
  g.textBaseline = 'middle';
  g.fillText('?', w * 0.5, h * 0.36);
  for (let i = 0; i < 19; i++) {
    const a = Math.abs(Math.sin(f / 3 + i * 1.1) * Math.cos(f / 7 + i * 0.6)) * h * 0.14 + 6;
    g.fillStyle = '#f2622e';
    g.beginPath();
    g.roundRect(w * 0.12 + i * w * 0.04, h * 0.88 - a / 2, w * 0.022, a, 5);
    g.fill();
  }
};

// ---- Recortes em pé, com fundo transparente ----
export const recorteFalando = (g: G, w: number, h: number, f: number) => {
  g.clearRect(0, 0, w, h);
  boneco(g, w * 0.5, h * 0.97, h * 0.92, {
    boca: Math.abs(Math.sin(f * 0.9)),
    cabeca: Math.sin(f / 6) * 0.06,
    bracoD: 0.75 + Math.sin(f / 5) * 0.4,
    bracoE: 0.2 + Math.sin(f / 7 + 1) * 0.15,
    roupa: '#e8e2d6',
  });
};
export const recorteComemora = (g: G, w: number, h: number, f: number) => {
  g.clearRect(0, 0, w, h);
  const t = (f % 16) / 16;
  const pulo = Math.sin(t * Math.PI);
  boneco(g, w * 0.5, h * 0.97 - pulo * h * 0.14, h * 0.78, {bracoE: 2.6, bracoD: 2.6, boca: 1, achata: t < 0.15 || t > 0.85 ? 0.85 : 1.05, roupa: '#e8e2d6', pernaE: -pulo * 0.3, pernaD: pulo * 0.3});
};

// Tira a maior parte da saturação de uma cena de papel e puxa para o tom do vídeo.
const acalmar = (g: G, w: number, h: number) => {
  semSombra(g);
  g.save();
  g.globalCompositeOperation = 'saturation';
  g.fillStyle = 'rgba(128,128,128,0.72)';
  g.fillRect(0, 0, w, h);
  g.globalCompositeOperation = 'soft-light';
  g.fillStyle = 'rgba(242,98,46,0.22)';
  g.fillRect(0, 0, w, h);
  g.globalCompositeOperation = 'multiply';
  g.fillStyle = 'rgba(40,44,50,0.28)';
  g.fillRect(0, 0, w, h);
  g.restore();
};
export const cenaCorteCalma = (g: G, w: number, h: number, f: number) => {
  cenaCorte(g, w, h, f);
  acalmar(g, w, h);
};
export const cenaLongoCalma = (g: G, w: number, h: number, f: number) => {
  cenaLongo(g, w, h, f);
  acalmar(g, w, h);
};
export const cenaDarkCalma = (g: G, w: number, h: number, f: number) => {
  cenaDark(g, w, h, f);
  // aqui só tira a saturação: a cena já é escura e não pode escurecer mais
  semSombra(g);
  g.save();
  g.globalCompositeOperation = 'saturation';
  g.fillStyle = 'rgba(128,128,128,0.6)';
  g.fillRect(0, 0, w, h);
  g.globalCompositeOperation = 'screen';
  g.fillStyle = 'rgba(70,60,90,0.35)';
  g.fillRect(0, 0, w, h);
  g.restore();
};

const fundoMonitor = (g: G, w: number, h: number, forca = 0.2) => {
  semSombra(g);
  g.fillStyle = '#060708';
  g.fillRect(0, 0, w, h);
  const luz = g.createRadialGradient(w * 0.8, h * 0.82, 0, w * 0.8, h * 0.82, w * 0.5);
  luz.addColorStop(0, `rgba(242,98,46,${forca})`);
  luz.addColorStop(1, 'rgba(242,98,46,0)');
  g.fillStyle = luz;
  g.fillRect(0, 0, w, h);
};

// ---- Monitor de programa: mostra o que está sendo editado ----
// f é o quadro da cena; "corte" é o quadro em que acontece o corte.
export const cenaPrograma = (g: G, w: number, h: number, f: number) => {
  const k = w / 1920;
  fundoMonitor(g, w, h, 0.14);
  // o "vídeo": um quadro com o símbolo no centro, aproximando devagar
  const z = 1 + (f % 400) * 0.0006;
  g.save();
  g.translate(w / 2, h / 2);
  g.scale(z, z);
  g.fillStyle = '#111417';
  g.beginPath();
  g.roundRect(-w * 0.33, -h * 0.33, w * 0.66, h * 0.66, 22 * k);
  g.fill();
  g.strokeStyle = '#f5f2ec';
  g.lineCap = 'round';
  g.lineWidth = 15 * k;
  [1, 0.74, 0.92, 0.7, 1, 0.76, 0.9, 0.72, 1, 0.74, 0.88, 0.72].forEach((r, i) => {
    const a = (i / 12) * Math.PI * 2 + 0.1 + f * 0.004;
    g.beginPath();
    g.moveTo(Math.cos(a) * 26 * k, Math.sin(a) * 26 * k);
    g.lineTo(Math.cos(a) * 150 * r * k, Math.sin(a) * 150 * r * k);
    g.stroke();
  });
  g.restore();
  // marcas de canto, nome e relógio
  g.strokeStyle = '#59636b';
  g.lineWidth = 3 * k;
  [[70, 70, 1, 1], [1850, 70, -1, 1], [70, 1010, 1, -1], [1850, 1010, -1, -1]].forEach(([x, y, dx, dy]) => {
    g.beginPath();
    g.moveTo((x + 46 * dx) * k, y * k);
    g.lineTo(x * k, y * k);
    g.lineTo(x * k, (y + 46 * dy) * k);
    g.stroke();
  });
  g.fillStyle = '#8a949c';
  g.font = `600 ${30 * k}px monospace`;
  g.textAlign = 'left';
  g.textBaseline = 'middle';
  g.fillText('PROGRAMA', 110 * k, 110 * k);
  g.fillStyle = '#f5f2ec';
  g.font = `600 ${44 * k}px monospace`;
  const seg = Math.floor(f / 30);
  g.fillText(`00:00:${String(seg).padStart(2, '0')}:${String(f % 30).padStart(2, '0')}`, 110 * k, 970 * k);
  if (f >= 119 && f <= 123) {
    g.fillStyle = `rgba(255,255,255,${0.8 - (f - 119) * 0.18})`;
    g.fillRect(0, 0, w, h);
  }
};

// ---- Monitor na palavra "animação": uma linha se desenha e a câmera segue a ponta ----
const caminhoLinha = (u: number): [number, number] => {
  const x = 330 + u * 1750;
  const onda = Math.sin(u * 8.5) * 46 * (1 - Math.min(1, u * 1.5)) + u * 30;
  const sobe = u > 0.5 ? Math.pow((u - 0.5) / 0.5, 2.3) * 1150 : 0;
  return [x, 640 - onda - sobe];
};
export const cenaLinha = (g: G, w: number, h: number, t: number) => {
  const k = w / 1920;
  const v = Math.max(0, Math.min(1, t / 33));
  const p = v < 0.5 ? 2 * v * v : 1 - Math.pow(-2 * v + 2, 2) / 2;
  const [hx, hy] = caminhoLinha(p);
  fundoMonitor(g, w, h, 0.16 + p * 0.3);
  const camX = Math.max(0, hx - 1180);
  const camY = Math.min(0, hy - 430);
  g.save();
  g.scale(k, k);
  g.translate(-camX, -camY);
  // pontinhos de fundo
  g.fillStyle = 'rgba(255,255,255,0.16)';
  for (let i = 0; i < 90; i++) {
    const x = ((i * 263.7) % 2800) - 200;
    const y = ((i * 149.3) % 2300) - 1300;
    g.fillRect(x, y, 4, 4);
  }
  // linha de base tracejada: o vídeo parado
  g.strokeStyle = 'rgba(245,242,236,0.5)';
  g.lineWidth = 4;
  g.setLineDash([26, 20]);
  g.beginPath();
  g.moveTo(-200, 640);
  g.lineTo(3200, 640);
  g.stroke();
  g.setLineDash([]);
  g.fillStyle = 'rgba(245,242,236,0.55)';
  g.font = '500 34px monospace';
  g.textAlign = 'left';
  g.textBaseline = 'alphabetic';
  g.fillText('parado', 250, 610);
  // a linha
  const n = Math.max(2, Math.round(p * 160));
  const tracar = () => {
    g.beginPath();
    for (let i = 0; i <= n; i++) {
      const [x, y] = caminhoLinha((i / n) * p);
      if (i === 0) g.moveTo(x, y);
      else g.lineTo(x, y);
    }
  };
  g.lineCap = 'round';
  g.lineJoin = 'round';
  g.shadowColor = '#f2622e';
  g.shadowBlur = 38;
  g.strokeStyle = '#f2622e';
  g.lineWidth = 11;
  tracar();
  g.stroke();
  g.shadowBlur = 0;
  g.strokeStyle = '#ffc9a3';
  g.lineWidth = 4;
  tracar();
  g.stroke();
  // pontos-chave
  [0, 0.14, 0.3, 0.46, 0.66, 0.84].forEach((u) => {
    if (p < u) return;
    const [x, y] = caminhoLinha(u);
    const cresce = Math.min(1, (p - u) * 14);
    g.fillStyle = '#f5f2ec';
    g.beginPath();
    g.arc(x, y, 11 * cresce, 0, Math.PI * 2);
    g.fill();
  });
  // a ponta
  g.fillStyle = 'rgba(242,98,46,0.35)';
  g.beginPath();
  g.arc(hx, hy, 40, 0, Math.PI * 2);
  g.fill();
  g.shadowColor = '#f2622e';
  g.shadowBlur = 30;
  g.fillStyle = '#ffffff';
  g.beginPath();
  g.arc(hx, hy, 15, 0, Math.PI * 2);
  g.fill();
  g.shadowBlur = 0;
  g.restore();
  // o texto fica preso na tela, não na linha
  const palavra = (txt: string, x: number, y: number, cor: string, de: number, tam: number, peso = 900) => {
    const a = Math.max(0, Math.min(1, (t - de) / 6));
    if (a <= 0) return 0;
    g.save();
    g.globalAlpha = a;
    g.font = `${peso} ${tam * k}px Montserrat`;
    g.textAlign = 'left';
    g.textBaseline = 'alphabetic';
    if (cor !== '#f5f2ec') {
      g.shadowColor = cor;
      g.shadowBlur = 34 * k;
    }
    g.fillStyle = cor;
    g.fillText(txt, x * k, (y + (1 - a) * 26) * k);
    const larg = g.measureText(txt).width / k;
    g.restore();
    return larg;
  };
  palavra('cada', 210, 300, '#f5f2ec', 5, 150);
  g.font = `900 ${150 * k}px Montserrat`;
  const largCada = g.measureText('cada ').width / k;
  palavra('animação', 210 + largCada, 300, '#f2622e', 11, 150);
  palavra('desenhada em código', 216, 380, '#f5f2ec', 19, 60, 600);
};
