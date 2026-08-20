---
description: Uma menção num documento que aponta para outro, para o agente puxá-lo ao contexto só quando a tarefa pedir.
aliases:
  - Ponteiro de contexto
---

Uma menção num documento que aponta para outro, para que o [agente](./Agent.md) possa puxá-lo para a [janela de contexto](./Context%20window.md) só quando a tarefa pedir. É a unidade com que a [revelação progressiva](./Progressive%20disclosure.md) é construída.

A razão de usar um ponteiro, em vez de embutir o conteúdo, é o custo. Um ponteiro é uma linha na janela de contexto. O documento por trás dele pode ter milhares de [tokens](./Token.md), mas esses tokens não custam nada até o agente de fato seguir o ponteiro. Embuta um manual de 2.000 tokens no [AGENTS.md](./AGENTS.md.md) e toda [sessão](./Session.md) paga por ele; troque por "processo de deploy: veja `internal/deploy.md`" e só as sessões que fazem deploy vão carregá-lo. O agente segue o ponteiro com uma [chamada de ferramenta](./Tool%20call.md) quando a tarefa combina.

Um ponteiro precisa de duas partes para funcionar: um caminho estável e descrição suficiente para o agente saber quando vale a pena segui-lo. Um caminho solto é um ponteiro que o agente não tem motivo para seguir; "veja `internal/deploy.md`", sem pista do que tem dentro, é ignorado por uma sessão que precisava dele. Escreva a linha de modo que ela case com a forma como as tarefas aparecem: "release, deploy ou rollback — leia `internal/deploy.md` primeiro".

Ponteiros estão em todo lugar quando você repara: linhas no AGENTS.md, descrições de [skill](./Skill.md) (o harness carrega a descrição; o corpo da skill espera atrás dela), nomes de arquivo numa listagem de diretório, links entre documentos.

Um ponteiro também pode ligar uma [fonte secundária](./Secondary%20source.md) de volta à [fonte primária](./Primary%20source.md) de que ela derivou — o resumo de compactação que nomeia a transcrição original, o documento que nomeia o arquivo-fonte que descreve. Isso torna recuperável a perda da fonte secundária: quando o resumo não basta, o agente segue o ponteiro e lê o original, em vez de trabalhar com o que o resumo guardou.

_Evite:_ "referência" — seco demais; não transmite que segui-lo traz mais contexto para dentro. "Portal" — floreado demais.

_Uso:_

"O AGENTS.md está ficando enorme."

"A maior parte dele deveria ser ponteiro de contexto, não conteúdo. Mantém inline as regras que valem sempre; transforma o manual de deploy e o guia de estilo em skills e deixa um ponteiro de contexto no lugar."
