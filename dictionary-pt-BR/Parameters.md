---
description: Os números dentro de um modelo — muitas vezes bilhões — ajustados durante o treinamento. Tudo o que o modelo sabe vive neles.
---

Os números dentro de um [modelo](./Model.md) — muitas vezes bilhões deles — ajustados durante o [treinamento](./Training.md). Tudo o que o modelo "sabe" vive neles. O treinamento os define; a [inferência](./Inference.md) os usa sem alterar. Também chamados de _pesos_.

Mecanicamente, os parâmetros são o que transforma entrada em saída. A [previsão do próximo token](./Next-token%20prediction.md) é um cálculo gigante: os [tokens](./Token.md) da [janela de contexto](./Context%20window.md) entram, são multiplicados através dos parâmetros e sai uma previsão do próximo token. Não existe um banco de fatos dentro do modelo, nem uma tabela de consulta de código — só esses números, arranjados de modo que o cálculo tenda a produzir saída útil. Fatos que o modelo recita a partir do treinamento, como a API de uma biblioteca padrão, são [conhecimento paramétrico](./Parametric%20knowledge.md): guardados nos parâmetros, não buscados em lugar nenhum.

O detalhe que vale internalizar é que os parâmetros ficam congelados depois do treinamento. Nada do que você faz em uma [sessão](./Session.md) os altera — nenhuma correção sua, nenhuma base de código que você mostre, nenhum erro com que ele "aprenda". Toda sessão roda sobre os mesmos números. É por isso que o modelo é [sem estado](./Stateless.md), por isso que o conhecimento embutido nele para no [corte de conhecimento](./Knowledge%20cutoff.md), e por isso que qualquer coisa específica do seu projeto tem que chegar via [contexto](./Context.md). O único jeito de mudar os parâmetros é mais treinamento — o que produz, na prática, outro modelo.

_Uso:_

"Dá para fazer fine-tuning na nossa base de código?"

"Isso atualizaria os parâmetros — vira outro modelo depois disso. Para um projeto só, quase sempre sai mais barato carregar a base como contexto do que retreinar."
