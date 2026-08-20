---
description: A coisa em si — código, transcrições, dados brutos. Completa e autoritativa, mas cara de carregar no contexto.
aliases:
  - Fonte primária
---

Uma fonte de verdade na forma original — o código, a transcrição da conversa, o log bruto, a resposta real da API. Não um relato da coisa; a coisa. Contraparte da [fonte secundária](./Secondary%20source.md).

Se você quer saber o que sua base de código faz, o código é a fonte primária. A documentação, o diagrama de arquitetura e o README são todos descrições dele — corretas quando escritas, e desde então cada uma no seu próprio calendário. Quando um [agente](./Agent.md) afirma com confiança algo errado sobre seu projeto, a pergunta é de qual fonte ele estava trabalhando: um agente que leu um documento herda a obsolescência do documento; um agente que leu o código está lendo a verdade atual.

O custo é o que impede fontes primárias de serem o padrão. Carregar uma na [janela de contexto](./Context%20window.md) é caro — o arquivo inteiro, a transcrição inteira, cada [token](./Token.md) cobrado como [entrada](./Input%20tokens.md) e competindo pelo [orçamento de atenção](./Attention%20budget.md). O que você recebe por esse custo é completude: nada foi pré-filtrado pelo julgamento de outra pessoa sobre o que importava. Um resumo escrito mês passado não pode conter o detalhe que acabou importando hoje; a fonte primária ainda contém.

Recorra à fonte primária quando a precisão importa — a assinatura exata, o erro real, a linha que lança a exceção. Boa parte de gerenciar [contexto](./Context.md) é decidir quando pagar pela fonte primária e quando uma fonte secundária basta.

_Uso:_

"O agente diz que a lógica de retentativa faz recuo exponencial, mas estou vendo ela martelar o endpoint."

"Ele tirou isso do documento de design. Aponta para o módulo de retentativa de verdade — trabalha da fonte primária quando o comportamento importa."
