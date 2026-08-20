---
description: "Um agente revisando o trabalho de outro, muitas vezes com outro modelo ou prompt de sistema. Não-determinística: forma um julgamento."
aliases:
  - Revisão automatizada
---

Um [agente](./Agent.md) revisando o trabalho de outro agente, muitas vezes com outro [modelo](./Model.md) ou outro [prompt de sistema](./System%20prompt.md). É não-determinística: forma um julgamento. Roda em qualquer lugar — antes do merge num PR, depois do fato sobre o histórico de commits, no meio da sessão como um [subagente](./Subagent.md). Um LLM como juiz na CI é revisão automatizada, não [verificação automatizada](./Automated%20check.md); o que a asserção _faz_ decide a categoria, não onde ela roda.

A separação em relação ao agente que trabalhou é o que faz isso funcionar. Pedir ao agente que escreveu o código para revisar o próprio trabalho rende muito pouco — a [sessão](./Session.md) que produziu o bug também contém o raciocínio que o produziu, e o agente relê as próprias conclusões como confirmação. Um revisor com [janela de contexto](./Context%20window.md) nova não tem esse apego: ele vê o diff como um estranho veria, e é disso que a revisão depende. Um modelo diferente ou um prompt de sistema específico de revisão afia ainda mais isso — outros pontos cegos, e um prompt delimitado ao que você de fato quer olhar (segurança, contratos de API, desempenho) em vez de um vago "procure problemas".

Ela se encaixa entre as outras camadas de revisão. Verificações automatizadas são determinísticas e pegam o que dá para afirmar mecanicamente; a [revisão humana](./Human%20review.md) é cara e escala pior. A revisão automatizada fica no meio: pega problemas que exigem julgamento — um nome de função enganoso, um caso extremo esquecido — a custo de máquina. Como é não-determinística, pode deixar passar coisas e apontar não-problemas; trate-a como um filtro que levanta o piso antes de um humano olhar, não como um portão que substitui um.

_Evite:_ "revisão por IA" / "revisão do agente" — vagos demais para distinguir do próprio agente que trabalhou.

_Uso:_

"Estamos recebendo PRs ruins demais das execuções [AFK](./AFK.md)."

"Acrescenta uma etapa de revisão automatizada antes do merge — outro modelo, prompt de sistema separado, delimitado a segurança e mudanças de contrato."
