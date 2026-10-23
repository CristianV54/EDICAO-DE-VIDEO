// Linha do tempo do Reel (segundos). Sem locução por enquanto: quando o áudio chegar, é aqui que se reencaixa.
// "fala" é o texto sugerido para a locução (frases do próprio site).
export const DUR_TOTAL = 29;
export const CENAS = {
  logo:   { a: 0.0,  b: 2.5,  fala: "Movimento que veste presença." },
  site:   { a: 2.2,  b: 8.0,  fala: "Conheça o novo site da AZA." },
  cards:  { a: 7.7,  b: 12.5, fala: "Uma peça, inúmeras possibilidades." },
  texto:  { a: 12.2, b: 16.6, fala: "Valoriza sua silhueta. Feito para durar." },
  compra: { a: 16.3, b: 22.2, fala: "Feito para o seu momento." },
  recuo:  { a: 21.9, b: 26.0, fala: "Siga @useazabr." },
  final:  { a: 25.7, b: 29.0, fala: "useaza.com.br" },
} as const;
