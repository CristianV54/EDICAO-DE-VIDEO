# Checklist real (v2), 48 stills abertos um a um

Cada linha foi escrita depois de abrir o PNG correspondente (1080x1920) em `verificacao/`. Nenhum "ok" foi marcado sem olhar o still.
Legenda: **ok** = passou; **FALHA** = não passou (só anotado, sem correção); **parcial** = passou em parte (descrito na própria linha); **n/a** = não se aplica a esse plano.
Itens: peça (visível, centro, 35% a 55% da largura nos closes, sem corte), chão/tapete (aparecem em volta), fotógrafo (visível com a câmera na mão nos planos de contexto), telão (estado certo no ato 1),
problema (encenado na cena, não só na etiqueta), sobreposição (legenda, título, card, contador, etiquetas sem se cobrirem nem cobrirem a peça), contador/texto (número certo, sem travessão, acentos corretos).
Distância mínima entre objetos: ver `verificacao/distancias.txt` (menor valor 1,08, mínimo exigido 0,9).
Busca de travessão (`LC_ALL=C grep -rnP "\xE2\x80\x94|\xE2\x80\x93"` em `src/` e `scripts/`): nenhuma ocorrência.



## s00

### `s00_a_momento.png`
**O que vejo:** Fotógrafo no canto esquerdo (x 100-420, y 400-960) segurando a câmera preta com seletor AUTO e lente do kit cinza; casal de amigos à direita, de perfil, com o noivo na frente e quase cobrindo a noiva (só o cabelo dela aparece). Sem contador (correto), sem card, sem telão (correto), legenda "se" em y 1190. Parede e chão de madeira só no terço superior, sem tapete; plataforma escura ocupa cerca de 60% da tela.

| peça | chão/tapete | fotógrafo | telão | problema | sobreposição | contador/texto |
|---|---|---|---|---|---|---|
| ok | FALHA (sem tapete, 60% escuro) | ok | n/a | n/a | FALHA (noiva escondida atrás do noivo) | ok |

### `s00_b_problema.png`
**O que vejo:** Mesmo plano: fotógrafo à esquerda com a câmera no peito (não está ao rosto, o clique já passou), etiqueta vermelha "FOTÓGRAFO?" em y 480 cobrindo o rosto dele; casal à direita; legenda "fotógrafo" em y 1190. Sem contador (correto). Faixa vertical de sombra com borda reta visível no chão da plataforma embaixo (x 515, y>1500).

| peça | chão/tapete | fotógrafo | telão | problema | sobreposição | contador/texto |
|---|---|---|---|---|---|---|
| ok | FALHA (sem tapete) | ok | n/a | parcial (só a etiqueta; flash e câmera ao rosto já passaram neste frame) | FALHA (etiqueta tapa o rosto do fotógrafo) | ok |

### `s00_c_solucao.png`
**O que vejo:** Plano abrindo logo após "treze": fotógrafo com câmera na mão e rosto visível à esquerda, casal à direita, contador "PEÇAS 0/13" no canto superior direito, legenda "treze" em y 1190. Quadros na parede, pedaço de tapete azul e LEDs dourados no canto inferior esquerdo; plataforma escura ocupa 65% da tela e mostra blocos retangulares de sombra com bordas retas.

| peça | chão/tapete | fotógrafo | telão | problema | sobreposição | contador/texto |
|---|---|---|---|---|---|---|
| ok | parcial (só um canto de tapete) | ok | n/a | n/a | ok | ok (0/13) |


## s01

### `s01_a_momento.png`
**O que vejo:** Fotógrafo grande no centro (x 140-850), câmera com brilho dourado do pulso (parece cor de oliva), AUTO no seletor e lente do kit cinza; ocupa cerca de 75% da largura. O card "comprar uma câmera ✓" cobre a testa e o cabelo dele. Contador 1/13, legenda "existe" y 1180. O telão não aparece no quadro. Chão de madeira e parede atrás, plataforma escura embaixo (45%).

| peça | chão/tapete | fotógrafo | telão | problema | sobreposição | contador/texto |
|---|---|---|---|---|---|---|
| FALHA (75% da largura, acima de 55%) | parcial (madeira sim, tapete não) | ok | FALHA (não aparece no momento em que nasce) | n/a | FALHA (card cobre a cabeça do fotógrafo) | ok (1/13) |

### `s01_b_problema.png`
**O que vejo:** Plano de contexto: fotógrafo inteiro à esquerda com a câmera (AUTO) e etiqueta "MODO AUTO" em y 480 ao lado da cabeça; telão à direita no estado `auto` (cinza azulado dessaturado, casal de amigos; o selo "AUTO" do canto está fora do quadro); a noiva da direita aparece cortada pela borda. Card "comprar uma câmera ✓", contador 1/13 (por cima da borda do telão), legenda "automático" y 1180. Chão de madeira visível, sem tapete, plataforma escura embaixo (40%).

| peça | chão/tapete | fotógrafo | telão | problema | sobreposição | contador/texto |
|---|---|---|---|---|---|---|
| ok (câmera visível, contexto) | parcial (madeira sim, tapete não) | ok | ok (`auto`) | ok (telão acinzentado + etiqueta; o seletor não pisca vermelho neste frame) | ok (card cobre só a borda do telão) | ok |

### `s01_c_solucao.png`
**O que vejo:** Fotógrafo à esquerda com a cabeça cortada pela borda, câmera com seletor "M" verde, etiqueta verde "APRENDE O MANUAL" em y 555; telão `manual` (pôr do sol laranja, casal nítido) ocupando a metade direita; casal de amigos grande em primeiro plano à direita, o noivo tapando parte da noiva e a parte de baixo do telão. Card, contador 1/13, legenda "caro" y 1180.

| peça | chão/tapete | fotógrafo | telão | problema | sobreposição | contador/texto |
|---|---|---|---|---|---|---|
| ok (câmera visível, contexto) | parcial (madeira sim, tapete não) | FALHA (cabeça cortada pela borda esquerda) | ok (`manual`) | n/a | FALHA (casal tapa a parte de baixo do telão) | ok |


## s02

### `s02_a_momento.png`
**O que vejo:** Momento da peça = "cinquenta": a lente 50mm preta com anéis dourados e "50mm" está no ar no centro (x 540-700, y 970-1140), a caminho da câmera; a lente cinza do kit ainda está na câmera do fotógrafo (esquerda, cabeça cortada pela borda); telão à direita no estado `cinquenta` (igreja desfocada, casal nítido); casal à direita. Card com ✓, contador 2/13, etiqueta verde "50MM" em y 555, legenda "cinquenta" y 1180 encostando na base da lente.

| peça | chão/tapete | fotógrafo | telão | problema | sobreposição | contador/texto |
|---|---|---|---|---|---|---|
| FALHA (lente 50mm ocupa cerca de 15% da largura; plano é de contexto, mas a peça fica pequena e a legenda encosta nela) | parcial (madeira sim, tapete não) | ok (cabeça cortada pela borda, câmera visível) | ok (`cinquenta`) | n/a | FALHA (legenda toca a lente) | ok (2/13) |

### `s02_b_problema.png`
**O que vejo:** Fotógrafo inteiro à esquerda com a câmera (lente do kit cinza, seletor M); etiqueta vermelha "FOTO ESCURA" em y 480; telão à direita no estado `escura` (igreja e casal escurecidos); a noiva da direita aparece cortada na borda. O card ainda digita "trocar a lente do kit" com cursor e sem ✓; contador 1/13; legenda "escurece" y 1180.

