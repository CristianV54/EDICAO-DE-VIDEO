import React from 'react';
import {Abertura, Cena, Plano, Som} from '../motor/motor';
import {PCartoes, PComparar, PFrase, PPasta, PPastaDentro, PTerminal} from '../motor/planosA';
import {PComandos, PContador, PEditores, PEntrePalavras, PLista, PMapa, POnda, PSilencio} from '../motor/planosB';
import {PCapturas, PCodigo, PComentarios, PConfere, PConta, PDezCortes, PEscada, PEscadaFinal, PExportar, PInscrever, PLinhaVideo, PQuadros, PRepetidas, PVersoes} from '../motor/planosC';

// O vídeo, cena por cena. Cada plano cobre algumas frases da narração (os números são os índices das frases
// em audio/cenaNN_palavras.json) e diz qual peça de animação aparece e quais sons acompanham.
// Regras de som (do estudo do earshot): nem todo evento tem som, whoosh é raro, e o mesmo som nunca repete seguido.

// algumas teclas de digitação a partir de um ponto (a maior parte da digitação fica muda, como em vídeo profissional)
const teclas = (base: string, n = 9, passo = 5): Som[] => Array.from({length: n}).map((_, i) => ['tecla', `${base}+${4 + i * passo}`] as Som);
// abertura em 3D de um passo: o mascote pula para o degrau e a câmera mergulha no número
const abre = (passo: number, nome: string): Abertura => ({
  C: PEscada as Plano['C'],
  props: {passo, nome},
  dur: 78,
  sons: [
    ['passo', 30],
    ['whoosh_grave', 52],
    ['batida', 68],
  ],
});
const F = PFrase as Plano['C'];

// ---------------- Cena 2 · Passo 1: Preparar ----------------
const C2: Plano[] = [
  {frases: [0, 2], C: PComparar as Plano['C'], props: {chatEm: 0, codeEm: 2}, troca: 'corte', brilho: [70, 30], sons: [['estalo', 'f1+18'], ['estalo', 'f1+44'], ['deslize', 'f2-2']]},
  {frases: [3, 5], C: PTerminal as Plano['C'], props: {rotulo: 'DENTRO DE UMA PASTA DO SEU COMPUTADOR', linhas: [['abrindo arquivos', 'abro'], ['instalando programas', 'instalo'], ['executando comandos', 'executo']]}, troca: 'desliza', sons: [['tique', 'f2+4'], ['tique', 'f2+34'], ['tique', 'f2+62']]},
  {frases: [6, 6], C: F, props: {texto: 'você pede, | eu *faço'}, troca: 'zoom', sons: [['batida', 'f0+26']]},
  {frases: [7, 7], C: F, props: {texto: 'três *movimentos', etiqueta: 'A PREPARAÇÃO'}, troca: 'sobe'},
  {frases: [8, 10], C: PCartoes as Plano['C'], props: {etiqueta: '01', cartoes: [{titulo: 'Instale o aplicativo do Claude', sub: 'e abra a aba Code'}, {titulo: 'Planos pagos', sub: 'o link está na descrição', selo: 'Pro'}], quando: [1, 2], colunas: 2, foco: false}, troca: 'desliza', brilho: [20, 70], sons: [['estalo_madeira', 'f1+2'], ['estalo_madeira', 'f2+2']]},
  {frases: [11, 12], C: PPasta as Plano['C'], props: {criar: 1, arrastar: 1}, troca: 'desliza', sons: [['estalo', 'f1+6'], ['gaveta', 'f1+80']]},
  {frases: [13, 15], C: PTerminal as Plano['C'], props: {rotulo: '03 · O PRIMEIRO PEDIDO', pedido: 'prepare esta pasta para edição de vídeo', pedidoEm: 2}, troca: 'desliza', sons: teclas('f2', 10)},
  {frases: [16, 17], C: PTerminal as Plano['C'], props: {rotulo: 'A PARTIR DAQUI, EU ASSUMO', linhas: [['instalando Whisper', 'instalo'], ['instalando auto-editor', 'ferramentas'], ['instalando FFmpeg', 'conhecer'], ['instalando Remotion', 'passos'], ['organizando a pasta', 'organizo']]}, troca: 'zoom', brilho: [26, 26], sons: [['tique', 'f1+4'], ['tique', 'f1+40'], ['tique', 'f1+80'], ['sucesso', 'f1+150']]},
  {frases: [18, 22], C: PPastaDentro as Plano['C'], props: {dividir: 0, travar: 2, novo: 3}, troca: 'desliza', sons: [['estalo', 'f0+2'], ['estalo', 'f0+18'], ['estalo', 'f0+36'], ['gaveta', 'f2+4', -3], ['estalo_madeira', 'f3+8']]},
  {frases: [23, 25], C: PCartoes as Plano['C'], props: {etiqueta: 'AS QUATRO FERRAMENTAS', cartoes: [{titulo: 'Whisper', selo: 'grátis'}, {titulo: 'auto-editor', selo: 'grátis'}, {titulo: 'FFmpeg', selo: 'grátis'}, {titulo: 'Remotion', selo: 'grátis'}, {titulo: '?', sub: 'o que custa dinheiro: no final'}], quando: [1, 1, 1, 1, 2], colunas: 5, foco: false, tamTitulo: 44}, troca: 'sobe', brilho: [80, 30], sons: [['estalo', 'f1+2'], ['estalo', 'f1+7'], ['estalo', 'f1+12'], ['estalo', 'f1+17'], ['brilho', 'f2+2', -4]]},
  {frases: [26, 28], C: F, props: {texto: 'eu ainda não sei | o que tem *dentro | do seu vídeo', etiqueta: 'UM PROBLEMA', tam: 112, sub: 'é isso que o passo 2 resolve', subEm: 150}, troca: 'zoom', sons: [['subida', 'f2+50', -3]]},
];

