---
description: Uma capacidade ensinável empacotada como unidade — fica fora da janela de contexto até um ponteiro de contexto trazê-la para a tarefa.
---

Uma capacidade ensinável empacotada como unidade — instruções e recursos para fazer bem uma tarefa, guardados no [ambiente](./Environment.md) até que um [ponteiro de contexto](./Context%20pointer.md) a traga para a [janela de contexto](./Context%20window.md) na tarefa em questão. É a unidade de [revelação progressiva](./Progressive%20disclosure.md) dentro de um [harness](./Harness.md).

Skills são um padrão aberto, definido em [agentskills.io](https://agentskills.io) — desenvolvido originalmente pela Anthropic e adotado desde então pela maioria dos harnesses relevantes, de modo que uma skill escrita uma vez funciona em todos. O formato é uma pasta contendo:

- Um arquivo `SKILL.md` — metadados (no mínimo um nome e uma descrição) mais as instruções em si
- Opcionalmente, scripts que o [agente](./Agent.md) pode rodar
- Opcionalmente, modelos e material de referência para os quais as instruções apontam

Só o nome e a descrição ficam no [contexto](./Context.md) por padrão. Quando a tarefa do agente combina, ele carrega o resto. Até lá, a skill ocupa quase nada — uma ou duas frases de [tokens](./Token.md), por maiores que sejam as instruções completas.

Isso distingue skills do [AGENTS.md](./AGENTS.md.md), que é carregado em toda [sessão](./Session.md), independentemente da tarefa. Uma skill é lida quando um tipo específico de trabalho aparece — fazer um release, criar o esqueleto de um serviço novo, escrever uma migração — e ignorada no resto do tempo.

_Evite:_ "[ferramenta](./Tool.md)" — uma ferramenta é o que o agente _chama_; uma skill é instrução que ele _lê_.

_Uso:_

"Onde eu coloco o manual de deploy?"

"Como skill — o agente carrega só quando a tarefa envolve deploy. No AGENTS.md ele queimaria tokens a cada [turno](./Turn.md) por algo que a gente usa uma vez por semana."
