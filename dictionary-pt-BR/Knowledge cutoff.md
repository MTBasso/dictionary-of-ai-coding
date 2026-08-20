---
description: A data a partir da qual o modelo não tem conhecimento paramétrico. Bibliotecas posteriores viram armadilhas de fabricação.
---

A data a partir da qual um [modelo](./Model.md) não tem [conhecimento paramétrico](./Parametric%20knowledge.md). Bibliotecas, APIs e eventos posteriores ao corte são armadilhas de fabricação, a menos que a documentação deles seja carregada como [conhecimento contextual](./Contextual%20knowledge.md). Cada lançamento de modelo vem com seu próprio corte.

O corte existe por causa de como modelos são feitos: o [treinamento](./Training.md) assa um instantâneo de texto nos [parâmetros](./Parameters.md) do modelo, e depois disso os parâmetros ficam congelados. O modelo não sabe que seu conhecimento tem uma borda — perguntado sobre algo além do corte, ele não recusa, ele extrapola a partir do que mais se aproxima do que conhece. É isso que torna a armadilha silenciosa: código escrito contra uma versão antiga de uma biblioteca parece plausível, muitas vezes compila, e falha justamente nas partes que mudaram.

A solução é sempre a mesma: colocar informação atual no [contexto](./Context.md). Carregue o changelog, aponte para as definições de tipo da versão instalada, ou peça ao agente que leia a documentação na web. Qualquer coisa no contexto vale mais que nada nos parâmetros.

_Uso:_

"Ele insiste em escrever a sintaxe do SDK v3 — a gente está no v5."

"O v5 saiu depois do corte de conhecimento. Carrega o changelog do v5 como conhecimento contextual, senão ele vai continuar fabricando a partir da versão paramétrica mais velha."
