# PLANO: vídeo "O Claude editou este vídeo sozinho"

Situação: aprovado pelo Cristian. Fases 0 e 2 concluídas. Fase 1 (capas) passou para o Cristian. Fase atual: 3 (prova de estilo, cena 1 em 3D).

## 1. Objetivo

Publicar no YouTube um vídeo horizontal (1920x1080) que ensina, em 5 passos, como qualquer pessoa pode usar o Claude para editar vídeos: cortes curtos, vídeos longos e canal dark. O vídeo é 100% animado, sem ninguém aparecendo. O personagem principal é o próprio Claude, que mexe na linha do tempo e mostra cada processo acontecendo. O vídeo é a prova do que ele ensina, porque foi montado pelo Claude.

Já aprovado pelo Cristian:

- Título principal: "O Claude editou este vídeo sozinho (e pode editar os seus)".
- Títulos reserva, para teste: "Como editar vídeos com o Claude em 5 passos: cortes, vídeos longos e canal dark" e "Este vídeo não teve editor: foi feito 100% pelo Claude".
- Capa A: fundo escuro, o personagem laranja sobre uma linha do tempo que se corta sozinha, texto "EDITADO POR IA" e "0 editores".
- Estrutura em 5 passos.
- Narração na voz do Cristian, gravada depois. O vídeo é montado antes e o áudio é encaixado no fim.
- Duração: alvo de 12 minutos, podendo passar disso, com teto de 20.
- Cada passo mostra o processo de verdade: a pasta do computador, o arquivo sendo colocado, o Claude acessando, o nome da ferramenta usada e o que ela faz.

## 2. Decisões tomadas pelo Cristian

1. **Material de exemplo.** Nenhuma gravação real é usada, porque os vídeos disponíveis são de clientes. Tudo é animação, inclusive o "vídeo enviado" que aparece dentro da história. Isso reforça que o vídeo foi 100% construído pelo Claude.
2. **Público.** Criadores de conteúdo, editores, pessoas começando e pessoas interessadas em IA e automação. Linguagem simples, nenhum termo técnico sem explicação.
3. **Canal.** Canal novo do Cristian, com o nome provisório "Cristian Moraes". Como o nome pode mudar, a tela final não mostra o nome do canal escrito, só a chamada para se inscrever.
4. **Entrega.** Vídeo final enviado para o Google Drive do Cristian.
5. **Retenção.** O vídeo precisa prender a atenção do começo ao fim. O Cristian vai enviar dicas de retenção, que entram como regras do roteiro na fase 2.
6. **Visual em 3D.** Capas e vídeo usam objetos em 3D, com volume, luz e sombra, e não só desenho plano. Textos continuam nítidos por cima da cena. O teste de 5 segundos da fase 0 era plano e não vale mais como referência de estilo.
7. **Teste A/B/C.** Três capas e três títulos, registrados em publicacao.md.
8. **Capas.** Em 23/11/2026 o Cristian decidiu montar as capas ele mesmo, com outra IA de imagem. As capas A, B e C feitas por código ficam em `capa/` como rascunho e referência de ideia. O Claude foca no vídeo.
9. **Personagens no vídeo.** Proposta em uso, ainda sem resposta do Cristian: o mascote de blocos é quem age nas cenas, e o bloco laranja com a estrela aparece como a marca do Claude.
10. **Regras de animação.** Em 23/11/2026 o Cristian criticou a primeira prova de estilo e indicou o fluxo de edição de Lucas Leite (github.com/LeiteZ/fluxo-de-edicao). Passam a valer para o vídeo inteiro: texto só nas palavras de destaque, linha do tempo em pé, câmera que nunca para e faz movimentos de verdade, fundo com profundidade, troca de trecho com speed ramp, e um mapa de animações por cena antes de animar (o da cena 1 está em MAPA-GANCHO.md).
11. **2D como base, 3D só em momentos.** Em 23/11/2026 o Cristian achou o 3D em tudo pesado. O plano de onde o 3D entra está em PLANO-3D.md, aguardando a aprovação dele. O gancho todo em 3D ficou guardado em `src/cenas/Gancho3D.tsx`.

## 3. Quem usa

- **Cristian (dono do canal):** aprova plano, capa, roteiro e estilo, grava a narração, publica.
- **Claude (editor):** escreve o roteiro, desenha o personagem, anima as cenas, encaixa a narração, exporta.
- **Espectador:** criador de conteúdo que quer editar mais rápido. Assiste e repete os passos no próprio computador.

## 4. Fluxos

### Fluxo de produção

