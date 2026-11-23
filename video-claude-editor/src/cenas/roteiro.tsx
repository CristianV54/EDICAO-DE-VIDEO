import React from 'react';
import {Abertura, Cena, Plano, Som} from '../motor/motor';
import {PCartoes, PComparar, PFrase, PPasta, PPastaDentro, PTerminal} from '../motor/planosA';
import {PComandos, PContador, PEditores, PEntrePalavras, PLista, PMapa, POnda, PSilencio} from '../motor/planosB';
import {PAnalogiaFilme, PBalanca, PBilhetes, PCanalDark, PCrua, PFone, PMovimentos, PMultiplica, PMundo, PObjecao, PReceita, PSaudacao, PTudoCodigo, PVagoClaro} from '../motor/planosD';
import {PDoisUsos, PEditorA, PEditorB, PFerramentas, PRegra, PResto, PVoce, PZero} from '../motor/planosE';
import {PassoUm} from './Gancho3D';
import {PCapturas, PCodigo, PComentarios, PConfere, PConta, PDezCortes, PEscada, PEscadaFinal, PExportar, PInscrever, PLinhaVideo, PQuadros, PRepetidas, PVersoes} from '../motor/planosC';

// O vídeo, cena por cena. Cada plano cobre algumas frases da narração (os números são os índices das frases
// em audio/cenaNN_palavras.json) e diz qual peça de animação aparece e quais sons acompanham.
// Regras de som (do estudo do earshot): nem todo evento tem som, whoosh é raro, e o mesmo som nunca repete seguido.

// três teclas no começo da digitação (o resto da digitação fica mudo, como em vídeo profissional)
const teclas = (base: string): Som[] => [4, 9, 15].map((k) => ['tecla', `${base}+${k}`] as Som);
// abertura em 3D de um passo: o mascote pula para o degrau e a câmera mergulha no número
const abre = (passo: number, nome: string): Abertura => ({
  C: PEscada as Plano['C'],
  props: {passo, nome},
  dur: 78,
  sons: [
    ['passo', 30],
    ['whoosh_grave', 52],
  ],
});
const F = PFrase as Plano['C'];
const T = PTerminal as Plano['C'];
const K = PCartoes as Plano['C'];
const X = <A,>(c: React.FC<A>) => c as unknown as Plano['C'];

// ---------------- Cena 1 · Gancho ----------------
const C1: Plano[] = [
  {frases: [0, 0], C: X(PEditorA), fundo: false, troca: 'corte', sons: [['whoosh_grave', 'p:claude-8'], ['batida', 'p:claude']]},
  {frases: [1, 3], C: X(PZero), troca: 'zoom', brilho: [50, 18], cam: [[0, 960, 520, 1.0], ['zero', 960, 700, 1.2], [2, 960, 560, 1.06]], sons: [['desliga', 'p:zero-11'], ['impacto', 'p:zero']]},
  {frases: [4, 5], C: X(PEditorB), fundo: false, troca: 'corte', sons: [['corte', 'p:corte'], ['corte', 'p:corte+8'], ['whoosh_longo', 'p:câmera-6']]},
  {frases: [6, 7], C: X(PVoce), troca: 'desliza', brilho: [24, 72], cam: [[0, 960, 500, 1.0], ['voz', 520, 480, 1.24], ['ia', 960, 480, 1.24], ['quer', 1400, 480, 1.24], ['aprovar', 960, 760, 1.3]], sons: [['clique', 'p:aprovar'], ['sucesso', 'p:aprovar+3']]},
  {frases: [8, 8], C: X(PResto), troca: 'zoom', brilho: [70, 30]},
  {frases: [9, 9], C: X(PDoisUsos), troca: 'desliza', brilho: [80, 42], cam: [[0, 560, 540, 1.14], ['vídeo', 1240, 520, 1.1]], sons: [['estalo', 'p:cortes-4'], ['estalo', 'p:vídeo-4']]},
  {frases: [10, 11], C: X(PFerramentas), troca: 'sobe', brilho: [22, 26], cam: [[0, 960, 440, 1.04], ['pedido', 960, 620, 1.16]], sons: [['estalo_madeira', 12], ['tecla', 'p:pedido+4'], ['tecla', 'p:pedido+9'], ['tecla', 'p:pedido+15']]},
  {frases: [12, 14], C: X(PSaudacao), props: {linha1: 'Fala, galera!', linha2: 'Claude aqui', quando2: 2}, troca: 'zoom', cam: [[0, 960, 540, 0.9], [2, 960, 560, 1.1]]},
  {frases: [15, 16], C: X(PRegra), fundo: false, troca: 'corte', sons: [['passo', 'p:cinco-2'], ['passo', 'p:cinco+15'], ['passo', 'p:cinco+32'], ['passo', 'p:cinco+49'], ['passo', 'p:cinco+66']]},
  {frases: [17, 17], C: F, props: {texto: 'antes do fim: | quanto *custa?', tam: 170}, troca: 'zoom'},
  {frases: [18, 18], C: X(PassoUm), fundo: false, troca: 'corte', sons: [['whoosh_grave', 18], ['batida', 36]]},
];

