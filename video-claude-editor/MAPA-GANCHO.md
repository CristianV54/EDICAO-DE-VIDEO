# Mapa de animações: cena 1, o gancho (versão 5)

Feito depois da crítica do Cristian à versão 1, seguindo o fluxo de edição de Lucas Leite (github.com/LeiteZ/fluxo-de-edicao), que ele indicou. Este arquivo é o plano das animações do gancho. O código está em `src/cenas/Gancho.tsx`.

## O que o Cristian criticou na versão 1

1. Legenda o tempo todo. Ele quer texto só nas palavras de destaque.
2. Fundo sem graça.
3. Quando a fala diz "movimento de câmera", a câmera só andava de lado.
4. Linha do tempo deitada. Ele quer em pé.
5. Faltam coisas acontecendo.
6. Ele não quer ter de chamar a atenção para cada detalhe.

## Regras tiradas do fluxo e aplicadas aqui

- **Crítica de qualidade geral pede refazer, não retocar.** A versão 1 foi descartada e a cena foi reescrita.
- **O que aparece nasce do que está sendo dito.** "Cinco passos" virou uma escada de cinco degraus. "Animação" virou uma curva com pontos-chave e um objeto andando nela. "Canal dark" apaga a luz do ambiente.
- **Um protagonista por vez.** Em cada momento só um elemento chama a atenção.
- **Câmera fluida.** Um caminho só por pontos-chave, sem a velocidade cair a zero entre eles. A aproximação e a deriva lenta correm juntas.
- **Hierarquia de velocidade.** Elementos entram em cerca de 15 quadros, saem em cerca de 8, e a câmera é lenta, de 1,5 a 3,5 segundos por movimento.
- **Troca de trecho com speed ramp.** A saída acelera, o corte cai no quadro mais rápido com desfoque de movimento, e o trecho novo chega na mesma direção e freia devagar.
- **Texto com tempo de leitura.** A palavra entra em 8 quadros, fica, e sai em 8.
- **Profundidade.** Chão em grade com reflexo, névoa, painéis de linha do tempo ao longe e poeira no ar, tudo se movendo devagar na periferia.

## Storyboard

Tempos em quadros a 30 por segundo, estimados pelo texto. Serão refeitos pelas palavras da narração quando o áudio chegar.

| Nº | Quadros | Fala | Conceito | Câmera | Palavra em destaque | Saída |
|---|---|---|---|---|---|---|
| mo01 | 0 a 105 | "Este vídeo foi editado inteiro por mim, o Claude." | Uma linha do tempo em pé, do tamanho de uma parede, se monta sozinha: os clipes voam de trás da câmera e encaixam nas faixas V2, V1, A1 e A2. O bloco do Claude chega girando e vira o herói no centro | Começa colada num clipe e recua revelando a parede inteira, sem parar de recuar | 100% CLAUDE | O bloco encolhe e vira a cabeça da agulha |
| mo02a | 105 a 140 | "Cada corte," | A agulha, puxada pelo bloco do Claude, corre até um trecho, que fica vermelho. Ela bate, solta um clarão, e o pedaço voa girando em direção à câmera. Os clipes da direita fecham o buraco | Aproxima do ponto do corte | CORTE | emenda |
| mo02b | 140 a 175 | "cada animação," | Uma curva branca se desenha por cima da parede, quatro pontos-chave laranja estouram em cascata, e um cubo percorre a curva acelerando e freando | Sobe e desliza para a curva | ANIMAÇÃO | a curva some |
| mo02c | 175 a 210 | "cada movimento de câmera." | Agora quem se mostra é a câmera: ela dá a volta pela lateral da parede, sobe, inclina para os dois lados, passa por cima e mergulha para o outro lado | Órbita, subida, giro de até 18 graus e mergulho | CÂMERA | speed ramp para baixo e para frente |
| mo03 | 210 a 285 | "Ninguém abriu um programa de edição." | Atrás da parede, os ícones do Premiere e do DaVinci flutuam acesos. Um de cada vez, eles piscam, apagam, racham, soltam estilhaços e caem no chão quicando | Chega do mergulho e freia, depois segue se aproximando | 0 PROGRAMAS | speed ramp para a direita |
| mo04 | 285 a 420 | "As únicas coisas humanas aqui são a voz e o botão de aprovar." | Um microfone grande no centro, com barras de voz pulsando dos dois lados. Na palavra "voz" a câmera dá um soco de zoom. Depois ela desliza até um botão verde APROVAR, e um cursor chega em arco e clica | Chega da esquerda, aproxima devagar, soco de zoom, passo lateral até o botão | A VOZ. O botão já traz a palavra APROVAR | speed ramp para cima |
| mo05 | 420 a 555 | "Em cinco passos, eu te mostro como fazer o mesmo com os seus vídeos:" | Uma escada de cinco degraus numerados sobe do chão em cascata. O mascote sobe pulando, e cada degrau acende em laranja quando ele pousa | Chega de baixo, acompanha a subida como uma grua e recua mostrando a escada inteira | 5 PASSOS | speed ramp para a direita |
| mo06 | 555 a 690 | "cortes curtos, vídeos longos e até um canal dark inteiro." | Três objetos em fila, um por vez: um celular na vertical com a legenda trocando, uma tela larga com linha do tempo comprida e agulha andando, e um cartão preto com uma pessoa sem rosto. No terceiro, a luz do ambiente apaga | Para em cada um e dá um passo rápido até o próximo | Os nomes ficam embaixo de cada objeto: CORTES, VÍDEOS LONGOS, CANAL DARK | speed ramp para a direita |
| mo07 | 690 a 825 | "Com o nome de cada ferramenta e o pedido exato que você escreve." | Cinco caixas com os nomes das ferramentas caem numa prateleira, em cascata, amassando ao bater. Depois sobe uma barra de pedido e o texto é digitado | Aproxima devagar e inclina para baixo abrindo espaço para a barra | Nenhuma: os nomes estão nas caixas e o pedido está na barra | mergulho para frente |
| mo08 | 825 a 900 | "Passo um." | A escada de volta, só o degrau 1 aceso. A câmera mergulha até o número 1 encher a tela | Mergulho do plano aberto até o degrau | PREPARAR | clarão laranja para a cena 2 |

