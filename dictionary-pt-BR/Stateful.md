---
description: Leva informação adiante. Sessões têm estado entre turnos; agentes podem ganhar estado entre sessões via um sistema de memória.
---

Leva informação adiante. Uma [sessão](./Session.md) tem estado entre [turnos](./Turn.md) — o [contexto](./Context.md) se acumula conforme a sessão corre, e é por isso que sessões longas derivam para a [zona burra](./Smart%20zone.md). Um [agente](./Agent.md) pode ganhar estado entre **sessões** com um [sistema de memória](./Memory%20system.md) que persiste informação no [ambiente](./Environment.md) e a recarrega no início de sessões futuras. O [modelo](./Model.md) nunca tem estado; qualquer continuidade aparente é o [harness](./Harness.md) reenviando contexto. Contraparte de [sem estado](./Stateless.md).

Onde o estado mora em cada camada:

| Camada   | Tem estado?   | Como                                                                                                                   |
| -------- | ------------- | ---------------------------------------------------------------------------------------------------------------------- |
| Modelo   | Nunca         | Os [parâmetros](./Parameters.md) estão congelados; ele só vê o que está em cada requisição                             |
| Sessão   | Entre turnos  | O harness anexa cada mensagem e [resultado de ferramenta](./Tool%20result.md) ao contexto                              |
| Harness  | Entre sessões | Arquivos de memória, [AGENTS.md](./AGENTS.md.md), [artefatos de handoff](./Handoff%20artifact.md) — escritos e relidos |
| Ambiente | Sempre        | Arquivos persistem independentemente de haver alguma sessão rodando                                                    |

O estado de cada camada é construído relendo algo guardado na camada de baixo: a sessão parece contínua porque o harness reenvia o histórico de mensagens ao modelo sem estado, e o agente lembra entre sessões porque o harness recarrega arquivos do ambiente. Nenhum estado é guardado dentro do modelo.

Estado nem sempre é desejável. Tudo o que é levado adiante influencia o que vem depois, então uma suposição errada feita cedo na sessão também é levada adiante. [Limpar](./Clearing.md) é o ato deliberado de jogar fora o estado da sessão e recomeçar a partir do que está escrito.

_Uso:_

"Ele lembrou das minhas preferências de ontem — isso quer dizer que o modelo aprendeu?"

"Não; o agente tem estado porque o harness escreveu isso num arquivo de memória e recarregou no início da sessão. O modelo em si não viu nada de ontem."