// ---------------- Cena 3 · Passo 2: Entender ----------------
const C3: Plano[] = [
  {frases: [0, 2], C: F, props: {texto: 'eu não *assisto. | eu *leio.', etiqueta: 'O SEGREDO', tam: 150}, troca: 'corte', sons: [['batida', 'f2+2']]},
  {frases: [3, 7], C: POnda as Plano['C'], props: {varrer: 2, tempos: 4, rotulo: 'WHISPER · GRATUITO · RODA NO SEU COMPUTADOR'}, troca: 'desliza', brilho: [30, 30], sons: [['deslize', 'f2+4'], ['tique', 'f4+6'], ['tique', 'f4+20'], ['tique', 'f4+34'], ['tique', 'f4+48']]},
  {frases: [8, 10], C: PTerminal as Plano['C'], props: {rotulo: 'VOCÊ ESCREVE', pedido: 'transcreva este vídeo palavra por palavra', pedidoEm: 1, linhas: [['1 hora de vídeo virou texto', 2]]}, troca: 'desliza', sons: [...teclas('f1', 10), ['sucesso', 'f2+60']]},
  {frases: [11, 15], C: PMapa as Plano['C'], props: {erro: 1, silencio: 2, bom: 3, forte: 4}, troca: 'zoom', brilho: [78, 28], sons: [['corte', 'f1+6'], ['desliga', 'f2+6'], ['estalo_madeira', 'f3+6'], ['brilho', 'f4+6']]},
  {frases: [16, 16], C: PCapturas as Plano['C'], troca: 'desliza', sons: [['camera', 'f0+56'], ['camera', 'f0+72'], ['camera', 'f0+88']]},
  {frases: [17, 18], C: PMapa as Plano['C'], props: {erro: 0, silencio: 0, bom: 0, forte: 0, legenda: 1, rotulo: 'O MAPA DO SEU VÍDEO'}, troca: 'zoom', sons: [['estalo', 'f1+4'], ['estalo', 'f1+34'], ['estalo', 'f1+58']]},
  {frases: [19, 20], C: F, props: {texto: 'um vídeo | ou *cinquenta', sub: 'o pedido é o mesmo', subEm: 80}, troca: 'sobe', sons: [['batida', 'f0+52']]},
  {frases: [21, 21], C: F, props: {texto: 'cortar vira | a parte *fácil'}, troca: 'zoom'},
];

