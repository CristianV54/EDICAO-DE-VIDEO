# REGRAS DE RIGOR DESTE PROJETO

## 1. A tela é a verdade
- Código compilar não prova nada. Só vale o que aparece no frame renderizado.
- Nunca diga "está correto", "corrigido" ou "pronto" com base em leitura de código. Só depois de abrir a imagem do frame e ver.
- Se eu disser que algo está errado na tela, está errado, mesmo que o código pareça certo. Investigue renderizando, não argumentando.

## 2. Nada de "ok" sem ter olhado
- Todo item de checklist marcado "ok" precisa ter uma linha descrevendo o que você viu na imagem.
- Proibido marcar em lote, por folha de contato ou por amostragem.
- Se não abriu a imagem, o item fica "não verificado", nunca "ok".

## 3. Revisão em duas etapas antes de entregar
Etapa 1, autorrevisão: abra cada still e preencha o checklist.
Etapa 2, revisor independente: abra um subagente (Task) que NÃO viu o código nem o seu checklist. Ele recebe só: o prompt da tarefa, os stills, as comparações com a referência e a prévia. A missão dele é achar defeitos, como um espectador exigente no celular. Ele devolve uma lista de falhas.
- Se o revisor achar qualquer falha que a sua autorrevisão marcou como "ok", corrija, regere e rode o revisor de novo.
- Só entregue quando o revisor independente não achar nenhuma falha nova.

## 4. Assistir a prévia inteira, não só os stills
Depois de renderizar a prévia, extraia um frame por segundo do MP4 final, monte folhas e olhe todas. Procure especialmente o que os stills não pegam: transições quebradas, objetos aparecendo ou sumindo do nada, câmera tremendo ou pulando, etiqueta grudada no lugar errado, personagem atravessando objeto, legenda fora de sincronia com o que acontece na cena.

## 5. Comparar com a referência de verdade
Para cada segmento, responda por escrito: "se este frame estivesse no meio do vídeo de referência, ele pareceria do mesmo vídeo?". Se a resposta for não, diga o porquê (tamanho, cor, ângulo, movimento) e corrija.

## 6. Pensar como espectador
Para cada segmento, escreva uma frase: "quem assiste sem som entende o problema e a solução só pela imagem?". Se não entender, a encenação está fraca e precisa melhorar.

## 7. Honestidade no relatório
- Liste o que NÃO conseguiu verificar e por quê.
- Liste toda decisão que tomou por conta própria e que não estava no prompt.
- Nunca esconda limitação dentro de um "ok". Parcial é parcial, falha é falha.
- Se mudou algum número do prompt (posição, distância, tempo), diga qual, de quanto para quanto e por quê.

## 8. Formato obrigatório da entrega
1. Contagem final: ok, parcial, falha, não verificado.
2. Lista de falhas encontradas pelo revisor independente em cada rodada e como foram corrigidas.
3. Resposta das perguntas 5 e 6 para cada segmento.
4. O que não foi verificado.
5. Decisões próprias e números alterados.
6. Link da branch e caminho da prévia.

## 9. Regras fixas de texto
- Nenhum texto na tela com travessão. Prove com o grep em bytes UTF-8 e mostre a saída.
- Acentos corretos em todo texto da tela.
