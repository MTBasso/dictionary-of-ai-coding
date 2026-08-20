---
description: Quem serve um modelo para inferência. Normalmente remoto (Anthropic, OpenAI, Google), mas também pode ser local (Ollama, llama.cpp).
---

Quem serve um [modelo](./Model.md) para [inferência](./Inference.md). Normalmente um serviço remoto (Anthropic, OpenAI, Google), mas também pode ser local — Ollama, LM Studio, llama.cpp rodando na sua própria máquina. O [harness](./Harness.md) não roda o modelo; ele pede que um provedor rode.

O provedor é dono do maquinário: os [parâmetros](./Parameters.md) vivem no hardware dele, e cada [requisição ao provedor de modelo](./Model%20provider%20request.md) é o harness enviando [tokens](./Token.md) pela rede e recebendo previsões de volta. Isso faz do provedor a origem de toda uma categoria de problemas que são atribuídos por engano ao modelo ou ao harness — limites de taxa, capacidade degradada e quedas moram todos aqui. Quando o [agente](./Agent.md) trava no meio da [sessão](./Session.md) ou dá erro em todo [turno](./Turn.md), vale checar a página de status do provedor antes de qualquer outra coisa.

O provedor também define os termos comerciais: preço por token para [entrada](./Input%20tokens.md) e [saída](./Output%20tokens.md), descontos de [cache de prefixo](./Prefix%20cache.md) e quais modelos estão disponíveis. Note que o provedor e quem fabrica o modelo podem ser empresas diferentes — Bedrock, Vertex e OpenRouter servem modelos de terceiros.

Provedores locais trocam capacidade por controle: os modelos que cabem no seu hardware são bem menores que os de fronteira, mas nada sai da máquina e não há conta por token.

_Uso:_

"Dá para rodar isso offline para o cliente que tem rede isolada?"

"Troca o provedor de modelo por um local — Ollama ou llama.cpp na máquina deles. O harness não se importa, ele só bate em outro endpoint."
