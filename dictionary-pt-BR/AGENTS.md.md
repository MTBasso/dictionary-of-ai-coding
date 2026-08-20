---
description: Um arquivo no ambiente que o harness carrega na janela de contexto no início da sessão — o briefing permanente do projeto.
---

Um arquivo no [ambiente](./Environment.md) que o [harness](./Harness.md) carrega na [janela de contexto](./Context%20window.md) no início da [sessão](./Session.md) — o briefing permanente do projeto para o [agente](./Agent.md). É uma convenção entre harnesses; alguns também têm a própria variante (a do Claude Code é o CLAUDE.md).

Como ele carrega automaticamente, é um jeito de evitar se repetir entre sessões. O [modelo](./Model.md) é [sem estado](./Stateless.md) — uma correção que você dá numa sessão some na seguinte, e você acaba contando a toda sessão nova que o projeto usa pnpm, que os testes rodam com uma flag específica, que um diretório é gerado e não deve ser tocado. Quando você corrigiu o agente pela mesma coisa duas vezes, essa correção é candidata a virar uma linha no AGENTS.md.

Conteúdo adequado é tudo o que o agente não consegue deduzir do código: comandos de build e de teste, convenções que a base de código não deixa óbvias, restrições rígidas ("nunca edite o cliente gerado"). Curto e declarativo — é um briefing, não documentação.

O trade-off é que tudo nele está sempre carregado. Instruções se acumulam, a maioria irrelevante para uma tarefa qualquer, e um AGENTS.md longo custa tokens e se dilui — quanto mais instruções no contexto, menos confiável é a obediência a qualquer uma delas.

_Evite:_ usar o AGENTS.md para conteúdo que deveria ser revelado por [revelação progressiva](./Progressive%20disclosure.md) — tudo nele paga um custo de [token](./Token.md) a cada [turno](./Turn.md), em cada sessão, precise aquela sessão ou não. Um guia de estilo pode ficar atrás de uma [skill](./Skill.md) ou de um [ponteiro de contexto](./Context%20pointer.md); reserve o AGENTS.md para as linhas que valem em todo lugar.

_Uso:_

"Por que toda sessão já começa com 4 mil tokens queimados?"

"Confere o AGENTS.md — alguém colou o guia de estilo inteiro ali em vez de deixar atrás de uma skill."
