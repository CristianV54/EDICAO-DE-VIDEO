import React from 'react';
import {Abertura, Cena, Plano, Som} from '../motor/motor';
import {PCartoes, PComparar, PFrase, PPasta, PPastaDentro, PTerminal} from '../motor/planosA';
import {PEditores, PLista, PMapa, POnda} from '../motor/planosB';
import {PCodigo, PConfere, PConta, PDezCortes, PEscada, PEscadaFinal, PExportar, PLinhaVideo, PRepetidas, PVersoes} from '../motor/planosC';
import {PAnalogiaFilme, PBalanca, PBilhetes, PCanalDark, PCrua, PFone, PMovimentos, PObjecao, PReceita, PSaudacao, PTudoCodigo} from '../motor/planosD';
import {PEditorA, PEditorB, PRegra, PResto, PVoce, PZero} from '../motor/planosE';
import {PAmbiente, PCaixa, PComandosReal, PComentar, PCongela, PEntreReal, PHoje, PMeta, PMontado, PNiveis, PNivel, PPalavraAcende, PPedidoMini, PRegra as PRegra1, PRegrasJuntas, PRemotionLegenda, PSilencioReal, PSininho} from '../motor/planosF';

// O vídeo, cena por cena. Cada plano cobre algumas frases da narração (os números são os índices das frases
// em audio/cenaNN_palavras.json) e diz qual peça de animação aparece e quais sons acompanham.
// Regras de som (do estudo do earshot): nem todo evento tem som, whoosh é raro, e o mesmo som nunca repete seguido.

