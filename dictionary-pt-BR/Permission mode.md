---
description: A fatia de controle de permissões de um modo de agente — quais chamadas pedem aprovação e quais rodam automaticamente.
---

A fatia de controle de permissões de um [modo de agente](./Agent%20mode.md) — quais [chamadas de ferramenta](./Tool%20call.md) disparam um [pedido de permissão](./Permission%20request.md) e quais rodam automaticamente. Era o propósito original dos sistemas de modo, antes de os [harnesses](./Harness.md) passarem a empacotar instruções de comportamento por cima.

Harnesses trazem uma escada desses modos:

| Modo                     | Leituras   | Escritas e shell             | Uso típico                                           |
| ------------------------ | ---------- | ---------------------------- | ---------------------------------------------------- |
| Somente leitura / plano  | Automático | Bloqueadas                   | Pesquisa, planejamento, revisão                      |
| Padrão                   | Automático | Perguntam                    | Trabalho supervisionado do dia a dia                 |
| Edição automática        | Automático | Edições auto, shell pergunta | Repositórios confiáveis, mudanças mecânicas          |
| "Yolo" / totalmente auto | Automático | Automáticas                  | [Sandboxes](./Sandbox.md), execuções [AFK](./AFK.md) |

Escolher um degrau é uma troca entre segurança e interrupção, e os dois modos de falha são sentidos. Apertado demais e você vira o gargalo: o [agente](./Agent.md) para a cada poucos segundos por leituras inofensivas, você clica em aprovar no piloto automático, e as aprovações deixam de significar alguma coisa — carimbar tudo é o pior dos dois mundos, toda a interrupção sem nenhuma proteção. Frouxo demais e o agente edita arquivos e roda comandos que você gostaria de ter visto antes.

A ponta frouxa é mais defensável dentro de um sandbox, onde o raio de dano de uma [chamada](./Tool.md) ruim fica contido. Fora de um, a maioria das pessoas se acomoda em aprovar leituras automaticamente e manter um [humano no laço](./Human-in-the-loop.md) para qualquer coisa irreversível.

_Uso:_

"Ele parava em todo grep — matou completamente a execução AFK."

"Afrouxa o modo de permissão para ferramentas somente leitura e mantém o pedido em escritas e shell. A maioria dos pedidos de permissão numa [sessão](./Session.md) de pesquisa é ruído."