// ---------------- Cena 2 · Passo 1: Preparar ----------------
const C2: Plano[] = [
  {frases: [0, 3], C: X(PComparar), props: {chatEm: 1, codeEm: 3}, troca: 'corte', brilho: [70, 30], cam: [[0, 600, 540, 1.12], [3, 1320, 540, 1.16]], sons: [['estalo', 'f3+12']]},
  {frases: [4, 6], C: T, props: {rotulo: 'DENTRO DE UMA PASTA DO SEU COMPUTADOR', linhas: [['abrindo arquivos', 'abro'], ['instalando programas', 'instalo'], ['executando comandos', 'executo'], ['$ ordens escritas para o computador', 'ordens']]}, troca: 'desliza', cam: [[0, 960, 480, 1.04], ['abro', 880, 500, 1.2], ['ordens', 880, 620, 1.26]], sons: [['tique', 'p:abro'], ['tique', 'p:instalo'], ['tique', 'p:executo']]},
  {frases: [7, 7], C: F, props: {texto: 'você pede, | eu *faço', tam: 170}, troca: 'zoom', cam: [[0, 960, 540, 1.0], ['faço', 960, 590, 1.3]], sons: [['batida', 'p:faço']]},
  {frases: [8, 9], C: X(PMovimentos), troca: 'sobe', brilho: [30, 30]},
  {frases: [10, 12], C: K, props: {etiqueta: '01', cartoes: [{titulo: 'Instale o aplicativo do Claude', sub: 'e abra a aba Code'}, {titulo: 'Planos pagos', sub: 'o link está na descrição ↓', selo: 'Pro'}], quando: ['instala', 'planos'], colunas: 2, foco: false}, troca: 'desliza', brilho: [20, 70], cam: [[0, 620, 540, 1.1], ['planos', 1300, 540, 1.18]], sons: [['estalo_madeira', 'p:instala']]},
  {frases: [13, 15], C: X(PPasta), props: {criar: 1, arrastar: 1, legenda: 'bruto = a gravação crua, do jeito que saiu da câmera', legendaEm: 2}, troca: 'desliza', cam: [[0, 960, 500, 1.04], ['arrasta', 760, 520, 1.2], ['dentro', 1040, 540, 1.3], [2, 960, 640, 1.12]], sons: [['gaveta', 'p:dentro']]},
  {frases: [16, 18], C: T, props: {rotulo: '03 · O PRIMEIRO PEDIDO', pedido: 'prepare esta pasta para edição de vídeo', pedidoEm: 2}, troca: 'desliza', cam: [[0, 960, 540, 1.04], [2, 840, 520, 1.28]], sons: teclas('f2')},
  {frases: [19, 21], C: T, props: {rotulo: 'DAQUI EU ASSUMO', linhas: [['instalando Whisper', 'instalo'], ['instalando auto-editor', 'ferramentas'], ['instalando FFmpeg', 'conhecer'], ['instalando Remotion', 'passos'], ['dividindo a pasta em três', 'divido']]}, troca: 'zoom', brilho: [26, 26], cam: [[0, 960, 420, 1.06], ['instalo', 880, 470, 1.2], ['divido', 880, 650, 1.24]], sons: [['sucesso', 'p:divido+24']]},
  {frases: [22, 23], C: X(PPastaDentro), props: {dividir: 0, aviso: 'tudo instalado por mim', avisoEm: 1}, troca: 'desliza', cam: [[0, 560, 480, 1.2], ['pronto', 1360, 480, 1.2], [1, 960, 620, 1.1]], sons: [['estalo', 'p:bruto'], ['estalo', 'p:trabalho'], ['estalo', 'p:pronto']]},
  {frases: [24, 25], C: X(PObjecao), props: {pergunta: 'e se você estragar o meu vídeo?', resposta: 'não estraga', respostaEm: 1}, troca: 'zoom', brilho: [30, 70], cam: [[0, 800, 440, 1.08], [1, 1150, 700, 1.24]]},
  {frases: [26, 28], C: X(PPastaDentro), props: {dividir: 0, prontas: true, travar: 0, novo: 1, denovo: 2}, troca: 'corte', cam: [[0, 560, 480, 1.26], [1, 960, 600, 1.2], [2, 1300, 620, 1.22]], sons: [['gaveta', 'p:trancados']]},
  {frases: [29, 31], C: K, props: {etiqueta: 'AS QUATRO FERRAMENTAS', cartoes: [{titulo: 'Whisper', selo: 'grátis'}, {titulo: 'auto-editor', selo: 'grátis'}, {titulo: 'FFmpeg', selo: 'grátis'}, {titulo: 'Remotion', selo: 'grátis'}, {titulo: '?', sub: 'o que custa dinheiro: no fim'}], quando: [1, 1, 1, 1, 2], colunas: 5, foco: false, tamTitulo: 44}, troca: 'sobe', brilho: [80, 30], cam: [[0, 960, 540, 1.0], [1, 640, 540, 1.16], [2, 1560, 540, 1.3]], sons: [['estalo', 'f1+4']]},
  {frases: [32, 34], C: F, props: {texto: 'eu ainda não sei | o que tem *dentro | do seu vídeo', etiqueta: 'SÓ QUE TEM UM PROBLEMA', tam: 112, sub: 'é isso que o passo 2 resolve', subFrase: 2}, troca: 'zoom', sons: [['subida', 'f2+50', -3]]},
];

