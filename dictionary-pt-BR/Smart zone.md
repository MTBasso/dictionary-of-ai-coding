---
description: "No começo da sessão o agente é afiado. Conforme ela cresce, ele deriva para uma zona burra: mais desleixo, esquecimento e erros."
aliases:
  - Zona burra
  - Zona esperta
---

No começo de uma [sessão](./Session.md) o [agente](./Agent.md) está numa "zona esperta" — afiado, focado, com boa recuperação de informação. Conforme a sessão cresce, ele deriva para uma "zona burra": mais desleixado, esquecido, com mais erros — e mais [alucinações](./Hallucination.md) de fidelidade. Mesmo [modelo](./Model.md), mesmo [harness](./Harness.md) — só mais [contexto](./Context.md). É o efeito sentido da [degradação de atenção](./Attention%20degradation.md). Em modelos de fronteira, a zona burra costuma começar por volta de 125 mil a 150 mil [tokens](./Token.md) — embora isso seja debatido. [Limpe](./Clearing.md) ou [compacte](./Compaction.md) quando a sessão inchar; não force.

A queda é gradual, o que a torna fácil de não perceber. Não há mensagem de erro nem fronteira visível; o agente simplesmente começa a render um pouco pior, depois nitidamente pior. Sinais comuns: ele esquece uma instrução que você deu vinte turnos atrás, repete um erro que já tinha corrigido, ou afirma com confiança algo que o contexto contradiz. Como a descida é suave, a reação usual é forçar e reexplicar — o que acrescenta mais contexto e piora o problema.

As zonas não acompanham o limite da [janela de contexto](./Context%20window.md). Uma sessão pode estar bem dentro da zona burra com a maior parte da janela ainda livre: o limite é onde o harness se recusa a continuar, mas a qualidade cai muito antes disso. Planeje em torno da zona esperta, não da janela — o orçamento prático de uma tarefa são os tokens dentro dos quais o agente trabalha bem, não os tokens que ele tecnicamente comporta.

A zona esperta é um orçamento, e trabalho sem relação a gasta. Toda tarefa feita numa sessão consome tokens, então começar uma segunda tarefa na mesma sessão significa começá-la mais perto da zona burra. Uma tarefa por sessão dá a cada tarefa a parte mais afiada da sessão. Quando uma única tarefa é maior que uma zona esperta, divida: faça um [handoff](./Handoff.md) ou compacte num limite natural, e deixe uma sessão nova pegar o próximo pedaço.

_Uso:_

"Ele mandou bem nos três primeiros componentes e destruiu o quarto."

"Você saiu da zona esperta — mesmo modelo, só que agora bem dentro da zona burra. Compacta e recarrega o plano; o próximo componente vai sair."
