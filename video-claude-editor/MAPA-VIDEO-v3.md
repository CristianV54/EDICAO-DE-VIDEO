# Mapa do vídeo: animações, câmera e som

Situação: aguardando aprovação do Cristian. Nada será renderizado antes disso.

Feito para o roteiro versão 3 com os quatro ajustes de 23/11/2026. Os tempos vêm da voz-guia: o vídeo fica com cerca de 9 minutos e 50 segundos, em 92 planos. Este arquivo é gerado por `ferramentas/mapa.py`.

## Por que este mapa existe

O Cristian assistiu ao rascunho e apontou três problemas:

1. **Efeitos sonoros altos e sem sentido,** um a cada segundo, cobrindo a voz.
2. **Momentos parados,** com muito tempo sem animação.
3. **Câmera parada.**

## O que eu medi no rascunho

| Medida | Rascunho | O certo |
|---|---|---|
| Volume da voz | -22,6 LUFS | referência |
| Volume dos efeitos | de -14 a -19 LUFS, ou seja, de 4 a 9 dB MAIS ALTOS que a voz | de 13 a 19 dB mais baixos que a voz |
| Quantidade de efeitos | 220 em 7 min e 47 s: quase 5 a cada 10 segundos | cerca de 100 no vídeo inteiro: menos de 2 a cada 10 segundos |

A causa do volume foi um erro meu na conta do ganho: somei 22,6 dB que não devia, e o programa travou os sons no volume máximo. O erro já está corrigido no código (`src/motor/motor.tsx`).

A causa da quantidade foi decisão ruim: eu coloquei um som em cada cartão, em cada linha e em cada tecla.

## Regras de som deste mapa

- **Volume.** Todo efeito fica de 13 a 19 dB abaixo da voz. Nenhum passa da voz.
- **Um som por ideia.** Uma cascata de cartões leva um som só, não um por cartão.
- **Digitação.** No máximo três teclas, só no começo. O resto da digitação é mudo.
- **Whoosh.** Só nos momentos em 3D: a chegada do bloco, a volta da câmera, o mergulho na escada. São 8 no vídeo inteiro.
- **Muitos planos sem som.** Frase grande na tela, objeção e analogia entram mudas. A voz e a música levam.
- **Variação.** Cada tipo de som tem de 2 a 6 takes, e o mesmo take não repete em seguida.
- **Sincronia.** O pico do som cai no quadro do movimento.

## Regras de movimento deste mapa

- **A câmera nunca para.** Todo plano tem uma aproximação lenta e uma deriva correndo juntas, do primeiro ao último quadro. A coluna "Câmera" diz o movimento principal por cima disso.
- **Nenhum plano fica igual por mais de 3 segundos.** Plano longo ganha segunda e terceira batida: a câmera vai para um detalhe, ou entra uma coisa nova na fala.
- **Tudo entra na palavra.** Cartão, linha, rótulo e número aparecem quando são ditos, não todos de uma vez.
- **Toda tela mostra algo vivo.** Cursor piscando, onda mexendo, relógio correndo, legenda passando.
- **Plano parado de propósito só existe um:** o cartão do print, na cena 9, que precisa ficar legível.

## Onde entra 3D

Nos trechos marcados com **3D** na tabela: a chegada do bloco do Claude, a janela inclinando na palavra "câmera", a escada no gancho, a abertura de cada passo (cenas 3 a 6) e a escada inteira no fim do passo 5. O resto é 2D.

## O que este mapa pede de peça nova

A maioria dos planos usa as peças que já existem. Estas ainda precisam ser construídas ou refeitas:

- Câmera 2D com aproximação e deriva em todos os planos, e os movimentos da coluna "Câmera".
- Entrada na palavra para cartões, linhas e rótulos que hoje entram em bloco.
- Analogia da legenda do filme (cena 3) e da receita (cena 5).
- Planos de objeção "Mas Claude..." (cenas 2, 5 e 6).
- A balança da parte repetitiva e da ideia (cena 10).
- O arquivo virando cinquenta (cena 3), o pedido vago contra o claro (cena 5) e o fone de ouvido (cena 8).
- O trecho de voz do gancho com três cartões.

## Cena 1. Gancho

Começa em 0:00 e dura 0:42.

