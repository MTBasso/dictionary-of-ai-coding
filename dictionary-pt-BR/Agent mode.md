---
description: Um preset que junta um modo de permissão a instruções de comportamento injetadas no prompt de sistema. Pode mudar no meio da sessão.
aliases:
  - modo plano
  - plan mode
  - aceitar edições
  - modo YOLO
---

Um preset que molda como o [agente](./Agent.md) opera em tempo de execução — junta um [modo de permissão](./Permission%20mode.md) a instruções de comportamento injetadas no [prompt de sistema](./System%20prompt.md). Exemplos: um padrão que pergunta em chamadas arriscadas, um **modo plano** que bloqueia edições e conduz o agente à pesquisa, um modo **aceitar edições** que aprova edições automaticamente, e um modo **ignorar permissões** (coloquialmente **modo YOLO**) que aprova tudo. Pode mudar no meio da [sessão](./Session.md).

O empacotamento é o que distingue um modo de um mero ajuste de permissão. Um modo de permissão é só um portão: decide quais [chamadas de ferramenta](./Tool%20call.md) passam. O portão sozinho produz um agente que quer editar e não consegue — ele propõe a escrita, é bloqueado e tenta outro caminho. As instruções injetadas removem a vontade: o modo plano não apenas bloqueia edições, ele diz ao agente que está numa fase de planejamento, então ele lê, pergunta e propõe em vez de forçar o portão. Portão e direção apontam para o mesmo lado.

Na prática, você muda de modo conforme sua confiança muda ao longo de uma tarefa. A mesma tarefa pode passar por vários modos: modo plano enquanto a abordagem ainda está sendo moldada, o padrão que pergunta nas primeiras edições delicadas, aceitar edições quando o agente mostrou que entendeu a mudança, e ignorar permissões para uma execução [AFK](./AFK.md) dentro de um [sandbox](./Sandbox.md). Mudar de modo não custa nada: a conversa continua exatamente de onde estava, com novas permissões e novas instruções. Se você se pegar aprovando todo pedido sem ler, o modo está mais apertado que sua confiança real; se você fica rejeitando edições, está mais frouxo.

_Termos de fornecedores:_ o Claude Code chama isso de "permission modes", o Codex de "approval modes" — ambos anteriores ao empacotamento de comportamento.

_Uso:_

"Ele fica editando arquivos quando eu só quero um plano."

"Muda para o modo plano — ele bloqueia escritas e fica na pesquisa."

"E para a execução AFK mais tarde?"

"Modo ignorar permissões, mas só dentro do sandbox."
