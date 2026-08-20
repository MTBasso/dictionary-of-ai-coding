---
description: A mesma entrada pode produzir saídas diferentes. É uma propriedade de como modelos geram texto e de como provedores atendem requisições.
---

A mesma entrada pode produzir saídas diferentes. Rode um [modelo](./Model.md) duas vezes com [contexto](./Context.md) idêntico e você pode receber duas respostas diferentes — às vezes uma palavra, às vezes uma abordagem completamente distinta. Nada no seu código precisa mudar para isso acontecer.

É uma propriedade de como modelos geram texto e de como [provedores de modelo](./Model%20provider.md) atendem [requisições](./Model%20provider%20request.md). Durante a [inferência](./Inference.md), o modelo produz uma distribuição de probabilidade sobre os possíveis próximos [tokens](./Token.md) e um deles é sorteado — em geral com alguma aleatoriedade de propósito, já que escolher sempre o token mais provável produz texto repetitivo e de qualidade menor. Um token sorteado de outro jeito no começo de uma resposta muda todos os tokens seguintes, e é assim que uma única palavra diferente vira uma abordagem completamente diferente. A infraestrutura do provedor acrescenta mais variação: requisições são agrupadas em lotes no mesmo hardware, e diferenças minúsculas de ponto flutuante entre lotes podem desempatar uma disputa apertada entre dois tokens. Não existe uma configuração para desligar isso.

Espere uma faixa de resultados de um [agente](./Agent.md) na mesma tarefa. A maioria das respostas cai dentro de uma curva razoável de qualidade — é por isso que o não-determinismo é tolerável — mas as caudas são reais: em alguns dias o modelo vai parecer afiado; em outros, vai parecer que perdeu o fio. Mesma tarefa, outra rolagem de dados. Isso tem duas consequências práticas. Tentar de novo é uma estratégia legítima: uma tentativa fracassada é um sorteio da distribuição, e uma nova tentativa na mesma tarefa pode simplesmente cair melhor. E a verificação importa mais do que importaria com ferramentas determinísticas — você não pode testar o comportamento de um agente uma vez e confiar que ele se repita, então [verificações automatizadas](./Automated%20check.md) precisam pegar os sorteios ruins.

Cuidado para não narrativizar isso demais. Pessoas são máquinas de encontrar padrões, e uma sequência de execuções ruins pode parecer prova de que "o modelo piorou essa semana". Em geral é só a distribuição.

_Uso:_

"O Claude está horrível hoje. Lançaram uma versão pior?"

"Provavelmente não — a saída do modelo é não-determinística. Você vai ter dias bons e dias ruins na mesma tarefa. Tenta de novo amanhã antes de procurar uma causa."