| Tempo | Fala | Animação | Câmera | Som |
|---|---|---|---|---|
| 0:00 | Este vídeo foi editado por mim, o Claude. | A janela do editor se monta: monitor, painel do Claude e linha do tempo com os clipes chegando. **3D:** o bloco do Claude chega girando por cima, e a janela desfoca atrás | Abre colada na linha do tempo e recua | Whoosh grave na chegada do bloco. Batida suave em "Claude" |
| 0:02 | Guarda esse número: | Três ícones de programa de edição entram e apagam um a um. Um contador desce de 3 a 0, e o zero acende em laranja na palavra "zero" | Aproxima devagar no número | Um estalo de desligar no último ícone. Impacto baixo no zero |
| 0:04 | É quantas pessoas abriram um programa de ediçã... | Os ícones afundam. Embaixo do zero a frase entra palavra por palavra: "pessoas abriram um programa de edição" | Desce do número para a frase | sem som |
| 0:08 | Cada corte, cada animação, cada movimento de c... | Volta ao editor. Dois cortes limpos, o trecho ruim fica vermelho e cai. A câmera entra no monitor e a linha laranja se desenha. **3D:** a janela inclina no espaço na palavra "câmera". Fecha com "fui eu" | Três movimentos emendados, sem parar: aproxima no corte, entra no monitor, dá a volta na janela | Um som de corte em cada corte. Whoosh longo na volta da câmera |
| 0:12 | E você pode fazer o mesmo. | "Você pode fazer o mesmo" em texto grande, com três cartões apagados chegando por trás | Deriva lateral | sem som |
| 0:14 | O seu trabalho é usar a sua voz, ou uma de IA,... | Os cartões acendem na palavra: "a sua voz" (onda sendo gravada), "voz de IA" (onda gerada) e "o que você quer" (pedido digitado). Depois o botão APROVAR, com o cursor chegando em arco e clicando | Passa de cartão em cartão e fecha no botão | Clique e um som de sucesso no APROVAR. Os cartões entram mudos |
| 0:19 | O resto eu faço. | Uma barra cresce: a parte de "Você" pequena e a do "Claude" grande. "O resto eu faço" | Aproxima na barra | sem som |
| 0:21 | Vale para cortes curtos, ou para um vídeo inte... | Um celular com legenda palavra por palavra entra em "cortes curtos". Uma tela larga com fotos de história entra em "vídeo inteiro" | Desliza do celular para a tela larga | Um estalo baixo em cada um |
| 0:25 | Com o nome de cada ferramenta e o pedido que v... | Quatro cartões com os nomes das ferramentas entram em cascata. Sobe a janela do Claude Code com um pedido sendo digitado. "Fica aí" | Desce dos cartões para a janela | Um estalo só para a cascata inteira. Três teclas no começo da digitação |
| 0:30 | Fala, galera! | A marca do Claude entra pulsando no centro. "Fala, galera!" e depois "Claude aqui" | Chega de longe e assenta | sem som |
| 0:33 | A regra do jogo é simples: | **3D:** a escada de cinco degraus sobe do chão e o mascote sobe pulando. Embaixo entram "4 ferramentas" e "2 jeitos de usar" nas palavras | Sobe junto com o mascote, como uma grua | Um passo de madeira em cada degrau, bem baixo |
| 0:39 | E antes do fim eu te falo quanto custa. | "Quanto custa?" grande, com a interrogação pulsando | Aproxima devagar | sem som |
| 0:41 | Passo um. | **3D:** a câmera mergulha até o degrau 1. Entra "PREPARAR" | Mergulho | Whoosh grave no mergulho e batida no título |

## Cena 2. Passo 1: Preparar

Começa em 0:42 e dura 1:28.

