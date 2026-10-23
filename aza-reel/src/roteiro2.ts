// Linha do tempo da versão 2 do Reel (segundos). Sem locução por enquanto: quando o áudio chegar, é aqui que se reencaixa.
// "fala" é o texto sugerido para a locução (frases do próprio site).
export const DUR2 = 38.5;
export const CENAS2 = {
  logo:    { a: -1,   b: 3.4,  fala: "Movimento que veste presença." },
  site:    { a: 3.1,  b: 13.4, fala: "Digite useaza.com.br e conheça o novo site da AZA." },
  prom:    { a: 13.1, b: 18.4, fala: "Valoriza sua silhueta. Feito para durar." },
  cards:   { a: 18.1, b: 23.1, fala: "Uma peça, inúmeras possibilidades." },
  compra:  { a: 22.8, b: 31.6, fala: "Escolha o tamanho, adicione à sacola e finalize." },
  disp:    { a: 31.3, b: 35.2, fala: "No computador ou no celular." },
  final:   { a: 34.9, b: 38.5, fala: "useaza.com.br" },
} as const;
