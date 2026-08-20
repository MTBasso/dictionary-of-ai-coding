---
description: "Tudo em volta do modelo que o transforma em agente: ferramentas, prompt de sistema, gestão da janela de contexto, permissões, hooks."
---

Tudo em volta do [modelo](./Model.md) que o transforma em [agente](./Agent.md): [ferramentas](./Tool.md), [prompt de sistema](./System%20prompt.md), [gestão da janela de contexto](./Context%20window.md), permissões, hooks. **Claude.ai** e **Claude Code** rodam sobre o mesmo modelo e se comportam de formas diferentes porque seus harnesses são diferentes.

O modelo em si faz uma coisa só: recebe texto e produz texto. Ele não lê um arquivo, não roda um comando e não lembra do [turno](./Turn.md) anterior. O harness fornece tudo isso. Ele monta o [contexto](./Context.md) de cada [requisição ao provedor de modelo](./Model%20provider%20request.md), executa as [chamadas de ferramenta](./Tool%20call.md) que o modelo pede, devolve os [resultados de ferramenta](./Tool%20result.md), guarda o histórico da [sessão](./Session.md), pede permissão antes de ações arriscadas e decide quando [compactar](./Compaction.md). O laço do agente — modelo propõe, harness executa, repete — é conduzido pelo harness.

Isso importa para o diagnóstico. Quando o comportamento difere entre dois produtos, ou entre ontem e hoje, o modelo muitas vezes não é a variável — o harness é. Um prompt de sistema diferente, outro conjunto de ferramentas, um padrão de permissão alterado ou uma nova estratégia de gestão de contexto mudam o comportamento sem mudança nenhuma no modelo. Isso também significa que o harness é onde mora a maior parte da sua configuração: arquivos [AGENTS.md](./AGENTS.md.md), ajustes de permissão e hooks são todos instruções para o harness, não para o modelo.

Exemplos: Claude Code, Cursor, Codex CLI — e o Claude.ai, que é um harness de conversa, não de programação.

_Uso:_

"Mesmo modelo; por que o Claude Code edita arquivos e o Claude.ai só responde perguntas?"

"Harnesses diferentes — o Claude Code tem ferramentas de [sistema de arquivos](./Filesystem.md), outro prompt de sistema e uma camada de permissão. O modelo não é a variável aqui."