| peça | chão/tapete | fotógrafo | telão | problema | sobreposição | contador/texto |
|---|---|---|---|---|---|---|
| ok (lente do kit visível; ela deveria piscar, não pisca neste frame) | parcial (madeira sim, tapete não) | ok | ok (`escura`) | ok (telão escuro encena o problema) | ok | ok (1/13 coerente: a peça 2 só nasce em "cinquenta") |

### `s02_c_solucao.png`
**O que vejo:** Quadro idêntico ao s02_a (nesse segmento o momento da peça é a própria âncora da solução, então os dois stills caem no mesmo frame): lente 50mm preta com anéis dourados no ar no centro, lente cinza do kit ainda na câmera, telão `cinquenta`, etiqueta verde "50MM", contador 2/13, card com ✓, legenda "cinquenta" encostando na base da lente.

| peça | chão/tapete | fotógrafo | telão | problema | sobreposição | contador/texto |
|---|---|---|---|---|---|---|
| FALHA (lente 50mm pequena, cerca de 15% da largura) | parcial (madeira sim, tapete não) | ok (cabeça cortada pela borda esquerda, câmera visível) | ok (`cinquenta`) | n/a | FALHA (legenda toca a lente) | ok (2/13) |


## s03

### `s03_a_momento.png`
**O que vejo:** Close muito fechado: fotógrafo e câmera ocupam o quadro (câmera preta com 50mm dourada e seletor M, cerca de 75% da largura); o card "câmera com dois slots ✓" cobre a testa e o cabelo dele. Só aparece a aba escura do slot, fechada, na lateral esquerda da câmera: nenhum cartão visível. Telão fora do quadro. Contador 3/13, legenda "memória" y 1180. Madeira atrás e uma linha azul de tapete no canto direito.

| peça | chão/tapete | fotógrafo | telão | problema | sobreposição | contador/texto |
|---|---|---|---|---|---|---|
| FALHA (cartões não aparecem; câmera ocupa 75% da largura) | parcial (madeira e um fio de tapete) | ok | FALHA (fora do quadro neste momento) | n/a | FALHA (card cobre a cabeça) | ok (3/13) |

### `s03_b_problema.png`
**O que vejo:** Fotógrafo à esquerda (cabeça visível) com a câmera 50mm; na lateral dela, na altura da cintura, dois cartões pequenos: o da esquerda vermelho com X branco e o da direita azul "SD" (cerca de 20% da largura, meio escondidos pelo braço). Etiqueta vermelha "CARTÃO CORROMPEU" em y 480. Telão à direita no estado `corrompida` (faixas deslocadas, retângulos magenta e verde). Casal cortado na borda direita. Contador 3/13, legenda "corrompe".

| peça | chão/tapete | fotógrafo | telão | problema | sobreposição | contador/texto |
|---|---|---|---|---|---|---|
| parcial (cartões visíveis mas pequenos e meio escondidos) | parcial (madeira sim, tapete não) | ok | ok (`corrompida`) | ok (cartão vermelho com X e telão com glitch) | ok | ok |

### `s03_c_solucao.png`
**O que vejo:** Mesma composição: etiqueta verde "SLOT 2 SALVOU" y 555; cartão esquerdo vermelho com X e o direito verde "SD" na lateral da câmera; telão `restaurada` (igreja clara) com o selo verde "SLOT 2" cortado pela borda direita (só "LOT" aparece); casal à direita em primeiro plano; legenda "slots".

| peça | chão/tapete | fotógrafo | telão | problema | sobreposição | contador/texto |
|---|---|---|---|---|---|---|
| parcial (cartões pequenos) | parcial (madeira sim, tapete não) | ok | FALHA (selo "SLOT 2" cortado pela borda; estado certo, `restaurada`) | n/a | ok | ok |


## s04

### `s04_a_momento.png`
**O que vejo:** Momento = estouro do flash (+0,3 s). Cena em festa com luzes magenta e ciano; fotógrafo cortado na borda esquerda (só olho e barba), flash branco pequeno em cima da câmera (cerca de 12% da largura, parte dele cortada); globo espelhado cinza grande no meio, na frente do telão; casal dançando escuro à direita; telão `festa_flash` (bokeh colorido, noiva visível, noivo escondido pelo globo e pelo casal). Etiqueta verde "LUZ NA PISTA" em y 655 por cima do globo, card com ✓, contador 4/13, legenda "granulada" y 1180.

| peça | chão/tapete | fotógrafo | telão | problema | sobreposição | contador/texto |
|---|---|---|---|---|---|---|
| FALHA (flash pequeno e cortado pela borda) | parcial (madeira sim, tapete não) | ok (câmera visível, cabeça cortada) | ok (`festa_flash`, mas o casal real tapa metade da imagem) | n/a | FALHA (etiqueta sobre o globo e o casal) | ok (4/13) |

### `s04_b_problema.png`
**O que vejo:** Em "apagaram": cena escura e azulada, luz em 25%. Fotógrafo à esquerda com câmera 50mm e dois cartões; telão `festa_granulada` (pista azul-marinho com pontinhos de ruído e casal escuro); casal à direita enorme e cortado pela borda, com o globo cinza cortado no canto superior direito. Card ainda digitando "comprar um flash" com cursor, sem ✓; contador 3/13 (coerente, o flash ainda não caiu); sem etiqueta (a de "ISO 12800" vem depois); legenda "apagaram".

| peça | chão/tapete | fotógrafo | telão | problema | sobreposição | contador/texto |
|---|---|---|---|---|---|---|
| ok (flash ainda não existe, como previsto; câmera visível) | parcial (madeira escura, tapete não) | ok | ok (`festa_granulada`) | ok (cena escurece e telão granula) | FALHA (globo e casal cortados pela borda direita) | ok (3/13) |

### `s04_c_solucao.png`
**O que vejo:** Quadro idêntico ao s04_a (momento e solução são o mesmo frame em s04): flash pequeno na câmera, globo, casal dançando, telão `festa_flash`, etiqueta "LUZ NA PISTA" em cima do globo, contador 4/13.

| peça | chão/tapete | fotógrafo | telão | problema | sobreposição | contador/texto |
|---|---|---|---|---|---|---|
| FALHA (flash pequeno e cortado) | parcial | ok | ok (`festa_flash`) | n/a | FALHA (etiqueta sobre o globo e o casal) | ok (4/13) |


## s05

### `s05_a_momento.png`
**O que vejo:** Close do álbum dourado no pedestal cinza-escuro, com foto azul e rosa na capa e plaquinha branca "PORTFÓLIO" na frente; ocupa cerca de 59% da largura (x 210-850), no centro-alto. Madeira em cima (30%), plataforma escura embaixo (65%), sem tapete. Card com ✓, contador 5/13, legenda "contrata" em y 1180 encostando na base da plaquinha. Fotógrafo, telão e casal fora do quadro (close).

| peça | chão/tapete | fotógrafo | telão | problema | sobreposição | contador/texto |
|---|---|---|---|---|---|---|
| FALHA leve (59% da largura, o limite é 55%) | parcial (madeira sim, tapete não) | n/a (close) | n/a (close) | n/a | FALHA (legenda toca a plaquinha) | ok (5/13) |

