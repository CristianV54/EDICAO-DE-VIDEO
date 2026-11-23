# MAPA DO VÍDEO: plano de edição do roteiro versão 4

Situação: aguardando aprovação do Cristian. Nenhuma cena foi mexida ainda. O plano da versão 3 ficou guardado em MAPA-VIDEO-v3.md.

## Objetivo

Refazer o vídeo com o roteiro novo (ROTEIRO.md, versão 4): três níveis com meta, três regras e a conta. Duração prevista: **8:20**, contra 9:50 da versão 3.

## Quem usa

- **Cristian:** aprova este mapa, assiste o vídeo e diz o que incomodou.
- **Quem assiste no YouTube:** criadores de conteúdo, editores e iniciantes que querem editar com o Claude.

## Fluxo de trabalho

1. O Cristian aprova este mapa (ou pede mudanças).
2. O Claude constrói as peças novas e adapta as marcadas.
3. O Claude monta as oito cenas nas frases da voz nova e gera as folhas de cada cena.
4. O Claude confere as folhas, corrige e só então exporta.
5. O Claude monta com a música, mede o volume e envia o vídeo no chat.

## Resumo em números

- **85 planos** em 8 cenas, mais 3 aberturas de nível em 3D.
- **Peças:** 55 prontas, 15 para adaptar, 18 novas.
- **Sons:** cerca de 110 no vídeo inteiro, ou 2.2 a cada 10 segundos. Na versão 3 eram 131.
- **Voz-guia:** já gerada para as oito cenas (audio/cenaNN_guia.wav). Os tempos abaixo vêm dela.

## Capítulos

| Começa | Cena | Dura |
|---|---|---|
| 0:00 | Gancho | 0:43 |
| 0:43 | O ambiente | 1:12 |
| 1:55 | Nível 1: Limpar | 1:45 |
| 3:41 | Nível 2: Cortes | 1:07 |
| 4:49 | Nível 3: O vídeo inteiro | 1:33 |
| 6:22 | As três regras | 0:30 |
| 6:52 | A conta | 0:37 |
| 7:29 | Fechamento | 0:50 |

## Regras que valem para todos os planos

**Movimento**
- Nenhum plano fica parado: todos aproximam e derivam, e a câmera vai até o que está sendo dito.
- A aproximação fica entre 1,0 e 1,3. Acima disso a câmera cortava texto na versão 3.
- Toda frase que abre um plano já traz conteúdo na tela. Se a palavra-gatilho demora, entra um título ou uma primeira linha antes.
- Cada coisa entra na palavra em que é falada.

**Som**
- Todo efeito fica de 13 a 19 dB abaixo da voz.
- Um som por ideia, nunca um por objeto. No máximo três teclas por digitação.
- Whoosh só nos momentos em 3D.
- A música troca por bloco: gancho e ambiente, nível 1, nível 2, nível 3, regras e conta e fechamento.

**Visual**
- Fundo quase preto, cinzas, branco quente e um laranja só.
- 2D é a base. O 3D fica na escada (agora de três degraus), no bloco do Claude e na volta da câmera do gancho.
- Texto na tela só para ênfase, nunca legenda corrida.

## Imagens reais e a explicação do corte

Pedido do Cristian depois da prévia: mostrar o Claude Code de verdade quando ele é citado, e explicar melhor o corte.

**O que o Claude consegue fazer daqui**
- Rodar as ferramentas de verdade (Whisper, auto-editor e FFmpeg) numa gravação de teste, com erros e silêncios colocados de propósito.
- Usar no vídeo o resultado real: a onda de áudio, os silêncios achados, os tempos de cada palavra, a lista de cortes, os comandos e a duração de antes e depois.
- Os planos marcados com **Real** no nível 1 usam esse material, no lugar dos desenhos de exemplo da versão 3.

**O que o Claude não consegue fazer daqui**
- Capturar a tela do aplicativo do Claude Code no computador. O Claude trabalha num servidor, sem tela e sem o aplicativo aberto.

