# Checklist real (v3), 56 stills abertos um a um

Cada linha foi escrita depois de abrir o PNG em `verificacao/` (1080x1920). Os stills de s06 a s13, s14, final e os 8 do card foram regerados depois da última correção e abertos de novo, um a um. Os de s00 a s05 foram regerados e comparados pixel a pixel com os que eu tinha aberto (idênticos ou com PSNR acima de 77 dB), então as linhas deles continuam valendo.
Legenda: **ok** = passou; **parcial** = passou em parte, com a justificativa na própria linha; **FALHA** = não passou; **n/a** = não se aplica ao plano.
Itens: peça (visível, centro, sem corte; closes perto de 45% da largura), chão/tapete (aparecem em volta), fotógrafo (visível com a câmera na mão), telão (estado certo no ato 1), problema (encenado na cena), sobreposição (legenda, título, card, contador e etiquetas sem cobrir peça ou personagem), contador/texto (número certo, sem travessão, acentos corretos).
Distância mínima entre objetos: `verificacao/distancias.txt` (menor 1,33, mínimo exigido 1,2). Enquadramento: `verificacao/enquadramento.txt`.


## card

### `card_s01_a_saindo.png`
**O que vejo:** Close da câmera em s01, 3 frames antes do fim da saída: o card "comprar uma câmera ✓" está quase todo fora do quadro, só a faixa de baixo com a linha e o ✓ aparece no topo (y 0-100, cortado); fotógrafo de frente com a câmera AUTO e lente do kit (x 270-690), noiva em primeiro plano à direita; contador 1/13; telão `auto` cortado na borda direita; legenda "foto" y 1240.

| peça | chão/tapete | fotógrafo | telão | problema | sobreposição | contador/texto |
|---|---|---|---|---|---|---|
| ok | ok | ok | parcial (cortado; é close) | n/a | ok (card saindo pelo topo, sem cobrir a cabeça) | ok (1/13) |

### `card_s01_b_saiu.png`
**O que vejo:** Mesmo close, quando o card terminou de sair: nenhum card na tela, só o contador 1/13, fotógrafo, câmera AUTO, telão `auto` cortado e a noiva à direita; legenda "Mas" y 1240.

| peça | chão/tapete | fotógrafo | telão | problema | sobreposição | contador/texto |
|---|---|---|---|---|---|---|
| ok | ok | ok | parcial (cortado; é close) | n/a | ok (o card saiu) | ok (1/13) |

### `card_s05_a_saindo.png`
**O que vejo:** Close do álbum em s05 com o card quase fora (só a faixa de baixo "montar o portfólio ✓", y 0-95); o personagem curioso (camiseta cinza, calça jeans) entra em fade, semitransparente, na direita (x 700-1040, y 100-1230) e passa por trás do contador; álbum dourado com plaquinha "PORTFÓLIO" (x 320-760); legenda "fotógrafo" y 1240.

| peça | chão/tapete | fotógrafo | telão | problema | sobreposição | contador/texto |
|---|---|---|---|---|---|---|
| ok (álbum visível no centro) | ok | n/a | n/a | parcial (o curioso entra em fade dentro do close, semitransparente) | parcial (o curioso semitransparente passa por trás do contador) | ok (5/13) |

### `card_s05_b_saiu.png`
**O que vejo:** Close do álbum quando o card terminou de sair: nenhum card; o curioso (camiseta cinza, calça jeans), quase opaco, em pé à direita do álbum (x 725-1030, y 130-1200) com a cabeça sobre o contador 5/13; álbum dourado com plaquinha "PORTFÓLIO" (x 360-760); telão cortado à esquerda; legenda "fotógrafo" y 1240.

| peça | chão/tapete | fotógrafo | telão | problema | sobreposição | contador/texto |
|---|---|---|---|---|---|---|
| ok | ok | n/a | n/a | parcial (curioso quase opaco ao lado do álbum, cabeça sobre o contador) | parcial (a cabeça do curioso encosta no contador) | ok (5/13) |

### `card_s09_a_saindo.png`
**O que vejo:** Close da maquininha em s09 com o card quase fora (só a faixa de baixo "cobrar 30% de sinal ✓", y 0-95); o casal cliente, já opaco, ocupa o topo-esquerdo (noiva ruiva x 160-410, noivo azul x 390-670, y 90-770), com a cabeça do noivo encostando no contador; maquininha "R$" com calendário "SÁB" e plaquinha "SINAL" (x 310-760); contrato assinado ("ASSINADO" e assinatura) à direita (x 830-1075); legenda "promessa" y 1240.

| peça | chão/tapete | fotógrafo | telão | problema | sobreposição | contador/texto |
|---|---|---|---|---|---|---|
| ok (maquininha inteira e legível, 42% da largura) | ok | parcial (aparece só a lente da câmera, no canto superior esquerdo) | n/a | n/a | parcial (a noiva cobre parte da maquininha: o ombro do noivo passa atrás do R$) | ok (9/13) |

### `card_s09_b_saiu.png`
**O que vejo:** Mesmo close, quando o card terminou de sair: nenhum card; casal cliente (noiva ruiva x 140-400, noivo azul x 380-660, rostos visíveis) à esquerda atrás da maquininha "R$" e do calendário "SÁB" (x 310-760); contrato à direita com a assinatura e uma bolinha amarela correndo pelo cabo (x 780-840, y 650-700); legenda "promessa" y 1240; contador 9/13.

| peça | chão/tapete | fotógrafo | telão | problema | sobreposição | contador/texto |
|---|---|---|---|---|---|---|
| ok | ok | n/a (fora do quadro) | n/a | n/a | ok | ok (9/13) |

### `card_s13_a_saindo.png`
**O que vejo:** Contexto de s13 com o card quase fora (só a faixa de baixo "pedir indicação ✓", y 0-95): plataforma na diagonal com todas as peças do ato 2, o casal cliente à esquerda (a noiva ruiva aponta para a direita), fotógrafo no centro, casal indicado (noivo cinza e noiva loira) ao lado dele e coração dourado entre eles; telão e 3 quadros acima; legenda "você" y 1240; contador 13/13.

| peça | chão/tapete | fotógrafo | telão | problema | sobreposição | contador/texto |
|---|---|---|---|---|---|---|
| ok (coração e todas as peças visíveis) | ok | ok | ok | n/a | ok | ok (13/13) |

### `card_s13_b_saiu.png`
**O que vejo:** Mesmo plano quando o card terminou de sair: nenhum card, telão e 3 quadros visíveis, plataforma com todas as peças e os dois casais, coração dourado, nuvem verde; legenda "pagar" y 1240; contador 13/13.

| peça | chão/tapete | fotógrafo | telão | problema | sobreposição | contador/texto |
|---|---|---|---|---|---|---|
| ok | ok | ok | ok | n/a | ok (o card saiu) | ok (13/13) |