### `s05_b_problema.png`
**O que vejo:** Plano de contexto: álbum dourado pequeno no pedestal (cerca de 36% da largura, x 480-860, y 860-1180), etiqueta vermelha "CADÊ SEU TRABALHO?" em y 720 acima dele; telão grande no canto superior esquerdo, estado `festa_flash` (a foto final do ato 1), com o card cobrindo a parte de baixo dele; noiva do casal de amigos parcialmente visível na borda esquerda. Faixa azul de tapete só como linha fina na borda da plataforma; madeira e parede em volta. Legenda "sem" y 1180 encostando no pedestal. Fotógrafo não aparece (ele caminhou para o ato 2, fora do quadro).

| peça | chão/tapete | fotógrafo | telão | problema | sobreposição | contador/texto |
|---|---|---|---|---|---|---|
| FALHA (36% da largura, abaixo de 35% a 55%... fica no limite; o álbum ainda é legível) | parcial (madeira sim, tapete só uma linha) | FALHA (não aparece no plano de contexto) | ok (`festa_flash`, o último estado do ato 1) | parcial (só a etiqueta; nada encena a falta de trabalho) | FALHA (card cobre a parte de baixo do telão; legenda toca o pedestal) | ok (5/13) |

### `s05_c_solucao.png`
**O que vejo:** Contexto: álbum no pedestal (cerca de 28% da largura) com plaquinha PORTFÓLIO cortada pela legenda "separa" (a palavra cobre o rótulo); etiqueta verde "20 MELHORES"; um cabo curto saindo do telão com bolinha azul na ponta, que não chega ao álbum; casal de amigos na borda esquerda (acenando, braços fora do quadro); telão com o casal. As três fotos não aparecem (o álbum continua fechado neste frame). Card com ✓, contador 5/13.

| peça | chão/tapete | fotógrafo | telão | problema | sobreposição | contador/texto |
|---|---|---|---|---|---|---|
| FALHA (28% da largura; álbum fechado, as fotos voando e a abertura ainda não começaram) | parcial | FALHA (não aparece) | ok (`festa_flash`) | n/a | FALHA (legenda cobre a plaquinha PORTFÓLIO) | ok (5/13) |


## s06

### `s06_a_momento.png`
**O que vejo:** Close do celular branco em pé, tela cinza vazia com barra magenta, plaquinha "INSTAGRAM" na frente com a legenda "guardado" por cima do texto; celular ocupa cerca de 28% da largura (x 400-700). Madeira e parede ao fundo; só um pedaço do álbum amarelo na borda esquerda. Card com ✓, contador 6/13.

| peça | chão/tapete | fotógrafo | telão | problema | sobreposição | contador/texto |
|---|---|---|---|---|---|---|
| FALHA (28% da largura, abaixo de 35%) | parcial (madeira sim, tapete não) | n/a (close) | n/a | n/a | FALHA (legenda cobre a plaquinha) | ok (6/13) |

### `s06_b_problema.png`
**O que vejo:** Celular em pé à direita do centro com tela cinza vazia (problema "ninguém viu" encenado), etiqueta vermelha "NINGUÉM VIU" em y 480; à esquerda a câmera grande do fotógrafo (lente 50mm dourada, flash em cima) com o cabo dourado e a bolinha amarela correndo do álbum até o celular; fotógrafo quase todo cortado pela borda esquerda (só o braço, a lente e o pé aparecem). Legenda "gaveta", card ✓, contador 6/13.

| peça | chão/tapete | fotógrafo | telão | problema | sobreposição | contador/texto |
|---|---|---|---|---|---|---|
| ok (celular visível e no centro, cerca de 22% da largura; contexto) | parcial (madeira sim, tapete não) | FALHA (quase todo cortado, o rosto não aparece) | n/a (ato 2) | ok (tela vazia + etiqueta) | ok | ok |

### `s06_c_solucao.png`
**O que vejo:** Contexto com "vitrine": celular à direita (cerca de 14% da largura) com só três miniaturas preenchidas no topo da grade (laranja, azul, rosa) e o resto cinza; etiqueta vermelha "NINGUÉM VIU" ainda ativa em y 480 (a verde "NOVO DIRECT" só nasce em 0,88 do segmento); cabo preto com bolinha azul do álbum ao celular; à esquerda a câmera do fotógrafo grande, com o rosto dele cortado pela borda (só parte do cabelo e do flash aparecem). Corações não aparecem. Legenda "vitrine".

| peça | chão/tapete | fotógrafo | telão | problema | sobreposição | contador/texto |
|---|---|---|---|---|---|---|
| FALHA (celular pequeno, 14% da largura; grade ainda vazia, a animação só começou) | parcial (madeira sim, tapete não) | FALHA (rosto cortado pela borda) | n/a | n/a | ok | ok (6/13) |

OBS: etiqueta de problema ainda na tela quando a solução já começou


## s07

### `s07_a_momento.png`
**O que vejo:** Close da proposta num suporte inclinado: folha branca com "PROPOSTA", linhas cinza e selo dourado, plaquinha "PROPOSTA" na frente. Ocupa cerca de 48% da largura (x 440-860), centro-alto; o braço azul do noivo cliente aparece cortado na borda esquerda. Card ✓, contador 7/13, legenda "pergunta" y 1180 (por baixo do suporte, sem tocar na plaquinha). Madeira e uma linha de tapete atrás.

| peça | chão/tapete | fotógrafo | telão | problema | sobreposição | contador/texto |
|---|---|---|---|---|---|---|
| ok | parcial (madeira e fio de tapete) | n/a (close) | n/a | n/a | ok | ok (7/13) |

### `s07_b_problema.png`
**O que vejo:** Plano de contexto com o casal cliente em primeiro plano: noiva (cabelo ruivo, costas) e noivo (terno azul, costas) enormes, ocupando 70% da largura; a proposta aparece pequena à direita, parcialmente atrás do noivo; etiqueta cinza "VISUALIZOU" em y 480 sobre a noiva; os cabelos e o rosto dos dois ficam atrás do card (só os topos de cabeça e os cabelos aparecem em cima do card). Legenda "visualiza" y 1180. Sem fotógrafo.

| peça | chão/tapete | fotógrafo | telão | problema | sobreposição | contador/texto |
|---|---|---|---|---|---|---|
| FALHA (proposta pequena e meio escondida atrás do casal) | parcial (madeira sim, canto de tapete) | FALHA (não aparece) | n/a | ok (casal de costas + etiqueta cinza) | FALHA (card cobre a cabeça e o rosto do casal) | ok (7/13) |

### `s07_c_solucao.png`
**O que vejo:** Casal cliente de costas à esquerda/centro (50% da largura), rostos em y 380-520 cortados pela base do card; etiqueta verde "QUERO FECHAR" em y 480 em cima do ombro; a proposta à direita, clara e brilhando, cortada pela borda direita ("OPOSTA"); à esquerda o álbum e o celular parcialmente visíveis ("TFÓLIO", "INSTA"); cabo preto saindo do álbum. Sem fotógrafo.

| peça | chão/tapete | fotógrafo | telão | problema | sobreposição | contador/texto |
|---|---|---|---|---|---|---|
| FALHA (proposta cortada pela borda direita, 25% da largura) | parcial | FALHA (não aparece) | n/a | n/a | FALHA (card corta os rostos do casal) | ok (7/13) |


