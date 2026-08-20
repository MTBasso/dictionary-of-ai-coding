---
description: "Experiência do desenvolvedor: o quanto a base de código e as ferramentas facilitam o bom trabalho humano — docs, feedback, erros."
aliases:
  - Developer experience
  - Experiência do desenvolvedor
---

Experiência do desenvolvedor — o quanto uma base de código e sua cadeia de ferramentas facilitam que pessoas façam um bom trabalho. Boa DX é feedback rápido, mensagens de erro claras, documentação que responde à pergunta que você de fato tem, e uma configuração inicial que funciona na primeira tentativa. O termo é bem anterior à programação com IA; está neste dicionário sobretudo como contraste para a [AX](./AX.md).

DX é a interação entre a pessoa e a base de código — nada além disso. A principal diferença entre os dois públicos é que pessoas são [com estado](./Stateful.md) e agentes são [sem estado](./Stateless.md). Uma pessoa aprende a base de código uma vez e carrega esse conhecimento para todos os dias seguintes, e é por isso que uma DX ruim é sobrevivível: ela contorna a CI lenta agrupando os pushes, contorna a documentação faltante perguntando no Slack uma vez, contorna a estrutura confusa lembrando onde as coisas ficam. Os contornos se acumulam, e um time acaba produtivo numa base de código que trabalha contra ele.

[Agentes](./Agent.md) enfrentam a mesma base de código sem nenhum desse acúmulo. Sendo sem estado entre [sessões](./Session.md), um agente reaprende a base do zero toda vez — ele se beneficia da suíte de testes rápida e das mensagens de erro claras, mas tudo o que ele descobriu ontem se foi, a menos que tenha sido escrito no [ambiente](./Environment.md), que o agente só percebe por [resultados de ferramenta](./Tool%20result.md). Essa é a lacuna que a AX nomeia: as partes da DX que sobrevivem quando o desenvolvedor é um agente, mais preocupações que pessoas não têm, como manter a [janela de contexto](./Context%20window.md) livre.

A sobreposição faz com que investir em DX muitas vezes melhore a AX de graça — tipos estritos, testes rápidos e estrutura previsível ajudam os dois. A divergência faz com que nem sempre melhore: um belo documento de onboarding ajuda uma pessoa por uma semana e um agente em nada, a menos que seja alcançável a partir do [AGENTS.md](./AGENTS.md.md).

_Uso:_

"Nossa DX está boa — gente nova fica produtiva em uma semana."

"Produtiva porque alguém senta com elas nessa semana. O agente não ganha essa semana; confere a AX separado."
