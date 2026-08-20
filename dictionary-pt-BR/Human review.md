---
description: Você lendo o código que o agente produziu e formando um julgamento. Ler o diff conta; ler o resumo não.
aliases:
  - Revisão humana
---

Você lendo o código que o [agente](./Agent.md) produziu e formando um julgamento sobre ele. Ler o diff ou os arquivos alterados conta; ler a _descrição_ do agente sobre o que ele fez não — narração não é o artefato. A descrição é uma [fonte secundária](./Secondary%20source.md), escrita pela parte que está sendo revisada; o diff é a [fonte primária](./Primary%20source.md), e revisar significa lê-lo.

Agentes aumentam o volume de código produzido, então a revisão vira o gargalo. Uma ideia útil é dispor as estratégias de revisão em camadas. [Verificações automatizadas](./Automated%20check.md) pegam as falhas mecânicas, a [revisão automatizada](./Automated%20review.md) pega as descritíveis, e a revisão humana fica reservada ao que só você pode julgar — se a mudança é a mudança certa, se a abordagem cabe na base de código, se isso deveria existir.

Revisão também é mais barata mais cedo. Ler um plano antes de o trabalho começar, ou um diff pequeno no meio do caminho, leva minutos; escavar um branch pronto depois de uma execução [AFK](./AFK.md) leva bem mais. Onde você coloca o ponto de revisão é uma decisão sobre [humano no laço](./Human-in-the-loop.md), não um detalhe posterior.

_Evite:_ "revisão de código" sozinho — ambíguo entre humana e automatizada.

_Uso:_

"Fiz a revisão humana da saída do AFK."

"Você leu o diff ou só o resumo?"

"O diff. O resumo dizia que ele apagou código morto — só que a função era chamada de um arquivo gerado."
