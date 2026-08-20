---
description: Uma execução delimitada de interação com um agente. Começa vazia, acumula e termina ao ser limpa, fechada ou compactada.
---

Uma execução delimitada de interação com um [agente](./Agent.md). Começa vazia, acumula mensagens, [resultados de ferramenta](./Tool%20result.md) e arquivos lidos, e termina quando é [limpa](./Clearing.md), fechada ou [compactada](./Compaction.md) numa sessão nova. A sessão é o que _preenche_ a [janela de contexto](./Context%20window.md): se a janela de contexto é a caixa, a sessão é o material que aos poucos a enche. Trabalho grande demais para uma única janela de contexto precisa ser dividido entre sessões.

O histórico de mensagens da sessão é a memória de trabalho do agente. O [modelo](./Model.md) é [sem estado](./Stateless.md), então tudo o que ele parece lembrar — o que você pediu, o que os testes disseram, o que ele decidiu três turnos atrás — está no histórico de mensagens, reenviado a cada [requisição ao provedor de modelo](./Model%20provider%20request.md). O que não está na sessão não existe para o agente.

Essa memória acaba com a sessão. Uma sessão nova começa do zero: o agente que conhecia bem sua base de código no fim da sessão de ontem não conhece nada dela hoje de manhã. O que sobrevive é o [sistema de arquivos](./Filesystem.md) — arquivos escritos durante uma sessão podem ser lidos pela seguinte, e é disso que [handoffs](./Handoff.md), [sistemas de memória](./Memory%20system.md) e [AGENTS.md](./AGENTS.md.md) dependem.

Você escolhe onde uma sessão termina. Tudo dentro de uma sessão influencia cada [turno](./Turn.md) posterior, então tarefas sem relação feitas numa mesma sessão deixam resíduo que tinge a resposta seguinte. Uma tarefa por sessão mantém o contexto relevante; terminar uma tarefa é um ponto natural para limpar.

_Uso:_

"Quanto tempo uma sessão aguenta antes de desandar?"

"Depende do trabalho — uma refatoração focada se mantém afiada por mais tempo que uma pesquisa aberta. Quando a sessão incha, faz o handoff ou compacta, não force."
