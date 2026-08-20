---
description: Rodar um modelo treinado para gerar saída — o que acontece a cada requisição ao provedor. Os parâmetros permanecem fixos.
---

Rodar um [modelo](./Model.md) treinado para gerar saída — o que acontece a cada [requisição ao provedor de modelo](./Model%20provider%20request.md). Os [parâmetros](./Parameters.md) permanecem fixos; o modelo apenas faz [previsão do próximo token](./Next-token%20prediction.md) sobre o [contexto](./Context.md) que recebeu. É barata em relação ao [treinamento](./Training.md), mas é cobrada por [token](./Token.md) e é o custo dominante de usar um modelo.

A vida de um modelo se divide em duas fases:

| Fase        | Quando acontece                  | O que faz                                                            | Parâmetros      |
| ----------- | -------------------------------- | -------------------------------------------------------------------- | --------------- |
| Treinamento | Uma vez, antes do lançamento     | Produz os parâmetros a partir de um corpus de treinamento            | Sendo escritos  |
| Inferência  | Toda vez que alguém usa o modelo | Roda os parâmetros congelados sobre o seu contexto para gerar tokens | Somente leitura |

Nada do que você faz durante a inferência é gravado de volta nos parâmetros — é essa a razão de uma correção feita hoje não permanecer amanhã. O modelo que comete o mesmo erro na próxima [sessão](./Session.md), depois de você ter explicado a solução com cuidado, não te ignorou; ele é incapaz de aprender com a conversa. O modelo é [sem estado](./Stateless.md) — a continuidade precisa vir de fora dele, da [janela de contexto](./Context%20window.md) ou de um [sistema de memória](./Memory%20system.md).

Esse mecanismo também explica como você é cobrado. Cada requisição roda o modelo sobre o contexto inteiro, então o custo escala com [tokens de entrada](./Input%20tokens.md) e [tokens de saída](./Output%20tokens.md), e um agente que faz dezenas de chamadas de [ferramenta](./Tool.md) paga inferência em cada ida e volta. É por isso que o tamanho do contexto é uma questão de custo, e não só de qualidade.

_Uso:_

"Por que a conta escala com o uso em vez de ser uma licença fixa?"

"Você está pagando por inferência — cada requisição ao provedor de modelo roda o modelo no hardware dele. O treinamento já aconteceu, mas o custo de inferência se acumula por requisição, e um único [turno](./Turn.md) pode se desdobrar em muitas requisições quando há chamadas de ferramenta."