// ---------------- Cena 3 · Passo 2: Entender ----------------
const C3: Plano[] = [
  {frases: [0, 2], C: F, props: {texto: 'eu não *assisto. | eu *leio.', etiqueta: 'O SEGREDO DE TUDO', tam: 150}, troca: 'corte', cam: [[0, 960, 520, 1.0], ['leio', 960, 600, 1.3]], sons: [['batida', 'p:leio']]},
  {frases: [3, 5], C: X(POnda), props: {varrer: 2, temposPalavra: 'momento', rotulo: 'WHISPER · GRATUITO · RODA NO SEU COMPUTADOR'}, troca: 'desliza', brilho: [30, 30], cam: [[0, 960, 500, 1.04], [2, 560, 520, 1.24], ['momento', 1300, 580, 1.24]], sons: [['deslize', 'f2+4']]},
  {frases: [6, 9], C: T, props: {rotulo: 'VOCÊ ESCREVE', pedido: 'transcreva este vídeo palavra por palavra', pedidoEm: 1, linhas: [['1 hora de vídeo virou texto', 2], ['lido em segundos', 3]]}, troca: 'desliza', cam: [[0, 960, 500, 1.04], [1, 840, 480, 1.26], [2, 880, 600, 1.2]], sons: [...teclas('f1'), ['sucesso', 'p:segundos']]},
  {frases: [10, 11], C: X(PAnalogiaFilme), troca: 'zoom', brilho: [24, 72], cam: [[0, 700, 660, 1.14], [1, 1000, 440, 1.14]]},
  {frases: [12, 16], C: X(PMapa), props: {erro: 1, silencio: 2, bom: 3, forte: 4}, troca: 'zoom', brilho: [78, 28], cam: [[0, 960, 480, 1.06], [2, 960, 540, 1.16], [4, 960, 620, 1.2]], sons: [['corte', 'f1+6'], ['desliga', 'f2+6'], ['estalo_madeira', 'f3+6'], ['brilho', 'f4+6']]},
  {frases: [17, 17], C: X(PCapturas), troca: 'desliza', cam: [[0, 520, 500, 1.2], ['fotos', 960, 560, 1.02]], sons: [['camera', 'p:fotos+6']]},
  {frases: [18, 19], C: X(PMapa), props: {erro: 0, silencio: 0, bom: 0, forte: 0, legenda: 1, rotulo: 'O MAPA DO SEU VÍDEO'}, troca: 'zoom', cam: [[0, 960, 520, 1.22], [1, 960, 560, 1.0]]},
  {frases: [20, 20], C: X(PMultiplica), troca: 'sobe', cam: [[0, 420, 300, 1.5], ['cinquenta', 960, 500, 1.02]], sons: [['tique', 'p:cinquenta-12']]},
  {frases: [21, 21], C: F, props: {texto: 'cortar vira | a parte *fácil', etiqueta: 'COM O MAPA PRONTO'}, troca: 'zoom'},
];