| Tempo | Fala | Animação | Câmera | Som |
|---|---|---|---|---|
| 0:42 | Primeiro, esquece o Claude do chat. | Duas janelas lado a lado. À esquerda o chat: entra a pergunta, entra a resposta em linhas de texto. Em "Claude Code" a janela da direita acende, com os arquivos de uma pasta aparecendo um a um, e a da esquerda apaga | Começa no chat e desliza para a janela da direita | Um estalo baixo quando a janela do Claude Code acende |
| 0:52 | A diferença, cara, é simples. | Janela do Claude Code "dentro de uma pasta do seu computador". Três linhas acendem nas palavras: abrindo arquivos, instalando programas, executando comandos. Em "ordens escritas" uma linha de comando é digitada embaixo | Aproximação lenta, descendo linha por linha | Um tique baixo em cada linha (3) |
| 1:04 | Você pede, eu faço. | "Você pede, eu faço" em texto grande | Soco curto de zoom em "faço" | Batida suave em "faço" |
| 1:06 | A gente prepara tudo em três movimentos. | "Três movimentos" com três marcadores numerados acendendo. "Se liga" | Sobe e assenta | sem som |
| 1:10 | Um: | Cartão 01: "Instale o aplicativo do Claude, abra a aba Code". Entra o selo "plano pago" e uma seta para a descrição | Aproxima no cartão e desliza para o selo | Um estalo na entrada do cartão |
| 1:17 | Dois: | Área de trabalho: a pasta "meus-videos" nasce, o cursor arrasta três arquivos para dentro e a pasta acende. Em "Bruto é a gravação crua" entra a legenda explicando | Acompanha o cursor até a pasta | Um som de gaveta quando os arquivos entram |
| 1:24 | Três: | Janela do Claude Code com o pedido sendo digitado: "prepare esta pasta para edição de vídeo" | Aproxima na linha digitada | Três teclas no começo |
| 1:31 | Pronto. | "Daqui eu assumo". Linhas acendem nas palavras: instalando Whisper, auto-editor, FFmpeg, Remotion, e por fim dividindo a pasta | Desce pelas linhas | Um som de sucesso só no fim da lista |
| 1:38 | bruto, trabalho e pronto. | A pasta por dentro: três pastas nascem nas palavras bruto, trabalho e pronto. Em "nenhuma ferramenta à mão" um aviso "tudo instalado por mim" | Deriva da esquerda para a direita pelas três pastas | Um estalo baixo em cada pasta (3) |
| 1:43 | Mas Claude, e se você estragar o meu vídeo? | Objeção em texto grande: "Mas Claude, e se você estragar o meu vídeo?". Resposta embaixo: "não estraga" | Soco de zoom na pergunta | sem som |
| 1:47 | Os seus originais ficam trancados na pasta bruto. | O cadeado fecha na pasta bruto. Dois arquivos novos de corte aparecem na pasta trabalho. Uma seta de "pedir de novo" gira | Aproxima no cadeado, depois vai para os arquivos novos | Um som de trava no cadeado |
| 1:55 | E antes de falar de ferramenta: | As quatro ferramentas em cartões, cada uma ganhando o selo "grátis". Um quinto cartão com interrogação: "o que custa dinheiro: no fim" | Percorre os cartões e para na interrogação | Um estalo para a cascata dos selos |
| 2:04 | Só que tem um problema. | "Eu ainda não sei o que tem dentro do seu vídeo", palavra por palavra. Embaixo: "é isso que o passo 2 resolve" | Aproximação lenta | Subida de ar bem baixa no fim, levando para a escada |

## Cena 3. Passo 2: Entender

Começa em 2:11 e dura 1:04.

