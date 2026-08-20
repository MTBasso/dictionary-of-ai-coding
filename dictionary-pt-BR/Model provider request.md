---
description: Uma ida e volta do harness até o provedor de modelo. O harness envia contexto; o provedor devolve uma resposta.
---

Uma ida e volta do [harness](./Harness.md) até o [provedor de modelo](./Model%20provider.md). O harness envia o [contexto](./Context.md) atual; o provedor devolve uma resposta (uma [chamada de ferramenta](./Tool%20call.md) ou uma resposta final). Uma única mensagem sua pode gerar muitas requisições ao provedor de modelo se o [agente](./Agent.md) chamar [ferramentas](./Tool.md) — cada [resultado de ferramenta](./Tool%20result.md) dispara outra requisição.

Cada requisição carrega tudo: o [prompt de sistema](./System%20prompt.md), a conversa inteira até ali, todos os resultados de ferramenta. O [modelo](./Model.md) é [sem estado](./Stateless.md), então o provedor não guarda nada entre requisições — a requisição quarenta reenvia o que a trinta e nove enviou, mais um resultado de ferramenta. O [cache de prefixo](./Prefix%20cache.md) existe para tornar essa repetição viável.

A requisição também é a unidade de cobrança. [Tokens de entrada](./Input%20tokens.md), [tokens de saída](./Output%20tokens.md) e descontos de cache são todos contados por requisição, e é por isso que uma pergunta de aparência inofensiva pode custar um valor surpreendente: o custo não é proporcional à sua mensagem, é proporcional ao número de requisições vezes o tamanho do contexto que cada uma carrega.

Vale manter a requisição distinta do [turno](./Turn.md). Um turno é uma troca com você, e um único turno — "conserta o teste que está falhando" — se desenrola como uma cadeia de requisições:

| Requisição | O modelo devolve                        | Então o harness                     |
| ---------- | --------------------------------------- | ----------------------------------- |
| 1          | Chamada de ferramenta: rodar os testes  | Roda e anexa a saída da falha       |
| 2          | Chamada: ler o arquivo de teste         | Anexa o conteúdo do arquivo         |
| 3          | Chamada: ler o arquivo-fonte            | Anexa o conteúdo do arquivo         |
| 4          | Chamada: editar o arquivo-fonte         | Aplica a edição e anexa o resultado |
| 5          | Chamada: rodar os testes de novo        | Roda e anexa a saída de sucesso     |
| 6          | Resposta final: "consertado, testes ok" | Mostra para você                    |

Seis requisições para um turno — cada uma reenviando o contexto inteiro. Quando você se perguntar para onde foram os [tokens](./Token.md), conte as requisições, não os turnos.

_Uso:_

"Uma pergunta queimou quarenta mil tokens?"

"Olha as chamadas de ferramenta — doze grep, oito leituras, quatro edições. Cada resultado de ferramenta gera outra requisição ao provedor de modelo, e o prefixo inteiro da [sessão](./Session.md) é reenviado toda vez."