1. Cristian aprova este plano e toma as decisões da seção 2 (feito).
2. Claude prepara o projeto e faz um teste de 5 segundos (fase 0).
3. Claude entrega a capa. Cristian aprova ou pede ajuste (fase 1).
4. Claude entrega o roteiro completo, com o texto da narração e a descrição de cada cena. Cristian aprova (fase 2).
5. Claude entrega o primeiro minuto animado, como prova de estilo. Cristian aprova o estilo (fase 3).
6. Claude anima o resto, em blocos (fases 4 e 5). Nessa etapa cada cena tem a duração estimada pelo número de palavras do roteiro.
7. Cristian grava a narração lendo o roteiro aprovado e envia um único arquivo de áudio (mp3, m4a ou wav).
8. Claude transcreve o áudio com marcação de tempo por palavra e ajusta a duração de cada cena para bater com a fala (fase 6).
9. Claude coloca música e efeitos sonoros, exporta e entrega o vídeo final (fase 7).
10. Claude entrega descrição, capítulos e tags. Cristian publica (fase 8).

### Fluxo que o vídeo ensina (os 5 passos)

1. **Preparar.** A pessoa instala o Claude Code e cria uma pasta com os vídeos. O Claude instala as ferramentas e organiza a pasta.
2. **Entender.** A pessoa pede a transcrição. O Claude usa o Whisper, que ouve o áudio e devolve o texto com o tempo exato de cada palavra. Com isso ele marca erros, silêncios e melhores trechos.
3. **Cortar.** A pessoa aprova a lista de cortes. O Claude usa o auto-editor para tirar silêncios e o FFmpeg para cortar e juntar os trechos.
4. **Animar.** A pessoa escolhe o estilo. O Claude usa o Remotion, que transforma código em animação: legendas, textos, movimentos de câmera e objetos.
5. **Finalizar.** A pessoa assiste e pede ajustes. O Claude exporta o vídeo e sugere título, capa e capítulos.

## 5. Cenas do vídeo

Atenção: a lista que vale é a do ROTEIRO.md, versão 2, que ficou com 10 cenas e sem canal dark. A tabela abaixo é a versão inicial, com 13.

Como este projeto é um vídeo, a "lista de telas" é a lista de cenas. Os tempos são estimativas e mudam quando a narração chegar.

| Nº | Cena | Tempo | O que aparece |
|---|---|---|---|
| 1 | Gancho | 0:00 a 0:30 | Linha do tempo vazia. O personagem entra, arrasta clipes, corta, e a câmera afasta mostrando que a linha do tempo é a deste vídeo. Texto: "Este vídeo não teve editor". |
| 2 | Promessa | 0:30 a 1:00 | Três cartões giram em 3D: Cortes, Vídeo longo, Canal dark. Depois os 5 passos aparecem em fila. |
| 3 | O que é o Claude | 1:00 a 1:45 | Janela de conversa animada. Explica a diferença entre conversar com o Claude e deixar o Claude trabalhar dentro de uma pasta (Claude Code). |
| 4 | Passo 1: Preparar | 1:45 a 3:15 | Área de trabalho de um computador. Uma pasta "meus-videos" é criada, um arquivo de vídeo é arrastado para dentro. A câmera entra na pasta. O personagem aparece lá dentro e as ferramentas chegam como caixas com nome. |
| 5 | Passo 2: Entender | 3:15 a 5:00 | O arquivo vira uma onda de áudio. O Whisper passa por cima e as palavras sobem da onda, cada uma com seu tempo. O personagem pinta de vermelho os erros e silêncios e de verde os melhores trechos. |
| 6 | Passo 3: Cortar | 5:00 a 6:45 | Linha do tempo em destaque. Os trechos vermelhos caem, os restantes se juntam. Comparação lado a lado: antes 20 min, depois 12 min. Aparece a lista de cortes que a pessoa aprova. |
| 7 | Passo 4: Animar | 6:45 a 8:30 | Tela dividida: código de um lado, a animação nascendo do outro. Legendas palavra por palavra, textos, um objeto 3D, um movimento de câmera. Explica o Remotion. |
| 8 | Passo 5: Finalizar | 8:30 a 9:30 | Barra de exportação enchendo. O arquivo final aparece na pasta. O personagem entrega título, capa e capítulos. |
| 9 | Na prática: cortes | 9:30 a 10:15 | Um vídeo longo horizontal se divide em vários verticais. Mostra o pedido exato que a pessoa escreve. |
| 10 | Na prática: vídeo longo | 10:15 a 11:00 | Várias gravações entram na pasta e saem como um vídeo só. Mostra o pedido exato. |
| 11 | Na prática: canal dark | 11:00 a 11:45 | Roteiro vira narração, imagens e animação, sem ninguém aparecer. Mostra o pedido exato e avisa o que precisa de serviço pago. |
| 12 | Repositórios | 11:45 a 12:30 | Uma prateleira com as 5 ferramentas, cada uma com nome, para que serve e o endereço. |
| 13 | Fechamento | 12:30 a 13:00 | A câmera afasta de novo para a linha do tempo deste vídeo, agora completa. Chamada para se inscrever. |

Ferramentas que o vídeo indica: FFmpeg, Whisper, auto-editor, Remotion e yt-dlp. Na fase 2, cada afirmação sobre elas é conferida na página oficial e o link fica anotado no roteiro. Pontos de atenção já conhecidos: o Claude Code precisa de plano pago, o Remotion é gratuito para pessoas e empresas pequenas e pago para empresas maiores, e o yt-dlp só deve ser indicado para baixar material próprio ou liberado.

