---
description: Um documento usado como mecanismo de transporte de um handoff — escrito por uma sessão para ser lido por outra.
aliases:
  - Artefato de handoff
---

Um documento usado como mecanismo de transporte de um [handoff](./Handoff.md) — escrito no [ambiente](./Environment.md) por uma [sessão](./Session.md) para ser lido por outra. [Especificações](./Spec.md), [tickets](./Ticket.md) e documentos de plano são todos artefatos de handoff.

A razão para escrever um: o [modelo](./Model.md) é [sem estado](./Stateless.md), então nada de uma sessão sobrevive a [limpá-la](./Clearing.md). Decisões, restrições, planos pela metade — tudo vai embora com o [contexto](./Context.md) que os guardava. O ambiente persiste. Escrever o estado importante num arquivo o move para um lugar de onde a próxima sessão pode lê-lo de volta.

O artefato é uma [fonte secundária](./Secondary%20source.md) — um relato do trabalho da sessão, não o trabalho em si. É isso que o torna pequeno o bastante para orientar uma sessão nova, e também o que o faz poder enganá-la: ele registra o que a sessão que escreveu acreditava, e tudo o que ela deixou de fora ou entendeu errado é invisível para quem lê. Onde uma afirmação importa, a próxima sessão deve verificá-la contra a [fonte primária](./Primary%20source.md) — o código, os testes — em vez de herdá-la.

Um bom artefato é escrito para ser lido por uma sessão com zero contexto. Caminhos de arquivo concretos, em vez de "o arquivo que a gente discutiu". O que foi decidido e por quê, para a próxima sessão não relitigar. O que está feito e o que falta. Ajuda dizer à sessão que escreve para onde o artefato vai: "escreva um documento de handoff para uma sessão nova que não sabe nada sobre este trabalho".

O mecanismo alternativo de transporte é a [compactação](./Compaction.md), que resume em memória. O artefato tem duas vantagens: mora em disco, onde você pode lê-lo e corrigi-lo antes que algo dependa dele, e pode ser reutilizado — a mesma especificação pode orientar cinco sessões em paralelo.

_Uso:_

"Como eu divido isso entre o [agente](./Agent.md) que planeja e o que implementa?"

"Faz o planejador escrever um artefato de handoff — caminhos de arquivo, decisões, restrições. A sessão do implementador abre com um ponteiro para o artefato e trabalha a partir dele."