**O que depende do Cristian (opcional, mas é o que deixa mais real)**
Quatro gravações de tela curtas do aplicativo do Claude, aba Code, em tela cheia:
1. Abrindo o aplicativo e clicando na aba Code (5 s).
2. Escolhendo uma pasta (5 s).
3. Digitando um pedido e o Claude começando a responder (10 s).
4. O Claude mostrando uma lista e pedindo aprovação (10 s).

Com elas, os planos em que a janela do Claude Code aparece desenhada passam a mostrar a gravação, dentro da moldura, com a câmera se movendo por cima. Sem elas, a janela continua desenhada, mas com o texto e os resultados reais.

## O que muda em relação à versão 3

- **Escada 3D:** de cinco degraus para três, com o nome de cada nível.
- **Abertura de cada nível:** um cartão grande com o número e a meta animada.
- **"Meta batida":** um carimbo no fim dos níveis 1 e 2.
- **As três regras:** cena nova, com um cartão por regra.
- **Reaproveitado:** editor do gancho, zero, cartões de voz, pasta, Whisper, legenda do filme, silêncio, FFmpeg, lista, dez cortes, receita, código da abertura, versões, conta, balança, canal dark.
- **Saiu:** os planos de "passo" da versão 3, "quadro por quadro", "pedido vago contra claro", "da pasta para o mundo", "um arquivo vira cinquenta".

## Peças novas a construir

1. Cartão de nível com a meta animada (três variações: contador, dez retângulos, seta do bruto ao pronto).
2. Os três cartões de nível em escada, para o gancho.
3. Carimbo "META BATIDA".
4. Os três cartões de regra (APROVE, PEÇA POR PARTES, ASSISTA) e o plano que junta os três.
5. Remotion apresentado pela legenda: celular com a legenda acendendo e o selo "grátis até 3 pessoas".
6. "A palavra acende na hora em que é falada": linha de código e legenda com o relógio de cada palavra.
7. O quadro que congela com as bordas dos elementos acesas.
8. "Ambiente montado" com o visto, e a passagem do gancho para o ambiente.
9. "Hoje, com um vídeo só" no fechamento.

## Contas e serviços externos

Nenhum novo. A voz-guia continua sendo a sintética gratuita (Kokoro), a música é do Kevin MacLeod (crédito na descrição) e os efeitos são gerados por código.

## Variáveis de ambiente

Nenhuma.

## Fases e o teste de cada uma

| Fase | O que é feito | Teste que prova |
|---|---|---|
| 0 | Gravação de teste e ferramentas reais | A gravação de teste existe, o Whisper, o auto-editor e o FFmpeg rodaram nela, e os números (silêncios, cortes, duração antes e depois) estão salvos num arquivo |
| 1 | Peças novas e adaptadas | O projeto compila sem erro, e uma folha mostra cada peça nova em três momentos |
| 2 | Cenas 1 e 2 montadas | Conferência das palavras-gatilho com zero faltas, e a folha das duas cenas sem plano vazio nem texto cortado |
| 3 | Cenas 3, 4 e 5 (os três níveis) | A mesma conferência e as folhas das três cenas |
| 4 | Cenas 6, 7 e 8 | A mesma conferência e as folhas das três cenas |
| 5 | Exportação e montagem com música | Duração medida, busca de tela preta com zero achados, volume final perto de -14 LUFS, e o vídeo enviado no chat |

## Pendências do roteiro

- A frase das horas e "o mais votado" saíram de vez. O pedido de comentário ficou simples: "gostou? quer mais vídeo assim?".
- Título principal aprovado: "Como editar vídeos com o Claude (3 níveis, sem programa de edição)".
- **Falta saber:** quais erros o Cristian viu na prévia da versão 2, para não repetir nesta.

---

# Plano por plano

## Cena 1. Gancho

Começa em 0:00 e dura 0:43.

