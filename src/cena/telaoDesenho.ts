import { random } from "remotion";

// Desenha os 8 estados do telao (1024 x 680). Cada estado e desenhado uma vez e guardado em cache.
export type EstadoTelao = "auto" | "manual" | "escura" | "cinquenta" | "corrompida" | "restaurada" | "festa_granulada" | "festa_flash";
export const W = 1024;
export const H = 680;

const novoCanvas = () => {
  const c = document.createElement("canvas");
  c.width = W;
  c.height = H;
  return c;
};

// ---------- cenas ----------
const igreja = (g: CanvasRenderingContext2D, quente: boolean) => {
  g.fillStyle = quente ? "#E9CFA3" : "#B9A98A";
  g.fillRect(0, 0, W, H);
  // janelas de vitral
  for (const x of [170, 512, 854]) {
    g.fillStyle = quente ? "#F3A26B" : "#A87C5A";
    g.beginPath();
    g.moveTo(x - 80, 360);
    g.lineTo(x - 80, 170);
    g.arc(x, 170, 80, Math.PI, 0);
    g.lineTo(x + 80, 360);
    g.closePath();
    g.fill();
    g.fillStyle = quente ? "#7FB8E6" : "#6F8FA8";
    g.fillRect(x - 12, 100, 24, 260);
  }
  // arcos
  g.strokeStyle = quente ? "#B07A4A" : "#7A5C3C";
  g.lineWidth = 26;
  for (const x of [0, 341, 682, 1024]) {
    g.beginPath();
    g.moveTo(x, 420);
    g.lineTo(x, 120);
    g.stroke();
  }
  // piso
  g.fillStyle = quente ? "#C99A6A" : "#8F6C48";
  g.fillRect(0, 440, W, H - 440);
  // bancos
  g.fillStyle = quente ? "#8B5E3C" : "#5E3F28";
  for (let i = 0; i < 4; i++) {
    const y = 470 + i * 52;
    g.fillRect(40 - i * 10, y, 280 + i * 20, 34);
    g.fillRect(W - 320 - i * 10, y, 280 + i * 20, 34);
  }
};

const festa = (g: CanvasRenderingContext2D, vivo: boolean) => {
  const grad = g.createLinearGradient(0, 0, 0, H);
  grad.addColorStop(0, "#14194A");
  grad.addColorStop(1, "#0B0E2E");
  g.fillStyle = grad;
  g.fillRect(0, 0, W, H);
  const cores = ["#FF3DA5", "#2FD6FF", "#FFD25A", "#7B4DEB", "#3DDC84"];
  g.save();
  g.filter = "blur(26px)";
  for (let i = 0; i < 14; i++) {
    g.fillStyle = cores[i % cores.length];
    g.globalAlpha = vivo ? 0.9 : 0.55;
    g.beginPath();
    g.arc(random(`festa-x-${i}`) * W, 80 + random(`festa-y-${i}`) * 380, 50 + random(`festa-r-${i}`) * 60, 0, Math.PI * 2);
    g.fill();
  }
  g.restore();
  g.fillStyle = "#1A1F55";
  g.fillRect(0, 470, W, H - 470);
};

const casal = (g: CanvasRenderingContext2D, cx: number, base: number, esc: number, cores: { vestido: string; terno: string; pele: string; cabeloA: string; cabeloB: string }) => {
  g.save();
  g.translate(cx, base);
  g.scale(esc, esc);
  // noiva
  g.fillStyle = cores.vestido;
  g.beginPath();
  g.moveTo(-110, 0);
  g.lineTo(-30, 0);
  g.lineTo(-50, -170);
  g.lineTo(-90, -170);
  g.closePath();
  g.fill();
  g.fillStyle = cores.pele;
  g.beginPath();
  g.arc(-70, -215, 40, 0, Math.PI * 2);
  g.fill();
  g.fillStyle = cores.cabeloA;
  g.beginPath();
  g.arc(-70, -232, 40, Math.PI, 0);
  g.fill();
  g.beginPath();
  g.arc(-70, -278, 18, 0, Math.PI * 2);
  g.fill();
  // noivo
  g.fillStyle = cores.terno;
  g.fillRect(20, -180, 80, 180);
  g.fillStyle = "#D4A537";
  g.fillRect(55, -170, 10, 70);
  g.fillStyle = cores.pele;
  g.beginPath();
  g.arc(60, -225, 38, 0, Math.PI * 2);
  g.fill();
  g.fillStyle = cores.cabeloB;
  g.beginPath();
  g.arc(60, -240, 38, Math.PI, 0);
  g.fill();
  g.restore();
};

const CASAL_CLARO = { vestido: "#FFFFFF", terno: "#1F2A44", pele: "#E8B48A", cabeloA: "#5A3A26", cabeloB: "#2C2018" };

