---
description: Os parâmetros. Sem estado — faz previsão do próximo token e nada mais. Sozinho, não consegue fazer nada de agêntico.
---

Os [parâmetros](./Parameters.md). [Sem estado](./Stateless.md) — faz [previsão do próximo token](./Next-token%20prediction.md) e nada mais. "Claude Opus 4.x" e "GPT-5.x" são modelos. Sozinho, um modelo não consegue fazer nada de agêntico; ele precisa ser colocado dentro de um [harness](./Harness.md).

Modelos não leem arquivos, não rodam comandos, não navegam na web e não lembram de ontem — o modelo recebe [tokens](./Token.md) e prevê tokens de volta, uma vez por [requisição ao provedor de modelo](./Model%20provider%20request.md). Tudo o que parece um [agente](./Agent.md) trabalhando — escolher [ferramentas](./Tool.md), ler resultados, repetir até a tarefa acabar — é o harness orquestrando várias dessas previsões em sequência.

[Provedores de modelo](./Model%20provider.md) lançam modelos em faixas: um grande, que é o mais inteligente mas lento e caro, e outros menores, mais rápidos e baratos, porém menos capazes. Escolher a faixa é uma decisão real — o pesado para planejamento e depuração difícil, o leve para mudanças mecânicas — e os harnesses deixam você trocar no meio da [sessão](./Session.md).

Ser rigoroso com a palavra também afia o diagnóstico. "O modelo é ruim nisso" é uma afirmação específica — o mesmo modelo em outro harness, ou com outro [contexto](./Context.md), muitas vezes se comporta de maneira completamente diferente. Antes de culpar o modelo, verifique o que ele recebeu: a maior parte das respostas decepcionantes vem do contexto ou do harness, não dos parâmetros.

_Uso:_

"A gente devia trocar o modelo de Sonnet para Opus na etapa de planejamento?"

"Pode testar — mas o harness está fazendo o trabalho pesado nessa tarefa. Trocar o modelo não vai ajudar se o [prompt de sistema](./System%20prompt.md) e as ferramentas estiverem errados."
