---
description: Um agente criado por outro agente via chamada de ferramenta. Roda na própria sessão e devolve um único resultado de ferramenta.
aliases:
  - Subagente
---

Um [agente](./Agent.md) criado por outro agente por meio de uma [chamada de ferramenta](./Tool%20call.md). Roda na própria [sessão](./Session.md), com a própria [janela de contexto](./Context%20window.md), e devolve um único [resultado de ferramenta](./Tool%20result.md). É diferente de um [handoff](./Handoff.md) — o pai espera especificamente um retorno; um handoff não tem caminho de volta. **Não pode criar outros subagentes** — a árvore tem um nível só. Subagentes existem para isolar [contexto](./Context.md), não para compor hierarquias.

O propósito é manter trabalho barulhento fora do contexto do pai. Uma busca ampla ou uma longa expedição de leitura de arquivos produz páginas de resultados de ferramenta, a maior parte deles relevante só até achar a resposta. Rodando dentro do pai, tudo isso fica no contexto dele pelo resto da sessão. Rodando dentro de um subagente, o ruído enche uma janela descartável — só o relatório final chega ao contexto do pai. O relatório é uma [fonte secundária](./Secondary%20source.md): o pai recebe o relato do subagente sobre o que encontrou, não os resultados brutos, então tudo o que o relatório omite é invisível para o pai.

Subagentes também rodam de forma concorrente — um pai pode disparar vários de uma vez sobre pedaços de trabalho independentes.

_Uso:_

"Os resultados do grep estão estourando meu contexto."

"Cria um subagente para fazer a busca — ele queima a própria janela de contexto no ruído e devolve os dois caminhos de arquivo de que você realmente precisa."