// ---------------- Cena 4 · Passo 3: Cortar ----------------
const C4: Plano[] = [
  {frases: [0, 0], C: K, props: {etiqueta: 'DUAS FERRAMENTAS FAZEM O CORTE', cartoes: [{n: '01', titulo: 'auto-editor', sub: 'tira o silêncio'}, {n: '02', titulo: 'FFmpeg', sub: 'corta e junta'}], quando: [0, 0], colunas: 2, foco: false, tamTitulo: 80}, troca: 'corte', sons: [['estalo_madeira', 'f0+8']]},
  {frases: [1, 4], C: X(PSilencio), props: {medir: 1, some: 3}, troca: 'desliza', brilho: [24, 72], cam: [[0, 960, 540, 1.04], [1, 560, 540, 1.2], [2, 1300, 540, 1.2], [3, 960, 540, 1.02]], sons: [['deslize', 'f3+2']]},
  {frases: [5, 8], C: X(PComandos), troca: 'desliza', brilho: [78, 30], cam: [[0, 960, 420, 1.06], ['corta', 880, 400, 1.2], ['muda', 880, 600, 1.2], [3, 960, 500, 1.08]], sons: [['tecla', 'p:corta'], ['tecla', 'p:junta'], ['tecla', 'p:muda']]},
  {frases: [9, 10], C: T, props: {rotulo: 'O SEU PEDIDO É ESTE', pedido: 'Tire os silêncios e os erros deste vídeo, mas me mostre a lista de cortes antes de cortar.', pedidoEm: 1, tam: 42}, troca: 'sobe', cam: [[0, 960, 540, 1.04], [1, 760, 500, 1.3], ['aí', 960, 540, 1.04]], sons: teclas('f1')},
  {frases: [11, 13], C: X(PLista), props: {itens: [['02:00', 'erro: frase errada'], ['07:00', 'repetição'], ['11:40', 'silêncio de 6 s']], quando: [0, 1, 1], aprovar: 1}, troca: 'sobe', cam: [[0, 960, 420, 1.1], ['aprova', 960, 700, 1.24]], sons: [['clique', 'p:aprova+4'], ['sucesso', 'p:aprova+7']]},
  {frases: [14, 14], C: X(PEntrePalavras), props: {cortar: 0, meio: 0}, troca: 'zoom', cam: [[0, 960, 540, 1.04], ['entre', 960, 540, 1.3], ['meio', 960, 560, 1.14]], sons: [['corte', 'p:entre+14']]},
  {frases: [15, 17], C: X(PContador), props: {virar: 1}, troca: 'corte', cam: [[0, 960, 540, 1.0], ['doze', 960, 520, 1.3]], sons: [['batida', 'p:doze']]},
  {frases: [18, 19], C: X(PEditores), props: {entrega: 1}, troca: 'desliza', brilho: [28, 30], cam: [[0, 960, 420, 1.1], ['programa', 960, 660, 1.12]], sons: [['estalo', 'p:programa']]},
  {frases: [20, 22], C: X(PVersoes), props: {quando: [1, 2, 2, 2, 2], chaves: ['primeira'], misterio: true, etiqueta: 'UMA CONFISSÃO'}, troca: 'zoom', cam: [[0, 600, 440, 1.3], ['primeira', 420, 460, 1.5], [2, 1250, 460, 1.2]], sons: [['camera', 'p:primeira']]},
  {frases: [23, 23], C: X(PInscrever), troca: 'sobe'},
  {frases: [24, 26], C: F, props: {texto: '*limpo | não é bom de assistir', tam: 120, sub: 'falta o que você está vendo agora', subFrase: 2}, troca: 'zoom', sons: [['subida', 'f2+40', -3]]},
];

