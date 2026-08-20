---
description: Um protocolo para plugar servidores externos de ferramentas num harness — como um agente ganha ferramentas além das nativas.
---

**Model Context Protocol.** Um protocolo para plugar servidores externos de ferramentas num [harness](./Harness.md) — como um [agente](./Agent.md) ganha [ferramentas](./Tool.md) além das que o harness já traz. O agente nunca "chama o MCP"; ele chama uma ferramenta, e acontece de o harness ter obtido essa ferramenta de um servidor MCP. O protocolo também expõe recursos (dados somente leitura) e prompts (modelos reutilizáveis), mas fornecer ferramentas é o uso principal.

O protocolo resolve um problema de integração. Sem um padrão, cada harness precisaria da própria integração com o Linear, da própria com o Slack, da própria com o banco de dados — escritas e mantidas separadamente para cada um. Com MCP, a integração é escrita uma vez como servidor, e qualquer harness compatível pode usá-la. O harness se conecta ao servidor, o servidor anuncia quais ferramentas oferece, e essas ferramentas passam a estar disponíveis ao agente junto das nativas.

O custo é pago em [contexto](./Context.md). Cada ferramenta que um servidor anuncia chega como uma definição — nome, descrição, schema de parâmetros — e o [modelo](./Model.md) só pode chamar ferramentas que conhece. A abordagem ingênua carrega todas as definições na [janela de contexto](./Context%20window.md) de antemão: instale alguns servidores generosos e uma [sessão](./Session.md) começa com milhares de [tokens](./Token.md) de schemas de ferramenta antes de você digitar qualquer coisa, gastando [orçamento de atenção](./Attention%20budget.md) com ferramentas que a tarefa nunca vai usar.

Muitos harnesses hoje mitigam isso com busca de ferramentas: em vez das definições completas, o contexto guarda um [ponteiro de contexto](./Context%20pointer.md) para as ferramentas disponíveis — o agente busca uma ferramenta por nome ou propósito e carrega a definição só quando precisa. Se o seu harness não faz isso, o custo inicial continua valendo, e vale a pena habilitar só os servidores de que o projeto realmente precisa.

_Uso:_

"O agente precisa ler tickets do Linear."

"Configura o harness para usar o servidor MCP do Linear — ele expõe a API do Linear como ferramentas que o agente pode chamar. Te poupa de escrever wrappers de ferramenta na mão."
