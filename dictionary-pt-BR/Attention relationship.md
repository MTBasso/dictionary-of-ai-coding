---
description: O pareamento entre dois tokens — pares significativos se influenciam mais que os não relacionados. Um contexto de N tokens tem ~N² deles.
---

Ao prever cada [token](./Token.md), o [modelo](./Model.md) leva em conta todos os outros tokens do [contexto](./Context.md) — alguns com peso alto, outros quase nenhum. O pareamento entre dois tokens é uma **relação de atenção**, e pares significativos ("ela" com "Sarah", ou uma chamada `getUser()` com sua definição `function getUser`) se influenciam mais que pares sem relação. Um contexto de N tokens tem da ordem de N² relações.

Os pareamentos são onde mora a compreensão aparente do modelo. Quando ele resolve um pronome, é porque a relação de atenção entre "ela" e "Sarah" está forte. Quando chama uma função com os argumentos certos, é a relação entre o ponto de chamada e a definição que ele leu antes fazendo o trabalho. Nada disso é consultado numa tabela — é calculado do zero a cada [requisição ao provedor de modelo](./Model%20provider%20request.md), para cada par.

Vale parar no número N², porque ele cresce mais rápido do que a intuição sugere:

| Tamanho do contexto | Pareamentos (~N²) |
| ------------------- | ----------------- |
| 1.000 tokens        | ~1 milhão         |
| 10.000 tokens       | ~100 milhões      |
| 100.000 tokens      | ~10 bilhões       |

Cada pareamento também é calculado mais de uma vez. Modelos têm múltiplas cabeças de atenção — as contagens exatas dos modelos de fronteira não são publicadas, mas de cinquenta a cem é um palpite razoável — e cada cabeça calcula sua própria versão de cada relação. Ou seja, todo pareamento da tabela acima é duplicado em cada cabeça. É muito pareamento.

Só um número pequeno dessas relações importa para uma tarefa qualquer. O pareamento entre a sua instrução e o código que ela governa é um de um punhado que conta; quase todo o resto do conjunto é ruído. E os dois crescem em ritmos diferentes: as relações que importam ficam mais ou menos constantes, enquanto o total cresce de forma quadrática com o tamanho do contexto. Com 1.000 tokens, o pareamento que te interessa é um em um milhão; com 100.000, é um em dez bilhões. Essa é a aritmética por trás do [orçamento de atenção](./Attention%20budget.md), e a [degradação de atenção](./Attention%20degradation.md) é como isso se sente quando as relações que importam ficam com uma fatia fina demais.

_Uso:_

"Ele fica confundindo os dois símbolos `user` no diff — parece que estamos na [zona burra](./Smart%20zone.md)."

"Pois é, a relação de atenção entre cada ponto de chamada e sua declaração está brigando com a outra — mesmo formato de token, ligações diferentes. Renomeia um e os pareamentos ficam mais nítidos."
