"""Gera o MAPA-VIDEO.md: o plano de animações, câmera e som de cada plano, com o tempo de cada fala.
Uso: python3 ferramentas/mapa.py
"""
import json
T = json.load(open('src/motor/tempos.json'))
NOMES = {1: 'Gancho', 2: 'Passo 1: Preparar', 3: 'Passo 2: Entender', 4: 'Passo 3: Cortar', 5: 'Passo 4: Animar', 6: 'Passo 5: Finalizar', 7: 'Na prática: cortes', 8: 'Na prática: vídeo inteiro', 9: 'Quanto custa e o que não funciona', 10: 'Fechamento'}
FRASES = {n: [f['txt'] for f in json.load(open(f'audio/cena{n:02d}_palavras.json'))['frases']] for n in range(1, 11)}
ABERTURA = {3: 'ENTENDER', 4: 'CORTAR', 5: 'ANIMAR', 6: 'FINALIZAR'}
S = 'sem som'
# cada plano: (primeira frase, última frase, animação, câmera e movimento, som)
P = {
1: [
 (0, 0, 'A janela do editor se monta: monitor, painel do Claude e linha do tempo com os clipes chegando. **3D:** o bloco do Claude chega girando por cima, e a janela desfoca atrás', 'Abre colada na linha do tempo e recua', 'Whoosh grave na chegada do bloco. Batida suave em "Claude"'),
 (1, 2, 'Três ícones de programa de edição entram e apagam um a um. Um contador desce de 3 a 0, e o zero acende em laranja na palavra "zero"', 'Aproxima devagar no número', 'Um estalo de desligar no último ícone. Impacto baixo no zero'),
 (3, 3, 'Os ícones afundam. Embaixo do zero a frase entra palavra por palavra: "pessoas abriram um programa de edição"', 'Desce do número para a frase', S),
 (4, 5, 'Volta ao editor. Dois cortes limpos, o trecho ruim fica vermelho e cai. A câmera entra no monitor e a linha laranja se desenha. **3D:** a janela inclina no espaço na palavra "câmera". Fecha com "fui eu"', 'Três movimentos emendados, sem parar: aproxima no corte, entra no monitor, dá a volta na janela', 'Um som de corte em cada corte. Whoosh longo na volta da câmera'),
 (6, 6, '"Você pode fazer o mesmo" em texto grande, com três cartões apagados chegando por trás', 'Deriva lateral', S),
 (7, 7, 'Os cartões acendem na palavra: "a sua voz" (onda sendo gravada), "voz de IA" (onda gerada) e "o que você quer" (pedido digitado). Depois o botão APROVAR, com o cursor chegando em arco e clicando', 'Passa de cartão em cartão e fecha no botão', 'Clique e um som de sucesso no APROVAR. Os cartões entram mudos'),
 (8, 8, 'Uma barra cresce: a parte de "Você" pequena e a do "Claude" grande. "O resto eu faço"', 'Aproxima na barra', S),
 (9, 9, 'Um celular com legenda palavra por palavra entra em "cortes curtos". Uma tela larga com fotos de história entra em "vídeo inteiro"', 'Desliza do celular para a tela larga', 'Um estalo baixo em cada um'),
 (10, 11, 'Quatro cartões com os nomes das ferramentas entram em cascata. Sobe a janela do Claude Code com um pedido sendo digitado. "Fica aí"', 'Desce dos cartões para a janela', 'Um estalo só para a cascata inteira. Três teclas no começo da digitação'),
 (12, 14, 'A marca do Claude entra pulsando no centro. "Fala, galera!" e depois "Claude aqui"', 'Chega de longe e assenta', S),
 (15, 16, '**3D:** a escada de cinco degraus sobe do chão e o mascote sobe pulando. Embaixo entram "4 ferramentas" e "2 jeitos de usar" nas palavras', 'Sobe junto com o mascote, como uma grua', 'Um passo de madeira em cada degrau, bem baixo'),
 (17, 17, '"Quanto custa?" grande, com a interrogação pulsando', 'Aproxima devagar', S),
 (18, 18, '**3D:** a câmera mergulha até o degrau 1. Entra "PREPARAR"', 'Mergulho', 'Whoosh grave no mergulho e batida no título'),
],
2: [
 (0, 3, 'Duas janelas lado a lado. À esquerda o chat: entra a pergunta, entra a resposta em linhas de texto. Em "Claude Code" a janela da direita acende, com os arquivos de uma pasta aparecendo um a um, e a da esquerda apaga', 'Começa no chat e desliza para a janela da direita', 'Um estalo baixo quando a janela do Claude Code acende'),
 (4, 6, 'Janela do Claude Code "dentro de uma pasta do seu computador". Três linhas acendem nas palavras: abrindo arquivos, instalando programas, executando comandos. Em "ordens escritas" uma linha de comando é digitada embaixo', 'Aproximação lenta, descendo linha por linha', 'Um tique baixo em cada linha (3)'),
 (7, 7, '"Você pede, eu faço" em texto grande', 'Soco curto de zoom em "faço"', 'Batida suave em "faço"'),
 (8, 9, '"Três movimentos" com três marcadores numerados acendendo. "Se liga"', 'Sobe e assenta', S),
 (10, 12, 'Cartão 01: "Instale o aplicativo do Claude, abra a aba Code". Entra o selo "plano pago" e uma seta para a descrição', 'Aproxima no cartão e desliza para o selo', 'Um estalo na entrada do cartão'),
 (13, 15, 'Área de trabalho: a pasta "meus-videos" nasce, o cursor arrasta três arquivos para dentro e a pasta acende. Em "Bruto é a gravação crua" entra a legenda explicando', 'Acompanha o cursor até a pasta', 'Um som de gaveta quando os arquivos entram'),
 (16, 18, 'Janela do Claude Code com o pedido sendo digitado: "prepare esta pasta para edição de vídeo"', 'Aproxima na linha digitada', 'Três teclas no começo'),
 (19, 21, '"Daqui eu assumo". Linhas acendem nas palavras: instalando Whisper, auto-editor, FFmpeg, Remotion, e por fim dividindo a pasta', 'Desce pelas linhas', 'Um som de sucesso só no fim da lista'),
 (22, 23, 'A pasta por dentro: três pastas nascem nas palavras bruto, trabalho e pronto. Em "nenhuma ferramenta à mão" um aviso "tudo instalado por mim"', 'Deriva da esquerda para a direita pelas três pastas', 'Um estalo baixo em cada pasta (3)'),
 (24, 25, 'Objeção em texto grande: "Mas Claude, e se você estragar o meu vídeo?". Resposta embaixo: "não estraga"', 'Soco de zoom na pergunta', S),
 (26, 28, 'O cadeado fecha na pasta bruto. Dois arquivos novos de corte aparecem na pasta trabalho. Uma seta de "pedir de novo" gira', 'Aproxima no cadeado, depois vai para os arquivos novos', 'Um som de trava no cadeado'),
 (29, 31, 'As quatro ferramentas em cartões, cada uma ganhando o selo "grátis". Um quinto cartão com interrogação: "o que custa dinheiro: no fim"', 'Percorre os cartões e para na interrogação', 'Um estalo para a cascata dos selos'),
 (32, 34, '"Eu ainda não sei o que tem dentro do seu vídeo", palavra por palavra. Embaixo: "é isso que o passo 2 resolve"', 'Aproximação lenta', 'Subida de ar bem baixa no fim, levando para a escada'),
],
3: [
 (0, 2, '"Eu não assisto. Eu leio." A palavra "leio" acende', 'Soco de zoom em "leio"', 'Batida suave em "leio"'),
 (3, 5, 'Whisper: uma onda de áudio comprida. Uma agulha varre a onda, a parte lida fica laranja, as palavras caem embaixo uma a uma, e cada uma ganha o seu tempo', 'Segue a agulha da esquerda para a direita', 'Um deslize baixo quando a varredura começa. As palavras caem mudas'),
 (6, 9, 'Janela do Claude Code: o pedido "transcreva este vídeo palavra por palavra" é digitado. Linha "1 hora de vídeo virou texto" e depois "lido em segundos"', 'Aproxima na digitação e desce para o resultado', 'Três teclas. Um sucesso baixo no resultado'),
 (10, 11, 'Analogia: uma tira de filme comprida de um lado e, do outro, uma página de legenda com uma linha marcada. Uma seta leva da linha marcada direto ao quadro certo do filme', 'Vai da legenda até o quadro do filme', S),
 (12, 16, 'O vídeo inteiro em texto. Cada tipo de trecho é marcado na sua fala: erro riscado em vermelho, silêncio de 5 s, trecho bom sublinhado, frase forte em laranja', 'Desce pelo texto parando em cada marcação', 'Um som curto por marcação (4), baixos e diferentes entre si'),
 (17, 17, 'Uma tira de quadros do vídeo. Três riscos de luz batem em pontos diferentes e três fotos saltam para fora', 'Corre pela tira e recua para mostrar as fotos', 'Um obturador de câmera na primeira foto só'),
 (18, 19, 'O mapa: o mesmo texto já todo marcado. A legenda entra nas palavras: o que sai, o que fica, os melhores momentos', 'Recua para mostrar o mapa inteiro', S),
 (20, 20, 'Um arquivo vira cinquenta: os arquivos se multiplicam numa grade. "O pedido é o mesmo"', 'Recua enquanto a grade cresce', 'Um tique baixo no começo da multiplicação'),
 (21, 21, '"Cortar vira a parte fácil"', 'Aproximação lenta', S),
],
4: [
 (0, 0, 'Dois cartões grandes: auto-editor (tira o silêncio) e FFmpeg (corta e junta)', 'Chega e assenta', 'Um estalo de madeira para os dois'),
 (1, 4, 'auto-editor: uma faixa de áudio com blocos de fala e de silêncio. O medidor de volume varre, e cada silêncio fica vermelho com o nome dele na palavra: a pausa, a respiração, o tempo morto. Em "some tudo" os silêncios somem e a fala se junta', 'Segue o medidor, depois recua quando a faixa encolhe', 'Um deslize baixo em "some tudo". O resto mudo'),
 (5, 8, 'FFmpeg: um terminal. Cada comando aparece na palavra: corta o vídeo, junta trechos, muda o formato. Em "quem escreve sou eu" a marca do Claude aparece ao lado do cursor', 'Desce comando por comando', 'Uma tecla no começo de cada comando (3)'),
 (9, 10, 'Janela do Claude Code: o pedido "Tire os silêncios e os erros deste vídeo, mas me mostre a lista de cortes antes de cortar" é digitado e fica parado para o print', 'Aproxima na digitação e recua para o pedido inteiro', 'Três teclas no começo'),
 (11, 13, 'A lista de cortes: cada linha entra na fala, com o tempo e o motivo. O cursor chega, clica em APROVAR, e todas as linhas ganham o visto', 'Desce pela lista e fecha no botão', 'Clique e sucesso no APROVAR'),
 (14, 14, 'Palavras em caixas, cada uma com o seu tempo. Elas se afastam e um risco de luz corta no vão. Depois um risco vermelho tenta cortar no meio de uma palavra e some: "não no meio"', 'Aproxima no vão entre as palavras', 'Um som de corte no risco de luz'),
 (15, 17, 'Contador gigante: 20:00 desce para 12:00 e acende em laranja. A barra embaixo encolhe junto. "Sem arrastar nada"', 'Soco de zoom quando o número vira', 'Batida suave quando vira 12:00'),
 (18, 19, 'A linha do tempo já cortada. Dela descem cinco etiquetas: Premiere, DaVinci Resolve, Final Cut, Shotcut, Kdenlive', 'Desce da linha do tempo para as etiquetas', 'Um estalo para a cascata das etiquetas'),
 (20, 22, 'Confissão: a miniatura real da primeira versão da abertura, com um risco vermelho. Ao lado, quatro cartões com interrogação e a etiqueta "passo 5"', 'Aproxima na miniatura, depois desliza para as interrogações', 'Um obturador baixo na miniatura'),
 (23, 23, 'Botão "INSCREVA-SE"', 'Chega com quique', S),
 (24, 26, '"Limpo não é o mesmo que bom de assistir". Embaixo: "falta o que você está vendo agora"', 'Aproximação lenta', 'Subida de ar bem baixa no fim, levando para a escada'),
],
5: [
 (0, 1, '"Tudo que se mexe é código". Em cada palavra seguinte, um elemento deste vídeo passa pela tela: o mascote, uma linha do tempo, um quadro inclinando', 'Deriva acompanhando os elementos', S),
 (2, 3, 'Analogia: um cartão de receita com três linhas ("1. entra o título", "2. cresce", "3. a câmera chega") e, ao lado, o mesmo texto em formato de código. As linhas acendem em par', 'Vai da receita para o código', S),
 (4, 5, '"Remotion" grande, e embaixo "transforma código em vídeo"', 'Soco de zoom no nome', 'Um som de revelação baixo'),
 (6, 7, 'Um mouse arrastando um título some. Entra a janela com três linhas escritas nas palavras: o título entra no segundo 3, o título cresce, a câmera se aproxima. Ao lado, um mini quadro faz o que cada linha diz', 'Desce linha por linha', 'Uma tecla por linha (3)'),
 (8, 8, 'Nove quadros numerados se preenchem um a um e viram uma barra completa: "código vira vídeo"', 'Corre pelos quadros', S),
 (9, 10, 'Janela do Claude Code: o pedido da legenda é digitado e fica parado para o print. Em "olha a prova" a janela desliza para o lado', 'Aproxima na digitação e recua', 'Três teclas no começo'),
 (11, 13, 'Código de um lado, o vídeo do outro. Em "mudo um número" o valor muda no código, a linha acende, e a marca do Claude desliza para o lugar novo', 'Vai do código para o vídeo junto com a mudança', 'Uma tecla no número. Um deslize baixo na marca'),
 (14, 17, 'Três cartões, um por fala: legendas palavra por palavra (com uma legenda de verdade passando dentro), textos e gráficos (um gráfico crescendo), mudanças em uma frase', 'Passa de cartão em cartão', 'Um estalo de madeira por cartão (3)'),
 (18, 20, 'Dois balões de pedido: "não gostei da cor", "quero a legenda maior". Em "refaço" a miniatura ao lado troca de cor e a legenda cresce', 'Vai dos balões para a miniatura', 'Um sucesso baixo quando a miniatura muda'),
 (21, 23, 'Objeção: "Mas Claude, eu não sei programar". Resposta: "não precisa: você descreve o que quer ver"', 'Soco de zoom na pergunta', S),
 (24, 24, 'Um pedido vago ao lado de um pedido claro. O claro acende e o resultado dele fica nítido, o do vago fica borrado', 'Desliza do vago para o claro', S),
 (25, 26, '"Da pasta para o mundo": a pasta se abre e o vídeo sai dela', 'Sobe junto com o vídeo', 'Subida de ar bem baixa, levando para a escada'),
],
6: [
 (0, 1, 'Janela do Claude Code: "exporte o vídeo final" é digitado', 'Aproxima na digitação', 'Três teclas'),
 (2, 2, 'Três camadas enchem nas palavras: cortes, animações, música. A barra de exportação vai a 100% e o arquivo final aparece', 'Segue a barra enchendo', 'Um sucesso baixo nos 100%'),
 (3, 5, 'Três cartões de conferência acendem na fala: tamanho da imagem, duração, volume. Depois uma tira de quadros é varrida, um quadro preto fica vermelho, e as três coisas procuradas entram como etiquetas', 'Passa pelos cartões, depois corre pela tira', 'Um tique por cartão (3). Um som de desligar no quadro preto'),
 (6, 8, '"Você assiste", com a etiqueta "a parte mais importante". Embaixo: "e me fala o que sentiu"', 'Soco de zoom em "assiste"', 'Batida suave em "assiste"'),
 (9, 9, 'Três balões entram nas falas: "o começo está lento", "esta parte ficou confusa", "a música está alta aqui". Em "corrijo" cada um ganha "corrigido"', 'Desce pelos balões', 'Um estalo baixo por balão (3)'),
 (10, 13, 'As miniaturas reais das aberturas deste vídeo. Entram em "a cada versão". Em "deitada" a primeira ganha o rótulo, em "colorida" a outra ganha o dela. A atual acende no fim', 'Aproxima em cada miniatura quando ela é citada', 'Um obturador baixo na primeira'),
 (14, 16, 'Objeção: "Mas Claude, por que você não acerta de primeira?". Resposta: "eu não adivinho. Eu aprendo."', 'Soco de zoom na pergunta', S),
 (17, 17, '"Quem decide é você"', 'Aproximação lenta', S),
 (18, 19, 'Três cartões: ideias de título, descrição, capítulos com o tempo certo', 'Passa pelos três', 'Um estalo de madeira para a cascata'),
 (20, 21, '**3D:** a escada inteira acesa, com o mascote no topo', 'Recua mostrando a escada toda', 'Whoosh longo, baixo'),
],
7: [
 (0, 2, '"Cortes", com a etiqueta "primeiro jeito". Embaixo entram na fala: podcast, aula, live', 'Chega e assenta', 'Batida suave em "cortes"'),
 (3, 4, 'Janela do Claude Code: o pedido dos dez cortes é digitado e fica parado para o print', 'Aproxima na digitação e recua para o pedido inteiro', 'Três teclas no começo'),
 (4, 6, 'A partir de "eu leio": a onda do vídeo longo em cima, dez trechos acendem em laranja, e dez celulares descem em cascata, cada um com legenda passando dentro', 'Desce da onda para os celulares e corre pela fileira', 'Um som de corte no primeiro trecho. Um deslize para a cascata'),
 (7, 9, '"Peça para eu explicar cada trecho", com a etiqueta "a dica". Ao lado de três celulares entram bilhetes com o motivo', 'Aproxima num bilhete', S),
 (10, 11, '"E se você só tem a gravação crua?" Os celulares saem e entram arquivos de gravação bagunçados', 'Desliza para os arquivos', S),
],
8: [
 (0, 2, '"Vídeo inteiro", com a etiqueta "segundo jeito". Embaixo: uma hora gravada, vários arquivos, errando e repetindo', 'Chega e assenta', 'Batida suave em "inteiro"'),
 (3, 4, 'Janela do Claude Code: o pedido de juntar as gravações é digitado. Depois a linha "transformando tudo em texto"', 'Aproxima na digitação e recua', 'Três teclas no começo'),
 (5, 5, 'A mesma frase três vezes. Os dois primeiros takes são riscados e o terceiro acende', 'Desce pelos takes e fecha no escolhido', 'Um som de corte nos riscos. Um brilho baixo no escolhido'),
 (6, 6, 'Os trechos escolhidos se encaixam em ordem numa linha do tempo, e ao lado entra a lista de cortes', 'Vai da linha do tempo para a lista', 'Um estalo de madeira para a lista'),
 (7, 9, '"A parte mais chata deixa de ser sua". Um fone de ouvido com uma barra de "ouvindo tudo de novo" enchendo devagar, que some', 'Aproximação lenta', S),
 (10, 10, '"Quanto custa isso tudo?"', 'Soco de zoom', S),
],
9: [
 (0, 1, '"A gente faz a conta", com a etiqueta "eu prometi falar o valor"', 'Chega e assenta', S),
 (2, 6, 'A conta se monta linha por linha: quatro ferramentas, cada uma com US$ 0. Entra a linha do Claude Pro com US$ 20 por mês, depois "ou US$ 17 no anual", e a nota do dólar', 'Desce pela conta e fecha no valor', 'Um tique no primeiro zero. Batida suave nos 20 dólares'),
 (7, 7, 'Cartão para print: as quatro ferramentas, cada uma com a função em duas palavras. A tela fica parada', 'Para de propósito, só com a deriva do fundo', 'Um obturador de câmera'),
 (8, 12, 'Três cartões, um por fala: a primeira versão quase nunca é a boa (com a miniatura real da primeira abertura), pedido vago, limite de uso', 'Passa de cartão em cartão', 'Um som de desligar por cartão (3), baixos'),
 (13, 15, '"A parte que importa: a ideia". Embaixo: "eu volto nisso no final"', 'Aproximação lenta', S),
],
10: [
 (0, 4, 'A linha do tempo deste vídeo, com as dez cenas. Os cinco passos acendem nas palavras. Em "nenhum programa" entra "0 programas"', 'Corre pela linha do tempo e recua', 'Um deslize baixo na entrada. Batida suave no zero'),
 (5, 5, '"Eu não substituo o seu olhar"', 'Aproximação lenta', S),
 (6, 8, 'Uma balança: de um lado a parte repetitiva, que vai para o Claude, do outro "a ideia", que fica com você. Fecha com "eu corto, você decide"', 'Vai de um lado ao outro e fecha na ideia', 'Um som de revelação baixo em "a ideia"'),
 (9, 10, '"Canal dark": uma silhueta sem rosto num cartão escuro. Embaixo: "assunto para outro vídeo"', 'Aproxima e recua', S),
 (11, 12, 'Três cartões acendem nas palavras: pega um vídeo, cria a pasta, escreve o primeiro pedido', 'Passa pelos três', 'Um estalo de madeira para a cascata'),
 (13, 15, 'Dois cartões grandes com os números 1 (cortes) e 2 (vídeo inteiro), cada um entrando na sua fala', 'Chega de longe e assenta', 'Batida suave em cada número'),
 (16, 16, 'Botão "INSCREVA-SE"', 'Chega com quique', S),
 (17, 19, 'A marca do Claude, "valeu, galera" e "até a próxima"', 'Recua devagar até o fim', S),
],
}
def mmss(s): return f'{int(s // 60)}:{int(s % 60):02d}'
linhas = []
acum = 0.0
sons = 0
for n in range(1, 11):
    fr = T[str(n)]['frases']
    ab = 2.6 if n in ABERTURA else 0
    dur = T[str(n)]['duracao'] + 0.5 + ab
    linhas.append(f'\n## Cena {n}. {NOMES[n]}\n\nComeça em {mmss(acum)} e dura {mmss(dur)}.\n')
    linhas.append('| Tempo | Fala | Animação | Câmera | Som |\n|---|---|---|---|---|')
    if n in ABERTURA:
        linhas.append(f'| {mmss(acum)} | (sem fala, 2,6 s) | **3D:** o mascote pula para o degrau {n - 1}, o degrau acende, e a câmera mergulha no número. Entra "{ABERTURA[n]}" | Mergulho | Um passo de madeira no pouso. Whoosh grave no mergulho |')
        sons += 2
    for a, b, anim, cam, som in P[n]:
        t = acum + ab + fr[a][0] / 30
        fala = FRASES[n][a].strip('"')
        fala = (fala[:46] + '...') if len(fala) > 49 else fala
        linhas.append(f'| {mmss(t)} | {fala} | {anim} | {cam} | {som} |')
        if som != S:
            import re
            sons += sum(int(x) for x in re.findall(r'\((\d)\)', som)) or som.count('.') + 1 if '(' in som else som.rstrip('.').count('. ') + 1
    acum += dur
print('total', mmss(acum), 'planos', sum(len(v) for v in P.values()), 'sons aprox', sons)
open('/tmp/_mapa_corpo.md', 'w').write('\n'.join(linhas) + '\n')
print(round(sons / (acum / 10), 2), 'sons por 10 s')