const selo = (g: CanvasRenderingContext2D, texto: string, x: number, y: number, cor: string) => {
  g.font = "900 44px Montserrat";
  const w = g.measureText(texto).width + 50;
  g.fillStyle = cor;
  g.beginPath();
  g.roundRect(x - w / 2, y - 34, w, 68, 22);
  g.fill();
  g.fillStyle = "#FFFFFF";
  g.textAlign = "center";
  g.textBaseline = "middle";
  g.fillText(texto, x, y + 2);
};

// ---------- estados ----------
const desenhar: Record<EstadoTelao, (g: CanvasRenderingContext2D) => void> = {
  auto: (g) => {
    const tmp = novoCanvas();
    const t = tmp.getContext("2d")!;
    t.fillStyle = "#9AA3AD";
    t.fillRect(0, 0, W, H);
    t.fillStyle = "#8C95A0";
    t.fillRect(0, 470, W, H - 470);
    casal(t, 512, 560, 1.35, CASAL_CLARO);
    g.filter = "saturate(0.4) contrast(0.75)";
    g.drawImage(tmp, 0, 0);
    g.filter = "none";
    selo(g, "AUTO", 900, 60, "#3B4048");
  },
  manual: (g) => {
    const grad = g.createLinearGradient(0, 0, 0, H);
    grad.addColorStop(0, "#F6C28B");
    grad.addColorStop(1, "#F29E7E");
    g.fillStyle = grad;
    g.fillRect(0, 0, W, H);
    g.fillStyle = "#FFE9A8";
    g.beginPath();
    g.arc(760, 300, 110, 0, Math.PI * 2);
    g.fill();
    g.fillStyle = "#D9774F";
    g.fillRect(0, 480, W, H - 480);
    casal(g, 512, 580, 1.4, CASAL_CLARO);
  },
  escura: (g) => {
    igreja(g, false);
    casal(g, 512, 590, 1.35, { ...CASAL_CLARO, vestido: "#C9C9C9" });
    g.fillStyle = "rgba(0,0,0,0.7)";
    g.fillRect(0, 0, W, H);
  },
  cinquenta: (g) => {
    const fundo = novoCanvas();
    igreja(fundo.getContext("2d")!, true);
    g.filter = "blur(14px)";
    g.drawImage(fundo, -20, -20, W + 40, H + 40);
    g.filter = "none";
    casal(g, 512, 600, 1.45, CASAL_CLARO);
  },
  corrompida: (g) => {
    desenharBase(g, "cinquenta");
    const base = novoCanvas();
    base.getContext("2d")!.drawImage(g.canvas, 0, 0);
    for (let i = 0; i < 8; i++) {
      const y = Math.floor(random(`glitch-y-${i}`) * (H - 60));
      const h = 24 + Math.floor(random(`glitch-h-${i}`) * 40);
      const dx = (random(`glitch-dx-${i}`) > 0.5 ? 1 : -1) * (20 + random(`glitch-d-${i}`) * 40);
      g.drawImage(base, 0, y, W, h, dx, y, W, h);
    }
    for (let i = 0; i < 6; i++) {
      g.fillStyle = i % 2 === 0 ? "#FF2BD6" : "#2BFF6A";
      g.fillRect(random(`glitch-rx-${i}`) * (W - 200), random(`glitch-ry-${i}`) * (H - 80), 80 + random(`glitch-rw-${i}`) * 120, 16 + random(`glitch-rh-${i}`) * 40);
    }
  },
  restaurada: (g) => {
    desenharBase(g, "cinquenta");
    selo(g, "SLOT 2", 860, 620, "#2BB673");
  },
  festa_granulada: (g) => {
    festa(g, false);
    casal(g, 512, 600, 1.35, { vestido: "#8A8FA8", terno: "#10142E", pele: "#9A7B66", cabeloA: "#2A2220", cabeloB: "#14100E" });
    g.fillStyle = "rgba(0,0,0,0.4)";
    g.fillRect(0, 0, W, H);
    for (let i = 0; i < 6000; i++) {
      const v = 90 + Math.floor(random(`ruido-v-${i}`) * 140);
      g.fillStyle = `rgb(${v},${v},${v})`;
      g.fillRect(random(`ruido-x-${i}`) * W, random(`ruido-y-${i}`) * H, 3, 3);
    }
  },
  festa_flash: (g) => {
    festa(g, true);
    casal(g, 512, 600, 1.4, CASAL_CLARO);
  },
};

const desenharBase = (g: CanvasRenderingContext2D, e: EstadoTelao) => desenhar[e](g);

export const criarCanvasTelao = (e: EstadoTelao): HTMLCanvasElement => {
  const c = novoCanvas();
  desenhar[e](c.getContext("2d")!);
  return c;
};
export const ESTADOS: EstadoTelao[] = ["auto", "manual", "escura", "cinquenta", "corrompida", "restaurada", "festa_granulada", "festa_flash"];
