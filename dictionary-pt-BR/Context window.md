---
description: Tudo o que o modelo vê em cada requisição. Finita, específica de cada modelo, é a única superfície pela qual o modelo percebe.
---

Tudo o que o [modelo](./Model.md) vê em cada [requisição ao provedor de modelo](./Model%20provider%20request.md). Finita, específica de cada modelo, e a _única_ superfície pela qual o modelo percebe qualquer coisa.

É uma única sequência de [tokens](./Token.md): o [prompt de sistema](./System%20prompt.md), a conversa até ali, cada [resultado de ferramenta](./Tool%20result.md) que o [harness](./Harness.md) devolveu. Se algo está nessa sequência, o modelo pode usar; se não está, o modelo não sabe que existe — nem sua base de código, nem o arquivo que você editou ontem, nem a instrução que você deu três sessões atrás. Qualquer coisa fora da janela precisa ser trazida para dentro, em geral via uma [chamada de ferramenta](./Tool%20call.md), antes de poder influenciar qualquer coisa.

Finita significa que ela enche. Todo turno acrescenta mais — suas mensagens, as respostas do modelo, os resultados de ferramenta — e uma [sessão](./Session.md) longa vai bater no limite, forçando [compactação](./Compaction.md) ou [limpeza](./Clearing.md). Também significa que tudo dentro da janela compete: cada token que você carrega é um a menos disponível para o resto, e conteúdo de que você não precisava continua ocupando a [atenção](./Attention%20budget.md) do modelo. A postura prática é tratar a janela como um orçamento — carregue o que a tarefa precisa e deixe o resto de fora.

_Evite:_ "memória" — a janela de contexto é estado de trabalho e não persiste entre sessões. [Memória](./Memory%20system.md) é um conceito separado, colocado por cima.

_Uso:_

"Posso simplesmente colar o monorepo inteiro no prompt?"

"A janela de contexto tem 200 mil tokens — isso é talvez um quinto do repositório. Escolhe os arquivos que a tarefa toca e deixa o resto atrás de uma chamada de ferramenta."