// ---------------- Cena 4 · Passo 3: Cortar ----------------
const C4: Plano[] = [
  {frases: [0, 0], C: PCartoes as Plano['C'], props: {etiqueta: 'DUAS FERRAMENTAS FAZEM O CORTE', cartoes: [{n: '01', titulo: 'auto-editor', sub: 'tira o silêncio'}, {n: '02', titulo: 'FFmpeg', sub: 'corta e junta'}], quando: [0, 0], colunas: 2, foco: false, tamTitulo: 80}, troca: 'corte', sons: [['estalo_madeira', 'f0+8'], ['estalo_madeira', 'f0+14']]},
  {frases: [1, 4], C: PSilencio as Plano['C'], props: {medir: 1, some: 3}, troca: 'desliza', brilho: [24, 72], sons: [['deslize', 'f1+8'], ['tique', 'f2+4'], ['tique', 'f2+54'], ['tique', 'f2+104'], ['whoosh', 'f3+6'], ['estalo', 'f3+18']]},
  {frases: [5, 9], C: PComandos as Plano['C'], troca: 'desliza', brilho: [78, 30], sons: [['tecla', 'f2+4'], ['tecla', 'f2+40'], ['tecla', 'f2+66'], ['tecla', 'f2+92']]},
  {frases: [10, 13], C: PLista as Plano['C'], props: {itens: [['02:14', 'erro: frase repetida'], ['07:02', 'repetição'], ['11:40', 'silêncio de 6 s']], quando: [1, 2, 2], aprovar: 2}, troca: 'sobe', sons: [['estalo', 'f1+4'], ['estalo', 'f2+4'], ['estalo', 'f2+10'], ['clique', 'f2+96'], ['sucesso', 'f2+100']]},
  {frases: [14, 15], C: PEntrePalavras as Plano['C'], props: {cortar: 0, meio: 1}, troca: 'zoom', sons: [['corte', 'f0+108'], ['desliga', 'f1+2', -2]]},
  {frases: [16, 17], C: PContador as Plano['C'], props: {virar: 1}, troca: 'corte', sons: [['subida_forte', 'f1+52'], ['batida', 'f1+66']]},
  {frases: [18, 18], C: PEditores as Plano['C'], props: {entrega: 0}, troca: 'desliza', brilho: [28, 30], sons: [['deslize', 'f0+4'], ['estalo', 'f0+140'], ['estalo', 'f0+146'], ['estalo', 'f0+152'], ['estalo', 'f0+158'], ['estalo', 'f0+164']]},
  {frases: [19, 23], C: PVersoes as Plano['C'], props: {quando: [1, 2, 3, 3, 3], chaves: ['primeira', 'segunda']}, troca: 'zoom', sons: [['camera', 'f1+50'], ['camera', 'f2+10'], ['estalo', 'f3+4'], ['estalo', 'f3+12'], ['brilho', 'f3+20']]},
  {frases: [24, 24], C: PInscrever as Plano['C'], troca: 'sobe', sons: [['sucesso', 'f0+8']]},
  {frases: [25, 27], C: F, props: {texto: '*limpo | não é bom de assistir', tam: 120, sub: 'falta o que você está vendo agora', subEm: 130}, troca: 'zoom', sons: [['subida', 'f2+30', -3]]},
];

