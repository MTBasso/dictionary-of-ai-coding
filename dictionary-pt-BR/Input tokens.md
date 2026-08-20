---
description: Tokens que o harness envia em cada requisição ao provedor de modelo. Cobrados a uma taxa menor que a dos tokens de saída.
---

[Tokens](./Token.md) que o [harness](./Harness.md) envia em cada [requisição ao provedor de modelo](./Model%20provider%20request.md) — o [prompt de sistema](./System%20prompt.md), o histórico da conversa, os [resultados de ferramenta](./Tool%20result.md), tudo o que o [modelo](./Model.md) lê antes de escrever. São cobrados a uma taxa menor que a dos [tokens de saída](./Output%20tokens.md), porque custam menos para processar.

Ao programar com [IA](./AI.md), os tokens de entrada compõem a maior parte da sua conta. O modelo é [sem estado](./Stateless.md), então cada [turno](./Turn.md) reenvia a [sessão](./Session.md) inteira como entrada: sua primeira mensagem, cada resposta, cada resultado de ferramenta desde então. A entrada do turno cinquenta contém os quarenta e nove turnos anteriores. Uma única requisição ao provedor de modelo pode produzir algumas centenas de tokens de saída e reenviar cem mil tokens de entrada de histórico acumulado.

O [cache de prefixo](./Prefix%20cache.md) reduz o custo: histórico que bate exatamente com uma requisição anterior é cobrado como [tokens de cache](./Cache%20tokens.md), baratos, em vez de entrada a preço cheio. Quando o custo de entrada ainda dói, a saída é encolher o que é reenviado — [limpar](./Clearing.md) ou [compactar](./Compaction.md) entre tarefas.

_Uso:_

"A conta está alta, mas o [agente](./Agent.md) mal está escrevendo alguma coisa."

"São os tokens de entrada — todo turno reenvia a sessão inteira. Sem o cache de prefixo, você paga de novo pelo histórico a cada requisição."