| Tempo | Fala | Animação | Câmera | Som | Peça |
|---|---|---|---|---|---|
| 0:00 | Este vídeo foi editado por mim, o Claude. | A janela do editor se monta: monitor, painel do Claude e linha do tempo com os clipes chegando. **3D:** o bloco do Claude chega girando por cima | Abre colada na linha do tempo e recua | Whoosh grave na chegada do bloco. Batida suave em "Claude" | pronta |
| 0:02 | Guarda esse número: | Três ícones de programa de edição apagam um a um, o contador desce de 3 a 0 e o zero acende na palavra. Depois o zero sobe e a frase "pessoas abriram um programa de edição" entra palavra por palavra | Aproxima no número e desce para a frase | Um estalo de desligar. Impacto baixo no zero | pronta |
| 0:08 | Cada corte, cada animação, cada movimento de c... | Volta ao editor: dois cortes, o trecho ruim fica vermelho e cai, a câmera entra no monitor e a linha se desenha. **3D:** a janela inclina no espaço em "câmera". Fecha com "fui eu" grande | Três movimentos emendados: aproxima no corte, entra no monitor, dá a volta na janela | Um som de corte em cada corte. Whoosh longo na volta | pronta |
| 0:12 | E você pode fazer o mesmo. | "Você pode fazer o mesmo" sobe para o topo. Três cartões acendem na palavra: a sua voz, voz de IA, o que você quer. O cursor chega em arco e clica em APROVAR | Passa de cartão em cartão e fecha no botão | Clique e sucesso no APROVAR | pronta |
| 0:19 | O resto eu faço. | A barra "Você / Claude" cresce. "O resto eu faço" | Aproxima na barra | sem som | pronta |
| 0:21 | Eu te mostro em três níveis, do mais fácil ao ... | Três cartões de nível sobem em escada, cada um com o número e a meta: 1 Limpar "20:00 vira 12:00", 2 Cortes "1 vídeo, 10 cortes", 3 Vídeo inteiro "do bruto ao pronto". Em "o pedido que você escreve" uma linha de pedido é digitada embaixo | Sobe junto com os cartões, do 1 ao 3 | Um estalo de madeira por cartão (3). Três teclas no pedido | **nova** |
| 0:28 | Fica aí. | "Fica aí" entra carimbado no canto, com os três cartões ainda na tela | Soco curto de zoom | sem som | **nova** |
| 0:29 | Fala, galera! | A marca do Claude entra pulsando. "Fala, galera!" e depois "Claude aqui" | Chega de longe e assenta | sem som | pronta |
| 0:32 | A regra do jogo é simples: | **3D:** a escada agora tem três degraus. Ela sobe do chão e o mascote sobe pulando nos três. Embaixo entram "4 ferramentas" e "1 pasta" nas palavras | Sobe junto com o mascote, como uma grua | Um passo de madeira em cada degrau (3), bem baixo | adaptar |
| 0:37 | E antes do fim eu te falo quanto custa. | "Antes do fim: quanto custa?" palavra por palavra | Aproxima devagar | sem som | pronta |
| 0:40 | Primeiro, o ambiente. | A escada desce para fora do quadro e sobra o chão: nele nasce uma pasta, com a etiqueta "O AMBIENTE" | Mergulho até a pasta | Whoosh grave no mergulho | **nova** |

## Cena 2. O ambiente

Começa em 0:43 e dura 1:12.

