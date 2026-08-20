---
description: Conforme a sessão cresce, o orçamento de atenção de cada token se espalha por mais concorrentes; o sinal nas relações que importam encolhe.
---

Conforme uma [sessão](./Session.md) cresce, o [orçamento de atenção](./Attention%20budget.md) de cada [token](./Token.md) se espalha por mais concorrentes. O sinal em qualquer [relação significativa](./Attention%20relationship.md) encolhe; o ruído de [contexto](./Context.md) irrelevante se amontoa. Mesmo [modelo](./Model.md), mesmos [parâmetros](./Parameters.md) — só mais bocas para alimentar do mesmo prato. É a causa do efeito de [zona esperta e zona burra](./Smart%20zone.md).

Isso se apresenta como o modelo piorando no meio da sessão: restrições que ele seguiu por uma hora começam a escorregar, ele repergunta coisas que já lhe foram ditas, escreve código que ignora um arquivo que leu antes. Nada no modelo mudou — a única variável é sobre quanto contexto ele está prestando atenção agora.

É gradual, e é isso que torna difícil perceber de dentro da sessão. Não há erro nem limiar; cada [turno](./Turn.md) é só um pouco pior que o anterior, e quando os deslizes ficam óbvios você já está na zona burra faz tempo.

A recuperação vem de remover contexto, não de acrescentar. Recolar a instrução ignorada acrescenta mais um concorrente à mesma janela lotada e ajuda só por pouco tempo. O que funciona: [limpar](./Clearing.md) e recarregar só o que a tarefa precisa, ou [compactar](./Compaction.md), ou fazer um [handoff](./Handoff.md) para uma sessão nova. Trate a queda na obediência a instruções como um sinal sobre o tamanho do contexto, não sobre o modelo.

_Uso:_

"Ele está lá no fundo da zona burra — inventando genéricos que não existem no arquivo de tipos."

"Degradação de atenção. As definições de tipo ainda estão no contexto, mas o sinal delas está soterrado por tudo o que a gente acrescentou desde então. Limpa e recarrega."