// ---------------- Cena 5 · Passo 4: Animar ----------------
const C5: Plano[] = [
  {frases: [0, 1], C: X(PTudoCodigo), troca: 'corte', cam: [[0, 960, 380, 1.1], [1, 520, 600, 1.18], ['câmera', 1400, 600, 1.18]]},
  {frases: [2, 3], C: X(PReceita), troca: 'desliza', brilho: [24, 30], cam: [[0, 600, 470, 1.14], [1, 1300, 470, 1.14]]},
  {frases: [4, 5], C: F, props: {texto: '*Remotion', etiqueta: 'A FERRAMENTA', tam: 210, sub: 'transforma código em vídeo', subFrase: 1}, troca: 'zoom', cam: [[0, 960, 540, 0.96], [1, 960, 580, 1.26]], sons: [['revela', 'f0+34']]},
  {frases: [6, 7], C: T, props: {rotulo: 'EM VEZ DE ARRASTAR COM O MOUSE, EU ESCREVO', linhas: [['o título entra no segundo 3', 'entra'], ['o título cresce', 'cresce'], ['a câmera se aproxima', 'aproxima']]}, troca: 'desliza', brilho: [26, 70], cam: [[0, 960, 440, 1.06], ['entra', 880, 480, 1.2], ['aproxima', 880, 620, 1.26]], sons: [['tecla', 'p:entra'], ['tecla', 'p:cresce'], ['tecla', 'p:aproxima']]},
  {frases: [8, 8], C: X(PQuadros), troca: 'desliza', cam: [[0, 500, 440, 1.2], ['entrega', 1100, 560, 1.1]]},
  {frases: [9, 10], C: T, props: {rotulo: 'O SEU PEDIDO É ESTE', pedido: 'Coloque legenda palavra por palavra neste vídeo, em branco e no centro, e faça o título da abertura entrar no segundo três.', pedidoEm: 1, tam: 40}, troca: 'sobe', cam: [[0, 960, 540, 1.04], [1, 760, 500, 1.3], ['olha', 960, 540, 1.02]], sons: teclas('f1')},
  {frases: [11, 13], C: X(PCodigo), props: {mudar: 2}, troca: 'zoom', brilho: [76, 30], cam: [[0, 1360, 540, 1.16], [1, 560, 540, 1.2], ['mudo', 620, 540, 1.3], ['personagem', 1340, 540, 1.2]], sons: [['tecla', 'p:mudo+12'], ['deslize', 'p:personagem']]},
  {frases: [14, 17], C: K, props: {titulo: 'três coisas', cartoes: [{n: '01', titulo: 'Legendas palavra por palavra', sub: 'no tempo certo'}, {n: '02', titulo: 'Textos e gráficos', sub: 'na hora em que você fala'}, {n: '03', titulo: 'Mudanças em uma frase', sub: 'você pede, eu refaço'}], quando: [1, 2, 3], tamTitulo: 50}, troca: 'sobe', cam: [[0, 960, 520, 1.0], [1, 440, 580, 1.24], [2, 960, 580, 1.24], [3, 1480, 580, 1.24]], sons: [['estalo_madeira', 'f1+2'], ['estalo_madeira', 'f2+2'], ['estalo_madeira', 'f3+2']]},
  {frases: [18, 20], C: X(PComentarios), props: {falas: ['não gostei da cor', 'quero a legenda maior'], chaves: ['cor', 'legenda'], corrige: 'refaço'}, troca: 'desliza', cam: [[0, 640, 480, 1.14], ['refaço', 1240, 540, 1.16]], sons: [['sucesso', 'p:refaço+6']]},
  {frases: [21, 23], C: X(PObjecao), props: {pergunta: 'eu não sei programar', resposta: 'não precisa', respostaEm: 1, nota: 'você só descreve o que quer ver', notaEm: 2}, troca: 'zoom', brilho: [30, 70], cam: [[0, 800, 440, 1.08], [1, 1150, 700, 1.22], [2, 960, 780, 1.1]]},
  {frases: [24, 24], C: X(PVagoClaro), troca: 'desliza', cam: [[0, 580, 540, 1.14], ['claro', 1340, 540, 1.16]]},
  {frases: [25, 26], C: X(PMundo), troca: 'sobe', cam: [[0, 520, 520, 1.16], ['mundo', 1400, 500, 1.14]], sons: [['subida', 'f1+50', -3]]},
];