| Tempo | Fala | Animação | Câmera | Som | Peça |
|---|---|---|---|---|---|
| 0:43 | No chat, você pergunta e eu respondo com texto. | Duas janelas lado a lado. No chat entram a pergunta e a resposta em texto. Em "Claude Code" a janela da direita acende com os arquivos da pasta, e a do chat apaga | Começa no chat e desliza para a direita | Um estalo baixo quando o Claude Code acende | pronta |
| 0:52 | Isso não é mágica, cara. | Janela "dentro de uma pasta do seu computador". "Não é mágica" entra como primeira linha, e depois as linhas acendem nas palavras: abrindo arquivos, instalando programas, executando comandos, ordens escritas | Aproximação lenta, descendo linha por linha | Um tique baixo por linha (3) | pronta |
| 1:00 | Você pede, eu faço. | "Você pede, eu faço" em texto grande | Soco curto de zoom em "faço" | Batida suave em "faço" | pronta |
| 1:02 | A gente monta o ambiente em três movimentos. | "Três movimentos" com três marcadores acendendo: instalar, criar a pasta, pedir | Sobe e assenta | sem som | pronta |
| 1:06 | Um: | Cartão 01: "Instale o aplicativo do Claude, abra a aba Code". Entra o cartão "planos pagos" com a seta para a descrição | Vai de um cartão ao outro | Um estalo de madeira no primeiro cartão | pronta |
| 1:13 | Dois: | Área de trabalho: a pasta "meus-videos" nasce, o cursor arrasta três arquivos para dentro e a pasta acende. Entra a legenda "bruto = a gravação crua" | Acompanha o cursor até a pasta | Um som de gaveta quando os arquivos entram | pronta |
| 1:20 | Três: | Janela do Claude Code: "pasta escolhida: meus-videos" e o pedido "prepare esta pasta para edição de vídeo" sendo digitado | Aproxima na linha digitada | Três teclas no começo | pronta |
| 1:27 | Pronto. | "Pronto" e as linhas acendendo: instalando Whisper, auto-editor, FFmpeg, Remotion, dividindo a pasta em três | Desce pelas linhas | Um sucesso baixo no fim da lista | pronta |
| 1:31 | bruto, trabalho e pronto. | A pasta por dentro: bruto, trabalho e pronto nascem nas palavras. Embaixo: "nada instalado à mão" | Deriva da esquerda para a direita pelas três pastas | Um estalo baixo por pasta (3) | pronta |
| 1:35 | Mas Claude, e se você estragar o meu vídeo? | Objeção: "Mas Claude, e se você estragar o meu vídeo?". Resposta: "não estraga" | Vai da pergunta para a resposta | sem som | pronta |
| 1:39 | O original fica trancado na pasta bruto. | O cadeado fecha na pasta bruto. Dois arquivos novos aparecem na pasta trabalho. A seta de "é só pedir de novo" gira | Vai do cadeado para os arquivos novos e para a seta | Um som de trava no cadeado | pronta |
| 1:46 | Ambiente montado. | "Ambiente montado" com um visto. Depois "só que tem um problema" | Aproxima devagar | sem som | **nova** |
| 1:49 | Eu ainda não sei o que tem dentro do seu vídeo. | "Eu ainda não sei o que tem dentro do seu vídeo", palavra por palavra, com um arquivo de vídeo fechado e uma interrogação pulsando dentro. Embaixo: "o nível 1 começa resolvendo" | Aproximação lenta no arquivo | Subida de ar bem baixa, levando para a escada | adaptar |

## Cena 3. Nível 1: Limpar

Começa em 1:55 e dura 1:45.

