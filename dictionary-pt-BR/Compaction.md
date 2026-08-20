---
description: Um handoff feito em memória: o histórico da sessão anterior é resumido e semeia uma sessão nova. Com perdas — detalhe trocado por espaço.
aliases:
  - Compactação
---

Um [handoff](./Handoff.md) feito em memória: o histórico da [sessão](./Session.md) anterior é resumido, e o resumo semeia uma sessão nova. Tem perdas por design: a transcrição é uma [fonte primária](./Primary%20source.md), o resumo é uma [fonte secundária](./Secondary%20source.md) — detalhe trocado por espaço. É disparada manualmente por você, ou automaticamente pelo [autocompact](./Autocompact.md).

O mecanismo: a [janela de contexto](./Context%20window.md) é finita, e uma sessão longa a preenche — cada [resultado de ferramenta](./Tool%20result.md), cada arquivo lido, cada caminho errado fica no histórico. Quando fica pesado, o [harness](./Harness.md) pede ao [modelo](./Model.md) que resuma a sessão, joga fora o histórico original e semeia uma sessão nova com o resumo. O que não entrou no resumo sumiu do contexto. Alguns harnesses suavizam isso guardando a transcrição antiga em disco e deixando no resumo um [ponteiro de contexto](./Context%20pointer.md) para ela — a fonte secundária aponta de volta para a primária, então um detalhe que o resumo perdeu pode ser recuperado relendo o original.

O resumo é escrito pelo modelo, então pode ser direcionado por prompt. "Preserve as decisões sobre o schema" torna o artefato gerado mais deliberado. O momento também importa — compacte num limite de fase, depois de o plano estar fechado, não no meio de uma tarefa.

Contraste com [limpar](./Clearing.md), que descarta tudo e começa do zero: a compactação tenta levar o essencial adiante; limpar aposta que o essencial já está escrito em algum lugar melhor.

_Uso:_

"O [contexto](./Context.md) está ficando pesado e eu ainda tenho a rodada de testes para fazer."

"Compacta antes de começar — escreve no prompt do resumo o que precisa sobreviver, para a sessão nova manter as decisões de schema e descartar a exploração."
