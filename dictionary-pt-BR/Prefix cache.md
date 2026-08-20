---
description: O armazenamento do lado do provedor que permite a requisições consecutivas pular o reprocessamento de um prefixo compartilhado.
---

O armazenamento do lado do [provedor](./Model%20provider.md) que permite a [requisições ao provedor de modelo](./Model%20provider%20request.md) consecutivas pular o reprocessamento de um prefixo compartilhado. Quando o começo de uma requisição bate com o começo de uma requisição recente — mesmo [prompt de sistema](./System%20prompt.md), mesmo histórico até certo ponto — o provedor reaproveita o trabalho anterior e cobra esses [tokens](./Token.md) como [tokens de cache](./Cache%20tokens.md), a uma taxa bem menor.

O cache compensa porque sessões crescem só por acréscimo. Toda requisição reenvia o histórico inteiro como [tokens de entrada](./Input%20tokens.md) (veja aquela entrada para o porquê), e numa [sessão](./Session.md) normal o histórico só muda no fim — cada requisição é a anterior mais algumas mensagens novas. O provedor processa o longo começo compartilhado uma vez, guarda o resultado e retoma de onde o prefixo termina. Sem o cache, uma sessão de 50 [turnos](./Turn.md) pagaria para reprocessar o turno um cinquenta vezes.

Caches também expiram. Quanto tempo uma entrada fica quente varia por provedor de modelo — tipicamente minutos, não horas. Deixe uma sessão parada além dessa janela e a próxima requisição reconstrói o prefixo a preço cheio uma vez, antes que o cache volte a valer. Isso é preocupação sobretudo de quem constrói [harness](./Harness.md); para você, o efeito visível é que requisições depois de uma pausa longa custam mais que as anteriores.

_Uso:_

"Por que a conta disparou na metade da sessão?"

"O harness começou a injetar a hora atual no prompt de sistema a cada turno. O cache de prefixo quebra no primeiro token alterado, então toda requisição depois disso foi cobrada a preço cheio."