### Personagem

Definido pelo Cristian em 23/11/2026, com base em capas de referência que ele enviou: um bloco 3D laranja de cantos arredondados, brilhante, com a estrela clara em relevo na frente. Sem olhos e sem pontas soltas, porque a versão anterior parecia um vírus. Ele se expressa pelo movimento: inclina, pula, gira e brilha. O desenho é próprio, feito para lembrar o ícone do Claude, e a descrição do vídeo informa que o canal não tem ligação com a Anthropic.

## 6. Organização dos arquivos (modelo de dados)

Tudo fica em `video-claude-editor/` dentro do repositório EDICAO-DE-VIDEO.

```
video-claude-editor/
  PLANO.md            este arquivo
  ROTEIRO.md          narração completa e descrição de cada cena
  cenas.json          lista das cenas com início, duração e texto falado
  capa/               capa em PNG 1280x720 e o código que gera
  src/                código das animações (Remotion)
  audio/              narração do Cristian, música e efeitos
  publicacao.md       descrição, capítulos e tags
```

Cada item de `cenas.json` tem: número, nome, texto da narração, duração estimada, e depois da fase 6 o início e o fim reais tirados do áudio. Os vídeos exportados não entram no repositório por causa do tamanho.

## 7. Contas e serviços externos

Nenhuma conta nova é obrigatória.

1. **Canal do YouTube:** você já tem. Nome provisório: Cristian Moraes.
2. **Google Drive:** já conectado. Usado para a entrega do vídeo final.
3. **Música de fundo:** Biblioteca de Áudio do YouTube, que é gratuita. Passo a passo: abrir o YouTube Studio, clicar em "Biblioteca de áudio" no menu da esquerda, filtrar por "Atribuição não necessária", baixar uma faixa calma e me enviar o arquivo. Na fase 7 eu digo o clima e a duração que procurar.
4. **Voz de IA (opcional, só se você desistir de narrar):** Higgsfield ou vidIQ, que já estão conectados e gastam créditos. Eu informo o custo antes de gerar.

## 8. Variáveis de ambiente

Nenhuma. O projeto não usa chave nem senha.

## 9. Fases e testes

| Fase | Entrega | Teste que prova |
|---|---|---|
| 0. Preparação | Projeto criado e um teste de 5 segundos com o personagem. Teste de envio de arquivo grande para o Drive. | O arquivo existe, tem 1920x1080 e 30 quadros por segundo, conferido com ffprobe. Mostro um quadro. O arquivo de teste aparece no seu Drive. |
| 1. Capa | Capas A, B e C em PNG, em 3D. | Cada arquivo com 1280x720 e menos de 2 MB. Mostro a imagem e simulo em tamanho pequeno, como aparece no celular. Você aprova. |
| 2. Roteiro | ROTEIRO.md e cenas.json. | Contagem de palavras entre 1.300 e 1.800, que dá de 10 a 12 minutos com as pausas de animação. O critério baixou porque a regra do Cristian é cortar tudo que não faz diferença, e não encher para bater tempo. Cada afirmação sobre ferramenta tem o link oficial conferido. Você aprova. |
| 3. Prova de estilo | Cenas 1 e 2 animadas (primeiro minuto). | Vídeo exportado e conferido. Mostro quadros de cada cena. Você aprova o estilo antes de eu fazer o resto. |
| 4. Passos | Cenas 3 a 8. | Cada cena exportada sem erro. Mostro quadros do início, meio e fim de cada uma. |
| 5. Prática e fechamento | Cenas 9 a 13 e o vídeo inteiro montado, ainda sem voz. | Duração total conferida, nenhuma tela preta ou quadro vazio na varredura automática. |
| 6. Narração | Áudio do Cristian encaixado. | Lista com o início de cada cena e o momento da frase correspondente no áudio, com diferença menor que 0,3 segundo em todas. |
| 7. Som e exportação | Música, efeitos e vídeo final. | ffprobe confirma resolução, duração e áudio. Volume medido perto de -14 LUFS. Arquivo entregue no destino combinado. |
| 8. Publicação | publicacao.md. | Capítulos conferidos contra os tempos reais do vídeo final. Título com menos de 70 caracteres. |

Uma fase por vez. Ao fim de cada uma eu mostro o que foi executado e o resultado.

## 10. Riscos

- **Tempo de exportação:** 12 minutos são cerca de 21.600 quadros. A exportação é feita cena por cena, para um erro não obrigar a refazer tudo.
- **Sessão temporária:** o ambiente onde eu trabalho é apagado depois de um tempo parado. Todo código é enviado ao GitHub ao fim de cada fase.
- **Ritmo da narração:** se a sua fala ficar mais longa que a estimativa, as cenas esticam na fase 6. Por isso as animações são feitas para aceitar duração variável.
- **Transcrição do seu áudio:** depende de baixar o modelo do Whisper neste ambiente. Isso é verificado na fase 0. Se estiver bloqueado, aviso antes de seguir.