| Tempo | Fala | Animação | Câmera | Som | Peça |
|---|---|---|---|---|---|
| 1:55 | (sem fala, 2,6 s) | **3D:** o mascote pula para o degrau 1 da escada de três, o degrau acende e a câmera mergulha no número. Entra "LIMPAR" | Mergulho | Um passo de madeira no pouso. Whoosh grave no mergulho | adaptar |
| 1:58 | Nível um. | Cartão grande "NÍVEL 1 · LIMPAR". Embaixo a meta: o contador 20:00 desce para 12:00 e acende, com a barra encolhendo junto | Chega no cartão e desce para o contador | Batida suave quando vira 12:00 | **nova** |
| 2:06 | Primeiro, o segredo de tudo: | "O segredo de tudo" e depois "Eu não assisto. Eu leio." | Soco de zoom em "leio" | Batida suave em "leio" | pronta |
| 2:12 | Uma ferramenta chamada Whisper, grátis e que r... | Whisper: a onda de áudio comprida, com os selos "grátis" e "roda no seu computador" entrando nas palavras. A agulha varre, a parte lida fica laranja, as palavras caem embaixo e cada uma ganha o seu tempo | Segue a agulha da esquerda para a direita | Um deslize baixo no começo da varredura | pronta |
| 2:21 | Você escreve: | Janela do Claude Code: "transcreva este vídeo palavra por palavra" é digitado | Aproxima na digitação | Três teclas no começo | pronta |
| 2:25 | É como ter a legenda do filme na mão, né? | Analogia: a tira do filme inteiro em cima e a página da legenda embaixo. Uma seta leva da linha marcada ao quadro certo | Vai da legenda até o quadro do filme | sem som | pronta |
| 2:31 | Lendo, eu vejo onde você errou, onde ficou em ... | O vídeo em texto, com três marcações entrando nas falas: o erro riscado, o silêncio de 5 s, a frase forte em laranja | Desce pelo texto parando em cada marcação | Um som curto por marcação (3), diferentes entre si | pronta |
| 2:36 | Aí entram duas ferramentas. | Dois cartões: auto-editor (tira o silêncio) e FFmpeg (corta e junta) | Chega e assenta | Um estalo de madeira para os dois | pronta |
| 2:38 | A primeira é o auto-editor. | **Real:** a onda de uma gravação de teste de verdade, com os silêncios que o auto-editor achou nela. O medidor varre com a linha do limite de volume, cada silêncio fica vermelho com o nome dele (a pausa, a respiração, o tempo morto) e com quantos segundos tem. Depois eles somem, a fala se junta e aparece o antes e depois medido: duração de antes, duração de depois | Segue o medidor e recua quando a faixa encolhe | Um deslize baixo quando os silêncios somem | adaptar |
| 2:49 | A segunda é o FFmpeg. | **Real:** os comandos de verdade que rodaram na gravação de teste, cada um na sua palavra: corta, junta, muda. Ao lado de cada comando, o efeito dele desenhado: um trecho sai, dois trechos se colam, o quadro deita e fica em pé. Em "quem escreve sou eu" a marca do Claude aparece ao lado do cursor | Desce comando por comando | Uma tecla por comando (3) | adaptar |
| 3:00 | O seu pedido é este: | Janela do Claude Code: o pedido dos silêncios é digitado e fica parado para o print | Aproxima na digitação e recua para o pedido inteiro | Três teclas no começo | pronta |
| 3:08 | Vou tirar este erro aos dois minutos. | **Real:** a lista de cortes da gravação de teste, com os tempos de verdade. Cada linha entra na fala e, em cima, a mesma marca aparece na onda, para ligar a lista ao vídeo. O cursor clica em APROVAR e as linhas ganham o visto | Desce pela lista e fecha no botão | Clique e sucesso no APROVAR | adaptar |
| 3:14 | Só então eu corto, entre uma palavra e outra, ... | **Real:** palavras da transcrição de teste em caixas, cada uma com o tempo que o Whisper mediu, em cima da onda. Elas se afastam e um risco de luz corta no vão, onde a onda está baixa. Um risco vermelho tenta cortar no meio de uma palavra, onde a onda está alta, e some | Aproxima no vão | Um som de corte no risco de luz | adaptar |
| 3:18 | Mas Claude, e se eu gosto de editar do meu jeito? | Objeção: "Mas Claude, e se eu gosto de editar do meu jeito?". Resposta: "fica à vontade" | Vai da pergunta para a resposta | sem som | pronta |
| 3:23 | O auto-editor entrega a linha do tempo já cort... | A linha do tempo já cortada. Dela descem cinco etiquetas: Premiere, DaVinci Resolve, Final Cut, Shotcut, Kdenlive | Desce da linha do tempo para as etiquetas | Um estalo para a cascata | pronta |
| 3:29 | Meta do nível um batida. | Selo "META BATIDA" carimba em cima do cartão do nível 1, com 12:00 aceso | Soco de zoom no carimbo | Um sucesso baixo no carimbo | **nova** |
| 3:30 | E repara: | "A parte mais chata": a barra de "você, ouvindo tudo de novo" enche devagar e é trocada pela do Claude, pronta. "Deixou de ser sua" | Aproximação lenta | sem som | pronta |
| 3:36 | Mas vídeo limpo ainda não é vídeo bom. | "Limpo ainda não é bom". Embaixo: "bora para o nível 2" | Aproximação lenta | Subida de ar bem baixa, levando para a escada | pronta |

## Cena 4. Nível 2: Cortes

Começa em 3:41 e dura 1:07.