## final

### `final_a_para_1.8s.png`
**O que vejo:** "para" + 1,8 s: plano alto aberto: plataforma na diagonal (x 0-910, y 700-1280) com 3 quadros e o telão na parede, a mesa de edição com a lâmpada no canto direito (x 1010-1080), madeira em 45% inferior; personagens e peças no meio-esquerda; sem card (saiu), contador 13/13, legenda "entende" y 1240 sobre os LEDs; os textos finais ainda não entraram (correto).

| peça | chão/tapete | fotógrafo | telão | problema | sobreposição | contador/texto |
|---|---|---|---|---|---|---|
| ok | ok | ok (pequeno) | ok | n/a | ok | ok (13/13) |

### `final_b_comenta_0.5s.png`
**O que vejo:** "comenta" + 0,5 s: os três textos finais completos: "COMENTA QUAL PEÇA" branco (y 420), "VOCÊ QUER VER" amarelo itálico (y 540), "DESMONTADA" azul itálico (y 670, x 145-935), dentro da área segura; confete; legenda "qual" y 1240; o pill "@ramesfares" ainda não aparece (entra em 0,6 s, por desenho); "DESMONTADA" cobre o telão e "VOCÊ QUER VER" toca um quadro.

| peça | chão/tapete | fotógrafo | telão | problema | sobreposição | contador/texto |
|---|---|---|---|---|---|---|
| ok | ok | ok | ok | n/a | parcial (os textos finais cobrem o telão e dois quadros, que são cenário) | ok (3 textos legíveis; @ só entra em +0,6 s, por desenho) |

### `final_c_ultimo_frame.png`
**O que vejo:** Último frame: os três textos finais e o pill escuro "@ramesfares" em y 1440 (x 390-690, dentro da área segura), confete; contador 13/13; sem legenda (a última palavra já sumiu); plataforma com os personagens e as peças, telão coberto em parte por "DESMONTADA"; madeira em 45% inferior.

| peça | chão/tapete | fotógrafo | telão | problema | sobreposição | contador/texto |
|---|---|---|---|---|---|---|
| ok | ok | ok | ok | n/a | parcial (texto final sobre o telão e quadros, cenário) | ok (13/13, @ legível, sem travessão) |


## s00

### `s00_a_momento.png`
**O que vejo:** Abertura, sem card nem contador (correto, é o gancho). Fotógrafo à esquerda (x 285-470, y 530-860) segurando a câmera preta com AUTO e a lente do kit cinza; casal de amigos lado a lado (noiva de vestido branco e cabelo preso em x 560-720, noivo de terno azul-marinho em x 720-805), de perfil; sem telão (correto). Tapete azul quadriculado com borda grafite e LEDs dourados, chão de madeira e tapete bege em volta, 2 quadros; legenda "se" y 1240.

| peça | chão/tapete | fotógrafo | telão | problema | sobreposição | contador/texto |
|---|---|---|---|---|---|---|
| ok | ok | ok | n/a | n/a | ok | ok |

### `s00_b_problema.png`
**O que vejo:** Mesmo plano: etiqueta vermelha "FOTÓGRAFO?" em y 374, acima e à esquerda da cabeça do fotógrafo, sem tocá-la; câmera ao peito; casal lado a lado; legenda "fotógrafo" y 1240; sem contador (correto).

| peça | chão/tapete | fotógrafo | telão | problema | sobreposição | contador/texto |
|---|---|---|---|---|---|---|
| ok | ok | ok | n/a | parcial (neste frame só a etiqueta aparece: câmera ao rosto e flash de tela ocorrem antes do instante amostrado) | ok | ok |

### `s00_c_solucao.png`
**O que vejo:** Em "treze": a câmera recuou e mostra a plataforma inteira (x 95-990, y 590-950) com o fotógrafo e o casal pequenos em cima; 3 quadros na parede e a ponta de uma mesa no canto direito; contador "PEÇAS 0/13" em y 208; legenda "treze" y 1240; madeira em 50% inferior da tela, com o tapete bege em volta da plataforma.

| peça | chão/tapete | fotógrafo | telão | problema | sobreposição | contador/texto |
|---|---|---|---|---|---|---|
| ok (plataforma inteira) | ok | ok (pequeno, com a câmera) | n/a | n/a | ok | ok (0/13) |


## s01

### `s01_a_momento.png`
**O que vejo:** Close da câmera no momento da peça, com o corpo dourado do pulso: câmera com AUTO e lente do kit cinza (x 360-695), fotógrafo de frente com rosto e barba (x 265-480); card "comprar uma câmera ✓" (y 250-378) encostando no topo do cabelo, sem cobrir o rosto; contador 1/13; telão `auto` cortado na borda direita e a noiva em primeiro plano à direita; legenda "existe" y 1240; tapete quadriculado em 50% do quadro.

| peça | chão/tapete | fotógrafo | telão | problema | sobreposição | contador/texto |
|---|---|---|---|---|---|---|
| ok | ok | ok | parcial (só uma ponta na borda direita; é close da câmera) | n/a | parcial (o card encosta no topo do cabelo) | ok (1/13) |

### `s01_b_problema.png`
**O que vejo:** Contexto, card já saiu (só o contador 1/13): fotógrafo inteiro à esquerda (x 320-470, y 645-900) com a câmera AUTO; casal de amigos lado a lado (noiva x 555-680, noivo x 680-745); telão `auto` (cinza dessaturado, casal e selo AUTO) atrás deles; etiqueta vermelha "MODO AUTO" em y 541 acima da cabeça do fotógrafo, encostando na quina esquerda do telão; legenda "automático" y 1240; tapete, madeira e tapete bege em volta.

| peça | chão/tapete | fotógrafo | telão | problema | sobreposição | contador/texto |
|---|---|---|---|---|---|---|
| ok | ok | ok (inteiro) | ok (`auto`) | ok (imagem acinzentada no telão + etiqueta) | parcial (a etiqueta toca a quina do telão, sem cobrir o conteúdo) | ok (1/13) |

### `s01_c_solucao.png`
**O que vejo:** Contexto: etiqueta verde "APRENDE O MANUAL" em y 538 acima do fotógrafo, sobre a quina esquerda do telão; telão `manual` (pôr do sol laranja, casal nítido); seletor da câmera com "M" verde; casal lado a lado; contador 1/13; legenda "caro" y 1240.

| peça | chão/tapete | fotógrafo | telão | problema | sobreposição | contador/texto |
|---|---|---|---|---|---|---|
| ok | ok | ok | ok (`manual`) | n/a | parcial (etiqueta sobre a quina do telão, fora do casal retratado) | ok (1/13) |


## s02