## Mudanças da versão 3

Crítica do Cristian à versão 2, em 23/11/2026: a curva com losangos não representa animação, o movimento de câmera ainda estava fraco, o microfone ficava tempo demais sozinho, o celular e a tela larga estavam vazios, e o fundo era sempre o mesmo. Ele também pediu que eu resolva esse tipo de coisa sozinho, sem ele precisar apontar.

| Trecho | O que mudou |
|---|---|
| mo02b, "animação" | Saiu a curva. Um quadro salta da parede com animação de papel recortado: um boneco pulando, sol girando, nuvens e estrelas. Embaixo, cinco pontos-chave acendem conforme a agulhinha passa |
| mo02c, "câmera" | Ganhou 15 quadros. A câmera dá uma volta de cerca de 270 graus em torno da parede, sobe, inclina para os dois lados, abre a lente de 40 para 58 graus e fecha de novo, e mostra o verso da parede |
| mo03 | Ambiente roxo, diferente do estúdio |
| mo04, "a voz" | Encurtado de 135 para 125 quadros. Um boneco humano de papel fala no microfone, e a voz sai como uma onda viajando para um lado. Depois do clique no botão, outro boneco comemora. Ambiente de estúdio de gravação, com espuma acústica |
| mo05 e mo08 | Ambiente de céu azul com um sol laranja atrás da escada |
| mo06 | O celular mostra um vídeo vertical de papel, com corte seco a cada meio segundo e legenda. A tela larga mostra o dia virando noite com o boneco andando e o relógio correndo. O canal dark mostra uma cidade à noite, o narrador sem rosto e a voz em barras. Ambiente rosa |
| mo07 | Ambiente de oficina, com parede de furos |
| Abertura | Os clipes já estão chegando no quadro zero, para a tela não abrir vazia |

Regra nova para o resto do vídeo: toda tela que aparecer (celular, monitor, janela) mostra alguma coisa acontecendo dentro, e cada trecho tem o seu ambiente.

## Mudanças das versões 4 e 5

A versão 4 trocou a animação de papel por letras e elementos de edição, e os painéis do fundo por luzes desfocadas. O Cristian não aprovou a animação e disse que o que incomodava era poluição visual e excesso de cores. Ele mandou um trecho de referência: fundo quase preto, uma cor só de destaque, uma linha fina e brilhante se desenhando, e texto branco com uma palavra colorida.

Versão 5, em 23/11/2026:

| Item | O que mudou |
|---|---|
| Paleta | Quase preto, cinzas, branco quente e uma única cor de destaque, o laranja. Está em `src/tema.ts`, no objeto `N`. Os clipes da linha do tempo ficaram cinza. Só o trecho cortado fica vermelho |
| Ambientes | A cor é a mesma em todos os trechos. O que muda é a posição do brilho e a estrutura: espuma acústica cinza, parede de furos cinza, sol laranja atrás da escada |
| Monitor | Em cima da linha do tempo entra um monitor de programa, mostrando o que está sendo editado, com relógio correndo |
| mo02b, "animação" | A câmera entra no monitor. Uma linha laranja se desenha a partir de uma base tracejada, com pontos-chave, e dispara para cima enquanto a câmera segue a ponta. O texto "cada animação, desenhada em código" entra dentro da cena |
| Telas de papel | As animações dentro do celular e da tela larga perderam a maior parte da saturação |
| Botão APROVAR | Deixou de ser verde. É claro, com clarão laranja no clique |
| Caixas das ferramentas | Todas cinza-escuro, com um traço laranja |

Regra nova para o resto do vídeo: uma cor de destaque só. Cor fora da paleta só entra quando tem significado, como o vermelho do trecho cortado e as cores dos ícones do Premiere e do DaVinci.

## O que ainda falta e depende de outras fases

- **Sincronia com a fala:** as palavras em destaque entram em tempos estimados. Com a narração, cada uma entra na palavra exata.
- **Som:** cada batida da tabela (clipe encaixando, agulha batendo, vidro, clique, degrau acendendo, caixa caindo) é um ponto de efeito sonoro para a fase 7.
- **Perfil de estilo:** o fluxo pede medir de 5 a 10 trechos de vídeos de que o Cristian gosta. Hoje o estilo vem das capas que ele enviou e das críticas dele. Se ele mandar trechos de vídeo, eu meço curvas e velocidades e ajusto.
