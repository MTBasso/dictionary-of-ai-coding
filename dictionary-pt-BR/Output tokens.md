---
description: Tokens que o modelo gera de volta. Cobrados a uma taxa maior que a dos tokens de entrada, pois custam mais computação.
---

[Tokens](./Token.md) que o [modelo](./Model.md) gera de volta. São cobrados a uma taxa maior que a dos [tokens de entrada](./Input%20tokens.md) — comumente cerca de cinco vezes a taxa — porque custam mais computação para produzir.

Tudo o que o modelo escreve conta: o texto que você lê, o código que ele emite, as [chamadas de ferramenta](./Tool%20call.md) e qualquer raciocínio estendido que ele faça antes de responder. Esse último pega as pessoas de surpresa — tokens de raciocínio são cobrados como saída mesmo quando o [harness](./Harness.md) não os mostra a você, e aumentar o [esforço](./Effort.md) gasta mais deles.

Tokens de saída também ditam o ritmo de uma [sessão](./Session.md). O modelo lê a entrada rápido, mas gera a saída um token por vez, então quando um [turno](./Turn.md) parece lento é quase sempre a saída sendo escrita, não a entrada sendo lida. Uma espera longa em geral significa que vem uma resposta longa.

_Uso:_

"A sessão de refatoração está torrando crédito mesmo com entradas pequenas."

"O agente está reescrevendo arquivos inteiros em vez de aplicar patches. Token de saída custa umas cinco vezes a taxa de entrada — faz ele emitir edições e a conta cai."