### `s02_a_momento.png`
**O que vejo:** Close da câmera no momento da peça: lente do kit cinza na câmera e a 50mm preta com anéis dourados e "50mm" entrando pela frente (x 610-795, y 725-910) ao lado da lente do kit; fotógrafo de frente (x 255-640); card ✓ (y 250-378) sem tocar o rosto; etiqueta verde "50MM" em y 470 encostando na cabeça dele (x 410-585 vs cabelo até x 465); contador 2/13; telão `cinquenta` cortado na borda direita; legenda "cinquenta" y 1240.

| peça | chão/tapete | fotógrafo | telão | problema | sobreposição | contador/texto |
|---|---|---|---|---|---|---|
| ok (câmera e a 50mm inteiras no quadro) | ok | ok | parcial (cortado na borda; é close) | n/a | parcial (a etiqueta encosta no cabelo do fotógrafo) | ok (2/13) |

### `s02_b_problema.png`
**O que vejo:** Contexto: card digitando "trocar a lente do kit" com cursor (a peça só nasce em "cinquenta"), contador 1/13 (coerente); fotógrafo inteiro à esquerda com a lente do kit cinza; telão `escura` (igreja escurecida, casal escuro); etiqueta vermelha "FOTO ESCURA" em y 540 sobre a quina do telão; casal lado a lado; legenda "escurece" y 1240.

| peça | chão/tapete | fotógrafo | telão | problema | sobreposição | contador/texto |
|---|---|---|---|---|---|---|
| ok (lente do kit visível) | ok | ok | ok (`escura`) | ok (telão escurecido encena o problema) | parcial (etiqueta sobre a quina do telão) | ok (1/13) |

### `s02_c_solucao.png`
**O que vejo:** Mesmo frame do s02_a (neste segmento momento e solução coincidem): lente do kit na câmera e a 50mm dourada entrando (x 610-795), fotógrafo de frente, card ✓, etiqueta verde "50MM" y 470 encostando no cabelo, contador 2/13, legenda "cinquenta" y 1240, telão `cinquenta` cortado à direita.

| peça | chão/tapete | fotógrafo | telão | problema | sobreposição | contador/texto |
|---|---|---|---|---|---|---|
| ok | ok | ok | parcial (cortado; é close) | n/a | parcial (etiqueta encosta no cabelo) | ok (2/13) |


## s03

### `s03_a_momento.png`
**O que vejo:** Close da câmera com a 50mm dourada instalada e "M" verde no seletor: dois cartões SD azuis saindo do slot esquerdo (x 255-455, y 765-850), fotógrafo de frente (x 290-500, y 380-1130); card "câmera com dois slots ✓" (y 250-378) toca o topo do cabelo, sem cobrir o rosto; contador 3/13; noiva grande à direita (x 790-1080) e telão `cinquenta` cortado; legenda "memória" y 1240.

| peça | chão/tapete | fotógrafo | telão | problema | sobreposição | contador/texto |
|---|---|---|---|---|---|---|
| ok (câmera 45% da largura da caixa, cartões legíveis) | ok | ok | parcial (cortado; é close) | n/a | parcial (card encosta no topo do cabelo) | ok (3/13) |

### `s03_b_problema.png`
**O que vejo:** Contexto: fotógrafo inteiro à esquerda com a câmera, a 50mm dourada e dois cartões na lateral (esquerdo vermelho com X branco, direito azul SD); telão `corrompida` (faixas deslocadas, retângulos magenta e verde sobre a igreja); casal lado a lado; etiqueta vermelha "CARTÃO CORROMPEU" em y 541 acima do fotógrafo, sobre a quina do telão; contador 3/13; legenda "corrompe" y 1240.

| peça | chão/tapete | fotógrafo | telão | problema | sobreposição | contador/texto |
|---|---|---|---|---|---|---|
| ok | ok | ok | ok (`corrompida`) | ok (cartão vermelho com X e telão com glitch) | parcial (etiqueta sobre a quina do telão) | ok (3/13) |

### `s03_c_solucao.png`
**O que vejo:** Contexto: etiqueta verde "SLOT 2 SALVOU" em y 540; cartão esquerdo vermelho com X e direito verde SD; telão `restaurada` (igreja clara, casal nítido) com o selo verde "SLOT 2" inteiro e com 40 px de margem (x 715-765, y 715); casal lado a lado; contador 3/13; legenda "slots" y 1240.

| peça | chão/tapete | fotógrafo | telão | problema | sobreposição | contador/texto |
|---|---|---|---|---|---|---|
| ok | ok | ok | ok (`restaurada`) | n/a | parcial (etiqueta sobre a quina do telão) | ok (3/13) |


## s04

### `s04_a_momento.png`
**O que vejo:** Momento do estouro do flash: close da câmera (x 345-690) com o flash branco na sapata (x 485-595, y 595-700), a 50mm com reflexo roxo e dois cartões; cena em luz baixa com tons roxo e azul no tapete; globo espelhado branco à direita cobrindo parte do telão (`festa_flash`, bokeh colorido); casal dançando cortado pela borda direita; card ✓ (y 250-378); etiqueta verde "LUZ NA PISTA" y 470 acima da cabeça do fotógrafo, sem tocá-la; contador 4/13; legenda "granulada" y 1240.

| peça | chão/tapete | fotógrafo | telão | problema | sobreposição | contador/texto |
|---|---|---|---|---|---|---|
| parcial (câmera com flash e mãos ocupa 45% pela caixa declarada, mas o grupo visível mede 32% da largura: a caixa inclui os antebraços) | ok | ok | ok (`festa_flash`, parcialmente coberto pelo globo) | n/a | ok | ok (4/13) |

### `s04_b_problema.png`
**O que vejo:** Contexto em "apagaram": cena escurecida e azulada (luz em 25%), tapete com manchas de luz azul e roxa; globo branco brilhante sobre as cabeças do casal; telão com ruído (`festa_granulada`: pontinhos sobre o bokeh); fotógrafo inteiro à esquerda com a câmera, cartões e a 50mm; card digitando "comprar um flash" com cursor, sem ✓; contador 3/13 (coerente: o flash ainda não caiu); sem etiqueta (a de ISO vem depois); legenda "apagaram" y 1240.

| peça | chão/tapete | fotógrafo | telão | problema | sobreposição | contador/texto |
|---|---|---|---|---|---|---|
| ok (o flash ainda não existe, como previsto) | ok | ok | ok (`festa_granulada`) | ok (luz cai a 25% e o telão fica granulado) | parcial (o globo cobre as cabeças do casal, parte da festa) | ok (3/13) |

### `s04_c_solucao.png`
**O que vejo:** Mesmo frame do s04_a (momento e solução coincidem): close da câmera com flash, globo, casal cortado na borda direita, etiqueta "LUZ NA PISTA", telão `festa_flash`, contador 4/13, card ✓.

