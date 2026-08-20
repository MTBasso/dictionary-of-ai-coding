---
description: As instruções que o harness antepõe a toda requisição — o briefing permanente do agente. Costuma ser estável ao longo da sessão.
---

As instruções que o [harness](./Harness.md) antepõe a toda [requisição ao provedor de modelo](./Model%20provider%20request.md) — o briefing permanente do [agente](./Agent.md): quem ele é, como se comportar, quais [ferramentas](./Tool.md) pode chamar, que convenções seguir. Costuma ser estável ao longo de uma [sessão](./Session.md).

O prompt de sistema é escrito por quem faz o harness, não por você, e em harnesses de programação ele é grande — muitas vezes dezenas de milhares de [tokens](./Token.md) de regras de comportamento, descrições de ferramentas e tratamento de casos extremos, todos pagos como [tokens de entrada](./Input%20tokens.md) a cada [turno](./Turn.md). Suas próprias instruções permanentes vão junto: arquivos como o [AGENTS.md](./AGENTS.md.md) são carregados ao lado do prompt de sistema no início da sessão, então o [modelo](./Model.md) lê o briefing do fornecedor e o seu juntos, antes mesmo de ver sua mensagem.

Como ele é idêntico em toda requisição, forma o começo do [cache de prefixo](./Prefix%20cache.md) — parte da razão de os harnesses o manterem fixo por toda a sessão em vez de editá-lo no caminho.

Modelos são treinados para priorizar o prompt de sistema sobre as mensagens do usuário. Então, quando um agente insiste numa convenção que você nunca pediu, ou formata a saída de um jeito do qual você não consegue se livrar, em geral ele está obedecendo ao prompt de sistema — e sua mensagem está perdendo a discussão. Alguns harnesses são customizáveis: dão acesso total ao prompt de sistema, para você ler o que o agente está de fato sendo instruído a fazer e mudar isso.

_Uso:_

"Dois harnesses, mesmo modelo, comportamento completamente diferente no mesmo prompt."

"Prompts de sistema diferentes. Um é ajustado para edições de código enxutas, o outro para explicar — a divergência mora aí, antes mesmo de a sua mensagem chegar."