| Tempo | Fala | Animação | Câmera | Som |
|---|---|---|---|---|
| 2:11 | (sem fala, 2,6 s) | **3D:** o mascote pula para o degrau 2, o degrau acende, e a câmera mergulha no número. Entra "ENTENDER" | Mergulho | Um passo de madeira no pouso. Whoosh grave no mergulho |
| 2:14 | Aqui está o segredo de tudo: | "Eu não assisto. Eu leio." A palavra "leio" acende | Soco de zoom em "leio" | Batida suave em "leio" |
| 2:20 | A ferramenta se chama Whisper. | Whisper: uma onda de áudio comprida. Uma agulha varre a onda, a parte lida fica laranja, as palavras caem embaixo uma a uma, e cada uma ganha o seu tempo | Segue a agulha da esquerda para a direita | Um deslize baixo quando a varredura começa. As palavras caem mudas |
| 2:31 | Você escreve: | Janela do Claude Code: o pedido "transcreva este vídeo palavra por palavra" é digitado. Linha "1 hora de vídeo virou texto" e depois "lido em segundos" | Aproxima na digitação e desce para o resultado | Três teclas. Um sucesso baixo no resultado |
| 2:40 | É como ter a legenda do filme na mão, né? | Analogia: uma tira de filme comprida de um lado e, do outro, uma página de legenda com uma linha marcada. Uma seta leva da linha marcada direto ao quadro certo do filme | Vai da legenda até o quadro do filme | sem som |
| 2:45 | Lendo, eu enxergo o vídeo inteiro de uma vez. | O vídeo inteiro em texto. Cada tipo de trecho é marcado na sua fala: erro riscado em vermelho, silêncio de 5 s, trecho bom sublinhado, frase forte em laranja | Desce pelo texto parando em cada marcação | Um som curto por marcação (4), baixos e diferentes entre si |
| 2:58 | E quando o que importa é a imagem, eu tiro fot... | Uma tira de quadros do vídeo. Três riscos de luz batem em pontos diferentes e três fotos saltam para fora | Corre pela tira e recua para mostrar as fotos | Um obturador de câmera na primeira foto só |
| 3:04 | No fim deste passo, você recebe um mapa: | O mapa: o mesmo texto já todo marcado. A legenda entra nas palavras: o que sai, o que fica, os melhores momentos | Recua para mostrar o mapa inteiro | sem som |
| 3:10 | Para um vídeo ou para cinquenta, o pedido é o ... | Um arquivo vira cinquenta: os arquivos se multiplicam numa grade. "O pedido é o mesmo" | Recua enquanto a grade cresce | Um tique baixo no começo da multiplicação |
| 3:13 | Com o mapa pronto, cortar vira a parte fácil. | "Cortar vira a parte fácil" | Aproximação lenta | sem som |

## Cena 4. Passo 3: Cortar

Começa em 3:16 e dura 1:25.

| Tempo | Fala | Animação | Câmera | Som |
|---|---|---|---|---|
| 3:16 | (sem fala, 2,6 s) | **3D:** o mascote pula para o degrau 3, o degrau acende, e a câmera mergulha no número. Entra "CORTAR" | Mergulho | Um passo de madeira no pouso. Whoosh grave no mergulho |
| 3:19 | Duas ferramentas fazem o corte. | Dois cartões grandes: auto-editor (tira o silêncio) e FFmpeg (corta e junta) | Chega e assenta | Um estalo de madeira para os dois |
| 3:21 | A primeira é o auto-editor. | auto-editor: uma faixa de áudio com blocos de fala e de silêncio. O medidor de volume varre, e cada silêncio fica vermelho com o nome dele na palavra: a pausa, a respiração, o tempo morto. Em "some tudo" os silêncios somem e a fala se junta | Segue o medidor, depois recua quando a faixa encolhe | Um deslize baixo em "some tudo". O resto mudo |
| 3:33 | A segunda é o FFmpeg. | FFmpeg: um terminal. Cada comando aparece na palavra: corta o vídeo, junta trechos, muda o formato. Em "quem escreve sou eu" a marca do Claude aparece ao lado do cursor | Desce comando por comando | Uma tecla no começo de cada comando (3) |
| 3:44 | O seu pedido é este: | Janela do Claude Code: o pedido "Tire os silêncios e os erros deste vídeo, mas me mostre a lista de cortes antes de cortar" é digitado e fica parado para o print | Aproxima na digitação e recua para o pedido inteiro | Três teclas no começo |
| 3:55 | Vou tirar este erro aos dois minutos. | A lista de cortes: cada linha entra na fala, com o tempo e o motivo. O cursor chega, clica em APROVAR, e todas as linhas ganham o visto | Desce pela lista e fecha no botão | Clique e sucesso no APROVAR |
| 4:03 | E como eu sei o tempo de cada palavra, eu cort... | Palavras em caixas, cada uma com o seu tempo. Elas se afastam e um risco de luz corta no vão. Depois um risco vermelho tenta cortar no meio de uma palavra e some: "não no meio" | Aproxima no vão entre as palavras | Um som de corte no risco de luz |
| 4:08 | Resultado: | Contador gigante: 20:00 desce para 12:00 e acende em laranja. A barra embaixo encolhe junto. "Sem arrastar nada" | Soco de zoom quando o número vira | Batida suave quando vira 12:00 |
| 4:15 | Prefere dar o acabamento com as próprias mãos? | A linha do tempo já cortada. Dela descem cinco etiquetas: Premiere, DaVinci Resolve, Final Cut, Shotcut, Kdenlive | Desce da linha do tempo para as etiquetas | Um estalo para a cascata das etiquetas |
| 4:23 | Agora uma confissão: | Confissão: a miniatura real da primeira versão da abertura, com um risco vermelho. Ao lado, quatro cartões com interrogação e a etiqueta "passo 5" | Aproxima na miniatura, depois desliza para as interrogações | Um obturador baixo na miniatura |
| 4:31 | Se está valendo a pena até aqui, se inscreve. | Botão "INSCREVA-SE" | Chega com quique | sem som |
| 4:34 | O vídeo está limpo. | "Limpo não é o mesmo que bom de assistir". Embaixo: "falta o que você está vendo agora" | Aproximação lenta | Subida de ar bem baixa no fim, levando para a escada |