// ---------------- Cena 6 · Passo 5: Finalizar ----------------
const C6: Plano[] = [
  {frases: [0, 1], C: T, props: {rotulo: 'VOCÊ ESCREVE', pedido: 'exporte o vídeo final', pedidoEm: 1}, troca: 'corte', cam: [[0, 960, 540, 1.04], [1, 800, 520, 1.3]], sons: teclas('f1')},
  {frases: [2, 2], C: X(PExportar), props: {juntar: 0}, troca: 'desliza', brilho: [24, 30], cam: [[0, 700, 460, 1.14], ['arquivo', 1200, 600, 1.12]], sons: [['sucesso', 'f0+132']]},
  {frases: [3, 5], C: X(PConfere), props: {itens: 1, fotos: 2}, troca: 'sobe', cam: [[0, 960, 380, 1.1], [2, 600, 640, 1.16], ['legenda', 1300, 660, 1.16]], sons: [['tique', 'p:tamanho'], ['tique', 'p:duração'], ['tique', 'p:volume'], ['desliga', 'p:preta']]},
  {frases: [6, 6], C: F, props: {texto: 'a parte mais | *importante', etiqueta: 'DO PROCESSO INTEIRO', tam: 150}, troca: 'zoom'},
  {frases: [7, 8], C: F, props: {texto: 'você *assiste', tam: 220, sub: 'e me fala o que sentiu', subFrase: 1}, troca: 'corte', cam: [[0, 960, 540, 1.3], [1, 960, 600, 1.08]], sons: [['batida', 'p:assiste']]},
  {frases: [9, 9], C: X(PComentarios), props: {falas: ['o começo está lento', 'esta parte ficou confusa', 'a música está alta aqui'], chaves: ['começo', 'parte', 'música'], corrige: 'corrijo'}, troca: 'desliza', brilho: [78, 70], cam: [[0, 640, 380, 1.16], ['música', 700, 640, 1.16], ['corrijo', 1200, 540, 1.1]], sons: [['estalo', 'p:começo', -2], ['estalo', 'p:parte', -2], ['estalo', 'p:música', -2]]},
  {frases: [10, 13], C: X(PVersoes), props: {quando: [1, 1, 1, 1, 1], rotulos: ['linha do tempo deitada', 'câmera parada', 'colorida demais', '3D em tudo', 'a atual'], chavesRotulo: ['deitada', '', 'colorida']}, troca: 'zoom', cam: [[0, 960, 420, 1.0], ['deitada', 320, 440, 1.5], ['colorida', 1000, 440, 1.5], [3, 1500, 440, 1.36]], sons: [['camera', 'p:deitada']]},
  {frases: [14, 16], C: X(PObjecao), props: {pergunta: 'por que você não acerta de primeira?', resposta: 'eu aprendo', respostaEm: 2, nota: 'eu não adivinho o seu gosto', notaEm: 1}, troca: 'zoom', brilho: [30, 70], cam: [[0, 800, 440, 1.06], [1, 960, 760, 1.14], [2, 1200, 720, 1.24]]},
  {frases: [17, 17], C: F, props: {texto: 'quem decide | é *você', tam: 170}, troca: 'zoom'},
  {frases: [18, 19], C: K, props: {etiqueta: 'O QUE VAI EM VOLTA DO VÍDEO', cartoes: [{titulo: 'Ideias de título'}, {titulo: 'Descrição'}, {titulo: 'Capítulos', sub: 'com o tempo certo'}], quando: ['ideias', 'descrição', 'capítulos'], foco: true}, troca: 'desliza', cam: [[0, 960, 540, 1.02], [1, 500, 560, 1.2], ['capítulos', 1450, 560, 1.22]], sons: [['estalo_madeira', 'p:ideias']]},
  {frases: [20, 21], C: X(PEscadaFinal), troca: 'corte', fundo: false, sons: [['whoosh_longo', 'f0+4']]},
];