| peça | chão/tapete | fotógrafo | telão | problema | sobreposição | contador/texto |
|---|---|---|---|---|---|---|
| parcial (grupo visível 32% da largura, caixa 45%) | ok | ok | ok (`festa_flash`) | n/a | ok | ok (4/13) |


## s05

### `s05_a_momento.png`
**O que vejo:** Close do álbum dourado no pedestal grafite com plaquinha "PORTFÓLIO" (x 320-765, 41% da largura, y 600-945); card ✓ (y 250-378) e contador 5/13 sem sobreposição; legenda "contrata" y 1240 sem tocar a peça; tapete quadriculado ocupa 60% do quadro, madeira e parede ao fundo; o telão aparece cortado na borda esquerda.

| peça | chão/tapete | fotógrafo | telão | problema | sobreposição | contador/texto |
|---|---|---|---|---|---|---|
| ok (41%, dentro da tolerância) | ok | n/a (close) | n/a (close) | n/a | ok | ok (5/13) |

### `s05_b_problema.png`
**O que vejo:** Contexto: telão `festa_flash` (x 320-615), casal de amigos lado a lado (x 420-605), álbum dourado fechado no pedestal com plaquinha PORTFÓLIO (x 715-840), personagem curioso de camiseta cinza à direita (x 840-920, y 720-995) com os braços levantados e balão "?" acima da cabeça (x 925-1000, y 665-735); fotógrafo inteiro à esquerda (x 160-320) com câmera, flash e cartões; etiqueta vermelha "CADÊ SEU TRABALHO?" em y 495 sobre o quadro da parede, sem tocar personagem; contador 5/13; legenda "sem" y 1240; sem card.

| peça | chão/tapete | fotógrafo | telão | problema | sobreposição | contador/texto |
|---|---|---|---|---|---|---|
| ok (álbum visível, mas pequeno: 11% da largura; é contexto) | ok | ok | ok (`festa_flash`) | ok (curioso com braços levantados e "?") | ok | ok (5/13) |

### `s05_c_solucao.png`
**O que vejo:** Contexto: etiqueta verde "20 MELHORES" em y 497 acima do curioso, sobre o quadro; curioso à direita com o braço estendido ao álbum (joinha), casal de amigos com os braços estendidos, cabo preto do telão ao álbum; fotógrafo inteiro à esquerda; álbum ainda fechado neste frame; contador 5/13; legenda "separa" y 1240.

| peça | chão/tapete | fotógrafo | telão | problema | sobreposição | contador/texto |
|---|---|---|---|---|---|---|
| parcial (álbum com 11% da largura e ainda fechado neste frame; abre logo depois) | ok | ok | ok | n/a | ok | ok (5/13) |


## s06

### `s06_a_momento.png`
**O que vejo:** Close do celular branco com tela cinza e barra magenta (x 450-655, y 565-930) sobre a base grafite com a plaquinha "INSTAGRAM" (peça inteira x 380-705 = 30% da largura); o álbum cortado na borda esquerda; card ✓ (y 250-378) e contador 6/13 sem se tocar; legenda "guardado" y 1240 sem tocar a peça; tapete quadriculado em 55% do quadro, madeira e parede ao fundo.

| peça | chão/tapete | fotógrafo | telão | problema | sobreposição | contador/texto |
|---|---|---|---|---|---|---|
| parcial (30% da largura: o celular é alto e estreito e a altura da janela útil de 590 px limita antes dos 45%; o log do enquadramento marca "limitada pela altura") | ok | n/a (close) | n/a | n/a | ok | ok (6/13) |

### `s06_b_problema.png`
**O que vejo:** Contexto: celular com a tela cinza vazia (x 440-520, y 575-715, 7% da largura) ao lado do fotógrafo, que está de lado com a câmera, o flash e os cartões (x 240-490); casal cliente já assentado e parado à direita (noiva ruiva x 595-755 e noivo azul x 750-905, rostos visíveis, y 535-950); etiqueta vermelha "NINGUÉM VIU" em y 354 sobre a parede, acima do celular, sem tocar nenhum objeto; contador 6/13; legenda "gaveta" y 1240; tapete bege e madeira em 35% inferior.

| peça | chão/tapete | fotógrafo | telão | problema | sobreposição | contador/texto |
|---|---|---|---|---|---|---|
| parcial (celular inteiro e visível, mas com 7% da largura porque o plano precisa mostrar o fotógrafo e o casal; a tela vazia lê como cinza) | ok | ok (de lado, câmera na mão, rosto de perfil) | n/a | ok (tela cinza vazia + etiqueta) | ok | ok (6/13) |

### `s06_c_solucao.png`
**O que vejo:** Contexto: celular com 3 miniaturas coloridas no topo da grade e o resto cinza (x 450-530, y 575-715); cabo com bolinha azul do álbum; fotógrafo de frente (x 235-410) com câmera, flash e cartões; casal cliente parado à direita (rostos visíveis); etiqueta vermelha "NINGUÉM VIU" ainda ativa em y 353 (a verde só nasce em 88% do segmento); legenda "vitrine" y 1240; contador 6/13.

| peça | chão/tapete | fotógrafo | telão | problema | sobreposição | contador/texto |
|---|---|---|---|---|---|---|
| parcial (celular inteiro com 7% da largura; o contexto precisa caber o fotógrafo e o casal) | ok | ok | n/a | n/a | ok | ok (6/13) |


## s07

### `s07_a_momento.png`
**O que vejo:** Close da proposta: folha branca com "PROPOSTA", linhas cinza e selo dourado (x 450-690, y 600-890) sobre a base grafite com a plaquinha (peça inteira x 320-765 = 41% da largura); o celular com a grade preenchida e o cabo azul à esquerda, cortados; card ✓ e contador 7/13 sem se tocar; legenda "pergunta" y 1240 sem tocar; tapete quadriculado embaixo e a borda grafite da plataforma à direita.

| peça | chão/tapete | fotógrafo | telão | problema | sobreposição | contador/texto |
|---|---|---|---|---|---|---|
| ok (peça inteira com 41%, dentro de 45% ± 5%) | ok | n/a (close) | n/a | n/a | ok | ok (7/13) |

### `s07_b_problema.png`
**O que vejo:** Contexto: etiqueta cinza "VISUALIZOU" em y 420 acima do casal, sem tocá-lo; casal cliente assentado (noiva ruiva x 480-610 e noivo azul x 615-770, rostos visíveis) ao lado da proposta, que aparece inteira à direita (x 760-920, "PROPOSTA" legível, selo dourado); fotógrafo (x 190-385) com câmera e flash; telão `festa_flash` no canto esquerdo; legenda "visualiza" y 1240; tapete bege e madeira em volta.

| peça | chão/tapete | fotógrafo | telão | problema | sobreposição | contador/texto |
|---|---|---|---|---|---|---|
| ok (proposta inteira, sem oclusão; 15% da largura em contexto) | ok | ok | ok (aparece, em `festa_flash`) | ok (casal parado e etiqueta cinza) | ok | ok (7/13) |

