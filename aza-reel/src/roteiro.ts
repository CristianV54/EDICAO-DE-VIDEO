// Linha do tempo do Reel (segundos). Sem locução por enquanto: quando o áudio chegar, é aqui que se reencaixa.
// "fala" é o texto sugerido para a locução (frases do próprio site); "ini" é o instante em que a ideia entra na tela.
export const DUR_TOTAL = 35;
export const CENAS = {
  logo:   { a: 0.0,  b: 4.4,  fala: "Movimento que veste presença." },
  site:   { a: 4.1,  b: 9.9,  fala: "Do movimento à cidade." },
  cards:  { a: 9.6,  b: 16.9, fala: "Uma peça, inúmeras possibilidades." },
  texto:  { a: 16.6, b: 22.9, fala: "Valoriza sua silhueta. Feito para durar." },
  compra: { a: 22.6, b: 28.9, fala: "Feito para o seu momento." },
  recuo:  { a: 28.6, b: 32.9, fala: "Siga @useazabr e conheça o novo site." },
  final:  { a: 32.6, b: 35.0, fala: "useaza.com.br" },
} as const;