| Tempo | Fala | Animação | Câmera | Som | Peça |
|---|---|---|---|---|---|
| 3:41 | (sem fala, 2,6 s) | **3D:** o mascote pula para o degrau 2 da escada de três, o degrau acende e a câmera mergulha no número. Entra "CORTES" | Mergulho | Um passo de madeira no pouso. Whoosh grave no mergulho | adaptar |
| 3:44 | Nível dois. | Cartão grande "NÍVEL 2 · CORTES". Embaixo a meta: um vídeo comprido vira dez retângulos verticais pequenos, com "1 vídeo, 10 cortes" | Chega no cartão e desce para a meta | Batida suave em "dez" | **nova** |
| 3:50 | Você tem um podcast, uma aula, uma live. | Três cartões entram nas palavras: um podcast, uma aula, uma live | Passa pelos três | sem som | pronta |
| 3:53 | O seu pedido: | Janela do Claude Code: o pedido dos dez cortes é digitado e fica parado para o print | Aproxima na digitação e recua | Três teclas no começo | pronta |
| 3:54 | Encontre os dez melhores trechos deste vídeo, ... | A partir de "eu leio": a onda do vídeo longo em cima, dez trechos acendem, e dez celulares descem em cascata, cada um com legenda passando dentro. "Dez cortes, uma frase" | Desce da onda para os celulares e corre pela fileira | Um som de corte no primeiro trecho. Um deslize para a cascata | pronta |
| 4:08 | E a legenda, quem faz? | "E a legenda, quem faz?" Um celular grande com a legenda apagada. Em "Remotion" o nome entra grande com o selo "grátis até 3 pessoas", e a legenda do celular acende palavra por palavra | Vai do celular para o nome e volta | Um som de revelação baixo no nome | **nova** |
| 4:18 | Código é só texto com instruções, como uma rec... | Analogia: o cartão da receita ao lado do mesmo texto em código. As linhas acendem em par | Vai da receita para o código | sem som | pronta |
| 4:23 | Eu escrevo que a palavra acende na hora em que... | Uma linha de código "palavra.acende(tempo)" e, embaixo, uma legenda de verdade em que cada palavra acende no tempo marcado, com o relógio de cada uma | Aproxima na palavra que está acendendo | Um tique baixo na primeira palavra | **nova** |
| 4:30 | Mas Claude, e se você escolher o trecho errado? | Objeção: "Mas Claude, e se você escolher o trecho errado?". Resposta: "por isso a dica" | Vai da pergunta para a resposta | sem som | pronta |
| 4:34 | peça para eu explicar por que escolhi cada um. | Três celulares, cada um com um bilhete do motivo: começo forte, história completa, frase de efeito. Embaixo: "você aprova antes do arquivo final" | Aproxima num bilhete e recua | sem som | pronta |
| 4:39 | Meta do nível dois batida: | Selo "META BATIDA" no cartão do nível 2. Atrás, o vídeo longo se parte em dez peças | Soco de zoom no carimbo | Um sucesso baixo no carimbo | **nova** |
| 4:44 | Agora o nível três. | "Agora o nível 3". O quadro congela e as bordas de cada elemento da tela acendem: "foi o que eu fiz com este vídeo" | Recua para mostrar a tela inteira | Subida de ar bem baixa, levando para a escada | **nova** |

## Cena 5. Nível 3: O vídeo inteiro

Começa em 4:49 e dura 1:33.