### `s07_c_solucao.png`
**O que vejo:** Contexto: etiqueta verde "QUERO FECHAR" em y 423 acima do casal; casal cliente de frente (noiva ruiva x 480-630, noivo azul x 620-770) ao lado da proposta clara com selo (x 790-930, "PROPOSTA" legível, brilhando); fotógrafo (x 190-390) com câmera e flash; telão e álbum atrás à esquerda; legenda "proposta" y 1240.

| peça | chão/tapete | fotógrafo | telão | problema | sobreposição | contador/texto |
|---|---|---|---|---|---|---|
| ok (proposta inteira, sem oclusão) | ok | ok | ok | n/a | ok | ok (7/13) |


## s08

### `s08_a_momento.png`
**O que vejo:** Close do contrato no suporte (folha com linhas, caneta azul deitada, plaquinha "CONTRATO"; peça inteira x 340-750 = 38% da largura, y 590-995); proposta atrás à direita, celular no centro e cabos pretos em arco com esferas azuis ligando as peças; o fotógrafo aparece cortado na borda esquerda (só rosto e ombro, x 0-70); card ✓ (y 250-378) sobre o celular e os cabos; contador 8/13; legenda "desmarca" y 1240 por baixo da plaquinha, sem tocar; tapete bege e madeira no canto inferior direito.

| peça | chão/tapete | fotógrafo | telão | problema | sobreposição | contador/texto |
|---|---|---|---|---|---|---|
| parcial (38% da largura com a base, apenas 2,5 pontos abaixo da faixa de 40,5%: o solver mede 45% pela caixa declarada, que é um pouco maior que o suporte real) | ok | parcial (rosto cortado pela borda esquerda no close; é close do contrato) | n/a | n/a | parcial (o card cobre o celular e o cabo, peças vizinhas) | ok (8/13) |

### `s08_b_problema.png`
**O que vejo:** Contexto: o casal cliente vira de costas em "desmarca": o noivo azul de costas (x 380-500) e a noiva ruiva de três quartos (x 460-640); etiqueta vermelha "DESMARCOU" em y 375 acima do casal, sem tocá-lo; contrato (x 650-905, y 775-980) e proposta legíveis à direita; fotógrafo (x 215-390) com câmera e flash; álbum e telão à esquerda; legenda "não" y 1240.

| peça | chão/tapete | fotógrafo | telão | problema | sobreposição | contador/texto |
|---|---|---|---|---|---|---|
| ok (contrato inteiro e legível, 24% da largura) | ok | ok | ok | ok (casal virando as costas, etiqueta) | ok | ok (8/13) |

### `s08_c_solucao.png`
**O que vejo:** Contexto: casal cliente de frente de novo (noiva ruiva x 410-555, noivo azul x 550-700, rostos visíveis); etiqueta verde "TEM O QUE COBRAR" em y 375; contrato à direita (x 650-910) com a caneta azul em pé e a assinatura em azul começando; proposta atrás; fotógrafo (x 215-390) com câmera e flash; legenda "assinado" y 1240.

| peça | chão/tapete | fotógrafo | telão | problema | sobreposição | contador/texto |
|---|---|---|---|---|---|---|
| ok (contrato inteiro, assinatura em andamento) | ok | ok | n/a (fora do quadro neste plano) | n/a | ok | ok (8/13) |


## s09

### `s09_a_momento.png`
**O que vejo:** Close da maquininha dourada com "R$" verde e do calendário "SÁB" com plaquinha "SINAL" (peça inteira x 310-760 = 42% da largura, y 570-1010); contrato assinado ("ASSINADO" verde e assinatura azul) à direita com cabo; o fotógrafo aparece da cintura para baixo no canto superior esquerdo (pernas e tênis, câmera e flash cortados); card ✓ (y 250-378) cobre o tronco dele e a parte de cima do contrato; contador 9/13 encostando no celular cortado; legenda "sinal" y 1240 sem tocar a plaquinha; plataforma escura e tapete bege em 35% inferior.

| peça | chão/tapete | fotógrafo | telão | problema | sobreposição | contador/texto |
|---|---|---|---|---|---|---|
| ok (42%) | ok | parcial (cortado: só pernas e câmera; é close da maquininha) | n/a | n/a | parcial (o card cobre o tronco do fotógrafo e a parte de cima do contrato) | ok (9/13) |

### `s09_b_problema.png`
**O que vejo:** Contexto visto da esquerda: maquininha "R$" e calendário "SÁB" (x 730-920, y 835-1000, 18% da largura) à direita do casal cliente; casal assentado (noiva ruiva x 455-600 e noivo azul x 585-710) à frente, sem cobrir a maquininha; o contrato semitransparente com o contorno vermelho piscando atrás do noivo (x 665-730, y 635-770), a proposta mais acima; fotógrafo (x 175-370) com câmera, flash e cartões; etiqueta vermelha "SÓ PROMESSA" em y 300 (x 655-965) sobre a parede, junto à mesa de edição e acima do contador (a 25 px dele), sem tocar personagem; legenda "promessa" y 1240 sobre os LEDs.

| peça | chão/tapete | fotógrafo | telão | problema | sobreposição | contador/texto |
|---|---|---|---|---|---|---|
| ok (maquininha inteira e legível, sem oclusão) | ok | ok | n/a | ok (contrato fraco com contorno vermelho piscando) | parcial (a etiqueta termina em x 965, 5 px além do limite de 960, e fica perto do contador) | ok (9/13) |

### `s09_c_solucao.png`
**O que vejo:** Contexto: maquininha com "30%" e calendário com o círculo verde em "SÁB" (x 730-920, y 840-1000); contrato de volta sólido com brilho verde (x 675-745, y 640-770) atrás do noivo; casal cliente (noiva x 455-600, noivo x 585-710), proposta, fotógrafo (x 190-375); etiqueta verde "DATA RESERVADA" em y 300 (x 595-965) junto à mesa, 25 px abaixo do contador; legenda "reservada" y 1240 sobre os LEDs.

| peça | chão/tapete | fotógrafo | telão | problema | sobreposição | contador/texto |
|---|---|---|---|---|---|---|
| ok (maquininha e calendário legíveis, sem oclusão) | ok | ok | n/a | n/a | parcial (a etiqueta termina em x 965, 5 px além do limite, e fica a 25 px do contador) | ok (9/13) |


## s10

### `s10_a_momento.png`
**O que vejo:** Close dos dois HDs cinza com LEDs azuis e plaquinha "BACKUP" (peça inteira x 320-770 = 42% da largura, y 830-1010); a nuvem branca no ar sobre os HDs (x 435-660, y 590-750) à frente da câmera do fotógrafo, que aparece atrás (câmera, flash e cabeça cortada em y 380-600); cabos azuis em arco ligando as peças vizinhas; card ✓ (y 250-378) cobre o telão e a cabeça do fotógrafo; contador 10/13; legenda "o" y 1250 (a palavra "o", num círculo preto); tapete bege e madeira em 35% inferior.

