---
description: Compactação disparada automaticamente pelo harness quando a janela de contexto se aproxima do limite.
---

[Compactação](./Compaction.md) disparada automaticamente pelo [harness](./Harness.md) quando a [janela de contexto](./Context%20window.md) se aproxima do limite.

O harness observa o quanto a janela de contexto está cheia. Quando ela cruza um limiar — muitas vezes em torno de 80% — ele pausa, pede ao [modelo](./Model.md) que resuma a [sessão](./Session.md) até ali, e semeia uma sessão nova com o resumo. O trabalho então continua como se nada tivesse acontecido.

Só que algo aconteceu. Compactação tem perdas, e o autocompact tem perdas num momento que você não escolheu. Uma compactação manual acontece num limite de fase, quando você pode dizer ao modelo o que preservar. O autocompact dispara no meio da tarefa, sempre que o limiar é atingido — possivelmente na metade de uma refatoração, com o resumo decidindo sozinho quais das suas decisões valiam a pena guardar. O sintoma clássico: o [agente](./Agent.md) segue confiante, mas esqueceu em silêncio uma restrição que você estabeleceu uma hora atrás, e você só percebe quando o trabalho dele começa a contradizê-la.

A defesa é não deixar disparar. Acompanhe o indicador de contexto e compacte manualmente num limite natural, ou escreva as decisões num documento de plano ou [artefato de handoff](./Handoff%20artifact.md) em disco, onde resumo nenhum pode perdê-las. A maioria dos harnesses também deixa customizar a folga — mover o limiar para antes ou depois, ou desligar o autocompact de vez — para você ajustar quanto espaço quer manter antes de ele disparar.

_Uso:_

"Ele parece não lembrar do que a gente decidiu sobre o schema."

"O autocompact disparou entre [turnos](./Turn.md) — as decisões iniciais foram resumidas e a gente deve ter perdido alguma coisa. Recarrega o documento de plano, ou compacta manualmente da próxima vez para você controlar o que é mantido."
