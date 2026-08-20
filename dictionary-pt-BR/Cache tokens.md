---
description: Tokens de entrada que o provedor guardou em cache de uma requisição anterior, cobrados a uma taxa muito menor.
---

[Tokens de entrada](./Input%20tokens.md) que o [provedor](./Model%20provider.md) guardou em cache de uma [requisição ao provedor de modelo](./Model%20provider%20request.md) anterior, para não ter que reprocessá-los. Quando requisições consecutivas compartilham um prefixo, o provedor reaproveita o trabalho pelo [cache de prefixo](./Prefix%20cache.md) e cobra a parte em cache a uma taxa muito menor. É a alavanca que torna [sessões](./Session.md) longas viáveis — sem ela, todo [turno](./Turn.md) paga de novo pelo histórico inteiro.

A razão de isso importar está em como sessões são cobradas. O [modelo](./Model.md) é [sem estado](./Stateless.md), então cada requisição reenvia a conversa inteira — [prompt de sistema](./System%20prompt.md), cada mensagem, cada [resultado de ferramenta](./Tool%20result.md) — como tokens de entrada. No turno cinquenta, cada requisição carrega cinquenta turnos de histórico, e você pagaria a taxa cheia sobre tudo isso, toda vez. O cache muda a conta: tokens que o provedor já processou num prefixo idêntico são cobrados como tokens de cache, muitas vezes a um décimo da taxa de entrada ou menos. Numa sessão longa, a maior parte do que você envia são tokens de cache, e a conta se mantém sã.

Um exemplo mostra quando os tokens são guardados em cache e quando não são. Cada letra representa um bloco de conteúdo da conversa; cada requisição envia a conversa até ali:

| A requisição envia | Em cache | Cobrado a preço cheio | Por quê                                              |
| ------------------ | -------- | --------------------- | ---------------------------------------------------- |
| `AB`               | nada     | `AB`                  | Primeira requisição — não há com o que casar         |
| `ABC`              | `AB`     | `C`                   | `AB` é prefixo exato da requisição anterior          |
| `ABCD`             | `ABC`    | `D`                   | Prefixo ainda intacto                                |
| `AXCD`             | `A`      | `XCD`                 | Uma edição trocou `B` por `X`; o casamento falha ali |

O cache é frágil de um jeito específico: ele casa prefixos exatos. Se qualquer coisa mudar mais cedo na conversa — o [harness](./Harness.md) reordena conteúdo, um timestamp é atualizado, a representação de um arquivo muda — o cache erra dali em diante e tudo depois disso é cobrado à taxa cheia de entrada. Caches também expiram após alguns minutos de inatividade, então uma sessão retomada depois de uma pausa longa paga o histórico de novo, uma vez. Quando o custo de uma sessão salta sem causa óbvia, compare tokens de cache com tokens de entrada no relatório de uso — um cache quebrado aparece ali primeiro.

_Uso:_

"O custo em sessões longas está brutal — quarenta reais numa refatoração."

"Confere os tokens de cache. Se o harness estiver reordenando o prompt de sistema ou os arquivos entre turnos, o prefixo quebra e você paga a taxa cheia de entrada em toda requisição."
