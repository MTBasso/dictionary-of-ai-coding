---
description: Um artefato de handoff que descreve um trabalho de várias sessões — o que está sendo construído. É composto de tickets.
aliases:
  - Especificação
---

Um [artefato de handoff](./Handoff%20artifact.md) que descreve um trabalho de várias [sessões](./Session.md) — o que está sendo construído, não como cada sessão faz a sua parte. Muda conforme o trabalho avança. É composto de [tickets](./Ticket.md).

A especificação existe porque sessões são descartáveis e trabalho grande não é. Qualquer coisa que exija mais de uma [janela de contexto](./Context%20window.md) de esforço precisa de um lar fora do [contexto](./Context.md) — algum lugar no [ambiente](./Environment.md) do agente que sobreviva à [limpeza](./Clearing.md), seja um arquivo no repositório, uma issue do GitHub ou um rastreador de issues que o agente alcance. A especificação é esse lar: o objetivo, as restrições, as decisões tomadas até aqui e a lista de tickets com seus status. Qualquer sessão nova pode lê-la e saber em que pé o trabalho está, sem herdar o ruído acumulado da sessão anterior.

Especificações vêm em estilos reconhecíveis, herdados em boa parte de como equipes já registram as coisas. Um _documento de requisitos de produto_ (PRD) puxa para o quê e o porquê voltados ao usuário — funcionalidades, comportamento, critérios de aceite. Um _documento de design_ ou _RFC_ puxa para o técnico — a abordagem escolhida, as alternativas rejeitadas, os trade-offs. Na ponta pequena, um simples `plano.md` com uma lista de tickets cumpre o mesmo papel para uma funcionalidade de várias sessões. O estilo importa menos que o papel: para o [agente](./Agent.md), todos são a mesma coisa — a declaração durável de intenção que ele lê no início de cada sessão.

_Uso:_

"Isso tudo devia ser uma sessão só?"

"Não, escreve como especificação — quebra em tickets e roda cada um na própria sessão. Tentar fazer tudo num contexto só vai bater na [zona burra](./Smart%20zone.md) antes da metade."