## s08

### `s08_a_momento.png`
**O que vejo:** Close do contrato: folha com linhas cinza no suporte inclinado, plaquinha "CONTRATO" na frente, caneta azul deitada junto à base; cobre cerca de 40% da largura (x 410-870). O noivo cliente (terno azul) ocupa o lado esquerdo inteiro, de costas, com a cabeça acima do quadro; o card tapa o tronco dele. Cabo preto com bolinhas azuis chega da proposta (canto superior direito, cortada). Contador 8/13 encostado na proposta cortada, legenda "desmarca" y 1180 por baixo da plaquinha (toca de leve).

| peça | chão/tapete | fotógrafo | telão | problema | sobreposição | contador/texto |
|---|---|---|---|---|---|---|
| ok (40% da largura) | FALHA (quase só plataforma escura; um fio de madeira no topo) | n/a (close) | n/a | n/a | FALHA (noivo ocupa 35% da tela e o card cobre o tronco dele; contador sobre a proposta cortada) | ok (8/13) |

### `s08_b_problema.png`
**O que vejo:** Contexto: noiva cliente (cabelo ruivo) grande à esquerda, de frente e já meio virada, etiqueta vermelha "DESMARCOU" em y 480 sobre o ombro dela; o card cobre os olhos e o topo da cabeça do noivo e do fotógrafo (só o cabelo e a boca aparecem); contrato à direita (30% da largura) com cabos para o celular e para a proposta; plaquinhas INSTAGRAM e PROPOSTA visíveis; fotógrafo cortado na borda esquerda (só o cabelo e o ombro). Faixa azul de tapete grande no canto inferior direito. Legenda "não" y 1180.

| peça | chão/tapete | fotógrafo | telão | problema | sobreposição | contador/texto |
|---|---|---|---|---|---|---|
| ok (contrato legível, 30% da largura) | ok (tapete azul visível no canto, madeira no fundo) | FALHA (cortado na borda, o rosto não aparece) | n/a | parcial (o casal virando de costas é difícil de ler como "desmarcou"; só a etiqueta deixa claro) | FALHA (card cobre os rostos) | ok (8/13) |

### `s08_c_solucao.png`
**O que vejo:** Contexto: casal cliente de costas à esquerda (noiva ruiva, noivo azul) com rostos em y 380-520 cortados pelo card; fotógrafo na borda esquerda com a câmera grande (lente 50mm dourada, flash) e o rosto escondido atrás do card; etiqueta verde "TEM O QUE COBRAR" em y 480; contrato à direita (cerca de 28% da largura) com a caneta azul em pé sobre a folha e o início da assinatura em pontinhos azuis; cabos para o celular e a proposta. Tapete azul grande no canto inferior direito, telão no canto superior esquerdo (cortado). Legenda "assinado".

| peça | chão/tapete | fotógrafo | telão | problema | sobreposição | contador/texto |
|---|---|---|---|---|---|---|
| parcial (contrato pequeno, assinatura em andamento mas o carimbo ASSINADO ainda não apareceu) | ok (tapete azul visível) | parcial (câmera visível, rosto atrás do card) | n/a | n/a | FALHA (card cobre os rostos) | ok (8/13) |


## s09

### `s09_a_momento.png`
**O que vejo:** Close da maquininha dourada com "R$" verde e teclado, calendário "SÁB" ao lado, plaquinha "SINAL" na frente; as duas peças ocupam cerca de 63% da largura (x 250-830). O casal cliente de costas aparece atrás, cortado em cima (noiva à esquerda, noivo no centro), o card cobre o tronco deles; a proposta e o contrato aparecem cortados na borda direita com o cabo preto e a bolinha azul. Legenda "sinal" encostando na plaquinha "SINAL" e escondendo parte da palavra. Contador 9/13.

| peça | chão/tapete | fotógrafo | telão | problema | sobreposição | contador/texto |
|---|---|---|---|---|---|---|
| FALHA leve (63% da largura, acima de 55%) | FALHA (quase só plataforma escura, sem madeira nem tapete) | n/a (close) | n/a | n/a | FALHA (legenda cobre a plaquinha SINAL; card cobre o casal) | ok (9/13) |

### `s09_b_problema.png`
**O que vejo:** Contexto: maquininha dourada (R$) e calendário SÁB no centro (cerca de 42% da largura, x 330-840), casal cliente grande atrás, com os rostos (noiva ruiva e noivo) visíveis acima do card e o tronco abaixo; etiqueta vermelha "SÓ PROMESSA" em y 480 sobre o terno do noivo; contrato com "ASSINADO" e a assinatura em pontos à direita (cortado na borda); cabo com a bolinha dourada correndo. Plataforma escura grande embaixo com os LEDs dourados e tapete azul no canto inferior (cerca de 35% da tela). Fotógrafo não aparece (só o cabelo do noivo e uma câmera preta atrás do card no canto superior esquerdo). Legenda "promessa" y 1180.

| peça | chão/tapete | fotógrafo | telão | problema | sobreposição | contador/texto |
|---|---|---|---|---|---|---|
| ok (42% da largura) | ok (tapete azul e LEDs visíveis; madeira só no topo) | FALHA (não aparece) | n/a | parcial (só etiqueta e casal parado; nada mostra a "promessa" sem sinal) | FALHA (card corta o casal; etiqueta sobre o noivo) | ok (9/13) |

### `s09_c_solucao.png`
**O que vejo:** Contexto: maquininha com "30%" amarelo e calendário SÁB com círculo verde (cerca de 35% da largura), casal cliente atrás com os rostos cortados pelo card (só os cabelos aparecem acima) e fotógrafo atrás (câmera e rosto parcial no canto superior esquerdo, cortados); etiqueta verde "DATA RESERVADA" em y 490; telão no canto superior esquerdo (cortado), contrato "ASSINADO" e celular com grade à direita. Plataforma grande com LEDs e tapete azul embaixo (cerca de 40% da tela); madeira no canto inferior direito. Legenda "reservada".

| peça | chão/tapete | fotógrafo | telão | problema | sobreposição | contador/texto |
|---|---|---|---|---|---|---|
| ok (35% da largura) | ok (tapete e LEDs bem visíveis) | FALHA (rosto atrás do card, só o cabelo e a câmera) | n/a | n/a | FALHA (card cobre os rostos do casal) | ok (9/13) |


## s10

### `s10_a_momento.png`
**O que vejo:** Close do backup: dois HDs cinza com LEDs azuis lado a lado (cerca de 70% da largura, x 160-880) e plaquinha "BACKUP" cortada pelo caractere "o" da legenda; a nuvem branca grande no ar (y 380-700) cobre parte do card, a noiva cliente (ruiva) à direita e o fotógrafo acima (flash e cabeça cortados no topo). Plataforma escura, LEDs dourados e tapete azul embaixo (cerca de 25% da tela). Card com ✓, contador 10/13.

| peça | chão/tapete | fotógrafo | telão | problema | sobreposição | contador/texto |
|---|---|---|---|---|---|---|
| FALHA (70% da largura, acima de 55%; nuvem tapada pelo card) | parcial (tapete e LEDs sim, madeira não) | parcial (câmera e flash visíveis, cabeça cortada pelo topo) | n/a | n/a | FALHA (legenda "o" cobre a plaquinha BACKUP; card cobre a nuvem) | ok (10/13) |

