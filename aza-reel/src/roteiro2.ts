// Linha do tempo da versão 2 do Reel (segundos). Sem locução por enquanto: quando o áudio chegar, é aqui que se reencaixa.
// "fala" é o texto sugerido para a locução (frases do próprio site).
export const DUR2 = 44.3;
export const CENAS2 = {
  logo:    { a: -1,   b: 3.4,  fala: "Movimento que veste presença." },
  site:    { a: 3.1,  b: 13.4, fala: "Agora você pode comprar pelo site da AZA: useaza.com.br." },
  prom:    { a: 13.1, b: 18.4, fala: "Valoriza sua silhueta. Feito para durar." },
  cards:   { a: 18.1, b: 23.1, fala: "Uma peça, inúmeras possibilidades." },
  jornada: { a: 22.8, b: 37.4, fala: "Filtre pelo seu tamanho e cor, escolha a peça, adicione ao carrinho e finalize." },
  disp:    { a: 37.1, b: 41.0, fala: "No computador ou no celular." },
  final:   { a: 40.7, b: 44.3, fala: "Compre pelo site: useaza.com.br" },
} as const;