| peça | chão/tapete | fotógrafo | telão | problema | sobreposição | contador/texto |
|---|---|---|---|---|---|---|
| ok (HDs com 42%; a nuvem fica entre os HDs e a câmera) | ok | n/a (close dos HDs; ele aparece atrás, parcialmente) | n/a | n/a | parcial (o card cobre o telão e a cabeça do fotógrafo; a nuvem cobre o tronco dele) | ok (10/13) |

### `s10_b_problema.png`
**O que vejo:** Contexto visto de lado (câmera à esquerda): HD 1 vermelho com luz vermelha pulsando e fumaça cinza sobre ele e HD 2 cinza (x 680-860, y 785-1010, 17% da largura), nuvem branca acima (x 715-850, y 615-780), plaquinha "BACKUP" de lado; cabos pretos da câmera do fotógrafo aos HDs com esferas azuis; fotógrafo inteiro de perfil (x 240-500, y 560-980) com a câmera, os cartões e o rosto visíveis; casal cliente atrás (noiva ruiva x 505-690, noivo escuro atrás dela); etiqueta vermelha "HD QUEIMOU" em y 300 (x 670-965) sobre o piso de madeira, sem tocar ninguém e a 25 px do contador; legenda "inteiro" y 1240 sobre o tapete; o piso de madeira ocupa o terço superior.

| peça | chão/tapete | fotógrafo | telão | problema | sobreposição | contador/texto |
|---|---|---|---|---|---|---|
| ok (HDs, fumaça e luz vermelha visíveis, sem oclusão) | ok | ok (inteiro, com a câmera e o rosto) | n/a | ok (fumaça e luz vermelha no HD 1) | parcial (a etiqueta termina em x 965, 5 px além do limite de 960, e fica a 25 px do contador) | ok (10/13) |

### `s10_c_solucao.png`
**O que vejo:** Contexto visto de lado: nuvem verde-clara no ar (x 715-855, y 615-790), HD 2 com LED verde (x 705-840, y 790-870) e HD 1 escuro com restos de fumaça; etiqueta verde "3 CÓPIAS" em y 300 (x 710-940), dentro da área segura, 25 px abaixo do contador; fotógrafo inteiro de perfil (x 245-510) com a câmera e os cartões; noiva ruiva e noivo atrás; cabos azuis da câmera aos HDs; legenda "cópias" y 1240; tapete quadriculado em 55% do quadro.

| peça | chão/tapete | fotógrafo | telão | problema | sobreposição | contador/texto |
|---|---|---|---|---|---|---|
| ok (HDs e nuvem legíveis, sem oclusão) | ok | ok | n/a | n/a | ok | ok (10/13) |


## s11

### `s11_a_momento.png`
**O que vejo:** Close do tablet preto no suporte com a grade de 6 fotos e o cadeado dourado, plaquinha "GALERIA" (peça inteira x 310-770 = 43% da largura, y 595-985); card ✓ (y 250-378) cobre o cabo e a base do álbum; o fotógrafo aparece da cintura para baixo no canto direito (pernas, câmera cortada) e o contador 11/13 encosta na câmera dele; HD cinza à direita; legenda "foto" y 1240 sobre os LEDs.

| peça | chão/tapete | fotógrafo | telão | problema | sobreposição | contador/texto |
|---|---|---|---|---|---|---|
| ok (43%, dentro da tolerância) | ok | parcial (cortado: só pernas e câmera; é close do tablet) | n/a | n/a | parcial (contador encosta na câmera do fotógrafo; card cobre o cabo) | ok (11/13) |

### `s11_b_problema.png`
**O que vejo:** Contexto: casal cliente à esquerda do tablet "GALERIA" (noiva ruiva x 310-435, noivo azul x 440-560); a noiva segura o celular com a foto pixelada na altura do peito (x 445-495, y 745-785); tablet com cadeado (x 375-525, y 885-985), HDs "BACKUP" e nuvem verde no centro, fotógrafo (x 600-725) com câmera e flash, proposta, contrato e maquininha à direita; etiqueta vermelha "FOTO COMPRIMIDA" em y 440 (x 232-625), tocando o canto direito do telão; legenda "WhatsApp" y 1240 sobre os LEDs; tapete bege e madeira em 35% inferior.

| peça | chão/tapete | fotógrafo | telão | problema | sobreposição | contador/texto |
|---|---|---|---|---|---|---|
| parcial (tablet inteiro e legível, mas com 14% da largura em contexto) | ok | ok | ok | parcial (o celular pixelado existe na mão da noiva, mas mede 50 px de largura e a pixelização só se percebe de perto) | parcial (a etiqueta toca o canto do telão, fora da imagem dele) | ok (11/13) |

### `s11_c_solucao.png`
**O que vejo:** Contexto: etiqueta verde "GALERIA COM SENHA" em y 438 (x 220-645), tocando o canto direito do telão; casal cliente parado ao lado do tablet "GALERIA" (noiva ruiva x 310-440, noivo azul x 440-570), sem o celular pixelado (correto, ele some em "galeria"); tablet com cadeado (x 375-525); fotógrafo (x 600-730) com câmera e flash; nuvem verde, HDs, proposta, contrato e maquininha "30%"; legenda "Galeria" y 1240; tapete bege e madeira em 35% inferior.

| peça | chão/tapete | fotógrafo | telão | problema | sobreposição | contador/texto |
|---|---|---|---|---|---|---|
| parcial (tablet inteiro e legível, 14% da largura em contexto) | ok | ok | ok | n/a | parcial (a etiqueta toca o canto do telão, fora da imagem dele) | ok (11/13) |


## s12

### `s12_a_momento.png`
**O que vejo:** Close do balão amarelo com 5 estrelas cinza (x 345-760, 38% da largura, y 555-760) e a plaquinha "DEPOIMENTO" cortada ("POIMEN") atrás do casal; o casal cliente (noiva ruiva e noivo azul, rostos e corpos inteiros, x 285-820, y 750-1380) ocupa a metade de baixo; tablet "GALERIA" abaixo, fotógrafo à direita (câmera 50mm, flash e cartões, rosto no canto, x 870-1080), telão e quadros acima; card ✓ cobre o topo do telão; legenda "amou" y 1240 sobre as pernas do casal; contador 12/13.

| peça | chão/tapete | fotógrafo | telão | problema | sobreposição | contador/texto |
|---|---|---|---|---|---|---|
| parcial (balão com 38% da largura, 2,5 pontos abaixo da faixa de 40,5%; a caixa do close inclui as cabeças do casal e a plaquinha fica escondida atrás deles) | ok | ok (rosto parcial, câmera na mão) | n/a | n/a | parcial (a legenda cobre as pernas do casal; o casal cobre a plaquinha do balão) | ok (12/13) |