### `s10_b_problema.png`
**O que vejo:** Contexto: HD 1 (esquerda) queimado, escuro, com luz vermelha e fumaça cinza e rosada subindo; HD 2 com LED azul; nuvem branca com tom rosado no ar e dois cabos pretos descendo até os HDs com bolinhas azuis e uma bolinha amarela correndo; casal cliente à direita com a noiva ruiva em rosa pela luz vermelha; fotógrafo atrás com a câmera 50mm e o cabo. Etiqueta vermelha "HD QUEIMOU" em y 480. Peça com cerca de 45% da largura. Legenda "inteiro" cobre a plaquinha BACKUP. Telão no canto superior esquerdo.

| peça | chão/tapete | fotógrafo | telão | problema | sobreposição | contador/texto |
|---|---|---|---|---|---|---|
| ok (45% da largura) | ok (tapete azul e LEDs; madeira no topo) | parcial (câmera visível, rosto atrás do card) | n/a | ok (fumaça e luz vermelha encenam o HD queimado) | FALHA (legenda cobre a plaquinha BACKUP) | ok (10/13) |

### `s10_c_solucao.png`
**O que vejo:** Contexto: nuvem verde-clara e HD 2 com tom verde e LED verde (cerca de 40% da largura do grupo), HD 1 escuro com fumaça cinza subindo; etiqueta verde "3 CÓPIAS" em y 480; casal cliente à direita (noiva ruiva e noivo, rostos visíveis, braços cruzados na frente do corpo); fotógrafo atrás com a câmera, o cartão vermelho com X e o verde SD na lateral, rosto parcial e flash visíveis acima do card; cabo da câmera ao HD 1 e à nuvem; maquininha "30%" cortada na borda direita. Tapete azul e LEDs dourados ocupam 25% inferior, madeira no canto inferior esquerdo. Legenda "cópias" cobre o topo da plaquinha BACKUP.

| peça | chão/tapete | fotógrafo | telão | problema | sobreposição | contador/texto |
|---|---|---|---|---|---|---|
| ok (grupo HDs + nuvem em cerca de 45% da largura) | ok (tapete, LEDs e madeira visíveis) | ok (câmera na mão e rosto parcial visível) | n/a | n/a | FALHA (legenda sobre a plaquinha BACKUP; maquininha cortada na borda) | ok (10/13) |


## s11

### `s11_a_momento.png`
**O que vejo:** Close do tablet preto com grade de 6 fotos coloridas e cadeado dourado aberto no canto, plaquinha "GALERIA" na frente; cerca de 58% da largura (x 245-870), centro-alto. A noiva cliente aparece cortada no canto superior direito (saia e braço); card com ✓ cobre a parte de cima. A legenda "foto" toca a plaquinha. Fundo quase todo plataforma escura (80%); um pedaço de madeira no topo e um fio de LED no canto inferior esquerdo. Contador 11/13.

| peça | chão/tapete | fotógrafo | telão | problema | sobreposição | contador/texto |
|---|---|---|---|---|---|---|
| FALHA leve (58% da largura, acima de 55%) | FALHA (quase só plataforma escura; sem tapete visível) | n/a (close) | n/a | n/a | FALHA (legenda toca a plaquinha; contador encosta no braço da noiva) | ok (11/13) |

### `s11_b_problema.png`
**O que vejo:** Contexto: tablet com a grade de fotos à esquerda (cerca de 38% da largura), cadeado dourado, plaquinha "GALERIA" com a legenda "WhatsApp" por cima; celular pequeno branco com foto pixelada aparece cortado na borda esquerda (só 8% da largura); cabo da nuvem com bolinha dourada ao tablet; casal cliente grande atrás com rostos visíveis acima do card e corpos abaixo; HD 1 cinza (apagado) à direita; etiqueta vermelha "FOTO COMPRIMIDA" em y 480. Tapete azul e LEDs na parte de baixo (cerca de 20%). Fotógrafo não aparece.

| peça | chão/tapete | fotógrafo | telão | problema | sobreposição | contador/texto |
|---|---|---|---|---|---|---|
| parcial (tablet 38% da largura, mas o celular pixelado está cortado e quase invisível) | ok (tapete e LEDs visíveis) | FALHA (não aparece) | n/a | FALHA (celular com foto pixelada cortado pela borda, o problema quase não é visto) | FALHA (legenda "WhatsApp" cobre a plaquinha GALERIA; card corta o casal) | ok (11/13) |

### `s11_c_solucao.png`
**O que vejo:** Contexto: tablet com a tela mais clara e quente (acende), cadeado dourado, etiqueta verde "GALERIA COM SENHA" em y 548; celular pixelado sumiu (correto); casal cliente atrás (noiva de costas, noivo de frente, rostos em parte cortados pelo card); nuvem verde grande cortada na borda direita; HD 1 e cabo; fotógrafo no canto superior direito, só cabelo, flash e lente da câmera. Telão no canto superior esquerdo. Legenda "Galeria" cobre a plaquinha GALERIA. Tapete azul e LEDs embaixo (25%).

| peça | chão/tapete | fotógrafo | telão | problema | sobreposição | contador/texto |
|---|---|---|---|---|---|---|
| ok (tablet 33% da largura, mais claro) | ok (tapete e LEDs visíveis, madeira no canto) | FALHA (quase fora do quadro, só flash e lente) | n/a | n/a | FALHA (legenda cobre a plaquinha; nuvem cortada na borda) | ok (11/13) |


## s12

### `s12_a_momento.png`
**O que vejo:** Close do balão de fala amarelo no alto (cerca de 59% da largura, x 225-865, y 600-950) com 5 estrelas cinza; embaixo, tapando a base do balão, a cabeça do noivo cliente (cabelo escuro), a noiva ruiva por trás com a plaquinha "DEPOI" cortada e o fotógrafo (câmera com 50mm e flash) à direita; nuvem verde cortada no canto inferior direito; telão no canto esquerdo; quadros na parede. Legenda "amou" por cima do rosto do noivo. Contador 12/13.

| peça | chão/tapete | fotógrafo | telão | problema | sobreposição | contador/texto |
|---|---|---|---|---|---|---|
| FALHA leve (59% da largura, acima de 55%) | FALHA (madeira só numa faixa fina; plataforma escura embaixo, sem tapete) | parcial (câmera e flash visíveis, rosto escondido atrás da lente) | n/a | n/a | FALHA (legenda sobre o rosto do noivo; o balão fica sobre o card) | ok (12/13) |

### `s12_b_problema.png`
**O que vejo:** Contexto: balão amarelo com 5 estrelas cinza (cerca de 47% da largura) e etiqueta vermelha "SÓ VOCÊ SABE" em y 480 em cima dele (o problema é encenado só por estrelas apagadas); noivo cliente grande no centro, noiva ruiva atrás com a plaquinha "DEPOI" cortada, fotógrafo atrás com câmera 50mm e flash, e o rosto atrás da lente; cabos azuis em volta, nuvem verde, tablet GALERIA à esquerda embaixo, HD cinza embaixo. Legenda "disso" cobre o tronco do noivo. Telão no canto esquerdo e quadros no topo. Sem tapete visível.