## Cena 5. Passo 4: Animar

Começa em 4:41 e dura 1:21.

| Tempo | Fala | Animação | Câmera | Som |
|---|---|---|---|---|
| 4:41 | (sem fala, 2,6 s) | **3D:** o mascote pula para o degrau 4, o degrau acende, e a câmera mergulha no número. Entra "ANIMAR" | Mergulho | Um passo de madeira no pouso. Whoosh grave no mergulho |
| 4:44 | Tudo que se mexe neste vídeo é código. | "Tudo que se mexe é código". Em cada palavra seguinte, um elemento deste vídeo passa pela tela: o mascote, uma linha do tempo, um quadro inclinando | Deriva acompanhando os elementos | sem som |
| 4:50 | Código é só texto com instruções, como uma rec... | Analogia: um cartão de receita com três linhas ("1. entra o título", "2. cresce", "3. a câmera chega") e, ao lado, o mesmo texto em formato de código. As linhas acendem em par | Vai da receita para o código | sem som |
| 4:56 | A ferramenta se chama Remotion. | "Remotion" grande, e embaixo "transforma código em vídeo" | Soco de zoom no nome | Um som de revelação baixo |
| 5:00 | Em vez de arrastar um texto com o mouse, eu es... | Um mouse arrastando um título some. Entra a janela com três linhas escritas nas palavras: o título entra no segundo 3, o título cresce, a câmera se aproxima. Ao lado, um mini quadro faz o que cada linha diz | Desce linha por linha | Uma tecla por linha (3) |
| 5:07 | O Remotion desenha quadro por quadro e entrega... | Nove quadros numerados se preenchem um a um e viram uma barra completa: "código vira vídeo" | Corre pelos quadros | sem som |
| 5:10 | O seu pedido é este: | Janela do Claude Code: o pedido da legenda é digitado e fica parado para o print. Em "olha a prova" a janela desliza para o lado | Aproxima na digitação e recua | Três teclas no começo |
| 5:21 | Esta é a abertura deste vídeo. | Código de um lado, o vídeo do outro. Em "mudo um número" o valor muda no código, a linha acende, e a marca do Claude desliza para o lugar novo | Vai do código para o vídeo junto com a mudança | Uma tecla no número. Um deslize baixo na marca |
| 5:28 | Para você, isso vira três coisas. | Três cartões, um por fala: legendas palavra por palavra (com uma legenda de verdade passando dentro), textos e gráficos (um gráfico crescendo), mudanças em uma frase | Passa de cartão em cartão | Um estalo de madeira por cartão (3) |
| 5:43 | Não gostou da cor? | Dois balões de pedido: "não gostei da cor", "quero a legenda maior". Em "refaço" a miniatura ao lado troca de cor e a legenda cresce | Vai dos balões para a miniatura | Um sucesso baixo quando a miniatura muda |
| 5:49 | Mas Claude, eu não sei programar. | Objeção: "Mas Claude, eu não sei programar". Resposta: "não precisa: você descreve o que quer ver" | Soco de zoom na pergunta | sem som |
| 5:55 | E quanto mais claro for o pedido, melhor sai a... | Um pedido vago ao lado de um pedido claro. O claro acende e o resultado dele fica nítido, o do vago fica borrado | Desliza do vago para o claro | sem som |
| 5:58 | Falta só uma coisa: | "Da pasta para o mundo": a pasta se abre e o vídeo sai dela | Sobe junto com o vídeo | Subida de ar bem baixa, levando para a escada |

## Cena 6. Passo 5: Finalizar

Começa em 6:03 e dura 1:07.