// ---------------- Cena 7 · Na prática: cortes ----------------
const PEDIDO_CORTES = 'Encontre os dez melhores trechos deste vídeo, com até um minuto cada, corte na vertical e coloque legenda palavra por palavra.';
const C7: Plano[] = [
  {frases: [0, 2], C: F, props: {texto: '*cortes', etiqueta: 'PRIMEIRO JEITO', tam: 240, sub: 'um podcast · uma aula · uma live', subFrase: 2}, troca: 'corte', cam: [[0, 960, 540, 0.9], [1, 960, 540, 1.1], [2, 960, 640, 1.26]], sons: [['batida', 'p:cortes']]},
  {frases: [3, 4], C: T, props: {rotulo: 'O PEDIDO É ESTE', pedido: PEDIDO_CORTES, pedidoEm: 1, tam: 40}, troca: 'desliza', cam: [[0, 960, 540, 1.04], [1, 760, 500, 1.3], ['coloque', 960, 540, 1.04]], sons: teclas('f1')},
  {frases: [4, 6], inicio: ['leio'], C: X(PDezCortes), props: {soltar: 0}, troca: 'zoom', brilho: [28, 28], cam: [[0, 960, 300, 1.2], ['corto', 500, 640, 1.2], ['dez', 1400, 640, 1.16]], sons: [['corte', 20], ['deslize', 44]]},
  {frases: [7, 9], C: X(PBilhetes), troca: 'sobe', cam: [[0, 600, 300, 1.2], ['explicar', 700, 600, 1.2], [2, 1100, 640, 1.1]]},
  {frases: [10, 11], C: X(PCrua), troca: 'desliza', brilho: [70, 70], cam: [[0, 600, 600, 1.2], [1, 1100, 420, 1.08]]},
];

// ---------------- Cena 8 · Na prática: vídeo inteiro ----------------
const C8: Plano[] = [
  {frases: [0, 2], C: F, props: {texto: 'vídeo *inteiro', etiqueta: 'SEGUNDO JEITO', tam: 190, sub: 'uma hora gravada · vários arquivos · errando e repetindo', subFrase: 2}, troca: 'corte', cam: [[0, 960, 540, 0.9], [1, 960, 540, 1.1], [2, 960, 640, 1.22]], sons: [['batida', 'p:inteiro']]},
  {frases: [3, 4], C: T, props: {rotulo: 'O PEDIDO', pedido: 'Junte estas gravações, tire os erros e os silêncios, e monte um vídeo de quinze minutos.', pedidoEm: 1, tam: 42, linhas: [['transformando tudo em texto', 'transformo']]}, troca: 'desliza', cam: [[0, 960, 540, 1.04], [1, 760, 480, 1.3], ['transformo', 900, 640, 1.16]], sons: teclas('f1')},
  {frases: [5, 5], C: X(PRepetidas), props: {repetiu: 0}, troca: 'zoom', brilho: [26, 70], cam: [[0, 960, 380, 1.14], ['melhor', 960, 660, 1.24]], sons: [['corte', 'p:vezes'], ['brilho', 'p:melhor']]},
  {frases: [6, 6], C: X(PLista), props: {itens: [['00:42', 'takes 1 e 2 fora, fica o 3'], ['03:10', 'silêncio de 4 s'], ['09:55', 'frase repetida']], quando: [0, 0, 0], aprovar: 0}, troca: 'sobe', cam: [[0, 960, 400, 1.12], ['lista', 960, 620, 1.2]], sons: [['estalo_madeira', 'f0+4']]},
  {frases: [7, 9], C: X(PFone), troca: 'zoom', brilho: [70, 30], cam: [[0, 960, 300, 1.16], [1, 960, 520, 1.14], [2, 960, 660, 1.2]]},
  {frases: [10, 10], C: F, props: {texto: 'quanto *custa | isso tudo?', tam: 170}, troca: 'zoom', cam: [[0, 960, 540, 1.0], ['custa', 960, 520, 1.28]]},
];

// ---------------- Cena 9 · Quanto custa e o que não funciona ----------------
const C9: Plano[] = [
  {frases: [0, 1], C: F, props: {texto: 'a gente faz | a *conta', etiqueta: 'EU PROMETI FALAR O VALOR', tam: 170}, troca: 'corte'},
  {frases: [2, 6], C: X(PConta), props: {ferramentas: 0, claude: 2, valor: 3, nota: 'em dólar: o cartão converte para reais', notaEm: 4}, troca: 'desliza', brilho: [78, 30], cam: [[0, 960, 380, 1.1], [2, 960, 620, 1.16], ['vinte', 1200, 660, 1.3], [4, 1100, 720, 1.16]], sons: [['tique', 'p:zero'], ['batida', 'p:vinte']]},
  {frases: [7, 7], C: K, props: {etiqueta: 'AGORA TIRA UM PRINT', cartoes: [{n: '01', titulo: 'Whisper', sub: 'transcreve'}, {n: '02', titulo: 'auto-editor', sub: 'tira o silêncio'}, {n: '03', titulo: 'FFmpeg', sub: 'corta e exporta'}, {n: '04', titulo: 'Remotion', sub: 'anima'}], quando: [0, 0, 0, 0], foco: false, tamTitulo: 50}, troca: 'zoom', cam: [[0, 960, 540, 1.0]], sons: [['camera', 'f0+16']]},
  {frases: [8, 12], C: K, props: {titulo: 'o que não funciona', cartoes: [{titulo: 'A primeira versão quase nunca é a boa'}, {titulo: 'Pedido vago, corte genérico'}, {titulo: 'O plano tem limite de uso'}], quando: [1, 3, 4], tamTitulo: 50}, troca: 'sobe', brilho: [24, 72], cam: [[0, 960, 400, 1.08], [1, 440, 580, 1.24], [3, 960, 580, 1.24], [4, 1480, 580, 1.24]], sons: [['desliga', 'f1+2'], ['desliga', 'f3+2'], ['desliga', 'f4+2']]},
  {frases: [13, 15], C: F, props: {texto: 'a parte que importa: | a *ideia', tam: 150, sub: 'eu volto nisso no final', subFrase: 2}, troca: 'zoom', cam: [[0, 960, 500, 1.0], ['ideia', 960, 600, 1.3], [2, 960, 660, 1.14]]},
];

