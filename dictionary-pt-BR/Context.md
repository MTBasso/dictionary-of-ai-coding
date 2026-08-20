---
description: A informação relevante a que o agente tem acesso agora — o que o agente sabe que é pertinente à tarefa.
---

A informação relevante a que o [agente](./Agent.md) tem acesso agora. O substantivo abstrato — não a entrada bruta que o modelo vê (isso é a [janela de contexto](./Context%20window.md)), não o histórico corrente (isso é a [sessão](./Session.md)), mas _o que o agente sabe que é pertinente à tarefa_. "Carregar algo no contexto" significa tornar aquilo parte desse conjunto; "engenharia de contexto" é a disciplina de curá-lo.

Os três termos se separam com clareza:

| Termo              | O que nomeia                                                               |
| ------------------ | -------------------------------------------------------------------------- |
| Contexto           | A informação relevante à tarefa que o agente tem no momento                |
| Janela de contexto | A sequência literal de [tokens](./Token.md) que o modelo vê por requisição |
| Sessão             | A conversa corrente que o [harness](./Harness.md) guarda                   |

A separação importa porque contexto é uma medida de qualidade, não de quantidade. Uma janela de contexto pode estar quase cheia e o contexto ainda ser ruim — milhares de tokens de saída de ferramenta obsoleta, nada disso sobre a tarefa em questão. Ela também pode estar quase vazia e o contexto ser excelente: a única definição de tipo de que a tarefa depende.

A maioria das falhas do dia a dia remete ao contexto. Quando o agente inventa uma API, contradiz uma decisão ou chuta um schema, a primeira pergunta é o que estava no contexto quando ele fez isso — em geral o fato relevante nunca foi carregado, ou ficou soterrado por [degradação de atenção](./Attention%20degradation.md). A solução é curadoria: carregue o que a tarefa precisa, mantenha fora o que ela não precisa.

_Uso:_

"Ele fica inventando campos que não existem no tipo."

"O arquivo do tipo não está no contexto — ele está lendo os pontos de chamada e chutando. Manda ler a definição primeiro."
