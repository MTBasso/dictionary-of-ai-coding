---
description: "Uma técnica para desenvolver um conceito de design: o agente entrevista o usuário socraticamente, uma decisão por vez."
aliases:
  - Sabatina
---

Uma técnica para desenvolver um [conceito de design](./Design%20concept.md) com um [agente](./Agent.md): o agente entrevista o usuário de forma socrática, uma decisão por vez, propondo uma resposta recomendada para cada uma. Freia a pressa de chegar a um plano pronto — nenhum [artefato de handoff](./Handoff%20artifact.md) é escrito até o conceito estabilizar.

A técnica existe porque agentes preenchem lacunas em silêncio. Pedido a escrever uma [especificação](./Spec.md) a partir de um prompt de duas linhas, o agente não para nas decisões que você não tomou — ele escolhe padrões e os escreve. O resultado parece completo, e os chutes ficam indistinguíveis das escolhas, então você os descobre tarde: na revisão, ou quando a funcionalidade pronta trata um caso extremo de um jeito que você nunca escolheu. O grilling inverte isso — em vez de chutar, o agente tem que perguntar.

É uma técnica com [humano no laço](./Human-in-the-loop.md): suas respostas são a entrada. Quando uma pergunta não pode ser respondida em conversa — você precisaria ver a coisa — mude para [prototipagem](./Prototyping.md).

_Uso:_

"Ele foi direto escrever a especificação e errou a lógica de cancelamento."

"Passa ele numa sabatina primeiro — faz ele te perguntar sobre cancelamento parcial, reembolso e prazos antes de comprometer qualquer coisa no documento. Sai mais barato resolver na conversa do que no código."
