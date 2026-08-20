---
description: Transferir o contexto do agente de uma sessão para outra, sem caminho de volta. O mecanismo de transporte varia.
---

Transferir o [contexto](./Context.md) de um [agente](./Agent.md) de uma [sessão](./Session.md) para outra. O mecanismo de transporte varia — um [artefato de handoff](./Handoff%20artifact.md) escrito, um resumo em memória ([compactação](./Compaction.md)) e outros. É diferente de [limpar](./Clearing.md), onde não há transferência nenhuma. As razões variam: trocar de papel (planejador → implementador), disparar uma execução [AFK](./AFK.md), abrir várias sessões em paralelo, ou liberar espaço na [janela de contexto](./Context%20window.md).

A sessão que recebe começa com zero contexto — o [modelo](./Model.md) é [sem estado](./Stateless.md), e nada da sessão antiga é visível para a nova. Tudo de que a próxima sessão precisa tem que ser levado explicitamente; o resto se perde. "Sem caminho de volta" é a restrição que molda o transporte: a nova sessão não pode perguntar à antiga o que ela quis dizer, então o material levado precisa se sustentar sozinho.

| Mecanismo           | Forma                                   | Propriedades                                                                         |
| ------------------- | --------------------------------------- | ------------------------------------------------------------------------------------ |
| Artefato de handoff | Arquivo no [ambiente](./Environment.md) | Você pode ler e corrigir antes que algo dependa dele; reutilizável em várias sessões |
| Compactação         | Resumo dentro da janela de contexto     | Automática e barata; mais difícil de inspecionar; alimenta um sucessor só            |

A falha visível de um handoff ruim é a relitigação: a nova sessão reabre decisões que a antiga já tinha fechado, porque o transporte registrou o que foi decidido, mas não o porquê. Julgue um handoff pelo que uma sessão com zero contexto conseguiria fazer com ele.

_Uso:_

"A sessão de planejamento está ficando pesada — continuo assim mesmo?"

"Faz um handoff. Escreve as decisões num documento, limpa, e começa a implementação numa sessão nova lendo dele."