| peça | chão/tapete | fotógrafo | telão | problema | sobreposição | contador/texto |
|---|---|---|---|---|---|---|
| ok (balão e estrelas legíveis, 47%) | FALHA (plataforma escura e peças, sem madeira nem tapete) | parcial (câmera e flash visíveis, rosto escondido) | n/a | parcial (estrelas cinza + etiqueta; nada mais) | FALHA (legenda sobre o noivo) | ok (12/13) |

### `s12_c_solucao.png`
**O que vejo:** Contexto: balão com 4 estrelas brancas acesas e a 5ª ainda cinza (acendem uma por uma), etiqueta verde "POSTOU" em y 480 dentro do balão; noivo cliente no centro, noiva ruiva atrás; fotógrafo atrás com câmera e flash; nuvem verde grande à direita; tablet GALERIA e HDs com plaquinhas "GALERIA" e "BACKUP" no terço inferior; celular Instagram à direita com "TAGRAM" cortado; a estrela dourada voadora não aparece neste frame. Legenda "posta" sobre o tronco do noivo.

| peça | chão/tapete | fotógrafo | telão | problema | sobreposição | contador/texto |
|---|---|---|---|---|---|---|
| ok (balão 45% da largura) | FALHA (sem madeira nem tapete; só plataforma e peças) | parcial (câmera e flash visíveis, rosto escondido atrás da lente) | n/a | n/a | FALHA (legenda sobre o noivo; muitos objetos juntos, cena poluída) | ok (12/13) |


## s13

### `s13_a_momento.png`
**O que vejo:** Momento = chegada do casal indicado. Visão de cima da plataforma com muitos objetos: casal cliente à esquerda (noivo azul com rosto virado, noiva atrás), casal indicado à direita (noivo cinza de costas com cabelo escuro, noiva loira ao fundo), coração dourado entre eles (cerca de 15% da largura), fotógrafo atrás no centro (câmera, flash e cabeça cortados pelo card), nuvem verde grande, HDs, maquininha "30%" e calendário SÁB embaixo, Instagram à direita com plaquinha. Telão no canto superior esquerdo com o casal da festa. Tapete azul e LEDs no canto inferior esquerdo (cerca de 25%). Legenda "sem" no meio do HD verde. Contador 13/13.

| peça | chão/tapete | fotógrafo | telão | problema | sobreposição | contador/texto |
|---|---|---|---|---|---|---|
| parcial (o coração é pequeno; os casais ficam sobrepostos e a cena é confusa) | ok (tapete, LEDs e madeira visíveis) | parcial (câmera visível, rosto cortado pelo card) | n/a | n/a | FALHA (card cobre cabeças; legenda sobre o HD; casais sobrepostos) | ok (13/13) |

### `s13_b_problema.png`
**O que vejo:** Em "indica": mesma visão de cima, mas o contador marca 12/13 e o card ainda digita sem ✓ (coerente: a peça 13 só chega depois). Casal cliente à esquerda (noivo azul, noiva atrás), fotógrafo no centro com a câmera 50mm e o cabo preto saindo da lente até o HD verde, nuvem verde, HDs, maquininha "30%" e calendário SÁB, Instagram à direita com plaquinha. O casal indicado ainda não aparece (ele entra a partir daqui). Tapete azul e LEDs embaixo à esquerda (cerca de 25%), madeira no canto. Legenda "indica" cobre o HD verde. Telão com o casal da festa no canto superior esquerdo.

| peça | chão/tapete | fotógrafo | telão | problema | sobreposição | contador/texto |
|---|---|---|---|---|---|---|
| n/a (peça 13 ainda não nasceu) | ok (tapete, LEDs e madeira) | ok (câmera na mão, cabeça cortada pelo card) | n/a | parcial (nada indica a falta de indicação; só o casal indicado começa a entrar, ainda fora do quadro) | FALHA (legenda sobre o HD verde) | ok (12/13 coerente com o momento) |

### `s13_c_solucao.png`
**O que vejo:** Em "pronto": etiqueta verde "NOVO CLIENTE" em y 480, casal indicado à direita do casal cliente (noivo cinza de costas e noiva loira) e coração dourado entre eles; a bolinha dourada amarela corre pelo cabo no canto direito; balão com 5 estrelas cortado atrás do card; fotógrafo no centro com câmera e cabo; nuvem verde; maquininha e calendário. Tapete azul, LEDs e madeira ocupam cerca de 35% inferior. Legenda "Pronto" cobre o HD verde e parte da plaquinha BACKUP. Contador 13/13, card com ✓.

| peça | chão/tapete | fotógrafo | telão | problema | sobreposição | contador/texto |
|---|---|---|---|---|---|---|
| parcial (casais sobrepostos, coração visível mas pequeno, 20% da largura) | ok (tapete, LEDs, madeira) | parcial (câmera visível, rosto atrás do card) | n/a | n/a | FALHA (legenda sobre o HD e a plaquinha BACKUP; balão cortado pelo card) | ok (13/13) |


## s14

### `s14_a_momento.png`
**O que vejo:** Plano alto no início do segmento (início + 1,5 s, a câmera ainda não recuou): plataforma inteira em diagonal com os objetos agrupados no centro-direita; chão de madeira ocupa metade inferior (cerca de 45%), tapete azul em volta, parede com 3 quadros e telão (casal da festa) no topo. Card "pedir indicação ✓" ainda visível (cobre a base dos quadros), contador 13/13, legenda "para" em y 1180 sobre a madeira. Fotógrafo pequeno no meio do grupo, com câmera; lado esquerdo da plataforma vazio. Plataforma ocupa cerca de 60% da largura; peças pequenas.

| peça | chão/tapete | fotógrafo | telão | problema | sobreposição | contador/texto |
|---|---|---|---|---|---|---|
| n/a (plano final) | ok (madeira, tapete e LEDs) | ok (aparece pequeno com a câmera na mão) | n/a | n/a | FALHA leve (card ainda cobre os quadros; metade esquerda da plataforma vazia) | ok (13/13) |

### `s14_b_problema.png`
**O que vejo:** Em "para" + 0,3 s: câmera já recuou. Plataforma inteira em diagonal, 3 quadros e o telão visíveis, chão de madeira em 45% inferior e tapete azul em volta; objetos agrupados no centro-direita; contador 13/13; o card já saiu (correto); legenda "na" em y 1190. Sem textos finais (correto, ainda não é "comenta"). Lado esquerdo da plataforma vazio.

| peça | chão/tapete | fotógrafo | telão | problema | sobreposição | contador/texto |
|---|---|---|---|---|---|---|
| n/a | ok | ok (pequeno, com câmera na mão, no grupo) | n/a | n/a | ok | ok (13/13) |

### `s14_c_solucao.png`
**O que vejo:** Em "comenta" + 0,3 s: plano alto com os três textos finais já na tela ("COMENTA QUAL PEÇA" branco em y 420, "VOCÊ QUER VER" amarelo em y 540; o terceiro, "DESMONTADA", ainda não apareceu), confete caindo (cubos pequenos), legenda "Comenta" y 1190 sobre os LEDs, o @ ainda não aparece (entra depois). Os dois textos se sobrepõem aos quadros da parede e ao telão (o texto amarelo cobre o telão). Plataforma com objetos agrupados no centro-direita, madeira em 45% inferior.

