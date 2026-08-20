---
description: O que o modelo de fato faz. Sorteia um próximo token a partir do contexto, anexa e roda de novo. Seu único modo de operação.
---

O que o [modelo](./Model.md) de fato faz. Dado um [contexto](./Context.md), ele sorteia um próximo [token](./Token.md), anexa e roda de novo. Toda saída — uma frase, uma [chamada de ferramenta](./Tool%20call.md), um arquivo de mil linhas — é construída um token por vez. O modelo não tem outro modo de operação.

Cada passo funciona igual: os tokens da [janela de contexto](./Context%20window.md) passam pelos [parâmetros](./Parameters.md), que produzem uma probabilidade para cada token do vocabulário — este aqui é bem provável como próximo, aquele nem tanto. Um token é sorteado a partir dessas probabilidades, anexado, e o laço roda de novo com o contexto ligeiramente mais longo. Esse passo de amostragem é a razão de o mesmo prompt produzir saídas diferentes em execuções diferentes: o [não-determinismo](./Non-determinism.md) está embutido no mecanismo, não é um defeito colocado por cima.

Guardar esse mecanismo explica comportamentos que de outro modo parecem estranhos. O modelo nunca verifica se um token é _verdadeiro_ antes de emiti-lo — apenas se é _provável_ — e isso está na raiz da [alucinação](./Hallucination.md). Ele se compromete com cada token conforme avança, então uma primeira frase que soa confiante pode conduzir todo o resto da resposta para o lugar errado. E como os [tokens de saída](./Output%20tokens.md) são produzidos estritamente um por vez, a velocidade de geração impõe um piso para quão rápido qualquer [agente](./Agent.md) consegue trabalhar.

_Uso:_

"Como o agente 'decide' chamar uma ferramenta?"

"Ele não decide — é previsão do próximo token do começo ao fim. A chamada de ferramenta é só uma string estruturada que o [harness](./Harness.md) extrai do fluxo de saída."
