---
description: Um artefato de handoff que delimita uma sessão de trabalho. Existe sozinho ou pendurado numa especificação.
---

Um [artefato de handoff](./Handoff%20artifact.md) que delimita uma [sessão](./Session.md) de trabalho. Existe sozinho, ou pendurado numa [especificação](./Spec.md) como um de seus filhos. Tickets podem bloquear ou ser bloqueados por tickets irmãos, então a ordem do trabalho sai do grafo de dependências deles, e não de um plano linear.

A restrição que o define é o tamanho: uma sessão. Um ticket deve ser concluível antes de a sessão sair da [zona esperta](./Smart%20zone.md) — e essa restrição é testável. Se as sessões dos seus tickets degradam rotineiramente antes de o trabalho acabar, os tickets estão grandes demais; divida. Se cada sessão gasta a maior parte do [contexto](./Context.md) em preparação para depois fazer cinco minutos de trabalho, estão pequenos demais; junte.

Um bom ticket é escrito para quem lê sem nenhum outro contexto. O objetivo, os critérios de aceite e [ponteiros de contexto](./Context%20pointer.md) para os arquivos e decisões relevantes — o suficiente para a sessão começar a trabalhar sem rededuzir o que a anterior sabia.

O grafo de dependências também é o que destrava o paralelismo. Tickets independentes — as folhas do grafo — podem rodar cada um na própria sessão ao mesmo tempo. É uma forma eficaz de rodar vários agentes de uma vez.

_Uso:_

"Por onde eu começo na especificação da migração?"

"Olha o grafo de tickets — a mudança de schema bloqueia o backfill, o backfill bloqueia a troca da API. Escolhe uma folha e roda uma sessão nela."