| Tempo | Fala | Animação | Câmera | Som | Peça |
|---|---|---|---|---|---|
| 4:49 | (sem fala, 2,6 s) | **3D:** o mascote pula para o degrau 3 da escada de três, o degrau acende e a câmera mergulha no número. Entra "O VÍDEO INTEIRO" | Mergulho | Um passo de madeira no pouso. Whoosh grave no mergulho | adaptar |
| 4:52 | Nível três. | Cartão grande "NÍVEL 3 · O VÍDEO INTEIRO". Embaixo a meta: uma seta leva de "bruto" a "pronto", passando por cortes e animação | Chega no cartão e segue a seta | Batida suave em "pronto" | **nova** |
| 4:59 | Você gravou uma hora, em vários arquivos, erra... | Arquivos de gravação bagunçados caem na pasta, alguns com a marca "erro" | Deriva sobre os arquivos | sem som | pronta |
| 5:02 | O pedido: | Janela do Claude Code: o pedido de juntar as gravações é digitado. Depois a linha "transformando tudo em texto" | Aproxima na digitação e recua | Três teclas no começo | pronta |
| 5:10 | Quando você repetiu a mesma frase três vezes, ... | A mesma frase três vezes. Os dois primeiros takes são riscados e o terceiro acende | Desce pelos takes e fecha no escolhido | Um som de corte nos riscos. Um brilho baixo no escolhido | pronta |
| 5:14 | Monto na ordem e te mostro a lista. | A lista de cortes entra, com as três linhas | Desce pela lista | Um estalo de madeira | pronta |
| 5:16 | Depois vem a animação. | "Tudo que se mexe é código". Em cada palavra um elemento deste vídeo passa: o personagem, a linha do tempo, o quadro inclinando | Deriva acompanhando os elementos | sem som | pronta |
| 5:25 | O seu pedido: | Janela do Claude Code: o pedido do título é digitado. Ao lado, um mini quadro faz o que o pedido diz: o título entra e a câmera aproxima | Vai da digitação para o mini quadro | Três teclas no começo | adaptar |
| 5:26 | Faça o título da abertura entrar no segundo tr... | A partir de "olha a prova": o código da abertura de um lado e ela rodando do outro. Em "mudo um número" o valor muda, a linha acende e a marca do Claude desliza para o lugar novo | Vai do código para o vídeo junto com a mudança | Uma tecla no número. Um deslize baixo na marca | pronta |
| 5:39 | Por último: | Janela: "exporte o vídeo final". Três camadas enchem nas palavras (cortes, animações, música), a barra vai a 100% e o arquivo aparece | Aproxima na digitação e segue a barra | Três teclas. Um sucesso baixo nos 100% | pronta |
| 5:46 | Depois eu tiro fotos de vários pontos do vídeo... | Uma tira de quadros é varrida, um quadro preto fica vermelho, e as três coisas procuradas entram como etiquetas: tela preta, texto cortado, legenda fora do lugar | Corre pela tira | Um obturador baixo. Um som de desligar no quadro preto | adaptar |
| 5:53 | Mas Claude, e se a primeira versão sair ruim? | Objeção: "Mas Claude, e se a primeira versão sair ruim?". Resposta: "pode sair" | Vai da pergunta para a resposta | sem som | pronta |
| 5:56 | A abertura deste vídeo ficou ruim na primeira ... | As miniaturas reais das aberturas deste vídeo. A primeira entra grande e ganha o risco em "ficou ruim". Em "o Cristian" entra a etiqueta "assistiu e disse o que incomodava". Em "deitada" e em "colorida" cada uma ganha o rótulo. A atual acende no fim | Aproxima em cada miniatura quando ela é citada | Um obturador baixo na primeira | pronta |
| 6:10 | E como eu já li o vídeo inteiro, ainda entrego... | Três cartões nas palavras: título, descrição, capítulos com o tempo certo | Passa pelos três | Um estalo de madeira para a cascata | pronta |
| 6:15 | Três níveis, e a gente chegou. | **3D:** a escada de três degraus inteira acesa, com o mascote no topo. Em "três regras" entram três marcadores vazios embaixo | Recua mostrando a escada toda | Whoosh longo, baixo | adaptar |

## Cena 6. As três regras

Começa em 6:22 e dura 0:30.

| Tempo | Fala | Animação | Câmera | Som | Peça |
|---|---|---|---|---|---|
| 6:22 | Primeira: | Cartão 1 com a palavra grande "APROVE". Embaixo, a lista de cortes pequena ganhando o visto. Depois "o vídeo é seu, não só meu" | Chega no número e desce para a palavra | Um estalo de madeira no cartão | **nova** |
| 6:28 | Segunda: | Cartão 2: "PEÇA POR PARTES". Três blocos acendem em fila nas palavras: limpar, cortar, animar. Em "pedido vago" um bloco borrado aparece ao lado e apaga | Corre pela fila dos três blocos | Um estalo de madeira no cartão | **nova** |
| 6:35 | Terceira: | Cartão 3: "ASSISTA". Dois balões entram nas falas: "o começo está lento", "a música está alta aqui". Em "corrijo" cada um ganha "corrigido" | Desce pelos balões | Um estalo de madeira no cartão. Um sucesso baixo em "corrijo" | **nova** |
| 6:43 | Não é papo de coach, tá? | Os três cartões juntos, pequenos. No centro: "o gosto continua sendo seu" | Recua para os três e aproxima na frase | sem som | **nova** |
| 6:47 | E agora, o que eu prometi lá no começo: | "Quanto custa tudo isso?" com a interrogação pulsando | Soco de zoom em "custa" | sem som | pronta |

