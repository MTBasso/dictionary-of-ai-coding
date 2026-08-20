---
description: Carregar só o contexto de que o agente precisa agora, com ponteiros de contexto para o resto. Emprestado do design de interfaces.
aliases:
  - Revelação progressiva
---

Carregar só o [contexto](./Context.md) de que o [agente](./Agent.md) precisa agora, com [ponteiros de contexto](./Context%20pointer.md) para o resto. O termo vem do design de interfaces, onde significa mostrar ao usuário apenas os controles relevantes à tarefa atual e esconder o resto atrás de um clique.

A técnica existe porque contexto é custo em dobro. Todo [token](./Token.md) carregado de antemão é cobrado como [token de entrada](./Input%20tokens.md) em cada [turno](./Turn.md), e todo token gasta [orçamento de atenção](./Attention%20budget.md), precise o agente dele ou não. Um [AGENTS.md](./AGENTS.md.md) entupido com o guia de estilo completo, o manual de deploy e as convenções de banco de dados deixa o agente pior em todos eles — as instruções que importam para a tarefa atual ficam diluídas pelas que não importam. O sinal é um agente que ignora regras que você sabe estarem no contexto dele: elas estão lá, mas soterradas.

A revelação progressiva inverte isso. Mantenha pequena a camada sempre carregada — uma frase por tema e um ponteiro para onde está o detalhe. O agente lê o guia de estilo quando está escrevendo um componente, o manual de deploy quando está fazendo deploy, e nenhum dos dois quando está consertando um teste. [Skills](./Skill.md) são esse padrão embutido no [harness](./Harness.md): uma descrição curta carregada a cada [sessão](./Session.md), e as instruções completas só quando acionadas.

_Uso:_

"Eu jogo o guia de estilo inteiro no AGENTS.md?"

"Não — revelação progressiva. Referencia o guia de estilo como uma skill que o agente carrega quando de fato precisar escrever um componente. O AGENTS.md paga o custo em token a cada turno."