### `s12_b_problema.png`
**O que vejo:** Contexto: balão amarelo com as 5 estrelas cinza (x 295-495, y 530-640) atrás do casal cliente (x 265-540), plaquinha "DEPOIMENTO" cortada ("POIMEN"); etiqueta vermelha "SÓ VOCÊ SABE" em y 315 sobre o quadro da parede, 215 px acima do balão; fotógrafo (x 575-715) com câmera e flash; nuvem verde, HDs, tablet "GALERIA", celular, proposta, contrato e maquininha "30%" em fila; telão no canto superior esquerdo; legenda "disso" y 1240; tapete bege e madeira em 30% inferior.

| peça | chão/tapete | fotógrafo | telão | problema | sobreposição | contador/texto |
|---|---|---|---|---|---|---|
| ok (balão e estrelas legíveis, 19% da largura em contexto) | ok | ok | ok | ok (estrelas cinza + etiqueta) | ok | ok (12/13) |

### `s12_c_solucao.png`
**O que vejo:** Contexto: quatro estrelas brancas acesas e a quinta cinza (acendem uma por uma); etiqueta verde "POSTOU" em y 314 sobre o quadro; casal cliente à esquerda, fotógrafo e nuvem verde ao centro, peças em fila à direita; a estrela dourada voadora não aparece neste frame; legenda "posta" y 1240.

| peça | chão/tapete | fotógrafo | telão | problema | sobreposição | contador/texto |
|---|---|---|---|---|---|---|
| ok (balão legível) | ok | ok | ok | n/a | ok | ok (12/13) |


## s13

### `s13_a_momento.png`
**O que vejo:** Chegada do casal indicado (câmera de lado e mais alta): casal cliente à esquerda (noiva ruiva com o braço estendido apontando para a direita, noivo azul atrás), fotógrafo no centro (câmera, flash e rosto parcialmente visíveis), casal indicado à direita (noivo cinza de costas e noiva loira ao fundo, x 625-770, y 650-990), coração dourado grande entre eles (x 490-580, y 655-735); balão com 5 estrelas brancas acima do casal cliente, nuvem verde, HDs, tablet, maquininha "30%" e calendário, celular, contrato e proposta; card ✓ (y 250-378) cobre a parte de baixo do telão e dois quadros; contador 13/13; legenda "sem" y 1240 sobre os LEDs.

| peça | chão/tapete | fotógrafo | telão | problema | sobreposição | contador/texto |
|---|---|---|---|---|---|---|
| ok (coração e todas as peças do ato 2 visíveis; coração com 8% da largura, é contexto) | ok | ok (câmera na mão e rosto visível) | parcial (a parte de baixo fica atrás do card) | ok (a noiva aponta para o casal indicado que chegou) | parcial (o card cobre a base do telão e a parte de cima do balão) | ok (13/13) |

### `s13_b_problema.png`
**O que vejo:** Em "indica": card ainda digitando "pedir indicação" com cursor, sem ✓, e contador 12/13 (coerente: o momento da peça é a chegada do casal); noiva ruiva aponta com o braço estendido para a direita (x 390-460, y 650-680); fotógrafo no centro; nuvem verde, HDs, tablet, celular, proposta, contrato, maquininha; o casal indicado entra pela borda direita, o noivo cinza cortado (x 1010-1080, y 740-1090); balão de 5 estrelas acima do casal cliente; legenda "indica" y 1240; sem etiqueta (s13 só tem a de solução).

| peça | chão/tapete | fotógrafo | telão | problema | sobreposição | contador/texto |
|---|---|---|---|---|---|---|
| n/a (a peça 13 ainda não nasceu) | ok | ok | parcial (a parte de baixo fica atrás do card) | ok (casal indicado entra caminhando e a noiva aponta) | parcial (o card cobre a base do telão) | ok (12/13) |

### `s13_c_solucao.png`
**O que vejo:** Em "pronto": etiqueta verde "NOVO CLIENTE" em y 418 (x 408-728), acima da cabeça do fotógrafo e do casal indicado, sem tocar ninguém; casal indicado (noivo cinza x 545-610 e noiva loira atrás) ao lado do fotógrafo, coração dourado (x 390-460, y 675-740); a bolinha amarela corre pelo cabo do celular (x 690-705, y 700); casal cliente à esquerda; todas as peças do ato 2 em fila, telão e 3 quadros acima; contador 13/13; legenda "Pronto" y 1240; madeira e tapete bege ocupam 45% inferior.

| peça | chão/tapete | fotógrafo | telão | problema | sobreposição | contador/texto |
|---|---|---|---|---|---|---|
| ok (todas as peças do ato 2 e o coração visíveis) | ok | ok | ok | n/a | ok | ok (13/13) |


## s14

### `s14_a_momento.png`
**O que vejo:** Plano alto no início do segmento (início + 1,5 s, a câmera ainda não recuou): plataforma inteira na diagonal com os personagens no meio (casal cliente x 235-370, fotógrafo x 445-535, casal indicado x 530-615) e as peças do ato 2 em fila; telão e 3 quadros na parede; sem card (correto, s14 não tem card), contador 13/13; legenda "para" y 1240; madeira em 40% inferior e tapete bege em volta.

| peça | chão/tapete | fotógrafo | telão | problema | sobreposição | contador/texto |
|---|---|---|---|---|---|---|
| ok (plataforma e peças visíveis) | ok | ok (pequeno, com a câmera) | ok | n/a | ok | ok (13/13) |

### `s14_b_problema.png`
**O que vejo:** Em "para" + 0,3 s: mesmo enquadramento (a câmera começa a recuar só depois); plataforma e peças, personagens no centro, telão e 3 quadros acima; contador 13/13; sem card; legenda "na" y 1240.

| peça | chão/tapete | fotógrafo | telão | problema | sobreposição | contador/texto |
|---|---|---|---|---|---|---|
| ok | ok | ok | ok | n/a | ok | ok (13/13) |

### `s14_c_solucao.png`
**O que vejo:** Em "comenta" + 0,3 s: plano final com confete (cubinhos coloridos caindo) e dois dos três textos finais já na tela: "COMENTA QUAL PEÇA" branco em y 420 e "VOCÊ QUER VER" amarelo em y 540 (o terceiro, "DESMONTADA", e o @ ainda entram, por desenho, a 6 e 18 frames); legenda "Comenta" y 1240 sobre os LEDs; plataforma na diagonal com personagens e peças em fila, telão na parede, 3 quadros (os textos passam por cima de dois deles e da quina do telão); contador 13/13; sem card (correto); madeira em 50% inferior.

