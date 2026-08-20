---
description: O que o harness devolve depois de executar uma chamada de ferramenta. A única visão que o agente tem do ambiente.
---

O que o [harness](./Harness.md) devolve depois de executar uma [chamada de ferramenta](./Tool%20call.md) — o conteúdo do arquivo, a saída do comando, o erro. É a única visão que o [agente](./Agent.md) tem do [ambiente](./Environment.md). Volta ao [modelo](./Model.md) na _próxima_ [requisição ao provedor de modelo](./Model%20provider%20request.md), onde o modelo decide o que fazer com ele. Chamada e resultado são duas pontas da mesma troca, ambas dentro de um [turno](./Turn.md).

O ciclo de vida de um resultado de ferramenta:

| Passo | Quem    | O que acontece                                                             |
| ----- | ------- | -------------------------------------------------------------------------- |
| 1     | Harness | Executa a chamada — roda o comando, lê o arquivo                           |
| 2     | Harness | Captura o desfecho: saída, conteúdo ou erro                                |
| 3     | Harness | Anexa isso ao [contexto](./Context.md) como uma mensagem                   |
| 4     | Harness | Envia o contexto inteiro ao provedor na requisição seguinte                |
| 5     | Modelo  | Lê o resultado e decide: outra chamada de ferramenta ou uma resposta final |

O resultado permanece no contexto pelo resto da [sessão](./Session.md). Resultados de ferramenta costumam ser o grosso do contexto de uma sessão de programação: cada arquivo lido, cada teste rodado, cada busca entra por inteiro e continua ocupando [tokens](./Token.md) muito depois de deixar de ser útil. Alguns resultados grandes — um log de teste verboso, um arquivo gerado lido inteiro — podem empurrar uma sessão para a borda da [janela de contexto](./Context%20window.md) mais rápido que a própria conversa.

Como o resultado é tudo o que o modelo vê, ele não tem como conferir o ambiente por trás dele. Se a saída foi truncada, se o comando falhou em silêncio, ou se o harness devolveu um erro em vez do conteúdo, o modelo raciocina a partir do que recebeu. Quando o retrato que o agente tem do seu sistema parece errado, os resultados de ferramenta são onde olhar: em algum ponto da transcrição há um resultado que diz algo diferente do que você sabe ser verdade.

_Uso:_

"Ele está raciocinando sobre o arquivo como se estivesse vazio."

"O resultado da ferramenta voltou como negação de permissão, não como conteúdo. O modelo só viu a string de erro — ele não tem outro jeito de ver o arquivo."