| Tempo | Fala | Animação | Câmera | Som |
|---|---|---|---|---|
| 6:03 | (sem fala, 2,6 s) | **3D:** o mascote pula para o degrau 5, o degrau acende, e a câmera mergulha no número. Entra "FINALIZAR" | Mergulho | Um passo de madeira no pouso. Whoosh grave no mergulho |
| 6:06 | Você escreve: | Janela do Claude Code: "exporte o vídeo final" é digitado | Aproxima na digitação | Três teclas |
| 6:08 | Eu junto os cortes, as animações e a música, e... | Três camadas enchem nas palavras: cortes, animações, música. A barra de exportação vai a 100% e o arquivo final aparece | Segue a barra enchendo | Um sucesso baixo nos 100% |
| 6:13 | Depois eu confiro. | Três cartões de conferência acendem na fala: tamanho da imagem, duração, volume. Depois uma tira de quadros é varrida, um quadro preto fica vermelho, e as três coisas procuradas entram como etiquetas | Passa pelos cartões, depois corre pela tira | Um tique por cartão (3). Um som de desligar no quadro preto |
| 6:24 | Aí vem a parte mais importante do processo int... | "Você assiste", com a etiqueta "a parte mais importante". Embaixo: "e me fala o que sentiu" | Soco de zoom em "assiste" | Batida suave em "assiste" |
| 6:31 | O começo está lento." "Esta parte ficou confus... | Três balões entram nas falas: "o começo está lento", "esta parte ficou confusa", "a música está alta aqui". Em "corrijo" cada um ganha "corrigido" | Desce pelos balões | Um estalo baixo por balão (3) |
| 6:37 | Foi assim com a abertura deste vídeo. | As miniaturas reais das aberturas deste vídeo. Entram em "a cada versão". Em "deitada" a primeira ganha o rótulo, em "colorida" a outra ganha o dela. A atual acende no fim | Aproxima em cada miniatura quando ela é citada | Um obturador baixo na primeira |
| 6:48 | Mas Claude, por que você não acerta de primeira? | Objeção: "Mas Claude, por que você não acerta de primeira?". Resposta: "eu não adivinho. Eu aprendo." | Soco de zoom na pergunta | sem som |
| 6:55 | Quem decide se o vídeo está bom é você. | "Quem decide é você" | Aproximação lenta | sem som |
| 6:58 | E como eu já li o vídeo inteiro, eu também ent... | Três cartões: ideias de título, descrição, capítulos com o tempo certo | Passa pelos três | Um estalo de madeira para a cascata |
| 7:06 | Esses são os cinco passos. | **3D:** a escada inteira acesa, com o mascote no topo | Recua mostrando a escada toda | Whoosh longo, baixo |

## Cena 7. Na prática: cortes

Começa em 7:11 e dura 0:38.

| Tempo | Fala | Animação | Câmera | Som |
|---|---|---|---|---|
| 7:11 | Primeiro jeito: | "Cortes", com a etiqueta "primeiro jeito". Embaixo entram na fala: podcast, aula, live | Chega e assenta | Batida suave em "cortes" |
| 7:17 | O pedido é este: | Janela do Claude Code: o pedido dos dez cortes é digitado e fica parado para o print | Aproxima na digitação e recua para o pedido inteiro | Três teclas no começo |
| 7:19 | Encontre os dez melhores trechos deste vídeo, ... | A partir de "eu leio": a onda do vídeo longo em cima, dez trechos acendem em laranja, e dez celulares descem em cascata, cada um com legenda passando dentro | Desce da onda para os celulares e corre pela fileira | Um som de corte no primeiro trecho. Um deslize para a cascata |
| 7:36 | Se liga na dica: | "Peça para eu explicar cada trecho", com a etiqueta "a dica". Ao lado de três celulares entram bilhetes com o motivo | Aproxima num bilhete | sem som |
| 7:43 | Isso foi tirar cortes de um vídeo pronto. | "E se você só tem a gravação crua?" Os celulares saem e entram arquivos de gravação bagunçados | Desliza para os arquivos | sem som |

## Cena 8. Na prática: vídeo inteiro

Começa em 7:49 e dura 0:31.

