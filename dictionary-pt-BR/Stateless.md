---
description: Não leva informação adiante. O modelo é sem estado entre requisições; um agente é sem estado entre sessões por padrão.
---

Não leva informação adiante. O [modelo](./Model.md) é sem estado entre [requisições ao provedor de modelo](./Model%20provider%20request.md) — cada requisição reenvia a [janela de contexto](./Context%20window.md) inteira, porque o modelo não tem como enxergar mais nada. Um [agente](./Agent.md) é sem estado entre [sessões](./Session.md) por padrão: uma sessão nova começa vazia, sem rastro das anteriores. Contraparte de [com estado](./Stateful.md).

O modelo em si é permanentemente sem estado: seus [parâmetros](./Parameters.md) ficam congelados depois do [treinamento](./Training.md), e nada do que você faz na [inferência](./Inference.md) os altera. O modelo não aprende com suas correções, não lembra de ter ouvido a mesma coisa ontem e não está te conhecendo — por mais que a conversa dê outra impressão. A sensação de continuidade dentro de uma sessão é fabricada pelo [harness](./Harness.md), que guarda a transcrição e a reenvia a cada requisição. O modelo não está lembrando da conversa; está relendo ela.

A consequência prática: se você quer que algo seja lembrado entre sessões, precisa escrever isso em algum lugar que o agente vá ler de volta. É isso que arquivos [AGENTS.md](./AGENTS.md.md), [sistemas de memória](./Memory%20system.md) e [artefatos de handoff](./Handoff%20artifact.md) são — arquivos carregados no [contexto](./Context.md) de sessões futuras, ocupando o lugar da memória que o modelo não tem. Quando o agente insiste num erro que você já corrigiu, a pergunta não é por que ele não aprendeu — ele não pode — mas onde essa correção deveria estar escrita para que toda sessão futura a leia.

_Uso:_

"Por que ele esquece a convenção toda vez que eu [limpo](./Clearing.md)?"

"O modelo é sem estado — a sessão nova começa vazia. Se você quer isso carregado, escreve no AGENTS.md ou num arquivo de memória que o harness leia no início da sessão."
