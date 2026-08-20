---
description: O que o harness mostra ao usuário antes de executar uma chamada não pré-aprovada. O mecanismo que põe um humano no laço.
---

O que o [harness](./Harness.md) mostra ao usuário antes de executar uma [chamada de ferramenta](./Tool%20call.md) que não foi pré-aprovada. O [modelo](./Model.md) produz uma chamada; em vez de rodá-la de imediato, o harness pausa e pergunta. Se você aprova, ela roda; se nega, o harness informa a negação de volta ao modelo como [resultado de ferramenta](./Tool%20result.md). É o mecanismo pelo qual um harness põe um [humano no laço](./Human-in-the-loop.md) em ações arriscadas ou sensíveis.

O ciclo de vida de um pedido de permissão:

| Passo | Quem    | O que acontece                                                                   |
| ----- | ------- | -------------------------------------------------------------------------------- |
| 1     | Modelo  | Produz uma chamada de ferramenta                                                 |
| 2     | Harness | Confere contra o [modo de permissão](./Permission%20mode.md) e aprovações salvas |
| 3     | Harness | Se pré-aprovada, executa na hora. Caso contrário, pausa e mostra o pedido        |
| 4     | Usuário | Aprova uma vez, aprova pelo resto da [sessão](./Session.md), ou nega             |
| 5     | Harness | Executa a chamada, ou devolve a negação como resultado de ferramenta             |

Negar um pedido direciona o agente. O modelo lê a negação como qualquer outro resultado de ferramenta e reage a ela — tenta outra abordagem, ou pergunta o que você prefere. A maioria dos harnesses deixa você anexar uma mensagem à negação, o que transforma o pedido num ponto de direcionamento: "assim não, usa o script de migração" chega exatamente quando o modelo está decidindo o que fazer em seguida.

O custo é que todo pedido é uma espera síncrona por você. O [agente](./Agent.md) fica bloqueado até você responder, o que é aceitável enquanto você está olhando e é um problema quando não está — um agente que dispara pedidos o tempo todo não pode ser deixado trabalhando [AFK](./AFK.md). O modo de permissão é o controle: quais chamadas rodam livres, quais perguntam antes, idealmente com um [sandbox](./Sandbox.md) tornando seguro alargar o conjunto livre.

_Uso:_

"Ficou dez minutos travado num pedido de permissão — eu estava em reunião."

"Esse é o custo do humano no laço. Pré-aprova as [ferramentas](./Tool.md) seguras para o pedido só disparar nas chamadas de fato arriscadas."
