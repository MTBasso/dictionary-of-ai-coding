---
description: Uma função que o harness expõe para o agente chamar — Read, Write, Bash, Search. Como o agente percebe e age sobre o ambiente.
---

Uma função que o [harness](./Harness.md) expõe para o [agente](./Agent.md) chamar — Read, Write, Bash, Search. Ferramentas são como um agente percebe e age sobre o [ambiente](./Environment.md): ele não consegue ver o ambiente exceto por [resultados de ferramenta](./Tool%20result.md), nem alterá-lo exceto por [chamadas de ferramenta](./Tool%20call.md). Cada chamada custa uma [requisição ao provedor de modelo](./Model%20provider%20request.md) a mais, já que o resultado precisa voltar ao modelo antes de ele decidir o que fazer em seguida.

Ferramentas que a maioria dos agentes de programação traz:

| Ferramenta | O que faz                                                            |
| ---------- | -------------------------------------------------------------------- |
| Read       | Devolve o conteúdo de um arquivo como resultado de ferramenta        |
| Write      | Cria ou edita um arquivo no [sistema de arquivos](./Filesystem.md)   |
| Bash       | Roda um comando de shell e devolve a saída                           |
| Search     | Encontra arquivos ou texto que casem com um padrão na base de código |

Uma ferramenta é definida por três coisas: um nome, uma descrição do que faz e um schema para seus parâmetros. O harness envia essas definições ao [modelo](./Model.md) em toda requisição, e o modelo escolhe uma ferramenta do mesmo jeito que produz todo o resto — escrevendo [tokens](./Token.md), neste caso uma chamada estruturada com argumentos. O modelo nunca executa nada; o harness lê a chamada, roda a função e devolve o resultado.

A lista de ferramentas define o que o agente consegue fazer. Um modelo capaz com um conjunto estreito de ferramentas é um agente estreito: ele vai rotear tudo pelo que tem, e é por isso que agentes se apoiam tanto no Bash — um shell é uma ferramenta só que alcança a maior parte do sistema. Para dar uma capacidade a um agente de forma limpa, acrescente uma ferramenta para isso; o [MCP](./MCP.md) é o padrão para plugar ferramentas de fora do harness.

Definições de ferramenta ocupam [contexto](./Context.md) em toda requisição, então um conjunto grande tem um custo permanente antes de qualquer chamada — e muitas ferramentas com descrições parecidas deixam o modelo pior em escolher a certa.

_Uso:_

"O agente consegue consultar o staging direto?"

"Acrescenta uma ferramenta `psql` ao harness, com escopo somente leitura no staging. Sem uma ferramenta para isso, o agente é cego a qualquer coisa fora do sistema de arquivos."