// ---------------- Cena 5 · Passo 4: Animar ----------------
const C5: Plano[] = [
  {frases: [0, 1], C: F, props: {texto: 'tudo que se mexe | é *código', etiqueta: 'NESTE VÍDEO', sub: 'personagem · linha do tempo · câmera', subEm: 84}, troca: 'corte', sons: [['batida', 'f0+52']]},
  {frases: [2, 3], C: F, props: {texto: '*Remotion', etiqueta: 'A FERRAMENTA', tam: 200, sub: 'transforma código em vídeo', subEm: 62}, troca: 'zoom', sons: [['revela', 'f0+38']]},
  {frases: [4, 5], C: PTerminal as Plano['C'], props: {rotulo: 'EM VEZ DE ARRASTAR COM O MOUSE, EU ESCREVO', linhas: [['o título entra no segundo 3', 'entra'], ['o título cresce', 'cresce'], ['a câmera se aproxima', 'aproxima']]}, troca: 'desliza', brilho: [26, 70], sons: [['tecla', 'f1+12'], ['tecla', 'f1+18'], ['tecla', 'f1+60'], ['tecla', 'f1+84']]},
  {frases: [6, 6], C: PQuadros as Plano['C'], troca: 'desliza', sons: [['tique', 'f0+14'], ['tique', 'f0+24'], ['tique', 'f0+34'], ['tique', 'f0+44'], ['sucesso', 'f0+78']]},
  {frases: [7, 10], C: PCodigo as Plano['C'], props: {mudar: 3}, troca: 'zoom', brilho: [76, 30], sons: [['estalo', 'f1+4'], ['estalo', 'f2+4'], ['tecla', 'f3+20'], ['deslize', 'f3+36']]},
  {frases: [11, 14], C: PCartoes as Plano['C'], props: {titulo: 'três coisas', cartoes: [{n: '01', titulo: 'Legendas palavra por palavra', sub: 'no tempo certo'}, {n: '02', titulo: 'Textos e gráficos', sub: 'na hora em que você fala'}, {n: '03', titulo: 'Mudanças em uma frase', sub: 'você pede, eu refaço'}], quando: [1, 2, 3], tamTitulo: 50}, troca: 'sobe', sons: [['estalo_madeira', 'f1+2'], ['estalo_madeira', 'f2+2'], ['estalo_madeira', 'f3+2']]},
  {frases: [15, 17], C: PComentarios as Plano['C'], props: {falas: ['não gostei da cor', 'quero a legenda maior'], chaves: ['cor', 'legenda'], corrige: 'refaço'}, troca: 'desliza', sons: [['estalo', 'f0+16'], ['estalo', 'f1+14'], ['sucesso', 'f2+36']]},
  {frases: [18, 20], C: F, props: {texto: 'você não precisa | entender o código. | precisa saber *descrever', tam: 96, sub: 'quanto mais claro o pedido, melhor a cena', subEm: 160}, troca: 'zoom'},
  {frases: [21, 22], C: F, props: {texto: 'da pasta | para o *mundo', etiqueta: 'FALTA SÓ UMA COISA'}, troca: 'sobe', sons: [['subida', 'f1+50', -3]]},
];

// ---------------- Cena 6 · Passo 5: Finalizar ----------------
const C6: Plano[] = [
  {frases: [0, 1], C: PTerminal as Plano['C'], props: {rotulo: 'VOCÊ ESCREVE', pedido: 'exporte o vídeo final', pedidoEm: 1}, troca: 'corte', sons: teclas('f1', 7)},
  {frases: [2, 2], C: PExportar as Plano['C'], props: {juntar: 0}, troca: 'desliza', brilho: [24, 30], sons: [['subida', 'f0+136', -2], ['sucesso', 'f0+140']]},
  {frases: [3, 5], C: PConfere as Plano['C'], props: {itens: 1, fotos: 2}, troca: 'sobe', sons: [['tique', 'f1+2'], ['tique', 'f1+22'], ['tique', 'f1+44'], ['camera', 'f2+30'], ['desliga', 'f2+104']]},
  {frases: [6, 8], C: F, props: {texto: 'você *assiste', etiqueta: 'A PARTE MAIS IMPORTANTE', tam: 180, sub: 'e me fala o que sentiu', subEm: 140}, troca: 'zoom', sons: [['batida', 'f1+8']]},
  {frases: [9, 9], C: PComentarios as Plano['C'], props: {falas: ['o começo está lento', 'esta parte ficou confusa', 'a música está alta aqui'], chaves: ['começo', 'parte', 'música'], corrige: 'corrijo'}, troca: 'desliza', brilho: [78, 70], sons: [['estalo', 'f0+2'], ['estalo', 'f0+56'], ['estalo', 'f0+104'], ['sucesso', 'f0+150']]},
  {frases: [10, 14], C: PVersoes as Plano['C'], props: {quando: [0, 0, 0, 0, 0], rotulos: ['linha do tempo deitada', 'câmera parada', 'cor demais', '3D em tudo', 'a atual'], chavesRotulo: ['deitada', 'parada', 'cor']}, troca: 'zoom', sons: [['camera', 'f0+10'], ['estalo', 'f2+4'], ['estalo', 'f3+4'], ['estalo', 'f4+4']]},
  {frases: [15, 16], C: F, props: {texto: 'eu não *adivinho. | eu *aprendo.', tam: 140}, troca: 'sobe'},
  {frases: [17, 18], C: F, props: {texto: 'o *gosto é seu', tam: 170, sub: 'quem decide se o vídeo está bom é você', subEm: 74}, troca: 'zoom', sons: [['batida', 'f0+40']]},
  {frases: [19, 20], C: PCartoes as Plano['C'], props: {etiqueta: 'O QUE VAI EM VOLTA DO VÍDEO', cartoes: [{titulo: 'Ideias de título'}, {titulo: 'Descrição'}, {titulo: 'Capítulos', sub: 'com o tempo certo'}], quando: [1, 1, 1], foco: false}, troca: 'desliza', sons: [['estalo_madeira', 'f1+2'], ['estalo_madeira', 'f1+7'], ['estalo_madeira', 'f1+12']]},
  {frases: [21, 22], C: PEscadaFinal as Plano['C'], troca: 'corte', fundo: false, sons: [['whoosh_longo', 'f0+2'], ['revela', 'f0+30', -3]]},
];

