---
description: "Saída do modelo confiantemente errada. Dois sabores: factualidade (fatos inventados) e fidelidade (desvio do contexto carregado)."
aliases:
  - Alucinação
---

Saída do [modelo](./Model.md) confiantemente errada. Tem dois sabores, com causas e soluções diferentes:

| Sabor          | O que dá errado                                                                                                        | Causa                                                                                                                                     | Solução                                                                 |
| -------------- | ---------------------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------- |
| _Factualidade_ | Fatos inventados ou errados sobre o mundo — uma função que não existe, uma assinatura de API errada, uma citação falsa | Lacunas de [conhecimento paramétrico](./Parametric%20knowledge.md), muitas vezes além do [corte de conhecimento](./Knowledge%20cutoff.md) | Carregar o [conhecimento contextual](./Contextual%20knowledge.md) certo |
| _Fidelidade_   | A saída se afasta do conhecimento contextual carregado, das instruções do usuário ou do próprio raciocínio anterior    | [Degradação de atenção](./Attention%20degradation.md); piora na [zona burra](./Smart%20zone.md)                                           | [Limpar](./Clearing.md) ou [compactar](./Compaction.md)                 |

A [previsão do próximo token](./Next-token%20prediction.md) produz saída fluente independentemente de o fato por trás ser real — o modelo não tem sinal interno de que não sabe algo, então um método inventado chega no mesmo registro seguro de um correto. Código alucinado é plausível por construção: é como a API _seria_ se existisse, o que é exatamente o que o faz passar por uma revisão superficial e falhar só quando roda.

Você precisa saber qual sabor está olhando, porque a solução de um piora o outro. Factualidade significa conhecimento faltando: a solução é acrescentar contexto — a documentação, as definições de tipo, o arquivo. Fidelidade significa que o conhecimento está presente mas está perdendo a competição por atenção: a solução é remover contexto. Diagnostique fidelidade como factualidade e você cola mais documentação, o que aumenta o contexto e piora o desvio. Quando o agente erra algo, verifique se a informação correta já estava no contexto antes de decidir qual problema você tem.

_Evite:_ "alucinação" como sinônimo seco de "errado" — sem nomear o sabor, o termo não tem valor diagnóstico.

_Uso:_

"Ele alucinou um método `parseAsync` no schema."

"Factualidade ou fidelidade?"

"O método existe na documentação que eu colei — ele só parou de ler depois do [turno](./Turn.md) quarenta."

"Fidelidade, então. Compacta e recarrega; não adianta acrescentar mais documentação."