| peça | chão/tapete | fotógrafo | telão | problema | sobreposição | contador/texto |
|---|---|---|---|---|---|---|
| n/a | ok | ok (pequeno, com câmera, no grupo) | n/a | n/a | FALHA (texto amarelo cobre o telão e os dois textos cobrem os quadros) | ok (13/13; textos legíveis, acentos Ç e Ê corretos) |


## final

### `final_a_para_1.8s.png`
**O que vejo:** "para" + 1,8 s: plano alto aberto, plataforma inteira em diagonal, 3 quadros e telão acima, madeira em 45% inferior, tapete azul em volta; objetos agrupados no centro-direita, lado esquerdo vazio; sem card (saiu), contador 13/13, legenda "entende" y 1180 por cima dos LEDs da plataforma. Fotógrafo pequeno no grupo, com câmera na mão.

| peça | chão/tapete | fotógrafo | telão | problema | sobreposição | contador/texto |
|---|---|---|---|---|---|---|
| n/a | ok | ok (pequeno) | n/a | n/a | ok | ok (13/13) |

### `final_b_comenta_0.5s.png`
**O que vejo:** "comenta" + 0,5 s: os três textos finais completos ("COMENTA QUAL PEÇA", "VOCÊ QUER VER", "DESMONTADA" azul), legenda "qual" y 1180, confete; o pill "@ramesfares" ainda não aparece (ele entra 18 frames, 0,6 s, depois de "comenta", por desenho). "DESMONTADA" ocupa y 640-710 e encosta no grupo de peças (cobre a parte de cima do balão); "VOCÊ QUER VER" cobre o telão; "COMENTA QUAL PEÇA" cobre os quadros. Textos dentro da área segura (x 140-940).

| peça | chão/tapete | fotógrafo | telão | problema | sobreposição | contador/texto |
|---|---|---|---|---|---|---|
| n/a | ok | ok (pequeno) | n/a | n/a | FALHA (os textos cobrem o telão, os quadros e o topo do balão de estrelas) | ok (3 textos legíveis e na área segura; @ só entra em +0,6 s, por desenho) |

### `final_c_ultimo_frame.png`
**O que vejo:** Último frame: os três textos finais + pill escuro "@ramesfares" em y 1440 sobre a madeira (dentro da área segura), confete caindo, contador 13/13; sem legenda (a última palavra já sumiu). Plataforma inteira com os objetos agrupados; textos em x 160-940, dentro da área segura; "DESMONTADA" encosta nas peças.

| peça | chão/tapete | fotógrafo | telão | problema | sobreposição | contador/texto |
|---|---|---|---|---|---|---|
| n/a | ok | ok (pequeno) | n/a | n/a | FALHA leve ("VOCÊ QUER VER" cobre o telão, "DESMONTADA" toca o balão) | ok (13/13, @ legível, sem travessão) |

## Resumo

48 stills abertos. Itens marcados: 133 ok, 79 FALHA, 43 parcial.

FALHAS por item: sobreposição 38, peça 17, fotógrafo 12, chão/tapete 8, telão 3, problema 1


## Lista de falhas por still

- `s00_a_momento`: **chão/tapete**: FALHA (sem tapete, 60% escuro); **sobreposição**: FALHA (noiva escondida atrás do noivo)
- `s00_b_problema`: **chão/tapete**: FALHA (sem tapete); **sobreposição**: FALHA (etiqueta tapa o rosto do fotógrafo)
- `s01_a_momento`: **peça**: FALHA (75% da largura, acima de 55%); **telão**: FALHA (não aparece no momento em que nasce); **sobreposição**: FALHA (card cobre a cabeça do fotógrafo)
- `s01_c_solucao`: **fotógrafo**: FALHA (cabeça cortada pela borda esquerda); **sobreposição**: FALHA (casal tapa a parte de baixo do telão)
- `s02_a_momento`: **peça**: FALHA (lente 50mm ocupa cerca de 15% da largura; plano é de contexto, mas a peça fica pequena e a legenda encosta nela); **sobreposição**: FALHA (legenda toca a lente)
- `s02_c_solucao`: **peça**: FALHA (lente 50mm pequena, cerca de 15% da largura); **sobreposição**: FALHA (legenda toca a lente)
- `s03_a_momento`: **peça**: FALHA (cartões não aparecem; câmera ocupa 75% da largura); **telão**: FALHA (fora do quadro neste momento); **sobreposição**: FALHA (card cobre a cabeça)
- `s03_c_solucao`: **telão**: FALHA (selo "SLOT 2" cortado pela borda; estado certo, `restaurada`)
- `s04_a_momento`: **peça**: FALHA (flash pequeno e cortado pela borda); **sobreposição**: FALHA (etiqueta sobre o globo e o casal)
- `s04_b_problema`: **sobreposição**: FALHA (globo e casal cortados pela borda direita)
- `s04_c_solucao`: **peça**: FALHA (flash pequeno e cortado); **sobreposição**: FALHA (etiqueta sobre o globo e o casal)
- `s05_a_momento`: **peça**: FALHA leve (59% da largura, o limite é 55%); **sobreposição**: FALHA (legenda toca a plaquinha)
- `s05_b_problema`: **peça**: FALHA (36% da largura, abaixo de 35% a 55%... fica no limite; o álbum ainda é legível); **fotógrafo**: FALHA (não aparece no plano de contexto); **sobreposição**: FALHA (card cobre a parte de baixo do telão; legenda toca o pedestal)
- `s05_c_solucao`: **peça**: FALHA (28% da largura; álbum fechado, as fotos voando e a abertura ainda não começaram); **fotógrafo**: FALHA (não aparece); **sobreposição**: FALHA (legenda cobre a plaquinha PORTFÓLIO)
- `s06_a_momento`: **peça**: FALHA (28% da largura, abaixo de 35%); **sobreposição**: FALHA (legenda cobre a plaquinha)
- `s06_b_problema`: **fotógrafo**: FALHA (quase todo cortado, o rosto não aparece)
- `s06_c_solucao`: **peça**: FALHA (celular pequeno, 14% da largura; grade ainda vazia, a animação só começou); **fotógrafo**: FALHA (rosto cortado pela borda)
- `s07_b_problema`: **peça**: FALHA (proposta pequena e meio escondida atrás do casal); **fotógrafo**: FALHA (não aparece); **sobreposição**: FALHA (card cobre a cabeça e o rosto do casal)
- `s07_c_solucao`: **peça**: FALHA (proposta cortada pela borda direita, 25% da largura); **fotógrafo**: FALHA (não aparece); **sobreposição**: FALHA (card corta os rostos do casal)
- `s08_a_momento`: **chão/tapete**: FALHA (quase só plataforma escura; um fio de madeira no topo); **sobreposição**: FALHA (noivo ocupa 35% da tela e o card cobre o tronco dele; contador sobre a proposta cortada)
- `s08_b_problema`: **fotógrafo**: FALHA (cortado na borda, o rosto não aparece); **sobreposição**: FALHA (card cobre os rostos)
- `s08_c_solucao`: **sobreposição**: FALHA (card cobre os rostos)
- `s09_a_momento`: **peça**: FALHA leve (63% da largura, acima de 55%); **chão/tapete**: FALHA (quase só plataforma escura, sem madeira nem tapete); **sobreposição**: FALHA (legenda cobre a plaquinha SINAL; card cobre o casal)
- `s09_b_problema`: **fotógrafo**: FALHA (não aparece); **sobreposição**: FALHA (card corta o casal; etiqueta sobre o noivo)
- `s09_c_solucao`: **fotógrafo**: FALHA (rosto atrás do card, só o cabelo e a câmera); **sobreposição**: FALHA (card cobre os rostos do casal)
- `s10_a_momento`: **peça**: FALHA (70% da largura, acima de 55%; nuvem tapada pelo card); **sobreposição**: FALHA (legenda "o" cobre a plaquinha BACKUP; card cobre a nuvem)
- `s10_b_problema`: **sobreposição**: FALHA (legenda cobre a plaquinha BACKUP)
- `s10_c_solucao`: **sobreposição**: FALHA (legenda sobre a plaquinha BACKUP; maquininha cortada na borda)
- `s11_a_momento`: **peça**: FALHA leve (58% da largura, acima de 55%); **chão/tapete**: FALHA (quase só plataforma escura; sem tapete visível); **sobreposição**: FALHA (legenda toca a plaquinha; contador encosta no braço da noiva)
- `s11_b_problema`: **fotógrafo**: FALHA (não aparece); **problema**: FALHA (celular com foto pixelada cortado pela borda, o problema quase não é visto); **sobreposição**: FALHA (legenda "WhatsApp" cobre a plaquinha GALERIA; card corta o casal)
- `s11_c_solucao`: **fotógrafo**: FALHA (quase fora do quadro, só flash e lente); **sobreposição**: FALHA (legenda cobre a plaquinha; nuvem cortada na borda)
- `s12_a_momento`: **peça**: FALHA leve (59% da largura, acima de 55%); **chão/tapete**: FALHA (madeira só numa faixa fina; plataforma escura embaixo, sem tapete); **sobreposição**: FALHA (legenda sobre o rosto do noivo; o balão fica sobre o card)
- `s12_b_problema`: **chão/tapete**: FALHA (plataforma escura e peças, sem madeira nem tapete); **sobreposição**: FALHA (legenda sobre o noivo)
- `s12_c_solucao`: **chão/tapete**: FALHA (sem madeira nem tapete; só plataforma e peças); **sobreposição**: FALHA (legenda sobre o noivo; muitos objetos juntos, cena poluída)
- `s13_a_momento`: **sobreposição**: FALHA (card cobre cabeças; legenda sobre o HD; casais sobrepostos)
- `s13_b_problema`: **sobreposição**: FALHA (legenda sobre o HD verde)
- `s13_c_solucao`: **sobreposição**: FALHA (legenda sobre o HD e a plaquinha BACKUP; balão cortado pelo card)
- `s14_a_momento`: **sobreposição**: FALHA leve (card ainda cobre os quadros; metade esquerda da plataforma vazia)
- `s14_c_solucao`: **sobreposição**: FALHA (texto amarelo cobre o telão e os dois textos cobrem os quadros)
- `final_b_comenta_0.5s`: **sobreposição**: FALHA (os textos cobrem o telão, os quadros e o topo do balão de estrelas)
- `final_c_ultimo_frame`: **sobreposição**: FALHA leve ("VOCÊ QUER VER" cobre o telão, "DESMONTADA" toca o balão)

