---
description: Pedir ao agente uma versão rápida e tosca quando a conversa é de baixa fidelidade e você precisa de um artefato real para discutir.
aliases:
  - Prototipagem
---

Pedir ao [agente](./Agent.md) que construa uma versão rápida e tosca de algo, para quando a conversa é de fidelidade baixa demais e você precisa de um artefato real para discutir.

O [grilling](./Grilling.md) resolve decisões de projeto na conversa. Conversa é barata, mas é de baixa fidelidade: algumas perguntas não podem ser respondidas em palavras — como uma interação se sente, se o formato de uma API é ergonômico no código que a chama de verdade, se o layout funciona com volumes reais de dados. A entrevista chega numa pergunta e sua resposta honesta é "não sei, eu precisaria ver". Passado esse ponto, a discussão dá voltas. Em vez disso, peça ao agente que construa a coisa, olhe, e volte à conversa com uma resposta.

Agentes baixam o custo de construir, e é isso que torna a prática viável. Uma versão tosca que antes levava um dia para ser montada agora leva minutos, então vale fazer com frequência. É uma técnica com [humano no laço](./Human-in-the-loop.md): o protótipo está ali para você reagir a ele.

Em geral você não para no primeiro olhar. Itere com o protótipo — reaja, peça uma mudança, reaja de novo — para que cada rodada resolva mais uma decisão contra o artefato real, numa fidelidade maior que a da conversa.

Um protótipo não precisa ser todo improvisado. Você pode construir com qualidade de produção justamente as peças que está avaliando, para que, quando a decisão for tomada, o componente ou a API a que você reagiu possa ir para a base de código real. Isso torna a prototipagem um material essencial para a [especificação](./Spec.md) referenciar.

_Uso:_

"A gente passou meia hora discutindo se o assistente deve ser uma página só ou três passos."

"Palavra não resolve isso — pede para o agente prototipar os dois. A gente clica nos dois e sabe em cinco minutos."