| Tempo | Fala | Animação | Câmera | Som |
|---|---|---|---|---|
| 7:49 | Segundo jeito: | "Vídeo inteiro", com a etiqueta "segundo jeito". Embaixo: uma hora gravada, vários arquivos, errando e repetindo | Chega e assenta | Batida suave em "inteiro" |
| 7:57 | O pedido: | Janela do Claude Code: o pedido de juntar as gravações é digitado. Depois a linha "transformando tudo em texto" | Aproxima na digitação e recua | Três teclas no começo |
| 8:04 | Quando você repetiu a mesma frase três vezes, ... | A mesma frase três vezes. Os dois primeiros takes são riscados e o terceiro acende | Desce pelos takes e fecha no escolhido | Um som de corte nos riscos. Um brilho baixo no escolhido |
| 8:08 | Monto na ordem e te mostro a lista de cortes. | Os trechos escolhidos se encaixam em ordem numa linha do tempo, e ao lado entra a lista de cortes | Vai da linha do tempo para a lista | Um estalo de madeira para a lista |
| 8:11 | Sabe a parte mais chata da edição? | "A parte mais chata deixa de ser sua". Um fone de ouvido com uma barra de "ouvindo tudo de novo" enchendo devagar, que some | Aproximação lenta | sem som |
| 8:18 | Tá, e quanto custa isso tudo? | "Quanto custa isso tudo?" | Soco de zoom | sem som |

## Cena 9. Quanto custa e o que não funciona

Começa em 8:21 e dura 0:41.

| Tempo | Fala | Animação | Câmera | Som |
|---|---|---|---|---|
| 8:21 | Lembra que eu prometi falar o valor? | "A gente faz a conta", com a etiqueta "eu prometi falar o valor" | Chega e assenta | sem som |
| 8:25 | As quatro ferramentas: | A conta se monta linha por linha: quatro ferramentas, cada uma com US$ 0. Entra a linha do Claude Pro com US$ 20 por mês, depois "ou US$ 17 no anual", e a nota do dólar | Desce pela conta e fecha no valor | Um tique no primeiro zero. Batida suave nos 20 dólares |
| 8:40 | Agora tira um print. | Cartão para print: as quatro ferramentas, cada uma com a função em duas palavras. A tela fica parada | Para de propósito, só com a deriva do fundo | Um obturador de câmera |
| 8:41 | E o que não funciona, porque eu não vendo mila... | Três cartões, um por fala: a primeira versão quase nunca é a boa (com a miniatura real da primeira abertura), pedido vago, limite de uso | Passa de cartão em cartão | Um som de desligar por cartão (3), baixos |
| 8:56 | Então sobra para você a parte que importa: | "A parte que importa: a ideia". Embaixo: "eu volto nisso no final" | Aproximação lenta | sem som |

## Cena 10. Fechamento

Começa em 9:02 e dura 0:48.

| Tempo | Fala | Animação | Câmera | Som |
|---|---|---|---|---|
| 9:02 | Lembra da primeira cena? | A linha do tempo deste vídeo, com as dez cenas. Os cinco passos acendem nas palavras. Em "nenhum programa" entra "0 programas" | Corre pela linha do tempo e recua | Um deslize baixo na entrada. Batida suave no zero |
| 9:13 | Eu não substituo o seu olhar. | "Eu não substituo o seu olhar" | Aproximação lenta | sem som |
| 9:15 | Eu tiro da sua frente a parte repetitiva, para... | Uma balança: de um lado a parte repetitiva, que vai para o Claude, do outro "a ideia", que fica com você. Fecha com "eu corto, você decide" | Vai de um lado ao outro e fecha na ideia | Um som de revelação baixo em "a ideia" |
| 9:23 | E isso vale até para canal dark, aquele que nã... | "Canal dark": uma silhueta sem rosto num cartão escuro. Embaixo: "assunto para outro vídeo" | Aproxima e recua | sem som |
| 9:29 | Começa pequeno. | Três cartões acendem nas palavras: pega um vídeo, cria a pasta, escreve o primeiro pedido | Passa pelos três | Um estalo de madeira para a cascata |
| 9:34 | Agora me diz: | Dois cartões grandes com os números 1 (cortes) e 2 (vídeo inteiro), cada um entrando na sua fala | Chega de longe e assenta | Batida suave em cada número |
| 9:43 | E se este vídeo te ajudou, se inscreve. | Botão "INSCREVA-SE" | Chega com quique | sem som |
| 9:46 | Valeu, galera. | A marca do Claude, "valeu, galera" e "até a próxima" | Recua devagar até o fim | sem som |