## Lista de itens parciais por still

- `s00_b_problema`: **problema**: parcial (só a etiqueta; flash e câmera ao rosto já passaram neste frame)
- `s00_c_solucao`: **chão/tapete**: parcial (só um canto de tapete)
- `s01_a_momento`: **chão/tapete**: parcial (madeira sim, tapete não)
- `s01_b_problema`: **chão/tapete**: parcial (madeira sim, tapete não)
- `s01_c_solucao`: **chão/tapete**: parcial (madeira sim, tapete não)
- `s02_a_momento`: **chão/tapete**: parcial (madeira sim, tapete não)
- `s02_b_problema`: **chão/tapete**: parcial (madeira sim, tapete não)
- `s02_c_solucao`: **chão/tapete**: parcial (madeira sim, tapete não)
- `s03_a_momento`: **chão/tapete**: parcial (madeira e um fio de tapete)
- `s03_b_problema`: **peça**: parcial (cartões visíveis mas pequenos e meio escondidos); **chão/tapete**: parcial (madeira sim, tapete não)
- `s03_c_solucao`: **peça**: parcial (cartões pequenos); **chão/tapete**: parcial (madeira sim, tapete não)
- `s04_a_momento`: **chão/tapete**: parcial (madeira sim, tapete não)
- `s04_b_problema`: **chão/tapete**: parcial (madeira escura, tapete não)
- `s04_c_solucao`: **chão/tapete**: parcial
- `s05_a_momento`: **chão/tapete**: parcial (madeira sim, tapete não)
- `s05_b_problema`: **chão/tapete**: parcial (madeira sim, tapete só uma linha); **problema**: parcial (só a etiqueta; nada encena a falta de trabalho)
- `s05_c_solucao`: **chão/tapete**: parcial
- `s06_a_momento`: **chão/tapete**: parcial (madeira sim, tapete não)
- `s06_b_problema`: **chão/tapete**: parcial (madeira sim, tapete não)
- `s06_c_solucao`: **chão/tapete**: parcial (madeira sim, tapete não)
- `s07_a_momento`: **chão/tapete**: parcial (madeira e fio de tapete)
- `s07_b_problema`: **chão/tapete**: parcial (madeira sim, canto de tapete)
- `s07_c_solucao`: **chão/tapete**: parcial
- `s08_b_problema`: **problema**: parcial (o casal virando de costas é difícil de ler como "desmarcou"; só a etiqueta deixa claro)
- `s08_c_solucao`: **peça**: parcial (contrato pequeno, assinatura em andamento mas o carimbo ASSINADO ainda não apareceu); **fotógrafo**: parcial (câmera visível, rosto atrás do card)
- `s09_b_problema`: **problema**: parcial (só etiqueta e casal parado; nada mostra a "promessa" sem sinal)
- `s10_a_momento`: **chão/tapete**: parcial (tapete e LEDs sim, madeira não); **fotógrafo**: parcial (câmera e flash visíveis, cabeça cortada pelo topo)
- `s10_b_problema`: **fotógrafo**: parcial (câmera visível, rosto atrás do card)
- `s11_b_problema`: **peça**: parcial (tablet 38% da largura, mas o celular pixelado está cortado e quase invisível)
- `s12_a_momento`: **fotógrafo**: parcial (câmera e flash visíveis, rosto escondido atrás da lente)
- `s12_b_problema`: **fotógrafo**: parcial (câmera e flash visíveis, rosto escondido); **problema**: parcial (estrelas cinza + etiqueta; nada mais)
- `s12_c_solucao`: **fotógrafo**: parcial (câmera e flash visíveis, rosto escondido atrás da lente)
- `s13_a_momento`: **peça**: parcial (o coração é pequeno; os casais ficam sobrepostos e a cena é confusa); **fotógrafo**: parcial (câmera visível, rosto cortado pelo card)
- `s13_b_problema`: **problema**: parcial (nada indica a falta de indicação; só o casal indicado começa a entrar, ainda fora do quadro)
- `s13_c_solucao`: **peça**: parcial (casais sobrepostos, coração visível mas pequeno, 20% da largura); **fotógrafo**: parcial (câmera visível, rosto atrás do card)