// três teclas no começo da digitação (o resto da digitação fica mudo, como em vídeo profissional)
const teclas = (base: string): Som[] => [4, 9, 15].map((k) => ['tecla', `${base}+${k}`] as Som);
// abertura em 3D de um nível: o mascote pula para o degrau e a câmera mergulha no número
const abre = (nivel: number, nome: string): Abertura => ({
  C: PEscada as Plano['C'],
  props: {passo: nivel, nome},
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
const OBJ: Plano['cam'] = [[0, 880, 470, 1.06], [1, 1040, 600, 1.1]];
const TRES: Plano['cam'] = [[0, 960, 520, 1.0], [1, 640, 570, 1.12], [2, 960, 570, 1.12], [3, 1280, 570, 1.12]];

// ---------------- Cena 1 · Gancho ----------------
const C1: Plano[] = [
  {frases: [0, 0], C: X(PEditorA), fundo: false, troca: 'corte', sons: [['whoosh_grave', 'p:claude-8'], ['batida', 'p:claude']]},
  {frases: [1, 3], C: X(PZero), troca: 'zoom', brilho: [50, 18], cam: [[0, 960, 520, 1.0], ['zero', 960, 700, 1.2], [2, 960, 560, 1.06]], sons: [['desliga', 'p:zero-11'], ['impacto', 'p:zero']]},
  {frases: [4, 5], C: X(PEditorB), fundo: false, troca: 'corte', sons: [['corte', 'p:corte'], ['corte', 'p:corte+8'], ['whoosh_longo', 'p:câmera-6']]},
  {frases: [6, 7], C: X(PVoce), troca: 'desliza', brilho: [24, 72], cam: [[0, 960, 500, 1.0], ['voz', 720, 500, 1.1], ['ia', 960, 500, 1.1], ['quer', 1200, 500, 1.1], ['aprovar', 960, 620, 1.12]], sons: [['clique', 'p:aprovar'], ['sucesso', 'p:aprovar+3']]},
  {frases: [8, 8], C: X(PResto), troca: 'zoom', brilho: [70, 30]},
  {frases: [9, 11], C: X(PNiveis), troca: 'sobe', brilho: [26, 30], cam: [[0, 800, 620, 1.12], ['fácil', 900, 580, 1.1], ['pesado', 1100, 520, 1.08], [1, 960, 560, 1.0], [2, 1100, 640, 1.06]], sons: [['estalo_madeira', 'p:três'], ['estalo_madeira', 'p:fácil'], ['estalo_madeira', 'p:pesado'], ['tecla', 'p:pedido+4'], ['tecla', 'p:pedido+9'], ['tecla', 'p:pedido+15']]},
  {frases: [12, 14], C: X(PSaudacao), props: {linha1: 'Fala, galera!', linha2: 'Claude aqui', quando2: 2}, troca: 'zoom', cam: [[0, 960, 540, 0.9], [2, 960, 560, 1.1]]},
  {frases: [15, 16], C: X(PRegra), fundo: false, troca: 'corte', sons: [['passo', 'p:três-2'], ['passo', 'p:três+18'], ['passo', 'p:três+38']]},
  {frases: [17, 17], C: F, props: {texto: 'antes do fim: | quanto *custa?', tam: 170}, troca: 'zoom'},
  {frases: [18, 18], C: X(PAmbiente), troca: 'sobe', cam: [[0, 960, 540, 0.94], ['ambiente', 960, 600, 1.16]], sons: [['estalo_madeira', 8]]},
];

// ---------------- Cena 2 · O ambiente ----------------
const C2: Plano[] = [
  {frases: [0, 2], C: X(PComparar), props: {chatEm: 0, codeEm: 2}, troca: 'corte', brilho: [70, 30], cam: [[0, 760, 540, 1.08], [2, 1180, 540, 1.1]], sons: [['estalo', 'p:code']]},
  {frases: [3, 4], C: T, props: {rotulo: 'DENTRO DE UMA PASTA DO SEU COMPUTADOR', linhas: [['não é mágica: é trabalho de verdade', 'mágica'], ['abrindo arquivos', 'abro'], ['instalando programas', 'instalo'], ['executando comandos', 'executo'], ['$ ordens escritas para o computador', 'ordens']]}, troca: 'desliza', cam: [[0, 960, 460, 1.04], ['abro', 900, 500, 1.14], ['ordens', 900, 600, 1.18]], sons: [['tique', 'p:abro'], ['tique', 'p:instalo'], ['tique', 'p:executo']]},
  {frases: [5, 5], C: F, props: {texto: 'você pede, | eu *faço', tam: 170}, troca: 'zoom', cam: [[0, 960, 540, 1.0], ['faço', 960, 590, 1.3]], sons: [['batida', 'p:faço']]},
  {frases: [6, 7], C: X(PMovimentos), troca: 'sobe', brilho: [30, 30]},
  {frases: [8, 10], C: K, props: {etiqueta: '01', cartoes: [{titulo: 'Instale o aplicativo do Claude', sub: 'e abra a aba Code'}, {titulo: 'Planos pagos', sub: 'o link está na descrição ↓', selo: 'Pro'}], quando: ['instala', 'planos'], colunas: 2, foco: false}, troca: 'desliza', brilho: [20, 70], cam: [[0, 800, 540, 1.06], ['planos', 1140, 540, 1.08]], sons: [['estalo_madeira', 'p:instala']]},
  {frases: [11, 13], C: X(PPasta), props: {criar: 1, arrastar: 1, legenda: 'bruto = a gravação crua, do jeito que saiu da câmera', legendaEm: 2}, troca: 'desliza', cam: [[0, 960, 500, 1.04], ['arrasta', 760, 520, 1.18], ['dentro', 1040, 540, 1.24], [2, 960, 640, 1.1]], sons: [['gaveta', 'p:dentro']]},
  {frases: [14, 16], C: T, props: {rotulo: '03 · O PRIMEIRO PEDIDO', pedido: 'prepare esta pasta para edição de vídeo', pedidoEm: 2, linhas: [['pasta escolhida: meus-videos', 'escolhe']]}, troca: 'desliza', cam: [[0, 960, 540, 1.04], [2, 860, 520, 1.2]], sons: teclas('f2')},
  {frases: [17, 18], C: T, props: {rotulo: 'PRONTO', linhas: [['pedido recebido', 0], ['instalando Whisper', 'instalo'], ['instalando auto-editor', 'ferramentas'], ['instalando FFmpeg', 'divido'], ['instalando Remotion', 'pasta'], ['dividindo a pasta em três', 'três']]}, troca: 'zoom', brilho: [26, 26], cam: [[0, 960, 440, 1.06], ['instalo', 900, 480, 1.14], ['três', 900, 640, 1.18]], sons: [['sucesso', 'p:três+10']]},
  {frases: [19, 20], C: X(PPastaDentro), props: {dividir: 0, aviso: 'nada instalado à mão', avisoEm: 1}, troca: 'desliza', cam: [[0, 760, 480, 1.1], ['pronto', 1160, 480, 1.1], [1, 960, 580, 1.06]], sons: [['estalo', 'p:bruto'], ['estalo', 'p:trabalho'], ['estalo', 'p:pronto']]},
  {frases: [21, 22], C: X(PObjecao), props: {pergunta: 'e se você estragar o meu vídeo?', resposta: 'não estraga', respostaEm: 1}, troca: 'zoom', brilho: [30, 70], cam: OBJ},
  {frases: [23, 25], C: X(PPastaDentro), props: {dividir: 0, prontas: true, travar: 0, novo: 1, denovo: 2}, troca: 'corte', cam: [[0, 700, 480, 1.14], [1, 960, 580, 1.12], [2, 1160, 600, 1.12]], sons: [['gaveta', 'p:trancado']]},
  {frases: [26, 27], C: X(PMontado), troca: 'zoom', cam: [[0, 960, 420, 1.04], [1, 960, 600, 1.12]]},
  {frases: [28, 29], C: F, props: {texto: 'eu ainda não sei | o que tem *dentro | do seu vídeo', tam: 112, sub: 'o nível 1 começa resolvendo', subFrase: 1}, troca: 'sobe', sons: [['subida', 'f1+40', -3]]},
];

// ---------------- Cena 3 · Nível 1: Limpar ----------------
const C3: Plano[] = [
  {frases: [0, 3], C: X(PNivel), props: {n: 1}, troca: 'corte', cam: [[0, 960, 440, 1.0], [2, 900, 600, 1.08], ['doze', 760, 640, 1.2]], sons: [['batida', 'p:doze']]},
  {frases: [4, 4], C: F, props: {texto: 'o *segredo | de tudo', tam: 170}, troca: 'sobe'},
  {frases: [5, 6], C: F, props: {texto: 'eu não *assisto. | eu *leio.', tam: 150}, troca: 'zoom', cam: [[0, 960, 520, 1.0], ['leio', 960, 600, 1.3]], sons: [['batida', 'p:leio']]},
  {frases: [7, 7], C: X(POnda), props: {varrer: 0, temposPalavra: 'momento', rotulo: 'WHISPER · GRÁTIS · RODA NO SEU COMPUTADOR'}, troca: 'desliza', brilho: [30, 30], cam: [[0, 700, 500, 1.1], ['ouve', 900, 520, 1.16], ['momento', 1200, 580, 1.2]], sons: [['deslize', 10]]},
  {frases: [8, 9], C: T, props: {rotulo: 'VOCÊ ESCREVE', pedido: 'transcreva este vídeo palavra por palavra', pedidoEm: 1}, troca: 'desliza', cam: [[0, 960, 540, 1.04], [1, 860, 520, 1.22]], sons: teclas('f1')},
  {frases: [10, 11], C: X(PAnalogiaFilme), troca: 'zoom', brilho: [24, 72], cam: [[0, 760, 640, 1.1], [1, 1000, 460, 1.1]]},
  {frases: [12, 12], C: X(PMapa), props: {erro: 'errou', silencio: 'silêncio', forte: 'forte'}, troca: 'zoom', brilho: [78, 28], cam: [[0, 960, 480, 1.06], ['silêncio', 960, 540, 1.14], ['forte', 960, 600, 1.18]], sons: [['corte', 'p:errou'], ['desliga', 'p:silêncio'], ['brilho', 'p:forte']]},
  {frases: [13, 13], C: K, props: {etiqueta: 'AÍ ENTRAM DUAS FERRAMENTAS', cartoes: [{n: '01', titulo: 'auto-editor', sub: 'tira o silêncio'}, {n: '02', titulo: 'FFmpeg', sub: 'corta e junta'}], quando: [0, 0], colunas: 2, foco: false, tamTitulo: 80}, troca: 'sobe', sons: [['estalo_madeira', 'f0+8']]},
  {frases: [14, 16], C: X(PSilencioReal), props: {medir: 1}, troca: 'desliza', brilho: [24, 72], cam: [[0, 960, 480, 1.04], [1, 620, 440, 1.16], ['pausa', 500, 480, 1.2], ['morto', 1300, 480, 1.2], ['outra', 960, 560, 1.02]], sons: [['deslize', 'p:outra+10']]},
  {frases: [17, 20], C: X(PComandosReal), props: {euEm: 3}, troca: 'desliza', brilho: [78, 30], cam: [[0, 960, 440, 1.04], ['corta', 960, 400, 1.12], ['muda', 960, 620, 1.12], [3, 760, 780, 1.14]], sons: [['tecla', 'p:corta'], ['tecla', 'p:junta'], ['tecla', 'p:muda']]},
  {frases: [21, 22], C: T, props: {rotulo: 'O SEU PEDIDO É ESTE', pedido: 'Tire os silêncios e os erros deste vídeo, mas me mostre a lista de cortes antes de cortar.', pedidoEm: 1, tam: 42}, troca: 'sobe', cam: [[0, 960, 540, 1.04], [1, 800, 500, 1.24], ['lista', 960, 540, 1.04]], sons: teclas('f1')},
  {frases: [23, 24], C: X(PLista), props: {itens: [['02:00', 'erro: frase errada'], ['07:00', 'repetição'], ['11:40', 'silêncio de 6 s']], quando: [0, 1, 1], aprovar: 1}, troca: 'sobe', cam: [[0, 960, 420, 1.08], ['aprova', 960, 640, 1.18]], sons: [['clique', 'p:aprova+4'], ['sucesso', 'p:aprova+7']]},
  {frases: [25, 25], C: X(PEntreReal), troca: 'zoom', cam: [[0, 960, 480, 1.02], ['entre', 960, 420, 1.2], ['meio', 960, 600, 1.08]], sons: [['corte', 'p:entre+4']]},
  {frases: [26, 27], C: X(PObjecao), props: {pergunta: 'e se eu gosto de editar do meu jeito?', resposta: 'fica à vontade', respostaEm: 1}, troca: 'zoom', brilho: [30, 70], cam: OBJ},
  {frases: [28, 28], C: X(PEditores), props: {entrega: 0}, troca: 'desliza', brilho: [28, 30], cam: [[0, 960, 420, 1.08], ['programa', 960, 620, 1.1]], sons: [['estalo', 'p:programa']]},
  {frases: [29, 29], C: X(PMeta), props: {n: 1}, troca: 'zoom', cam: [[0, 960, 480, 1.0], ['batida', 1000, 500, 1.18]], sons: [['sucesso', 'p:batida+2']]},
  {frases: [30, 31], C: X(PFone), troca: 'sobe', brilho: [70, 30], cam: [[0, 960, 340, 1.12], [1, 960, 500, 1.1], ['deixou', 960, 620, 1.16]]},
  {frases: [32, 33], C: F, props: {texto: '*limpo | ainda não é bom', tam: 150, sub: 'bora para o nível 2', subFrase: 1}, troca: 'zoom', sons: [['subida', 'f1+20', -3]]},
];

// ---------------- Cena 4 · Nível 2: Cortes ----------------
const PEDIDO_CORTES = 'Encontre os dez melhores trechos deste vídeo, com até um minuto cada, corte na vertical e coloque legenda palavra por palavra.';
const C4: Plano[] = [
  {frases: [0, 3], C: X(PNivel), props: {n: 2}, troca: 'corte', cam: [[0, 960, 440, 1.0], [2, 960, 600, 1.06], ['dez', 960, 680, 1.14]], sons: [['batida', 'p:dez']]},
  {frases: [4, 4], C: K, props: {titulo: 'você tem', cartoes: [{titulo: 'um podcast'}, {titulo: 'uma aula'}, {titulo: 'uma live'}], quando: ['podcast', 'aula', 'live']}, troca: 'sobe', cam: [[0, 700, 540, 1.08], ['live', 1220, 560, 1.1]]},
  {frases: [5, 6], C: T, props: {rotulo: 'O SEU PEDIDO', pedido: PEDIDO_CORTES, pedidoEm: 1, tam: 40}, troca: 'desliza', cam: [[0, 960, 540, 1.04], [1, 800, 500, 1.24], ['coloque', 960, 540, 1.04]], sons: teclas('f1')},
  {frases: [6, 7], inicio: ['leio'], C: X(PDezCortes), props: {soltar: 0}, troca: 'zoom', brilho: [28, 28], cam: [[0, 960, 320, 1.16], ['escolho', 620, 620, 1.16], ['dez', 1300, 620, 1.12]], sons: [['corte', 20], ['deslize', 44]]},
  {frases: [8, 10], C: X(PRemotionLegenda), troca: 'desliza', brilho: [70, 30], cam: [[0, 800, 520, 1.06], [1, 1180, 520, 1.1], [2, 900, 640, 1.06]], sons: [['revela', 'f1+34']]},
  {frases: [11, 12], C: X(PReceita), troca: 'sobe', brilho: [24, 30], cam: [[0, 800, 470, 1.06], [1, 1120, 470, 1.08]]},
  {frases: [13, 13], C: X(PPalavraAcende), troca: 'zoom', cam: [[0, 960, 380, 1.08], ['acende', 760, 620, 1.14], ['sei', 1160, 680, 1.12]], sons: [['tique', 'p:acende']]},
  {frases: [14, 15], C: X(PObjecao), props: {pergunta: 'e se você escolher o trecho errado?', resposta: 'por isso a dica', respostaEm: 1}, troca: 'zoom', brilho: [30, 70], cam: OBJ},
  {frases: [16, 17], C: X(PBilhetes), troca: 'sobe', cam: [[0, 700, 360, 1.12], ['explicar', 800, 600, 1.14], [1, 1000, 680, 1.08]]},
  {frases: [18, 19], C: X(PMeta), props: {n: 2, sub: 'um vídeo longo virou dez peças curtas', subFrase: 1}, troca: 'zoom', cam: [[0, 960, 480, 1.0], ['batida', 1000, 500, 1.16], [1, 960, 660, 1.08]], sons: [['sucesso', 'p:batida+2']]},
  {frases: [20, 21], C: X(PCongela), troca: 'corte', cam: [[0, 960, 500, 1.12], [1, 960, 540, 1.0]], sons: [['subida', 'f1+50', -3]]},
];

// ---------------- Cena 5 · Nível 3: O vídeo inteiro ----------------
const C5: Plano[] = [
  {frases: [0, 3], C: X(PNivel), props: {n: 3}, troca: 'corte', cam: [[0, 960, 440, 1.0], [2, 700, 620, 1.1], ['pronto', 1240, 640, 1.12]], sons: [['batida', 'p:pronto']]},
  {frases: [4, 4], C: X(PCrua), props: {titulo: ['uma hora gravada, errando e', 'repetindo']}, troca: 'desliza', brilho: [70, 70], cam: [[0, 700, 600, 1.14], ['repetindo', 1160, 440, 1.08]]},
  {frases: [5, 6], C: T, props: {rotulo: 'O PEDIDO', pedido: 'Junte estas gravações, tire os erros e os silêncios, e monte um vídeo de quinze minutos.', pedidoEm: 1, tam: 42, linhas: [['transformando tudo em texto', 'transformo']]}, troca: 'desliza', cam: [[0, 960, 540, 1.04], [1, 800, 480, 1.24], ['transformo', 900, 620, 1.12]], sons: teclas('f1')},
  {frases: [7, 7], C: X(PRepetidas), props: {repetiu: 0}, troca: 'zoom', brilho: [26, 70], cam: [[0, 960, 400, 1.1], ['melhor', 960, 640, 1.18]], sons: [['corte', 'p:vezes'], ['brilho', 'p:melhor']]},
  {frases: [8, 8], C: X(PLista), props: {itens: [['00:42', 'takes 1 e 2 fora, fica o 3'], ['03:10', 'silêncio de 4 s'], ['09:55', 'frase repetida']], quando: [0, 0, 0], aprovar: 0}, troca: 'sobe', cam: [[0, 960, 400, 1.1], ['lista', 960, 600, 1.16]], sons: [['estalo_madeira', 'f0+4']]},
  {frases: [9, 9], C: F, props: {texto: 'depois vem | a *animação', tam: 170}, troca: 'zoom'},
  {frases: [10, 11], C: X(PTudoCodigo), troca: 'corte', cam: [[0, 960, 500, 1.02], [1, 700, 540, 1.1], ['câmera', 1220, 540, 1.1]]},
  {frases: [12, 13], C: X(PPedidoMini), props: {pedido: 'Faça o título da abertura entrar no segundo três e a câmera se aproximar.', pedidoEm: 1}, troca: 'sobe', cam: [[0, 700, 460, 1.1], ['entrar', 1240, 460, 1.14], ['aproximar', 1400, 460, 1.22]], sons: teclas('f1')},
  {frases: [13, 15], inicio: ['olh'], C: X(PCodigo), props: {mudar: 2}, troca: 'zoom', brilho: [76, 30], cam: [[0, 1300, 540, 1.12], [1, 620, 540, 1.16], ['mudo', 640, 540, 1.24], ['personagem', 1320, 540, 1.18]], sons: [['tecla', 'p:mudo+12'], ['deslize', 'p:personagem']]},
  {frases: [16, 17], C: T, props: {rotulo: 'POR ÚLTIMO', pedido: 'exporte o vídeo final', pedidoEm: 1}, troca: 'desliza', cam: [[0, 960, 540, 1.04], [1, 820, 520, 1.26]], sons: teclas('f1')},
  {frases: [18, 18], C: X(PExportar), props: {juntar: 0}, troca: 'desliza', brilho: [24, 30], cam: [[0, 900, 480, 1.06], ['arquivo', 1040, 560, 1.1]], sons: [['sucesso', 'p:youtube']]},
  {frases: [19, 19], C: X(PConfere), props: {itens: 0, fotos: 0}, troca: 'sobe', cam: [[0, 960, 500, 1.04], ['preta', 820, 560, 1.08], ['legenda', 1100, 580, 1.08]], sons: [['camera', 'p:fotos'], ['desliga', 'p:preta']]},
  {frases: [20, 21], C: X(PObjecao), props: {pergunta: 'e se a primeira versão sair ruim?', resposta: 'pode sair', respostaEm: 1}, troca: 'zoom', brilho: [30, 70], cam: OBJ},
  {frases: [22, 25], C: X(PVersoes), props: {quando: [0, 0, 0, 0, 0], imagens: [1, 3, 2, 4, 5], rotulos: ['linha do tempo deitada', 'colorida demais', 'câmera parada', '3D em tudo', 'a atual'], chavesRotulo: ['deitada', 'colorida'], etiqueta: 'A ABERTURA DESTE VÍDEO · O CRISTIAN ASSISTIU CADA VERSÃO'}, troca: 'zoom', cam: [[0, 520, 440, 1.3], [1, 960, 460, 1.0], ['deitada', 520, 440, 1.3], ['colorida', 800, 440, 1.3], ['demais', 1300, 440, 1.2]], sons: [['camera', 14]]},
  {frases: [26, 26], C: K, props: {titulo: 'ainda entrego', etiqueta: 'COMO EU JÁ LI O VÍDEO INTEIRO', cartoes: [{titulo: 'Título'}, {titulo: 'Descrição'}, {titulo: 'Capítulos', sub: 'com o tempo certo'}], quando: ['título', 'descrição', 'capítulos']}, troca: 'desliza', cam: [[0, 800, 520, 1.06], ['capítulos', 1120, 550, 1.08]], sons: [['estalo_madeira', 'p:título']]},
  {frases: [27, 28], C: X(PEscadaFinal), troca: 'corte', fundo: false, sons: [['whoosh_longo', 'f0+4']]},
];

// ---------------- Cena 6 · As três regras ----------------
const C6: Plano[] = [
  {frases: [0, 2], C: X(PRegra1), props: {n: 1, palavra: 'APROVE', tipo: 'aprove'}, troca: 'corte', cam: [[0, 700, 420, 1.1], [1, 1000, 440, 1.1], [2, 1060, 700, 1.1]], sons: [['estalo_madeira', 'f1+2']]},
  {frases: [3, 6], C: X(PRegra1), props: {n: 2, palavra: 'PEÇA POR PARTES', tipo: 'partes'}, troca: 'desliza', cam: [[0, 700, 420, 1.1], [1, 1000, 440, 1.08], [2, 1060, 600, 1.1], [3, 1000, 720, 1.1]], sons: [['estalo_madeira', 'f1+2']]},
  {frases: [7, 9], C: X(PRegra1), props: {n: 3, palavra: 'ASSISTA', tipo: 'assista'}, troca: 'desliza', cam: [[0, 700, 420, 1.1], [1, 1000, 440, 1.1], [2, 1060, 640, 1.1]], sons: [['estalo_madeira', 'f1+2'], ['sucesso', 'p:corrijo']]},
  {frases: [10, 11], C: X(PRegrasJuntas), troca: 'zoom', cam: [[0, 960, 380, 1.04], [1, 960, 640, 1.12]]},
  {frases: [12, 13], C: F, props: {texto: 'o que eu prometi: | quanto *custa?', tam: 160}, troca: 'zoom', cam: [[0, 960, 500, 1.0], ['custa', 960, 540, 1.26]]},
];

// ---------------- Cena 7 · A conta ----------------
const C7: Plano[] = [
  {frases: [0, 0], C: F, props: {texto: 'bora fazer | a *conta', tam: 180}, troca: 'corte'},
  {frases: [1, 6], C: X(PConta), props: {ferramentas: 0, claude: 2, valor: 4, nota: 'em dólar: o cartão converte para reais', notaEm: 5}, troca: 'desliza', brilho: [78, 30], cam: [[0, 960, 480, 1.02], [2, 960, 580, 1.08], ['vinte', 1080, 620, 1.16], [5, 1000, 660, 1.08]], sons: [['tique', 'p:zero'], ['batida', 'p:vinte']]},
  {frases: [7, 7], C: K, props: {etiqueta: 'AGORA TIRA UM PRINT', cartoes: [{n: '01', titulo: 'Whisper', sub: 'transcreve'}, {n: '02', titulo: 'auto-editor', sub: 'tira o silêncio'}, {n: '03', titulo: 'FFmpeg', sub: 'corta e exporta'}, {n: '04', titulo: 'Remotion', sub: 'anima e legenda'}], quando: [0, 0, 0, 0], foco: false, tamTitulo: 50}, troca: 'zoom', cam: [[0, 960, 540, 1.0]], sons: [['camera', 'f0+16']]},
  {frases: [8, 12], C: K, props: {titulo: 'o que não funciona', cartoes: [{titulo: 'A primeira versão quase nunca é a boa'}, {titulo: 'O plano tem limite de uso'}, {titulo: 'Material ruim, vídeo ruim', sub: 'eu só trabalho com o que está na pasta'}], quando: [1, 2, 3], tamTitulo: 50}, troca: 'sobe', brilho: [24, 72], cam: TRES, sons: [['desliga', 'f1+2'], ['desliga', 'f2+2'], ['desliga', 'f3+2']]},
  {frases: [13, 14], C: X(PCaixa), troca: 'zoom', cam: [[0, 960, 480, 1.0], [1, 960, 600, 1.2]]},
];

// ---------------- Cena 8 · Fechamento ----------------
const NOMES = ['Gancho', 'Ambiente', 'Nível 1', 'Nível 2', 'Nível 3', 'Regras', 'Conta', 'Fim'];
const C8: Plano[] = [
  {frases: [0, 4], C: X(PLinhaVideo), props: {cenas: NOMES, duracoes: [43, 73, 106, 68, 93, 30, 37, 50]}, troca: 'corte', cam: [[0, 560, 450, 1.3], ['limpar', 760, 450, 1.3], ['montar', 1200, 460, 1.3], [4, 960, 560, 1.03]], sons: [['deslize', 'f1+4'], ['batida', 'p:nenhum']]},
  {frases: [5, 5], C: F, props: {texto: 'eu não substituo | o seu *olhar', tam: 130}, troca: 'zoom'},
  {frases: [6, 8], C: X(PBalanca), troca: 'desliza', brilho: [26, 30], cam: [[0, 760, 480, 1.06], ['ideia', 1180, 460, 1.1], [2, 960, 620, 1.05]], sons: [['revela', 'p:ideia-4']]},
  {frases: [9, 10], C: X(PCanalDark), troca: 'zoom', cam: [[0, 700, 520, 1.12], ['canal', 1200, 460, 1.1], [1, 1200, 560, 1.14]]},
  {frases: [11, 12], C: X(PHoje), troca: 'sobe', cam: [[0, 960, 500, 1.0], [1, 760, 520, 1.08], ['hoje', 1240, 480, 1.2]], sons: [['batida', 'p:hoje']]},
  {frases: [13, 14], C: K, props: {titulo: 'o primeiro passo', cartoes: [{n: '01', titulo: 'Abre a aba Code'}, {n: '02', titulo: 'Cria a pasta'}, {n: '03', titulo: 'Escreve o primeiro pedido'}, {n: '↓', titulo: 'Link do aplicativo', sub: 'na descrição'}], quando: ['abre', 'cria', 'escreve', 1], colunas: 4, tamTitulo: 46}, troca: 'desliza', brilho: [26, 30], cam: [[0, 700, 500, 1.1], ['escreve', 1000, 560, 1.1], [1, 1320, 580, 1.14]], sons: [['estalo_madeira', 'p:abre']]},
  {frases: [15, 17], C: X(PComentar), troca: 'sobe', cam: [[0, 960, 420, 1.02], [1, 960, 560, 1.14], [2, 960, 680, 1.14]], sons: [['estalo', 'p:gostou', -2], ['estalo', 'p:quer', -2]]},
  {frases: [18, 18], C: X(PSininho), troca: 'sobe', cam: [[0, 960, 540, 1.0], ['sininho', 1160, 520, 1.16]], sons: [['brilho', 'p:sininho']]},
  {frases: [19, 21], C: X(PSaudacao), props: {linha1: 'Valeu, galera!', linha2: 'até a próxima', quando2: 1}, troca: 'zoom', cam: [[0, 960, 540, 1.16], [2, 960, 540, 0.96]]},
];

const CAUDA: Record<number, number> = {1: 20};
// planos de frase central: a câmera pode dar o soco de zoom
const CENTRAIS = [F, X(PZero), X(PSaudacao), X(PAmbiente), X(PMontado), X(PCaixa), X(PMovimentos)];
[C1, C2, C3, C4, C5, C6, C7, C8].forEach((lista) => lista.forEach((pl) => {
  if (CENTRAIS.includes(pl.C)) pl.soco = true;
}));

export const CENAS: Record<number, {planos: Plano[]; abertura?: Abertura}> = {
  1: {planos: C1},
  2: {planos: C2},
  3: {planos: C3, abertura: abre(1, 'LIMPAR')},
  4: {planos: C4, abertura: abre(2, 'CORTES')},
  5: {planos: C5, abertura: abre(3, 'O VÍDEO INTEIRO')},
  6: {planos: C6},
  7: {planos: C7},
  8: {planos: C8},
};

export const fazerCena = (numero: number): React.FC => {
  const Componente: React.FC = () => <Cena numero={numero} planos={CENAS[numero].planos} abertura={CENAS[numero].abertura} cauda={CAUDA[numero] ?? 0} />;
  return Componente;
};
export const caudaDe = (numero: number) => CAUDA[numero] ?? 0;