| peça | chão/tapete | fotógrafo | telão | problema | sobreposição | contador/texto |
|---|---|---|---|---|---|---|
| ok (todas as peças do ato 2, os casais e o fotógrafo no quadro) | ok | ok (pequeno, com a câmera) | ok | n/a | parcial (os textos finais passam por cima dos quadros e da quina do telão, que são cenário; legíveis e dentro de x 150-940) | ok (13/13; sem travessão, Ç e Ê corretos) |

## Resumo

56 stills abertos. Contagem por item (7 itens por still, 392 no total): ok 269, parcial 54, FALHA 0, n/a 69.


## FALHAS

Nenhuma.

## Parciais com justificativa

- `card_s01_a_saindo` **telão**: (cortado; é close)
- `card_s01_b_saiu` **telão**: (cortado; é close)
- `card_s05_a_saindo` **problema**: (o curioso entra em fade dentro do close, semitransparente)
- `card_s05_a_saindo` **sobreposição**: (o curioso semitransparente passa por trás do contador)
- `card_s05_b_saiu` **problema**: (curioso quase opaco ao lado do álbum, cabeça sobre o contador)
- `card_s05_b_saiu` **sobreposição**: (a cabeça do curioso encosta no contador)
- `card_s09_a_saindo` **fotógrafo**: (aparece só a lente da câmera, no canto superior esquerdo)
- `card_s09_a_saindo` **sobreposição**: (a noiva cobre parte da maquininha: o ombro do noivo passa atrás do R$)
- `final_b_comenta_0.5s` **sobreposição**: (os textos finais cobrem o telão e dois quadros, que são cenário)
- `final_c_ultimo_frame` **sobreposição**: (texto final sobre o telão e quadros, cenário)
- `s00_b_problema` **problema**: (neste frame só a etiqueta aparece: câmera ao rosto e flash de tela ocorrem antes do instante amostrado)
- `s01_a_momento` **telão**: (só uma ponta na borda direita; é close da câmera)
- `s01_a_momento` **sobreposição**: (o card encosta no topo do cabelo)
- `s01_b_problema` **sobreposição**: (a etiqueta toca a quina do telão, sem cobrir o conteúdo)
- `s01_c_solucao` **sobreposição**: (etiqueta sobre a quina do telão, fora do casal retratado)
- `s02_a_momento` **telão**: (cortado na borda; é close)
- `s02_a_momento` **sobreposição**: (a etiqueta encosta no cabelo do fotógrafo)
- `s02_b_problema` **sobreposição**: (etiqueta sobre a quina do telão)
- `s02_c_solucao` **telão**: (cortado; é close)
- `s02_c_solucao` **sobreposição**: (etiqueta encosta no cabelo)
- `s03_a_momento` **telão**: (cortado; é close)
- `s03_a_momento` **sobreposição**: (card encosta no topo do cabelo)
- `s03_b_problema` **sobreposição**: (etiqueta sobre a quina do telão)
- `s03_c_solucao` **sobreposição**: (etiqueta sobre a quina do telão)
- `s04_a_momento` **peça**: (câmera com flash e mãos ocupa 45% pela caixa declarada, mas o grupo visível mede 32% da largura: a caixa inclui os antebraços)
- `s04_b_problema` **sobreposição**: (o globo cobre as cabeças do casal, parte da festa)
- `s04_c_solucao` **peça**: (grupo visível 32% da largura, caixa 45%)
- `s05_c_solucao` **peça**: (álbum com 11% da largura e ainda fechado neste frame; abre logo depois)
- `s06_a_momento` **peça**: (30% da largura: o celular é alto e estreito e a altura da janela útil de 590 px limita antes dos 45%; o log do enquadramento marca "limitada pela altura")
- `s06_b_problema` **peça**: (celular inteiro e visível, mas com 7% da largura porque o plano precisa mostrar o fotógrafo e o casal; a tela vazia lê como cinza)
- `s06_c_solucao` **peça**: (celular inteiro com 7% da largura; o contexto precisa caber o fotógrafo e o casal)
- `s08_a_momento` **peça**: (38% da largura com a base, apenas 2,5 pontos abaixo da faixa de 40,5%: o solver mede 45% pela caixa declarada, que é um pouco maior que o suporte real)
- `s08_a_momento` **fotógrafo**: (rosto cortado pela borda esquerda no close; é close do contrato)
- `s08_a_momento` **sobreposição**: (o card cobre o celular e o cabo, peças vizinhas)
- `s09_a_momento` **fotógrafo**: (cortado: só pernas e câmera; é close da maquininha)
- `s09_a_momento` **sobreposição**: (o card cobre o tronco do fotógrafo e a parte de cima do contrato)
- `s09_b_problema` **sobreposição**: (a etiqueta termina em x 965, 5 px além do limite de 960, e fica perto do contador)
- `s09_c_solucao` **sobreposição**: (a etiqueta termina em x 965, 5 px além do limite, e fica a 25 px do contador)
- `s10_a_momento` **sobreposição**: (o card cobre o telão e a cabeça do fotógrafo; a nuvem cobre o tronco dele)
- `s10_b_problema` **sobreposição**: (a etiqueta termina em x 965, 5 px além do limite de 960, e fica a 25 px do contador)
- `s11_a_momento` **fotógrafo**: (cortado: só pernas e câmera; é close do tablet)
- `s11_a_momento` **sobreposição**: (contador encosta na câmera do fotógrafo; card cobre o cabo)
- `s11_b_problema` **peça**: (tablet inteiro e legível, mas com 14% da largura em contexto)
- `s11_b_problema` **problema**: (o celular pixelado existe na mão da noiva, mas mede 50 px de largura e a pixelização só se percebe de perto)
- `s11_b_problema` **sobreposição**: (a etiqueta toca o canto do telão, fora da imagem dele)
- `s11_c_solucao` **peça**: (tablet inteiro e legível, 14% da largura em contexto)
- `s11_c_solucao` **sobreposição**: (a etiqueta toca o canto do telão, fora da imagem dele)
- `s12_a_momento` **peça**: (balão com 38% da largura, 2,5 pontos abaixo da faixa de 40,5%; a caixa do close inclui as cabeças do casal e a plaquinha fica escondida atrás deles)
- `s12_a_momento` **sobreposição**: (a legenda cobre as pernas do casal; o casal cobre a plaquinha do balão)
- `s13_a_momento` **telão**: (a parte de baixo fica atrás do card)
- `s13_a_momento` **sobreposição**: (o card cobre a base do telão e a parte de cima do balão)
- `s13_b_problema` **telão**: (a parte de baixo fica atrás do card)
- `s13_b_problema` **sobreposição**: (o card cobre a base do telão)
- `s14_c_solucao` **sobreposição**: (os textos finais passam por cima dos quadros e da quina do telão, que são cenário; legíveis e dentro de x 150-940)