// ---------------- Cena 10 · Fechamento ----------------
const NOMES = ['Gancho', 'Preparar', 'Entender', 'Cortar', 'Animar', 'Finalizar', 'Cortes', 'Vídeo inteiro', 'Custo', 'Fim'];
const C10: Plano[] = [
  {frases: [0, 4], C: X(PLinhaVideo), props: {cenas: NOMES, duracoes: [44, 88, 64, 85, 81, 67, 38, 31, 41, 48]}, troca: 'corte', cam: [[0, 300, 440, 1.5], [1, 500, 450, 1.4], ['preparar', 500, 450, 1.5], ['finalizar', 1200, 450, 1.5], [4, 960, 600, 1.06]], sons: [['deslize', 'f1+4'], ['batida', 'p:nenhum']]},
  {frases: [5, 5], C: F, props: {texto: 'eu não substituo | o seu *olhar', tam: 130}, troca: 'zoom'},
  {frases: [6, 8], C: X(PBalanca), troca: 'desliza', brilho: [26, 30], cam: [[0, 560, 480, 1.16], ['ideia', 1380, 440, 1.22], [2, 960, 760, 1.14]], sons: [['revela', 'p:ideia-4']]},
  {frases: [9, 10], C: X(PCanalDark), troca: 'zoom', cam: [[0, 600, 520, 1.2], ['canal', 1250, 460, 1.14], [1, 1250, 560, 1.2]]},
  {frases: [11, 12], C: K, props: {titulo: 'começa pequeno', cartoes: [{n: '01', titulo: 'Pega um vídeo'}, {n: '02', titulo: 'Cria a pasta'}, {n: '03', titulo: 'Escreve o primeiro pedido'}], quando: ['pega', 'cria', 'escreve'], tamTitulo: 50}, troca: 'desliza', brilho: [26, 30], cam: [[0, 700, 380, 1.14], ['pega', 440, 580, 1.2], ['cria', 960, 580, 1.2], ['escreve', 1480, 580, 1.2]], sons: [['estalo_madeira', 'p:pega']]},
  {frases: [13, 15], C: X(PInscrever), props: {pergunta: true, opcoes: ['cortes', 'vídeo inteiro'], frase: 1}, troca: 'sobe', cam: [[0, 960, 400, 1.1], ['cortes', 620, 560, 1.16], ['montando', 1300, 560, 1.16], [2, 960, 560, 1.02]], sons: [['batida', 'p:cortes'], ['batida', 'p:montando']]},
  {frases: [16, 16], C: X(PInscrever), troca: 'sobe'},
  {frases: [17, 19], C: X(PSaudacao), props: {linha1: 'Valeu, galera!', linha2: 'até a próxima', quando2: 1}, troca: 'zoom', cam: [[0, 960, 540, 1.16], [2, 960, 540, 0.96]]},
];

const CAUDA: Record<number, number> = {1: 26};
export const CENAS: Record<number, {planos: Plano[]; abertura?: Abertura}> = {
  1: {planos: C1},
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
  const Componente: React.FC = () => <Cena numero={numero} planos={CENAS[numero].planos} abertura={CENAS[numero].abertura} cauda={CAUDA[numero] ?? 0} />;
  return Componente;
};
export const caudaDe = (numero: number) => CAUDA[numero] ?? 0;