// ---------------- Cena 7 · Na prática: cortes ----------------
const PEDIDO_CORTES = 'Encontre os dez melhores trechos deste vídeo, com até um minuto cada, corte na vertical e coloque legenda palavra por palavra.';
const C7: Plano[] = [
  {frases: [0, 3], C: F, props: {texto: '*cortes', etiqueta: 'PRIMEIRO USO', tam: 230, sub: 'um podcast · uma aula · uma live', subEm: 124}, troca: 'corte', sons: [['batida', 'f1+2']]},
  {frases: [4, 5], C: PTerminal as Plano['C'], props: {rotulo: 'O PEDIDO É ESTE', pedido: PEDIDO_CORTES, pedidoEm: 1, tam: 40}, troca: 'desliza', sons: teclas('f1', 12, 12)},
  {frases: [5, 6], inicio: ['leio'], C: PDezCortes as Plano['C'], props: {soltar: 0}, troca: 'zoom', brilho: [28, 28], sons: [['corte', 20], ['deslize', 34], ['estalo', 44], ['estalo', 52], ['estalo', 60], ['estalo', 68], ['estalo', 76], ['batida', 'f1+2']]},
  {frases: [7, 9], C: F, props: {texto: 'peça para eu | *explicar cada trecho', etiqueta: 'A DICA', tam: 110, sub: 'assim você aprova antes de eu exportar', subEm: 122}, troca: 'sobe'},
];

// ---------------- Cena 8 · Na prática: vídeo longo ----------------
const C8: Plano[] = [
  {frases: [0, 2], C: F, props: {texto: 'vídeo *longo', etiqueta: 'SEGUNDO USO', tam: 200, sub: 'uma hora gravada, em vários arquivos, errando e repetindo', subEm: 84}, troca: 'corte', sons: [['batida', 'f1+2']]},
  {frases: [3, 4], C: PTerminal as Plano['C'], props: {rotulo: 'O PEDIDO', pedido: 'Junte estas gravações, tire os erros e os silêncios, e monte um vídeo de quinze minutos.', pedidoEm: 1, tam: 42, linhas: [['transcrevendo tudo', 'transcrevo']]}, troca: 'desliza', sons: teclas('f1', 10, 9)},
  {frases: [5, 5], C: PRepetidas as Plano['C'], props: {repetiu: 0}, troca: 'zoom', brilho: [26, 70], sons: [['estalo', 'f0+2'], ['estalo', 'f0+12'], ['estalo', 'f0+22'], ['corte', 'f0+84'], ['brilho', 'f0+96']]},
  {frases: [6, 6], C: PLista as Plano['C'], props: {itens: [['00:42', 'takes 1 e 2 fora, fica o 3'], ['03:10', 'silêncio de 4 s'], ['09:55', 'frase repetida']], quando: [0, 0, 0], aprovar: 0}, troca: 'sobe', sons: [['estalo_madeira', 'f0+2'], ['estalo_madeira', 'f0+8'], ['estalo_madeira', 'f0+14'], ['clique', 'f0+38']]},
  {frases: [7, 7], C: F, props: {texto: 'a parte *chata | deixa de ser sua', tam: 120}, troca: 'zoom', sons: [['subida', 'f0+120', -3]]},
];

