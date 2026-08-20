---
description: O mundo sobre o qual o agente age — o que está fora do harness, percebido por resultados e alterado por chamadas de ferramenta.
---

O mundo sobre o qual o [agente](./Agent.md) age — qualquer coisa fora do [harness](./Harness.md) que o agente percebe por meio de [resultados de ferramenta](./Tool%20result.md) e altera por meio de [chamadas de ferramenta](./Tool%20call.md). O harness _executa_ o agente; o ambiente é onde o agente _trabalha_. Um arquivo como o [`AGENTS.md`](./AGENTS.md.md) mora no ambiente; o harness é quem o carrega na [janela de contexto](./Context%20window.md). Um [sistema de arquivos](./Filesystem.md) é o tipo mais comum de ambiente, mas não o único (um banco de dados, uma API remota ou uma sessão de navegador também podem ser ambientes).

O agente só enxerga o ambiente quando olha. Tudo o que ele sabe sobre o ambiente chegou por um resultado de ferramenta, então seu retrato é uma coleção de instantâneos, cada um correto no momento em que foi tirado. Se um arquivo muda depois de o agente o ter lido — você o edita à mão, uma etapa de build o regenera — o agente continua raciocinando a partir da cópia obsoleta até que algo o leve a reler. Um agente descrevendo com confiança um arquivo que já não é assim costuma ser isso: o ambiente andou, o instantâneo não.

O ambiente também é a camada que persiste — a única que está sempre [com estado](./Stateful.md). O contexto de uma [sessão](./Session.md) some quando a sessão acaba, mas arquivos escritos no ambiente ficam para a sessão seguinte ler — e é disso que dependem [sistemas de memória](./Memory%20system.md), [artefatos de handoff](./Handoff%20artifact.md) e o `AGENTS.md`. Qualquer coisa que um agente deva continuar sabendo amanhã tem que acabar no ambiente.

Você decide o tamanho do ambiente. Um [sandbox](./Sandbox.md) o encolhe, limitando o que o agente alcança; acrescentar uma [ferramenta](./Tool.md) o estende, trazendo um banco de dados ou uma API para o alcance. O que está dentro da fronteira é o que o agente pode perceber e mudar; tudo fora dela não existe para o agente. O quão bem o ambiente está preparado para apoiar o trabalho do agente é a [AX](./AX.md) da base de código.

_Evite:_ usar "ambiente" para o runtime ou para o próprio harness — o harness é o invólucro, o ambiente é a área de trabalho.

_Uso:_

"O agente não consegue ver o schema do banco de staging."

"Liga isso ao ambiente — dá uma ferramenta `psql` com escopo somente leitura no staging. O harness está bem, ele só não tem sobre o que agir."
