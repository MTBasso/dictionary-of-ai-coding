---
description: A saída do modelo nomeando uma ferramenta e seus argumentos — apenas texto estruturado. O harness precisa lê-la e executar.
---

A saída do [modelo](./Model.md) nomeando uma [ferramenta](./Tool.md) e seus argumentos — apenas texto estruturado. Ela não faz nada sozinha; o [harness](./Harness.md) precisa lê-la e executar. É produzida pelo modelo dentro de uma [requisição ao provedor de modelo](./Model%20provider%20request.md).

O ciclo de vida de uma chamada de ferramenta:

| Passo | Quem    | O que acontece                                                                                   |
| ----- | ------- | ------------------------------------------------------------------------------------------------ |
| 1     | Modelo  | Descobre quais ferramentas existem pelas descrições no [prompt de sistema](./System%20prompt.md) |
| 2     | Modelo  | Emite uma chamada — nome da ferramenta mais argumentos, em geral JSON — e para                   |
| 3     | Harness | Analisa a chamada e a confere contra o [modo de permissão](./Permission%20mode.md)               |
| 4     | Harness | Executa, se for permitido                                                                        |
| 5     | Harness | Devolve o desfecho como [resultado de ferramenta](./Tool%20result.md) na requisição seguinte     |

Um [turno](./Turn.md) de trabalho do [agente](./Agent.md) costuma ser muitas dessas idas e voltas encadeadas.

Como a chamada é gerada por [previsão do próximo token](./Next-token%20prediction.md) como todo o resto, ela pode estar errada do mesmo jeito que qualquer saída do modelo: um caminho que não existe, uma flag que o comando não tem, argumentos que são plausíveis em vez de corretos. O harness executa o que foi escrito, não o que se quis dizer — um caminho digitado errado não falha com elegância, ele edita o arquivo errado.

_Uso:_

"Ele disse que rodou os testes, mas os timestamps dos arquivos não mudaram."

"Olha a transcrição — ele chegou a emitir uma chamada de ferramenta ou só descreveu que rodou? O modelo produz a chamada, mas se o harness não a executou, nada aconteceu."