// ---------------- Cena 9 · Quanto custa e o que não funciona ----------------
const C9: Plano[] = [
  {frases: [0, 0], C: F, props: {texto: 'quanto *custa | de verdade?', tam: 150}, troca: 'corte'},
  {frases: [1, 4], C: PConta as Plano['C'], props: {ferramentas: 0, claude: 2, valor: 3}, troca: 'desliza', brilho: [78, 30], sons: [['estalo', 'f0+2'], ['estalo', 'f0+7'], ['estalo', 'f0+12'], ['estalo', 'f0+17'], ['tique', 'f1+2'], ['batida', 'f3+62']]},
  {frases: [5, 5], C: PCartoes as Plano['C'], props: {etiqueta: 'AGORA TIRA UM PRINT', cartoes: [{n: '01', titulo: 'Whisper', sub: 'transcreve'}, {n: '02', titulo: 'auto-editor', sub: 'tira o silêncio'}, {n: '03', titulo: 'FFmpeg', sub: 'corta e exporta'}, {n: '04', titulo: 'Remotion', sub: 'anima'}], quando: [0, 0, 0, 0], foco: false, tamTitulo: 50}, troca: 'zoom', sons: [['camera', 'f0+16']]},
  {frases: [6, 9], C: PCartoes as Plano['C'], props: {titulo: 'o que não funciona', cartoes: [{titulo: 'Não tenho gosto próprio'}, {titulo: 'Exporto devagar'}, {titulo: 'A primeira versão quase nunca é a boa'}], quando: [1, 2, 3], tamTitulo: 50}, troca: 'sobe', brilho: [24, 72], sons: [['desliga', 'f1+2'], ['desliga', 'f2+2'], ['desliga', 'f3+2']]},
];

// ---------------- Cena 10 · Fechamento ----------------
const NOMES = ['Gancho', 'Preparar', 'Entender', 'Cortar', 'Animar', 'Finalizar', 'Cortes', 'Vídeo longo', 'Custo', 'Fim'];
const C10: Plano[] = [
  {frases: [0, 2], C: PLinhaVideo as Plano['C'], props: {cenas: NOMES, duracoes: [26, 77, 61, 87, 65, 64, 30, 26, 23, 31]}, troca: 'corte', sons: [['deslize', 'f0+6'], ['estalo', 'f1+10'], ['batida', 'f2+4']]},
  {frases: [3, 3], C: F, props: {texto: 'eu não substituo | o seu *olhar', tam: 130}, troca: 'zoom'},
  {frases: [4, 5], C: F, props: {texto: 'a parte que é sua: | a *ideia', etiqueta: 'EU TIRO DA FRENTE A PARTE REPETITIVA', tam: 150}, troca: 'sobe', sons: [['revela', 'f1-16']]},
  {frases: [6, 6], C: F, props: {texto: 'canal *dark', tam: 190, sub: 'assunto para outro vídeo', subEm: 70}, troca: 'zoom'},
  {frases: [7, 8], C: PCartoes as Plano['C'], props: {titulo: 'começa pequeno', cartoes: [{n: '01', titulo: 'Pega um vídeo'}, {n: '02', titulo: 'Cria a pasta'}, {n: '03', titulo: 'Escreve o primeiro pedido'}], quando: [1, 1, 1], foco: false, tamTitulo: 50}, troca: 'desliza', brilho: [26, 30], sons: [['estalo_madeira', 'f1+2'], ['estalo_madeira', 'f1+7'], ['estalo_madeira', 'f1+12']]},
  {frases: [9, 10], C: PInscrever as Plano['C'], props: {pergunta: true}, troca: 'sobe', sons: [['batida', 'f1+2'], ['batida', 'f1+70']]},
];

export const CENAS: Record<number, {planos: Plano[]; abertura?: Abertura}> = {
  2: {planos: C2},
  3: {planos: C3, abertura: abre(2, 'ENTENDER')},
  4: {planos: C4, abertura: abre(3, 'CORTAR')},
  5: {planos: C5, abertura: abre(4, 'ANIMAR')},
  6: {planos: C6, abertura: abre(5, 'FINALIZAR')},
  7: {planos: C7},
  8: {planos: C8},
  9: {planos: C9},
  10: {planos: C10},
};

export const fazerCena = (numero: number): React.FC => {
  const Componente: React.FC = () => <Cena numero={numero} planos={CENAS[numero].planos} abertura={CENAS[numero].abertura} />;
  return Componente;
};
