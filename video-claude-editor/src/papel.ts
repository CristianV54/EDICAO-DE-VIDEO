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
  g.fillStyle = '#0b1026';
  g.fillRect(0, 0, w, h);
  sombra(g);
  peca(g, '#e2e8f0', () => g.arc(w * 0.78, h * 0.2, h * 0.09, 0, Math.PI * 2));
  for (let i = 0; i < 7; i++) {
    const x = i * w * 0.15 - 10;
    const alt = h * (0.28 + ((i * 37) % 5) * 0.06);
    peca(g, '#111a3a', () => g.rect(x, h * 0.9 - alt, w * 0.13, alt), false);
    semSombra(g);
    for (let j = 0; j < 6; j++) {
      if ((i * 7 + j * 3 + Math.floor(f / 9)) % 4 === 0) {
        g.fillStyle = '#fbbf24';
        g.fillRect(x + 10 + (j % 2) * w * 0.055, h * 0.9 - alt + 14 + Math.floor(j / 2) * h * 0.07, w * 0.035, h * 0.035);
      }
    }
    sombra(g);
  }
  boneco(g, w * 0.5, h * 1.02, h * 0.86, {silhueta: '#05070f'});
  semSombra(g);
  g.fillStyle = '#f2622e';
  g.font = `900 ${h * 0.2}px Montserrat`;
  g.textAlign = 'center';
  g.textBaseline = 'middle';
  g.fillText('?', w * 0.5, h * 0.44);
  for (let i = 0; i < 19; i++) {
    const a = Math.abs(Math.sin(f / 3 + i * 1.1) * Math.cos(f / 7 + i * 0.6)) * h * 0.1 + 5;
    g.fillStyle = '#f2622e';
    g.beginPath();
    g.roundRect(w * 0.12 + i * w * 0.04, h * 0.92 - a / 2, w * 0.02, a, 4);
    g.fill();
  }
};

// ---- Recortes em pé, com fundo transparente ----
export const recorteFalando = (g: G, w: number, h: number, f: number) => {
  g.clearRect(0, 0, w, h);
  boneco(g, w * 0.5, h * 0.97, h * 0.92, {
    boca: Math.abs(Math.sin(f * 0.9)),
    cabeca: Math.sin(f / 6) * 0.06,
    bracoD: 1.2 + Math.sin(f / 5) * 0.5,
    bracoE: 0.3 + Math.abs(Math.sin(f / 8)) * 0.4,
    roupa: '#2563eb',
  });
};
export const recorteComemora = (g: G, w: number, h: number, f: number) => {
  g.clearRect(0, 0, w, h);
  const t = (f % 16) / 16;
  const pulo = Math.sin(t * Math.PI);
  boneco(g, w * 0.5, h * 0.97 - pulo * h * 0.14, h * 0.78, {bracoE: 2.6, bracoD: 2.6, boca: 1, achata: t < 0.15 || t > 0.85 ? 0.85 : 1.05, roupa: '#2563eb', pernaE: -pulo * 0.3, pernaD: pulo * 0.3});
};