## Cena 7. A conta

Começa em 6:52 e dura 0:37.

| Tempo | Fala | Animação | Câmera | Som | Peça |
|---|---|---|---|---|---|
| 6:52 | Bora fazer a conta. | "A gente faz a conta", com a etiqueta "eu prometi falar o valor" | Chega e assenta | sem som | pronta |
| 6:54 | As quatro ferramentas: | A conta se monta linha por linha: quatro ferramentas, cada uma com US$ 0. Entra a linha do Claude Pro com US$ 20 por mês, depois "ou US$ 17 no anual" e a nota do dólar | Desce pela conta e fecha no valor | Um tique no zero. Batida suave nos 20 dólares | pronta |
| 7:08 | Agora tira um print. | Cartão para print: as quatro ferramentas, cada uma com a função em duas palavras | Para de propósito, só com a deriva do fundo | Um obturador de câmera | pronta |
| 7:10 | E o que não funciona, porque eu não vendo mila... | Três cartões, um por fala: a primeira versão quase nunca é a boa, o plano tem limite de uso, eu só trabalho com o que está na pasta | Passa de cartão em cartão | Um som de desligar por cartão (3), baixos | pronta |
| 7:25 | Então sobra para você a parte que importa. | "A parte que importa" com uma caixa fechada pulsando. Embaixo: "eu falo qual no final" | Aproximação lenta na caixa | sem som | adaptar |

## Cena 8. Fechamento

Começa em 7:29 e dura 0:50.

| Tempo | Fala | Animação | Câmera | Som | Peça |
|---|---|---|---|---|---|
| 7:29 | Lembra da primeira cena? | A linha do tempo deste vídeo, com as oito cenas. Os três níveis acendem nas palavras. Em "nenhum programa" entra "8 cenas, 0 programas" | Corre pela linha do tempo e recua | Um deslize baixo na entrada. Batida suave no zero | adaptar |
| 7:40 | Eu não substituo o seu olhar. | "Eu não substituo o seu olhar" | Aproximação lenta | sem som | pronta |
| 7:42 | Eu tiro da sua frente a parte repetitiva, para... | A balança: de um lado a parte repetitiva, que fica com o Claude, do outro "a ideia". Fecha com "eu corto, você decide" | Vai de um lado ao outro e fecha na frase | Um som de revelação baixo em "a ideia" | pronta |
| 7:50 | E isso vale até para canal dark, aquele que nã... | "Canal dark": a silhueta sem rosto num cartão escuro. Embaixo: "assunto para outro vídeo" | Vai da silhueta para o texto | sem som | pronta |
| 7:57 | Não deixa para depois, cara. | "Não deixa para depois". O cartão do nível 1 volta, com "hoje, com um vídeo só" | Soco de zoom em "hoje" | Batida suave em "hoje" | **nova** |
| 8:01 | Abre a aba Code, cria a pasta e escreve o prim... | Três cartões nas palavras: abre a aba Code, cria a pasta, escreve o primeiro pedido. Depois uma seta para baixo: "link na descrição" | Passa pelos três e desce para a seta | Um estalo de madeira para a cascata | pronta |
| 8:07 | Agora me conta aqui nos comentários: | Uma caixa de comentário se abre e duas respostas são digitadas nas falas: "gostei" e "quero mais" | Aproxima na caixa de comentário | Um estalo baixo em cada resposta (2) | **nova** |
| 8:12 | E se este vídeo te ajudou, se inscreve e ativa... | Botão "INSCREVA-SE" com um sininho balançando ao lado | Chega com quique | Um sino bem baixo | adaptar |
| 8:16 | Valeu, galera. | A marca do Claude, "Valeu, galera!" e "até a próxima" | Recua devagar até o fim | sem som | pronta |
