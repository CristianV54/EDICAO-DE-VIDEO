import { Easing } from "remotion";
export const FPS = 30;
export const W = 1080;
export const H = 1920;
// rosa da marca: matiz 332 medido nas fotos do ensaio; claro o bastante para ler sobre fundo grafite
export const C = {
  fundo: "#141315", painel: "#1e1c20", borda: "rgba(255,255,255,0.12)",
  rosa: "hsl(332 82% 68%)", rosaEsc: "hsl(332 70% 48%)", rosaClaro: "hsl(332 90% 82%)",
  offwhite: "#f4f1ec", dim: "rgba(244,241,236,0.55)",
};
export const SERIF = "Cormorant, 'Times New Roman', serif";
export const SANS = "Inter, sans-serif";
export const clamp = (x: number, a = 0, b = 1) => Math.min(b, Math.max(a, x));
export const expoOut = Easing.bezier(0.16, 1, 0.3, 1);
export const suave = Easing.bezier(0.45, 0, 0.15, 1);
export const pr = (t: number, ini: number, dur: number, e: (x: number) => number = expoOut) => e(clamp((t - ini) / Math.max(0.0001, dur)));
export const mix = (a: number, b: number, p: number) => a + (b - a) * p;
