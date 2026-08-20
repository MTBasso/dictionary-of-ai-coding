---
description: Uma verificação determinística que roda no ambiente — testes, checagem de tipos, lint, build. Passa ou falha, sem julgamento.
aliases:
  - Verificação automatizada
---

Uma verificação determinística que roda no [ambiente](./Environment.md) — testes, checagem de tipos, lint, build, hooks de pré-commit. Passa ou falha, sem julgamento. É o sinal a partir do qual um [agente](./Agent.md) consegue se autocorrigir sem envolver mais ninguém. Um teste instável é uma verificação quebrada, não uma não-verificação; verificações automatizadas são determinísticas _por design_.

A autocorreção funciona como um laço. O agente faz uma mudança, roda a verificação como [chamada de ferramenta](./Tool%20call.md), e a saída da falha chega à [janela de contexto](./Context%20window.md) dele — um erro de tipo com arquivo e linha, uma asserção falhando com valor esperado e obtido. Isso basta para o agente corrigir o problema e rodar de novo, e assim por diante até passar, sem humano no laço. O determinismo é o que torna o laço confiável: o mesmo código sempre produz o mesmo veredito, então passar significa alguma coisa. Uma verificação instável envenena isso — o agente "conserta" código que estava certo, ou insiste até passar por cima de uma falha real.

É por isso que boas verificações são uma parte grande da [AX](./AX.md) de uma base de código. Um agente num repositório com tipos estritos, uma suíte de testes rápida e um linter pega a maioria dos próprios erros antes de você ver; um agente num repositório sem nada disso entrega o que quer que tenha produzido. A diferença pesa mais em execuções [AFK](./AFK.md), onde as verificações são a única checagem acontecendo durante a execução. Mas uma verificação só pega o que ela afirma — verificações verdes significam que as propriedades afirmadas valem, não que o código está certo. As lacunas que exigem julgamento são para o que servem a [revisão automatizada](./Automated%20review.md) e a [revisão humana](./Human%20review.md).

_Evite:_ "ciclo de feedback" — mistura verificações com revisão. _Evite:_ "teste" — testes são verificações automatizadas, mas nem toda verificação automatizada é um teste.

_Uso:_

"O agente vive entregando código quebrado nas execuções AFK."

"Quais verificações automatizadas estão ligadas no [sandbox](./Sandbox.md)?"

"Só os testes unitários."

"Acrescenta checagem de tipos e lint — ele vai se autocorrigir a partir disso antes de o PR sequer existir."
